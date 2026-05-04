"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

const items = [
  { href: "/admin/sistemas", label: "Início", icon: <HomeIcon /> },
  { href: "/admin/sistemas/novo-cliente", label: "Novo", icon: <PlusIcon /> },
  { href: "/admin/sistemas/clientes", label: "Clientes", icon: <UsersIcon /> },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-bottom-nav">
      {items.map(({ href, label, icon }) => {
        const active = href === "/admin/sistemas"
          ? pathname === "/admin/sistemas"
          : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`admin-bottom-nav-item ${active ? "active" : ""}`}
          >
            {icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
