"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { atualizarStatusProjeto } from "@/app/admin/sistemas/actions";

type Projeto = {
  id: string;
  nome: string;
  status: string;
  valor_total: number | null;
  prazo_entrega: string | null;
  cliente_id: string;
  clientes: { empresa: string; nome: string } | { empresa: string; nome: string }[] | null;
};

export type PropostaEnviada = {
  id: string;
  cliente_id: string;
  status: string;
  created_at: string;
  conteudo: Record<string, unknown> | null;
  clientes: { empresa: string; nome: string } | { empresa: string; nome: string }[] | null;
};

const COLUNAS = [
  { status: "Em diagnóstico", short: "Diagnóstico", color: "#9CA3AF", border: "rgba(107,114,128,0.25)", bg: "rgba(107,114,128,0.06)" },
  { status: "Proposta enviada", short: "Proposta", color: "#FCD34D", border: "rgba(251,191,36,0.25)", bg: "rgba(251,191,36,0.05)" },
  { status: "Aprovado", short: "Aprovado", color: "#2E9BAF", border: "rgba(46,155,175,0.25)", bg: "rgba(46,155,175,0.06)" },
  { status: "Em desenvolvimento", short: "Em Dev.", color: "#9B6BB5", border: "rgba(155,107,181,0.25)", bg: "rgba(155,107,181,0.06)" },
  { status: "Entregue", short: "Entregue", color: "#4ADE80", border: "rgba(34,197,94,0.25)", bg: "rgba(34,197,94,0.06)" },
  { status: "Cancelado", short: "Cancelado", color: "#F87171", border: "rgba(239,68,68,0.2)", bg: "rgba(239,68,68,0.05)" },
];

const NEXT_STATUS: Record<string, string[]> = {
  "Em diagnóstico": ["Proposta enviada", "Cancelado"],
  "Proposta enviada": ["Aprovado", "Em diagnóstico", "Cancelado"],
  "Aprovado": ["Em desenvolvimento", "Cancelado"],
  "Em desenvolvimento": ["Entregue", "Aprovado"],
  "Entregue": ["Em desenvolvimento"],
  "Cancelado": ["Em diagnóstico"],
};

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmt(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function ArrowRightIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }

function PropostaCard({ proposta }: { proposta: PropostaEnviada }) {
  const empresa = (Array.isArray(proposta.clientes) ? proposta.clientes[0]?.empresa : proposta.clientes?.empresa) ?? "—";
  const nomeSistema = proposta.conteudo?.nome_sistema as string | undefined;
  const F = "var(--font-inter), sans-serif";
  return (
    <div
      className="rounded-xl p-3.5 flex flex-col gap-2 transition-all hover:translate-y-[-1px]"
      style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.15)" }}
    >
      <Link
        href={`/admin/sistemas/clientes/${proposta.cliente_id}`}
        className="font-semibold text-sm leading-tight text-white hover:text-yellow-300 transition-colors"
        style={{ fontFamily: F, textDecoration: "none" }}
      >
        {empresa}
      </Link>
      {nomeSistema && (
        <p className="text-xs" style={{ color: "#9CA3AF", fontFamily: F }}>{nomeSistema}</p>
      )}
      <span className="text-xs px-2 py-0.5 rounded-full w-fit" style={{ background: "rgba(251,191,36,0.1)", color: "#FCD34D", border: "1px solid rgba(251,191,36,0.2)", fontFamily: F }}>
        Aguardando resposta
      </span>
    </div>
  );
}

function ProjetoCard({ projeto, onStatusChange }: { projeto: Projeto; onStatusChange: (id: string, status: string, clienteId: string) => void }) {
  const nexts = NEXT_STATUS[projeto.status] ?? [];
  const col = COLUNAS.find((c) => c.status === projeto.status);

  return (
    <div
      className="rounded-xl p-3.5 flex flex-col gap-2 transition-all hover:translate-y-[-1px]"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <Link
        href={`/admin/sistemas/clientes/${projeto.cliente_id}`}
        className="font-semibold text-sm leading-tight text-white hover:text-purple-300 transition-colors"
        style={{ fontFamily: "var(--font-inter), sans-serif", textDecoration: "none" }}
      >
        {(Array.isArray(projeto.clientes) ? projeto.clientes[0]?.empresa : projeto.clientes?.empresa) ?? "—"}
      </Link>
      <p className="text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
        {projeto.nome}
      </p>
      <div className="flex flex-wrap gap-2 text-xs" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {projeto.valor_total && (
          <span style={{ color: "#4ADE80" }}>{money(Number(projeto.valor_total))}</span>
        )}
        {projeto.prazo_entrega && (
          <span style={{ color: "#6B7280" }}>até {fmt(projeto.prazo_entrega)}</span>
        )}
      </div>

      {nexts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {nexts.map((next) => {
            const c = COLUNAS.find((x) => x.status === next);
            return (
              <button
                key={next}
                type="button"
                onClick={() => onStatusChange(projeto.id, next, projeto.cliente_id)}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                style={{ background: c?.bg, color: c?.color, border: `1px solid ${c?.border}`, cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
              >
                <ArrowRightIcon /> {c?.short}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PipelineBoard({ projetos, propostasEnviadas }: { projetos: Projeto[]; propostasEnviadas: PropostaEnviada[] }) {
  const router = useRouter();

  async function handleStatusChange(id: string, status: string, clienteId: string) {
    await atualizarStatusProjeto(id, status, clienteId);
    router.refresh();
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${COLUNAS.length}, minmax(180px, 1fr))`, overflowX: "auto" }}>
      {COLUNAS.map(({ status, short, color, border, bg }) => {
        const projCol = projetos.filter((p) => p.status === status);
        const propCol = status === "Proposta enviada" ? propostasEnviadas : [];
        const total = projCol.length + propCol.length;
        return (
          <div key={status} className="flex flex-col gap-3 min-w-[180px]">
            {/* Column header */}
            <div
              className="rounded-xl px-3 py-2.5 flex items-center justify-between"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span className="text-xs font-semibold" style={{ color, fontFamily: "var(--font-inter), sans-serif" }}>
                {short}
              </span>
              <span
                className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `${color}22`, color, fontFamily: "var(--font-inter), sans-serif" }}
              >
                {total}
              </span>
            </div>
            {/* Cards */}
            <div className="flex flex-col gap-2">
              {propCol.map((p) => (
                <PropostaCard key={p.id} proposta={p} />
              ))}
              {projCol.map((p) => (
                <ProjetoCard key={p.id} projeto={p} onStatusChange={handleStatusChange} />
              ))}
              {total === 0 && (
                <div
                  className="rounded-xl py-6 text-center text-xs"
                  style={{ border: "1px dashed rgba(255,255,255,0.07)", color: "#374151", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Sem projetos
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
