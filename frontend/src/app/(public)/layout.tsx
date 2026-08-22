import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlobalSettingsProvider } from "@/context/GlobalSettingsContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalSettingsProvider>
      <div className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </GlobalSettingsProvider>
  );
}
