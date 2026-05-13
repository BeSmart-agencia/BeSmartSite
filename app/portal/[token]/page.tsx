import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { PortalContent } from "./PortalContent";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "Portal do Cliente — BeSmart",
  robots: { index: false, follow: false },
};

export default async function PortalPage({ params }: Props) {
  const { token } = await params;

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, nome, empresa, onboarding_token")
    .eq("onboarding_token", token)
    .maybeSingle();

  if (!cliente) notFound();

  const [{ data: projetos }, { data: diagnostico }, { data: chamadosAbertos }, { data: propostasRows }] = await Promise.all([
    supabase
      .from("projetos")
      .select("id, nome, descricao, status, data_inicio, prazo_entrega, valor_total, forma_pagamento")
      .eq("cliente_id", cliente.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("diagnosticos")
      .select("resolver_uma_coisa, impacto_resolucao")
      .eq("cliente_id", cliente.id)
      .maybeSingle(),
    supabase
      .from("chamados")
      .select("id")
      .eq("cliente_id", cliente.id)
      .neq("status", "resolvido"),
    supabase
      .from("propostas")
      .select("id, conteudo, status")
      .eq("cliente_id", cliente.id)
      .order("created_at", { ascending: false }),
  ]);

  // só mostra propostas enviadas, aprovadas ou recusadas (não rascunhos)
  const propostasVisiveis = (propostasRows ?? []).filter(p => ["enviada", "aprovada", "recusada"].includes(p.status));

  const projetoIds = projetos?.map((p) => p.id) ?? [];

  const [{ data: etapas }, { data: itens }, { data: chamados }] = await Promise.all([
    projetoIds.length
      ? supabase.from("etapas").select("*").in("projeto_id", projetoIds).order("ordem")
      : Promise.resolve({ data: [] }),
    projetoIds.length
      ? supabase.from("itens_escopo").select("*").in("projeto_id", projetoIds).order("ordem")
      : Promise.resolve({ data: [] }),
    projetoIds.length
      ? supabase.from("chamados").select("*").eq("cliente_id", cliente.id).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0A0A0A" }}>
      <div className="orb w-[500px] h-[500px] top-[-150px] right-[-100px]" style={{ background: "rgba(155,107,181,0.07)" }} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] left-[-100px]" style={{ background: "rgba(46,155,175,0.06)" }} />

      {/* Header */}
      <header className="border-b border-white/5 px-5 py-4 flex items-center justify-between relative z-10" style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)" }}>
        <Image src="/logo.png" alt="BeSmart" width={110} height={36} className="object-contain h-8 w-auto" />
        <div className="text-right">
          <p className="text-xs font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{cliente.empresa}</p>
          <p className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>{cliente.nome}</p>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <PortalContent
          cliente={cliente}
          projetos={projetos ?? []}
          etapas={etapas ?? []}
          itens={itens ?? []}
          chamados={chamados ?? []}
          diagnostico={diagnostico ?? null}
          propostas={propostasVisiveis as Array<{ id: string; conteudo: Record<string, unknown> | null; status: string }>}
        />
      </div>
    </div>
  );
}
