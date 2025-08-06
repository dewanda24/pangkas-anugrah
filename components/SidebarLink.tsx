"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ReactNode } from "react";

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function SidebarLink({
  href,
  icon,
  label,
  onClick,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <div
        onClick={onClick}
        className={clsx(
          "flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200 cursor-pointer",
          isActive && "bg-gray-700 font-semibold"
        )}
      >
        <span className="text-xl mr-3">{icon}</span>
        <span className="text-base">{label}</span>
      </div>
    </Link>
  );
}
