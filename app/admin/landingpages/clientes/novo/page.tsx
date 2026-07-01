"use client";

import { useActionState, useState } from "react";
import { criarLandingPage } from "@/app/admin/landingpages/actions";
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
  id?: string;
};

export default function NovaLandingPagePage() {
  const [plano, setPlano] = useState("subdominio");

  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const result = await criarLandingPage(formData);
      return result;
    },
    {}
  );

  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (state.link) {
      await navigator.clipboard.writeText(state.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            Página cadastrada!
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            O link de visualização foi gerado. Copie e envie pelo WhatsApp.
          </p>

          <div
            className="rounded-xl p-4 mb-4 text-left break-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs mb-2 uppercase tracking-wider font-semibold" style={{ color: "#6B7280" }}>Link de visualização</p>
            <p className="text-sm" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>{state.link}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={copyLink}
              className="btn-primary"
              style={{ fontSize: "14px", padding: "11px 22px", background: copied ? "#16a34a" : undefined, transition: "background 0.2s" }}
            >
              <CopyIcon />
              {copied ? "Copiado!" : "Copiar link"}
            </button>
            <Link href={`/admin/landingpages/clientes/${state.id}`} className="btn-secondary" style={{ fontSize: "14px", padding: "10px 21px" }}>
              Ver página
            </Link>
          </div>

          <Link
            href="/admin/landingpages/clientes/novo"
            className="mt-6 inline-block text-sm"
            style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
          >
            + Cadastrar outra página
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/landingpages"
          className="inline-flex items-center gap-2 text-sm mb-4 transition-colors hover:text-white"
          style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
        >
          <ArrowLeftIcon />
          Voltar
        </Link>
        <p className="section-label mb-1">Landing Pages</p>
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Nova Página
        </h1>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="admin-field">
              <label className="admin-label">Nome do cliente *</label>
              <input name="nome_cliente" required className="admin-input" placeholder="Ex: João Silva" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Empresa / negócio</label>
              <input name="empresa" className="admin-input" placeholder="Ex: Clínica Saúde Total" />
            </div>
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
            <label className="admin-label">Plano *</label>
            <select name="plano" className="admin-select" value={plano} onChange={(e) => setPlano(e.target.value)}>
              <option value="subdominio">Subdomínio — R$ 400</option>
              <option value="dominio_proprio">Domínio próprio — R$ 550</option>
            </select>
          </div>

          {plano === "dominio_proprio" && (
            <div className="admin-field">
              <label className="admin-label">Domínio customizado *</label>
              <input name="dominio_customizado" required={plano === "dominio_proprio"} className="admin-input" placeholder="Ex: clinicasaude.com.br" />
            </div>
          )}

          <hr className="section-divider" />

          <div className="admin-field">
            <label className="admin-label">Título exibido na página</label>
            <input name="titulo" className="admin-input" placeholder="Ex: Clínica Saúde Total" />
          </div>

          <div className="admin-field">
            <label className="admin-label">Bio / descrição curta</label>
            <textarea name="bio" className="admin-textarea" placeholder="Ex: Cuidando da sua saúde com carinho e tecnologia." rows={3} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="admin-field">
              <label className="admin-label">Cor do tema</label>
              <input name="cor_tema" type="color" defaultValue="#9B6BB5" className="admin-input" style={{ padding: "4px", height: "42px" }} />
            </div>
            <div className="admin-field">
              <label className="admin-label">URL do avatar/foto</label>
              <input name="avatar_url" className="admin-input" placeholder="https://..." />
            </div>
          </div>

          <p className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
            Os botões de link (WhatsApp, Instagram, site etc.) são adicionados depois, na tela de edição da página.
          </p>
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
          <Link href="/admin/landingpages" className="btn-secondary flex-1 justify-center text-center">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
