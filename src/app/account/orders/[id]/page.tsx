import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomerOrderById } from "@/lib/order";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";

export const metadata: Metadata = {
  title: "Order Details",
};

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getCustomerOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <>
      <PageTitle>Order #{order.id.slice(-12)}</PageTitle>

      <AccountCard className="p-6 text-center">
        <p className="text-slate-600">Order details coming soon.</p>
      </AccountCard>
    </>
  );
}
