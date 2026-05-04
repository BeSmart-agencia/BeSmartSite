import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrintButton } from "./PrintButton";

type Props = { params: Promise<{ clienteId: string }> };

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="form-block flex flex-col gap-3">
      <p className="form-block-title">{titulo}</p>
      {children}
    </div>
  );
}

function Campo({ label, valor }: { label: string; valor: string | string[] | boolean | null | undefined }) {
  if (valor === null || valor === undefined || valor === "" || (Array.isArray(valor) && valor.length === 0)) return null;

  let display: string;
  if (typeof valor === "boolean") display = valor ? "Sim" : "Não";
  else if (Array.isArray(valor)) display = valor.join(", ");
  else display = valor;

  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 text-sm">
      <span className="diag-label text-xs uppercase tracking-wider font-semibold pt-0.5 leading-tight" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
        {label}
      </span>
      <span className="diag-value leading-relaxed" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
        {display}
      </span>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export default async function VerDiagnosticoPage({ params }: Props) {
  const { clienteId } = await params;

  const [{ data: cliente }, { data: d }] = await Promise.all([
    supabase.from("clientes").select("id, nome, empresa").eq("id", clienteId).single(),
    supabase.from("diagnosticos").select("*").eq("cliente_id", clienteId).maybeSingle(),
  ]);

  if (!cliente) notFound();
  if (!d) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto text-center">
        <p className="text-sm mb-4" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Nenhum diagnóstico salvo para este cliente.
        </p>
        <Link href={`/admin/sistemas/diagnostico/${clienteId}`} className="btn-primary" style={{ fontSize: "14px" }}>
          Fazer diagnóstico
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <Link
            href={`/admin/sistemas/clientes/${clienteId}`}
            className="no-print inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:text-white"
            style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
          >
            <ArrowLeftIcon />
            {cliente.empresa}
          </Link>
          <p className="section-label mb-1">Diagnóstico</p>
          <h1
            className="text-2xl font-bold text-white diag-title"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {cliente.empresa}
          </h1>
          <p className="text-sm mt-0.5 diag-subtitle" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            {cliente.nome}
          </p>
        </div>
        <div className="flex gap-2 no-print">
          <PrintButton />
          <Link
            href={`/admin/sistemas/diagnostico/${clienteId}`}
            className="btn-secondary flex-shrink-0"
            style={{ fontSize: "13px", padding: "8px 16px" }}
          >
            <EditIcon />
            Editar
          </Link>
        </div>
      </div>

      {/* Principal dor em destaque */}
      {d.resolver_uma_coisa && (
        <div
          className="rounded-2xl p-5 mb-5 diag-dor"
          style={{ background: "rgba(155,107,181,0.08)", border: "1px solid rgba(155,107,181,0.2)" }}
        >
          <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
            Principal dor
          </p>
          <p className="text-base italic leading-relaxed text-white diag-dor-text" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            &ldquo;{d.resolver_uma_coisa}&rdquo;
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">

        <Bloco titulo="01 — A Empresa">
          <Campo label="O que faz" valor={d.empresa_descricao} />
          <Campo label="Tempo de mercado" valor={d.tempo_mercado} />
          <Campo label="Funcionários" valor={d.num_funcionarios} />
          <Campo label="Canais de venda" valor={d.canais_venda} />
          <Campo label="Ferramentas atuais" valor={d.ferramentas_atuais} />
        </Bloco>

        <Bloco titulo="02 — Operação e Dia a Dia">
          <Campo label="Tarefas que tomam mais tempo" valor={d.tarefas_mais_tempo} />
          <Campo label="O que automatizar" valor={d.o_que_automatizar} />
          <Campo label="Ferramentas integradas" valor={d.ferramentas_integradas} />
          <Campo label="Obs. integração" valor={d.ferramentas_integradas_obs} />
          <Campo label="Processos param" valor={d.processos_parados} />
          <Campo label="Qual processo para" valor={d.processos_parados_qual} />
        </Bloco>

        <Bloco titulo="03 — Atendimento e Leads">
          <Campo label="Como chegam leads" valor={d.como_chegam_leads} />
          <Campo label="Quem responde" valor={d.quem_responde_leads} />
          <Campo label="Tempo de resposta" valor={d.tempo_resposta} />
          <Campo label="Perde clientes" valor={d.perde_clientes} />
          <Campo label="Com que frequência" valor={d.perde_clientes_freq} />
          <Campo label="Tem script" valor={d.tem_script} />
          <Campo label="Taxa de conversão" valor={d.taxa_conversao} />
        </Bloco>

        <Bloco titulo="04 — Processos Internos">
          <Campo label="Controle de tarefas" valor={d.controle_tarefas} />
          <Campo label="Onboarding de cliente" valor={d.onboarding_cliente} />
          <Campo label="Tempo p/ novo cliente" valor={d.tempo_novo_cliente} />
          <Campo label="Controle financeiro" valor={d.controle_pagamentos} />
          <Campo label="Como faz controle" valor={d.controle_pagamentos_como} />
          <Campo label="Onde há retrabalho" valor={d.onde_retrabalho} />
        </Bloco>

        <Bloco titulo="05 — Prospecção">
          <Campo label="Como prospecta" valor={d.como_prospecta} />
          <Campo label="Prospecção ativa" valor={d.prospeccao_ativa} />
          <Campo label="Como foi" valor={d.prospeccao_ativa_como} />
          <Campo label="Maior obstáculo" valor={d.maior_obstaculo} />
        </Bloco>

        <Bloco titulo="06 — Dores e Prioridades">
          <Campo label="Resolver uma coisa" valor={d.resolver_uma_coisa} />
          <Campo label="O que tira o sono" valor={d.o_que_tira_sono} />
          <Campo label="Já tentou resolver" valor={d.tentou_resolver} />
          <Campo label="Impacto da solução" valor={d.impacto_resolucao} />
          <Campo label="Prazo importante" valor={d.prazo_importante} />
        </Bloco>

        <Bloco titulo="07 — Contexto do Projeto">
          <Campo label="Orçamento" valor={d.orcamento} />
          <Campo label="Forma de pagamento" valor={d.preferencia_pagamento} />
          <Campo label="Contato interno" valor={d.contato_interno_nome} />
          <Campo label="WhatsApp contato" valor={d.contato_interno_wa} />
          <Campo label="Tem técnico" valor={d.tem_tecnico} />
          <Campo label="Prazo de entrega" valor={d.prazo_entrega} />
          <Campo label="Observações finais" valor={d.observacoes_finais} />
        </Bloco>

      </div>

      <div className="no-print flex gap-3 mt-6 pb-6">
        <Link
          href={`/admin/sistemas/diagnostico/${clienteId}`}
          className="btn-secondary flex-1 justify-center text-center"
          style={{ fontSize: "14px" }}
        >
          <EditIcon />
          Editar diagnóstico
        </Link>
        <Link
          href={`/admin/sistemas/clientes/${clienteId}`}
          className="btn-primary flex-1 justify-center"
          style={{ fontSize: "14px" }}
        >
          Ver perfil do cliente
        </Link>
      </div>
    </div>
  );
}
