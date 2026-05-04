import { supabase } from "@/app/lib/supabase";
import { ChamadoCard } from "./ChamadoCard";

function statusClass(s: string) {
  const map: Record<string, string> = {
    aberto: "status-proposta",
    "em andamento": "status-desenvolvimento",
    resolvido: "status-entregue",
  };
  return `status-badge ${map[s] ?? "status-diagnostico"}`;
}

export default async function ChamadosPage() {
  const { data: chamados } = await supabase
    .from("chamados")
    .select("*, clientes(nome, empresa), projetos(nome)")
    .order("created_at", { ascending: false });

  const abertos = chamados?.filter((c) => c.status === "aberto").length ?? 0;
  const andamento = chamados?.filter((c) => c.status === "em andamento").length ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="section-label mb-1">Sistemas Sob Medida</p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Chamados de Suporte
        </h1>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Abertos", value: abertos, color: "#FCD34D" },
          { label: "Em andamento", value: andamento, color: "#9B6BB5" },
          { label: "Total", value: chamados?.length ?? 0, color: "#6B7280" },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <div
              className="text-3xl font-bold mb-1"
              style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {value}
            </div>
            <div className="text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {!chamados?.length ? (
        <div className="glass rounded-2xl p-16 text-center">
          <p className="text-sm" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            Nenhum chamado aberto ainda.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {chamados.map((c) => (
            <ChamadoCard key={c.id} chamado={c} statusClass={statusClass(c.status)} />
          ))}
        </div>
      )}
    </div>
  );
}
