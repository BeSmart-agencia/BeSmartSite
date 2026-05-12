"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { salvarPropostaCliente, salvarPropostaStatusCliente } from "@/app/admin/sistemas/actions";

type PropostaConteudo = {
  nome_sistema: string; tagline: string; validade_dias: number;
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

function money(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

const CTX_LABELS: Record<string, string> = {
  empresa: "Empresa", segmento: "Segmento", tempo_mercado: "Tempo de mercado",
  estrutura: "Estrutura", canais_venda: "Canais de venda",
  como_chegam_leads: "Como chegam leads", quem_atende: "Quem atende",
  controle_atual: "Controle atual", retrabalho: "Retrabalho",
};

function PropostaPreview({ c, empresaNome }: { c: PropostaConteudo; empresaNome: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(155,107,181,0.12), rgba(46,155,175,0.10))", border: "1px solid rgba(155,107,181,0.25)" }}>
        <h2 className="text-3xl font-bold mb-1" style={{ color: "#9B6BB5", fontFamily: "var(--font-playfair), Georgia, serif" }}>{c.nome_sistema || empresaNome}</h2>
        {c.tagline && <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{c.tagline}</p>}
        <div className="mt-4 rounded-xl px-5 py-3 inline-block" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Proposta elaborada para</p>
          <p className="font-bold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{c.contexto.empresa || empresaNome}</p>
        </div>
        {c.validade_dias > 0 && (
          <p className="text-xs mt-3" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Validade: {c.validade_dias} dias</p>
        )}
      </div>

      {Object.values(c.contexto).some(Boolean) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>1. Contexto e Diagnóstico</p>
          <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
            {Object.entries(CTX_LABELS).map(([key, label], i) => {
              const val = c.contexto[key];
              if (!val) return null;
              return (
                <div key={key} className="flex gap-3 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
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
                    <span style={{ color: "#9B6BB5", flexShrink: 0 }}>•</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
                      <span style={{ color: "#9B6BB5", flexShrink: 0 }}>—</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {(c.plano_a.valor > 0 || c.plano_b.start > 0) && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>3. Planos e Valores</p>
          <div className="grid sm:grid-cols-2 gap-4">
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

const STATUS_OPTS = [
  { value: "nao_enviada", label: "Não enviada", color: "#6B7280" },
  { value: "rascunho", label: "Rascunho", color: "#9CA3AF" },
  { value: "enviada", label: "Enviada ao cliente", color: "#FCD34D" },
  { value: "aprovada", label: "Aprovada", color: "#4ADE80" },
  { value: "recusada", label: "Recusada", color: "#F87171" },
];

type DiagnosticoContexto = {
  tempo_mercado: string; num_funcionarios: string;
  canais_venda: string; como_chegam_leads: string;
  quem_responde_leads: string; ferramentas_atuais: string;
  onde_retrabalho: string;
};

type Props = {
  clienteId: string;
  empresaNome: string;
  segmento: string;
  propostaConteudo: Record<string, unknown> | null;
  propostaStatus: string | null;
  diagnosticoContexto: DiagnosticoContexto | null;
};

function ctxFromDiag(empresaNome: string, segmento: string, d: DiagnosticoContexto | null): Partial<FormProposta> {
  if (!d) return {};
  return {
    ctx_empresa: empresaNome,
    ctx_segmento: segmento,
    ctx_tempo_mercado: d.tempo_mercado,
    ctx_estrutura: d.num_funcionarios,
    ctx_canais_venda: d.canais_venda,
    ctx_como_chegam_leads: d.como_chegam_leads,
    ctx_quem_atende: d.quem_responde_leads,
    ctx_controle_atual: d.ferramentas_atuais,
    ctx_retrabalho: d.onde_retrabalho,
  };
}

export function PropostaCliente({ clienteId, empresaNome, segmento, propostaConteudo, propostaStatus, diagnosticoContexto }: Props) {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState<FormProposta>(() => {
    const base = formFromConteudo(propostaConteudo);
    if (!propostaConteudo && diagnosticoContexto) {
      return { ...base, ...ctxFromDiag(empresaNome, segmento, diagnosticoContexto) };
    }
    return base;
  });
  const [modo, setModo] = useState<"editar" | "visualizar">("editar");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localStatus, setLocalStatus] = useState(propostaStatus ?? "nao_enviada");
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
    await salvarPropostaCliente(clienteId, conteudo);
    await salvarPropostaStatusCliente(clienteId, localStatus);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  const inputClass = "admin-input";
  const labelClass = "admin-label";
  const areaClass = "admin-textarea";

  const statusAtual = STATUS_OPTS.find((o) => o.value === localStatus);

  return (
    <div className="glass rounded-2xl mb-6">
      {/* Header colapsável */}
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ cursor: "pointer", background: "transparent", border: "none" }}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Proposta Comercial
          </h2>
          {statusAtual && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: `${statusAtual.color}18`, color: statusAtual.color, border: `1px solid ${statusAtual.color}30`, fontFamily: "var(--font-inter), sans-serif" }}
            >
              {statusAtual.label}
            </span>
          )}
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: aberto ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {aberto && (
        <div className="px-5 pb-5 flex flex-col gap-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-2">
              <div className="admin-tabs" style={{ flex: "unset" }}>
                <button type="button" onClick={() => setModo("editar")} className={`admin-tab ${modo === "editar" ? "active" : ""}`}>Editar</button>
                <button type="button" onClick={() => setModo("visualizar")} className={`admin-tab ${modo === "visualizar" ? "active" : ""}`}>Visualizar</button>
              </div>
              {diagnosticoContexto && modo === "editar" && (
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, ...ctxFromDiag(empresaNome, segmento, diagnosticoContexto) }))}
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(46,155,175,0.08)", color: "#2E9BAF", border: "1px solid rgba(46,155,175,0.2)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
                  title="Preenche os campos de contexto com os dados do diagnóstico"
                >
                  ↺ Sincronizar diagnóstico
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value)}
                className="admin-select"
                style={{ fontSize: "12px", padding: "6px 10px" }}
              >
                {STATUS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button type="button" onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
                {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
              </button>
            </div>
          </div>

          {modo === "visualizar" ? (
            <PropostaPreview c={buildConteudo(form)} empresaNome={empresaNome} />
          ) : (
            <div className="flex flex-col gap-5">
              {/* Cabeçalho */}
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

              {/* Contexto */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Contexto do Cliente</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {([
                    ["ctx_empresa", "Empresa"],
                    ["ctx_segmento", "Segmento"],
                    ["ctx_tempo_mercado", "Tempo de mercado"],
                    ["ctx_estrutura", "Estrutura"],
                    ["ctx_canais_venda", "Canais de venda"],
                    ["ctx_como_chegam_leads", "Como chegam leads"],
                    ["ctx_quem_atende", "Quem atende"],
                    ["ctx_controle_atual", "Controle atual"],
                    ["ctx_retrabalho", "Retrabalho"],
                  ] as [keyof FormProposta, string][]).map(([field, label]) => (
                    <div key={field} className="admin-field">
                      <label className={labelClass}>{label}</label>
                      <input value={form[field] as string} onChange={(e) => setField(field, e.target.value)} className={inputClass} placeholder={label} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dores */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>Dores Identificadas</p>
                <p className="text-xs mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Uma dor por linha</p>
                <textarea value={form.dores_texto} onChange={(e) => setField("dores_texto", e.target.value)} className={areaClass} rows={6} placeholder={"Dificuldade em organizar clientes\nControle financeiro manual\n..."} />
              </div>

              {/* Módulos */}
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

              {/* Planos */}
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
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>Plano A — Exclusivo</p>
                    <div className="admin-field">
                      <label className={labelClass}>Valor único (R$)</label>
                      <input type="number" step="0.01" value={form.plano_a_valor} onChange={(e) => setField("plano_a_valor", e.target.value)} className={inputClass} placeholder="3500" />
                    </div>
                    <div className="admin-field">
                      <label className={labelClass}>Info extra</label>
                      <input value={form.plano_a_extra} onChange={(e) => setField("plano_a_extra", e.target.value)} className={inputClass} placeholder="pagamento único + custo de IA..." />
                    </div>
                    <div className="admin-field">
                      <label className={labelClass}>Benefícios (um por linha)</label>
                      <textarea value={form.plano_a_beneficios} onChange={(e) => setField("plano_a_beneficios", e.target.value)} className={areaClass} rows={5} placeholder={"Sistema 100% seu\nSuporte gratuito por 2 meses\n..."} />
                    </div>
                  </div>
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

              {/* Cronograma */}
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

              {/* Próximos passos */}
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
      )}
    </div>
  );
}
