import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type LinkItem = { label: string; url: string };

type LandingPage = {
  slug: string;
  titulo: string | null;
  bio: string | null;
  avatar_url: string | null;
  cor_tema: string | null;
  links: LinkItem[] | null;
  nome_cliente: string;
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("landing_pages")
    .select("titulo, nome_cliente, bio")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return { title: "Página não encontrada" };

  return {
    title: data.titulo || data.nome_cliente,
    description: data.bio ?? undefined,
  };
}

export default async function LandingPagePublica({ params }: Props) {
  const { slug } = await params;

  const { data: lp } = await supabase
    .from("landing_pages")
    .select("slug, titulo, bio, avatar_url, cor_tema, links, nome_cliente")
    .eq("slug", slug)
    .maybeSingle();

  if (!lp) notFound();

  const page = lp as LandingPage;
  const cor = page.cor_tema || "#9B6BB5";
  const links = page.links ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-16" style={{ background: "#0A0A0A" }}>
      <div className="orb w-[500px] h-[500px] top-[-150px] right-[-100px]" style={{ background: `${cor}1a` }} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] left-[-100px]" style={{ background: `${cor}12` }} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {page.avatar_url && (
          <img
            src={page.avatar_url}
            alt={page.titulo || page.nome_cliente}
            width={96}
            height={96}
            className="rounded-full object-cover mb-5"
            style={{ border: `2px solid ${cor}` }}
          />
        )}

        <h1
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {page.titulo || page.nome_cliente}
        </h1>

        {page.bio && (
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {page.bio}
          </p>
        )}

        <div className="flex flex-col gap-3 w-full">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl px-6 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ fontFamily: "var(--font-inter), sans-serif", borderColor: `${cor}4d` }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <p
          className="text-xs mt-12"
          style={{ color: "#374151", fontFamily: "var(--font-inter), sans-serif" }}
        >
          Página criada com{" "}
          <a href="/landingpages" className="hover:text-white transition-colors" style={{ color: "#4B5563" }}>
            BeSmart
          </a>
        </p>
      </div>
    </div>
  );
}
