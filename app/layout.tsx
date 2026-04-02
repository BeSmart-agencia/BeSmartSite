import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeSmart — Agência de Ideias",
  description:
    "Agência de social media e tecnologia para agências. Gestão de redes sociais, OrbitAI, ProspectAI e Agente de Atendimento IA.",
  keywords: [
    "agência de social media",
    "gestão de redes sociais",
    "OrbitAI",
    "ProspectAI",
    "agência digital",
    "BeSmart",
  ],
  openGraph: {
    title: "BeSmart — Agência de Ideias",
    description:
      "Construímos a agência que queríamos ter. Agora você pode ter também.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
