// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Aplikasi dashboard pribadi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex bg-gray-100 min-h-screen">
        {/* Sidebar hanya tampil di md dan lebih */}
        <Sidebar />

        {/* Konten utama */}
        <main className="flex-1 md:ml-4 pb-16 md:pb-0 p-4">{children}</main>

        {/* Bottom Navigation hanya tampil di mobile */}
        <BottomNav />
      </body>
    </html>
  );
}
