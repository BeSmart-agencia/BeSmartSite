import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aulas de Informática na Sua Casa — Crianças e Idosos | BeSmart",
  description:
    "Aulas de informática na sua casa, para crianças e idosos. Aulas individuais, no seu ritmo, com quem ama ensinar — do básico à programação com IA. A partir de R$ 70 por aula.",
  openGraph: {
    title: "Aulas de Informática na Sua Casa — Crianças e Idosos | BeSmart",
    description:
      "Aulas individuais, no seu ritmo, com quem ama ensinar. Do primeiro clique ao primeiro site.",
    type: "website",
  },
};

export default function AulasTILayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${spaceGrotesk.variable} ${jetbrains.variable}`}>
      {children}
    </div>
  );
}
