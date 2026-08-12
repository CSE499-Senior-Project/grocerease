import Link from "next/link";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "#categories" },
    { label: "Special Offers", href: "/products?filter=sale" },
  ],
  Company: [
    { label: "About GrocerEase", href: "/about" },
    { label: "For Merchants", href: "#merchants" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Delivery Information", href: "/delivery" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

/**
 * Renders the main footer for the application.
 * It includes organized links for shopping, company information, and support,
 * as well as a brief description of the service and copyright information.
 */
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-brand-primary"
            >
              GrocerEase
            </Link>

            <p className="mt-4 max-w-md leading-7 text-slate-600">
              A modern grocery shopping platform that helps customers order
              from trusted local stores and receive convenient delivery.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
                Fresh products
              </span>

              <span className="rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
                Local stores
              </span>

              <span className="rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-dark">
                Easy delivery
              </span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h2 className="font-bold text-slate-900">{section}</h2>

              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-600 transition-colors hover:text-brand-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} GrocerEase. All rights reserved.
          </p>

          <p>Fresh groceries delivered with ease.</p>
        </div>
      </div>
    </footer>
  );
}