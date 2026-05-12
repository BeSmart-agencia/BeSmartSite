"use client";

import { useState } from "react";
import {
  adicionarItemEscopo, toggleItemEscopo,
  adicionarEtapa, atualizarStatusEtapa,
  adicionarParcela, marcarParcelaPaga,
  atualizarStatusProjeto, abrirChamado, atualizarStatusChamado,
  toggleProjetoCheck, atualizarProposta, atualizarInfoProjeto,
  adicionarMensalidade, marcarMensalidadePaga,
  salvarPropostaConteudo,
} from "@/app/admin/sistemas/actions";
import { useRouter } from "next/navigation";

type Projeto = {
  id: string; nome: string; descricao: string | null; status: string;
  data_inicio: string | null; prazo_entrega: string | null;
  valor_total: number | null; forma_pagamento: string | null;
  observacoes_tecnicas: string | null;
  complexidade: string | null; plano_mensalidade: string | null;
  valor_mensalidade: number | null; prazo_mensalidade_meses: number | null;
  proposta_status: string | null; proposta_enviada_em: string | null;
  contrato_assinado_em: string | null;
  proc_diagnostico: boolean; proc_proposta_enviada: boolean;
  proc_contrato_assinado: boolean; proc_entrada_recebida: boolean;
  proc_entregue: boolean; proc_onboarding: boolean; proc_mensalidade_ativa: boolean;
  infra_supabase_criado: boolean; infra_colaboradora_adicionada: boolean;
  infra_github_repo: boolean; infra_vercel_deploy: boolean;
  infra_dns_configurado: boolean; infra_dominio_vercel: boolean;
  proposta_conteudo: Record<string, unknown> | null;
};
type Cliente = { id: string; nome: string; empresa: string };
type Diagnostico = { resolver_uma_coisa?: string | null; [key: string]: unknown } | null;
type ItemEscopo = { id: string; descricao: string; concluido: boolean };
type Etapa = { id: string; nome: string; responsavel: string | null; prazo: string | null; status: string };
type Parcela = { id: string; valor: number; vencimento: string | null; status: string; descricao: string | null };
type Chamado = { id: string; titulo: string; descricao: string | null; status: string; created_at: string };
type Mensalidade = { id: string; mes_referencia: string; plano: string; valor: number; status: string; data_vencimento: string | null };

type Props = {
  projeto: Projeto; clienteId: string; cliente: Cliente; diagnostico: Diagnostico;
  itens: ItemEscopo[]; etapas: Etapa[]; parcelas: Parcela[];
  chamados: Chamado[]; mensalidades: Mensalidade[];
  totalPago: number; totalReceber: number;
};

const TABS = ["Processo", "Escopo", "Etapas", "Financeiro", "Chamados", "Proposta"] as const;
type Tab = (typeof TABS)[number];

function money(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function fmt(d: string) { return new Date(d + "T12:00:00").toLocaleDateString("pt-BR"); }

// ── Aba Processo ──────────────────────────────────────────────────────────────

const PROC_STEPS = [
  { campo: "proc_diagnostico", label: "Diagnóstico realizado" },
  { campo: "proc_proposta_enviada", label: "Proposta enviada ao cliente" },
  { campo: "proc_contrato_assinado", label: "Contrato assinado" },
  { campo: "proc_entrada_recebida", label: "Entrada recebida (50% do desenvolvimento)" },
  { campo: "proc_entregue", label: "Sistema entregue" },
  { campo: "proc_onboarding", label: "Onboarding realizado com a equipe" },
  { campo: "proc_mensalidade_ativa", label: "Mensalidade ativa" },
] as const;

const INFRA_STEPS = [
  { campo: "infra_supabase_criado", label: "Cliente criou conta no Supabase" },
  { campo: "infra_colaboradora_adicionada", label: "Você foi adicionada como colaboradora no Supabase" },
  { campo: "infra_github_repo", label: "Repositório criado no GitHub (BeSmart)" },
  { campo: "infra_vercel_deploy", label: "Projeto deployado na Vercel (sua conta)" },
  { campo: "infra_dns_configurado", label: "DNS configurado pelo cliente (aponta para Vercel)" },
  { campo: "infra_dominio_vercel", label: "Domínio adicionado na Vercel" },
] as const;

const PROPOSTA_STATUS_OPTS = [
  { value: "nao_enviada", label: "Não enviada", color: "#6B7280" },
  { value: "rascunho", label: "Rascunho", color: "#9CA3AF" },
  { value: "enviada", label: "Enviada", color: "#FCD34D" },
  { value: "aprovada", label: "Aprovada", color: "#4ADE80" },
  { value: "recusada", label: "Recusada", color: "#F87171" },
];

function AbaProcesso({ projeto, clienteId }: { projeto: Projeto; clienteId: string }) {
  const router = useRouter();
  const [localProj, setLocalProj] = useState(projeto);
  const [savingProposta, setSavingProposta] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);

  const procDone = PROC_STEPS.filter((s) => localProj[s.campo]).length;
  const infraDone = INFRA_STEPS.filter((s) => localProj[s.campo]).length;

  async function toggle(campo: string, current: boolean) {
    setLocalProj((p) => ({ ...p, [campo]: !current }));
    await toggleProjetoCheck(projeto.id, campo, !current);
  }

  async function handleProposta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingProposta(true);
    const fd = new FormData(e.currentTarget);
    await atualizarProposta(projeto.id, fd, clienteId);
    setSavingProposta(false);
    router.refresh();
  }

  async function handleInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingInfo(true);
    const fd = new FormData(e.currentTarget);
    await atualizarInfoProjeto(projeto.id, fd, clienteId);
    setSavingInfo(false);
    router.refresh();
  }

  const propostaAtual = PROPOSTA_STATUS_OPTS.find((o) => o.value === (localProj.proposta_status ?? "nao_enviada"));

  return (
    <div className="flex flex-col gap-5">
      {/* Checklist do processo */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(155,107,181,0.05)", border: "1px solid rgba(155,107,181,0.15)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
            Checklist do Processo
          </p>
          <span className="text-xs font-bold" style={{ color: procDone === 7 ? "#4ADE80" : "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
            {procDone}/7
          </span>
        </div>
        <div className="progress-bar mb-4">
          <div className="progress-fill" style={{ width: `${(procDone / 7) * 100}%` }} />
        </div>
        <div className="flex flex-col gap-2">
          {PROC_STEPS.map(({ campo, label }, i) => {
            const done = localProj[campo as keyof Projeto] as boolean;
            return (
              <label key={campo} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: done ? "rgba(155,107,181,0.25)" : "rgba(255,255,255,0.04)",
                    border: done ? "1px solid rgba(155,107,181,0.5)" : "1px solid rgba(255,255,255,0.12)",
                  }}
                  onClick={() => toggle(campo, done)}
                >
                  {done && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9B6BB5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2.5 flex-1" onClick={() => toggle(campo, done)}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "rgba(155,107,181,0.1)", color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: done ? "#6B7280" : "#D1D5DB",
                      textDecoration: done ? "line-through" : "none",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Status da proposta */}
      <div className="glass rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Status da Proposta
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{
              background: `${propostaAtual?.color}18`,
              color: propostaAtual?.color,
              border: `1px solid ${propostaAtual?.color}33`,
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {propostaAtual?.label ?? "Não enviada"}
          </span>
        </div>
        <form onSubmit={handleProposta} className="flex flex-col gap-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="admin-field">
              <label className="admin-label">Status</label>
              <select name="proposta_status" defaultValue={projeto.proposta_status ?? "nao_enviada"} className="admin-select">
                {PROPOSTA_STATUS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Data do Envio</label>
              <input type="date" name="proposta_enviada_em" defaultValue={projeto.proposta_enviada_em ?? ""} className="admin-input" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Data Assinatura Contrato</label>
              <input type="date" name="contrato_assinado_em" defaultValue={projeto.contrato_assinado_em ?? ""} className="admin-input" />
            </div>
          </div>
          <button type="submit" disabled={savingProposta} className="btn-primary self-start" style={{ fontSize: "13px", padding: "9px 18px" }}>
            {savingProposta ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>

      {/* Configurações do projeto */}
      <div className="glass rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Configurações do Projeto
        </p>
        <form onSubmit={handleInfo} className="flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="admin-field">
              <label className="admin-label">Complexidade</label>
              <select name="complexidade" defaultValue={projeto.complexidade ?? "medio"} className="admin-select">
                <option value="simples">Simples (R$ 3k–6k)</option>
                <option value="medio">Médio (R$ 8k–15k)</option>
                <option value="complexo">Complexo (R$ 18k–35k)</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Plano Mensal</label>
              <select name="plano_mensalidade" defaultValue={projeto.plano_mensalidade ?? "starter"} className="admin-select">
                <option value="starter">Starter (R$ 297–497)</option>
                <option value="pro">Pro (R$ 497–797)</option>
                <option value="agency">Agency (R$ 997+)</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Valor Mensalidade (R$)</label>
              <input type="number" step="0.01" name="valor_mensalidade" defaultValue={projeto.valor_mensalidade ?? ""} className="admin-input" placeholder="0,00" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Prazo Mínimo (meses)</label>
              <select name="prazo_mensalidade_meses" defaultValue={String(projeto.prazo_mensalidade_meses ?? 6)} className="admin-select">
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={savingInfo} className="btn-primary self-start" style={{ fontSize: "13px", padding: "9px 18px" }}>
            {savingInfo ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>

      {/* Checklist de infraestrutura */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(46,155,175,0.04)", border: "1px solid rgba(46,155,175,0.15)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>
            Infraestrutura
          </p>
          <span className="text-xs font-bold" style={{ color: infraDone === 6 ? "#4ADE80" : "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>
            {infraDone}/6
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {INFRA_STEPS.map(({ campo, label }) => {
            const done = localProj[campo as keyof Projeto] as boolean;
            return (
              <label key={campo} className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: done ? "rgba(46,155,175,0.2)" : "rgba(255,255,255,0.04)",
                    border: done ? "1px solid rgba(46,155,175,0.5)" : "1px solid rgba(255,255,255,0.12)",
                  }}
                  onClick={() => toggle(campo, done)}
                >
                  {done && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2E9BAF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: done ? "#6B7280" : "#D1D5DB",
                    textDecoration: done ? "line-through" : "none",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                  onClick={() => toggle(campo, done)}
                >
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
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
      <p className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
        {done}/{localItens.length} itens concluídos
      </p>
      <div className="flex flex-col gap-2">
        {localItens.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <input type="checkbox" checked={item.concluido} onChange={() => toggle(item.id, item.concluido)} className="w-4 h-4 flex-shrink-0" style={{ accentColor: "#9B6BB5" }} />
            <span className="text-sm flex-1" style={{ color: item.concluido ? "#4B5563" : "#D1D5DB", textDecoration: item.concluido ? "line-through" : "none", fontFamily: "var(--font-inter), sans-serif" }}>
              {item.descricao}
            </span>
          </div>
        ))}
        {localItens.length === 0 && (
          <p className="text-sm text-center py-6" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhum item de escopo ainda.</p>
        )}
      </div>
      <form onSubmit={addItem} className="flex gap-2 mt-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="admin-input flex-1" placeholder="Adicionar item de escopo..." />
        <button type="submit" className="btn-primary" style={{ padding: "10px 18px", fontSize: "13px" }}>Adicionar</button>
      </form>
    </div>
  );
}

// ── Aba Etapas ────────────────────────────────────────────────────────────────

function AbaEtapas({ projetoId, etapas }: { projetoId: string; etapas: Etapa[] }) {
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

  const [nome, setNome] = useState(""); const [resp, setResp] = useState(""); const [prazo, setPrazo] = useState("");

  async function addEtapa(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nome", nome); fd.append("responsavel", resp); fd.append("prazo", prazo);
    await adicionarEtapa(projetoId, fd);
    setLocalEtapas((prev) => [...prev, { id: "tmp-" + Date.now(), nome, responsavel: resp || null, prazo: prazo || null, status: "a fazer" }]);
    setNome(""); setResp(""); setPrazo(""); setOpen(false);
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
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progresso}%` }} /></div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {localEtapas.map((etapa) => {
          const cor = statusCores[etapa.status] ?? statusCores["a fazer"];
          return (
            <div key={etapa.id} className="flex items-start sm:items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <button type="button" onClick={() => nextStatus(etapa)} className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full transition-all" style={{ background: cor.bg, color: cor.color, border: `1px solid ${cor.border}`, fontFamily: "var(--font-inter), sans-serif", cursor: "pointer" }} title="Clique para avançar">
                {etapa.status}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{etapa.nome}</p>
                <div className="flex flex-wrap gap-3 text-xs mt-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                  {etapa.responsavel && <span>{etapa.responsavel}</span>}
                  {etapa.prazo && <span>até {fmt(etapa.prazo)}</span>}
                </div>
              </div>
            </div>
          );
        })}
        {localEtapas.length === 0 && <p className="text-sm text-center py-6" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhuma etapa cadastrada.</p>}
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
        <button type="button" onClick={() => setOpen(true)} className="w-full text-sm py-3 rounded-xl transition-all hover:bg-white/5" style={{ border: "1px dashed rgba(255,255,255,0.10)", color: "#6B7280", fontFamily: "var(--font-inter), sans-serif", cursor: "pointer", background: "transparent" }}>
          + Nova etapa
        </button>
      )}
    </div>
  );
}

// ── Aba Financeiro ────────────────────────────────────────────────────────────

function AbaFinanceiro({ projeto, parcelas, totalPago, totalReceber, clienteId, mensalidades }: {
  projeto: Projeto; parcelas: Parcela[]; totalPago: number; totalReceber: number;
  clienteId: string; mensalidades: Mensalidade[];
}) {
  const [openParcela, setOpenParcela] = useState(false);
  const [openMens, setOpenMens] = useState(false);
  const [localParcelas, setLocalParcelas] = useState(parcelas);
  const [localMens, setLocalMens] = useState(mensalidades);
  const [lPago, setLPago] = useState(totalPago);
  const [lReceber, setLReceber] = useState(totalReceber);
  const router = useRouter();

  const [valor, setValor] = useState(""); const [venc, setVenc] = useState(""); const [desc, setDesc] = useState("");
  const [mMes, setMMes] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; });
  const [mPlano, setMPlano] = useState(projeto.plano_mensalidade ?? "starter");
  const [mValor, setMValor] = useState(String(projeto.valor_mensalidade ?? ""));
  const [mVenc, setMVenc] = useState("");

  async function addParcela(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(); fd.append("valor", valor); fd.append("vencimento", venc); fd.append("descricao", desc);
    await adicionarParcela(projeto.id, fd);
    const v = Number(valor);
    setLocalParcelas((prev) => [...prev, { id: "tmp-" + Date.now(), valor: v, vencimento: venc || null, status: "pendente", descricao: desc || null }]);
    setLReceber((r) => r + v);
    setValor(""); setVenc(""); setDesc(""); setOpenParcela(false);
    router.refresh();
  }

  async function pagarParcela(id: string, v: number) {
    setLocalParcelas((prev) => prev.map((p) => p.id === id ? { ...p, status: "pago" } : p));
    setLPago((x) => x + v); setLReceber((x) => x - v);
    await marcarParcelaPaga(id);
    router.refresh();
  }

  async function addMens(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(); fd.append("mes_referencia", mMes); fd.append("plano", mPlano); fd.append("valor", mValor); fd.append("data_vencimento", mVenc);
    await adicionarMensalidade(projeto.id, fd);
    setLocalMens((prev) => [...prev, { id: "tmp-" + Date.now(), mes_referencia: mMes, plano: mPlano, valor: Number(mValor), status: "pendente", data_vencimento: mVenc || null }]);
    setMMes(""); setMValor(""); setMVenc(""); setOpenMens(false);
    router.refresh();
  }

  async function pagarMens(id: string) {
    setLocalMens((prev) => prev.map((m) => m.id === id ? { ...m, status: "pago" } : m));
    await marcarMensalidadePaga(id);
    router.refresh();
  }

  const statusCor: Record<string, string> = { pago: "#4ADE80", pendente: "#FCD34D", atrasado: "#F87171" };

  function mesLabel(ref: string) {
    const [y, m] = ref.split("-");
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${meses[parseInt(m) - 1]}/${y}`;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Dev summary */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Desenvolvimento</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[{ label: "Recebido", value: lPago, color: "#4ADE80" }, { label: "A receber", value: lReceber, color: "#FCD34D" }].map(({ label, value, color }) => (
            <div key={label} className="stat-card">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}>{money(value)}</p>
            </div>
          ))}
        </div>
        {projeto.valor_total && (
          <p className="text-sm mb-3" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            Valor total: <strong style={{ color: "#D1D5DB" }}>{money(Number(projeto.valor_total))}</strong>
            {projeto.forma_pagamento && <> · {projeto.forma_pagamento}</>}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {localParcelas.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: statusCor[p.status] ?? "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{money(Number(p.valor))}</span>
                  {p.vencimento && <span className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>vence {fmt(p.vencimento)}</span>}
                </div>
                {p.descricao && <p className="text-xs mt-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>{p.descricao}</p>}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: statusCor[p.status] ?? "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{p.status}</span>
              {p.status !== "pago" && (
                <button type="button" onClick={() => pagarParcela(p.id, Number(p.valor))} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>Pago</button>
              )}
            </div>
          ))}
          {localParcelas.length === 0 && <p className="text-sm text-center py-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhuma parcela cadastrada.</p>}
        </div>
        {openParcela ? (
          <form onSubmit={addParcela} className="glass rounded-xl p-4 flex flex-col gap-3 mt-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={valor} onChange={(e) => setValor(e.target.value)} required type="number" step="0.01" className="admin-input" placeholder="Valor (R$) *" />
              <input value={venc} onChange={(e) => setVenc(e.target.value)} type="date" className="admin-input" />
            </div>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} className="admin-input" placeholder="Descrição (ex: entrada, 2ª parcela...)" />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 justify-center" style={{ fontSize: "13px", padding: "9px 16px" }}>Adicionar</button>
              <button type="button" onClick={() => setOpenParcela(false)} className="btn-secondary" style={{ fontSize: "13px" }}>Cancelar</button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setOpenParcela(true)} className="w-full text-sm py-3 rounded-xl mt-3 hover:bg-white/5 transition-all" style={{ border: "1px dashed rgba(255,255,255,0.10)", color: "#6B7280", fontFamily: "var(--font-inter), sans-serif", cursor: "pointer", background: "transparent" }}>+ Nova parcela</button>
        )}
      </div>

      {/* Mensalidades section */}
      <div>
        <div className="flex items-center gap-3 mb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "20px" }}>
          <p className="text-xs font-semibold uppercase tracking-wider flex-1" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
            Mensalidades de Suporte
          </p>
          {projeto.plano_mensalidade && projeto.valor_mensalidade && (
            <span className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
              Plano {projeto.plano_mensalidade} · {money(Number(projeto.valor_mensalidade))}/mês
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {localMens.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(155,107,181,0.04)", border: "1px solid rgba(155,107,181,0.12)" }}>
              <span className="text-xs font-bold w-14 text-center" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>{mesLabel(m.mes_referencia)}</span>
              <div className="flex-1">
                <span className="text-sm font-semibold" style={{ color: statusCor[m.status] ?? "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{money(Number(m.valor))}</span>
                {m.data_vencimento && <span className="text-xs ml-2" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>vence {fmt(m.data_vencimento)}</span>}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: statusCor[m.status] ?? "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{m.status}</span>
              {m.status !== "pago" && (
                <button type="button" onClick={() => pagarMens(m.id)} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>Pago</button>
              )}
            </div>
          ))}
          {localMens.length === 0 && <p className="text-sm text-center py-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhuma mensalidade cadastrada.</p>}
        </div>
        {openMens ? (
          <form onSubmit={addMens} className="glass rounded-xl p-4 flex flex-col gap-3 mt-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="admin-field"><label className="admin-label">Mês *</label><input type="month" value={mMes} onChange={(e) => setMMes(e.target.value)} required className="admin-input" /></div>
              <div className="admin-field"><label className="admin-label">Plano</label>
                <select value={mPlano} onChange={(e) => setMPlano(e.target.value)} className="admin-select">
                  <option value="starter">Starter</option><option value="pro">Pro</option><option value="agency">Agency</option>
                </select>
              </div>
              <div className="admin-field"><label className="admin-label">Valor (R$) *</label><input type="number" step="0.01" value={mValor} onChange={(e) => setMValor(e.target.value)} required className="admin-input" placeholder="0,00" /></div>
              <div className="admin-field"><label className="admin-label">Vencimento</label><input type="date" value={mVenc} onChange={(e) => setMVenc(e.target.value)} className="admin-input" /></div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 justify-center" style={{ fontSize: "13px", padding: "9px 16px" }}>Adicionar</button>
              <button type="button" onClick={() => setOpenMens(false)} className="btn-secondary" style={{ fontSize: "13px" }}>Cancelar</button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setOpenMens(true)} className="w-full text-sm py-3 rounded-xl mt-3 hover:bg-white/5 transition-all" style={{ border: "1px dashed rgba(155,107,181,0.2)", color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif", cursor: "pointer", background: "transparent" }}>+ Nova mensalidade</button>
        )}
      </div>
    </div>
  );
}

// ── Aba Chamados ─────────────────────────────────────────────────────────────

function AbaChamados({ projetoId, clienteId, chamados }: { projetoId: string; clienteId: string; chamados: Chamado[] }) {
  const [open, setOpen] = useState(false);
  const [localChamados, setLocalChamados] = useState(chamados);
  const router = useRouter();
  const [titulo, setTitulo] = useState(""); const [desc, setDesc] = useState("");

  const statusCores: Record<string, { bg: string; color: string; border: string }> = {
    aberto: { bg: "rgba(251,191,36,0.1)", color: "#FCD34D", border: "rgba(251,191,36,0.25)" },
    "em andamento": { bg: "rgba(155,107,181,0.1)", color: "#9B6BB5", border: "rgba(155,107,181,0.25)" },
    resolvido: { bg: "rgba(34,197,94,0.1)", color: "#4ADE80", border: "rgba(34,197,94,0.25)" },
  };

  async function addChamado(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    const fd = new FormData(); fd.append("titulo", titulo); fd.append("descricao", desc);
    await abrirChamado(clienteId, projetoId, fd);
    setLocalChamados((prev) => [...prev, { id: "tmp-" + Date.now(), titulo, descricao: desc || null, status: "aberto", created_at: new Date().toISOString() }]);
    setTitulo(""); setDesc(""); setOpen(false);
    router.refresh();
  }

  async function fechar(id: string) {
    setLocalChamados((prev) => prev.map((c) => c.id === id ? { ...c, status: "resolvido" } : c));
    await atualizarStatusChamado(id, "resolvido");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {localChamados.map((c) => {
          const cor = statusCores[c.status] ?? statusCores["aberto"];
          return (
            <div key={c.id} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${cor.border}` }}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-sm text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{c.titulo}</p>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: cor.bg, color: cor.color, fontFamily: "var(--font-inter), sans-serif" }}>{c.status}</span>
              </div>
              {c.descricao && <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{c.descricao}</p>}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>{new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
                {c.status !== "resolvido" && (
                  <button type="button" onClick={() => fechar(c.id)} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(34,197,94,0.10)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.2)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>Resolver</button>
                )}
              </div>
            </div>
          );
        })}
        {localChamados.length === 0 && <p className="text-sm text-center py-6" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhum chamado aberto.</p>}
      </div>
      {open ? (
        <form onSubmit={addChamado} className="glass rounded-xl p-4 flex flex-col gap-3">
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required className="admin-input" placeholder="Título do chamado *" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="admin-textarea" placeholder="Descrição do problema..." rows={3} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 justify-center" style={{ fontSize: "13px", padding: "9px 16px" }}>Abrir chamado</button>
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary" style={{ fontSize: "13px" }}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="w-full text-sm py-3 rounded-xl hover:bg-white/5 transition-all" style={{ border: "1px dashed rgba(255,255,255,0.10)", color: "#6B7280", fontFamily: "var(--font-inter), sans-serif", cursor: "pointer", background: "transparent" }}>
          + Novo chamado
        </button>
      )}
    </div>
  );
}

// ── Aba Proposta — tipos e helpers ────────────────────────────────────────────

type PropostaConteudo = {
  nome_sistema: string;
  tagline: string;
  validade_dias: number;
  contexto: Record<string, string>;
  dores: string[];
  modulos: Array<{ titulo: string; itens: string[] }>;
  plano_recomendado: "A" | "B";
  plano_a: { valor: number; extra_info: string; beneficios: string[] };
  plano_b: { start: number; mensalidade: number; limite: string; beneficios: string[] };
  cronograma: Array<{ periodo: string; descricao: string }>;
  proximos_passos: string[];
};

type FormProposta = {
  nome_sistema: string; tagline: string; validade_dias: string;
  ctx_empresa: string; ctx_segmento: string; ctx_tempo_mercado: string;
  ctx_estrutura: string; ctx_canais_venda: string; ctx_como_chegam_leads: string;
  ctx_quem_atende: string; ctx_controle_atual: string; ctx_retrabalho: string;
  dores_texto: string;
  modulos: Array<{ titulo: string; itens_texto: string }>;
  plano_recomendado: "A" | "B";
  plano_a_valor: string; plano_a_extra: string; plano_a_beneficios: string;
  plano_b_start: string; plano_b_mensalidade: string; plano_b_limite: string; plano_b_beneficios: string;
  cronograma: Array<{ periodo: string; descricao: string }>;
  proximos_passos_texto: string;
};

const DEFAULT_FORM: FormProposta = {
  nome_sistema: "", tagline: "", validade_dias: "30",
  ctx_empresa: "", ctx_segmento: "", ctx_tempo_mercado: "",
  ctx_estrutura: "", ctx_canais_venda: "", ctx_como_chegam_leads: "",
  ctx_quem_atende: "", ctx_controle_atual: "", ctx_retrabalho: "",
  dores_texto: "",
  modulos: [{ titulo: "", itens_texto: "" }],
  plano_recomendado: "B",
  plano_a_valor: "", plano_a_extra: "", plano_a_beneficios: "",
  plano_b_start: "", plano_b_mensalidade: "", plano_b_limite: "", plano_b_beneficios: "",
  cronograma: [{ periodo: "", descricao: "" }],
  proximos_passos_texto: "",
};

function formFromConteudo(c: Record<string, unknown> | null): FormProposta {
  if (!c) return DEFAULT_FORM;
  const ctx = (c.contexto as Record<string, string>) ?? {};
  const pa = (c.plano_a as Record<string, unknown>) ?? {};
  const pb = (c.plano_b as Record<string, unknown>) ?? {};
  return {
    nome_sistema: String(c.nome_sistema ?? ""),
    tagline: String(c.tagline ?? ""),
    validade_dias: String(c.validade_dias ?? 30),
    ctx_empresa: String(ctx.empresa ?? ""),
    ctx_segmento: String(ctx.segmento ?? ""),
    ctx_tempo_mercado: String(ctx.tempo_mercado ?? ""),
    ctx_estrutura: String(ctx.estrutura ?? ""),
    ctx_canais_venda: String(ctx.canais_venda ?? ""),
    ctx_como_chegam_leads: String(ctx.como_chegam_leads ?? ""),
    ctx_quem_atende: String(ctx.quem_atende ?? ""),
    ctx_controle_atual: String(ctx.controle_atual ?? ""),
    ctx_retrabalho: String(ctx.retrabalho ?? ""),
    dores_texto: ((c.dores as string[]) ?? []).join("\n"),
    modulos: ((c.modulos as Array<{ titulo: string; itens: string[] }>) ?? [{ titulo: "", itens: [] }])
      .map((m) => ({ titulo: m.titulo, itens_texto: (m.itens ?? []).join("\n") })),
    plano_recomendado: (c.plano_recomendado as "A" | "B") ?? "B",
    plano_a_valor: String(pa.valor ?? ""),
    plano_a_extra: String(pa.extra_info ?? ""),
    plano_a_beneficios: ((pa.beneficios as string[]) ?? []).join("\n"),
    plano_b_start: String(pb.start ?? ""),
    plano_b_mensalidade: String(pb.mensalidade ?? ""),
    plano_b_limite: String(pb.limite ?? ""),
    plano_b_beneficios: ((pb.beneficios as string[]) ?? []).join("\n"),
    cronograma: ((c.cronograma as Array<{ periodo: string; descricao: string }>) ?? [{ periodo: "", descricao: "" }]),
    proximos_passos_texto: ((c.proximos_passos as string[]) ?? []).join("\n"),
  };
}

function buildConteudo(f: FormProposta): PropostaConteudo {
  return {
    nome_sistema: f.nome_sistema,
    tagline: f.tagline,
    validade_dias: Number(f.validade_dias) || 30,
    contexto: {
      empresa: f.ctx_empresa, segmento: f.ctx_segmento, tempo_mercado: f.ctx_tempo_mercado,
      estrutura: f.ctx_estrutura, canais_venda: f.ctx_canais_venda,
      como_chegam_leads: f.ctx_como_chegam_leads, quem_atende: f.ctx_quem_atende,
      controle_atual: f.ctx_controle_atual, retrabalho: f.ctx_retrabalho,
    },
    dores: f.dores_texto.split("\n").map((d) => d.trim()).filter(Boolean),
    modulos: f.modulos.map((m) => ({
      titulo: m.titulo,
      itens: m.itens_texto.split("\n").map((i) => i.trim()).filter(Boolean),
    })),
    plano_recomendado: f.plano_recomendado,
    plano_a: {
      valor: Number(f.plano_a_valor) || 0,
      extra_info: f.plano_a_extra,
      beneficios: f.plano_a_beneficios.split("\n").map((b) => b.trim()).filter(Boolean),
    },
    plano_b: {
      start: Number(f.plano_b_start) || 0,
      mensalidade: Number(f.plano_b_mensalidade) || 0,
      limite: f.plano_b_limite,
      beneficios: f.plano_b_beneficios.split("\n").map((b) => b.trim()).filter(Boolean),
    },
    cronograma: f.cronograma.filter((c) => c.periodo || c.descricao),
    proximos_passos: f.proximos_passos_texto.split("\n").map((p) => p.trim()).filter(Boolean),
  };
}

// ── Proposta — Preview (visualização para o admin) ────────────────────────────

function PropostaPreview({ c, cliente, projetoNome }: { c: PropostaConteudo; cliente: Cliente; projetoNome: string }) {
  const CTX_LABELS: Record<string, string> = {
    empresa: "Empresa", segmento: "Segmento", tempo_mercado: "Tempo de mercado",
    estrutura: "Estrutura", canais_venda: "Canais de venda",
    como_chegam_leads: "Como chegam leads", quem_atende: "Quem atende",
    controle_atual: "Controle atual", retrabalho: "Retrabalho",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(155,107,181,0.12), rgba(46,155,175,0.10))", border: "1px solid rgba(155,107,181,0.25)" }}>
        <h2 className="text-3xl font-bold mb-1" style={{ color: "#9B6BB5", fontFamily: "var(--font-playfair), Georgia, serif" }}>{c.nome_sistema || projetoNome}</h2>
        {c.tagline && <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{c.tagline}</p>}
        <div className="mt-4 rounded-xl px-5 py-3 inline-block" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Proposta elaborada para</p>
          <p className="font-bold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{c.contexto.empresa || cliente.empresa}</p>
        </div>
        {c.validade_dias > 0 && (
          <p className="text-xs mt-3" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Validade: {c.validade_dias} dias</p>
        )}
      </div>

      {/* Contexto */}
      {Object.values(c.contexto).some(Boolean) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>1. Contexto e Diagnóstico</p>
          <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
            {Object.entries(CTX_LABELS).map(([key, label], i) => {
              const val = c.contexto[key];
              if (!val) return null;
              return (
                <div key={key} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < Object.keys(CTX_LABELS).length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <span className="text-xs font-semibold flex-shrink-0 w-40" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{label}</span>
                  <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{val}</span>
                </div>
              );
            })}
          </div>

          {c.dores.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>1.1 Principais dores identificadas</p>
              <ul className="flex flex-col gap-2">
                {c.dores.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                    <span className="text-purple-400 flex-shrink-0 mt-0.5">•</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Módulos */}
      {c.modulos.length > 0 && c.modulos[0].titulo && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>2. A Solução</p>
          <div className="flex flex-col gap-3">
            {c.modulos.map((m, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: "rgba(155,107,181,0.05)", border: "1px solid rgba(155,107,181,0.15)" }}>
                <p className="text-sm font-bold mb-2" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>{m.titulo}</p>
                <ul className="flex flex-col gap-1">
                  {m.itens.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: "#9B6BB5" }}>—</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planos */}
      {(c.plano_a.valor > 0 || c.plano_b.start > 0) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>3. Planos e Valores</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Plano A */}
            <div className="rounded-xl p-4" style={{ background: c.plano_recomendado === "A" ? "rgba(155,107,181,0.12)" : "rgba(255,255,255,0.03)", border: c.plano_recomendado === "A" ? "1px solid rgba(155,107,181,0.35)" : "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>Plano A — Exclusivo</p>
              {c.plano_a.valor > 0 && <p className="text-2xl font-bold mb-0.5" style={{ color: "#FFFFFF", fontFamily: "var(--font-playfair), Georgia, serif" }}>{money(c.plano_a.valor)}</p>}
              {c.plano_a.extra_info && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{c.plano_a.extra_info}</p>}
              <ul className="flex flex-col gap-1">
                {c.plano_a.beneficios.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B6BB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}
                  </li>
                ))}
              </ul>
            </div>
            {/* Plano B */}
            <div className="rounded-xl p-4" style={{ background: c.plano_recomendado === "B" ? "rgba(46,155,175,0.10)" : "rgba(255,255,255,0.03)", border: c.plano_recomendado === "B" ? "1px solid rgba(46,155,175,0.35)" : "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Plano B — Mensalidade</p>
                {c.plano_recomendado === "B" && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(46,155,175,0.2)", color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>★ Recomendado</span>}
              </div>
              {c.plano_b.start > 0 && (
                <p className="text-2xl font-bold mb-0.5" style={{ color: "#FFFFFF", fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  Start: {money(c.plano_b.start)} + {money(c.plano_b.mensalidade)}/mês
                </p>
              )}
              {c.plano_b.limite && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{c.plano_b.limite}</p>}
              <ul className="flex flex-col gap-1">
                {c.plano_b.beneficios.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E9BAF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cronograma */}
      {c.cronograma.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>4. Cronograma de Desenvolvimento</p>
          <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
            {c.cronograma.map((row, i) => (
              <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < c.cronograma.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <span className="text-xs font-semibold flex-shrink-0 w-28" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>{row.periodo}</span>
                <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{row.descricao}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Próximos passos */}
      {c.proximos_passos.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>5. Próximos Passos</p>
          <ol className="flex flex-col gap-2">
            {c.proximos_passos.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "rgba(155,107,181,0.15)", color: "#9B6BB5" }}>{i + 1}</span>
                {p}
              </li>
            ))}
          </ol>
          {c.validade_dias > 0 && (
            <p className="text-xs mt-5 text-center" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
              Esta proposta tem validade de {c.validade_dias} dias.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Aba Proposta — formulário completo ────────────────────────────────────────

function AbaProposta({ projeto, cliente, clienteId }: {
  projeto: Projeto; cliente: Cliente; clienteId: string;
}) {
  const [form, setForm] = useState<FormProposta>(() => formFromConteudo(projeto.proposta_conteudo));
  const [modo, setModo] = useState<"editar" | "visualizar">("editar");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function setField(field: keyof FormProposta, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setModulo(i: number, key: "titulo" | "itens_texto", value: string) {
    setForm((prev) => {
      const modulos = [...prev.modulos];
      modulos[i] = { ...modulos[i], [key]: value };
      return { ...prev, modulos };
    });
  }

  function addModulo() {
    setForm((prev) => ({ ...prev, modulos: [...prev.modulos, { titulo: "", itens_texto: "" }] }));
  }

  function removeModulo(i: number) {
    setForm((prev) => ({ ...prev, modulos: prev.modulos.filter((_, idx) => idx !== i) }));
  }

  function setCronograma(i: number, key: "periodo" | "descricao", value: string) {
    setForm((prev) => {
      const cronograma = [...prev.cronograma];
      cronograma[i] = { ...cronograma[i], [key]: value };
      return { ...prev, cronograma };
    });
  }

  function addCronograma() {
    setForm((prev) => ({ ...prev, cronograma: [...prev.cronograma, { periodo: "", descricao: "" }] }));
  }

  function removeCronograma(i: number) {
    setForm((prev) => ({ ...prev, cronograma: prev.cronograma.filter((_, idx) => idx !== i) }));
  }

  async function handleSave() {
    setSaving(true);
    const conteudo = buildConteudo(form);
    await salvarPropostaConteudo(projeto.id, conteudo, clienteId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  const inputClass = "admin-input";
  const labelClass = "admin-label";
  const areaClass = "admin-textarea";

  return (
    <div className="flex flex-col gap-5">
      {/* Barra de ações */}
      <div className="flex items-center justify-between gap-3">
        <div className="admin-tabs" style={{ flex: "unset" }}>
          <button type="button" onClick={() => setModo("editar")} className={`admin-tab ${modo === "editar" ? "active" : ""}`}>Editar</button>
          <button type="button" onClick={() => setModo("visualizar")} className={`admin-tab ${modo === "visualizar" ? "active" : ""}`}>Visualizar</button>
        </div>
        {modo === "editar" && (
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
            {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar proposta"}
          </button>
        )}
      </div>

      {modo === "visualizar" ? (
        <PropostaPreview c={buildConteudo(form)} cliente={cliente} projetoNome={projeto.nome} />
      ) : (
        <div className="flex flex-col gap-5">

          {/* Seção 1 — Cabeçalho */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Cabeçalho da Proposta</p>
            <div className="flex flex-col gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="admin-field">
                  <label className={labelClass}>Nome do sistema</label>
                  <input value={form.nome_sistema} onChange={(e) => setField("nome_sistema", e.target.value)} className={inputClass} placeholder="ex: IMOVI" />
                </div>
                <div className="admin-field">
                  <label className={labelClass}>Validade (dias)</label>
                  <input type="number" value={form.validade_dias} onChange={(e) => setField("validade_dias", e.target.value)} className={inputClass} placeholder="30" />
                </div>
              </div>
              <div className="admin-field">
                <label className={labelClass}>Tagline / subtítulo</label>
                <input value={form.tagline} onChange={(e) => setField("tagline", e.target.value)} className={inputClass} placeholder="ex: Sistema Inteligente de Gestão Imobiliária" />
              </div>
            </div>
          </div>

          {/* Seção 2 — Contexto */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Contexto do Cliente</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ["ctx_empresa", "Empresa"],
                ["ctx_segmento", "Segmento"],
                ["ctx_tempo_mercado", "Tempo de mercado"],
                ["ctx_estrutura", "Estrutura"],
                ["ctx_canais_venda", "Canais de venda"],
                ["ctx_como_chegam_leads", "Como chegam leads"],
                ["ctx_quem_atende", "Quem atende"],
                ["ctx_controle_atual", "Controle atual"],
                ["ctx_retrabalho", "Retrabalho"],
              ].map(([field, label]) => (
                <div key={field} className="admin-field">
                  <label className={labelClass}>{label}</label>
                  <input value={form[field as keyof FormProposta] as string} onChange={(e) => setField(field as keyof FormProposta, e.target.value)} className={inputClass} placeholder={label} />
                </div>
              ))}
            </div>
          </div>

          {/* Seção 3 — Dores */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Dores Identificadas</p>
            <p className="text-xs mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Uma dor por linha</p>
            <textarea value={form.dores_texto} onChange={(e) => setField("dores_texto", e.target.value)} className={areaClass} rows={6} placeholder={"Dificuldade em organizar clientes\nControle financeiro manual\n..."} />
          </div>

          {/* Seção 4 — Módulos */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Módulos da Solução</p>
              <button type="button" onClick={addModulo} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(46,155,175,0.1)", color: "#2E9BAF", border: "1px solid rgba(46,155,175,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>+ Módulo</button>
            </div>
            <div className="flex flex-col gap-4">
              {form.modulos.map((m, i) => (
                <div key={i} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2">
                    <input value={m.titulo} onChange={(e) => setModulo(i, "titulo", e.target.value)} className={`${inputClass} flex-1`} placeholder={`Módulo ${i + 1} — Nome`} />
                    {form.modulos.length > 1 && (
                      <button type="button" onClick={() => removeModulo(i)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)", cursor: "pointer" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="admin-field">
                    <label className={labelClass}>Itens (um por linha)</label>
                    <textarea value={m.itens_texto} onChange={(e) => setModulo(i, "itens_texto", e.target.value)} className={areaClass} rows={4} placeholder={"Funcionalidade 1\nFuncionalidade 2\n..."} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 5 — Planos */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Planos e Valores</p>
            <div className="admin-field mb-4">
              <label className={labelClass}>Plano recomendado</label>
              <select value={form.plano_recomendado} onChange={(e) => setField("plano_recomendado", e.target.value as "A" | "B")} className="admin-select">
                <option value="A">Plano A — Exclusivo</option>
                <option value="B">Plano B — Mensalidade</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Plano A */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>Plano A — Exclusivo</p>
                <div className="admin-field">
                  <label className={labelClass}>Valor único (R$)</label>
                  <input type="number" step="0.01" value={form.plano_a_valor} onChange={(e) => setField("plano_a_valor", e.target.value)} className={inputClass} placeholder="3500" />
                </div>
                <div className="admin-field">
                  <label className={labelClass}>Info extra (ex: + custo de IA)</label>
                  <input value={form.plano_a_extra} onChange={(e) => setField("plano_a_extra", e.target.value)} className={inputClass} placeholder="pagamento único + custo de IA..." />
                </div>
                <div className="admin-field">
                  <label className={labelClass}>Benefícios (um por linha)</label>
                  <textarea value={form.plano_a_beneficios} onChange={(e) => setField("plano_a_beneficios", e.target.value)} className={areaClass} rows={5} placeholder={"Sistema 100% seu\nSuporte gratuito por 2 meses\n..."} />
                </div>
              </div>
              {/* Plano B */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Plano B — Mensalidade</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="admin-field">
                    <label className={labelClass}>Start (R$)</label>
                    <input type="number" step="0.01" value={form.plano_b_start} onChange={(e) => setField("plano_b_start", e.target.value)} className={inputClass} placeholder="500" />
                  </div>
                  <div className="admin-field">
                    <label className={labelClass}>Mensalidade (R$)</label>
                    <input type="number" step="0.01" value={form.plano_b_mensalidade} onChange={(e) => setField("plano_b_mensalidade", e.target.value)} className={inputClass} placeholder="230" />
                  </div>
                </div>
                <div className="admin-field">
                  <label className={labelClass}>Limite / descrição</label>
                  <input value={form.plano_b_limite} onChange={(e) => setField("plano_b_limite", e.target.value)} className={inputClass} placeholder="até 30 leads cadastrados por mês" />
                </div>
                <div className="admin-field">
                  <label className={labelClass}>Benefícios (um por linha)</label>
                  <textarea value={form.plano_b_beneficios} onChange={(e) => setField("plano_b_beneficios", e.target.value)} className={areaClass} rows={5} placeholder={"Start pago no início do dev\n2ª mensalidade só após entrega\n..."} />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 6 — Cronograma */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Cronograma</p>
              <button type="button" onClick={addCronograma} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(46,155,175,0.1)", color: "#2E9BAF", border: "1px solid rgba(46,155,175,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>+ Linha</button>
            </div>
            <div className="flex flex-col gap-2">
              {form.cronograma.map((row, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={row.periodo} onChange={(e) => setCronograma(i, "periodo", e.target.value)} className={`${inputClass} w-36 flex-shrink-0`} placeholder="Semana 1–2" />
                  <input value={row.descricao} onChange={(e) => setCronograma(i, "descricao", e.target.value)} className={`${inputClass} flex-1`} placeholder="Descrição da etapa..." />
                  {form.cronograma.length > 1 && (
                    <button type="button" onClick={() => removeCronograma(i)} className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)", cursor: "pointer" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Seção 7 — Próximos passos */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Próximos Passos</p>
            <p className="text-xs mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Um passo por linha</p>
            <textarea value={form.proximos_passos_texto} onChange={(e) => setField("proximos_passos_texto", e.target.value)} className={areaClass} rows={5} placeholder={"Confirmar o plano escolhido\nRealizar pagamento do Start\n..."} />
          </div>

          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary self-start" style={{ fontSize: "13px", padding: "9px 20px" }}>
            {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar proposta"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function ProjetoTabs({ projeto, clienteId, cliente, diagnostico, itens, etapas, parcelas, chamados, mensalidades, totalPago, totalReceber }: Props) {
  const [tab, setTab] = useState<Tab>("Processo");

  const abertosCount = chamados.filter((c) => c.status === "aberto").length;
  const procDone = PROC_STEPS.filter((s) => projeto[s.campo as keyof Projeto] as boolean).length;

  return (
    <div>
      <div className="admin-tabs mb-5" style={{ overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`admin-tab ${tab === t ? "active" : ""}`} style={{ whiteSpace: "nowrap", position: "relative" }}>
            {t}
            {t === "Processo" && procDone < 7 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold" style={{ background: "rgba(155,107,181,0.2)", color: "#9B6BB5", fontSize: "10px" }}>
                {procDone}/7
              </span>
            )}
            {t === "Chamados" && abertosCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold" style={{ background: "#FCD34D", color: "#0A0A0A", fontSize: "10px" }}>
                {abertosCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Processo" && <AbaProcesso projeto={projeto} clienteId={clienteId} />}
      {tab === "Escopo" && <AbaEscopo projetoId={projeto.id} itens={itens} clienteId={clienteId} />}
      {tab === "Etapas" && <AbaEtapas projetoId={projeto.id} etapas={etapas} />}
      {tab === "Financeiro" && <AbaFinanceiro projeto={projeto} parcelas={parcelas} totalPago={totalPago} totalReceber={totalReceber} clienteId={clienteId} mensalidades={mensalidades} />}
      {tab === "Chamados" && <AbaChamados projetoId={projeto.id} clienteId={clienteId} chamados={chamados} />}
      {tab === "Proposta" && <AbaProposta projeto={projeto} cliente={cliente} clienteId={clienteId} />}
    </div>
  );
}
