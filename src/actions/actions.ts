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
import { 
  type ProductData,
  type EditProductData,
  EditProductSchema,
} from "@/types/merchant-products";
import { createClient } from "@/utils/supabase/server";
import { CheckoutData, CheckoutSchema } from "@/types/order";

/**
 * Signs up a new user.
 * @param data - The user's sign-up information (first name, last name, email, password).
 * @returns An object with an `error` message on failure. Redirects on success.
 */
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

    // Sign out the user immediately after signup to enforce email verification.
    await supabase.auth.signOut();
  }
  catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/', 'layout');
  redirect('/signin?signup=true');
}

/**
 * Signs in a user with their email and password.
 * @param data - The user's sign-in credentials.
 * @returns An object with an `error` message on failure. Redirects on success.
 */
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

/**
 * Signs out the currently authenticated user.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/signin');
}

/**
 * Updates the profile information for the currently signed-in user.
 * @param data - The profile data to update.
 * @returns An object with a `success` flag or an `error` message.
 */
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

/**
 * Changes the password for the currently signed-in user.
 * @param data - The current and new password data.
 * @returns An object with a `success` flag or an `error` message.
 */
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

    // Verify the current password by attempting to sign in with it.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: parsed.data.current_password,
    });

    if (verifyError) {
      return { error: "Current password is incorrect.", field: "current_password" as const };
    }

    // If verification is successful, update the user's password.
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

/**
 * Adds a new product to the catalog.
 * @param data - The data for the new product.
 * @returns An object with a `success` flag or an `error` message.
 */
export async function addProduct(data: ProductData) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .insert({
        category_id: data.category_id || null,
        name: data.name,
        description: data.description || null,
        price: data.price,
        unit: data.unit,
        image_url: data.image_url || null,
        stock_quantity: data.stock_quantity,
        is_active: data.is_active
      });

    if (error) {
      return { error: error.message };
    }

  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/merchant/product-catalog');
  revalidatePath('/products');
  revalidatePath('/');

  return { success: true };
}

/**
 * Edits an existing product in the catalog.
 * @param data - The updated data for the product, including its ID.
 * @returns An object with a `success` flag or an `error` message.
 */
export async function editProduct(data: EditProductData) {
  const parsed = EditProductSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .update({
        category_id: parsed.data.category_id || null,
        name: parsed.data.name,
        description: parsed.data.description || null,
        price: parsed.data.price,
        unit: parsed.data.unit,
        image_url: parsed.data.image_url || null,
        stock_quantity: parsed.data.stock_quantity,
        is_active: parsed.data.is_active
      })
      .eq('id', parsed.data.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/merchant/product-catalog');
    revalidatePath('/products');
    revalidatePath(`/products/${parsed.data.id}`);
    revalidatePath('/');

    return { success: true };

  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Places a new order for the currently signed-in user.
 * @param data - The checkout data, including items and totals.
 * @returns An object with a `success` flag or an `error` message.
 */
export async function placeOrder(data: CheckoutData) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be signed in to place an order." };
    }

    const payloadWithUser = { ...data, user_id: user.id };

    const parsed = CheckoutSchema.safeParse(payloadWithUser);

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }

    // Insert the main order record.
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: parsed.data.user_id,
        subtotal: parsed.data.subtotal,
        service_fee: parsed.data.service_fee,
        tax_amount: parsed.data.tax_amount,
        total_amount: parsed.data.total_amount,
        delivery_time_slot: parsed.data.delivery_time_slot,
        delivery_address: parsed.data.delivery_address
      })
      .select('id')
      .single();

    if (orderError || !newOrder) {
      return { error: orderError?.message || "Failed to create order." };
    }

    // Prepare the individual order items for insertion.
    const orderItems = parsed.data.items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time
    }));

    // Insert all order items.
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      return { error: itemsError.message };
    }

  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath('/merchant/orders');
  revalidatePath('/account/orders');

  return { success: true };
}