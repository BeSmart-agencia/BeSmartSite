"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/auth";

function LayoutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>; }
function PipelineIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg>; }
function UsersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function DollarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>; }
function CalendarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }
function TicketIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" /></svg>; }
function BookIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>; }
function LogOutIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>; }
function SwitchIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>; }

const GROUPS = [
  {
    label: "Painel",
    items: [
      { href: "/admin/sistemas", label: "Dashboard", icon: <LayoutIcon />, exact: true },
      { href: "/admin/sistemas/pipeline", label: "Pipeline", icon: <PipelineIcon /> },
    ],
  },
  {
    label: "Clientes",
    items: [
      { href: "/admin/sistemas/clientes", label: "Lista de Clientes", icon: <UsersIcon /> },
      { href: "/admin/sistemas/novo-cliente", label: "Novo Cliente", icon: <PlusIcon /> },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/admin/sistemas/financeiro", label: "Visão Geral", icon: <DollarIcon />, exact: true },
      { href: "/admin/sistemas/financeiro/mensalidades", label: "Mensalidades", icon: <CalendarIcon /> },
    ],
  },
  {
    label: "Suporte",
    items: [
      { href: "/admin/sistemas/chamados", label: "Chamados", icon: <TicketIcon /> },
    ],
  },
  {
    label: "Referência",
    items: [
      { href: "/admin/sistemas/referencia", label: "Processo & Preços", icon: <BookIcon /> },
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
          Sistemas Sob Medida
        </p>
        <Link
          href="/admin/landingpages"
          className="mt-3 inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white"
          style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}
        >
          <SwitchIcon />
          Landing Pages
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
