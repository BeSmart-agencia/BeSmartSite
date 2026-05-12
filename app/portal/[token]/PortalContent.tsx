"use client";

import { useState, useActionState } from "react";
import { abrirChamado, aceitarPropostaPortal, recusarPropostaPortal } from "@/app/admin/sistemas/actions";
import { useRouter } from "next/navigation";

type PropostaConteudo = {
  nome_sistema?: string; tagline?: string; tagline_final?: string; validade_dias?: number; data_emissao?: string;
  contexto_intro?: string;
  contexto?: Record<string, string> | Array<{ label: string; valor: string }>;
  necessidades_titulo?: string;
  dores?: string[];
  solucao_descricao?: string;
  modulos?: Array<{ titulo: string; itens: string[] }>;
  como_funciona?: Array<{ passo: string; descricao: string }>;
  diferenciais?: string[];
  plano_recomendado?: "A" | "B";
  plano_a?: { valor?: number; extra_info?: string; beneficios?: string[] };
  plano_b?: { start?: number; mensalidade?: number; limite?: string; beneficios?: string[] };
  plano_recomendacao_texto?: string;
  cronograma?: Array<{ periodo: string; descricao: string }>;
  condicoes_pagamento?: Array<{ item: string; descricao: string }>;
  proximos_passos?: string[];
};

type Projeto = { id: string; nome: string; descricao: string | null; status: string; data_inicio: string | null; prazo_entrega: string | null; valor_total: number | null; forma_pagamento: string | null };
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
  propostaConteudo: PropostaConteudo | null;
  propostaStatus: string | null;
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

// ── Resposta à proposta ───────────────────────────────────────────────────────

type RespostaState = { error?: string; success?: boolean; acao?: "aprovar" | "recusar" };

function RespostaProposta({ clienteId }: { clienteId: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState<"aprovar" | "recusar" | null>(null);

  const [state, formAction, pending] = useActionState<RespostaState, FormData>(
    async (_prev, fd) => {
      const acao = fd.get("acao") as "aprovar" | "recusar";
      const result = acao === "aprovar"
        ? await aceitarPropostaPortal(clienteId)
        : await recusarPropostaPortal(clienteId);
      if (result?.error) return { error: result.error };
      router.refresh();
      return { success: true, acao };
    },
    {}
  );

  if (state.success && state.acao === "aprovar") {
    return (
      <div className="rounded-2xl p-6 text-center mt-4" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <p className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Proposta aceita!</p>
        <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>Entraremos em contato em breve para dar início ao projeto.</p>
      </div>
    );
  }

  if (state.success && state.acao === "recusar") {
    return (
      <div className="rounded-2xl p-6 text-center mt-4" style={{ background: "rgba(107,114,128,0.08)", border: "1px solid rgba(107,114,128,0.2)" }}>
        <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>Entendemos. Se mudar de ideia ou quiser conversar, estamos à disposição.</p>
      </div>
    );
  }

  if (confirmando === "recusar") {
    return (
      <div className="rounded-2xl p-5 mt-4 flex flex-col gap-3 text-center" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
        <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Tem certeza que deseja recusar esta proposta?</p>
        <div className="flex gap-3 justify-center">
          <form action={formAction}>
            <input type="hidden" name="acao" value="recusar" />
            <button type="submit" disabled={pending} className="text-sm px-4 py-2 rounded-xl" style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>
              Sim, recusar
            </button>
          </form>
          <button type="button" onClick={() => setConfirmando(null)} className="text-sm px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      {state.error && <p className="text-xs text-center" style={{ color: "#F87171", fontFamily: "var(--font-inter), sans-serif" }}>{state.error}</p>}
      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="acao" value="aprovar" />
        <button type="submit" disabled={pending} className="btn-primary justify-center w-full" style={{ fontSize: "15px", padding: "14px", opacity: pending ? 0.7 : 1 }}>
          {pending ? "Processando..." : "Aceitar proposta"}
        </button>
      </form>
      <button type="button" onClick={() => setConfirmando("recusar")} className="text-xs text-center py-2" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif", background: "none", border: "none", cursor: "pointer" }}>
        Recusar proposta
      </button>
    </div>
  );
}

// ── Portal principal ──────────────────────────────────────────────────────────

type Aba = "projeto" | "proposta" | "chamados";

const APROVADOS = ["Aprovado", "Em desenvolvimento", "Entregue"];

export function PortalContent({ cliente, projetos, etapas, itens, chamados, diagnostico, propostaConteudo, propostaStatus }: Props) {
  const [projetoAtivo, setProjetoAtivo] = useState<string | null>(projetos[0]?.id ?? null);
  const projeto = projetos.find((p) => p.id === projetoAtivo) ?? null;

  const propostaAprovada = propostaStatus === "aprovada" || APROVADOS.includes(projeto?.status ?? "");
  const temProposta = !!(propostaConteudo);
  const propostaPendente = temProposta && !propostaAprovada && propostaStatus !== "recusada";

  const defaultAba: Aba = propostaPendente ? "proposta" : propostaAprovada ? "projeto" : temProposta ? "proposta" : "projeto";
  const [abaAtiva, setAbaAtiva] = useState<Aba>(defaultAba);

  const projetoEtapas = etapas.filter((e) => e.projeto_id === projetoAtivo);
  const projetoItens = itens.filter((i) => i.projeto_id === projetoAtivo);
  const concluidas = projetoEtapas.filter((e) => e.status === "concluído").length;
  const progresso = projetoEtapas.length > 0 ? Math.round((concluidas / projetoEtapas.length) * 100) : 0;

  if (!projetos.length && !temProposta) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Em breve você verá o andamento do seu projeto aqui.
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
        {temProposta && (
          <button type="button" onClick={() => setAbaAtiva("proposta")} className={`admin-tab ${abaAtiva === "proposta" ? "active" : ""}`}>
            Proposta
            {propostaPendente && (
              <span className="ml-1.5 inline-flex items-center justify-center w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FCD34D" }} />
            )}
          </button>
        )}
        {propostaAprovada && (
          <button type="button" onClick={() => setAbaAtiva("projeto")} className={`admin-tab ${abaAtiva === "projeto" ? "active" : ""}`}>
            Meu Projeto
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
      {abaAtiva === "proposta" && propostaConteudo && (() => {
        const pc = propostaConteudo;
        const F = "var(--font-inter), sans-serif";
        const P = "var(--font-playfair), Georgia, serif";

        // contexto: novo formato (array) ou legado (Record)
        let ctxRows: Array<{ label: string; valor: string }> = [];
        if (Array.isArray(pc.contexto)) {
          ctxRows = pc.contexto as Array<{ label: string; valor: string }>;
        } else if (pc.contexto && typeof pc.contexto === "object") {
          const legacy = pc.contexto as Record<string, string>;
          const map: Record<string, string> = { empresa: "Empresa", segmento: "Segmento", tempo_mercado: "Tempo de mercado", estrutura: "Estrutura", canais_venda: "Canais de venda", como_chegam_leads: "Como chegam leads", quem_atende: "Quem atende", controle_atual: "Controle atual", retrabalho: "Retrabalho" };
          ctxRows = Object.entries(map).filter(([k]) => legacy[k]).map(([k, label]) => ({ label, valor: legacy[k] }));
        }

        const dores = (pc.dores as string[]) ?? [];
        const modulos = (pc.modulos as Array<{ titulo: string; itens: string[] }>) ?? [];
        const comoFunciona = (pc.como_funciona as Array<{ passo: string; descricao: string }>) ?? [];
        const diferenciais = (pc.diferenciais as string[]) ?? [];
        const cronograma = (pc.cronograma as Array<{ periodo: string; descricao: string }>) ?? [];
        const condicoes = (pc.condicoes_pagamento as Array<{ item: string; descricao: string }>) ?? [];
        const proximos = (pc.proximos_passos as string[]) ?? [];
        const pa = pc.plano_a as { valor?: number; extra_info?: string; beneficios?: string[] } | null;
        const pb = pc.plano_b as { start?: number; mensalidade?: number; limite?: string; beneficios?: string[] } | null;
        const rec = pc.plano_recomendado as string;

        return (
          <div className="flex flex-col gap-5">
            {/* Capa */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(155,107,181,0.12), rgba(46,155,175,0.10))", border: "1px solid rgba(155,107,181,0.25)" }}>
              <h2 className="text-3xl font-bold mb-1" style={{ color: "#9B6BB5", fontFamily: P }}>{(pc.nome_sistema as string) || cliente.empresa}</h2>
              {pc.tagline && <p className="text-sm mb-4" style={{ color: "#9CA3AF", fontFamily: F }}>{pc.tagline as string}</p>}
              <div className="rounded-xl px-5 py-3 inline-block mb-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7280", fontFamily: F }}>Proposta elaborada para</p>
                <p className="font-bold text-white" style={{ fontFamily: F }}>{cliente.nome || cliente.empresa}</p>
              </div>
              <div className="flex justify-center gap-4">
                {pc.data_emissao && <p className="text-xs" style={{ color: "#4B5563", fontFamily: F }}>Emissão: {pc.data_emissao as string}</p>}
                {(pc.validade_dias as number) > 0 && <p className="text-xs" style={{ color: "#4B5563", fontFamily: F }}>Validade: {pc.validade_dias as number} dias</p>}
              </div>
            </div>

            {/* 1. Contexto */}
            {(pc.contexto_intro || ctxRows.length > 0) && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>1. Contexto e Diagnóstico</p>
                {pc.contexto_intro && <p className="text-sm leading-relaxed mb-4" style={{ color: "#D1D5DB", fontFamily: F }}>{pc.contexto_intro as string}</p>}
                {ctxRows.length > 0 && (
                  <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                    {ctxRows.map((row, i) => (
                      <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < ctxRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <span className="text-xs font-semibold flex-shrink-0 w-44" style={{ color: "#9CA3AF", fontFamily: F }}>{row.label}</span>
                        <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: F }}>{row.valor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 1.1 Necessidades */}
            {dores.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>1.1 {(pc.necessidades_titulo as string) || "Principais Necessidades Identificadas"}</p>
                <ul className="flex flex-col gap-2">
                  {dores.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#D1D5DB", fontFamily: F }}>
                      <span style={{ color: "#9B6BB5", flexShrink: 0 }}>•</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 2. A Solução */}
            {(pc.solucao_descricao || modulos.length > 0) && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: F }}>2. A Solução</p>
                {pc.solucao_descricao && <p className="text-sm leading-relaxed mb-4" style={{ color: "#D1D5DB", fontFamily: F }}>{pc.solucao_descricao as string}</p>}
                {modulos.filter(m => m.titulo).length > 0 && (
                  <div className="flex flex-col gap-3">
                    {modulos.filter(m => m.titulo).map((m, i) => (
                      <div key={i} className="rounded-xl p-4" style={{ background: "rgba(155,107,181,0.05)", border: "1px solid rgba(155,107,181,0.15)" }}>
                        <p className="text-sm font-bold mb-2" style={{ color: "#9B6BB5", fontFamily: F }}>{m.titulo}</p>
                        <ul className="flex flex-col gap-1">
                          {m.itens.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "#D1D5DB", fontFamily: F }}>
                              <span style={{ color: "#9B6BB5", flexShrink: 0 }}>—</span>{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Como funciona */}
            {comoFunciona.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: F }}>3. Como funciona na prática</p>
                <div className="flex flex-col gap-3">
                  {comoFunciona.map((s, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-20 flex-shrink-0 text-xs font-bold pt-0.5" style={{ color: "#2E9BAF", fontFamily: F }}>{s.passo}</div>
                      <p className="text-sm flex-1" style={{ color: "#D1D5DB", fontFamily: F }}>{s.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Diferenciais */}
            {diferenciais.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>4. Diferenciais</p>
                <ul className="flex flex-col gap-3">
                  {diferenciais.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#D1D5DB", fontFamily: F }}>
                      <span style={{ color: "#9B6BB5", flexShrink: 0, marginTop: 2 }}>•</span>
                      <span dangerouslySetInnerHTML={{ __html: d.replace(/^([^:]+:)/, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Planos */}
            {(pa?.valor || pb?.start) && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>5. Planos e Valores</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {pa && (
                    <div className="rounded-xl p-4" style={{ background: rec === "A" ? "rgba(155,107,181,0.10)" : "rgba(255,255,255,0.03)", border: rec === "A" ? "1px solid rgba(155,107,181,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#9CA3AF", fontFamily: F }}>Plano A — Exclusivo</p>
                      {pa.valor ? <p className="text-2xl font-bold mb-0.5" style={{ color: "#fff", fontFamily: P }}>R$ {pa.valor.toLocaleString("pt-BR")}</p> : null}
                      {pa.extra_info && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: F }}>{pa.extra_info}</p>}
                      <ul className="flex flex-col gap-1">{(pa.beneficios ?? []).map((b, i) => (<li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: F }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B6BB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}</li>))}</ul>
                    </div>
                  )}
                  {pb && (
                    <div className="rounded-xl p-4" style={{ background: rec === "B" ? "rgba(46,155,175,0.08)" : "rgba(255,255,255,0.03)", border: rec === "B" ? "1px solid rgba(46,155,175,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: F }}>Plano B — Mensalidade</p>
                        {rec === "B" && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(46,155,175,0.2)", color: "#2E9BAF", fontFamily: F }}>★ Recomendado</span>}
                      </div>
                      {(pb.start || pb.mensalidade) && <p className="text-xl font-bold mb-0.5" style={{ color: "#fff", fontFamily: P }}>Start: R$ {(pb.start ?? 0).toLocaleString("pt-BR")} + R$ {(pb.mensalidade ?? 0).toLocaleString("pt-BR")}/mês</p>}
                      {pb.limite && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: F }}>{pb.limite}</p>}
                      <ul className="flex flex-col gap-1">{(pb.beneficios ?? []).map((b, i) => (<li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: F }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E9BAF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}</li>))}</ul>
                    </div>
                  )}
                </div>
                {pc.plano_recomendacao_texto && (
                  <p className="text-sm leading-relaxed italic" style={{ color: "#9CA3AF", fontFamily: F, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>{pc.plano_recomendacao_texto as string}</p>
                )}
              </div>
            )}

            {/* 6. Cronograma */}
            {cronograma.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: F }}>6. Cronograma de Desenvolvimento</p>
                <div className="flex flex-col gap-0 mb-5" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                  {cronograma.map((row, i) => (
                    <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < cronograma.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                      <span className="text-xs font-semibold flex-shrink-0 w-32" style={{ color: "#2E9BAF", fontFamily: F }}>{row.periodo}</span>
                      <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: F }}>{row.descricao}</span>
                    </div>
                  ))}
                </div>
                {condicoes.length > 0 && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#2E9BAF", fontFamily: F }}>6.1 Condições de Pagamento</p>
                    <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                      {condicoes.map((row, i) => (
                        <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < condicoes.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                          <span className="text-xs font-semibold flex-shrink-0 w-44" style={{ color: "#9CA3AF", fontFamily: F }}>{row.item}</span>
                          <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: F }}>{row.descricao}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 7. Próximos passos */}
            {proximos.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>7. Próximos Passos</p>
                <ol className="flex flex-col gap-2">
                  {proximos.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#D1D5DB", fontFamily: F }}>
                      <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "rgba(155,107,181,0.15)", color: "#9B6BB5" }}>{i + 1}</span>{p}
                    </li>
                  ))}
                </ol>
                {(pc.validade_dias as number) > 0 && (
                  <p className="text-xs mt-5 text-center" style={{ color: "#4B5563", fontFamily: F }}>Esta proposta tem validade de {pc.validade_dias as number} dias.</p>
                )}
              </div>
            )}

            {/* Closing */}
            {pc.tagline_final && (
              <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(155,107,181,0.08), rgba(46,155,175,0.06))", border: "1px solid rgba(155,107,181,0.15)" }}>
                <p className="text-xl font-bold mb-1" style={{ color: "#9B6BB5", fontFamily: P }}>{pc.nome_sistema as string}</p>
                <p className="text-sm italic" style={{ color: "#6B7280", fontFamily: F }}>{pc.tagline_final as string}</p>
              </div>
            )}

            {/* Resposta */}
            {propostaAprovada ? (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <p className="text-sm font-semibold" style={{ color: "#4ADE80", fontFamily: F }}>Proposta aceita</p>
              </div>
            ) : propostaStatus === "recusada" ? (
              <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(107,114,128,0.08)", border: "1px solid rgba(107,114,128,0.2)" }}>
                <p className="text-sm" style={{ color: "#6B7280", fontFamily: F }}>Proposta recusada. Entre em contato se quiser conversar.</p>
              </div>
            ) : (
              <RespostaProposta clienteId={cliente.id} />
            )}
          </div>
        );
      })()}

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
