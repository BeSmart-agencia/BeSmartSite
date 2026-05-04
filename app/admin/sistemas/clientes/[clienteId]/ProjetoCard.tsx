"use client";

import Link from "next/link";

type Projeto = {
  id: string;
  nome: string;
  descricao: string | null;
  status: string;
  data_inicio: string | null;
  prazo_entrega: string | null;
  valor_total: number | null;
  forma_pagamento: string | null;
};

function statusClass(s: string) {
  const map: Record<string, string> = {
    "Em diagnóstico": "status-diagnostico",
    "Proposta enviada": "status-proposta",
    "Aprovado": "status-aprovado",
    "Em desenvolvimento": "status-desenvolvimento",
    "Entregue": "status-entregue",
    "Pausado": "status-pausado",
    "Cancelado": "status-cancelado",
  };
  return `status-badge ${map[s] ?? "status-diagnostico"}`;
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function fmt(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR");
}

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProjetoCard({ projeto: p, clienteId }: { projeto: Projeto; clienteId: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {p.nome}
          </h3>
          {p.descricao && (
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
              {p.descricao}
            </p>
          )}
        </div>
        <span className={statusClass(p.status)}>{p.status}</span>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs mb-4" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
        {p.data_inicio && <span>Início: {fmt(p.data_inicio)}</span>}
        {p.prazo_entrega && <span>Prazo: {fmt(p.prazo_entrega)}</span>}
        {p.valor_total && <span className="font-semibold" style={{ color: "#4ADE80" }}>{money(p.valor_total)}</span>}
        {p.forma_pagamento && <span>{p.forma_pagamento}</span>}
      </div>

      <Link
        href={`/admin/sistemas/clientes/${clienteId}/projeto/${p.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white"
        style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}
      >
        Abrir projeto <ArrowRightIcon />
      </Link>
    </div>
  );
}
