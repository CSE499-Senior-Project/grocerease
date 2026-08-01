import { cache } from "react";
import { redirect } from "next/navigation";
import type { Address } from "@/types/address";
import { createClient } from "@/utils/supabase/server";

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
