import Footer from "@/components/Footer";
import AppHeader from "@/components/layout/AppHeader";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      {children}

      <Footer />
    </>
  );
}