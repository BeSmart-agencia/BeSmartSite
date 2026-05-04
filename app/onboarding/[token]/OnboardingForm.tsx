"use client";

import { useActionState } from "react";
import { salvarOnboarding } from "./actions";

type Props = { clienteId: string; nome: string; empresa: string };
type State = { error?: string; success?: boolean };

export function OnboardingForm({ clienteId, nome, empresa }: Props) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => salvarOnboarding(clienteId, formData),
    {}
  );

  if (state.success) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Tudo certo!
        </h2>
        <p
          className="text-sm"
          style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}
        >
          Recebemos suas informações. Até breve!
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="glass rounded-2xl p-6 flex flex-col gap-5">

        {/* Info pré-preenchida */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="admin-label mb-1">Nome</p>
            <p className="text-sm text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{nome}</p>
          </div>
          <div>
            <p className="admin-label mb-1">Empresa</p>
            <p className="text-sm text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{empresa}</p>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

        <div className="admin-field">
          <label className="admin-label">O que sua empresa faz? *</label>
          <textarea
            name="empresa_descricao"
            required
            className="admin-textarea"
            placeholder="Descreva brevemente o seu negócio..."
            rows={3}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="admin-field">
            <label className="admin-label">Tempo de mercado</label>
            <input name="tempo_mercado" className="admin-input" placeholder="Ex: 3 anos" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Nº de funcionários</label>
            <input name="num_funcionarios" className="admin-input" placeholder="Ex: 5-10" />
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label">Principais canais de venda</label>
          <div className="flex flex-wrap gap-3">
            {["WhatsApp", "Instagram", "Site", "Indicação", "Loja física", "Outro"].map((op) => (
              <label key={op} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="canais_venda"
                  value={op}
                  className="w-4 h-4"
                  style={{ accentColor: "#9B6BB5" }}
                />
                <span className="text-sm" style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>
                  {op}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label">Se pudesse resolver uma coisa hoje, o que seria?</label>
          <textarea
            name="resolver_uma_coisa"
            className="admin-textarea"
            placeholder="Qual é a sua principal dor ou desafio agora?"
            rows={3}
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">Tem algum prazo ou data importante?</label>
          <input name="prazo_importante" className="admin-input" placeholder="Ex: preciso resolver até junho..." />
        </div>

        <div className="admin-field">
          <label className="admin-label">Mais alguma coisa que queira nos contar antes da reunião?</label>
          <textarea
            name="observacoes_finais"
            className="admin-textarea"
            placeholder="Fique à vontade..."
            rows={3}
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-center" style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center"
        style={{ opacity: pending ? 0.7 : 1 }}
      >
        {pending ? "Enviando..." : "Enviar informações"}
      </button>

      <p
        className="text-xs text-center"
        style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}
      >
        Seus dados são usados apenas pela equipe BeSmart.
      </p>
    </form>
  );
}
