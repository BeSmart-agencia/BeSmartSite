import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import { DiagnosticoForm } from "./DiagnosticoForm";

type Props = { params: Promise<{ clienteId: string }> };

export default async function DiagnosticoPage({ params }: Props) {
  const { clienteId } = await params;

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, nome, empresa")
    .eq("id", clienteId)
    .single();

  if (!cliente) notFound();

  const { data: diagnostico } = await supabase
    .from("diagnosticos")
    .select("*")
    .eq("cliente_id", clienteId)
    .maybeSingle();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="section-label mb-1">Reunião de Diagnóstico</p>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {cliente.empresa}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          {cliente.nome}
        </p>
      </div>

      <DiagnosticoForm clienteId={clienteId} initial={diagnostico} />
    </div>
  );
}
