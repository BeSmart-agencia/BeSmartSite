"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { marcarMensalidadePaga, marcarMensalidadePendente, adicionarMensalidade } from "@/app/admin/sistemas/actions";

type Mensalidade = {
  id: string;
  mes_referencia: string;
  plano: string;
  valor: number;
  status: string;
  data_vencimento: string | null;
  data_pagamento: string | null;
  observacoes: string | null;
  projeto_id: string;
  projetos: { nome: string; clientes: { empresa: string } | null } | null;
};

type Projeto = { id: string; nome: string; clientes: { empresa: string } | { empresa: string }[] | null };

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const PLANO_LABEL: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  agency: "Agency",
};

const PLANO_COR: Record<string, { color: string; bg: string; border: string }> = {
  starter: { color: "#9CA3AF", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.2)" },
  pro: { color: "#9B6BB5", bg: "rgba(155,107,181,0.12)", border: "rgba(155,107,181,0.2)" },
  agency: { color: "#2E9BAF", bg: "rgba(46,155,175,0.12)", border: "rgba(46,155,175,0.2)" },
};

function mesLabel(ref: string) {
  const [y, m] = ref.split("-");
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${meses[parseInt(m) - 1]} ${y}`;
}

export function MensalidadesClient({ mensalidades, projetos }: { mensalidades: Mensalidade[]; projetos: Projeto[] }) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<"todos" | "pendente" | "pago">("todos");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const [projetoId, setProjetoId] = useState("");
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [plano, setPlano] = useState("starter");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");

  const filtradas = mensalidades.filter((m) => filtro === "todos" || m.status === filtro);

  async function pagar(id: string) {
    setLoading(id + "_pagar");
    await marcarMensalidadePaga(id);
    router.refresh();
    setLoading(null);
  }

  async function estornar(id: string) {
    setLoading(id + "_estornar");
    await marcarMensalidadePendente(id);
    router.refresh();
    setLoading(null);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!projetoId || !mes || !valor) return;
    const fd = new FormData();
    fd.append("mes_referencia", mes);
    fd.append("plano", plano);
    fd.append("valor", valor);
    fd.append("data_vencimento", vencimento);
    await adicionarMensalidade(projetoId, fd);
    setShowForm(false);
    setValor(""); setVencimento(""); setProjetoId("");
    router.refresh();
  }

  const totalPendente = filtradas.filter((m) => m.status === "pendente").reduce((s, m) => s + Number(m.valor), 0);
  const totalPago = filtradas.filter((m) => m.status === "pago").reduce((s, m) => s + Number(m.valor), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>A Receber</p>
          <p className="text-2xl font-bold" style={{ color: "#FCD34D", fontFamily: "var(--font-playfair), Georgia, serif" }}>{money(totalPendente)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Recebido</p>
          <p className="text-2xl font-bold" style={{ color: "#4ADE80", fontFamily: "var(--font-playfair), Georgia, serif" }}>{money(totalPago)}</p>
        </div>
      </div>

      {/* Filters + Add */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="admin-tabs" style={{ width: "auto" }}>
          {(["todos", "pendente", "pago"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFiltro(f)} className={`admin-tab ${filtro === f ? "active" : ""}`} style={{ padding: "7px 16px" }}>
              {f === "todos" ? "Todos" : f === "pendente" ? "Pendentes" : "Pagos"}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: "13px", padding: "9px 16px" }}>
          + Nova Mensalidade
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="glass rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Nova Mensalidade</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="admin-field">
              <label className="admin-label">Projeto *</label>
              <select value={projetoId} onChange={(e) => setProjetoId(e.target.value)} required className="admin-select">
                <option value="">Selecione o projeto</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id}>{(Array.isArray(p.clientes) ? p.clientes[0]?.empresa : p.clientes?.empresa) ?? "—"} — {p.nome}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Mês de Referência *</label>
              <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} required className="admin-input" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Plano</label>
              <select value={plano} onChange={(e) => setPlano(e.target.value)} className="admin-select">
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="agency">Agency</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Valor (R$) *</label>
              <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required className="admin-input" placeholder="0,00" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Vencimento</label>
              <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} className="admin-input" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 justify-center" style={{ fontSize: "13px" }}>Adicionar</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: "13px" }}>Cancelar</button>
          </div>
        </form>
      )}

      {/* List */}
      {filtradas.length === 0 ? (
        <div className="glass rounded-2xl py-12 text-center">
          <p className="text-sm" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhuma mensalidade encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtradas.map((m) => {
            const cor = PLANO_COR[m.plano] ?? PLANO_COR.starter;
            const isPago = m.status === "pago";
            return (
              <div
                key={m.id}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isPago ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)"}` }}
              >
                {/* Mês badge */}
                <div className="flex-shrink-0 text-center w-12">
                  <div className="text-xs font-bold" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
                    {mesLabel(m.mes_referencia).split(" ")[0]}
                  </div>
                  <div className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                    {mesLabel(m.mes_referencia).split(" ")[1]}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    {m.projetos?.clientes?.empresa ?? "—"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                    {m.projetos?.nome}
                    {m.data_vencimento && ` · vence ${new Date(m.data_vencimento + "T12:00:00").toLocaleDateString("pt-BR")}`}
                  </p>
                </div>

                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: cor.bg, color: cor.color, border: `1px solid ${cor.border}`, fontFamily: "var(--font-inter), sans-serif" }}>
                  {PLANO_LABEL[m.plano] ?? m.plano}
                </span>

                <span className="text-sm font-semibold flex-shrink-0" style={{ color: isPago ? "#4ADE80" : "#FCD34D", fontFamily: "var(--font-inter), sans-serif" }}>
                  {money(Number(m.valor))}
                </span>

                <div className="flex-shrink-0">
                  {isPago ? (
                    <button
                      type="button"
                      onClick={() => estornar(m.id)}
                      disabled={loading === m.id + "_estornar"}
                      className="text-xs px-2.5 py-1 rounded-lg transition-all"
                      style={{ background: "rgba(107,114,128,0.1)", color: "#9CA3AF", border: "1px solid rgba(107,114,128,0.2)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Estornar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => pagar(m.id)}
                      disabled={loading === m.id + "_pagar"}
                      className="text-xs px-2.5 py-1 rounded-lg transition-all hover:opacity-90"
                      style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Pago
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
