'use server';

import { revalidatePath } from "next/cache";
import { AddressSchema, type AddressData } from "@/types/address";
import { createClient } from "@/utils/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Postgres error code for a unique violation.
 * This can occur if two requests race to set a default address simultaneously.
 * The partial unique index in the database is the ultimate safeguard.
 */
const UNIQUE_VIOLATION = '23505';

/**
 * Converts a raw Supabase/Postgres error into a more user-friendly message.
 * @param error - The database error object.
 * @returns A user-friendly error string.
 */
function friendlyAddressError(error: { code?: string; message: string }): string {
  if (error.code === UNIQUE_VIOLATION) {
    return "Something changed at the same time. Please try again.";
  }
  return error.message;
}
/**
 * Sets the `is_default` flag to false for all other addresses of a user.
 * @param supabase - The Supabase client instance.
 * @param userId - The ID of the user.
 * @param excludeId - An optional address ID to exclude from the update (e.g., the one being set as default).
 */
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

/**
 * Promotes the most recently created address to be the new default.
 * @param supabase - The Supabase client instance.
 * @param userId - The ID of the user.
 * @param excludeId - An optional address ID to exclude from consideration (e.g., one that was just deleted).
 */
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

/**
 * Creates a new address for the currently signed-in user.
 * @param data - The address data to be created.
 * @returns An object with a `success` flag or an `error` message.
 */
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

    // Check how many addresses the user already has.
    const { count } = await supabase
      .from('addresses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // If this is the user's first address, it must be the default.
    const isFirstAddress = !count;
    const shouldBeDefault = isFirstAddress || parsed.data.is_default;

    // If this new address is set to be the default, unset any other existing defaults.
    if (shouldBeDefault && !isFirstAddress) {
      await unsetOtherDefaults(supabase, user.id);
    }

    // Insert the new address into the database.
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

/**
 * Updates an existing address for the currently signed-in user.
 * @param id - The ID of the address to update.
 * @param data - The new address data.
 * @returns An object with a `success` flag or an `error` message.
 */
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

    // Fetch the existing address to check its current `is_default` status.
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

    // If the updated address is being set as the default...
    if (finalIsDefault) {
      // ...unset the default flag on all other addresses.
      await unsetOtherDefaults(supabase, user.id, id);
    } else if (existing.is_default) {
      // If we are unsetting the current default address...
      // ...try to promote another address to be the new default.
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
        // If there are no other addresses, this one must remain the default.
        finalIsDefault = true;
      }
    }

    // Perform the update operation.
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

/**
 * Deletes an address for the currently signed-in user.
 * @param id - The ID of the address to delete.
 * @returns An object with a `success` flag, an `error` message, or a `warning`.
 */
export async function deleteAddress(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not signed in." };
    }

    // Fetch the address to see if it's the current default before deleting.
    const { data: existing } = await supabase
      .from('addresses')
      .select('is_default')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return { error: "Address not found." };
    }

    // Delete the address.
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }

    // If the deleted address was the default, promote another one.
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
