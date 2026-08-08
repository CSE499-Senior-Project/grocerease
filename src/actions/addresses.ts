'use server';

import { revalidatePath } from "next/cache";
import { AddressSchema, type AddressData } from "@/types/address";
import { createClient } from "@/utils/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// Postgres unique_violation. Can surface here if two requests race to become
// the default address at the same time; the partial unique index is the
// real backstop, this just turns the raw DB error into something readable.
const UNIQUE_VIOLATION = '23505';

function friendlyAddressError(error: { code?: string; message: string }): string {
  if (error.code === UNIQUE_VIOLATION) {
    return "Something changed at the same time. Please try again.";
  }
  return error.message;
}

async function unsetOtherDefaults(supabase: SupabaseClient, userId: string, excludeId?: string) {
  let query = supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  await query;
}

async function promoteNextDefault(supabase: SupabaseClient, userId: string, excludeId?: string) {
  let query = supabase
    .from('addresses')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query.maybeSingle();

  if (!data) {
    return {};
  }

  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', data.id);
  return { error };
}

export async function createAddress(data: AddressData) {
  const parsed = AddressSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not signed in." };
    }

    const { count } = await supabase
      .from('addresses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const isFirstAddress = !count;
    const shouldBeDefault = isFirstAddress || parsed.data.is_default;

    if (shouldBeDefault && !isFirstAddress) {
      await unsetOtherDefaults(supabase, user.id);
    }

    const { error } = await supabase.from('addresses').insert({
      user_id: user.id,
      full_name: parsed.data.full_name,
      address_1: parsed.data.address_1,
      address_2: parsed.data.address_2 || null,
      city: parsed.data.city,
      state: parsed.data.state,
      zip_code: parsed.data.zip_code,
      is_default: shouldBeDefault,
    });

    if (error) {
      return { error: friendlyAddressError(error) };
    }
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/account/address');
  return { success: true };
}

export async function updateAddress(id: string, data: AddressData) {
  const parsed = AddressSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not signed in." };
    }

    const { data: existing } = await supabase
      .from('addresses')
      .select('is_default')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return { error: "Address not found." };
    }

    let finalIsDefault = parsed.data.is_default;

    if (finalIsDefault) {
      await unsetOtherDefaults(supabase, user.id, id);
    } else if (existing.is_default) {
      // Unsetting the current default: promote another address, or keep
      // this one default if it's the only address the user has.
      const { data: nextDefault } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', user.id)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (nextDefault) {
        await supabase.from('addresses').update({ is_default: true }).eq('id', nextDefault.id);
      } else {
        finalIsDefault = true;
      }
    }

    const { error } = await supabase
      .from('addresses')
      .update({
        full_name: parsed.data.full_name,
        address_1: parsed.data.address_1,
        address_2: parsed.data.address_2 || null,
        city: parsed.data.city,
        state: parsed.data.state,
        zip_code: parsed.data.zip_code,
        is_default: finalIsDefault,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: friendlyAddressError(error) };
    }
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/account/address');
  return { success: true };
}

export async function deleteAddress(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not signed in." };
    }

    const { data: existing } = await supabase
      .from('addresses')
      .select('is_default')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return { error: "Address not found." };
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }

    if (existing.is_default) {
      const { error: promoteError } = await promoteNextDefault(supabase, user.id, id);
      if (promoteError) {
        revalidatePath('/account/address');
        return {
          success: true,
          warning: "Address deleted, but we couldn't automatically set a new default. Please choose one from your address list.",
        };
      }
    }
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/account/address');
  return { success: true };
}
