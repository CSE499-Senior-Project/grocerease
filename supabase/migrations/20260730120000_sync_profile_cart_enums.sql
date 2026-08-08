-- Reconstructed from live schema introspection (information_schema + pg_catalog) on 2026-07-30.
-- These changes were already applied directly against the production database outside the
-- tracked migration history (no corresponding entry exists in supabase_migrations.schema_migrations
-- prior to this file), so supabase/migrations did not reflect reality. This file documents them.
--
-- If DB-password or service-role access becomes available, prefer running `supabase db pull`
-- and replacing this file with the CLI-generated one: exact original DDL (statement order,
-- constraint names) could not be recovered from introspection alone, only the resulting shape.

CREATE TYPE public.roles AS ENUM ('customer', 'merchant', 'admin');
CREATE TYPE public.contact_method AS ENUM ('phoneNumber', 'email');
CREATE TYPE public.order_status AS ENUM ('pending', 'shopping', 'out for delivery', 'delivered');

ALTER TABLE public.profiles
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE public.roles USING role::public.roles,
  ALTER COLUMN role SET DEFAULT 'customer'::public.roles,
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN first_name SET NOT NULL,
  ALTER COLUMN last_name SET NOT NULL;

ALTER TABLE public.orders
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE public.order_status USING status::public.order_status,
  ALTER COLUMN status SET DEFAULT 'pending'::public.order_status,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.profiles
  ADD COLUMN email text NOT NULL,
  ADD COLUMN phone_number text,
  ADD COLUMN preferred_contact_method public.contact_method NOT NULL DEFAULT 'email'::public.contact_method;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);

CREATE TABLE public.carts (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ADD CONSTRAINT carts_pkey PRIMARY KEY (id);
ALTER TABLE public.carts ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.carts ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);
GRANT ALL ON public.carts TO anon;
GRANT ALL ON public.carts TO authenticated;
GRANT ALL ON public.carts TO service_role;
CREATE POLICY "Users can manage own cart" ON public.carts FOR ALL USING ((auth.uid() = user_id));

CREATE TABLE public.cart_items (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  cart_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer DEFAULT 1 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
GRANT ALL ON public.cart_items TO anon;
GRANT ALL ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING ((cart_id IN ( SELECT carts.id
   FROM public.carts
  WHERE (carts.user_id = auth.uid()))));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    new.id,
    -- FIRST NAME LOGIC
    coalesce(
      new.raw_user_meta_data->>'given_name', -- 1. Try Google's native first name
      new.raw_user_meta_data->>'first_name', -- 2. Try your custom signup first name
      split_part(new.raw_user_meta_data->>'full_name', ' ', 1) -- 3. Fallback: First word
    ),
    -- LAST NAME LOGIC
    coalesce(
      new.raw_user_meta_data->>'family_name', -- 1. Try Google's native last name
      new.raw_user_meta_data->>'last_name',   -- 2. Try your custom signup last name
      reverse(split_part(reverse(new.raw_user_meta_data->>'full_name'), ' ', 1)) -- 3. Fallback: Last word
    ),
    new.email
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
