import { Suspense } from "react";

import Benefits from "@/components/Benefits";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";
import Hero from "@/components/Hero";

/**
 * The main home page of the application.
 * It assembles several marketing and e-commerce components to create the landing page experience.
 */
export default function Home() {
  return (
    <>
      {/* The main hero section at the top of the page. */}
      <Hero />
      {/* A section to display product categories. */}
      <Categories />

      {/* The Suspense boundary allows the rest of the page to render immediately
          while the FeaturedProducts component (which likely fetches data) is loading.
          The FeaturedProductsSkeleton is shown as a placeholder. */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* A section highlighting the benefits of the service. */}
      <Benefits />
    </>
  );
}