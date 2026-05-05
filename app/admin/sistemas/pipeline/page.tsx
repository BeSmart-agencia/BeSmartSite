import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { PipelineBoard } from "./PipelineBoard";

function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }

export default async function PipelinePage() {
  const { data: projetos } = await supabase
    .from("projetos")
    .select("id, nome, status, valor_total, prazo_entrega, cliente_id, clientes(empresa, nome)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Visão Geral</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Pipeline de Projetos
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            Acompanhe o status de cada projeto. Clique nas setas para avançar o status.
          </p>
        </div>
        <Link href="/admin/sistemas/novo-cliente" className="btn-primary self-start" style={{ fontSize: "14px", padding: "10px 20px" }}>
          <PlusIcon /> Novo Cliente
        </Link>
      </div>

      <div style={{ overflowX: "auto", paddingBottom: "16px" }}>
        <div style={{ minWidth: "1100px" }}>
          <PipelineBoard projetos={projetos ?? []} />
        </div>
      </div>
    </div>
  );
}
