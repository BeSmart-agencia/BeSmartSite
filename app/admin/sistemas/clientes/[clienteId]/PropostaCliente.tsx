"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { salvarProposta, salvarPropostaStatus, excluirProposta, criarProposta } from "@/app/admin/sistemas/actions";

// ── Types ─────────────────────────────────────────────────────────────────────

type PropostaConteudo = {
  nome_sistema: string; tagline: string; tagline_final: string;
  validade_dias: number; data_emissao: string;
  contexto_intro: string;
  contexto: Array<{ label: string; valor: string }>;
  necessidades_titulo: string;
  dores: string[];
  solucao_descricao: string;
  modulos: Array<{ titulo: string; itens: string[] }>;
  como_funciona: Array<{ passo: string; descricao: string }>;
  diferenciais: string[];
  plano_recomendado: "A" | "B";
  plano_a: { valor: number; extra_info: string; beneficios: string[] };
  plano_b: { start: number; mensalidade: number; limite: string; beneficios: string[] };
  plano_recomendacao_texto: string;
  cronograma: Array<{ periodo: string; descricao: string }>;
  condicoes_pagamento: Array<{ item: string; descricao: string }>;
  proximos_passos: string[];
};

type FormProposta = {
  nome_sistema: string; tagline: string; tagline_final: string;
  validade_dias: string; data_emissao: string;
  contexto_intro: string;
  contexto_rows: Array<{ label: string; valor: string }>;
  necessidades_titulo: string; necessidades_texto: string;
  solucao_descricao: string;
  modulos: Array<{ titulo: string; itens_texto: string }>;
  como_funciona: Array<{ passo: string; descricao: string }>;
  diferenciais_texto: string;
  plano_recomendado: "A" | "B";
  plano_a_valor: string; plano_a_extra: string; plano_a_beneficios: string;
  plano_b_start: string; plano_b_mensalidade: string; plano_b_limite: string; plano_b_beneficios: string;
  plano_recomendacao_texto: string;
  cronograma: Array<{ periodo: string; descricao: string }>;
  condicoes_pagamento: Array<{ item: string; descricao: string }>;
  proximos_passos_texto: string;
};

const CTX_LABELS = ["Profissional", "Área de atuação", "Público atendido", "Canais atuais", "Materiais utilizados", "Controle atual", "Comunicação"];
const DEFAULT_CTX_ROWS = CTX_LABELS.map((label) => ({ label, valor: "" }));

const COND_LABELS = ["Pagamento de start", "1ª mensalidade", "Mensalidades seguintes", "Limite do plano", "Plano de crescimento", "Forma de pagamento"];

const DEFAULT_FORM: FormProposta = {
  nome_sistema: "", tagline: "", tagline_final: "", validade_dias: "30",
  data_emissao: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  contexto_intro: "",
  contexto_rows: DEFAULT_CTX_ROWS,
  necessidades_titulo: "Principais Necessidades Identificadas",
  necessidades_texto: "",
  solucao_descricao: "",
  modulos: [{ titulo: "", itens_texto: "" }],
  como_funciona: [{ passo: "Passo 1", descricao: "" }],
  diferenciais_texto: "",
  plano_recomendado: "B",
  plano_a_valor: "", plano_a_extra: "", plano_a_beneficios: "",
  plano_b_start: "", plano_b_mensalidade: "", plano_b_limite: "", plano_b_beneficios: "",
  plano_recomendacao_texto: "",
  cronograma: [{ periodo: "", descricao: "" }],
  condicoes_pagamento: COND_LABELS.map((item) => ({ item, descricao: item === "Forma de pagamento" ? "Pix, cartão de crédito ou boleto bancário" : "" })),
  proximos_passos_texto: "",
};

function formFromConteudo(c: Record<string, unknown> | null): FormProposta {
  if (!c) return DEFAULT_FORM;

  let contexto_rows: Array<{ label: string; valor: string }> = [];
  if (Array.isArray(c.contexto)) {
    contexto_rows = c.contexto as Array<{ label: string; valor: string }>;
  } else if (c.contexto && typeof c.contexto === "object") {
    const legacy = c.contexto as Record<string, string>;
    const map: Record<string, string> = {
      empresa: "Empresa", segmento: "Segmento", tempo_mercado: "Tempo de mercado",
      estrutura: "Estrutura", canais_venda: "Canais de venda",
      como_chegam_leads: "Como chegam leads", quem_atende: "Quem atende",
      controle_atual: "Controle atual", retrabalho: "Retrabalho",
    };
    contexto_rows = Object.entries(map)
      .filter(([k]) => legacy[k])
      .map(([k, label]) => ({ label, valor: legacy[k] }));
  }
  // Ensure all fixed labels are present (merge saved values into canonical labels)
  const savedMap = Object.fromEntries(contexto_rows.map((r) => [r.label, r.valor]));
  contexto_rows = CTX_LABELS.map((label) => ({ label, valor: savedMap[label] ?? "" }));

  const pa = (c.plano_a as Record<string, unknown>) ?? {};
  const pb = (c.plano_b as Record<string, unknown>) ?? {};

  return {
    nome_sistema: String(c.nome_sistema ?? ""),
    tagline: String(c.tagline ?? ""),
    tagline_final: String(c.tagline_final ?? ""),
    validade_dias: String(c.validade_dias ?? 30),
    data_emissao: String(c.data_emissao ?? ""),
    contexto_intro: String(c.contexto_intro ?? ""),
    contexto_rows,
    necessidades_titulo: String(c.necessidades_titulo ?? "Principais Necessidades Identificadas"),
    necessidades_texto: ((c.dores as string[]) ?? []).join("\n"),
    solucao_descricao: String(c.solucao_descricao ?? ""),
    modulos: ((c.modulos as Array<{ titulo: string; itens: string[] }>) ?? [{ titulo: "", itens: [] }])
      .map((m) => ({ titulo: m.titulo, itens_texto: (m.itens ?? []).join("\n") })),
    como_funciona: ((c.como_funciona as Array<{ passo: string; descricao: string }>) ?? [{ passo: "Passo 1", descricao: "" }]),
    diferenciais_texto: ((c.diferenciais as string[]) ?? []).join("\n"),
    plano_recomendado: (c.plano_recomendado as "A" | "B") ?? "B",
    plano_a_valor: String(pa.valor ?? ""),
    plano_a_extra: String(pa.extra_info ?? ""),
    plano_a_beneficios: ((pa.beneficios as string[]) ?? []).join("\n"),
    plano_b_start: String(pb.start ?? ""),
    plano_b_mensalidade: String(pb.mensalidade ?? ""),
    plano_b_limite: String(pb.limite ?? ""),
    plano_b_beneficios: ((pb.beneficios as string[]) ?? []).join("\n"),
    plano_recomendacao_texto: String(c.plano_recomendacao_texto ?? ""),
    cronograma: ((c.cronograma as Array<{ periodo: string; descricao: string }>) ?? [{ periodo: "", descricao: "" }]),
    condicoes_pagamento: (() => {
      const saved = (c.condicoes_pagamento as Array<{ item: string; descricao: string }>) ?? [];
      const savedMap = Object.fromEntries(saved.map((r) => [r.item, r.descricao]));
      return COND_LABELS.map((item) => ({ item, descricao: savedMap[item] ?? (item === "Forma de pagamento" ? "Pix, cartão de crédito ou boleto bancário" : "") }));
    })(),
    proximos_passos_texto: ((c.proximos_passos as string[]) ?? []).join("\n"),
  };
}

function buildConteudo(f: FormProposta): PropostaConteudo {
  return {
    nome_sistema: f.nome_sistema,
    tagline: f.tagline,
    tagline_final: f.tagline_final,
    validade_dias: Number(f.validade_dias) || 30,
    data_emissao: f.data_emissao,
    contexto_intro: f.contexto_intro,
    contexto: f.contexto_rows.filter((r) => r.label || r.valor),
    necessidades_titulo: f.necessidades_titulo || "Principais Necessidades Identificadas",
    dores: f.necessidades_texto.split("\n").map((d) => d.trim()).filter(Boolean),
    solucao_descricao: f.solucao_descricao,
    modulos: f.modulos.map((m) => ({
      titulo: m.titulo,
      itens: m.itens_texto.split("\n").map((i) => i.trim()).filter(Boolean),
    })),
    como_funciona: f.como_funciona.filter((s) => s.passo || s.descricao),
    diferenciais: f.diferenciais_texto.split("\n").map((d) => d.trim()).filter(Boolean),
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
    plano_recomendacao_texto: f.plano_recomendacao_texto,
    cronograma: f.cronograma.filter((c) => c.periodo || c.descricao),
    condicoes_pagamento: f.condicoes_pagamento.filter((c) => c.item || c.descricao),
    proximos_passos: f.proximos_passos_texto.split("\n").map((p) => p.trim()).filter(Boolean),
  };
}

function money(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

// ── Preview ───────────────────────────────────────────────────────────────────

function PropostaPreview({ c, empresaNome, clienteNome }: { c: PropostaConteudo; empresaNome: string; clienteNome: string }) {
  const F = "var(--font-inter), sans-serif";
  const P = "var(--font-playfair), Georgia, serif";
  return (
    <div className="flex flex-col gap-6">
      {/* Capa */}
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, rgba(155,107,181,0.14), rgba(46,155,175,0.10))", border: "1px solid rgba(155,107,181,0.28)" }}>
        <h2 className="text-4xl font-bold mb-2" style={{ color: "#9B6BB5", fontFamily: P }}>{c.nome_sistema || empresaNome}</h2>
        {c.tagline && <p className="text-sm mb-5" style={{ color: "#9CA3AF", fontFamily: F }}>{c.tagline}</p>}
        <div className="rounded-xl px-6 py-4 inline-block mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7280", fontFamily: F }}>Proposta elaborada para</p>
          <p className="font-bold text-white text-lg" style={{ fontFamily: F }}>{clienteNome || empresaNome}</p>
        </div>
        <div className="flex justify-center gap-6 mt-3">
          {c.data_emissao && <p className="text-xs" style={{ color: "#4B5563", fontFamily: F }}>Data de emissão: {c.data_emissao}</p>}
          {c.validade_dias > 0 && <p className="text-xs" style={{ color: "#4B5563", fontFamily: F }}>Validade: {c.validade_dias} dias</p>}
        </div>
      </div>

      {/* 1. Contexto */}
      {(c.contexto_intro || c.contexto.length > 0) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>1. Contexto e Diagnóstico</p>
          {c.contexto_intro && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#D1D5DB", fontFamily: F }}>{c.contexto_intro}</p>
          )}
          {c.contexto.length > 0 && (
            <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
              {c.contexto.map((row, i) => (
                <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < c.contexto.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <span className="text-xs font-semibold flex-shrink-0 w-44" style={{ color: "#9CA3AF", fontFamily: F }}>{row.label}</span>
                  <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: F }}>{row.valor}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 1.1 Necessidades */}
      {c.dores.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>1.1 {c.necessidades_titulo}</p>
          <ul className="flex flex-col gap-2">
            {c.dores.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#D1D5DB", fontFamily: F }}>
                <span style={{ color: "#9B6BB5", flexShrink: 0 }}>•</span>{d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2. A Solução */}
      {(c.solucao_descricao || c.modulos.length > 0) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: F }}>2. A Solução</p>
          {c.solucao_descricao && (
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#D1D5DB", fontFamily: F }}>{c.solucao_descricao}</p>
          )}
          {c.modulos.filter(m => m.titulo).length > 0 && (
            <div className="flex flex-col gap-3">
              {c.modulos.filter(m => m.titulo).map((m, i) => (
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
      {c.como_funciona.filter(s => s.descricao).length > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: F }}>3. Como funciona na prática</p>
          <div className="flex flex-col gap-3">
            {c.como_funciona.filter(s => s.descricao).map((s, i) => (
              <div key={i} className="flex gap-3 items-start rounded-xl p-3" style={{ background: "rgba(46,155,175,0.05)", border: "1px solid rgba(46,155,175,0.12)" }}>
                <span className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded-lg" style={{ background: "rgba(46,155,175,0.15)", color: "#2E9BAF", fontFamily: F }}>{s.passo}</span>
                <p className="text-sm pt-0.5" style={{ color: "#D1D5DB", fontFamily: F }}>{s.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Diferenciais */}
      {c.diferenciais.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>4. Diferenciais</p>
          <ul className="flex flex-col gap-3">
            {c.diferenciais.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#D1D5DB", fontFamily: F }}>
                <span style={{ color: "#9B6BB5", flexShrink: 0, marginTop: 2 }}>•</span>
                <span dangerouslySetInnerHTML={{ __html: d.replace(/^([^:]+:)/, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Planos */}
      {(c.plano_a.valor > 0 || c.plano_b.start > 0) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>5. Planos e Valores</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl p-4" style={{ background: c.plano_recomendado === "A" ? "rgba(155,107,181,0.12)" : "rgba(255,255,255,0.03)", border: c.plano_recomendado === "A" ? "1px solid rgba(155,107,181,0.35)" : "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#9CA3AF", fontFamily: F }}>Plano A — Exclusivo</p>
              {c.plano_a.valor > 0 && <p className="text-2xl font-bold mb-0.5" style={{ color: "#fff", fontFamily: P }}>{money(c.plano_a.valor)}</p>}
              {c.plano_a.extra_info && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: F }}>{c.plano_a.extra_info}</p>}
              <ul className="flex flex-col gap-1">
                {c.plano_a.beneficios.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: F }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B6BB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4" style={{ background: c.plano_recomendado === "B" ? "rgba(46,155,175,0.10)" : "rgba(255,255,255,0.03)", border: c.plano_recomendado === "B" ? "1px solid rgba(46,155,175,0.35)" : "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: F }}>Plano B — Mensalidade</p>
                {c.plano_recomendado === "B" && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(46,155,175,0.2)", color: "#2E9BAF", fontFamily: F }}>★ Recomendado</span>}
              </div>
              {c.plano_b.start > 0 && (
                <p className="text-xl font-bold mb-0.5" style={{ color: "#fff", fontFamily: P }}>
                  Start: {money(c.plano_b.start)} + {money(c.plano_b.mensalidade)}/mês
                </p>
              )}
              {c.plano_b.limite && <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: F }}>{c.plano_b.limite}</p>}
              <ul className="flex flex-col gap-1">
                {c.plano_b.beneficios.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#9CA3AF", fontFamily: F }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E9BAF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {c.plano_recomendacao_texto && (
            <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF", fontFamily: F, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>
              {c.plano_recomendacao_texto}
            </p>
          )}
        </div>
      )}

      {/* 6. Cronograma */}
      {(c.cronograma.length > 0 || c.condicoes_pagamento.filter(r => r.descricao).length > 0) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: F }}>6. Cronograma de Desenvolvimento</p>
          {c.cronograma.length > 0 && (
            <div className="flex flex-col gap-0 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(46,155,175,0.15)", marginBottom: c.condicoes_pagamento.filter(r => r.descricao).length > 0 ? "16px" : "0" }}>
              {c.cronograma.map((row, i) => (
                <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < c.cronograma.length - 1 ? "1px solid rgba(46,155,175,0.08)" : "none", background: i % 2 === 0 ? "rgba(46,155,175,0.04)" : "transparent" }}>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: "#2E9BAF", fontFamily: F, minWidth: "120px" }}>{row.periodo}</span>
                  <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: F }}>{row.descricao}</span>
                </div>
              ))}
            </div>
          )}
          {c.condicoes_pagamento.filter(r => r.descricao).length > 0 && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#2E9BAF", fontFamily: F }}>6.1 Condições de Pagamento</p>
              <div className="flex flex-col gap-0 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(46,155,175,0.15)" }}>
                {c.condicoes_pagamento.filter(r => r.descricao).map((row, i, arr) => (
                  <div key={i} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(46,155,175,0.08)" : "none", background: i % 2 === 0 ? "rgba(46,155,175,0.04)" : "transparent" }}>
                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#9CA3AF", fontFamily: F, minWidth: "160px" }}>{row.item}</span>
                    <span className="text-xs" style={{ color: "#D1D5DB", fontFamily: F }}>{row.descricao}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 7. Próximos passos */}
      {c.proximos_passos.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: F }}>7. Próximos Passos</p>
          <ol className="flex flex-col gap-2">
            {c.proximos_passos.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#D1D5DB", fontFamily: F }}>
                <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "rgba(155,107,181,0.15)", color: "#9B6BB5" }}>{i + 1}</span>
                {p}
              </li>
            ))}
          </ol>
          <p className="text-xs mt-5 text-center" style={{ color: "#4B5563", fontFamily: F }}>
            Esta proposta tem validade de {c.validade_dias} dias.
          </p>
        </div>
      )}

      {/* Closing */}
      {(c.tagline_final || c.nome_sistema) && (
        <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, rgba(155,107,181,0.08), rgba(46,155,175,0.06))", border: "1px solid rgba(155,107,181,0.15)" }}>
          <p className="text-2xl font-bold mb-2" style={{ color: "#9B6BB5", fontFamily: P }}>{c.nome_sistema}</p>
          {c.tagline_final && <p className="text-sm italic" style={{ color: "#6B7280", fontFamily: F }}>{c.tagline_final}</p>}
        </div>
      )}
    </div>
  );
}

function ctxFromCliente(clienteNome: string): Partial<FormProposta> {
  return {
    contexto_rows: CTX_LABELS.map((label) => ({
      label,
      valor: label === "Profissional" ? clienteNome : "",
    })),
  };
}

// ── Status opts ────────────────────────────────────────────────────────────────

const STATUS_OPTS = [
  { value: "nao_enviada", label: "Não enviada", color: "#6B7280" },
  { value: "rascunho", label: "Rascunho", color: "#9CA3AF" },
  { value: "enviada", label: "Enviada ao cliente", color: "#FCD34D" },
  { value: "aprovada", label: "Aprovada", color: "#4ADE80" },
  { value: "recusada", label: "Recusada", color: "#F87171" },
];

type PropostaRow = { id: string; conteudo: Record<string, unknown> | null; status: string; created_at: string };

type EditorProps = {
  proposta: PropostaRow;
  clienteId: string; clienteNome: string; empresaNome: string; segmento: string;
  onDelete: () => void;
};

// ── Editor (single proposal) ──────────────────────────────────────────────────

function PropostaEditor({ proposta, clienteId, clienteNome, empresaNome, segmento, onDelete }: EditorProps) {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState<FormProposta>(() => {
    const base = formFromConteudo(proposta.conteudo);
    if (!proposta.conteudo) return { ...base, ...ctxFromCliente(clienteNome) };
    const rows = base.contexto_rows.map((row) =>
      row.valor ? row : { ...row, valor: row.label === "Profissional" ? clienteNome : "" }
    );
    return { ...base, contexto_rows: rows };
  });
  const [modo, setModo] = useState<"editar" | "visualizar">("editar");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localStatus, setLocalStatus] = useState(proposta.status ?? "nao_enviada");
  const [confirmandoExcluir, setConfirmandoExcluir] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const router = useRouter();

  function set<K extends keyof FormProposta>(field: K, value: FormProposta[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // contexto rows
  function setCtxRow(i: number, key: "label" | "valor", value: string) {
    setForm((prev) => {
      const r = [...prev.contexto_rows];
      r[i] = { ...r[i], [key]: value };
      return { ...prev, contexto_rows: r };
    });
  }
  function addCtxRow() { setForm((p) => ({ ...p, contexto_rows: [...p.contexto_rows, { label: "", valor: "" }] })); }
  function removeCtxRow(i: number) { setForm((p) => ({ ...p, contexto_rows: p.contexto_rows.filter((_, idx) => idx !== i) })); }

  // modulos
  function setModulo(i: number, key: "titulo" | "itens_texto", value: string) {
    setForm((prev) => { const m = [...prev.modulos]; m[i] = { ...m[i], [key]: value }; return { ...prev, modulos: m }; });
  }
  function addModulo() { setForm((p) => ({ ...p, modulos: [...p.modulos, { titulo: "", itens_texto: "" }] })); }
  function removeModulo(i: number) { setForm((p) => ({ ...p, modulos: p.modulos.filter((_, idx) => idx !== i) })); }

  // como funciona
  function setComoFunciona(i: number, key: "passo" | "descricao", value: string) {
    setForm((prev) => { const s = [...prev.como_funciona]; s[i] = { ...s[i], [key]: value }; return { ...prev, como_funciona: s }; });
  }
  function addPasso() {
    setForm((p) => ({ ...p, como_funciona: [...p.como_funciona, { passo: `Passo ${p.como_funciona.length + 1}`, descricao: "" }] }));
  }
  function removePasso(i: number) { setForm((p) => ({ ...p, como_funciona: p.como_funciona.filter((_, idx) => idx !== i) })); }

  // cronograma
  function setCronograma(i: number, key: "periodo" | "descricao", value: string) {
    setForm((prev) => { const c = [...prev.cronograma]; c[i] = { ...c[i], [key]: value }; return { ...prev, cronograma: c }; });
  }
  function addCronograma() { setForm((p) => ({ ...p, cronograma: [...p.cronograma, { periodo: "", descricao: "" }] })); }
  function removeCronograma(i: number) { setForm((p) => ({ ...p, cronograma: p.cronograma.filter((_, idx) => idx !== i) })); }

  // condicoes
  function setCondicao(i: number, key: "item" | "descricao", value: string) {
    setForm((prev) => { const c = [...prev.condicoes_pagamento]; c[i] = { ...c[i], [key]: value }; return { ...prev, condicoes_pagamento: c }; });
  }
  function addCondicao() { setForm((p) => ({ ...p, condicoes_pagamento: [...p.condicoes_pagamento, { item: "", descricao: "" }] })); }
  function removeCondicao(i: number) { setForm((p) => ({ ...p, condicoes_pagamento: p.condicoes_pagamento.filter((_, idx) => idx !== i) })); }

  async function handleSave() {
    setSaving(true);
    await salvarProposta(proposta.id, clienteId, buildConteudo(form));
    await salvarPropostaStatus(proposta.id, clienteId, localStatus);
    setSaving(false);
    setSaved(true);
    setModo("visualizar");
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  async function handleDelete() {
    setExcluindo(true);
    await excluirProposta(proposta.id, clienteId);
    onDelete();
    router.refresh();
  }

  const statusAtual = STATUS_OPTS.find((o) => o.value === localStatus);
  const I = "admin-input";
  const L = "admin-label";
  const A = "admin-textarea";
  const removeBtn = (onClick: () => void) => (
    <button type="button" onClick={onClick} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)", cursor: "pointer" }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
  );
  const addBtn = (onClick: () => void, label: string) => (
    <button type="button" onClick={onClick} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(46,155,175,0.1)", color: "#2E9BAF", border: "1px solid rgba(46,155,175,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>{label}</button>
  );

  const nomeProposta = (form.nome_sistema || `Proposta ${new Date(proposta.created_at).toLocaleDateString("pt-BR")}`);

  return (
    <div className="glass rounded-2xl">
      {/* Header colapsável */}
      <button type="button" onClick={() => setAberto((v) => !v)} className="w-full flex items-center justify-between p-4 text-left" style={{ cursor: "pointer", background: "transparent", border: "none" }}>
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{nomeProposta}</p>
          {statusAtual && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${statusAtual.color}18`, color: statusAtual.color, border: `1px solid ${statusAtual.color}30`, fontFamily: "var(--font-inter), sans-serif" }}>
              {statusAtual.label}
            </span>
          )}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: aberto ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {aberto && (
        <div className="px-5 pb-5 flex flex-col gap-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4">
            <div className="flex items-center gap-2">
              <div className="admin-tabs" style={{ flex: "unset" }}>
                <button type="button" onClick={() => setModo("editar")} className={`admin-tab ${modo === "editar" ? "active" : ""}`}>Editar</button>
                <button type="button" onClick={() => setModo("visualizar")} className={`admin-tab ${modo === "visualizar" ? "active" : ""}`}>Visualizar</button>
              </div>
              {modo === "editar" && (
                <button type="button" onClick={() => setForm((p) => ({ ...p, ...ctxFromCliente(clienteNome) }))}
                  className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(46,155,175,0.08)", color: "#2E9BAF", border: "1px solid rgba(46,155,175,0.2)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>
                  ↺ Preencher dados do cliente
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select value={localStatus} onChange={(e) => setLocalStatus(e.target.value)} className="admin-select" style={{ fontSize: "12px", padding: "6px 10px" }}>
                {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button type="button" onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
                {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
              </button>
              {!confirmandoExcluir ? (
                <button type="button" onClick={() => setConfirmandoExcluir(true)} className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>
                  Excluir
                </button>
              ) : (
                <>
                  <button type="button" onClick={handleDelete} disabled={excluindo} className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>
                    {excluindo ? "..." : "Confirmar"}
                  </button>
                  <button type="button" onClick={() => setConfirmandoExcluir(false)} className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          {modo === "visualizar" ? (
            <PropostaPreview c={buildConteudo(form)} empresaNome={empresaNome} clienteNome={clienteNome} />
          ) : (
            <div className="flex flex-col gap-5">

              {/* CAPA */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Capa</p>
                <div className="flex flex-col gap-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="admin-field">
                      <label className={L}>Nome do sistema</label>
                      <input value={form.nome_sistema} onChange={(e) => set("nome_sistema", e.target.value)} className={I} placeholder="ex: NINNA" />
                    </div>
                    <div className="admin-field">
                      <label className={L}>Validade (dias)</label>
                      <input type="number" value={form.validade_dias} onChange={(e) => set("validade_dias", e.target.value)} className={I} placeholder="30" />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className={L}>Tagline (subtítulo do sistema)</label>
                    <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={I} placeholder="ex: Aplicativo de Acompanhamento para Doulas e Gestantes" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="admin-field">
                      <label className={L}>Data de emissão</label>
                      <input value={form.data_emissao} onChange={(e) => set("data_emissao", e.target.value)} className={I} placeholder="maio de 2026" />
                    </div>
                    <div className="admin-field">
                      <label className={L}>Tagline final (closing page)</label>
                      <input value={form.tagline_final} onChange={(e) => set("tagline_final", e.target.value)} className={I} placeholder="cada gestação. um cuidado único." />
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. CONTEXTO */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>1. Contexto e Diagnóstico</p>
                <div className="flex flex-col gap-3">
                  <div className="admin-field">
                    <label className={L}>Parágrafo introdutório</label>
                    <textarea value={form.contexto_intro} onChange={(e) => set("contexto_intro", e.target.value)} className={A} rows={3} placeholder="A partir das conversas iniciais com [cliente], identificamos..." />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {form.contexto_rows.map((row, i) => (
                      <div key={row.label} className="admin-field">
                        <label className={L}>{row.label}</label>
                        <input value={row.valor} onChange={(e) => setCtxRow(i, "valor", e.target.value)} className={I} placeholder={row.label} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1.1 NECESSIDADES */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>1.1 Necessidades / Dores</p>
                <div className="flex flex-col gap-3">
                  <div className="admin-field">
                    <label className={L}>Título da seção</label>
                    <input value={form.necessidades_titulo} onChange={(e) => set("necessidades_titulo", e.target.value)} className={I} placeholder="Principais Necessidades Identificadas" />
                  </div>
                  <div className="admin-field">
                    <label className={L}>Necessidades (uma por linha)</label>
                    <textarea value={form.necessidades_texto} onChange={(e) => set("necessidades_texto", e.target.value)} className={A} rows={7} placeholder={"Centralizar o acompanhamento de cada cliente\nEntregar materiais de forma profissional\n..."} />
                  </div>
                </div>
              </div>

              {/* 2. SOLUÇÃO */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>2. A Solução</p>
                <div className="flex flex-col gap-4">
                  <div className="admin-field">
                    <label className={L}>Descrição geral da solução</label>
                    <textarea value={form.solucao_descricao} onChange={(e) => set("solucao_descricao", e.target.value)} className={A} rows={3} placeholder="O [sistema] é um aplicativo desenvolvido sob medida para..." />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Módulos</p>
                      {addBtn(addModulo, "+ Módulo")}
                    </div>
                    <div className="flex flex-col gap-3">
                      {form.modulos.map((m, i) => (
                        <div key={i} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <div className="flex gap-2 items-center">
                            <input value={m.titulo} onChange={(e) => setModulo(i, "titulo", e.target.value)} className={`${I} flex-1`} placeholder={`Módulo ${i + 1} — Nome`} />
                            {form.modulos.length > 1 && removeBtn(() => removeModulo(i))}
                          </div>
                          <textarea value={m.itens_texto} onChange={(e) => setModulo(i, "itens_texto", e.target.value)} className={A} rows={4} placeholder={"— Funcionalidade 1\n— Funcionalidade 2\n..."} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. COMO FUNCIONA */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>3. Como funciona na prática</p>
                  {addBtn(addPasso, "+ Passo")}
                </div>
                <div className="flex flex-col gap-2">
                  {form.como_funciona.map((s, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input value={s.passo} onChange={(e) => setComoFunciona(i, "passo", e.target.value)} className={`${I} w-28 flex-shrink-0`} placeholder="Passo 1" />
                      <textarea value={s.descricao} onChange={(e) => setComoFunciona(i, "descricao", e.target.value)} className={`${A} flex-1`} rows={2} placeholder="Descrição do passo..." />
                      {form.como_funciona.length > 1 && removeBtn(() => removePasso(i))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. DIFERENCIAIS */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>4. Diferenciais</p>
                <p className="text-xs mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Um diferencial por linha. Use &quot;Título: descrição&quot; para destacar o título em negrito.</p>
                <textarea value={form.diferenciais_texto} onChange={(e) => set("diferenciais_texto", e.target.value)} className={A} rows={5} placeholder={"Profissionalização do serviço: a cliente vive uma experiência completa...\nPresença sem estar online 24h: dicas pré-cadastradas...\nSegurança e tranquilidade: alertas automáticos..."} />
              </div>

              {/* 5. PLANOS */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>5. Planos e Valores</p>
                <div className="admin-field mb-4">
                  <label className={L}>Plano recomendado</label>
                  <select value={form.plano_recomendado} onChange={(e) => set("plano_recomendado", e.target.value as "A" | "B")} className="admin-select">
                    <option value="A">Plano A — Exclusivo</option>
                    <option value="B">Plano B — Mensalidade</option>
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 mb-4">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>Plano A — Exclusivo</p>
                    <div className="admin-field">
                      <label className={L}>Valor único (R$)</label>
                      <input type="number" step="0.01" value={form.plano_a_valor} onChange={(e) => set("plano_a_valor", e.target.value)} className={I} placeholder="3500" />
                    </div>
                    <div className="admin-field">
                      <label className={L}>Info extra (ex: + custo de IA ~R$ 80–150/mês)</label>
                      <input value={form.plano_a_extra} onChange={(e) => set("plano_a_extra", e.target.value)} className={I} placeholder="pagamento único + custo de IA..." />
                    </div>
                    <div className="admin-field">
                      <label className={L}>Benefícios (um por linha)</label>
                      <textarea value={form.plano_a_beneficios} onChange={(e) => set("plano_a_beneficios", e.target.value)} className={A} rows={5} placeholder={"Aplicativo 100% seu, com sua marca\nPublicação nas lojas em seu nome\n..."} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>Plano B — Mensalidade</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="admin-field">
                        <label className={L}>Start (R$)</label>
                        <input type="number" step="0.01" value={form.plano_b_start} onChange={(e) => set("plano_b_start", e.target.value)} className={I} placeholder="500" />
                      </div>
                      <div className="admin-field">
                        <label className={L}>Mensalidade (R$)</label>
                        <input type="number" step="0.01" value={form.plano_b_mensalidade} onChange={(e) => set("plano_b_mensalidade", e.target.value)} className={I} placeholder="230" />
                      </div>
                    </div>
                    <div className="admin-field">
                      <label className={L}>Limite</label>
                      <input value={form.plano_b_limite} onChange={(e) => set("plano_b_limite", e.target.value)} className={I} placeholder="até 30 clientes cadastradas ativas" />
                    </div>
                    <div className="admin-field">
                      <label className={L}>Benefícios (um por linha)</label>
                      <textarea value={form.plano_b_beneficios} onChange={(e) => set("plano_b_beneficios", e.target.value)} className={A} rows={5} placeholder={"Start pago no início do desenvolvimento\n2ª mensalidade só após entrega\n..."} />
                    </div>
                  </div>
                </div>
                <div className="admin-field">
                  <label className={L}>Texto de recomendação de plano</label>
                  <textarea value={form.plano_recomendacao_texto} onChange={(e) => set("plano_recomendacao_texto", e.target.value)} className={A} rows={2} placeholder="Recomendamos o Plano B para quem quer começar com investimento inicial acessível..." />
                </div>
              </div>

              {/* 6. CRONOGRAMA */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>6. Cronograma</p>
                  {addBtn(addCronograma, "+ Linha")}
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  {form.cronograma.map((row, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={row.periodo} onChange={(e) => setCronograma(i, "periodo", e.target.value)} className={`${I} w-36 flex-shrink-0`} placeholder="Semana 1–3" />
                      <input value={row.descricao} onChange={(e) => setCronograma(i, "descricao", e.target.value)} className={`${I} flex-1`} placeholder="Descrição da fase..." />
                      {form.cronograma.length > 1 && removeBtn(() => removeCronograma(i))}
                    </div>
                  ))}
                </div>

                {/* 6.1 Condições de pagamento */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>6.1 Condições de Pagamento</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {form.condicoes_pagamento.map((row, i) => (
                    <div key={row.item} className="admin-field">
                      <label className={L}>{row.item}</label>
                      <input value={row.descricao} onChange={(e) => setCondicao(i, "descricao", e.target.value)} className={I} placeholder={row.item} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. PRÓXIMOS PASSOS */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>7. Próximos Passos</p>
                <p className="text-xs mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Um passo por linha</p>
                <textarea value={form.proximos_passos_texto} onChange={(e) => set("proximos_passos_texto", e.target.value)} className={A} rows={6} placeholder={"Confirmar a escolha do plano (A ou B) e sinalizar aceite desta proposta\nRealizar o pagamento do Start (Plano B) ou entrada (Plano A)\n..."} />
              </div>

              <button type="button" onClick={handleSave} disabled={saving} className="btn-primary self-start" style={{ fontSize: "13px", padding: "9px 20px" }}>
                {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar proposta"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── List wrapper (exported) ───────────────────────────────────────────────────

type ListProps = {
  clienteId: string; empresaNome: string; clienteNome: string; clienteContato: string; segmento: string;
  propostas: PropostaRow[];
};

export function PropostaCliente({ clienteId, empresaNome, clienteNome, clienteContato, segmento, propostas: initial }: ListProps) {
  const [propostas, setPropostas] = useState<PropostaRow[]>(initial);
  const [criando, setCriando] = useState(false);
  const router = useRouter();

  async function handleNova() {
    setCriando(true);
    const res = await criarProposta(clienteId);
    setCriando(false);
    if (res?.id) {
      setPropostas((prev) => [{ id: res.id, conteudo: null, status: "nao_enviada", created_at: new Date().toISOString() }, ...prev]);
    }
    router.refresh();
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Propostas {propostas.length > 0 ? `(${propostas.length})` : ""}
        </h2>
        <button type="button" onClick={handleNova} disabled={criando} className="btn-secondary" style={{ fontSize: "13px", padding: "8px 16px" }}>
          {criando ? "Criando..." : "+ Nova Proposta"}
        </button>
      </div>

      {propostas.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-sm mb-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhuma proposta criada ainda.</p>
          <button type="button" onClick={handleNova} disabled={criando} className="btn-primary" style={{ fontSize: "13px" }}>
            {criando ? "Criando..." : "+ Nova Proposta"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {propostas.map((p) => (
            <PropostaEditor
              key={p.id}
              proposta={p}
              clienteId={clienteId}
              clienteNome={clienteNome}
              empresaNome={empresaNome}
              segmento={segmento}
              onDelete={() => setPropostas((prev) => prev.filter((x) => x.id !== p.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
