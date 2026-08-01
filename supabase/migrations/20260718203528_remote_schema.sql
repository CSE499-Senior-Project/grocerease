CREATE TABLE public.categories (id uuid DEFAULT gen_random_uuid() NOT NULL, name text NOT NULL, slug text NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()));
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE public.categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
GRANT ALL ON public.categories TO anon;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE TABLE public.order_items (id uuid DEFAULT gen_random_uuid() NOT NULL, order_id uuid, product_id uuid, quantity integer NOT NULL, price_at_time numeric(10,2) NOT NULL);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
GRANT ALL ON public.order_items TO anon;
GRANT ALL ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
CREATE TABLE public.orders (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid, status text DEFAULT 'pending'::text, subtotal numeric(10,2) NOT NULL, service_fee numeric(10,2) NOT NULL, total_amount numeric(10,2) NOT NULL, delivery_time_slot text NOT NULL, delivery_address text NOT NULL, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()));
CREATE POLICY "Users can insert their own order items" ON public.order_items FOR INSERT WITH CHECK ((order_id IN ( SELECT orders.id
   FROM public.orders
  WHERE (orders.user_id = auth.uid()))));
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING ((order_id IN ( SELECT orders.id
   FROM public.orders
  WHERE (orders.user_id = auth.uid()))));
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
ALTER TABLE public.order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
GRANT ALL ON public.orders TO anon;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING ((auth.uid() = user_id));
CREATE TABLE public.products (id uuid DEFAULT gen_random_uuid() NOT NULL, category_id uuid, name text NOT NULL, description text, price numeric(10,2) NOT NULL, unit text NOT NULL, image_url text, stock_quantity integer DEFAULT 100, is_active boolean DEFAULT true, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()));
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE public.order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
GRANT ALL ON public.products TO anon;
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE TABLE public.profiles (id uuid NOT NULL, first_name text, last_name text, role text DEFAULT 'customer'::text, delivery_address text, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()));
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));
