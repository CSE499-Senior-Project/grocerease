import { cache } from "react";
import { redirect } from "next/navigation";
import type { Address } from "@/types/address";
import { createClient } from "@/utils/supabase/server";

/**
 * Fetches all addresses for the currently authenticated user.
 * This function is wrapped in `cache` to memoize the result per request.
 * It ensures a user is signed in before fetching and orders the addresses
 * to prioritize the default address.
 * @returns {Promise<Address[]>} A promise that resolves to an array of the user's addresses.
 */
export const getUserAddresses = cache(async (): Promise<Address[]> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })
    .returns<Address[]>();

  if (error) {
    throw new Error(error.message);
  }

  return addresses ?? [];
});
