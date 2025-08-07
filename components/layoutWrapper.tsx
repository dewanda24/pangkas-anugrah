"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 md:ml-4 pb-16 md:pb-0 p-4">{children}</main>
      {!isAuthPage && <BottomNav />}
    </>
  );
}
