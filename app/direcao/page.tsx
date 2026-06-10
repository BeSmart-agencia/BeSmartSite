"use client";

import { useState } from "react";

const WA = "https://wa.me/555121438299";

// ─── Types ────────────────────────────────────────────────────────────────────

type Accent = "purple" | "teal";

interface Tip {
  n: string;
  title: string;
  desc: string;
  tip?: string | null;
  accent: Accent;
  visual?: string;
  essential?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PREPARO: Tip[] = [
  {
    n: "01", accent: "teal", essential: true,
    title: "Limpe a lente da câmera",
    desc: "A lente acumula gordura e poeira ao longo do dia. Um paninho seco antes de qualquer gravação faz toda a diferença — lente suja entrega imagem embaçada mesmo com boa luz.",
    tip: "Parece óbvio, mas é o erro mais comum.",
  },
  {
    n: "02", accent: "purple",
    title: "Use a câmera traseira",
    desc: "A câmera de trás tem qualidade muito superior à frontal. Sempre que possível, peça para alguém segurar o celular ou use um apoio. Vale o esforço.",
    tip: "Câmera traseira = qualidade superior.",
  },
  {
    n: "03", accent: "teal",
    title: "Feche apps em segundo plano",
    desc: "Celular com memória cheia trava na hora errada. Antes de gravar ou fotografar, feche o que não está usando.",
  },
  {
    n: "04", accent: "purple", essential: true,
    title: "Cuide do fundo",
    desc: "Parede limpa, ambiente organizado. Nada de cama bagunçada, porta de banheiro aberta ou pilha de caixas atrás. O fundo conta a história do lugar — cuide dele antes de começar.",
    tip: "O fundo conta a história do lugar.",
  },
];

const VIDEO: Tip[] = [
  {
    n: "01", accent: "teal", essential: true,
    title: "Apoie o celular — não segure na mão livre",
    desc: "Vídeo tremido cansa quem assiste e passa impressão de amadorismo. Use um tripé, apoie em uma superfície, encaixe no vão de uma janela. Qualquer apoio é melhor que nenhum.",
    tip: "Um tripé barato resolve. Um livro apoiado também.",
  },
  {
    n: "02", accent: "purple", essential: true,
    title: "Atenção à luz",
    desc: "Nunca grave com janela ou luz forte atrás de você — isso escurece o rosto. O ideal é estar de frente para a luz, seja ela natural (janela) ou artificial.",
    tip: "Luz boa esconde muito defeito.",
    visual: "light",
  },
  {
    n: "03", accent: "teal", essential: true,
    title: "Grave em ambiente silencioso",
    desc: "Som ruim estraga vídeo bom. Evite rua movimentada, TV ligada, ventilador perto do microfone. Um ambiente fechado e quieto já resolve.",
    tip: "Som ruim estraga um vídeo bom.",
  },
  {
    n: "04", accent: "purple",
    title: "Horizontal ou vertical — com intenção",
    desc: "Horizontal para feed, YouTube e apresentações. Vertical para Reels e Stories. Formato errado significa corte, barra preta ou imagem distorcida na edição.",
    visual: "orientation",
  },
  {
    n: "05", accent: "teal",
    title: "Olhe para a câmera, não para a tela",
    desc: "A tendência é olhar para a própria imagem. Mas quem assiste sente quando o olhar desvia. Olhe direto para a bolinha da câmera — isso cria conexão com quem vai ver.",
    tip: "Olhe para a bolinha da câmera.",
  },
  {
    n: "06", accent: "purple",
    title: "Cuide do enquadramento",
    desc: "Deixe a pessoa centralizada ou no terço da tela — não cortada na testa nem afogada embaixo. Deixe espaço acima da cabeça. Olhe pro quadro antes de apertar gravar.",
    visual: "framing",
  },
  {
    n: "07", accent: "teal",
    title: "Roupa e aparência",
    desc: "Evite listras finas e xadrez miúdo — na câmera vibram e distraem. Prefira cores sólidas. Verifique cabelo e roupa antes de começar.",
    tip: "Listras finas vibram na câmera. Prefira cores sólidas.",
  },
  {
    n: "08", accent: "purple",
    title: "Segundos de silêncio antes e depois",
    desc: "Grave alguns segundos em silêncio antes de começar a falar e depois de terminar. Facilita muito a edição — sem cortes abruptos no início e no fim.",
  },
  {
    n: "09", accent: "teal",
    title: "Sorria antes de falar",
    desc: "Começar o vídeo já sorrindo muda completamente a energia. Parece pequeno, mas faz diferença no engajamento.",
    tip: "Sorria antes de apertar gravar.",
  },
  {
    n: "10", accent: "purple",
    title: "Grave pelo menos 3 vezes",
    desc: "A primeira gravação quase nunca é a melhor. Grave pelo menos 3 vezes e escolha a que ficou mais natural. Mandar mais de uma versão pra gente é bem-vindo — escolhemos a melhor.",
    tip: "Mais de uma versão é bem-vinda.",
  },
];

const FOTO: Tip[] = [
  {
    n: "01", accent: "teal", essential: true,
    title: "Nunca use o zoom digital",
    desc: "Aproximar pelo zoom do celular pixela a imagem. Se precisar chegar mais perto, ande com o corpo — não com os dedos na tela.",
    tip: "Precisa chegar mais perto? Ande — não use o zoom.",
  },
  {
    n: "02", accent: "purple",
    title: "Ative o modo retrato para pessoas",
    desc: "Ele desfoca o fundo e destaca quem está na frente. Fica com cara de foto profissional sem precisar de nada extra.",
  },
  {
    n: "03", accent: "teal",
    title: "Ative a grade de alinhamento",
    desc: "Nas configurações da câmera, ative a grade. Ela ajuda a manter o horizonte reto e o enquadramento equilibrado — foto torta passa impressão de descuido.",
    visual: "grid",
  },
  {
    n: "04", accent: "purple", essential: true,
    title: "Luz natural é a melhor opção",
    desc: "Perto de uma janela, sem sol direto batendo na pessoa, a foto já fica boa. Evite o flash do celular — ele achata o rosto e deixa a pele com aparência artificial.",
    tip: "Janela + luz difusa = foto bonita sem esforço.",
  },
  {
    n: "05", accent: "teal",
    title: "Escolha o horário certo",
    desc: 'Luz natural é melhor de manhã cedo ou no fim da tarde — mais suave e quente. Meio-dia com sol forte cria sombras duras no rosto.',
    tip: 'Manhã cedo ou fim de tarde: a "hora dourada".',
  },
  {
    n: "06", accent: "purple",
    title: "Bata várias fotos seguidas",
    desc: "Use o modo rajada ou bata 5, 6 fotos do mesmo momento. Expressão, posição de mão, olhar — tudo muda entre um clique e outro. Mais fotos, mais chance de ter uma ótima.",
  },
  {
    n: "07", accent: "teal",
    title: "Não centralize tudo",
    desc: "Foto com o assunto sempre no centro fica estática. Posicione a pessoa ou produto um pouco à direita ou à esquerda — a grade ajuda nisso. Fica mais dinâmico.",
    tip: "Assunto fora do centro = foto mais dinâmica.",
    visual: "thirds",
  },
  {
    n: "08", accent: "purple",
    title: "Para produto, use fundo limpo",
    desc: "Fundo branco, cinza claro ou madeira neutra funcionam bem. Evite fundos coloridos que competem com o produto. Uma folha A3 branca já resolve.",
    tip: "Uma folha A3 branca já faz um fundo profissional.",
  },
];

const ENVIO: Tip[] = [
  {
    n: "01", accent: "purple", essential: true,
    title: "Envie em modo arquivo pelo WhatsApp",
    desc: 'Ao anexar, escolha "Documento" em vez de "Galeria". Isso preserva a qualidade original — quando enviado pela galeria, o WhatsApp comprime e perde qualidade.',
    tip: "Galeria comprime. Documento preserva.",
  },
  {
    n: "02", accent: "teal",
    title: "Ou suba direto na sua pasta do Drive",
    desc: "Cada cliente tem uma pasta compartilhada no Google Drive. Acesse pelo link que enviamos e faça o upload por lá. Ideal para volumes maiores de material.",
    tip: "Drive é ideal para vídeos pesados e muitas fotos.",
  },
  {
    n: "03", accent: "purple", essential: true,
    title: "Não edite antes de enviar",
    desc: "Mande o material original, sem filtro, sem corte, sem legenda. A edição é por nossa conta — material original nos dá mais liberdade pra trabalhar.",
    tip: "Sem filtro, sem corte. Original = mais liberdade.",
  },
];

const CHECKLIST = [
  "Lente limpa?",
  "Câmera traseira usada?",
  "Boa iluminação (luz na frente, não atrás)?",
  "Vídeo sem tremor?",
  "Som sem barulho de fundo?",
  "Fundo organizado?",
  "Enviado em modo arquivo ou pelo Drive?",
  "Sem edição ou filtro aplicado?",
];

// ─── Accent config ─────────────────────────────────────────────────────────────

function ac(accent: Accent) {
  return accent === "teal"
    ? {
        bg: "rgba(46,155,175,0.07)",
        border: "rgba(46,155,175,0.22)",
        num: "#2E9BAF",
        tipBg: "rgba(46,155,175,0.09)",
        tipBorder: "#2E9BAF",
        tipText: "#2E9BAF",
        badge: "rgba(46,155,175,0.12)",
      }
    : {
        bg: "rgba(155,107,181,0.07)",
        border: "rgba(155,107,181,0.22)",
        num: "#9B6BB5",
        tipBg: "rgba(155,107,181,0.09)",
        tipBorder: "#9B6BB5",
        tipText: "#9B6BB5",
        badge: "rgba(155,107,181,0.12)",
      };
}

// ─── Visual diagrams ───────────────────────────────────────────────────────────

function LightDiagram() {
  const sunRays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 14, display: "flex", justifyContent: "center", gap: 32 }}>
      <div style={{ textAlign: "center" }}>
        <svg width="68" height="74" viewBox="0 0 68 74" fill="none">
          <circle cx="34" cy="6" r="5" fill="#F59E0B" opacity="0.7" />
          {sunRays.map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            return <line key={i} x1={34 + Math.cos(r) * 7} y1={6 + Math.sin(r) * 7} x2={34 + Math.cos(r) * 11} y2={6 + Math.sin(r) * 11} stroke="#F59E0B" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />;
          })}
          <ellipse cx="34" cy="33" rx="9" ry="11" fill="#111827" stroke="#374151" strokeWidth="1.5" />
          <rect x="28" y="44" width="12" height="17" rx="5" fill="#111827" stroke="#374151" strokeWidth="1.5" />
          <circle cx="34" cy="68" r="5" fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M31 65 L37 71 M37 65 L31 71" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: 11, color: "#EF4444", margin: "3px 0 0", fontWeight: 600 }}>Errado</p>
        <p style={{ fontSize: 10, color: "#6B7280", margin: "1px 0 0" }}>luz atrás</p>
      </div>
      <div style={{ width: 1, background: "rgba(255,255,255,0.08)", alignSelf: "stretch" }} />
      <div style={{ textAlign: "center" }}>
        <svg width="68" height="74" viewBox="0 0 68 74" fill="none">
          <circle cx="34" cy="68" r="5" fill="#F59E0B" opacity="0.9" />
          {sunRays.map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            return <line key={i} x1={34 + Math.cos(r) * 7} y1={68 + Math.sin(r) * 7} x2={34 + Math.cos(r) * 11} y2={68 + Math.sin(r) * 11} stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />;
          })}
          <ellipse cx="34" cy="33" rx="9" ry="11" fill="#D1D5DB" stroke="#9B6BB5" strokeWidth="1.5" />
          <rect x="28" y="44" width="12" height="17" rx="5" fill="#D1D5DB" stroke="#9B6BB5" strokeWidth="1.5" />
          <circle cx="34" cy="6" r="5" fill="rgba(46,155,175,0.2)" stroke="#2E9BAF" strokeWidth="1.5" />
          <path d="M31 6 L33.5 8.5 L38 3.5" stroke="#2E9BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontSize: 11, color: "#2E9BAF", margin: "3px 0 0", fontWeight: 600 }}>Certo</p>
        <p style={{ fontSize: 10, color: "#6B7280", margin: "1px 0 0" }}>luz na frente</p>
      </div>
    </div>
  );
}

function OrientationDiagram() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 14, display: "flex", justifyContent: "center", gap: 28, alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <svg width="34" height="60" viewBox="0 0 34 60" fill="none">
          <rect x="2" y="2" width="30" height="56" rx="7" fill="rgba(155,107,181,0.1)" stroke="#9B6BB5" strokeWidth="1.5" />
          <circle cx="17" cy="9" r="2" fill="#9B6BB5" opacity="0.5" />
          <rect x="7" y="15" width="20" height="30" rx="3" fill="rgba(155,107,181,0.18)" />
          <rect x="12" y="50" width="10" height="3" rx="1.5" fill="#9B6BB5" opacity="0.3" />
        </svg>
        <p style={{ fontSize: 11, color: "#9B6BB5", margin: "6px 0 2px", fontWeight: 700, letterSpacing: "0.05em" }}>VERTICAL</p>
        <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>Reels · Stories</p>
      </div>
      <div style={{ height: 56, width: 1, background: "rgba(255,255,255,0.08)" }} />
      <div style={{ textAlign: "center" }}>
        <svg width="60" height="34" viewBox="0 0 60 34" fill="none">
          <rect x="2" y="2" width="56" height="30" rx="7" fill="rgba(46,155,175,0.1)" stroke="#2E9BAF" strokeWidth="1.5" />
          <circle cx="51" cy="17" r="2" fill="#2E9BAF" opacity="0.5" />
          <rect x="6" y="7" width="40" height="20" rx="3" fill="rgba(46,155,175,0.18)" />
          <rect x="7" y="15" width="3" height="4" rx="1.5" fill="#2E9BAF" opacity="0.3" />
        </svg>
        <p style={{ fontSize: 11, color: "#2E9BAF", margin: "6px 0 2px", fontWeight: 700, letterSpacing: "0.05em" }}>HORIZONTAL</p>
        <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>YouTube · Feed</p>
      </div>
    </div>
  );
}

function FramingDiagram() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 14, display: "flex", justifyContent: "center", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <svg width="72" height="96" viewBox="0 0 72 96" fill="none">
          <rect x="2" y="2" width="68" height="92" rx="5" fill="rgba(239,68,68,0.04)" stroke="#EF4444" strokeWidth="1.2" />
          <ellipse cx="36" cy="68" rx="9" ry="11" fill="#1F2937" stroke="#374151" strokeWidth="1" />
          <rect x="29" y="79" width="14" height="11" rx="4" fill="#1F2937" stroke="#374151" strokeWidth="1" />
          <text x="36" y="22" textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="system-ui">espaço vazio</text>
          <path d="M20 30 L52 30" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="3 2" />
        </svg>
        <p style={{ fontSize: 10, color: "#EF4444", margin: "4px 0 0", fontWeight: 600 }}>Afogado</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <svg width="72" height="96" viewBox="0 0 72 96" fill="none">
          <rect x="2" y="2" width="68" height="92" rx="5" fill="rgba(46,155,175,0.04)" stroke="#2E9BAF" strokeWidth="1.2" />
          <ellipse cx="36" cy="48" rx="9" ry="11" fill="#D1D5DB" stroke="#2E9BAF" strokeWidth="1" />
          <rect x="29" y="59" width="14" height="14" rx="4" fill="#D1D5DB" stroke="#2E9BAF" strokeWidth="1" />
          <path d="M22 22 L50 22" stroke="#2E9BAF" strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="36" y="17" textAnchor="middle" fill="#2E9BAF" fontSize="9" fontFamily="system-ui">espaço</text>
          <circle cx="36" cy="86" r="5" fill="rgba(46,155,175,0.15)" stroke="#2E9BAF" strokeWidth="1.2" />
          <path d="M33 86 L35.5 88.5 L39.5 83.5" stroke="#2E9BAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontSize: 10, color: "#2E9BAF", margin: "4px 0 0", fontWeight: 600 }}>Correto</p>
      </div>
    </div>
  );
}

function GridDiagram() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 14, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="140" height="90" viewBox="0 0 140 90" fill="none">
        <rect x="2" y="2" width="136" height="86" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="48" y1="2" x2="48" y2="88" stroke="rgba(155,107,181,0.5)" strokeWidth="0.8" />
        <line x1="93" y1="2" x2="93" y2="88" stroke="rgba(155,107,181,0.5)" strokeWidth="0.8" />
        <line x1="2" y1="31" x2="138" y2="31" stroke="rgba(155,107,181,0.5)" strokeWidth="0.8" />
        <line x1="2" y1="60" x2="138" y2="60" stroke="rgba(155,107,181,0.5)" strokeWidth="0.8" />
        <circle cx="48" cy="31" r="2.5" fill="#9B6BB5" />
        <circle cx="93" cy="31" r="2.5" fill="#9B6BB5" />
        <circle cx="48" cy="60" r="2.5" fill="#9B6BB5" />
        <circle cx="93" cy="60" r="2.5" fill="#9B6BB5" />
      </svg>
      <p style={{ fontSize: 11, color: "#9B6BB5", fontWeight: 500, margin: 0, textAlign: "center" }}>
        Ative a grade nas configurações da câmera
      </p>
    </div>
  );
}

function ThirdsDiagram() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 14, display: "flex", justifyContent: "center", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <svg width="90" height="60" viewBox="0 0 90 60" fill="none">
          <rect x="1" y="1" width="88" height="58" rx="4" fill="rgba(239,68,68,0.03)" stroke="#EF4444" strokeWidth="0.8" />
          <line x1="30" y1="1" x2="30" y2="59" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          <line x1="60" y1="1" x2="60" y2="59" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          <line x1="1" y1="20" x2="89" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          <line x1="1" y1="40" x2="89" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          <ellipse cx="45" cy="28" rx="7" ry="9" fill="#374151" stroke="#4B5563" strokeWidth="1" />
          <rect x="39" y="37" width="12" height="14" rx="4" fill="#374151" stroke="#4B5563" strokeWidth="1" />
        </svg>
        <p style={{ fontSize: 10, color: "#EF4444", margin: "4px 0 0", fontWeight: 600 }}>Estático</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <svg width="90" height="60" viewBox="0 0 90 60" fill="none">
          <rect x="1" y="1" width="88" height="58" rx="4" fill="rgba(46,155,175,0.03)" stroke="#2E9BAF" strokeWidth="0.8" />
          <line x1="30" y1="1" x2="30" y2="59" stroke="rgba(155,107,181,0.35)" strokeWidth="0.6" />
          <line x1="60" y1="1" x2="60" y2="59" stroke="rgba(155,107,181,0.35)" strokeWidth="0.6" />
          <line x1="1" y1="20" x2="89" y2="20" stroke="rgba(155,107,181,0.35)" strokeWidth="0.6" />
          <line x1="1" y1="40" x2="89" y2="40" stroke="rgba(155,107,181,0.35)" strokeWidth="0.6" />
          <ellipse cx="60" cy="20" rx="7" ry="9" fill="#D1D5DB" stroke="#2E9BAF" strokeWidth="1" />
          <rect x="54" y="29" width="12" height="14" rx="4" fill="#D1D5DB" stroke="#2E9BAF" strokeWidth="1" />
          <circle cx="60" cy="20" r="3" fill="rgba(46,155,175,0.3)" stroke="#2E9BAF" strokeWidth="1.2" />
        </svg>
        <p style={{ fontSize: 10, color: "#2E9BAF", margin: "4px 0 0", fontWeight: 600 }}>Dinâmico</p>
      </div>
    </div>
  );
}

function VisualDiagram({ type }: { type: string }) {
  if (type === "light") return <LightDiagram />;
  if (type === "orientation") return <OrientationDiagram />;
  if (type === "framing") return <FramingDiagram />;
  if (type === "grid") return <GridDiagram />;
  if (type === "thirds") return <ThirdsDiagram />;
  return null;
}

// ─── TipCard ──────────────────────────────────────────────────────────────────

function TipCard({ tip, index }: { tip: Tip; index: number }) {
  const c = ac(tip.accent);
  return (
    <div
      className="tip-card"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: "20px 20px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        animationDelay: `${index * 0.055}s`,
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 36,
            fontWeight: 700,
            color: c.num,
            opacity: 0.22,
            lineHeight: 1,
            flexShrink: 0,
            userSelect: "none",
            marginTop: 2,
          }}
        >
          {tip.n}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <h3
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                margin: 0,
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                lineHeight: 1.3,
                flex: 1,
                minWidth: 0,
              }}
            >
              {tip.title}
            </h3>
            {tip.essential && (
              <span
                style={{
                  background: c.badge,
                  color: c.num,
                  border: `1px solid ${c.border}`,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  flexShrink: 0,
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  whiteSpace: "nowrap" as const,
                  alignSelf: "center",
                }}
              >
                Essencial
              </span>
            )}
          </div>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              margin: 0,
              lineHeight: 1.65,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            {tip.desc}
          </p>
        </div>
      </div>

      {tip.visual && <VisualDiagram type={tip.visual} />}

      {tip.tip && (
        <div
          style={{
            background: c.tipBg,
            borderLeft: `3px solid ${c.tipBorder}`,
            padding: "10px 14px",
            borderRadius: "0 8px 8px 0",
            fontSize: 13,
            color: c.tipText,
            fontWeight: 500,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            lineHeight: 1.55,
          }}
        >
          {tip.tip}
        </div>
      )}
    </div>
  );
}

// ─── Tab icons ────────────────────────────────────────────────────────────────

function IconGear({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconVideo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function IconCamera({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconUpload({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconWA({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { label: "Preparo", shortLabel: "Preparo", icon: <IconGear />, tips: PREPARO, cols: 1 },
  { label: "Vídeos", shortLabel: "Vídeos", icon: <IconVideo />, tips: VIDEO, cols: 2 },
  { label: "Fotos", shortLabel: "Fotos", icon: <IconCamera />, tips: FOTO, cols: 2 },
  { label: "Como Enviar", shortLabel: "Envio", icon: <IconUpload />, tips: ENVIO, cols: 1 },
  { label: "Checklist", shortLabel: "Lista", icon: <IconCheck />, tips: [], cols: 1 },
];

export default function DirecaoPage() {
  const [tab, setTab] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const [checked, setChecked] = useState<boolean[]>(new Array(CHECKLIST.length).fill(false));

  function changeTab(i: number) {
    setTab(i);
    setTabKey((k) => k + 1);
  }

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  const done = checked.filter(Boolean).length;
  const total = CHECKLIST.length;
  const pct = Math.round((done / total) * 100);

  const current = TABS[tab];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tip-card {
          animation: fadeUp 0.38s ease both;
          opacity: 0;
        }
        .tab-content {
          animation: fadeUp 0.28s ease both;
        }
        .check-row {
          transition: background 0.18s ease;
        }
        .check-row:hover {
          background: rgba(255,255,255,0.03);
        }
        .tab-btn {
          transition: color 0.18s ease, background 0.18s ease;
        }
        .tab-btn:hover {
          color: #fff !important;
        }
      `}</style>

      <div style={{ background: "#0A0A0A", minHeight: "100vh", paddingBottom: 100 }}>

        {/* ── Orbs ─────────────────────────────────────────────────────────── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-60%)", width: 500, height: 500, borderRadius: "50%", background: "rgba(155,107,181,0.06)", filter: "blur(90px)" }} />
          <div style={{ position: "absolute", bottom: 80, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(46,155,175,0.05)", filter: "blur(80px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div style={{ paddingTop: 48, paddingBottom: 32, textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(155,107,181,0.1)",
                border: "1px solid rgba(155,107,181,0.25)",
                borderRadius: 999,
                padding: "5px 14px",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#9B6BB5", textTransform: "uppercase", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Guia de Conteúdo · BeSmart
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(26px, 6vw, 38px)",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 14px",
                lineHeight: 1.2,
              }}
            >
              Fotos e Vídeos{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #9B6BB5, #2E9BAF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                que funcionam
              </span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: 15,
                color: "#9CA3AF",
                lineHeight: 1.7,
                margin: "0 auto",
                maxWidth: 480,
              }}
            >
              Você não precisa de câmera profissional. O celular que está no
              seu bolso já é suficiente — o que muda o resultado é como você
              usa.
            </p>
          </div>

          {/* ── Tab bar ──────────────────────────────────────────────────── */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              background: "rgba(10,10,10,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              marginLeft: -16,
              marginRight: -16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <div style={{ display: "flex", gap: 2, overflowX: "auto", scrollbarWidth: "none", padding: "8px 0" }}>
              {TABS.map((t, i) => {
                const active = tab === i;
                return (
                  <button
                    key={i}
                    className="tab-btn"
                    onClick={() => changeTab(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      background: active ? "rgba(155,107,181,0.12)" : "transparent",
                      color: active ? "#9B6BB5" : "#6B7280",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      cursor: "pointer",
                      flexShrink: 0,
                      outline: active ? "1px solid rgba(155,107,181,0.3)" : "none",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <span style={{ opacity: active ? 1 : 0.6 }}>{t.icon}</span>
                    <span className="hide-xs">{t.label}</span>
                    <span className="show-xs" style={{ display: "none" }}>{t.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Section header ───────────────────────────────────────────── */}
          <div key={`hdr-${tabKey}`} className="tab-content" style={{ paddingTop: 32, paddingBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(155,107,181,0.1)",
                  border: "1px solid rgba(155,107,181,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9B6BB5",
                  flexShrink: 0,
                }}
              >
                {current.icon}
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {current.label}
                </h2>
                {tab < 4 && (
                  <p style={{ fontSize: 13, color: "#6B7280", margin: "3px 0 0", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                    {current.tips.length} dica{current.tips.length > 1 ? "s" : ""}
                    {current.tips.filter((t) => t.essential).length > 0 && (
                      <span style={{ color: "#9B6BB5", marginLeft: 6 }}>
                        · {current.tips.filter((t) => t.essential).length} essenciais
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Tab content ──────────────────────────────────────────────── */}
          {tab < 4 ? (
            <div
              key={`content-${tabKey}`}
              style={{
                display: "grid",
                gridTemplateColumns: current.cols === 2 ? "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" : "1fr",
                gap: 14,
              }}
            >
              {current.tips.map((tip, i) => (
                <TipCard key={tip.n} tip={tip} index={i} />
              ))}
            </div>
          ) : (
            /* ── Checklist ─────────────────────────────────────────────── */
            <div key={`content-${tabKey}`} className="tab-content">
              {/* Progress bar */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                    Progresso
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: done === total ? "#2E9BAF" : "#9B6BB5",
                    }}
                  >
                    {done}/{total}
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      borderRadius: 999,
                      background: done === total
                        ? "linear-gradient(90deg, #2E9BAF, #9B6BB5)"
                        : "linear-gradient(90deg, #9B6BB5, #2E9BAF)",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>

              {/* Items */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {CHECKLIST.map((item, i) => (
                  <div
                    key={i}
                    className="check-row"
                    onClick={() => toggle(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 20px",
                      borderBottom: i < CHECKLIST.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: checked[i] ? "none" : "1.5px solid rgba(155,107,181,0.4)",
                        background: checked[i] ? "rgba(155,107,181,0.9)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.18s ease",
                        color: "#fff",
                      }}
                    >
                      {checked[i] && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-inter), system-ui, sans-serif",
                        fontSize: 14,
                        color: checked[i] ? "#6B7280" : "#D1D5DB",
                        textDecoration: checked[i] ? "line-through" : "none",
                        transition: "all 0.18s ease",
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {done === total && (
                <div
                  style={{
                    marginTop: 20,
                    background: "rgba(46,155,175,0.08)",
                    border: "1px solid rgba(46,155,175,0.25)",
                    borderRadius: 12,
                    padding: "16px 20px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: 14, color: "#2E9BAF", fontWeight: 600, margin: 0 }}>
                    Material pronto para enviar.
                  </p>
                </div>
              )}

              <div style={{ marginTop: 32, textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: 14, color: "#6B7280", margin: "0 0 16px" }}>
                  Se passou por esse checklist, o material já está ótimo.
                </p>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <IconWA />
                  Dúvidas? Chama no WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* ── Section CTA for non-checklist tabs ───────────────────────── */}
          {tab < 4 && (
            <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: 14, color: "#6B7280", margin: "0 0 16px" }}>
                Dúvidas sobre qualquer dica?
              </p>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <IconWA />
                Fala no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
