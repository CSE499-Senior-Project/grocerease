'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  type SignInData,
  type SignUpData,
  type ProfileUpdateData,
  type ChangePasswordData,
  ProfileUpdateSchema,
  ChangePasswordSchema,
} from "@/types/profile";
import { type AddProductData } from "@/types/merchant-products";
import { createClient } from "@/utils/supabase/server";

export async function signupUser(data: SignUpData) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      }
    });

    if (error) {
      return { error: error.message };
    }

    await supabase.auth.signOut();
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/', 'layout');
  redirect('/signin?signup=true');
}

export async function signinUser(data: SignInData) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      return { error: error.message };
    }
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/', 'layout');
  redirect('/'); // once the user profile page is up, redirect to that page.
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/signin');
}

export async function updateProfile(data: ProfileUpdateData) {
  const parsed = ProfileUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not signed in." };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        phone_number: parsed.data.phone_number || null,
        preferred_contact_method: parsed.data.preferred_contact_method,
      })
      .eq('id', user.id);

    if (error) {
      return { error: error.message };
    }
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function changePassword(data: ChangePasswordData) {
  const parsed = ChangePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return { error: "Not signed in." };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: parsed.data.current_password,
    });

    if (verifyError) {
      return { error: "Current password is incorrect.", field: "current_password" as const };
    }

    const { error } = await supabase.auth.updateUser({ password: parsed.data.new_password });

    if (error) {
      return { error: error.message };
    }
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  return { success: true };
}

export async function addProduct(data: AddProductData) {
  // const imageFile = data.imageFile;

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .insert({
        category_id: data.category_id,
        name: data.name,
        description: data.description,
        price: data.price,
        unit: data.unit,
        image_url: data.image_url,
        stock_quantity: data.stock_quantity,
        is_active: data.is_active
      });

    if (error) {
      return { error: error.message };
    }

  } catch (error) {
    return { error: "An unexpected error occurred. Please try again."};
  }

  revalidatePath('/merchant/product-catalog');
  revalidatePath('/products');
  revalidatePath('/');

  return { success: true };
}