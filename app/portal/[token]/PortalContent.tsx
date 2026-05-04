"use client";

import { useState, useActionState } from "react";
import { abrirChamado } from "@/app/admin/sistemas/actions";
import { useRouter } from "next/navigation";

type Projeto = { id: string; nome: string; descricao: string | null; status: string; data_inicio: string | null; prazo_entrega: string | null; valor_total: number | null };
type Etapa = { id: string; projeto_id: string; nome: string; status: string; prazo: string | null; ordem: number };
type Item = { id: string; projeto_id: string; descricao: string; concluido: boolean };
type Chamado = { id: string; titulo: string; descricao: string | null; status: string; resposta: string | null; created_at: string };
type Cliente = { id: string; nome: string; empresa: string };

type Props = {
  cliente: Cliente;
  projetos: Projeto[];
  etapas: Etapa[];
  itens: Item[];
  chamados: Chamado[];
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

function NovoChamado({ clienteId, projetoId }: { clienteId: string; projetoId: string }) {
  const router = useRouter();
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
      <textarea name="descricao" className="admin-textarea" placeholder="Descreva o problema ou dúvida..." rows={3} />
      {state.error && <p className="text-xs" style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}>{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary justify-center" style={{ opacity: pending ? 0.7 : 1, fontSize: "14px" }}>
        {pending ? "Enviando..." : "Abrir chamado"}
      </button>
    </form>
  );
}

export function PortalContent({ cliente, projetos, etapas, itens, chamados }: Props) {
  const [projetoAtivo, setProjetoAtivo] = useState<string | null>(projetos[0]?.id ?? null);
  const [abaAtiva, setAbaAtiva] = useState<"projeto" | "chamados">("projeto");

  const projeto = projetos.find((p) => p.id === projetoAtivo) ?? null;
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
