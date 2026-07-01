import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function ArrowRightIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function LinkIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function ClockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
function CheckCircleIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>; }

function statusInfo(status: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    rascunho: { label: "Rascunho", color: "#9CA3AF", bg: "rgba(107,114,128,0.12)" },
    aguardando_pagamento: { label: "Aguardando pagamento", color: "#FCD34D", bg: "rgba(251,191,36,0.12)" },
    publicada: { label: "Publicada", color: "#4ADE80", bg: "rgba(34,197,94,0.12)" },
  };
  return map[status] ?? map.rascunho;
}

export default async function LandingPagesDashboard() {
  const { data: paginas } = await supabase
    .from("landing_pages")
    .select("id, nome_cliente, empresa, slug, plano, status, created_at")
    .order("created_at", { ascending: false });

  const lista = paginas ?? [];
  const total = lista.length;
  const publicadas = lista.filter((p) => p.status === "publicada").length;
  const aguardando = lista.filter((p) => p.status === "aguardando_pagamento").length;

  const stats = [
    { label: "Páginas Cadastradas", value: total, icon: <LinkIcon />, color: "#9B6BB5" },
    { label: "Aguardando Pagamento", value: aguardando, icon: <ClockIcon />, color: "#FCD34D" },
    { label: "Publicadas", value: publicadas, icon: <CheckCircleIcon />, color: "#4ADE80" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Landing Pages</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Dashboard
          </h1>
        </div>
        <Link href="/admin/landingpages/clientes/novo" className="btn-primary self-start" style={{ fontSize: "14px", padding: "10px 20px" }}>
          <PlusIcon /> Nova Página
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <span style={{ color }}>{icon}</span>
            </div>
            <div className="font-bold mb-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color, fontSize: "32px" }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Páginas Recentes
          </h2>
          <Link href="/admin/landingpages/clientes" className="text-xs flex items-center gap-1 transition-colors hover:text-white" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            Ver todas <ArrowRightIcon />
          </Link>
        </div>
        {lista.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm mb-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhuma página cadastrada ainda.</p>
            <Link href="/admin/landingpages/clientes/novo" className="btn-primary" style={{ fontSize: "13px", padding: "10px 20px" }}>
              <PlusIcon /> Cadastrar primeira página
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              <thead>
                <tr className="border-b border-white/5">
                  {["Cliente", "Slug", "Plano", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#4B5563" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lista.slice(0, 8).map((p) => {
                  const s = statusInfo(p.status);
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5 text-sm font-medium text-white">{p.empresa || p.nome_cliente}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: "#9CA3AF" }}>/{p.slug}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: "#9CA3AF" }}>
                        {p.plano === "dominio_proprio" ? "Domínio próprio" : "Subdomínio"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link href={`/admin/landingpages/clientes/${p.id}`} className="text-xs flex items-center gap-1 justify-end transition-colors hover:text-white" style={{ color: "#9B6BB5" }}>
                          Ver <ArrowRightIcon />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
