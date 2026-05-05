import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjetoTabs } from "./ProjetoTabs";

type Props = { params: Promise<{ clienteId: string; projetoId: string }> };

function ArrowLeftIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>; }
function EditIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>; }

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

  const [
    { data: projeto },
    { data: cliente },
    { data: diagnostico },
    { data: itens },
    { data: etapas },
    { data: parcelas },
    { data: chamados },
    { data: mensalidades },
  ] = await Promise.all([
    supabase.from("projetos").select("*").eq("id", projetoId).single(),
    supabase.from("clientes").select("id, nome, empresa").eq("id", clienteId).single(),
    supabase.from("diagnosticos").select("*").eq("cliente_id", clienteId).maybeSingle(),
    supabase.from("itens_escopo").select("*").eq("projeto_id", projetoId).order("ordem"),
    supabase.from("etapas").select("*").eq("projeto_id", projetoId).order("ordem"),
    supabase.from("parcelas").select("*").eq("projeto_id", projetoId).order("vencimento"),
    supabase.from("chamados").select("*").eq("projeto_id", projetoId).order("created_at", { ascending: false }),
    supabase.from("mensalidades").select("*").eq("projeto_id", projetoId).order("mes_referencia", { ascending: false }),
  ]);

  if (!projeto || !cliente) notFound();

  const etapasConcluidas = etapas?.filter((e) => e.status === "concluído").length ?? 0;
  const totalEtapas = etapas?.length ?? 0;
  const progresso = totalEtapas > 0 ? Math.round((etapasConcluidas / totalEtapas) * 100) : 0;

  const totalPago = parcelas?.filter((p) => p.status === "pago").reduce((s, p) => s + Number(p.valor), 0) ?? 0;
  const totalReceber = parcelas?.filter((p) => p.status !== "pago").reduce((s, p) => s + Number(p.valor), 0) ?? 0;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link
        href={`/admin/sistemas/clientes/${clienteId}`}
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ArrowLeftIcon /> {cliente.empresa}
      </Link>

      <div className="glass rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              {projeto.nome}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
              {cliente.empresa}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={statusClass(projeto.status)}>{projeto.status}</span>
          </div>
        </div>

        {totalEtapas > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
              <span>Progresso das etapas</span><span>{progresso}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progresso}%` }} />
            </div>
          </div>
        )}
      </div>

      <ProjetoTabs
        projeto={projeto}
        clienteId={clienteId}
        cliente={cliente}
        diagnostico={diagnostico}
        itens={itens ?? []}
        etapas={etapas ?? []}
        parcelas={parcelas ?? []}
        chamados={chamados ?? []}
        mensalidades={mensalidades ?? []}
        totalPago={totalPago}
        totalReceber={totalReceber}
      />
    </div>
  );
}
