import { Suspense } from "react";

import Benefits from "@/components/Benefits";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Categories />

        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>

        <Benefits />
      </main>

      <Footer />
    </>
  );
}