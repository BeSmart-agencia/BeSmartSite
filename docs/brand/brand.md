# BeSmart — Brand Identity Guide

## Identidade

**Nome:** BeSmart  
**Tagline:** Agência de *Ideias*  
**Posicionamento:** Agência das agências — tecnologia e gestão de social media desenvolvidas e testadas internamente.  
**Tom:** Moderno, confiante, direto, próximo.

---

## Logos Disponíveis

Os arquivos estão em `_docs/brand/`:

| Arquivo | Uso |
|---|---|
| `logosemfundo1.png` | Logo branco — usar sobre fundos escuros |
| `logosemfundo2.png` | Logo roxo/lilás — usar sobre fundos escuros |
| `logosemfundo3.png` | Logo teal — usar sobre fundos escuros |
| `logocomfundo1.png` | Logo branco sobre fundo roxo/lilás |
| `logocomfundo2.png` | Logo branco sobre fundo teal |

**Logo principal para o site:** `logosemfundo1.png` (branco, sobre fundo escuro)  
**Logo alternativo claro:** usar versão colorida conforme seção

---

## Paleta de Cores

### Cores Primárias

| Nome | Hex | Uso |
|---|---|---|
| **BeSmart Purple** | `#9B6BB5` | Cor de destaque principal, CTAs, hover |
| **BeSmart Teal** | `#2E9BAF` | Cor secundária, badges, acentos |
| **Preto BeSmart** | `#0A0A0A` | Fundo principal |

### Cores de Fundo

| Nome | Hex | Uso |
|---|---|---|
| **Dark Purple BG** | `#150D1E` | Fundo alternativo com toque roxo escuro |
| **Dark Teal BG** | `#071318` | Fundo alternativo com toque verde escuro |
| **Surface** | `#1A1A2E` | Cards, seções alternadas |
| **Surface Light** | `#22223A` | Bordas, separadores, hover de cards |

### Cores de Texto

| Nome | Hex | Uso |
|---|---|---|
| **White** | `#FFFFFF` | Títulos principais |
| **Gray 300** | `#D1D5DB` | Textos de corpo |
| **Gray 500** | `#6B7280` | Textos secundários, legendas |

### Cores de Acento / UI

| Nome | Hex | Uso |
|---|---|---|
| **Purple Glow** | `#9B6BB540` | Glow/sombra em elementos destacados |
| **Teal Glow** | `#2E9BAF30` | Glow/sombra em elementos secundários |
| **White 10%** | `#FFFFFF1A` | Bordas sutis em glassmorphism |

---

## Tipografia

### Fonte Principal — Display / Logotipo
- **Família:** Playfair Display *(serif elegante, como no logo)*
- **Uso:** Headlines, nome da marca, títulos de seção grandes
- **Google Fonts:** `https://fonts.google.com/specimen/Playfair+Display`
- **Pesos:** 700 (Bold), 900 (Black), 700 Italic

### Fonte Secundária — Corpo / UI
- **Família:** Inter *(sans-serif moderna e legível)*
- **Uso:** Parágrafos, botões, labels, navegação, bullets
- **Google Fonts:** `https://fonts.google.com/specimen/Inter`
- **Pesos:** 400 (Regular), 500 (Medium), 600 (SemiBold)

### Hierarquia Tipográfica

```
H1 (Hero):       Playfair Display, 72px, Bold, White
H2 (Seções):     Playfair Display, 48px, Bold, White
H3 (Cards):      Inter, 24px, SemiBold, White
Body:            Inter, 16px, Regular, Gray 300
Small/Label:     Inter, 14px, Medium, Gray 500
Badge/Tag:       Inter, 12px, SemiBold, uppercase, Purple ou Teal
```

---

## Estilo Visual

### Estética Geral
- **Dark mode** como padrão absoluto
- **Fundo principal:** preto profundo `#0A0A0A`
- **Acentos:** roxo lilás (`#9B6BB5`) e teal (`#2E9BAF`) usados com moderação
- **Glassmorphism** suave em cards: `backdrop-filter: blur(12px)`, borda `rgba(255,255,255,0.08)`
- **Gradientes sutis** nos fundos de seção alternando entre Dark Purple BG e Dark Teal BG

### Bordas e Raios
```css
--radius-sm: 8px;    /* inputs, tags */
--radius-md: 12px;   /* cards */
--radius-lg: 20px;   /* seções destacadas */
--radius-full: 9999px; /* badges, pills */
```

### Sombras e Glows
```css
/* Card destaque roxo */
box-shadow: 0 0 40px rgba(155, 107, 181, 0.15);

/* Card destaque teal */
box-shadow: 0 0 40px rgba(46, 155, 175, 0.15);

/* Glow em botão primário */
box-shadow: 0 4px 24px rgba(155, 107, 181, 0.35);
```

### Botões
```
Primário:    bg #9B6BB5, texto branco, radius full, glow roxo no hover
Secundário:  borda 1px #9B6BB5, texto branco, fundo transparente
WhatsApp:    bg #25D366, texto branco, ícone WhatsApp
Externo:     texto branco + arrow →, sem fundo
```

---

## Links Externos dos Produtos

| Produto | Ação | Destino |
|---|---|---|
| OrbitAI | Botão "Conhecer o OrbitAI →" | Link externo para o site do OrbitAI |
| ProspectAI | Botão "💬 Quero conhecer" | WhatsApp da BeSmart |
| Agente de IA | Botão "💬 Quero o agente" | WhatsApp da BeSmart |
| Gestão de Redes | Botão "💬 Quero a BeSmart" | WhatsApp da BeSmart |

**WhatsApp BeSmart:** *(inserir número aqui)*  
**Site OrbitAI:** *(inserir URL aqui)*

---

## Diretrizes de Uso

- Sempre usar logo branco (`logosemfundo1.png`) no header sobre fundo escuro
- Nunca usar fundo branco ou claro — o site é 100% dark
- Roxo (`#9B6BB5`) é a cor de destaque principal — CTAs, links ativos, badges dos produtos
- Teal (`#2E9BAF`) é a cor secundária — ícones, acentos, segunda opção de badge
- Separadores entre seções: linha fina `rgba(255,255,255,0.08)` ou gradiente de cor para transparente
- Ícones: estilo outline, brancos ou na cor do acento da seção
