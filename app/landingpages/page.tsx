import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AnimatedSection from "@/app/components/AnimatedSection";

const WA_LINK = "https://wa.me/555121438299";

export const metadata: Metadata = {
  title: "Landing Pages — BeSmart",
  description: "Sua página de link na bio, pronta em poucos dias. Subdomínio ou domínio próprio.",
};

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const PLANOS = [
  {
    nome: "Subdomínio BeSmart",
    preco: "R$ 400",
    detalhe: "pagamento único",
    endereco: "seunome.besmart.com.br",
    accent: "purple" as const,
    beneficios: [
      "Página no ar em poucos dias",
      "Endereço fácil de lembrar e divulgar",
      "Ideal para link na bio do Instagram",
      "Sem custo de domínio ou renovação",
    ],
  },
  {
    nome: "Domínio próprio",
    preco: "R$ 550",
    detalhe: "inclui 1 ano de domínio",
    endereco: "seusite.com.br",
    accent: "teal" as const,
    beneficios: [
      "Tudo do plano subdomínio",
      "Domínio registrado em seu nome no registro.br",
      "Mais profissional e com sua marca",
      "Configuração completa por nós, sem dor de cabeça",
    ],
  },
];

const PASSOS = [
  { n: "1", title: "Cadastro", desc: "Você envia suas informações, links e fotos pelo WhatsApp." },
  { n: "2", title: "Link de visualização", desc: "Montamos sua página e te enviamos um link pra você aprovar." },
  { n: "3", title: "Publicação", desc: "Depois da aprovação e do pagamento, sua página vai ao ar no endereço combinado." },
];

export default function LandingPagesServico() {
  return (
    <div className="relative overflow-x-hidden" style={{ background: "#0A0A0A" }}>
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
        style={{ background: "rgba(10, 10, 10, 0.85)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="BeSmart" width={160} height={50} className="object-contain h-11 w-auto" priority />
          </Link>
          <Link href="/" className="nav-link">← Voltar ao site</Link>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center pt-16 overflow-hidden">
        <div className="orb w-[600px] h-[600px] top-[-200px] left-[-200px]" style={{ background: "rgba(155, 107, 181, 0.12)" }} />
        <div className="orb w-[500px] h-[500px] bottom-[-150px] right-[-150px]" style={{ background: "rgba(46, 155, 175, 0.10)" }} />

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 w-full text-center">
          <AnimatedSection>
            <span className="badge badge-purple mb-5 inline-flex">Link na bio</span>
            <h1
              className="text-[2rem] sm:text-5xl md:text-6xl font-bold leading-tight mb-5 max-w-4xl mx-auto"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Sua página de link na bio,{" "}
              <span className="gradient-text italic">pronta em poucos dias.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p
              className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Reúna todos os seus links importantes — WhatsApp, Instagram, cardápio, site — em uma
              única página bonita e profissional, feita pela BeSmart.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <a href={WA_LINK} className="btn-whatsapp inline-flex">
              <WhatsAppIcon />
              Quero minha landing page
            </a>
          </AnimatedSection>
        </div>
      </section>

      <hr className="brand" />

      {/* ── PLANOS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedSection>
              <span className="section-label">Planos</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Escolha o endereço da sua página.
              </h2>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PLANOS.map((plano, i) => (
              <AnimatedSection key={plano.nome} delay={(i + 1) * 100}>
                <div className={`glass-${plano.accent} rounded-2xl p-8 h-full flex flex-col`}>
                  <p className={`badge badge-${plano.accent} mb-4 inline-flex w-fit`}>{plano.nome}</p>
                  <div className="mb-1">
                    <span
                      className="text-4xl font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {plano.preco}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                    {plano.detalhe}
                  </p>
                  <p
                    className="text-sm mb-6 font-mono"
                    style={{ color: plano.accent === "purple" ? "#9B6BB5" : "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {plano.endereco}
                  </p>
                  <div className="flex flex-col gap-3 mb-8 flex-1">
                    {plano.beneficios.map((b) => (
                      <div key={b} className="flex items-start gap-2.5">
                        <span style={{ color: plano.accent === "purple" ? "#9B6BB5" : "#2E9BAF", marginTop: "2px" }}>
                          <CheckIcon />
                        </span>
                        <span className="text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                  <a href={WA_LINK} className="btn-whatsapp justify-center">
                    <WhatsAppIcon size={15} />
                    Quero este plano
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── COMO FUNCIONA ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-28 relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] top-[-100px] right-[-150px]" style={{ background: "rgba(46, 155, 175, 0.07)" }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedSection>
              <span className="section-label">Como funciona</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Do pedido à publicação em 3 passos.
              </h2>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PASSOS.map((p, i) => (
              <AnimatedSection key={p.n} delay={(i + 1) * 100}>
                <div className="glass rounded-2xl p-6 h-full">
                  <div className="step-number mb-4">{p.n}</div>
                  <h4
                    className="font-semibold mb-2 text-white"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {p.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                    {p.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <h2
              className="text-3xl md:text-4xl font-bold mb-5"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Bora colocar sua página no ar?
            </h2>
            <p className="mb-8" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
              Fala com a gente pelo WhatsApp e te ajudamos a escolher o plano ideal.
            </p>
            <a href={WA_LINK} className="btn-whatsapp inline-flex" style={{ fontSize: "16px", padding: "15px 31px" }}>
              <WhatsAppIcon size={20} />
              Falar com a BeSmart agora
            </a>
          </AnimatedSection>
        </div>
      </section>

      <hr className="brand" />

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            © 2026 BeSmart Agência de Ideias. Todos os direitos reservados.
          </p>
          <Link href="/" className="text-xs italic" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif", textDecoration: "none" }}>
            BeSmart — Agência de Ideias
          </Link>
        </div>
      </footer>
    </div>
  );
}
