import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjetoTabs } from "./ProjetoTabs";

type Props = { params: Promise<{ clienteId: string; projetoId: string }> };

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function statusClass(s: string) {
  const map: Record<string, string> = {
    "Em diagnóstico": "status-diagnostico",
    "Proposta enviada": "status-proposta",
    "Aprovado": "status-aprovado",
    "Em desenvolvimento": "status-desenvolvimento",
    "Entregue": "status-entregue",
    "Pausado": "status-pausado",
    "Cancelado": "status-cancelado",
  };
  return `status-badge ${map[s] ?? "status-diagnostico"}`;
}

export default async function ProjetoPage({ params }: Props) {
  const { clienteId, projetoId } = await params;

  const [{ data: projeto }, { data: cliente }, { data: diagnostico }, { data: itens }, { data: etapas }, { data: parcelas }, { data: chamados }] =
    await Promise.all([
      supabase.from("projetos").select("*").eq("id", projetoId).single(),
      supabase.from("clientes").select("id, nome, empresa").eq("id", clienteId).single(),
      supabase.from("diagnosticos").select("*").eq("cliente_id", clienteId).maybeSingle(),
      supabase.from("itens_escopo").select("*").eq("projeto_id", projetoId).order("ordem"),
      supabase.from("etapas").select("*").eq("projeto_id", projetoId).order("ordem"),
      supabase.from("parcelas").select("*").eq("projeto_id", projetoId).order("vencimento"),
      supabase.from("chamados").select("*").eq("projeto_id", projetoId).order("created_at", { ascending: false }),
    ]);

  if (!projeto || !cliente) notFound();

  const etapasConcluidas = etapas?.filter((e) => e.status === "concluído").length ?? 0;
  const totalEtapas = etapas?.length ?? 0;
  const progresso = totalEtapas > 0 ? Math.round((etapasConcluidas / totalEtapas) * 100) : 0;

  const totalPago = parcelas?.filter((p) => p.status === "pago").reduce((s, p) => s + Number(p.valor), 0) ?? 0;
  const totalReceber = parcelas?.filter((p) => p.status !== "pago").reduce((s, p) => s + Number(p.valor), 0) ?? 0;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href={`/admin/sistemas/clientes/${clienteId}`}
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ArrowLeftIcon />
        {cliente.empresa}
      </Link>

      {/* Header */}
      <div className="glass rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1
              className="text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {projeto.nome}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
              {cliente.empresa}
            </p>
          </div>
          <span className={statusClass(projeto.status)}>{projeto.status}</span>
        </div>

        {/* Progress bar */}
        {totalEtapas > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
              <span>Progresso das etapas</span>
              <span>{progresso}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progresso}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <ProjetoTabs
        projeto={projeto}
        clienteId={clienteId}
        cliente={cliente}
        diagnostico={diagnostico}
        itens={itens ?? []}
        etapas={etapas ?? []}
        parcelas={parcelas ?? []}
        chamados={chamados ?? []}
        totalPago={totalPago}
        totalReceber={totalReceber}
      />
    </div>
  );
}
