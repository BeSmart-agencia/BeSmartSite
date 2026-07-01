import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LandingPageEditor, StatusSelector } from "./LandingPageEditor";
import { CopyButton } from "./CopyButton";

type Props = { params: Promise<{ id: string }> };

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default async function LandingPageDetalhe({ params }: Props) {
  const { id } = await params;
  const { data: page } = await supabase.from("landing_pages").select("*").eq("id", id).maybeSingle();
  if (!page) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${base}/lp/${page.slug}`;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/landingpages/clientes"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ArrowLeftIcon /> Todas as páginas
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="section-label mb-1">Landing Pages</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {page.empresa || page.nome_cliente}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
            {page.nome_cliente}
          </p>
        </div>
        <StatusSelector id={page.id} status={page.status} />
      </div>

      <div className="glass rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            Link de visualização
          </p>
          <p className="text-sm truncate" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>{link}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <CopyButton text={link} />
          <a href={link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: "13px", padding: "9px 18px" }}>
            Abrir
          </a>
        </div>
      </div>

      <LandingPageEditor page={page} />
    </div>
  );
}
