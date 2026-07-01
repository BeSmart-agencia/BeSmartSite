"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>; }
function LinkIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function PlusIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }

const items = [
  { href: "/admin/landingpages", label: "Início", icon: <HomeIcon />, exact: true },
  { href: "/admin/landingpages/clientes", label: "Páginas", icon: <LinkIcon /> },
  { href: "/admin/landingpages/clientes/novo", label: "Nova", icon: <PlusIcon /> },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="admin-bottom-nav">
      {items.map(({ href, label, icon, exact }) => (
        <Link key={href} href={href} className={`admin-bottom-nav-item ${isActive(href, exact) ? "active" : ""}`}>
          {icon}
          {label}
        </Link>
      ))}
    </nav>
  );
}
