function CheckIcon({ color = "#4ADE80" }: { color?: string }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}

const PROCESSO = [
  { n: "1", label: "Diagnóstico", desc: "Visita ou reunião com a empresa. Mapear processo atual, identificar gargalos e oportunidades de automação com IA." },
  { n: "2", label: "Proposta", desc: "Documento com escopo do sistema, prazo de entrega, valor de desenvolvimento e mensalidade. Enviar em até 3 dias úteis após o diagnóstico." },
  { n: "3", label: "Contrato", desc: "Contrato de 1 página com escopo, prazo, valores e condições. Prazo mínimo de 6 meses (12 meses para projetos complexos)." },
  { n: "4", label: "Entrada + Início", desc: "50% do valor de desenvolvimento pago antes do início. Desenvolvimento começa só após a entrada." },
  { n: "5", label: "Entrega", desc: "Sistema entregue, onboarding com a equipe do cliente, documentação básica de uso." },
  { n: "6", label: "Mensalidade", desc: "Inicia no mês seguinte à entrega. Cobre manutenção, bugs, suporte e evolução conforme o plano." },
];

const COMPLEXIDADE = [
  {
    nivel: "Simples",
    desc: "1 fluxo automatizado, formulário + dashboard básico, integração com 1 API externa",
    exemplos: "Agente de WhatsApp, formulário de onboarding com resumo por IA, relatório automático simples",
    faixa: "R$ 3.000 – R$ 6.000",
    color: "#9CA3AF",
  },
  {
    nivel: "Médio",
    desc: "3–5 módulos, integração com IA, painel de gestão com múltiplos usuários",
    exemplos: "Sistema de gestão interna, ferramenta de atendimento com IA, plataforma de propostas automatizadas",
    faixa: "R$ 8.000 – R$ 15.000",
    color: "#9B6BB5",
  },
  {
    nivel: "Complexo",
    desc: "Sistema completo multi-tenant ou multi-módulo, múltiplas integrações, lógica de negócio avançada",
    exemplos: "ERP simplificado com IA, plataforma de atendimento omnichannel, sistema de gestão de equipe com automações",
    faixa: "R$ 18.000 – R$ 35.000",
    color: "#2E9BAF",
  },
];

const PLANOS = [
  {
    nome: "Starter",
    inclui: "Sistema funcionando, correção de bugs, suporte via WhatsApp em horário comercial",
    valor: "R$ 297 – R$ 497 / mês",
    color: "#9CA3AF",
    prazo: "6 meses mínimo",
  },
  {
    nome: "Pro",
    inclui: "Bugs + até 4h de evolução por mês + relatório mensal de uso",
    valor: "R$ 497 – R$ 797 / mês",
    color: "#9B6BB5",
    prazo: "6 meses mínimo",
  },
  {
    nome: "Agency",
    inclui: "Bugs + até 10h de evolução + reunião mensal de alinhamento + atendimento prioritário",
    valor: "A partir de R$ 997 / mês",
    color: "#2E9BAF",
    prazo: "12 meses mínimo",
  },
];

const INFRA = [
  { n: "1", label: "Supabase (conta do cliente)", desc: "Cliente cria conta no Supabase com o e-mail dele e te adiciona como colaboradora no projeto. Dados são do cliente." },
  { n: "2", label: "GitHub (BeSmart)", desc: "Criar repositório privado no GitHub da BeSmart. Cada projeto em um repositório separado." },
  { n: "3", label: "Vercel (BeSmart)", desc: "Subir o projeto na Vercel (sua conta) e conectar ao repositório do GitHub." },
  { n: "4", label: "DNS (cliente configura)", desc: "Cliente configura os registros A e CNAME do domínio dele apontando para o deployment da Vercel." },
  { n: "5", label: "Domínio na Vercel", desc: "Adicionar o domínio do cliente no projeto da Vercel. O sistema fica acessível pelo domínio deles." },
];

const REGRAS = [
  "50% do valor de desenvolvimento pago antes do início — o restante na entrega.",
  "Prazo mínimo de mensalidade: 6 meses (projetos médios) ou 12 meses (projetos complexos).",
  "Reajuste anual pelo IGPM ou IPCA.",
  "Bug = algo que parou de funcionar como entregue — coberto pela mensalidade.",
  "Nova feature = algo que não estava no escopo original — orçamento à parte.",
  "Claude API e Vercel ficam na BeSmart. Supabase e domínio ficam no cliente.",
  "Nunca registre o domínio do cliente na sua conta.",
];

const CUSTOS = [
  { item: "Vercel Pro", valor: "U$ 20/mês (~R$ 110)", obs: "Cobre múltiplos projetos e domínios." },
  { item: "Claude API (por projeto)", valor: "U$ 5–50/mês", obs: "Embutir na mensalidade com 50–100% de margem." },
  { item: "GitHub", valor: "Gratuito", obs: "Repositórios privados inclusos." },
];

export default function ReferenciaPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="section-label mb-1">Guia Interno</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Processo & Preços
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Referência rápida do processo comercial, tabela de preços e checklist de infraestrutura.
        </p>
      </div>

      <div className="flex flex-col gap-8">

        {/* Processo comercial */}
        <section>
          <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Processo Comercial
          </h2>
          <div className="flex flex-col gap-2">
            {PROCESSO.map(({ n, label, desc }) => (
              <div key={n} className="flex gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="step-number flex-shrink-0">{n}</div>
                <div>
                  <p className="font-semibold text-sm text-white mb-0.5" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabela de desenvolvimento */}
        <section>
          <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Tabela de Preços — Desenvolvimento
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {COMPLEXIDADE.map(({ nivel, desc, exemplos, faixa, color }) => (
              <div key={nivel} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33` }}>
                <div>
                  <span className="badge" style={{ background: `${color}18`, color, border: `1px solid ${color}44`, marginBottom: "8px", display: "inline-flex" }}>
                    {nivel}
                  </span>
                  <p className="text-xl font-bold" style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}>{faixa}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{desc}</p>
                <p className="text-xs italic leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>Ex.: {exemplos}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Planos de mensalidade */}
        <section>
          <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Planos de Mensalidade — Suporte & Manutenção
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANOS.map(({ nome, inclui, valor, color, prazo }) => (
              <div key={nome} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33` }}>
                <div>
                  <span className="badge" style={{ background: `${color}18`, color, border: `1px solid ${color}44`, marginBottom: "8px", display: "inline-flex" }}>
                    {nome}
                  </span>
                  <p className="text-lg font-bold" style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}>{valor}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>{prazo}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{inclui}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Infraestrutura */}
        <section>
          <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Checklist de Infraestrutura — Novo Projeto
          </h2>
          <div className="flex flex-col gap-2">
            {INFRA.map(({ n, label, desc }) => (
              <div key={n} className="flex gap-4 p-4 rounded-xl" style={{ background: "rgba(46,155,175,0.04)", border: "1px solid rgba(46,155,175,0.15)" }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(46,155,175,0.12)", border: "1px solid rgba(46,155,175,0.3)", color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>
                  {n}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>{label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Regras comerciais */}
        <section>
          <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Regras Comerciais
          </h2>
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {REGRAS.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5"><CheckIcon /></span>
                <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{r}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Seus custos */}
        <section>
          <h2 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Seus Custos de Infraestrutura
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <table className="w-full" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                  {["Serviço", "Custo", "Observação"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#4B5563" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CUSTOS.map(({ item, valor, obs }) => (
                  <tr key={item} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td className="px-5 py-3 text-sm font-medium text-white">{item}</td>
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: "#FCD34D" }}>{valor}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: "#6B7280" }}>{obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
