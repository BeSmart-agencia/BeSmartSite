import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

function ArrowRightIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function DollarIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>; }
function AlertIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>; }
function CheckIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>; }
function CalendarIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmt(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR");
}

function isAtrasado(vencimento: string | null) {
  if (!vencimento) return false;
  return new Date(vencimento + "T23:59:59") < new Date();
}

export default async function FinanceiroPage() {
  const [
    { data: parcelas },
    { data: mensalidades },
  ] = await Promise.all([
    supabase.from("parcelas").select("*, projetos(nome, clientes(empresa))").order("vencimento"),
    supabase.from("mensalidades").select("*, projetos(nome, clientes(empresa))").order("data_vencimento"),
  ]);

  const parcelasPendentes = (parcelas ?? []).filter((p) => p.status !== "pago");
  const parcelasPagas = (parcelas ?? []).filter((p) => p.status === "pago");
  const parcelasAtrasadas = parcelasPendentes.filter((p) => isAtrasado(p.vencimento));

  const mensalidadesPendentes = (mensalidades ?? []).filter((m) => m.status !== "pago");
  const mensalidadesPagas = (mensalidades ?? []).filter((m) => m.status === "pago");

  const totalRecebidoDev = parcelasPagas.reduce((s, p) => s + Number(p.valor), 0);
  const totalRecebidoMens = mensalidadesPagas.reduce((s, m) => s + Number(m.valor), 0);
  const totalRecebido = totalRecebidoDev + totalRecebidoMens;

  const totalAReceber = parcelasPendentes.reduce((s, p) => s + Number(p.valor), 0)
    + mensalidadesPendentes.reduce((s, m) => s + Number(m.valor), 0);
  const totalAtrasado = parcelasAtrasadas.reduce((s, p) => s + Number(p.valor), 0);

  const now = new Date();
  const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const mensalidadesEsteMes = (mensalidades ?? []).filter((m) => m.mes_referencia === mesAtual);
  const receitaMensal = mensalidadesEsteMes.filter((m) => m.status === "pago").reduce((s, m) => s + Number(m.valor), 0);

  const stats = [
    { label: "Total Recebido", value: money(totalRecebido), icon: <CheckIcon />, color: "#4ADE80" },
    { label: "A Receber", value: money(totalAReceber), icon: <DollarIcon />, color: "#FCD34D" },
    { label: "Em Atraso", value: money(totalAtrasado), icon: <AlertIcon />, color: totalAtrasado > 0 ? "#F87171" : "#4B5563" },
    { label: "Mensalidades este Mês", value: money(receitaMensal), icon: <CalendarIcon />, color: "#9B6BB5" },
  ];

  const proximosPagamentos = [
    ...parcelasPendentes.map((p) => ({
      tipo: "Desenvolvimento" as const,
      empresa: (p.projetos as any)?.clientes?.empresa ?? "—",
      projeto: (p.projetos as any)?.nome ?? "—",
      valor: Number(p.valor),
      vencimento: p.vencimento,
      atrasado: isAtrasado(p.vencimento),
      descricao: p.descricao,
    })),
    ...mensalidadesPendentes.map((m) => ({
      tipo: "Mensalidade" as const,
      empresa: (m.projetos as any)?.clientes?.empresa ?? "—",
      projeto: (m.projetos as any)?.nome ?? "—",
      valor: Number(m.valor),
      vencimento: m.data_vencimento,
      atrasado: isAtrasado(m.data_vencimento),
      descricao: m.mes_referencia,
    })),
  ].sort((a, b) => {
    if (!a.vencimento) return 1;
    if (!b.vencimento) return -1;
    return a.vencimento.localeCompare(b.vencimento);
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Controle Financeiro</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Visão Geral
          </h1>
        </div>
        <Link href="/admin/sistemas/financeiro/mensalidades" className="btn-secondary self-start" style={{ fontSize: "14px", padding: "10px 20px" }}>
          Gerenciar Mensalidades <ArrowRightIcon />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <span style={{ color }}>{icon}</span>
            </div>
            <div className="text-xl font-bold mb-1" style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}>{value}</div>
            <div className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Próximos pagamentos */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Pagamentos Pendentes
          </h2>
          <span className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            {proximosPagamentos.length} pendente{proximosPagamentos.length !== 1 ? "s" : ""}
          </span>
        </div>

        {proximosPagamentos.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm" style={{ color: "#4ADE80", fontFamily: "var(--font-inter), sans-serif" }}>
              Nenhum pagamento pendente.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {proximosPagamentos.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div
                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: item.tipo === "Mensalidade" ? "rgba(155,107,181,0.12)" : "rgba(46,155,175,0.12)",
                    color: item.tipo === "Mensalidade" ? "#9B6BB5" : "#2E9BAF",
                    border: `1px solid ${item.tipo === "Mensalidade" ? "rgba(155,107,181,0.25)" : "rgba(46,155,175,0.25)"}`,
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {item.tipo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    {item.empresa}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                    {item.descricao ?? item.projeto}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold" style={{ color: item.atrasado ? "#F87171" : "#FCD34D", fontFamily: "var(--font-inter), sans-serif" }}>
                    {money(item.valor)}
                  </p>
                  {item.vencimento && (
                    <p className="text-xs" style={{ color: item.atrasado ? "#F87171" : "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                      {item.atrasado ? "⚠ Atrasado · " : ""}{fmt(item.vencimento)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
