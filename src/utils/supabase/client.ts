import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Creates a Supabase client for client-side operations.
 * This function should be used within Client Components to interact with Supabase,
 * for tasks like real-time subscriptions or user interactions that don't use Server Actions.
 */
export function createClient() {
  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
}