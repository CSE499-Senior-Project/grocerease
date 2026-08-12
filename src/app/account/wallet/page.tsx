import type { Metadata } from "next";
import ComingSoon from "@/app/ui/account/coming-soon";

/**
 * Metadata for the "Wallet" page.
 */
export const metadata: Metadata = {
  title: "Wallet",
};

/**
 * The server component for the "Wallet" page.
 * It currently displays a "Coming Soon" message as a placeholder for future functionality.
 */
export default function WalletPage() {
  return <ComingSoon title="Wallet" />;
}
