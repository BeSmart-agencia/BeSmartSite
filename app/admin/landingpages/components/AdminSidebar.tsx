"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/auth";

function LayoutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>; }
function LinkIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function SwitchIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>; }
function LogOutIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>; }

const GROUPS = [
  {
    label: "Painel",
    items: [
      { href: "/admin/landingpages", label: "Dashboard", icon: <LayoutIcon />, exact: true },
      { href: "/admin/landingpages/clientes", label: "Lista de Páginas", icon: <LinkIcon /> },
      { href: "/admin/landingpages/clientes/novo", label: "Nova Página", icon: <PlusIcon /> },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="admin-sidebar">
      <div className="p-5 border-b border-white/5">
        <Image src="/logo.png" alt="BeSmart" width={120} height={38} className="object-contain h-8 w-auto" />
        <p className="mt-2 text-xs" style={{ color: "#374151", fontFamily: "var(--font-inter), sans-serif" }}>
          Landing Pages
        </p>
        <Link
          href="/admin/sistemas"
          className="mt-3 inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white"
          style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}
        >
          <SwitchIcon />
          Sistemas Sob Medida
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto flex flex-col gap-5">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#374151", fontFamily: "var(--font-inter), sans-serif", letterSpacing: "0.12em" }}
            >
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ href, label, icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={`admin-sidebar-link ${isActive(href, exact) ? "active" : ""}`}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/5">
        <form action={logout}>
          <button type="submit" className="admin-sidebar-link w-full text-left" style={{ cursor: "pointer" }}>
            <LogOutIcon />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
