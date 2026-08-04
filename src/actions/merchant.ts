'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  if (!orderId || !status) {
    return { error: "Invalid order data." };
  }

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
}