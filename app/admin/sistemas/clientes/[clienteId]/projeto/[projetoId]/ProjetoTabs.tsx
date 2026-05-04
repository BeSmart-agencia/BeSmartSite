"use client";

import { useState, useActionState } from "react";
import {
  adicionarItemEscopo,
  toggleItemEscopo,
  adicionarEtapa,
  atualizarStatusEtapa,
  adicionarParcela,
  marcarParcelaPaga,
  atualizarStatusProjeto,
} from "@/app/admin/sistemas/actions";
import { useRouter } from "next/navigation";

type Projeto = {
  id: string;
  nome: string;
  descricao: string | null;
  status: string;
  data_inicio: string | null;
  prazo_entrega: string | null;
  valor_total: number | null;
  forma_pagamento: string | null;
  observacoes_tecnicas: string | null;
};
type Cliente = { id: string; nome: string; empresa: string };
type Diagnostico = {
  resolver_uma_coisa?: string | null;
  [key: string]: unknown;
} | null;
type ItemEscopo = { id: string; descricao: string; concluido: boolean };
type Etapa = { id: string; nome: string; responsavel: string | null; prazo: string | null; status: string };
type Parcela = { id: string; valor: number; vencimento: string | null; status: string; descricao: string | null };

type Props = {
  projeto: Projeto;
  clienteId: string;
  cliente: Cliente;
  diagnostico: Diagnostico;
  itens: ItemEscopo[];
  etapas: Etapa[];
  parcelas: Parcela[];
  totalPago: number;
  totalReceber: number;
};

const TABS = ["Escopo", "Etapas", "Financeiro", "Apresentação"] as const;
type Tab = (typeof TABS)[number];

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmt(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR");
}

// ── Aba Escopo ────────────────────────────────────────────────────────────────

function AbaEscopo({ projetoId, itens, clienteId }: { projetoId: string; itens: ItemEscopo[]; clienteId: string }) {
  const [input, setInput] = useState("");
  const [localItens, setLocalItens] = useState(itens);
  const router = useRouter();

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    await adicionarItemEscopo(projetoId, input.trim());
    setLocalItens((prev) => [...prev, { id: "tmp-" + Date.now(), descricao: input.trim(), concluido: false }]);
    setInput("");
    router.refresh();
  }

  async function toggle(id: string, current: boolean) {
    setLocalItens((prev) => prev.map((i) => i.id === id ? { ...i, concluido: !current } : i));
    await toggleItemEscopo(id, !current);
  }

  const done = localItens.filter((i) => i.concluido).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <p className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          {done}/{localItens.length} itens concluídos
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {localItens.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <input
              type="checkbox"
              checked={item.concluido}
              onChange={() => toggle(item.id, item.concluido)}
              className="w-4 h-4 flex-shrink-0"
              style={{ accentColor: "#9B6BB5" }}
            />
            <span
              className="text-sm flex-1"
              style={{
                color: item.concluido ? "#4B5563" : "#D1D5DB",
                textDecoration: item.concluido ? "line-through" : "none",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {item.descricao}
            </span>
          </div>
        ))}

        {localItens.length === 0 && (
          <p className="text-sm text-center py-6" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            Nenhum item de escopo ainda.
          </p>
        )}
      </div>

      <form onSubmit={addItem} className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="admin-input flex-1"
          placeholder="Adicionar item de escopo..."
        />
        <button type="submit" className="btn-primary" style={{ padding: "10px 18px", fontSize: "13px" }}>
          Adicionar
        </button>
      </form>
    </div>
  );
}

// ── Aba Etapas ────────────────────────────────────────────────────────────────

function AbaEtapas({ projetoId, etapas, clienteId }: { projetoId: string; etapas: Etapa[]; clienteId: string }) {
  const [open, setOpen] = useState(false);
  const [localEtapas, setLocalEtapas] = useState(etapas);
  const router = useRouter();

  const statusCores: Record<string, { bg: string; color: string; border: string }> = {
    "a fazer": { bg: "rgba(107,114,128,0.1)", color: "#9CA3AF", border: "rgba(107,114,128,0.2)" },
    "em andamento": { bg: "rgba(155,107,181,0.1)", color: "#9B6BB5", border: "rgba(155,107,181,0.25)" },
    "concluído": { bg: "rgba(34,197,94,0.1)", color: "#4ADE80", border: "rgba(34,197,94,0.25)" },
  };

  async function nextStatus(etapa: Etapa) {
    const order = ["a fazer", "em andamento", "concluído"];
    const next = order[(order.indexOf(etapa.status) + 1) % order.length];
    setLocalEtapas((prev) => prev.map((e) => e.id === etapa.id ? { ...e, status: next } : e));
    await atualizarStatusEtapa(etapa.id, next);
    router.refresh();
  }

  const [nome, setNome] = useState("");
  const [resp, setResp] = useState("");
  const [prazo, setPrazo] = useState("");

  async function addEtapa(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("responsavel", resp);
    fd.append("prazo", prazo);
    await adicionarEtapa(projetoId, fd);
    setLocalEtapas((prev) => [...prev, { id: "tmp-" + Date.now(), nome, responsavel: resp || null, prazo: prazo || null, status: "a fazer" }]);
    setNome(""); setResp(""); setPrazo("");
    setOpen(false);
    router.refresh();
  }

  const done = localEtapas.filter((e) => e.status === "concluído").length;
  const progresso = localEtapas.length > 0 ? Math.round((done / localEtapas.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {localEtapas.length > 0 && (
        <div>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            <span>Progresso geral</span><span>{progresso}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {localEtapas.map((etapa) => {
          const cor = statusCores[etapa.status] ?? statusCores["a fazer"];
          return (
            <div
              key={etapa.id}
              className="flex items-start sm:items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                type="button"
                onClick={() => nextStatus(etapa)}
                className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full transition-all"
                style={{ background: cor.bg, color: cor.color, border: `1px solid ${cor.border}`, fontFamily: "var(--font-inter), sans-serif", cursor: "pointer" }}
                title="Clique para avançar o status"
              >
                {etapa.status}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                  {etapa.nome}
                </p>
                <div className="flex flex-wrap gap-3 text-xs mt-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                  {etapa.responsavel && <span>{etapa.responsavel}</span>}
                  {etapa.prazo && <span>até {fmt(etapa.prazo)}</span>}
                </div>
              </div>
            </div>
          );
        })}

        {localEtapas.length === 0 && (
          <p className="text-sm text-center py-6" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            Nenhuma etapa cadastrada.
          </p>
        )}
      </div>

      {open ? (
        <form onSubmit={addEtapa} className="glass rounded-xl p-4 flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={nome} onChange={(e) => setNome(e.target.value)} required className="admin-input" placeholder="Nome da etapa *" />
            <input value={resp} onChange={(e) => setResp(e.target.value)} className="admin-input" placeholder="Responsável" />
          </div>
          <input value={prazo} onChange={(e) => setPrazo(e.target.value)} type="date" className="admin-input" />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 justify-center" style={{ fontSize: "13px", padding: "9px 16px" }}>Adicionar</button>
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary" style={{ fontSize: "13px" }}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full text-sm py-3 rounded-xl transition-all hover:bg-white/5"
          style={{ border: "1px dashed rgba(255,255,255,0.10)", color: "#6B7280", fontFamily: "var(--font-inter), sans-serif", cursor: "pointer", background: "transparent" }}
        >
          + Nova etapa
        </button>
      )}
    </div>
  );
}

// ── Aba Financeiro ────────────────────────────────────────────────────────────

function AbaFinanceiro({
  projeto,
  parcelas,
  totalPago,
  totalReceber,
  clienteId,
}: {
  projeto: Projeto;
  parcelas: Parcela[];
  totalPago: number;
  totalReceber: number;
  clienteId: string;
}) {
  const [open, setOpen] = useState(false);
  const [localParcelas, setLocalParcelas] = useState(parcelas);
  const [lPago, setLPago] = useState(totalPago);
  const [lReceber, setLReceber] = useState(totalReceber);
  const router = useRouter();

  const [valor, setValor] = useState("");
  const [venc, setVenc] = useState("");
  const [desc, setDesc] = useState("");

  async function addParcela(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("valor", valor);
    fd.append("vencimento", venc);
    fd.append("descricao", desc);
    await adicionarParcela(projeto.id as string, fd);
    const v = Number(valor);
    setLocalParcelas((prev) => [...prev, { id: "tmp-" + Date.now(), valor: v, vencimento: venc || null, status: "pendente", descricao: desc || null }]);
    setLReceber((r) => r + v);
    setValor(""); setVenc(""); setDesc("");
    setOpen(false);
    router.refresh();
  }

  async function pagarParcela(id: string, v: number) {
    setLocalParcelas((prev) => prev.map((p) => p.id === id ? { ...p, status: "pago" } : p));
    setLPago((x) => x + v);
    setLReceber((x) => x - v);
    await marcarParcelaPaga(id);
    router.refresh();
  }

  const statusParcelaCor: Record<string, { color: string }> = {
    pago: { color: "#4ADE80" },
    pendente: { color: "#FCD34D" },
    atrasado: { color: "#F87171" },
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total recebido", value: lPago, color: "#4ADE80" },
          { label: "Total a receber", value: lReceber, color: "#FCD34D" },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}>{money(value)}</p>
          </div>
        ))}
      </div>

      {projeto.valor_total && (
        <div className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Valor total do projeto: <strong style={{ color: "#D1D5DB" }}>{money(Number(projeto.valor_total))}</strong>
          {projeto.forma_pagamento && <> · {projeto.forma_pagamento as string}</>}
        </div>
      )}

      {/* Parcelas */}
      <div className="flex flex-col gap-2">
        {localParcelas.map((p) => {
          const cor = statusParcelaCor[p.status] ?? { color: "#9CA3AF" };
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: cor.color, fontFamily: "var(--font-inter), sans-serif" }}>
                    {money(Number(p.valor))}
                  </span>
                  {p.vencimento && (
                    <span className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                      vence {fmt(p.vencimento)}
                    </span>
                  )}
                </div>
                {p.descricao && (
                  <p className="text-xs mt-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                    {p.descricao}
                  </p>
                )}
              </div>

              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", color: cor.color, fontFamily: "var(--font-inter), sans-serif" }}
              >
                {p.status}
              </span>

              {p.status !== "pago" && (
                <button
                  type="button"
                  onClick={() => pagarParcela(p.id, Number(p.valor))}
                  className="text-xs px-2.5 py-1 rounded-lg transition-all hover:opacity-90"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Pago
                </button>
              )}
            </div>
          );
        })}

        {localParcelas.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            Nenhuma parcela cadastrada.
          </p>
        )}
      </div>

      {open ? (
        <form onSubmit={addParcela} className="glass rounded-xl p-4 flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={valor} onChange={(e) => setValor(e.target.value)} required type="number" step="0.01" className="admin-input" placeholder="Valor (R$) *" />
            <input value={venc} onChange={(e) => setVenc(e.target.value)} type="date" className="admin-input" />
          </div>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} className="admin-input" placeholder="Descrição (ex: entrada, 2ª parcela...)" />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 justify-center" style={{ fontSize: "13px", padding: "9px 16px" }}>Adicionar</button>
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary" style={{ fontSize: "13px" }}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full text-sm py-3 rounded-xl transition-all hover:bg-white/5"
          style={{ border: "1px dashed rgba(255,255,255,0.10)", color: "#6B7280", fontFamily: "var(--font-inter), sans-serif", cursor: "pointer", background: "transparent" }}
        >
          + Nova parcela
        </button>
      )}
    </div>
  );
}

// ── Aba Apresentação ──────────────────────────────────────────────────────────

function AbaApresentacao({
  projeto,
  cliente,
  diagnostico,
  itens,
  etapas,
}: {
  projeto: Projeto;
  cliente: Cliente;
  diagnostico: Diagnostico;
  itens: ItemEscopo[];
  etapas: Etapa[];
}) {
  const prazo = projeto.prazo_entrega
    ? new Date((projeto.prazo_entrega as string) + "T12:00:00").toLocaleDateString("pt-BR")
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Apresentação */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(155,107,181,0.08), rgba(46,155,175,0.08))",
          border: "1px solid rgba(155,107,181,0.2)",
        }}
      >
        <div className="mb-6">
          <span className="badge badge-purple mb-3">Proposta · BeSmart</span>
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {projeto.nome as string}
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
            Proposta preparada para <strong style={{ color: "#FFFFFF" }}>{cliente.empresa}</strong>
          </p>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.07)", marginBottom: "24px" }} />

        {diagnostico?.resolver_uma_coisa && (
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#9B6BB5" }}>
              Problema identificado
            </p>
            <p className="text-sm italic leading-relaxed" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
              &ldquo;{diagnostico.resolver_uma_coisa as string}&rdquo;
            </p>
          </div>
        )}

        {projeto.descricao && (
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#2E9BAF" }}>
              Solução proposta
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
              {projeto.descricao as string}
            </p>
          </div>
        )}

        {itens.length > 0 && (
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#9B6BB5" }}>
              O que será entregue
            </p>
            <ul className="flex flex-col gap-1.5">
              {itens.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B6BB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item.descricao}
                </li>
              ))}
            </ul>
          </div>
        )}

        {etapas.length > 0 && (
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#2E9BAF" }}>
              Etapas do projeto
            </p>
            <div className="flex flex-col gap-2">
              {etapas.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(155,107,181,0.15)", color: "#9B6BB5" }}
                  >
                    {i + 1}
                  </span>
                  <div className="text-sm" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    <span style={{ color: "#D1D5DB" }}>{e.nome}</span>
                    {e.prazo && <span className="ml-2 text-xs" style={{ color: "#6B7280" }}>até {fmt(e.prazo)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <hr style={{ borderColor: "rgba(255,255,255,0.07)", margin: "24px 0" }} />

        <div className="grid sm:grid-cols-2 gap-4">
          {projeto.valor_total && (
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#6B7280" }}>Investimento</p>
              <p className="text-xl font-bold" style={{ color: "#4ADE80", fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {(Number(projeto.valor_total)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              {projeto.forma_pagamento && (
                <p className="text-xs mt-0.5" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                  {projeto.forma_pagamento as string}
                </p>
              )}
            </div>
          )}
          {prazo && (
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#6B7280" }}>Prazo de entrega</p>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {prazo}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-center" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
        Esta apresentação é gerada automaticamente a partir dos dados do diagnóstico e do escopo preenchidos.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProjetoTabs({
  projeto,
  clienteId,
  cliente,
  diagnostico,
  itens,
  etapas,
  parcelas,
  totalPago,
  totalReceber,
}: Props) {
  const [tab, setTab] = useState<Tab>("Escopo");

  return (
    <div>
      {/* Tab bar */}
      <div className="admin-tabs mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`admin-tab ${tab === t ? "active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "Escopo" && (
        <AbaEscopo projetoId={projeto.id as string} itens={itens} clienteId={clienteId} />
      )}
      {tab === "Etapas" && (
        <AbaEtapas projetoId={projeto.id as string} etapas={etapas} clienteId={clienteId} />
      )}
      {tab === "Financeiro" && (
        <AbaFinanceiro projeto={projeto} parcelas={parcelas} totalPago={totalPago} totalReceber={totalReceber} clienteId={clienteId} />
      )}
      {tab === "Apresentação" && (
        <AbaApresentacao projeto={projeto} cliente={cliente} diagnostico={diagnostico} itens={itens} etapas={etapas} />
      )}
    </div>
  );
}
