"use client";

import { useState, useActionState } from "react";
import { abrirChamado } from "@/app/admin/sistemas/actions";
import { useRouter } from "next/navigation";

type PropostaConteudo = {
  nome_sistema?: string; tagline?: string; validade_dias?: number;
  contexto?: Record<string, string>;
  dores?: string[];
  modulos?: Array<{ titulo: string; itens: string[] }>;
  plano_recomendado?: "A" | "B";
  plano_a?: { valor?: number; extra_info?: string; beneficios?: string[] };
  plano_b?: { start?: number; mensalidade?: number; limite?: string; beneficios?: string[] };
  cronograma?: Array<{ periodo: string; descricao: string }>;
  proximos_passos?: string[];
};

type Projeto = { id: string; nome: string; descricao: string | null; status: string; data_inicio: string | null; prazo_entrega: string | null; valor_total: number | null; forma_pagamento: string | null; proposta_conteudo: PropostaConteudo | null };
type Diagnostico = { resolver_uma_coisa: string | null; impacto_resolucao: string | null } | null;
type Etapa = { id: string; projeto_id: string; nome: string; status: string; prazo: string | null; ordem: number };
type Item = { id: string; projeto_id: string; descricao: string; concluido: boolean };
type Chamado = { id: string; titulo: string; descricao: string | null; status: string; urgencia: string | null; prazo_resolucao: string | null; resposta: string | null; created_at: string };
type Cliente = { id: string; nome: string; empresa: string };

type Props = {
  cliente: Cliente;
  projetos: Projeto[];
  etapas: Etapa[];
  itens: Item[];
  chamados: Chamado[];
  diagnostico: Diagnostico;
};

function statusCor(s: string) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    "Em diagnóstico": { color: "#9CA3AF", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.2)" },
    "Proposta enviada": { color: "#FCD34D", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.2)" },
    "Aprovado": { color: "#2E9BAF", bg: "rgba(46,155,175,0.12)", border: "rgba(46,155,175,0.2)" },
    "Em desenvolvimento": { color: "#9B6BB5", bg: "rgba(155,107,181,0.12)", border: "rgba(155,107,181,0.2)" },
    "Entregue": { color: "#4ADE80", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.2)" },
    "Pausado": { color: "#FCD34D", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.15)" },
  };
  return map[s] ?? { color: "#9CA3AF", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.15)" };
}

function chamadoCor(s: string) {
  const map: Record<string, string> = { aberto: "#FCD34D", "em andamento": "#9B6BB5", resolvido: "#4ADE80" };
  return map[s] ?? "#9CA3AF";
}

function fmt(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR");
}

type FormState = { error?: string; success?: boolean };

function proximoDiaUtil(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function NovoChamado({ clienteId, projetoId }: { clienteId: string; projetoId: string }) {
  const router = useRouter();
  const minDate = proximoDiaUtil();

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_prev, fd) => {
      const result = await abrirChamado(clienteId, projetoId, fd);
      if (result.success) router.refresh();
      return result ?? {};
    },
    {}
  );

  if (state.success) {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
        <p className="text-sm font-semibold" style={{ color: "#4ADE80", fontFamily: "var(--font-inter), sans-serif" }}>
          Chamado aberto! Entraremos em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input name="titulo" required className="admin-input" placeholder="Título do chamado *" />
      <textarea name="descricao" className="admin-textarea" placeholder="Descreva o problema ou dúvida com detalhes..." rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <div className="admin-field">
          <label className="admin-label">Urgência</label>
          <select name="urgencia" className="admin-select" defaultValue="normal">
            <option value="baixa">Baixa</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
        <div className="admin-field">
          <label className="admin-label">Prazo desejado</label>
          <input name="prazo_resolucao" type="date" className="admin-input" min={minDate} />
        </div>
      </div>
      {state.error && <p className="text-xs" style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}>{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary justify-center" style={{ opacity: pending ? 0.7 : 1, fontSize: "14px" }}>
        {pending ? "Enviando..." : "Abrir chamado"}
      </button>
    </form>
  );
}

type Aba = "projeto" | "proposta" | "chamados";

export function PortalContent({ cliente, projetos, etapas, itens, chamados, diagnostico }: Props) {
  const [projetoAtivo, setProjetoAtivo] = useState<string | null>(projetos[0]?.id ?? null);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("projeto");
  const projeto = projetos.find((p) => p.id === projetoAtivo) ?? null;
  const temProposta = !!(projeto?.proposta_conteudo);

  const projetoEtapas = etapas.filter((e) => e.projeto_id === projetoAtivo);
  const projetoItens = itens.filter((i) => i.projeto_id === projetoAtivo);
  const concluidas = projetoEtapas.filter((e) => e.status === "concluído").length;
  const progresso = projetoEtapas.length > 0 ? Math.round((concluidas / projetoEtapas.length) * 100) : 0;

  if (!projetos.length) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Nenhum projeto iniciado ainda. Em breve você verá o andamento aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Seletor de projeto */}
      {projetos.length > 1 && (
        <div className="flex flex-col gap-2">
          <p className="admin-label">Projeto</p>
          <div className="flex flex-col gap-2">
            {projetos.map((p) => {
              const cor = statusCor(p.status);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProjetoAtivo(p.id)}
                  className="text-left rounded-xl px-4 py-3 transition-all"
                  style={{
                    background: projetoAtivo === p.id ? cor.bg : "rgba(255,255,255,0.03)",
                    border: projetoAtivo === p.id ? `1px solid ${cor.border}` : "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                  }}
                >
                  <p className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{p.nome}</p>
                  <p className="text-xs mt-0.5" style={{ color: cor.color, fontFamily: "var(--font-inter), sans-serif" }}>{p.status}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button type="button" onClick={() => setAbaAtiva("projeto")} className={`admin-tab ${abaAtiva === "projeto" ? "active" : ""}`}>
          Meu Projeto
        </button>
        {temProposta && (
          <button type="button" onClick={() => setAbaAtiva("proposta")} className={`admin-tab ${abaAtiva === "proposta" ? "active" : ""}`}>
            Proposta
          </button>
        )}
        <button type="button" onClick={() => setAbaAtiva("chamados")} className={`admin-tab ${abaAtiva === "chamados" ? "active" : ""}`}>
          Suporte
          {chamados.filter((c) => c.status !== "resolvido").length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold"
              style={{ background: "#FCD34D", color: "#0A0A0A", fontSize: "10px" }}>
              {chamados.filter((c) => c.status !== "resolvido").length}
            </span>
          )}
        </button>
      </div>

      {/* Aba Projeto */}
      {abaAtiva === "projeto" && projeto && (
        <div className="flex flex-col gap-5">
          {/* Status card */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {projeto.nome}
                </h2>
                {projeto.descricao && (
                  <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{projeto.descricao}</p>
                )}
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full flex-shrink-0 font-semibold"
                style={{ background: statusCor(projeto.status).bg, color: statusCor(projeto.status).color, border: `1px solid ${statusCor(projeto.status).border}`, fontFamily: "var(--font-inter), sans-serif" }}
              >
                {projeto.status}
              </span>
            </div>

            {projetoEtapas.length > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                  <span>Progresso geral</span><span>{progresso}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progresso}%` }} />
                </div>
              </div>
            )}

            {(projeto.data_inicio || projeto.prazo_entrega) && (
              <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
                {projeto.data_inicio && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Início</p>
                    <p className="text-sm text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{fmt(projeto.data_inicio)}</p>
                  </div>
                )}
                {projeto.prazo_entrega && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Previsão de entrega</p>
                    <p className="text-sm text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{fmt(projeto.prazo_entrega)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Proposta */}
          {(diagnostico?.resolver_uma_coisa || diagnostico?.impacto_resolucao || projeto.valor_total) && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
                Proposta
              </p>
              <div className="flex flex-col gap-4">
                {projeto.descricao && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>O que será desenvolvido</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{projeto.descricao}</p>
                  </div>
                )}
                {diagnostico?.resolver_uma_coisa && (
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "rgba(155,107,181,0.08)", border: "1px solid rgba(155,107,181,0.18)" }}
                  >
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Principal dor identificada</p>
                    <p className="text-sm italic leading-relaxed text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                      &ldquo;{diagnostico.resolver_uma_coisa}&rdquo;
                    </p>
                  </div>
                )}
                {diagnostico?.impacto_resolucao && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Impacto esperado</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{diagnostico.impacto_resolucao}</p>
                  </div>
                )}
                {(projeto.valor_total || projeto.forma_pagamento) && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Investimento</p>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                      {projeto.valor_total
                        ? `R$ ${projeto.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        : ""}
                      {projeto.valor_total && projeto.forma_pagamento ? " · " : ""}
                      {projeto.forma_pagamento ?? ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Etapas */}
          {projetoEtapas.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
                Etapas do Projeto
              </p>
              <div className="flex flex-col gap-3">
                {projetoEtapas.map((e, i) => {
                  const isConc = e.status === "concluído";
                  const isAnd = e.status === "em andamento";
                  return (
                    <div key={e.id} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{
                          background: isConc ? "rgba(34,197,94,0.15)" : isAnd ? "rgba(155,107,181,0.15)" : "rgba(255,255,255,0.05)",
                          color: isConc ? "#4ADE80" : isAnd ? "#9B6BB5" : "#4B5563",
                          border: `1px solid ${isConc ? "rgba(34,197,94,0.3)" : isAnd ? "rgba(155,107,181,0.3)" : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        {isConc ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : i + 1}
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-sm"
                          style={{
                            color: isConc ? "#6B7280" : "#D1D5DB",
                            textDecoration: isConc ? "line-through" : "none",
                            fontFamily: "var(--font-inter), sans-serif",
                          }}
                        >
                          {e.nome}
                        </p>
                        {e.prazo && !isConc && (
                          <p className="text-xs mt-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                            até {fmt(e.prazo)}
                          </p>
                        )}
                        {isAnd && (
                          <span className="text-xs mt-0.5 inline-block" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
                            Em andamento
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Escopo */}
          {projetoItens.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>
                O que está incluso
              </p>
              <div className="flex flex-col gap-2">
                {projetoItens.map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.concluido ? "#4ADE80" : "#9B6BB5"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span
                      className="text-sm"
                      style={{
                        color: item.concluido ? "#6B7280" : "#D1D5DB",
                        textDecoration: item.concluido ? "line-through" : "none",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {item.descricao}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aba Proposta */}
      {abaAtiva === "proposta" && projeto?.proposta_conteudo && (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(155,107,181,0.12), rgba(46,155,175,0.10))", border: "1px solid rgba(155,107,181,0.25)" }}>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "#9B6BB5", fontFamily: "var(--font-playfair), Georgia, serif" }}>
              {projeto.proposta_conteudo.nome_sistema || projeto.nome}
            </h2>
            {projeto.proposta_conteudo.tagline && (
              <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{projeto.proposta_conteudo.tagline}</p>
            )}
            <div className="mt-4 rounded-xl px-5 py-3 inline-block" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Proposta elaborada para</p>
              <p className="font-bold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{projeto.proposta_conteudo.contexto?.empresa || cliente.empresa}</p>
            </div>
            {(projeto.proposta_conteudo.validade_dias ?? 0) > 0 && (
              <p className="text-xs mt-3" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                Validade: {projeto.proposta_conteudo.validade_dias} dias
              </p>
            )}
          </div>

          {/* Contexto */}
          {projeto.proposta_conteudo.contexto && Object.values(projeto.proposta_conteudo.contexto).some(Boolean) && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Contexto e Diagnóstico</p>
              {(() => {
                const ctx = projeto.proposta_conteudo.contexto!;
                const labels: Record<string, string> = {
                  empresa: "Empresa", segmento: "Segmento", tempo_mercado: "Tempo de mercado",
                  estrutura: "Estrutura", canais_venda: "Canais de venda",
                  como_chegam_leads: "Como chegam leads", quem_atende: "Quem atende",
                  controle_atual: "Controle atual", retrabalho: "Retrabalho",
                };
                return (
                  <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                    {Object.entries(labels).map(([key, label], i) => {
                      const val = ctx[key];
                      if (!val) return null;
                      return (
                        <div key={key} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                          <span className="text-xs font-semibold flex-shrink-0 w-40" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{label}</span>
                          <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
              {(projeto.proposta_conteudo.dores ?? []).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Principais dores identificadas</p>
                  <ul className="flex flex-col gap-2">
                    {projeto.proposta_conteudo.dores!.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                        <span style={{ color: "#9B6BB5", flexShrink: 0 }}>•</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Módulos */}
          {(projeto.proposta_conteudo.modulos ?? []).length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>A Solução</p>
              <div className="flex flex-col gap-3">
                {projeto.proposta_conteudo.modulos!.map((m, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: "rgba(155,107,181,0.05)", border: "1px solid rgba(155,107,181,0.15)" }}>
                    <p className="text-sm font-bold mb-2" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>{m.titulo}</p>
                    <ul className="flex flex-col gap-1">
                      {m.itens.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                          <span className="flex-shrink-0" style={{ color: "#9B6BB5" }}>—</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Planos */}
          {(projeto.proposta_conteudo.plano_a?.valor || projeto.proposta_conteudo.plano_b?.start) && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Planos e Valores</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {projeto.proposta_conteudo.plano_a && (
                  <div className="rounded-xl p-4" style={{ background: projeto.proposta_conteudo.plano_recomendado === "A" ? "rgba(155,107,181,0.10)" : "rgba(255,255,255,0.03)", border: projeto.proposta_conteudo.plano_recomendado === "A" ? "1px solid rgba(155,107,181,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>Plano A — Exclusivo</p>
                    {projeto.proposta_conteudo.plano_a.valor ? <p className="text-2xl font-bold mb-0.5" style={{ color: "#fff", fontFamily: "var(--font-playfair), Georgia, serif" }}>R$ {projeto.proposta_conteudo.plano_a.valor.toLocaleString("pt-BR")}</p> : null}
                    {projeto.proposta_conteudo.plano_a.extra_info && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{projeto.proposta_conteudo.plano_a.extra_info}</p>}
                    <ul className="flex flex-col gap-1">
                      {(projeto.proposta_conteudo.plano_a.beneficios ?? []).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B6BB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {projeto.proposta_conteudo.plano_b && (
                  <div className="rounded-xl p-4" style={{ background: projeto.proposta_conteudo.plano_recomendado === "B" ? "rgba(46,155,175,0.08)" : "rgba(255,255,255,0.03)", border: projeto.proposta_conteudo.plano_recomendado === "B" ? "1px solid rgba(46,155,175,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Plano B — Mensalidade</p>
                      {projeto.proposta_conteudo.plano_recomendado === "B" && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(46,155,175,0.2)", color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>★ Recomendado</span>}
                    </div>
                    {(projeto.proposta_conteudo.plano_b.start || projeto.proposta_conteudo.plano_b.mensalidade) ? (
                      <p className="text-xl font-bold mb-0.5" style={{ color: "#fff", fontFamily: "var(--font-playfair), Georgia, serif" }}>
                        Start: R$ {(projeto.proposta_conteudo.plano_b.start ?? 0).toLocaleString("pt-BR")} + R$ {(projeto.proposta_conteudo.plano_b.mensalidade ?? 0).toLocaleString("pt-BR")}/mês
                      </p>
                    ) : null}
                    {projeto.proposta_conteudo.plano_b.limite && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{projeto.proposta_conteudo.plano_b.limite}</p>}
                    <ul className="flex flex-col gap-1">
                      {(projeto.proposta_conteudo.plano_b.beneficios ?? []).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E9BAF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cronograma */}
          {(projeto.proposta_conteudo.cronograma ?? []).length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Cronograma</p>
              <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                {projeto.proposta_conteudo.cronograma!.map((row, i) => (
                  <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < projeto.proposta_conteudo!.cronograma!.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <span className="text-xs font-semibold flex-shrink-0 w-28" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>{row.periodo}</span>
                    <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{row.descricao}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Próximos passos */}
          {(projeto.proposta_conteudo.proximos_passos ?? []).length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Próximos Passos</p>
              <ol className="flex flex-col gap-2">
                {projeto.proposta_conteudo.proximos_passos!.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                    <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "rgba(155,107,181,0.15)", color: "#9B6BB5" }}>{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
              {(projeto.proposta_conteudo.validade_dias ?? 0) > 0 && (
                <p className="text-xs mt-5 text-center" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                  Esta proposta tem validade de {projeto.proposta_conteudo.validade_dias} dias.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Aba Suporte */}
      {abaAtiva === "chamados" && (
        <div className="flex flex-col gap-4">
          {/* Histórico */}
          {chamados.length > 0 && (
            <div className="glass rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                Seus chamados
              </p>
              {chamados.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl p-4 flex flex-col gap-2"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderLeft: `3px solid ${chamadoCor(c.status)}`,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{c.titulo}</p>
                    <span className="text-xs flex-shrink-0" style={{ color: chamadoCor(c.status), fontFamily: "var(--font-inter), sans-serif" }}>
                      {c.status}
                    </span>
                  </div>
                  {c.descricao && <p className="text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{c.descricao}</p>}
                  {c.resposta && (
                    <div className="rounded-lg p-3 mt-1" style={{ background: "rgba(155,107,181,0.08)", border: "1px solid rgba(155,107,181,0.15)" }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Resposta BeSmart</p>
                      <p className="text-xs" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{c.resposta}</p>
                    </div>
                  )}
                  <p className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Novo chamado */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
              Abrir novo chamado
            </p>
            <NovoChamado clienteId={cliente.id} projetoId={projetoAtivo ?? projetos[0]?.id ?? ""} />
          </div>
        </div>
      )}
    </div>
  );
}
