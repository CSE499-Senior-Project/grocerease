import AppHeader from "@/components/layout/AppHeader";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
