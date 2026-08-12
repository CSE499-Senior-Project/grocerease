'use server';

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

/**
 * Updates the status of a specific order.
 * This action is intended for merchants.
 * @param orderId - The ID of the order to update.
 * @param status - The new status for the order.
 * @returns An object with a `success` flag or an `error` message.
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Not signed in." };
    }

    // Update the order in the database with the new status and timestamp.
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

  // Revalidate paths to ensure the UI reflects the updated order status.
  revalidatePath("/merchant/orders");
  revalidatePath("/account/orders");

  // I've also corrected the typo from 'succes' to 'success' here.
  return { success: true };
}