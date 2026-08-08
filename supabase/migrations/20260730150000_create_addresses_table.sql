CREATE TABLE public.addresses (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  address_1 text NOT NULL,
  address_2 text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);
ALTER TABLE public.addresses ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enforces at most one default address per user at the database level.
CREATE UNIQUE INDEX addresses_one_default_per_user ON public.addresses (user_id) WHERE (is_default = true);

GRANT ALL ON public.addresses TO anon;
GRANT ALL ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;

CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING ((auth.uid() = user_id));

ALTER TABLE public.profiles DROP COLUMN delivery_address;
