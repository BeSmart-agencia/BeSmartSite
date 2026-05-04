import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";
import Image from "next/image";
import type { Metadata } from "next";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "Bem-vindo à BeSmart",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({ params }: Props) {
  const { token } = await params;

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, nome, empresa, onboarding_token")
    .eq("onboarding_token", token)
    .maybeSingle();

  if (!cliente) notFound();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      <div
        className="orb w-[500px] h-[500px] top-[-150px] right-[-150px]"
        style={{ background: "rgba(155, 107, 181, 0.08)" }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[-100px] left-[-100px]"
        style={{ background: "rgba(46, 155, 175, 0.07)" }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-5 py-12">
        <div className="flex justify-center mb-10">
          <Image
            src="/logo.png"
            alt="BeSmart"
            width={140}
            height={44}
            className="object-contain h-10 w-auto"
            priority
          />
        </div>

        <div className="mb-8 text-center">
          <span className="badge badge-purple mb-4">Bem-vindo(a)</span>
          <h1
            className="text-2xl md:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Olá, {cliente.nome.split(" ")[0]}!
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Antes da nossa conversa, preencha as informações abaixo para aproveitarmos melhor o nosso tempo juntos.
            Leva menos de 3 minutos.
          </p>
        </div>

        <OnboardingForm clienteId={cliente.id} nome={cliente.nome} empresa={cliente.empresa} />
      </div>
    </div>
  );
}
