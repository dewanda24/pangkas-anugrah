// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaHome, FaPlus, FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const menu = [
    { icon: <FaHome />, label: "Dashboard", href: "/" },
    { icon: <FaPlus />, label: "Input Data", href: "/input" },
    { icon: <FaUsers />, label: "Data Pengunjung", href: "/data" },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 bg-gray-900 text-white p-4">
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 ${
                pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-md dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800 mt-6 cursor-default"
      >
        <FaSignOutAlt size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
}
