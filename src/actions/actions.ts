'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type SignInData, type SignUpData } from "@/types/profile";
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