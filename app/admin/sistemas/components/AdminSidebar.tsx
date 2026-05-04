"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/auth";

function LayoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const links = [
  { href: "/admin/sistemas", label: "Dashboard", icon: <LayoutIcon /> },
  { href: "/admin/sistemas/novo-cliente", label: "Novo Cliente", icon: <PlusIcon /> },
  { href: "/admin/sistemas/clientes", label: "Clientes", icon: <UsersIcon /> },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="p-5 border-b border-white/5">
        <Image src="/logo.png" alt="BeSmart" width={120} height={38} className="object-contain h-8 w-auto" />
        <p className="mt-2 text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
          Painel · Sistemas Sob Medida
        </p>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {links.map(({ href, label, icon }) => {
          const active = href === "/admin/sistemas"
            ? pathname === "/admin/sistemas"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`admin-sidebar-link ${active ? "active" : ""}`}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <form action={logout}>
          <button
            type="submit"
            className="admin-sidebar-link w-full text-left"
            style={{ cursor: "pointer" }}
          >
            <LogOutIcon />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
