/**
 * The primary layout for the main application routes (e.g., home, products, account).
 * This layout wraps the core content of the application that is accessible to all users.
 * @param children - The child pages or layouts to be rendered within this layout.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This fragment simply renders the children, but it could be expanded
    // to include a shared header, footer, or navigation for the main app.
    <>{children}</>
  );
}