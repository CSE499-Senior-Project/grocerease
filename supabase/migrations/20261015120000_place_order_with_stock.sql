  -- Places an order atomically: creates the order, its items, and decrements product stock
-- in a single transaction. If any step fails (e.g. insufficient stock), everything rolls back.
CREATE OR REPLACE FUNCTION public.place_order(
  p_subtotal numeric,
  p_service_fee numeric,
  p_tax_amount numeric,
  p_total_amount numeric,
  p_delivery_time_slot text,
  p_delivery_address text,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_item record;
  v_price numeric(10,2);
  v_subtotal numeric(10,2) := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to place an order.';
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Your cart is empty.';
  END IF;

  INSERT INTO orders (user_id, subtotal, service_fee, tax_amount, total_amount, delivery_time_slot, delivery_address)
  VALUES (v_user_id, p_subtotal, p_service_fee, p_tax_amount, p_total_amount, p_delivery_time_slot, p_delivery_address)
  RETURNING id INTO v_order_id;

  -- Merge duplicate products and process them in a fixed order to avoid deadlocks
  -- between concurrent checkouts.
  FOR v_item IN
    SELECT (item->>'product_id')::uuid AS product_id, SUM((item->>'quantity')::int) AS quantity
    FROM jsonb_array_elements(p_items) AS item
    GROUP BY 1
    ORDER BY 1
  LOOP
    IF v_item.product_id IS NULL OR v_item.quantity IS NULL OR v_item.quantity <= 0 THEN
      RAISE EXCEPTION 'Invalid item in order.';
    END IF;

    -- Conditional update locks the row, so stock can never go negative.
    UPDATE products
       SET stock_quantity = stock_quantity - v_item.quantity
     WHERE id = v_item.product_id
       AND is_active
       AND stock_quantity >= v_item.quantity
    RETURNING price INTO v_price;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Not enough stock for "%".',
        COALESCE((SELECT name FROM products WHERE id = v_item.product_id), 'an item');
    END IF;

    -- Use the current database price, not the one sent by the browser.
    INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
    VALUES (v_order_id, v_item.product_id, v_item.quantity, v_price);

    v_subtotal := v_subtotal + v_price * v_item.quantity;
  END LOOP;

  IF abs(v_subtotal - p_subtotal) > 0.01 THEN
    RAISE EXCEPTION 'Some prices have changed. Please review your cart and try again.';
  END IF;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(numeric, numeric, numeric, numeric, text, text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order(numeric, numeric, numeric, numeric, text, text, jsonb) TO authenticated;
