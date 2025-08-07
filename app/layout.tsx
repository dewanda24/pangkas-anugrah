"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showLayout, setShowLayout] = useState(false);

  useEffect(() => {
    // Hanya tampilkan Sidebar & BottomNav di luar halaman login
    setShowLayout(!pathname.startsWith("/auth/login"));
  }, [pathname]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {showLayout ? (
          <div className="flex min-h-screen">
            {/* Sidebar di kiri */}
            <Sidebar />

            {/* Konten utama */}
            <div className="flex-1 flex flex-col">
              <main className="flex-1 p-4 overflow-y-auto">{children}</main>
              <BottomNav />
            </div>
          </div>
        ) : (
          // Kalau halaman login, tampilkan langsung konten
          <div>{children}</div>
        )}
      </body>
    </html>
  );
}
