// components/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaPlus, FaUsers} from "react-icons/fa"; // Gaya Font Awesome

const menu = [
  { icon: <FaHome size={20} />, label: "Dashboard", href: "/" },
  { icon: <FaPlus size={20} />, label: "Input", href: "/input" },
  { icon: <FaUsers size={20} />, label: "Pengunjung", href: "/data" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t shadow flex justify-around">
      {menu.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center justify-center py-2 text-xs ${
            pathname === item.href ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
