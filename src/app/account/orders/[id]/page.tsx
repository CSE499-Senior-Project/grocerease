import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCustomerOrderById } from "@/lib/order";
import PageTitle from "@/app/ui/account/page-title";

export const metadata: Metadata = {
  title: "Order Details",
};

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getCustomerOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <>
      <PageTitle
        action={
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Link>
        }
      >
        Order #{order.id.slice(-12)}
      </PageTitle>

      <p className="mb-8 text-sm text-slate-500">{formatDate(order.created_at)}</p>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
        <div className="space-y-4">
          {order.order_items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-24">
                <Image
                  src={item.products?.image_url ?? "/images/products/placeholder.webp"}
                  alt={item.products?.name ?? "Product"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {item.products?.name ?? "Product unavailable"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {item.products?.unit} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-brand-primary">
                    ${(item.price_at_time * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="self-start rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Service fee</span>
              <span>${order.service_fee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taxes</span>
              <span>${order.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
