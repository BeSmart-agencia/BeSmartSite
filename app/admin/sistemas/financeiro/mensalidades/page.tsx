import { supabase } from "@/app/lib/supabase";
import { MensalidadesClient } from "./MensalidadesClient";

export default async function MensalidadesPage() {
  const [{ data: mensalidades }, { data: projetos }] = await Promise.all([
    supabase
      .from("mensalidades")
      .select("*, projetos(nome, clientes(empresa))")
      .order("mes_referencia", { ascending: false }),
    supabase
      .from("projetos")
      .select("id, nome, clientes(empresa)")
      .eq("status", "Entregue")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="section-label mb-1">Financeiro</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Mensalidades
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
          Controle de cobranças mensais de suporte e manutenção por cliente.
        </p>
      </div>

      <MensalidadesClient mensalidades={mensalidades ?? []} projetos={projetos ?? []} />
    </div>
  );
}
