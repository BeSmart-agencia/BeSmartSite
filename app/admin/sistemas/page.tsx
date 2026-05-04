import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

async function getData() {
  try {
    const [{ data: clientes }, { data: projetos }] = await Promise.all([
      supabase.from("clientes").select("id, nome, empresa, status, created_at").order("created_at", { ascending: false }),
      supabase.from("projetos").select("id, status"),
    ]);

    const total = clientes?.length ?? 0;
    const ativos = projetos?.filter((p) => p.status === "Em desenvolvimento" || p.status === "Aprovado").length ?? 0;
    const concluidos = projetos?.filter((p) => p.status === "Entregue").length ?? 0;

    return { clientes: clientes ?? [], total, ativos, concluidos };
  } catch {
    return { clientes: [], total: 0, ativos: 0, concluidos: 0 };
  }
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    ativo: "status-ativo",
    inativo: "status-cancelado",
  };
  return `status-badge ${map[status] ?? "status-diagnostico"}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function DashboardPage() {
  const { clientes, total, ativos, concluidos } = await getData();

  const stats = [
    { label: "Total de Clientes", value: total, icon: <UsersIcon />, color: "#9B6BB5" },
    { label: "Projetos Ativos", value: ativos, icon: <FolderIcon />, color: "#2E9BAF" },
    { label: "Projetos Concluídos", value: concluidos, icon: <CheckCircleIcon />, color: "#4ADE80" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label mb-1">Painel Interno</p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Dashboard
        </h1>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/admin/sistemas/novo-cliente" className="btn-primary" style={{ fontSize: "14px", padding: "11px 22px" }}>
          <PlusIcon />
          Novo Cliente
        </Link>
        <Link href="/admin/sistemas/novo-cliente?diagnostico=1" className="btn-secondary" style={{ fontSize: "14px", padding: "10px 21px" }}>
          <CalendarIcon />
          Nova Reunião de Diagnóstico
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <span style={{ color }}>{icon}</span>
            </div>
            <div
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color }}
            >
              {value}
            </div>
            <div className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Clients table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2
            className="font-semibold text-white"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Clientes Cadastrados
          </h2>
          <Link
            href="/admin/sistemas/clientes"
            className="text-xs flex items-center gap-1 transition-colors hover:text-white"
            style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Ver todos <ArrowRightIcon />
          </Link>
        </div>

        {clientes.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm mb-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
              Nenhum cliente cadastrado ainda.
            </p>
            <Link href="/admin/sistemas/novo-cliente" className="btn-primary" style={{ fontSize: "13px", padding: "10px 20px" }}>
              <PlusIcon />
              Cadastrar primeiro cliente
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              <thead>
                <tr className="border-b border-white/5">
                  {["Nome", "Empresa", "Status", "Cadastrado em", ""].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#4B5563" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">{c.nome}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#9CA3AF" }}>{c.empresa}</td>
                    <td className="px-6 py-4">
                      <span className={statusClass(c.status)}>
                        {c.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/sistemas/clientes/${c.id}`}
                        className="text-xs transition-colors hover:text-white flex items-center gap-1 justify-end"
                        style={{ color: "#9B6BB5" }}
                      >
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
