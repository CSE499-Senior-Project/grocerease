import { cache } from "react";
import { redirect } from "next/navigation";
import type { Profile } from "@/types/profile";
import { createClient } from "@/utils/supabase/server";

/**
 * Fetches the profile for the currently authenticated user.
 * This function is wrapped in `cache` to memoize the result per request.
 * It ensures that a user is signed in and has a profile record.
 * If the user is not authenticated or the profile does not exist, it redirects to the sign-in page.
 * @returns {Promise<Profile>} A promise that resolves to the user's profile.
 */
export const getAuthenticatedProfile = cache(async (): Promise<Profile> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) {
    redirect("/signin");
  }

  return profile;
});

/**
 * Fetches the profile for the currently authenticated user, if one exists.
 * This function is wrapped in `cache` to memoize the result per request.
 * It does not require authentication and will return `null` if the user is not signed in
 * or if a profile record is not found, without causing a redirect.
 * @returns {Promise<Profile | null>} A promise that resolves to the user's profile or null.
 */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return profile || null;
});