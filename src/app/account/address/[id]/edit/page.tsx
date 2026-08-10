import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserAddresses } from "@/lib/addresses";
import EditAddressClient from "./edit-address-client";

export const metadata: Metadata = {
  title: "Edit Address",
};

type EditAddressPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { id } = await params;
  const addresses = await getUserAddresses();
  const address = addresses.find((candidate) => candidate.id === id);

  if (!address) {
    notFound();
  }

  return <EditAddressClient address={address} />;
}