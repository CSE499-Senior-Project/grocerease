import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserAddresses } from "@/lib/addresses";
import EditAddressClient from "./edit-address-client";

/**
 * Metadata for the Edit Address page.
 */
export const metadata: Metadata = {
  title: "Edit Address",
};

/**
 * Defines the expected props for the EditAddressPage component,
 * specifically the dynamic `id` parameter from the URL.
 */
type EditAddressPageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * The server component for the "Edit Address" page.
 * It fetches all user addresses, finds the specific one matching the ID from the URL,
 * and passes it to a client component for editing.
 * @param {EditAddressPageProps} props - The component props, containing the route parameters.
 */
export default async function EditAddressPage({ params }: EditAddressPageProps) {
  // Resolve the dynamic 'id' from the URL parameters.
  const { id } = await params;
  // Fetch all addresses for the current user.
  const addresses = await getUserAddresses();
  // Find the specific address that matches the provided ID.
  const address = addresses.find((candidate) => candidate.id === id);

  // If no address is found for the given ID, render a 404 page.
  if (!address) {
    notFound();
  }

  // Render the client component, passing the found address as a prop.
  return <EditAddressClient address={address} />;
}