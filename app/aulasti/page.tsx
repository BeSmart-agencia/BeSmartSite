"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AnimatedSection from "../components/AnimatedSection";

const waLink = (msg: string) =>
  `https://wa.me/5551998518895?text=${encodeURIComponent(msg)}`;

const WA = waLink("Oi, Laisa! Quero saber mais sobre as aulas de informática.");
const WA_CRIANCAS = waLink(
  "Oi, Laisa! Quero saber mais sobre as aulas de informática para crianças."
);
const WA_IDOSOS = waLink(
  "Oi, Laisa! Quero saber mais sobre as aulas de informática para idosos."
);

// ─── Chat animado (estilo WhatsApp) ───────────────────────────────────────────

const CHAT: { from: "aluna" | "laisa"; text: string }[] = [
  { from: "aluna", text: "Laisa, consegui fazer a videochamada com a minha neta!" },
  { from: "laisa", text: "Que orgulho, dona Célia! Viu como a senhora consegue? 💜" },
  { from: "aluna", text: "Agora quero aprender a mandar áudio!" },
  { from: "laisa", text: "Bora! É o tema da nossa próxima aula 😄" },
];

function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(CHAT.length);
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let i = 0;
        interval = setInterval(() => {
          i += 1;
          setVisible(i);
          if (i >= CHAT.length && interval) clearInterval(interval);
        }, 900);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div ref={ref} className="ti-panel" aria-label="Conversa de exemplo entre aluna e professora">
      <div className="ti-panel-bar">
        <span className="ti-pulse h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="text-xs font-medium text-white">Laisa · professora</span>
        <span className="ml-auto text-[11px] text-gray-500">online</span>
      </div>
      <div className="flex min-h-[200px] flex-col gap-2.5 p-4">
        {CHAT.slice(0, visible).map((m, i) => (
          <div
            key={i}
            className={`ti-bubble ${
              m.from === "laisa" ? "ti-bubble-laisa" : "ti-bubble-aluna"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Terminal animado ─────────────────────────────────────────────────────────

const TERMINAL_LINES = [
  "$ laisa@besmart:~ criar --meu-primeiro-site",
  "> aprendendo passo a passo...",
  "> ideias ✓  criatividade ✓  código ✓",
  "> publicando na internet...",
  "> site no ar! 🚀",
];

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const full = TERMINAL_LINES.join("\n");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(full);
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let i = 0;
        interval = setInterval(() => {
          i += 1;
          setText(full.slice(0, i));
          if (i >= full.length && interval) clearInterval(interval);
        }, 28);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div ref={ref} className="ti-panel f-mono" aria-label="Terminal animado: criando o primeiro site">
      <div className="ti-panel-bar">
        <span className="ti-dot" style={{ background: "#FF5F57" }} />
        <span className="ti-dot" style={{ background: "#FEBC2E" }} />
        <span className="ti-dot" style={{ background: "#28C840" }} />
        <span className="ml-3 text-[11px] text-gray-500">meu-primeiro-site.sh</span>
      </div>
      <pre className="ti-terminal-body">
        {text}
        <span className="ti-cursor">▊</span>
      </pre>
    </div>
  );
}

// ─── Icons (Lucide-style, inline SVG) ─────────────────────────────────────────

function Icon({ d, className = "" }: { d: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-6 w-6 ${className}`}
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}

const icons = {
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M12 18h.01" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  heart: (
    <>
      <path d="M19.8 5.6a5 5 0 0 0-7.1 0L12 6.3l-.7-.7a5 5 0 1 0-7.1 7.1l.7.7 7.1 7.1 7.1-7.1.7-.7a5 5 0 0 0 0-7.1z" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v2m0 14v2M5.2 5.2l1.4 1.4m10.8 10.8 1.4 1.4M3 12h2m14 0h2M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  palette: (
    <>
      <path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h2a4 4 0 0 0 4-4A10 10 0 0 0 12 2z" />
      <circle cx="7.5" cy="11.5" r="1" />
      <circle cx="11" cy="7.5" r="1" />
      <circle cx="16" cy="8.5" r="1" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </>
  ),
  printer: (
    <>
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="5" r="3" />
      <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" />
      <path d="M9 22V12h6v10" />
    </>
  ),
  check: <path d="m5 13 4 4L19 7" />,
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const TICKER = [
  "Computador",
  "Digitação",
  "Word",
  "Canva",
  "CapCut",
  "Programação com IA",
  "WhatsApp",
  "Videochamadas",
  "gov.br",
  "Aplicativo do banco",
  "Segurança na internet",
  "E-mail",
];

const TRILHA_CRIANCAS = [
  {
    icon: icons.monitor,
    title: "Noções básicas",
    desc: "Computador, pastas, digitação, Word e segurança na internet.",
  },
  {
    icon: icons.palette,
    title: "Criação",
    desc: "Artes, vídeos e apresentações no Canva e no CapCut.",
  },
  {
    icon: icons.code,
    title: "Desenvolvimento",
    desc: "Programação básica com IA — com um site ou ferramenta criada pela criança ao final.",
  },
  {
    icon: icons.book,
    title: "IA nos estudos",
    desc: "Usar a inteligência artificial do jeito certo pra aprender mais.",
  },
];

const TRILHA_IDOSOS = [
  {
    icon: icons.printer,
    title: "Noções básicas",
    desc: "Computador, e-mail, Word e como imprimir documentos.",
  },
  {
    icon: icons.phone,
    title: "Celular no dia a dia",
    desc: "WhatsApp, fotos, vídeos e chamadas de vídeo com a família.",
  },
  {
    icon: icons.shield,
    title: "Segurança",
    desc: "Como evitar golpes, usar o gov.br e o aplicativo do banco.",
  },
];

const PACOTES = [
  {
    nome: "Aula avulsa",
    destaque: false,
    aulas: "1 aula de 1h",
    valor: "R$ 90",
    porAula: "R$ 90 por aula",
  },
  {
    nome: "Pacote mensal",
    destaque: true,
    aulas: "4 aulas de 1h · 1 por semana",
    valor: "R$ 300",
    porAula: "sai por R$ 75 a aula",
  },
  {
    nome: "Pacote intensivo",
    destaque: false,
    aulas: "8 aulas de 1h · 2 por semana",
    valor: "R$ 560",
    porAula: "sai por R$ 70 a aula",
  },
  {
    nome: "Pacote dupla",
    destaque: false,
    aulas: "4 aulas de 1h pra duas pessoas juntas — irmãos ou casal",
    valor: "R$ 440",
    porAula: "sai por R$ 55 por pessoa",
  },
];

const PASSOS = [
  {
    n: "01",
    icon: icons.chat,
    title: "Uma conversa pra se conhecer",
    desc: "Você me chama no WhatsApp e me conta quem vai aprender e o que gostaria de aprender. Sem compromisso nenhum.",
  },
  {
    n: "02",
    icon: icons.route,
    title: "Um plano sob medida",
    desc: "Monto um caminho personalizado, começando pelo que mais importa — seja a primeira videochamada ou o primeiro site.",
  },
  {
    n: "03",
    icon: icons.home,
    title: "Aulas na sua casa",
    desc: "Eu vou até você. Aulas individuais de 1 hora, no seu ritmo, com toda a paciência do mundo — a gente repete quantas vezes for preciso.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AulasTIPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  // glow que segue o mouse no hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", move);
    return () => el.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative overflow-x-clip bg-[#050508] text-gray-300">
      <style>{css}</style>

      {/* ── Nav ── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[#050508]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="BeSmart" width={96} height={28} className="h-6 w-auto" />
            <span className="f-mono text-xs text-gray-500">
              /<span className="text-[#2E9BAF]">aulas</span>
              <span className="text-[#9B6BB5]">.ti</span>
            </span>
          </a>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="ti-btn-ghost text-sm">
            Falar com a Laisa
          </a>
        </div>
        <div className="section-divider" />
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="ti-hero ti-grid-bg relative pt-28 md:pt-36">
        <div className="orb h-[420px] w-[420px] bg-[#9B6BB5]/25 -top-32 -left-32" />
        <div className="orb h-[380px] w-[380px] bg-[#2E9BAF]/20 top-40 -right-24" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:pb-24">
          <div>
            <p className="f-mono mb-5 inline-flex items-center gap-2 rounded-full border border-[#2E9BAF]/30 bg-[#2E9BAF]/10 px-4 py-1.5 text-[11px] tracking-wider text-[#4FC3D9]">
              <span className="ti-pulse h-1.5 w-1.5 rounded-full bg-[#28C840]" />
              AULAS INDIVIDUAIS · CRIANÇAS E IDOSOS
            </p>

            <h1 className="f-grotesk text-4xl font-700 leading-[1.08] tracking-tight text-white md:text-6xl">
              Aulas de{" "}
              <span className="gradient-text">informática</span>
              <br />
              <span className="ti-outline">na sua casa.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-gray-400 md:text-lg">
              Para crianças e idosos. Aulas individuais, no seu ritmo, com quem
              ama ensinar — do primeiro clique ao primeiro site.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.8-5.1c-.6-1-1-2.1-.9-2.9 0-.6.4-1.2.8-1.5.2-.2.5-.2.7-.2h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7a9.6 9.6 0 0 0 3.9 3.5c.3.1.5.1.7-.1l.7-.8c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.4.1.1.1.6-.3 1.4Z" />
                </svg>
                Quero começar
              </a>
              <a href="#pacotes" className="ti-btn-ghost text-sm">
                Ver valores →
              </a>
            </div>

            {/* atalhos para as trilhas */}
            <div className="mt-10 grid max-w-md gap-3 sm:grid-cols-2">
              <a href="#criancas" className="ti-trilha glass-purple rounded-xl p-4">
                <span className="mb-1 flex items-center gap-2 text-[#C49BD8]">
                  <Icon d={icons.sparkles} className="h-5 w-5" />
                  <span className="f-grotesk text-sm font-600 text-white">
                    Para crianças
                  </span>
                </span>
                <span className="text-xs text-gray-400">
                  Do básico à criação e programação com IA.
                </span>
              </a>
              <a href="#idosos" className="ti-trilha glass-teal rounded-xl p-4">
                <span className="mb-1 flex items-center gap-2 text-[#4FC3D9]">
                  <Icon d={icons.heart} className="h-5 w-5" />
                  <span className="f-grotesk text-sm font-600 text-white">
                    Para idosos
                  </span>
                </span>
                <span className="text-xs text-gray-400">
                  Computador, celular e segurança no dia a dia.
                </span>
              </a>
            </div>
          </div>

          {/* foto com moldura HUD */}
          <AnimatedSection delay={200}>
            <div className="ti-hud relative mx-auto max-w-[380px]">
              <span className="ti-corner ti-corner-tl" />
              <span className="ti-corner ti-corner-tr" />
              <span className="ti-corner ti-corner-bl" />
              <span className="ti-corner ti-corner-br" />
              <div className="ti-photo relative overflow-hidden rounded-2xl">
                <Image
                  src="/laisa-aulas.png"
                  alt="Laisa Barth, professora das aulas de informática, em seu escritório"
                  width={760}
                  height={1013}
                  priority
                  className="h-auto w-full"
                />
                <div className="ti-scan" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050508] to-transparent" />
              </div>

              <div className="f-mono absolute -left-4 top-8 rounded-lg border border-[#9B6BB5]/40 bg-[#0A0A0A]/90 px-3 py-2 text-[11px] text-[#C49BD8] shadow-[0_0_24px_rgba(155,107,181,0.25)] backdrop-blur">
                aulas individuais
              </div>
              <div className="f-mono absolute -right-3 bottom-16 flex items-center gap-2 rounded-lg border border-[#2E9BAF]/40 bg-[#0A0A0A]/90 px-3 py-2 text-[11px] text-[#4FC3D9] shadow-[0_0_24px_rgba(46,155,175,0.25)] backdrop-blur">
                <span className="ti-pulse h-1.5 w-1.5 rounded-full bg-[#28C840]" />
                na sua casa
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="relative overflow-hidden border-y border-white/8 bg-white/[0.02] py-3.5">
        <div className="ti-marquee f-mono flex w-max items-center gap-8 text-xs text-gray-500">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex items-center gap-8"
              aria-hidden={dup === 1 || undefined}
            >
              {TICKER.map((t) => (
                <span key={t} className="flex items-center gap-8 whitespace-nowrap">
                  {t}
                  <span className="text-[#9B6BB5]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Trilha 1: Crianças ── */}
      <section id="criancas" className="relative scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <AnimatedSection>
            <p className="section-label f-mono mb-3">// para crianças</p>
            <h2 className="f-grotesk max-w-2xl text-3xl font-700 tracking-tight text-white md:text-4xl">
              Do primeiro clique ao{" "}
              <span className="gradient-text">primeiro site</span>.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-500">
              Tecnologia com propósito: a criança aprende a usar o computador
              direito, criar coisas incríveis e dar os primeiros passos na
              programação — em vez de só consumir tela.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid items-start gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {TRILHA_CRIANCAS.map((c, i) => (
                <AnimatedSection key={c.title} delay={((i % 2) + 1) * 100}>
                  <div className="ti-card glass h-full rounded-2xl p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="inline-flex rounded-lg bg-[#9B6BB5]/15 p-2.5 text-[#C49BD8]">
                        <Icon d={c.icon} className="h-5 w-5" />
                      </div>
                      <span className="f-mono text-[11px] text-gray-600">0{i + 1}</span>
                    </div>
                    <h3 className="f-grotesk mb-1 text-[15px] font-600 text-white">{c.title}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-400">{c.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={100}>
              <Terminal />
              <a
                href={WA_CRIANCAS}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-6 w-full justify-center"
              >
                Aulas pro meu filho
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Trilha 2: Idosos ── */}
      <section id="idosos" className="relative scroll-mt-24 border-t border-white/8 bg-[#07070C]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <AnimatedSection>
            <p className="section-label f-mono mb-3">// para idosos</p>
            <h2 className="f-grotesk max-w-2xl text-3xl font-700 tracking-tight text-white md:text-4xl">
              Independência digital, com{" "}
              <span className="gradient-text">calma e paciência</span>.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-500">
              Falar com a família, imprimir um documento, usar o banco e o
              gov.br sem depender de ninguém — e sem medo de cair em golpe.
              Também é um ótimo presente de filhos e netos.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <AnimatedSection delay={100}>
              <Chat />
              <a
                href={WA_IDOSOS}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-6 w-full justify-center"
              >
                Quero essas aulas
              </a>
            </AnimatedSection>

            <div className="grid gap-4 sm:grid-cols-2">
              {TRILHA_IDOSOS.map((c, i) => (
                <AnimatedSection key={c.title} delay={((i % 2) + 1) * 100}>
                  <div className="ti-card glass h-full rounded-2xl p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="inline-flex rounded-lg bg-[#2E9BAF]/15 p-2.5 text-[#4FC3D9]">
                        <Icon d={c.icon} className="h-5 w-5" />
                      </div>
                      <span className="f-mono text-[11px] text-gray-600">0{i + 1}</span>
                    </div>
                    <h3 className="f-grotesk mb-1 text-[15px] font-600 text-white">{c.title}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-400">{c.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
              <AnimatedSection delay={300}>
                <div className="glass-teal flex h-full items-center rounded-2xl p-5">
                  <p className="text-[13px] leading-relaxed text-gray-300">
                    <span className="f-grotesk font-600 text-white">
                      Quer aprender outra coisa?
                    </span>{" "}
                    É só pedir: a aula é montada sob medida para você.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pacotes ── */}
      <section id="pacotes" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:py-28">
        <AnimatedSection>
          <p className="section-label f-mono mb-3">// valores</p>
          <h2 className="f-grotesk max-w-xl text-3xl font-700 tracking-tight text-white md:text-4xl">
            Pacotes simples, sem{" "}
            <span className="gradient-text">surpresa</span>.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-500">
            Todas as aulas são individuais, de 1 hora, na sua casa — e valem
            tanto pra crianças quanto pra idosos.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACOTES.map((p, i) => (
            <AnimatedSection key={p.nome} delay={(i + 1) * 100}>
              <div
                className={`ti-card relative flex h-full flex-col rounded-2xl p-6 ${
                  p.destaque ? "glass-purple ti-destaque" : "glass"
                }`}
              >
                {p.destaque && (
                  <span className="f-mono absolute -top-3 left-5 rounded-full bg-[#9B6BB5] px-3 py-1 text-[10px] font-bold tracking-wider text-white">
                    MAIS ESCOLHIDO
                  </span>
                )}
                <h3 className="f-grotesk text-lg font-600 text-white">{p.nome}</h3>
                <p className="mt-1.5 min-h-[40px] text-[13px] leading-relaxed text-gray-400">
                  {p.aulas}
                </p>
                <p className="f-grotesk mt-4 text-3xl font-700 text-white">
                  {p.valor}
                </p>
                <p
                  className={`mt-1 text-[12px] font-medium ${
                    p.destaque ? "text-[#C49BD8]" : "text-[#4FC3D9]"
                  }`}
                >
                  {p.porAula}
                </p>
                <a
                  href={waLink(`Oi, Laisa! Quero agendar o pacote "${p.nome}" das aulas de informática.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 block rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                    p.destaque
                      ? "bg-[#9B6BB5] text-white hover:bg-[#b07ecb]"
                      : "border border-white/15 text-white hover:border-[#2E9BAF]/60 hover:text-[#4FC3D9]"
                  }`}
                >
                  Agendar
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={200}>
          <p className="mt-8 text-center text-[13px] text-gray-500">
            Quer aprender outra coisa? É só pedir: a aula é montada sob medida
            para você.
          </p>
        </AnimatedSection>
      </section>

      {/* ── Como funciona ── */}
      <section className="relative border-t border-white/8 bg-[#07070C]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <AnimatedSection>
            <p className="section-label f-mono mb-3">// como funciona</p>
            <h2 className="f-grotesk max-w-xl text-3xl font-700 tracking-tight text-white md:text-4xl">
              Três passos entre você e a{" "}
              <span className="gradient-text">primeira aula</span>.
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PASSOS.map((s, i) => (
              <AnimatedSection key={s.n} delay={(i + 1) * 100}>
                <div className="ti-card glass relative h-full rounded-2xl p-7">
                  <span className="f-grotesk absolute right-6 top-5 text-5xl font-700 text-white/5">
                    {s.n}
                  </span>
                  <div className="mb-4 inline-flex rounded-xl bg-[#9B6BB5]/15 p-3 text-[#C49BD8]">
                    <Icon d={s.icon} />
                  </div>
                  <h3 className="f-grotesk mb-2 text-lg font-600 text-white">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-gray-400">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quem ensina ── */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
          <AnimatedSection>
            <div className="ti-hud relative mx-auto max-w-[320px]">
              <span className="ti-corner ti-corner-tl" />
              <span className="ti-corner ti-corner-br" />
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/laisa-aulas.png"
                  alt="Laisa Barth"
                  width={640}
                  height={853}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="section-label f-mono mb-3">// quem ensina</p>
            <h2 className="f-grotesk text-3xl font-700 tracking-tight text-white md:text-4xl">
              Laisa Barth
            </h2>
            <p className="f-mono mt-2 text-xs text-[#4FC3D9]">
              desenvolvedora · fundadora da BeSmart · ama ensinar
            </p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-400">
              Eu construo sistemas e soluções com IA que rodam em empresas
              reais — e acredito que tecnologia só vale alguma coisa quando
              aproxima as pessoas. Nas aulas, explico tudo em português claro,
              sem tecniquês, com paciência de verdade: pode perguntar a mesma
              coisa dez vezes que eu explico com o mesmo carinho nas dez. Com
              as crianças, viro parceira de criação; com os mais experientes,
              o apoio que faltava pra perder o medo da tecnologia.
            </p>
            <div className="f-mono mt-8 flex flex-wrap gap-3 text-[11px]">
              <span className="badge badge-purple">Paciência de verdade</span>
              <span className="badge badge-teal">Sem pressa, sem tecniquês</span>
              <span className="badge badge-purple">Aulas individuais em casa</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="ti-grid-bg relative overflow-hidden border-t border-white/8">
        <div className="orb left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-[#9B6BB5]/15" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
          <AnimatedSection>
            <h2 className="f-grotesk text-3xl font-700 leading-tight tracking-tight text-white md:text-5xl">
              Nunca é cedo — nem tarde — demais pra{" "}
              <span className="gradient-text">aprender</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-400">
              Me chame no WhatsApp e me conte quem vai aprender. A primeira
              conversa é gratuita e sem compromisso.
            </p>
            <div className="mt-9 flex justify-center">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.8-5.1c-.6-1-1-2.1-.9-2.9 0-.6.4-1.2.8-1.5.2-.2.5-.2.7-.2h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7a9.6 9.6 0 0 0 3.9 3.5c.3.1.5.1.7-.1l.7-.8c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.4.1.1.1.6-.3 1.4Z" />
                </svg>
                Quero agendar minhas aulas
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 md:flex-row">
          <a href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="BeSmart" width={80} height={24} className="h-5 w-auto" />
          </a>
          <p className="f-mono text-[11px] text-gray-600">
            © {new Date().getFullYear()} BeSmart · aulas de informática — feito com ♥ e muito café
          </p>
        </div>
      </footer>
    </main>
  );
}

// ─── Page-local CSS ───────────────────────────────────────────────────────────

const css = `
.f-grotesk { font-family: var(--font-grotesk), var(--font-inter), system-ui, sans-serif; }
.f-mono { font-family: var(--font-jetbrains), ui-monospace, monospace; }
.font-700 { font-weight: 700; }
.font-600 { font-weight: 600; }

/* fundo quadriculado tech */
.ti-grid-bg {
  background-image:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 44px 44px;
}
.ti-hero {
  position: relative;
}
.ti-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(600px circle at var(--mx, 70%) var(--my, 30%), rgba(155,107,181,0.08), transparent 55%),
    linear-gradient(to bottom, rgba(5,5,8,0.4), transparent 30%, transparent 70%, #050508);
}

/* painel (chat e terminal) */
.ti-panel {
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  background: rgba(10,10,14,0.85);
  box-shadow: 0 0 40px rgba(46,155,175,0.08);
  backdrop-filter: blur(8px);
  overflow: hidden;
}
.ti-panel-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.ti-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.ti-terminal-body {
  margin: 0;
  padding: 16px;
  font-size: 12px;
  line-height: 1.8;
  color: #7FD9E8;
  white-space: pre-wrap;
  min-height: 150px;
}
.ti-cursor { animation: ti-blink 1s step-end infinite; color: #9B6BB5; }
@keyframes ti-blink { 50% { opacity: 0; } }

.ti-bubble {
  max-width: 85%;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.5;
  animation: ti-pop 0.3s ease;
}
.ti-bubble-aluna {
  align-self: flex-start;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.08);
  border-bottom-left-radius: 4px;
  color: #D1D5DB;
}
.ti-bubble-laisa {
  align-self: flex-end;
  background: rgba(155,107,181,0.18);
  border: 1px solid rgba(155,107,181,0.3);
  border-bottom-right-radius: 4px;
  color: #E8D5F2;
}
@keyframes ti-pop {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* título com contorno */
.ti-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255,255,255,0.65);
}

/* moldura HUD */
.ti-corner {
  position: absolute;
  width: 26px;
  height: 26px;
  border: 2px solid #2E9BAF;
  z-index: 2;
}
.ti-corner-tl { top: -8px; left: -8px; border-right: none; border-bottom: none; border-radius: 6px 0 0 0; }
.ti-corner-tr { top: -8px; right: -8px; border-left: none; border-bottom: none; border-radius: 0 6px 0 0; border-color: #9B6BB5; }
.ti-corner-bl { bottom: -8px; left: -8px; border-right: none; border-top: none; border-radius: 0 0 0 6px; border-color: #9B6BB5; }
.ti-corner-br { bottom: -8px; right: -8px; border-left: none; border-top: none; border-radius: 0 0 6px 0; }
.ti-photo { box-shadow: 0 0 60px rgba(155,107,181,0.18); }

/* scanline sobre a foto */
.ti-scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 46%, rgba(46,155,175,0.14) 50%, transparent 54%);
  animation: ti-scan 5s linear infinite;
  mix-blend-mode: screen;
}
@keyframes ti-scan {
  0% { transform: translateY(-60%); }
  100% { transform: translateY(60%); }
}

/* marquee */
.ti-marquee { animation: ti-marquee 36s linear infinite; }
@keyframes ti-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* cards */
.ti-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: default;
}
.ti-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(155,107,181,0.16);
  border-color: rgba(155,107,181,0.35);
}
.ti-destaque {
  border-color: rgba(155,107,181,0.45);
  box-shadow: 0 0 48px rgba(155,107,181,0.15);
}

/* cards de trilha no hero */
.ti-trilha {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}
.ti-trilha:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 36px rgba(46,155,175,0.18);
}

/* botão fantasma */
.ti-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.14);
  color: #D1D5DB;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  cursor: pointer;
  background: rgba(10,10,14,0.6);
  backdrop-filter: blur(8px);
}
.ti-btn-ghost:hover {
  border-color: rgba(46,155,175,0.6);
  color: #4FC3D9;
  background: rgba(46,155,175,0.08);
}

/* pulso */
.ti-pulse { animation: ti-pulse 2s ease-in-out infinite; }
@keyframes ti-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(40,200,64,0.5); }
  50% { opacity: 0.6; box-shadow: 0 0 0 5px rgba(40,200,64,0); }
}

@media (prefers-reduced-motion: reduce) {
  .ti-marquee, .ti-scan, .ti-pulse, .ti-cursor { animation: none; }
  .ti-card:hover, .ti-trilha:hover { transform: none; }
}
`;
