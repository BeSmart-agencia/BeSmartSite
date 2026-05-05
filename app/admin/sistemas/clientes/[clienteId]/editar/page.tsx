import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditarClienteForm } from "./EditarClienteForm";

type Props = { params: Promise<{ clienteId: string }> };

function ArrowLeftIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>; }

export default async function EditarClientePage({ params }: Props) {
  const { clienteId } = await params;
  const { data: cliente } = await supabase.from("clientes").select("*").eq("id", clienteId).single();
  if (!cliente) notFound();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Link
        href={`/admin/sistemas/clientes/${clienteId}`}
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ArrowLeftIcon /> {cliente.empresa}
      </Link>

      <div className="mb-6">
        <p className="section-label mb-1">Editar dados</p>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          {cliente.nome}
        </h1>
      </div>

      <div className="glass rounded-2xl p-6">
        <EditarClienteForm cliente={cliente} />
      </div>
    </div>
  );
}
