-- 1. Insert Categories
INSERT INTO categories (name, slug) VALUES
  ('Fresh Produce', 'fresh-produce'),
  ('Dairy & Eggs', 'dairy-eggs'),
  ('Meat & Seafood', 'meat-seafood'),
  ('Bakery', 'bakery'),
  ('Pantry & Dry Goods', 'pantry-dry-goods'),
  ('Household & Cleaning', 'household-cleaning');

-- 2. Insert Products (using subqueries to grab the correct category_id)
INSERT INTO products (category_id, name, price, unit, description, image_url) VALUES
  
  -- FRESH PRODUCE
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Honeycrisp Apples', 1.99, 'lb', 'Crisp, sweet, and juicy apples.', 'https://placehold.co/400x400/png?text=Apple'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Organic Bananas', 0.59, 'lb', 'Fair trade organic bananas.', 'https://placehold.co/400x400/png?text=Banana'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Hass Avocados', 1.25, 'ea', 'Perfect for guacamole or toast.', 'https://placehold.co/400x400/png?text=Avocado'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Strawberries', 3.49, '16 oz', 'Freshly picked sweet strawberries.', 'https://placehold.co/400x400/png?text=Strawberry'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Baby Spinach', 2.99, '5 oz', 'Pre-washed and ready to eat.', 'https://placehold.co/400x400/png?text=Spinach'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Red Bell Peppers', 1.48, 'ea', 'Crunchy and sweet bell peppers.', 'https://placehold.co/400x400/png?text=Pepper'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Seedless Green Grapes', 4.98, '2 lbs', 'Plump and sweet green grapes.', 'https://placehold.co/400x400/png?text=Grapes'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Russet Potatoes', 3.99, '5 lb Bag', 'Great for baking or mashing.', 'https://placehold.co/400x400/png?text=Potato'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Whole Carrots', 1.28, '1 lb Bag', 'Crunchy carrots, rich in vitamin A.', 'https://placehold.co/400x400/png?text=Carrot'),
  ((SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Fresh Lemons', 0.68, 'ea', 'Bright and tart lemons.', 'https://placehold.co/400x400/png?text=Lemon'),

  -- DAIRY & EGGS
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Whole Milk', 3.48, '1 Gallon', 'Vitamin D fortified whole milk.', 'https://placehold.co/400x400/png?text=Milk'),
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Large Grade A Eggs', 4.48, '1 Dozen', 'Farm fresh large white eggs.', 'https://placehold.co/400x400/png?text=Eggs'),
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Unsalted Butter', 3.98, '16 oz', 'Sweet cream unsalted butter.', 'https://placehold.co/400x400/png?text=Butter'),
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Sharp Cheddar Cheese Block', 2.48, '8 oz', 'Aged sharp cheddar cheese.', 'https://placehold.co/400x400/png?text=Cheddar'),
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Shredded Mozzarella Cheese', 2.98, '8 oz', 'Low moisture part-skim mozzarella.', 'https://placehold.co/400x400/png?text=Mozzarella'),
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Plain Greek Yogurt', 4.98, '32 oz', 'Thick and creamy non-fat Greek yogurt.', 'https://placehold.co/400x400/png?text=Yogurt'),
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Cream Cheese', 1.98, '8 oz', 'Original soft cream cheese.', 'https://placehold.co/400x400/png?text=Cream+Cheese'),
  ((SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Almond Milk, Unsweetened', 2.98, 'Half Gallon', 'Dairy-free almond milk alternative.', 'https://placehold.co/400x400/png?text=Almond+Milk'),

  -- MEAT & SEAFOOD
  ((SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Lean Ground Beef 80/20', 5.98, '1 lb', '80% lean ground beef chuck.', 'https://placehold.co/400x400/png?text=Ground+Beef'),
  ((SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Boneless Skinless Chicken Breasts', 7.48, '1.5 lbs', 'Value pack chicken breasts.', 'https://placehold.co/400x400/png?text=Chicken'),
  ((SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Thick-Cut Bacon', 5.48, '16 oz', 'Hickory smoked thick cut bacon.', 'https://placehold.co/400x400/png?text=Bacon'),
  ((SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Atlantic Salmon Fillets', 9.98, '1 lb', 'Farm-raised fresh salmon.', 'https://placehold.co/400x400/png?text=Salmon'),
  ((SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Pork Chops, Bone-In', 6.48, '1.5 lbs', 'Center cut bone-in pork chops.', 'https://placehold.co/400x400/png?text=Pork+Chops'),
  ((SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Large Raw Shrimp', 8.98, '16 oz', 'Peeled and deveined tail-on shrimp.', 'https://placehold.co/400x400/png?text=Shrimp'),
  ((SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Deli Sliced Turkey Breast', 4.98, '8 oz', 'Oven roasted deli turkey breast.', 'https://placehold.co/400x400/png?text=Turkey'),

  -- BAKERY
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'Sliced White Bread', 1.48, 'Loaf', 'Classic soft white sandwich bread.', 'https://placehold.co/400x400/png?text=White+Bread'),
  ((SELECT id FROM categories WHERE slug = 'bakery'), '100% Whole Wheat Bread', 1.98, 'Loaf', 'Healthy and hearty whole wheat bread.', 'https://placehold.co/400x400/png?text=Wheat+Bread'),
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'Plain Bagels', 2.48, '6 Count', 'Pre-sliced plain bagels.', 'https://placehold.co/400x400/png?text=Bagels'),
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'Hamburger Buns', 1.88, '8 Count', 'Classic enriched hamburger buns.', 'https://placehold.co/400x400/png?text=Buns'),
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'Butter Croissants', 3.98, '4 Count', 'Flaky, buttery bakery croissants.', 'https://placehold.co/400x400/png?text=Croissants'),
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'Flour Tortillas', 2.18, '10 Count', 'Soft taco size flour tortillas.', 'https://placehold.co/400x400/png?text=Tortillas'),

  -- PANTRY & DRY GOODS
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'Extra Virgin Olive Oil', 6.98, '16 oz', 'Cold extracted extra virgin olive oil.', 'https://placehold.co/400x400/png?text=Olive+Oil'),
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'All-Purpose Flour', 2.38, '5 lbs', 'Enriched bleached all-purpose flour.', 'https://placehold.co/400x400/png?text=Flour'),
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'Granulated Sugar', 2.88, '4 lbs', 'Pure cane granulated sugar.', 'https://placehold.co/400x400/png?text=Sugar'),
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'Spaghetti Pasta', 1.18, '16 oz', 'Enriched macaroni spaghetti.', 'https://placehold.co/400x400/png?text=Spaghetti'),
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'Tomato Pasta Sauce', 1.98, '24 oz', 'Traditional tomato and basil pasta sauce.', 'https://placehold.co/400x400/png?text=Pasta+Sauce'),
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'Creamy Peanut Butter', 2.48, '16 oz', 'Smooth and creamy roasted peanut butter.', 'https://placehold.co/400x400/png?text=Peanut+Butter'),
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'Long Grain White Rice', 2.98, '32 oz', 'Enriched long grain white rice.', 'https://placehold.co/400x400/png?text=Rice'),
  ((SELECT id FROM categories WHERE slug = 'pantry-dry-goods'), 'Chicken Broth', 1.78, '32 oz', '100% natural chicken broth.', 'https://placehold.co/400x400/png?text=Broth'),

  -- HOUSEHOLD & CLEANING
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Paper Towels', 7.98, '6-Pack', 'Absorbent 2-ply paper towels.', 'https://placehold.co/400x400/png?text=Paper+Towels'),
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Bath Tissue', 10.98, '12-Pack', 'Soft and strong toilet paper.', 'https://placehold.co/400x400/png?text=Bath+Tissue'),
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Liquid Laundry Detergent', 11.98, '64 oz', 'Fresh scent concentrated laundry detergent.', 'https://placehold.co/400x400/png?text=Detergent'),
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Multi-Surface Antibacterial Spray', 3.48, '32 oz', 'Kills 99.9% of bacteria and viruses.', 'https://placehold.co/400x400/png?text=Cleaning+Spray'),
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Disinfecting Wipes', 4.98, '75 Count', 'Lemon scent disinfecting wipes.', 'https://placehold.co/400x400/png?text=Wipes'),
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Liquid Dish Soap', 2.98, '16 oz', 'Grease fighting dish soap.', 'https://placehold.co/400x400/png?text=Dish+Soap'),
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Tall Kitchen Trash Bags', 6.48, '40 Count', '13 gallon flex-strength trash bags.', 'https://placehold.co/400x400/png?text=Trash+Bags'),
  ((SELECT id FROM categories WHERE slug = 'household-cleaning'), 'Glass & Window Cleaner', 2.98, '32 oz', 'Streak-free shine glass cleaner.', 'https://placehold.co/400x400/png?text=Glass+Cleaner');