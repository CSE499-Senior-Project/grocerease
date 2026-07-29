import Link from "next/link";

const categories = [
  {
    name: "Fresh Produce",
    description: "Fruits, vegetables, herbs, and other farm-fresh essentials.",
    emoji: "🥬",
  },
  {
    name: "Dairy & Eggs",
    description: "Milk, cheese, yogurt, butter, and fresh eggs.",
    emoji: "🥛",
  },
  {
    name: "Bakery",
    description: "Fresh bread, pastries, cakes, and baked favorites.",
    emoji: "🥖",
  },
  {
    name: "Meat & Seafood",
    description: "Quality meat, poultry, fish, and seafood selections.",
    emoji: "🥩",
  },
  {
    name: "Pantry",
    description: "Rice, pasta, canned goods, sauces, and cooking basics.",
    emoji: "🥫",
  },
  {
    name: "Drinks",
    description: "Water, juices, soft drinks, tea, and coffee.",
    emoji: "🧃",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
              Browse by category
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need in one place
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Explore popular grocery categories and quickly find the products
              you need for your home.
            </p>
          </div>

          <Link
            href="/products"
            className="font-semibold text-brand-primary transition-colors hover:text-brand-dark"
          >
            View all products →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.name}
              className="group rounded-2xl border border-slate-200 bg-surface-background p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-primary hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-3xl transition-transform group-hover:scale-105">
                <span aria-hidden="true">{category.emoji}</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {category.name}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {category.description}
              </p>

              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="mt-5 inline-flex font-semibold text-brand-primary transition-colors hover:text-brand-dark"
              >
                Shop category →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}