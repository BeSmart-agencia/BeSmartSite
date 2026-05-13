import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function ArrowRightIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function UsersIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>; }
function FolderIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>; }
function DollarIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>; }
function TicketIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" /></svg>; }

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const PIPELINE_COLS = [
  { status: "Em diagnóstico", color: "#9CA3AF", bg: "rgba(107,114,128,0.12)" },
  { status: "Proposta enviada", color: "#FCD34D", bg: "rgba(251,191,36,0.12)" },
  { status: "Aprovado", color: "#2E9BAF", bg: "rgba(46,155,175,0.12)" },
  { status: "Em desenvolvimento", color: "#9B6BB5", bg: "rgba(155,107,181,0.12)" },
  { status: "Entregue", color: "#4ADE80", bg: "rgba(34,197,94,0.12)" },
];

async function getData() {
  try {
    const [
      { data: clientes },
      { data: projetos },
      { data: parcelas },
      { data: chamados },
      { data: mensalidades },
      { data: propostasEnviadas },
    ] = await Promise.all([
      supabase.from("clientes").select("id, nome, empresa, status, created_at").order("created_at", { ascending: false }),
      supabase.from("projetos").select("id, status, cliente_id, nome, valor_total, prazo_entrega, clientes(empresa)"),
      supabase.from("parcelas").select("valor, status"),
      supabase.from("chamados").select("id, status"),
      supabase.from("mensalidades").select("valor, status"),
      supabase.from("propostas").select("id, cliente_id, status").eq("status", "enviada"),
    ]);

    const totalClientes = clientes?.length ?? 0;
    const projAtivos = projetos?.filter((p) => p.status === "Em desenvolvimento" || p.status === "Aprovado").length ?? 0;
    const aReceber = (parcelas ?? [])
      .filter((p) => p.status === "pendente")
      .reduce((s, p) => s + Number(p.valor), 0);
    const mensAReceber = (mensalidades ?? [])
      .filter((m) => m.status === "pendente")
      .reduce((s, m) => s + Number(m.valor), 0);
    const chamadosAbertos = (chamados ?? []).filter((c) => c.status === "aberto").length;
    const propostasEnviadasCount = propostasEnviadas?.length ?? 0;

    return {
      clientes: clientes ?? [],
      projetos: projetos ?? [],
      propostasEnviadasCount,
      totalClientes,
      projAtivos,
      aReceber: aReceber + mensAReceber,
      chamadosAbertos,
    };
  } catch {
    return { clientes: [], projetos: [], propostasEnviadasCount: 0, totalClientes: 0, projAtivos: 0, aReceber: 0, chamadosAbertos: 0 };
  }
}

export default async function DashboardPage() {
  const { clientes, projetos, propostasEnviadasCount, totalClientes, projAtivos, aReceber, chamadosAbertos } = await getData();

  const stats = [
    { label: "Clientes Cadastrados", value: totalClientes, icon: <UsersIcon />, color: "#9B6BB5" },
    { label: "Projetos Ativos", value: projAtivos, icon: <FolderIcon />, color: "#2E9BAF" },
    { label: "A Receber", value: money(aReceber), icon: <DollarIcon />, color: "#4ADE80", isText: true },
    { label: "Chamados Abertos", value: chamadosAbertos, icon: <TicketIcon />, color: chamadosAbertos > 0 ? "#FB923C" : "#4B5563" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Painel Interno</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Dashboard
          </h1>
        </div>
        <Link href="/admin/sistemas/novo-cliente" className="btn-primary self-start" style={{ fontSize: "14px", padding: "10px 20px" }}>
          <PlusIcon /> Novo Cliente
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon, color, isText }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <span style={{ color }}>{icon}</span>
            </div>
            <div className="font-bold mb-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color, fontSize: isText ? "20px" : "32px" }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline mini-view */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Pipeline de Projetos
          </h2>
          <Link href="/admin/sistemas/pipeline" className="text-xs flex items-center gap-1 transition-colors hover:text-white" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
            Ver completo <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PIPELINE_COLS.map(({ status, color, bg }) => {
            const projCount = projetos.filter((p) => p.status === status).length;
            const count = status === "Proposta enviada" ? projCount + propostasEnviadasCount : projCount;
            return (
              <Link key={status} href={`/admin/sistemas/pipeline`} className="rounded-xl p-4 text-center transition-all hover:scale-105" style={{ background: bg, border: `1px solid ${color}22`, textDecoration: "none" }}>
                <div className="text-2xl font-bold mb-1" style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}>{count}</div>
                <div className="text-xs leading-tight" style={{ color, fontFamily: "var(--font-inter), sans-serif", opacity: 0.8 }}>{status}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent clients */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Clientes Recentes
          </h2>
          <Link href="/admin/sistemas/clientes" className="text-xs flex items-center gap-1 transition-colors hover:text-white" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            Ver todos <ArrowRightIcon />
          </Link>
        </div>
        {clientes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm mb-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>Nenhum cliente cadastrado ainda.</p>
            <Link href="/admin/sistemas/novo-cliente" className="btn-primary" style={{ fontSize: "13px", padding: "10px 20px" }}>
              <PlusIcon /> Cadastrar primeiro cliente
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              <thead>
                <tr className="border-b border-white/5">
                  {["Nome", "Empresa", "Cadastrado em", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#4B5563" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientes.slice(0, 8).map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-white">{c.nome}</td>
                    <td className="px-6 py-3.5 text-sm" style={{ color: "#9CA3AF" }}>{c.empresa}</td>
                    <td className="px-6 py-3.5 text-sm" style={{ color: "#6B7280" }}>
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link href={`/admin/sistemas/clientes/${c.id}`} className="text-xs flex items-center gap-1 justify-end transition-colors hover:text-white" style={{ color: "#9B6BB5" }}>
                        Ver <ArrowRightIcon />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
