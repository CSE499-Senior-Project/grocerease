import type { Metadata } from "next";
import OrderCard from "@/app/ui/merchant/order-card";
import DetailRow from "@/app/ui/account/detail-row";
import PageTitle from "@/app/ui/account/page-title";

export const metadata: Metadata = {
  title: "Orders & Purchases",
};

export default function OrdersPage() {
  return (
    <>
      <PageTitle>
        Order Queue
      </PageTitle>
      
      <OrderCard>
        <DetailRow label="Email" value="Email" />
      </OrderCard>
    </>
  );
}
