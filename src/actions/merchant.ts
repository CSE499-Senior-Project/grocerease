'use server';

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Not signed in." };
    }

    const { error } = await supabase
      .from("orders")
      .update({ 
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    return { error: "An unexpected error occurred while updating the order." };
  }

  revalidatePath("/merchant/orders");
  revalidatePath("/account/orders");

  return { succes: true };
}