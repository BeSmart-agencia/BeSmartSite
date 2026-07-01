import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function statusInfo(status: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    rascunho: { label: "Rascunho", color: "#9CA3AF", bg: "rgba(107,114,128,0.12)" },
    aguardando_pagamento: { label: "Aguardando pagamento", color: "#FCD34D", bg: "rgba(251,191,36,0.12)" },
    publicada: { label: "Publicada", color: "#4ADE80", bg: "rgba(34,197,94,0.12)" },
  };
  return map[status] ?? map.rascunho;
}

export default async function LandingPagesClientesPage() {
  const { data: paginas } = await supabase
    .from("landing_pages")
    .select("id, nome_cliente, empresa, slug, plano, status, created_at")
    .order("created_at", { ascending: false });

  const lista = paginas ?? [];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-1">Landing Pages</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Páginas
          </h1>
        </div>
        <Link href="/admin/landingpages/clientes/novo" className="btn-primary" style={{ fontSize: "13px", padding: "10px 18px" }}>
          <PlusIcon />
          Nova
        </Link>
      </div>

      {!lista.length ? (
        <div className="glass rounded-2xl p-16 text-center">
          <p className="text-sm mb-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            Nenhuma página cadastrada.
          </p>
          <Link href="/admin/landingpages/clientes/novo" className="btn-primary" style={{ fontSize: "13px", padding: "10px 20px" }}>
            <PlusIcon /> Cadastrar primeira página
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {lista.map((p) => {
            const s = statusInfo(p.status);
            return (
              <Link
                key={p.id}
                href={`/admin/landingpages/clientes/${p.id}`}
                className="glass rounded-2xl p-5 flex flex-col gap-3 hover:border-purple-500/20 transition-all group"
                style={{ textDecoration: "none" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      {p.empresa || p.nome_cliente}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
                      {p.nome_cliente}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </div>

                <p className="text-xs font-mono" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                  /{p.slug} · {p.plano === "dominio_proprio" ? "domínio próprio" : "subdomínio"}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <p className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </p>
                  <span className="text-xs flex items-center gap-1" style={{ color: "#9B6BB5" }}>
                    Ver página <ArrowRightIcon />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
