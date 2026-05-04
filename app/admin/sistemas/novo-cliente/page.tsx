"use client";

import { useActionState } from "react";
import { cadastrarCliente } from "@/app/admin/sistemas/actions";
import Link from "next/link";

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

type State = {
  error?: string;
  success?: boolean;
  link?: string;
  clienteId?: string;
};

export default function NovoClientePage() {
  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const result = await cadastrarCliente(formData);
      return result;
    },
    {}
  );

  async function copyLink() {
    if (state.link) {
      await navigator.clipboard.writeText(state.link);
    }
  }

  if (state.success && state.link) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Cliente cadastrado!
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            O link de onboarding foi gerado. Copie e envie pelo WhatsApp.
          </p>

          <div
            className="rounded-xl p-4 mb-4 text-left break-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs mb-2 uppercase tracking-wider font-semibold" style={{ color: "#6B7280" }}>Link de onboarding</p>
            <p className="text-sm" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>{state.link}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={copyLink} className="btn-primary" style={{ fontSize: "14px", padding: "11px 22px" }}>
              <CopyIcon />
              Copiar link
            </button>
            <Link href={`/admin/sistemas/clientes/${state.clienteId}`} className="btn-secondary" style={{ fontSize: "14px", padding: "10px 21px" }}>
              Ver perfil do cliente
            </Link>
          </div>

          <Link
            href="/admin/sistemas/novo-cliente"
            className="mt-6 inline-block text-sm"
            style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
          >
            + Cadastrar outro cliente
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/sistemas"
          className="inline-flex items-center gap-2 text-sm mb-4 transition-colors hover:text-white"
          style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
        >
          <ArrowLeftIcon />
          Voltar
        </Link>
        <p className="section-label mb-1">Sistemas Sob Medida</p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Novo Cliente
        </h1>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="admin-field">
              <label className="admin-label">Nome completo *</label>
              <input name="nome" required className="admin-input" placeholder="Ex: João Silva" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Nome da empresa *</label>
              <input name="empresa" required className="admin-input" placeholder="Ex: Clínica Saúde Total" />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Segmento / Ramo de atuação</label>
            <input name="segmento" className="admin-input" placeholder="Ex: Clínica odontológica, E-commerce, Academia..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="admin-field">
              <label className="admin-label">WhatsApp</label>
              <input name="whatsapp" type="tel" className="admin-input" placeholder="(51) 99999-9999" />
            </div>
            <div className="admin-field">
              <label className="admin-label">E-mail</label>
              <input name="email" type="email" className="admin-input" placeholder="contato@empresa.com" />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Como conheceu a BeSmart</label>
            <select name="como_conheceu" className="admin-select">
              <option value="">Selecionar...</option>
              <option>Indicação</option>
              <option>Instagram</option>
              <option>Google</option>
              <option>LinkedIn</option>
              <option>WhatsApp</option>
              <option>Já era cliente</option>
              <option>Outro</option>
            </select>
          </div>

          <div className="admin-field">
            <label className="admin-label">Observações iniciais</label>
            <textarea name="observacoes" className="admin-textarea" placeholder="Contexto da primeira conversa, necessidades levantadas..." rows={3} />
          </div>
        </div>

        {state.error && (
          <p className="text-sm text-center" style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}>
            {state.error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={pending}
            className="btn-primary flex-1 justify-center"
            style={{ opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "Salvando..." : "Salvar e gerar link"}
          </button>
          <Link href="/admin/sistemas" className="btn-secondary flex-1 justify-center text-center">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
