"use client";

import { useActionState, useState } from "react";
import { salvarDiagnostico } from "@/app/admin/sistemas/actions";
import Link from "next/link";

type Props = {
  clienteId: string;
  initial: Record<string, unknown> | null;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="form-block flex flex-col gap-4">
      <p className="form-block-title">{title}</p>
      {children}
    </div>
  );
}

function CheckboxGroup({ name, options, initial }: { name: string; options: string[]; initial?: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            value={opt}
            defaultChecked={initial?.includes(opt)}
            className="accent-purple-400 w-4 h-4"
            style={{ accentColor: "#9B6BB5" }}
          />
          <span className="text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function YesNo({ name, initial }: { name: string; initial?: boolean | null }) {
  const [value, setValue] = useState<string>(
    initial === true ? "sim" : initial === false ? "nao" : ""
  );

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <div className="toggle-group">
        <button
          type="button"
          onClick={() => setValue("sim")}
          className={`toggle-btn ${value === "sim" ? "selected-yes" : ""}`}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => setValue("nao")}
          className={`toggle-btn ${value === "nao" ? "selected-no" : ""}`}
        >
          Não
        </button>
      </div>
    </>
  );
}

function TextArea({ name, placeholder, initial, rows = 3 }: { name: string; placeholder?: string; initial?: string | null; rows?: number }) {
  return (
    <textarea
      name={name}
      className="admin-textarea"
      placeholder={placeholder}
      defaultValue={initial ?? ""}
      rows={rows}
    />
  );
}

function Input({ name, placeholder, initial }: { name: string; placeholder?: string; initial?: string | null }) {
  return (
    <input name={name} className="admin-input" placeholder={placeholder} defaultValue={initial ?? ""} />
  );
}

function Select({ name, options, initial }: { name: string; options: string[]; initial?: string | null }) {
  return (
    <select name={name} className="admin-select" defaultValue={initial ?? ""}>
      <option value="">Selecionar...</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

type State = { error?: string; success?: boolean };

export function DiagnosticoForm({ clienteId, initial: d }: Props) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      return await salvarDiagnostico(clienteId, formData);
    },
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">

      {/* BLOCO 1 */}
      <Block title="01 — A Empresa">
        <Field label="O que a empresa faz">
          <TextArea name="empresa_descricao" placeholder="Descreva o negócio..." initial={d?.empresa_descricao as string} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tempo de mercado">
            <Input name="tempo_mercado" placeholder="Ex: 3 anos" initial={d?.tempo_mercado as string} />
          </Field>
          <Field label="Nº de funcionários">
            <Input name="num_funcionarios" placeholder="Ex: 5-10" initial={d?.num_funcionarios as string} />
          </Field>
        </div>
        <Field label="Canais de venda principais">
          <CheckboxGroup
            name="canais_venda"
            options={["WhatsApp", "Instagram", "Site", "Indicação", "Loja física", "Outro"]}
            initial={d?.canais_venda as string[]}
          />
        </Field>
        <Field label="Ferramentas que usa hoje">
          <TextArea name="ferramentas_atuais" placeholder="CRM, plataformas, apps..." initial={d?.ferramentas_atuais as string} />
        </Field>
      </Block>

      {/* BLOCO 2 */}
      <Block title="02 — Operação e Dia a Dia">
        <Field label="Quais tarefas tomam mais tempo?">
          <TextArea name="tarefas_mais_tempo" placeholder="Descreva as atividades..." initial={d?.tarefas_mais_tempo as string} />
        </Field>
        <Field label="O que poderia ser automatizado?">
          <TextArea name="o_que_automatizar" placeholder="Processos manuais recorrentes..." initial={d?.o_que_automatizar as string} />
        </Field>
        <Field label="As ferramentas se conversam?">
          <YesNo name="ferramentas_integradas" initial={d?.ferramentas_integradas as boolean} />
        </Field>
        <Field label="Observação (integração)">
          <Input name="ferramentas_integradas_obs" placeholder="Como dados circulam..." initial={d?.ferramentas_integradas_obs as string} />
        </Field>
        <Field label="Processos travam quando alguém falta?">
          <YesNo name="processos_parados" initial={d?.processos_parados as boolean} />
        </Field>
        <Field label="Qual processo para?">
          <Input name="processos_parados_qual" placeholder="Ex: Emissão de NF, atendimento..." initial={d?.processos_parados_qual as string} />
        </Field>
      </Block>

      {/* BLOCO 3 */}
      <Block title="03 — Atendimento e Leads">
        <Field label="Como os leads chegam hoje?">
          <CheckboxGroup
            name="como_chegam_leads"
            options={["WhatsApp", "E-mail", "Formulário", "Telefone", "Indicação"]}
            initial={d?.como_chegam_leads as string[]}
          />
        </Field>
        <Field label="Quem responde os leads?">
          <Input name="quem_responde_leads" placeholder="Nome / cargo / departamento" initial={d?.quem_responde_leads as string} />
        </Field>
        <Field label="Tempo médio de resposta">
          <Select
            name="tempo_resposta"
            options={["Imediato", "Algumas horas", "No mesmo dia", "Mais de um dia"]}
            initial={d?.tempo_resposta as string}
          />
        </Field>
        <Field label="Perde clientes por demora no atendimento?">
          <YesNo name="perde_clientes" initial={d?.perde_clientes as boolean} />
        </Field>
        <Field label="Com que frequência?">
          <Input name="perde_clientes_freq" placeholder="Ex: Semanalmente, raramente..." initial={d?.perde_clientes_freq as string} />
        </Field>
        <Field label="Tem script ou processo de qualificação?">
          <YesNo name="tem_script" initial={d?.tem_script as boolean} />
        </Field>
        <Field label="Taxa de conversão estimada">
          <Input name="taxa_conversao" placeholder="Ex: 20%, não sabe..." initial={d?.taxa_conversao as string} />
        </Field>
      </Block>

      {/* BLOCO 4 */}
      <Block title="04 — Processos Internos">
        <Field label="Como controla tarefas da equipe?">
          <TextArea name="controle_tarefas" placeholder="Planilha, WhatsApp, ferramenta..." initial={d?.controle_tarefas as string} />
        </Field>
        <Field label="Como é o onboarding de cliente novo?">
          <TextArea name="onboarding_cliente" placeholder="Passos do processo atual..." initial={d?.onboarding_cliente as string} />
        </Field>
        <Field label="Tempo para cliente começar a ser atendido">
          <Input name="tempo_novo_cliente" placeholder="Ex: 1 semana, imediato..." initial={d?.tempo_novo_cliente as string} />
        </Field>
        <Field label="Tem controle de pagamentos/inadimplência?">
          <YesNo name="controle_pagamentos" initial={d?.controle_pagamentos as boolean} />
        </Field>
        <Field label="Como faz esse controle?">
          <Input name="controle_pagamentos_como" placeholder="Planilha, sistema, contador..." initial={d?.controle_pagamentos_como as string} />
        </Field>
        <Field label="Onde ocorre mais retrabalho?">
          <TextArea name="onde_retrabalho" placeholder="Área/processo com mais retrabalho..." initial={d?.onde_retrabalho as string} />
        </Field>
      </Block>

      {/* BLOCO 5 */}
      <Block title="05 — Prospecção">
        <Field label="Como prospecta clientes hoje?">
          <TextArea name="como_prospecta" placeholder="Indicação, redes sociais, ads..." initial={d?.como_prospecta as string} />
        </Field>
        <Field label="Já tentou prospecção ativa?">
          <YesNo name="prospeccao_ativa" initial={d?.prospeccao_ativa as boolean} />
        </Field>
        <Field label="Como foi?">
          <TextArea name="prospeccao_ativa_como" placeholder="O que funcionou ou não..." initial={d?.prospeccao_ativa_como as string} />
        </Field>
        <Field label="Maior obstáculo para vender mais">
          <TextArea name="maior_obstaculo" placeholder="Tempo, equipe, leads, processo..." initial={d?.maior_obstaculo as string} />
        </Field>
      </Block>

      {/* BLOCO 6 */}
      <Block title="06 — Dores e Prioridades">
        <Field label="Se pudesse resolver UMA coisa hoje, o que seria?">
          <TextArea name="resolver_uma_coisa" placeholder="A principal dor..." initial={d?.resolver_uma_coisa as string} />
        </Field>
        <Field label="O que tira o sono em relação ao negócio?">
          <TextArea name="o_que_tira_sono" placeholder="Preocupações, riscos..." initial={d?.o_que_tira_sono as string} />
        </Field>
        <Field label="Já tentou resolver antes? Como foi?">
          <TextArea name="tentou_resolver" placeholder="Tentativas anteriores..." initial={d?.tentou_resolver as string} />
        </Field>
        <Field label="Impacto se o problema fosse resolvido">
          <TextArea name="impacto_resolucao" placeholder="O que mudaria no negócio..." initial={d?.impacto_resolucao as string} />
        </Field>
        <Field label="Tem prazo ou data importante?">
          <Input name="prazo_importante" placeholder="Ex: Antes do verão, Q1 2026..." initial={d?.prazo_importante as string} />
        </Field>
      </Block>

      {/* BLOCO 7 */}
      <Block title="07 — Contexto do Projeto">
        <Field label="Orçamento disponível">
          <Select
            name="orcamento"
            options={["Até R$2k", "R$2k–R$5k", "R$5k–R$10k", "Acima de R$10k", "A definir"]}
            initial={d?.orcamento as string}
          />
        </Field>
        <Field label="Preferência de pagamento">
          <Select
            name="preferencia_pagamento"
            options={["Pagamento único", "Mensalidade", "Entrada + parcelas"]}
            initial={d?.preferencia_pagamento as string}
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ponto de contato (nome)">
            <Input name="contato_interno_nome" placeholder="Nome" initial={d?.contato_interno_nome as string} />
          </Field>
          <Field label="WhatsApp do contato">
            <Input name="contato_interno_wa" placeholder="(51) 99999-9999" initial={d?.contato_interno_wa as string} />
          </Field>
        </div>
        <Field label="Tem alguém técnico na equipe?">
          <YesNo name="tem_tecnico" initial={d?.tem_tecnico as boolean} />
        </Field>
        <Field label="Prazo desejado para entrega">
          <Input name="prazo_entrega" placeholder="Ex: 30 dias, 3 meses..." initial={d?.prazo_entrega as string} />
        </Field>
        <Field label="Observações finais">
          <TextArea name="observacoes_finais" placeholder="Qualquer informação adicional..." initial={d?.observacoes_finais as string} rows={4} />
        </Field>
      </Block>

      {/* Actions */}
      {state.error && (
        <p className="text-sm text-center" style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}>
          {state.error}
        </p>
      )}

      {state.success && (
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#4ADE80", fontFamily: "var(--font-inter), sans-serif" }}>
            Diagnóstico salvo com sucesso!
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pb-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary flex-1 justify-center"
          style={{ opacity: pending ? 0.7 : 1 }}
        >
          {pending ? "Salvando..." : "Salvar diagnóstico"}
        </button>
        <Link
          href={`/admin/sistemas/clientes/${clienteId}`}
          className="btn-secondary flex-1 justify-center text-center"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
