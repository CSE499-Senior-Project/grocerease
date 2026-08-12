/**
 * The layout for the main product catalog section (`/products`).
 * This component wraps the product listing and product detail pages.
 * @param children - The child page or layout to be rendered within this layout.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This fragment simply renders the children. It could be expanded later
    // to include elements common to all product-related pages.
    <>{children}</>
  );
}