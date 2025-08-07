"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaPlus, FaUsers, FaSignOutAlt } from "react-icons/fa"; // Tambah icon logout
import { supabase } from "@/lib/supabase";

const menu = [
  { icon: <FaHome size={20} />, label: "Dashboard", href: "/" },
  { icon: <FaPlus size={20} />, label: "Input", href: "/input" },
  { icon: <FaUsers size={20} />, label: "Pengunjung", href: "/data" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-800 border-t shadow flex justify-around">
      {menu.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center justify-center py-2 text-xs ${
            pathname === item.href
              ? "text-blue-600"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center py-2 text-xs text-red-600"
      >
        <FaSignOutAlt size={20} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
