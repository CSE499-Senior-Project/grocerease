import { Suspense } from "react";

import Benefits from "@/components/Benefits";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />

      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      <Benefits />
    </>
  );
}