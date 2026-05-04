import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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

function statusClass(status: string) {
  return `status-badge ${status === "ativo" ? "status-ativo" : "status-cancelado"}`;
}

export default async function ClientesPage() {
  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, nome, empresa, segmento, status, whatsapp, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-1">Sistemas Sob Medida</p>
          <h1
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Clientes
          </h1>
        </div>
        <Link
          href="/admin/sistemas/novo-cliente"
          className="btn-primary"
          style={{ fontSize: "13px", padding: "10px 18px" }}
        >
          <PlusIcon />
          Novo
        </Link>
      </div>

      {!clientes?.length ? (
        <div className="glass rounded-2xl p-16 text-center">
          <p className="text-sm mb-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            Nenhum cliente cadastrado.
          </p>
          <Link href="/admin/sistemas/novo-cliente" className="btn-primary" style={{ fontSize: "13px", padding: "10px 20px" }}>
            <PlusIcon /> Cadastrar primeiro cliente
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {clientes.map((c) => (
            <Link
              key={c.id}
              href={`/admin/sistemas/clientes/${c.id}`}
              className="glass rounded-2xl p-5 flex flex-col gap-3 hover:border-purple-500/20 transition-all group"
              style={{ textDecoration: "none" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white group-hover:text-purple-300 transition-colors" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    {c.empresa}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
                    {c.nome}
                  </p>
                </div>
                <span className={statusClass(c.status)}>
                  {c.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </div>

              {c.segmento && (
                <p className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                  {c.segmento}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <p className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </p>
                <span className="text-xs flex items-center gap-1" style={{ color: "#9B6BB5" }}>
                  Ver perfil <ArrowRightIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
