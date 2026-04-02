import Image from "next/image";
import AnimatedSection from "./components/AnimatedSection";
import MobileMenu from "./components/MobileMenu";

const WA_LINK = "https://wa.me/555121438299";
const ORBIT_LINK = "https://www.orbitaibesmart.com.br/";

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
            <a href="#produtos" className="nav-link">Produtos</a>
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
              <div className="badge badge-purple mb-6">Agência das Agências</div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1
                className="text-[2.2rem] sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Construímos a agência{" "}
                <span className="gradient-text italic">que queríamos ter.</span>{" "}
                Agora você pode ter também.
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p
                className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
                style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
              >
                A BeSmart é uma agência de social media que virou referência em processo e tecnologia.
                Gerenciamos 36 clientes — e desenvolvemos as ferramentas que nos permitiram crescer
                sem travar. Hoje, essas ferramentas estão disponíveis para outras agências.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="flex flex-wrap gap-4">
                <a href={WA_LINK} className="btn-whatsapp">
                  <WhatsAppIcon />
                  Quero conhecer
                </a>
                <a href="#produtos" className="btn-secondary">
                  Ver os produtos
                  <ArrowRightIcon />
                </a>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={400}>
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { num: "36+", label: "Clientes ativos gerenciados" },
                { num: "6+", label: "Anos operando e otimizando" },
                { num: "3", label: "Ferramentas desenvolvidas" },
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
      </section>

      <hr className="brand" />

      {/* ── SOBRE NÓS ─────────────────────────────────────────────────────── */}
      <section
        id="sobre"
        className="py-16 md:py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #0D0A14 100%)" }}
      >
        <div
          className="orb w-[400px] h-[400px] top-[10%] right-[-100px]"
          style={{ background: "rgba(155, 107, 181, 0.07)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
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
                <p
                  className="leading-relaxed mb-4"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  A BeSmart nasceu em 2018 com uma missão simples: fazer marketing digital com processo,
                  propósito e criatividade de verdade. Com o tempo, gerenciando dezenas de clientes
                  simultaneamente, percebemos que as ferramentas do mercado não davam conta da nossa
                  operação — então construímos as nossas.
                </p>
                <p
                  className="leading-relaxed mb-4"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Hoje somos uma agência especializada em gestão de redes sociais{" "}
                  <strong style={{ color: "#D1D5DB" }}>e</strong> uma empresa de tecnologia para o mercado
                  de agências. Tudo que oferecemos foi testado, refinado e validado dentro da nossa própria
                  operação — com clientes reais, desafios reais e resultados reais.
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Se funciona para nós, vai funcionar para você.
                </p>
              </AnimatedSection>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "36+", label: "Clientes ativos gerenciados todo mês", accent: "#9B6BB5" },
                { num: "6+", label: "Anos operando e otimizando o processo", accent: "#2E9BAF" },
                { num: "3", label: "Ferramentas desenvolvidas internamente", accent: "#9B6BB5" },
                { num: "100%", label: "Das soluções testadas na nossa própria agência", accent: "#2E9BAF" },
              ].map(({ num, label, accent }, i) => (
                <AnimatedSection key={label} delay={((i + 1) * 100) as 100 | 200 | 300 | 400}>
                  <div
                    className="glass rounded-2xl p-6 h-full"
                    style={{ borderColor: `${accent}33` }}
                  >
                    <div
                      className="text-4xl font-bold mb-2"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: accent }}
                    >
                      {num}
                    </div>
                    <div
                      className="text-sm leading-snug"
                      style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {label}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── O PROBLEMA ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-28 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div
          className="orb w-[500px] h-[500px] bottom-0 left-[-150px]"
          style={{ background: "rgba(46, 155, 175, 0.06)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedSection>
              <span className="section-label">O Problema</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Agência crescendo.{" "}
                <span className="gradient-text italic">Você soterrado na operação.</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className="text-lg" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                Cada cliente novo não traz só receita — traz mais aprovações no WhatsApp, mais planilhas,
                mais retrabalho. O modelo manual tem um teto. Nós chegamos nesse teto. E decidimos quebrar ele.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { emoji: "📅", title: "Planejamentos que tomam dias", desc: "Criar conteúdo do zero para dezenas de clientes todo mês é inviável sem um sistema." },
              { emoji: "📱", title: "Aprovações perdidas no WhatsApp", desc: "Mensagem que some, cliente que não responde, post que sai sem aprovação." },
              { emoji: "🔁", title: "Retrabalho constante da equipe", desc: "Sem visibilidade de quem está fazendo o quê, tudo vira urgência de última hora." },
              { emoji: "🤖", title: "Leads respondidos horas depois", desc: "Enquanto você estava em reunião, o lead foi falar com outra agência." },
              { emoji: "⏱️", title: "Onboarding manual e demorado", desc: "Cada cliente novo exige horas de briefing, criação de doc, configuração de ferramentas." },
              { emoji: "📊", title: "Financeiro na cabeça ou na planilha", desc: "Mensalidades vencidas, inadimplência descoberta tarde demais." },
            ].map(({ emoji, title, desc }, i) => (
              <AnimatedSection key={title} delay={((i % 3) * 100) as 0 | 100 | 200}>
                <div className="glass rounded-2xl p-6 h-full hover:border-white/15 transition-all duration-300">
                  <div className="text-3xl mb-4">{emoji}</div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ fontFamily: "var(--font-inter), sans-serif", color: "#FFFFFF" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={200}>
            <div className="text-center">
              <p
                className="text-lg font-semibold"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#9B6BB5",
                  fontStyle: "italic",
                }}
              >
                Não inventamos esses problemas. Nós os vivemos — e construímos as soluções.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <hr className="brand" />

      {/* ── DOIS CAMINHOS ─────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0D0A14 50%, #071318 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimatedSection>
              <span className="section-label">O que fazemos</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Para quem quer crescer na internet.{" "}
                <span className="gradient-text italic">E para quem ajuda outros a crescerem.</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className="text-base" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                A BeSmart atua em duas frentes complementares: como agência de gestão de redes sociais
                para marcas e negócios, e como desenvolvedora de tecnologia para agências que querem
                escalar sem se perder na operação.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <AnimatedSection delay={100}>
              <div className="glass-purple rounded-3xl p-8 md:p-10 flex flex-col h-full">
                <div className="badge badge-purple mb-4">Para marcas e negócios</div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Sua presença digital, do início ao fim.
                </h3>
                <p
                  className="leading-relaxed flex-1 mb-8"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Cuidamos da sua presença digital do início ao fim. Estratégia, criação, aprovação e
                  análise — tudo com processo e consistência, todo mês.
                </p>
                <a href={WA_LINK} className="btn-whatsapp self-start">
                  <WhatsAppIcon />
                  Quero a BeSmart gerenciando minhas redes
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="glass-teal rounded-3xl p-8 md:p-10 flex flex-col h-full">
                <div className="badge badge-teal mb-4">Para agências</div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  As ferramentas que usamos para escalar.
                </h3>
                <p
                  className="leading-relaxed flex-1 mb-8"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Disponibilizamos as ferramentas que construímos para escalar nossa própria operação.
                  Testadas com 36 clientes reais, prontas para transformar a sua agência também.
                </p>
                <a
                  href="#produtos"
                  className="btn-secondary self-start"
                  style={{ borderColor: "rgba(46, 155, 175, 0.5)" }}
                >
                  Ver os produtos para agências
                  <ArrowRightIcon />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── GESTÃO DE REDES SOCIAIS ────────────────────────────────────────── */}
      <section id="gestao" className="py-16 md:py-28 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div
          className="orb w-[600px] h-[600px] top-[-100px] right-[-200px]"
          style={{ background: "rgba(155, 107, 181, 0.08)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection>
                <span className="section-label">Gestão de Redes Sociais</span>
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
                { n: "1", title: "Planejamento", desc: "Estratégia mensal personalizada com calendário editorial completo, desenvolvido com base no seu negócio, público e objetivos." },
                { n: "2", title: "Criação", desc: "Design e conteúdo produzidos com identidade visual consistente. Cada post pensado para comunicar, engajar e converter." },
                { n: "3", title: "Aprovação", desc: "Você revisa tudo antes de publicar através do nosso portal, sem precisar de login, sem aprovação por WhatsApp, sem estresse." },
                { n: "4", title: "Análise", desc: "Relatório mensal com dados reais para potencializar o que funciona e ajustar o que pode melhorar." },
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

      {/* ── PRODUTOS PARA AGÊNCIAS ─────────────────────────────────────────── */}
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
              <span className="section-label">Produtos para Agências</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Três ferramentas.{" "}
                <span className="gradient-text italic">Uma agência diferente.</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className="text-base" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
                Construídas por quem gerenciou 36 clientes de social media por 6 anos. Não são promessas —
                são as mesmas ferramentas que usamos todo dia para manter nossa operação funcionando sem
                depender de nós no operacional.
              </p>
            </AnimatedSection>
          </div>

          <div className="flex flex-col gap-8">
            {/* ─ OrbitAI ─────────────────────────────────────────────────── */}
            <AnimatedSection>
              <div className="glass-purple rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-10 items-start">
                  <div>
                    <div className="badge badge-purple mb-4">Sistema de Gestão</div>
                    <h3
                      className="text-3xl md:text-4xl font-bold mb-4"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      Sua agência inteira em um único sistema.{" "}
                      <span className="gradient-text italic">Do planejamento ao financeiro.</span>
                    </h3>
                    <p
                      className="leading-relaxed mb-8"
                      style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      O OrbitAI nasceu porque nenhuma ferramenta do mercado resolvia tudo que uma
                      agência de social media precisa. Então construímos do zero — integrando IA para
                      geração de conteúdo, portal de aprovação para clientes, kanban para a equipe e
                      controle financeiro em um só lugar.
                    </p>
                    <a
                      href={ORBIT_LINK}
                      className="btn-link font-semibold"
                      style={{ color: "#9B6BB5" }}
                    >
                      Conhecer o OrbitAI
                      <ArrowRightIcon />
                    </a>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      "Planejamentos editoriais gerados por IA em segundos",
                      "Portal de aprovação para o cliente — só um link, sem login",
                      "Kanban da equipe com notificações automáticas",
                      "Controle financeiro com alertas de inadimplência",
                      "Onboarding de novos clientes em menos de 5 minutos",
                      "Visibilidade total da produção em tempo real",
                    ].map((item) => (
                      <div key={item} className="check-item">
                        <span className="check-icon"><CheckIcon /></span>
                        <span style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              {/* ─ ProspectAI ─────────────────────────────────────────────── */}
              <AnimatedSection delay={100}>
                <div className="glass-teal rounded-3xl p-8 flex flex-col h-full">
                  <div className="badge badge-teal mb-4">Prospecção Automática</div>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    Pare de prospectar na mão.{" "}
                    <span style={{ color: "#2E9BAF" }}>No automático.</span>
                  </h3>
                  <p
                    className="leading-relaxed mb-6"
                    style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Você digita um nicho e uma cidade, e o sistema busca negócios reais no Google Maps,
                    filtra os de melhor potencial e gera uma mensagem de WhatsApp personalizada para cada
                    um usando IA. Você só precisa enviar.
                  </p>
                  <div className="flex flex-col gap-2.5 mb-8 flex-1">
                    {[
                      "Busca automática de negócios por nicho e cidade no Google Maps",
                      "Filtro inteligente para focar nos leads com mais potencial",
                      "Mensagem personalizada gerada por IA para cada contato",
                      "Histórico completo: contatado, respondeu, virou cliente",
                      "Escale sua prospecção sem contratar mais ninguém",
                    ].map((item) => (
                      <div key={item} className="check-item text-sm">
                        <span style={{ color: "#2E9BAF", flexShrink: 0, marginTop: "2px" }}>
                          <CheckIcon />
                        </span>
                        <span style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={WA_LINK}
                    className="btn-whatsapp self-start"
                    style={{ background: "#2E9BAF" }}
                  >
                    <WhatsAppIcon />
                    Quero conhecer o ProspectAI
                  </a>
                </div>
              </AnimatedSection>

              {/* ─ Agente de Atendimento ──────────────────────────────────── */}
              <AnimatedSection delay={200}>
                <div className="glass-purple rounded-3xl p-8 flex flex-col h-full">
                  <div className="badge badge-purple mb-4">Atendimento 24h</div>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    Seu atendimento funcionando{" "}
                    <span className="gradient-text">24h</span>{" "}
                    — mesmo quando você não está disponível.
                  </h3>
                  <p
                    className="leading-relaxed mb-6"
                    style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Enquanto você está em reunião, atendendo outro cliente ou simplesmente fora do
                    horário comercial, seu agente de IA está respondendo, qualificando e aquecendo
                    leads no WhatsApp. Só aciona você quando o cliente está pronto para comprar.
                  </p>
                  <div className="flex flex-col gap-2.5 mb-8 flex-1">
                    {[
                      "Responde perguntas dos clientes automaticamente, 24h por dia",
                      "Qualifica leads com base nos critérios do seu negócio",
                      "Encaminha para você só quando o lead está quente",
                      "Funciona no WhatsApp, Instagram e outros canais",
                      "Relatório de conversas e taxa de conversão",
                    ].map((item) => (
                      <div key={item} className="check-item text-sm">
                        <span className="check-icon"><CheckIcon /></span>
                        <span style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href={WA_LINK} className="btn-whatsapp self-start">
                    <WhatsAppIcon />
                    Quero o agente de atendimento
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <hr className="brand" />

      {/* ── POR QUE CONFIAR ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-28 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div
          className="orb w-[500px] h-[500px] top-[-100px] right-[-100px]"
          style={{ background: "rgba(155, 107, 181, 0.07)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection>
                <span className="section-label">Por que confiar</span>
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
                  className="leading-relaxed mb-4"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Existe uma diferença fundamental entre uma empresa de tecnologia que nunca gerenciou
                  uma agência e uma agência que construiu sua própria tecnologia.{" "}
                  <strong style={{ color: "#D1D5DB" }}>Nós somos a segunda.</strong>
                </p>
                <p
                  className="leading-relaxed mb-4"
                  style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Cada funcionalidade do OrbitAI, cada fluxo do ProspectAI, cada resposta do Agente
                  de IA foi pensada, testada e ajustada dentro da nossa própria operação — com clientes
                  reais, pressão real e resultado real.
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Quando dizemos que funciona, é porque usamos todo dia.
                </p>
              </AnimatedSection>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: "🏆", title: "Validado na prática", desc: "Tudo testado com 36 clientes reais antes de chegar até você" },
                { icon: "🔧", title: "Desenvolvido por quem opera", desc: "Criado por quem entende os problemas de dentro" },
                { icon: "🚀", title: "Implementação assistida", desc: "Não te deixamos sozinho no onboarding" },
                { icon: "📈", title: "Evolução contínua", desc: "As ferramentas crescem junto com as demandas reais da operação" },
              ].map(({ icon, title, desc }, i) => (
                <AnimatedSection key={title} delay={((i + 1) * 100) as 100 | 200 | 300 | 400}>
                  <div className="glass rounded-2xl p-5 flex gap-4 items-start hover:border-white/12 transition-all">
                    <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
                    <div>
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: "var(--font-inter), sans-serif", color: "#FFFFFF" }}
                      >
                        {title}
                      </h4>
                      <p
                        className="text-sm"
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

      {/* ── VALORES ───────────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D0A14 0%, #071318 50%, #0A0A0A 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <AnimatedSection>
              <span className="section-label">Valores</span>
              <h2
                className="text-3xl md:text-5xl font-bold mt-3"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Os princípios que guiam{" "}
                <span className="gradient-text italic">cada decisão</span>
              </h2>
            </AnimatedSection>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "⚙️", title: "Processo", desc: "Cada etapa mapeada e otimizada para entregar consistência sem abrir mão da qualidade." },
              { icon: "🎯", title: "Propósito", desc: "Fazemos marketing com intenção clara: gerar resultado real para nossos clientes." },
              { icon: "💡", title: "Criatividade", desc: "Ideias originais e estratégicas que fazem a diferença na presença digital." },
              { icon: "📊", title: "Dados", desc: "Cada decisão baseada em análise, métricas e evolução contínua." },
            ].map(({ icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={((i + 1) * 100) as 100 | 200 | 300 | 400}>
                <div className="glass rounded-2xl p-7 text-center hover:border-white/12 transition-all h-full flex flex-col items-center">
                  <div className="text-3xl mb-4">{icon}</div>
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ fontFamily: "var(--font-inter), sans-serif", color: "#FFFFFF" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
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
              Pronto para ter uma agência que{" "}
              <span className="gradient-text italic">escala sem você no operacional?</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <p
              className="text-lg mb-10 max-w-2xl mx-auto"
              style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Seja para contratar a gestão das suas redes sociais ou para conhecer as ferramentas que
              vão transformar a sua agência — a conversa começa aqui. Sem compromisso, sem enrolação.
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
                Ver todos os produtos
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
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Agência de Ideias. Tecnologia e social media testadas na prática, disponíveis para
                agências que querem crescer de verdade.
              </p>
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Navegação
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  ["Gestão de Redes Sociais", "#gestao"],
                  ["OrbitAI", ORBIT_LINK],
                  ["ProspectAI", WA_LINK],
                  ["Agente de IA", WA_LINK],
                  ["Sobre nós", "#sobre"],
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
            <p
              className="text-xs italic"
              style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}
            >
              BeSmart — Agência de Ideias
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
