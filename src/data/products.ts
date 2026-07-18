import type { Product } from "@/types/product";

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Fresh Red Apples",
    price: 4.99,
    image: "/images/products/apples.jpg",
    category: "Fresh Produce",
    unit: "1 kg",
    inStock: true,
  },
  {
    id: 2,
    name: "Whole Fresh Milk",
    price: 2.49,
    image: "/images/products/milk.jpg",
    category: "Dairy & Eggs",
    unit: "1 litre",
    inStock: true,
  },
  {
    id: 3,
    name: "Whole Wheat Bread",
    price: 3.5,
    image: "/images/products/bread.jpg",
    category: "Bakery",
    unit: "1 loaf",
    inStock: true,
  },
  {
    id: 4,
    name: "Chicken Breast",
    price: 7.99,
    image: "/images/products/chicken.jpg",
    category: "Meat & Seafood",
    unit: "1 kg",
    inStock: true,
  },
];