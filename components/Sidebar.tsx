"use client";

import { useState } from "react";
import SidebarLink from "./SidebarLink";
import { FiMenu, FiHome, FiEdit, FiList } from "react-icons/fi";
import clsx from "clsx";

const links = [
  { href: "/", label: "Dashboard", icon: <FiHome /> },
  { href: "/input", label: "Input Data", icon: <FiEdit /> },
  { href: "/data", label: "Data Pengunjung", icon: <FiList /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Topbar untuk mobile */}
      <div className="md:hidden flex items-center px-4 py-3 bg-gray-800 text-white">
        <button onClick={() => setOpen(!open)} className="text-2xl">
          <FiMenu />
        </button>
      </div>

      {/* Sidebar utama */}
      <aside
        className={clsx(
          "fixed z-20 md:static top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-700 hidden md:block">
          Pangkas Anugrah
        </div>
        <nav className="flex flex-col mt-4">
          {links.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              onClick={() => setOpen(false)} // Tutup saat di mobile
            />
          ))}
        </nav>
      </aside>

      {/* Overlay untuk mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
