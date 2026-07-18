const benefits = [
  {
    title: "Fresh local products",
    description:
      "Shop quality groceries from trusted local stores and neighborhood suppliers.",
    icon: "🥬",
  },
  {
    title: "Fast and flexible delivery",
    description:
      "Choose a convenient delivery window that fits your daily schedule.",
    icon: "🚚",
  },
  {
    title: "Simple online ordering",
    description:
      "Browse, add items to your cart, and complete checkout in just a few steps.",
    icon: "🛒",
  },
  {
    title: "Support local stores",
    description:
      "Help independent grocery stores grow without relying on expensive third-party platforms.",
    icon: "🏪",
  },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="bg-surface-background py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
            Why choose GrocerEase
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Grocery shopping made easier for everyone
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            GrocerEase connects customers with local stores through a simple,
            reliable, and convenient shopping experience.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-primary hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-3xl">
                <span aria-hidden="true">{benefit.icon}</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {benefit.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}