'use server';

import { redirect } from "next/navigation";
import { type LoginData, type RegistrationData } from "@/types/profile";
import { createClient } from "@/utils/supabase/server";

export async function registerUser(data: RegistrationData) {
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
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  redirect('/login?registered=true');
}

export async function loginUser(data: LoginData) {
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

  redirect('/'); // once the user profile page is up, redirect to that page.
}