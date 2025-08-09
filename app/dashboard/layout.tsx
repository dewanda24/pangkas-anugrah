"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt size={18} />,
    },
    {
      name: "Input Data",
      path: "/dashboard/pelanggan/input",
      icon: <FaPlusCircle size={18} />,
    },
    {
      name: "Data Pelanggan",
      path: "/dashboard/pelanggan",
      icon: <FaUsers size={18} />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <aside
        className="hidden md:flex md:flex-col w-60 bg-gray-200 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 p-4
             fixed top-0 left-0 h-full z-40"
      >
        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Pangkas Anugrah
        </h2>
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-200 ${
                pathname === item.path
                  ? "bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 px-3 py-2 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors duration-200"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:ml-60">{children}</main>

      {/* Bottom Navbar Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-800 flex justify-around py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center px-2 py-1 rounded text-sm ${
              pathname === item.path
                ? "bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center px-2 py-1 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded"
        >
          <FaSignOutAlt size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
