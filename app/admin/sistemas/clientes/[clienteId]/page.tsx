import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NovoProjeto } from "./NovoProjeto";
import { ProjetoCard } from "./ProjetoCard";
import { CopyButton } from "./CopyButton";

type Props = { params: Promise<{ clienteId: string }> };

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default async function ClientePerfilPage({ params }: Props) {
  const { clienteId } = await params;

  const [{ data: cliente }, { data: projetos }, { data: diagnostico }] = await Promise.all([
    supabase.from("clientes").select("*").eq("id", clienteId).single(),
    supabase.from("projetos").select("*").eq("cliente_id", clienteId).order("created_at", { ascending: false }),
    supabase.from("diagnosticos").select("id, resolver_uma_coisa, orcamento, created_at").eq("cliente_id", clienteId).maybeSingle(),
  ]);

  if (!cliente) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const onboardingLink = `${base}/onboarding/${cliente.onboarding_token}`;
  const portalLink = `${base}/portal/${cliente.onboarding_token}`;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/admin/sistemas/clientes"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ArrowLeftIcon />
        Todos os clientes
      </Link>

      {/* Cliente header */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {cliente.empresa}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
              {cliente.nome}
            </p>
            {cliente.segmento && (
              <span className="badge badge-teal mt-2 inline-flex">{cliente.segmento}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/sistemas/diagnostico/${clienteId}`}
              className="btn-secondary"
              style={{ fontSize: "13px", padding: "8px 16px" }}
            >
              {diagnostico ? "Ver Diagnóstico" : "Fazer Diagnóstico"}
            </Link>
          </div>
        </div>

        {/* Infos */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          {cliente.whatsapp && (
            <div>
              <p className="admin-label mb-1">WhatsApp</p>
              <a
                href={`https://wa.me/55${cliente.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {cliente.whatsapp}
              </a>
            </div>
          )}
          {cliente.email && (
            <div>
              <p className="admin-label mb-1">E-mail</p>
              <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>{cliente.email}</p>
            </div>
          )}
          <div>
            <p className="admin-label mb-1">Cadastrado</p>
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
              {new Date(cliente.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
          <div>
            <p className="admin-label mb-1.5">Link de onboarding</p>
            <div className="flex items-center gap-3">
              <p className="text-xs flex-1 truncate" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>{onboardingLink}</p>
              <CopyButton text={onboardingLink} label="Copiar" />
            </div>
          </div>
          <div>
            <p className="admin-label mb-1.5">Portal do cliente</p>
            <div className="flex items-center gap-3">
              <p className="text-xs flex-1 truncate" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>{portalLink}</p>
              <CopyButton text={portalLink} label="Copiar" />
            </div>
          </div>
        </div>

        {/* Diagnóstico resumo */}
        {diagnostico?.resolver_uma_coisa && (
          <div
            className="mt-4 pt-4 border-t border-white/5 rounded-xl p-4"
            style={{ background: "rgba(155,107,181,0.06)" }}
          >
            <p className="admin-label mb-2" style={{ color: "#9B6BB5" }}>Principal dor (diagnóstico)</p>
            <p className="text-sm italic" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
              &ldquo;{diagnostico.resolver_uma_coisa}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Projetos */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Projetos {projetos?.length ? `(${projetos.length})` : ""}
        </h2>
        <NovoProjeto clienteId={clienteId} inline />
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {projetos?.map((p) => (
          <ProjetoCard key={p.id} projeto={p} clienteId={clienteId} />
        ))}
        {!projetos?.length && (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm mb-4" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
              Nenhum projeto criado ainda.
            </p>
            <NovoProjeto clienteId={clienteId} />
          </div>
        )}
      </div>
    </div>
  );
}
