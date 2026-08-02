import type { Metadata } from "next";
import ComingSoon from "@/app/ui/account/coming-soon";

export const metadata: Metadata = {
  title: "Wallet",
};

export default function WalletPage() {
  return <ComingSoon title="Wallet" />;
}
