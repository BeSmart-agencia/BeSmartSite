import Image from "next/image";
import AnimatedSection from "./components/AnimatedSection";
import MobileMenu from "./components/MobileMenu";

const WA_LINK = "https://wa.me/555121438299";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
        style={{ background: "rgba(10, 10, 10, 0.85)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="BeSmart"
              width={160}
              height={50}
              className="object-contain h-11 w-auto"
              priority
            />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="nav-link">Sobre nós</a>
            <a href="#gestao" className="nav-link">Gestão de Redes</a>
            <a href="#produtos" className="nav-link">Ferramentas</a>
            <a href="#contato" className="nav-link">Contato</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href={WA_LINK} className="btn-whatsapp" style={{ padding: "10px 20px", fontSize: "13px" }}>
              <WhatsAppIcon size={15} />
              Falar no WhatsApp
            </a>
          </div>
          <MobileMenu />
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div
          className="orb w-[600px] h-[600px] top-[-200px] left-[-200px]"
          style={{ background: "rgba(155, 107, 181, 0.12)" }}
        />
        <div
          className="orb w-[500px] h-[500px] bottom-[-150px] right-[-150px]"
          style={{ background: "rgba(46, 155, 175, 0.10)" }}
        />

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 w-full">
          <div className="max-w-4xl">
            <AnimatedSection>
              <h1
                className="text-[2.2rem] sm:text-5xl md:text-7xl font-bold leading-tight mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Tecnologia e marketing que{" "}
                <span className="gradient-text italic">fazem seu negócio crescer.</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="flex flex-wrap gap-2 mb-8">
                {(["social media", "conteúdo próprio", "prospecção", "sistemas com IA"] as const).map(
                  (tag, i) => (
                    <span key={tag} className={`badge ${i % 2 === 0 ? "badge-purple" : "badge-teal"}`}>
                      {tag}
                    </span>
                  )
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p
                className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Social media, prospecção automática, conteúdo com IA e sistemas sob medida — tudo
                desenvolvido e validado por quem opera de verdade há 6 anos.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="flex flex-wrap gap-4 mb-6">
                <a href={WA_LINK} className="btn-whatsapp">
                  <WhatsAppIcon />
                  Quero conversar
                </a>
                <a href="#gestao" className="btn-secondary">
                  Ver o que fazemos
                  <ArrowRightIcon />
                </a>
              </div>
              <p
                className="text-sm"
                style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}
              >
                6 anos. Resultado real. Clientes no Brasil, Estados Unidos, Alemanha e Portugal.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── SOBRE NÓS ─────────────────────────────────────────────────────── */}
      <section id="sobre" className="py-16 md:py-28 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div
          className="orb w-[500px] h-[500px] top-[-100px] right-[-150px]"
          style={{ background: "rgba(46, 155, 175, 0.07)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection>
                <span className="section-label">Sobre nós</span>
                <h2
                  className="text-3xl md:text-5xl font-bold mt-3 mb-6"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Não vendemos o que{" "}
                  <span className="gradient-text italic">nunca testamos.</span>
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={100}>
                <div
                  className="flex flex-col gap-5 leading-relaxed"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  <p>
                    A BeSmart nasceu em 2018 com uma missão simples: fazer marketing digital com processo,
                    propósito e criatividade de verdade. Com o tempo, gerenciando dezenas de clientes
                    simultaneamente, percebemos que as ferramentas do mercado não davam conta — então
                    construímos as nossas.
                  </p>
                  <p>
                    Hoje somos uma agência especializada em gestão de redes sociais e uma empresa de
                    tecnologia. Atendemos clientes no Brasil, Estados Unidos, Alemanha e Portugal — com
                    o mesmo nível de processo e resultado em qualquer mercado.
                  </p>
                  <p>
                    Tudo que oferecemos foi testado, refinado e validado dentro da nossa própria operação.
                    Se funciona para nós, vai funcionar para você.
                  </p>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "36+", label: "Clientes ativos todo mês" },
                  { num: "6+", label: "Anos de operação real" },
                  { num: "4", label: "Países atendidos" },
                  { num: "100%", label: "Das soluções testadas internamente" },
                ].map(({ num, label }) => (
                  <div key={label} className="glass rounded-2xl p-5">
                    <div
                      className="stat-number gradient-text"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {num}
                    </div>
                    <div
                      className="text-sm mt-1"
                      style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── O QUE FAZEMOS + GESTÃO DE REDES ───────────────────────────────── */}
      <section id="gestao" className="py-16 md:py-28 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div
          className="orb w-[600px] h-[600px] top-[-100px] right-[-200px]"
          style={{ background: "rgba(155, 107, 181, 0.08)" }}
        />
        <div className="max-w-7xl mx-auto px-6">

          {/* intro */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <AnimatedSection>
              <span className="section-label">O que fazemos</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Para quem quer crescer na internet.{" "}
                <span className="gradient-text italic">
                  E para quem precisa de tecnologia para crescer.
                </span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className="text-base" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                A BeSmart atua em duas frentes: gestão de presença digital para marcas e negócios, e
                desenvolvimento de tecnologia para quem precisa de sistemas que funcionam de verdade.
              </p>
            </AnimatedSection>
          </div>

          {/* Gestão de Redes */}
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection>
                <span className="section-label">Social Media</span>
                <h2
                  className="text-3xl md:text-5xl font-bold mt-3 mb-6"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Sua marca{" "}
                  <span className="gradient-text italic">presente, consistente</span>{" "}
                  e gerando resultado — todo mês.
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={100}>
                <p
                  className="leading-relaxed mb-8"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Gerenciamos a presença digital de mais de 36 clientes com um processo estruturado
                  de ponta a ponta. Nada é improvisado: cada cliente tem estratégia própria, calendário
                  editorial, fluxo de aprovação e relatório mensal de performance.
                </p>
                <a href={WA_LINK} className="btn-whatsapp">
                  <WhatsAppIcon />
                  Quero a BeSmart cuidando das minhas redes
                </a>
              </AnimatedSection>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { n: "1", title: "Planejamento", desc: "Estratégia mensal personalizada com calendário editorial completo." },
                { n: "2", title: "Criação", desc: "Design e conteúdo com identidade visual consistente." },
                { n: "3", title: "Aprovação", desc: "Você revisa tudo antes de publicar. Sem surpresas, sem WhatsApp." },
                { n: "4", title: "Análise", desc: "Dados mensais para potencializar o que funciona e ajustar o resto." },
              ].map(({ n, title, desc }, i) => (
                <AnimatedSection key={n} delay={((i + 1) * 100) as 100 | 200 | 300 | 400}>
                  <div className="glass rounded-2xl p-5 flex gap-4 items-start hover:border-purple-500/20 transition-all">
                    <div className="step-number">{n}</div>
                    <div>
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: "var(--font-inter), sans-serif", color: "#FFFFFF" }}
                      >
                        {title}
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── O QUE OFERECEMOS ──────────────────────────────────────────────── */}
      <section
        id="produtos"
        className="py-16 md:py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #071318 0%, #0D0A14 50%, #0A0A0A 100%)" }}
      >
        <div
          className="orb w-[500px] h-[500px] bottom-0 left-[-100px]"
          style={{ background: "rgba(46, 155, 175, 0.07)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedSection>
              <span className="section-label">O que oferecemos</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Presença digital e tecnologia{" "}
                <span className="gradient-text italic">que geram resultado.</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className="text-base" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                Gestão de redes sociais para marcas que querem crescer online e sistemas sob medida
                para empresas que precisam de tecnologia que funciona de verdade.
              </p>
            </AnimatedSection>
          </div>

          <div className="flex flex-col gap-8">

            {/* ─ Sistemas Sob Medida (destaque) ────────────────────────────── */}
            <AnimatedSection>
              <div className="glass-teal rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-10 items-start">
                  <div>
                    <div className="badge badge-teal mb-4">Sistemas Sob Medida</div>
                    <h3
                      className="text-3xl md:text-4xl font-bold mb-4"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      Seu processo não cabe em ferramenta pronta?{" "}
                      <span style={{ color: "#2E9BAF" }}>A gente constrói o que você precisa.</span>
                    </h3>
                    <p
                      className="leading-relaxed mb-8"
                      style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Desenvolvemos sistemas personalizados para empresas que precisam automatizar
                      processos específicos — atendimento, prospecção, gestão interna, integrações.
                      Cada sistema é pensado para o seu negócio, construído com IA onde faz sentido.
                    </p>
                    <a href={WA_LINK} className="btn-whatsapp" style={{ background: "#2E9BAF" }}>
                      <WhatsAppIcon />
                      Quero agendar uma reunião estratégica
                    </a>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      "Automação de atendimento e qualificação de leads no WhatsApp",
                      "Integrações entre ferramentas que não se conversam",
                      "Sistemas internos para gestão de processos e equipes",
                      "Agentes de IA para tarefas repetitivas e operacionais",
                      "Portal do cliente, dashboards e relatórios automáticos",
                      "Do briefing à entrega — sem achismo, com processo",
                    ].map((item) => (
                      <div key={item} className="check-item">
                        <span style={{ color: "#2E9BAF", flexShrink: 0 }}>
                          <CheckIcon />
                        </span>
                        <span style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ─ Social Media + OrbitAI Slim ───────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Social Media */}
              <AnimatedSection>
                <div className="glass-purple rounded-3xl p-8 flex flex-col h-full">
                  <div className="badge badge-purple mb-4">Gestão de Redes Sociais</div>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    Sua marca{" "}
                    <span className="gradient-text italic">presente, consistente</span>{" "}
                    e gerando resultado — todo mês.
                  </h3>
                  <p
                    className="leading-relaxed mb-6"
                    style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Gerenciamos a presença digital de mais de 36 clientes com processo estruturado
                    de ponta a ponta. Estratégia, criação, aprovação e análise — tudo incluso.
                  </p>
                  <div className="flex flex-col gap-2.5 mb-8 flex-1">
                    {[
                      "Estratégia mensal personalizada para o seu negócio",
                      "Design e conteúdo com identidade visual consistente",
                      "Fluxo de aprovação sem complicação",
                      "Relatório mensal de performance com dados reais",
                    ].map((item) => (
                      <div key={item} className="check-item text-sm">
                        <span className="check-icon"><CheckIcon /></span>
                        <span style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href={WA_LINK} className="btn-whatsapp self-start" style={{ background: "#9B6BB5" }}>
                    <WhatsAppIcon />
                    Quero a BeSmart nas minhas redes
                  </a>
                </div>
              </AnimatedSection>

              {/* OrbitAI Slim - em breve */}
              <AnimatedSection delay={100}>
                <div
                  className="glass rounded-3xl p-8 flex flex-col h-full"
                  style={{ opacity: 0.82 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="badge badge-purple">Conteúdo com IA</div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(155,107,181,0.15)",
                        color: "#9B6BB5",
                        border: "1px solid rgba(155,107,181,0.3)",
                        fontFamily: "var(--font-inter), sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Em breve
                    </span>
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    OrbitAI Creator.{" "}
                    <span className="gradient-text italic">
                      Crie seu próprio conteúdo com IA — sem depender de agência.
                    </span>
                  </h3>
                  <p
                    className="leading-relaxed mb-6"
                    style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Para criadores de conteúdo e pequenos negócios que querem consistência sem
                    perder tempo. Defina sua estratégia uma vez — a IA gera planejamento editorial
                    completo com posts, legendas e roteiros prontos para publicar.
                  </p>
                  <div className="flex flex-col gap-2.5 mb-8 flex-1">
                    {[
                      "Planejamento editorial mensal gerado por IA em minutos",
                      "Posts, legendas e roteiros de Reels prontos para usar",
                      "Estratégia personalizada para o seu nicho e público",
                      "Sem agência, sem dependência, sem processo complicado",
                    ].map((item) => (
                      <div key={item} className="check-item text-sm" style={{ opacity: 0.7 }}>
                        <span className="check-icon"><CheckIcon /></span>
                        <span style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href={WA_LINK} className="btn-whatsapp self-start" style={{ background: "#9B6BB5" }}>
                    <WhatsAppIcon />
                    Me avise quando lançar
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── POR QUE A BESMART ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-28 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div
          className="orb w-[600px] h-[600px] top-[-100px] left-[-200px]"
          style={{ background: "rgba(155, 107, 181, 0.08)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedSection>
              <span className="section-label">Por que a BeSmart</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-6"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Não ensinamos teoria.{" "}
                <span className="gradient-text italic">Mostramos o que funciona na prática.</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Existe uma diferença entre uma empresa que vende tecnologia sem nunca ter operado um
                negócio real — e uma empresa que construiu a própria tecnologia para resolver os próprios
                problemas. A BeSmart é a segunda. Cada produto que oferecemos nasceu dentro da nossa
                operação, foi testado com clientes reais e só chegou ao mercado depois de funcionar
                de verdade.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {([
              { icon: "🏆", title: "Validado na prática", desc: "Testado com 36 clientes reais antes de chegar até você." },
              { icon: "🌍", title: "Presença internacional", desc: "Clientes no Brasil, EUA, Alemanha e Portugal." },
              { icon: "🔧", title: "Construído por quem opera", desc: "Criado por quem entende os problemas de dentro." },
              { icon: "🚀", title: "Implementação assistida", desc: "Não te deixamos sozinho no onboarding." },
              { icon: "📈", title: "Evolução contínua", desc: "As soluções crescem junto com o seu negócio." },
            ] as const).map(({ icon, title, desc }, i) => {
              const delays = [100, 200, 300, 400, 100] as const;
              return (
                <AnimatedSection key={title} delay={delays[i]}>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="text-3xl mb-3">{icon}</div>
                    <h4
                      className="font-semibold mb-2"
                      style={{ fontFamily: "var(--font-inter), sans-serif", color: "#FFFFFF" }}
                    >
                      {title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {desc}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section id="contato" className="py-16 md:py-28 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div
          className="orb w-[700px] h-[700px] top-[-200px] left-[50%]"
          style={{ background: "rgba(155, 107, 181, 0.10)", transform: "translateX(-50%)" }}
        />
        <div
          className="orb w-[400px] h-[400px] bottom-[-100px] left-0"
          style={{ background: "rgba(46, 155, 175, 0.08)" }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <h2
              className="text-3xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Pronto para parar de improvisar e{" "}
              <span className="gradient-text italic">começar a crescer com processo?</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <p
              className="text-lg mb-10 max-w-2xl mx-auto"
              style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Seja para gestão de redes sociais, prospecção automática, conteúdo com IA ou um sistema
              sob medida — a conversa começa aqui. Sem compromisso, sem enrolação.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={WA_LINK}
                className="btn-whatsapp"
                style={{ fontSize: "16px", padding: "16px 32px" }}
              >
                <WhatsAppIcon size={20} />
                Falar com a BeSmart agora
              </a>
              <a
                href="#produtos"
                className="btn-secondary"
                style={{ fontSize: "16px", padding: "15px 31px" }}
              >
                Ver todos os serviços
                <ArrowRightIcon />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <hr className="brand" />

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-14" style={{ background: "#0A0A0A" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <Image
                src="/logo.png"
                alt="BeSmart"
                width={120}
                height={38}
                className="object-contain h-8 w-auto mb-4"
              />
              <p
                className="text-sm leading-relaxed mb-2"
                style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
              >
                BeSmart — Agência de Ideias
              </p>
              <p
                className="text-xs"
                style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Brasil · Estados Unidos · Alemanha · Portugal
              </p>
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Serviços
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  ["Social Media", "#gestao"],
                  ["Sistemas Sob Medida", "#produtos"],
                  ["OrbitAI Creator (Em breve)", "#produtos"],
                  ["Falar no WhatsApp", WA_LINK],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm transition-colors hover:text-white"
                      style={{
                        color: "#6B7280",
                        fontFamily: "var(--font-inter), sans-serif",
                        textDecoration: "none",
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Contato
              </p>
              <a
                href={WA_LINK}
                className="btn-whatsapp"
                style={{ fontSize: "14px", padding: "10px 20px" }}
              >
                <WhatsAppIcon size={15} />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="section-divider mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p
              className="text-xs"
              style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}
            >
              © 2025 BeSmart Agência de Ideias. Todos os direitos reservados.
            </p>
            <a
              href="/admin/login"
              className="text-xs italic"
              style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif", textDecoration: "none" }}
            >
              BeSmart — Agência de Ideias
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
