"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarLinksLandingPage, atualizarStatusLandingPage, editarLandingPage } from "@/app/admin/landingpages/actions";

type LinkItem = { label: string; url: string };

type LandingPage = {
  id: string;
  nome_cliente: string;
  empresa: string | null;
  whatsapp: string | null;
  email: string | null;
  plano: string;
  dominio_customizado: string | null;
  status: string;
  titulo: string | null;
  bio: string | null;
  cor_tema: string | null;
  avatar_url: string | null;
  links: LinkItem[] | null;
};

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function StatusSelector({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    await atualizarStatusLandingPage(id, e.target.value);
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      disabled={loading}
      className="admin-select"
      style={{ width: "auto" }}
    >
      <option value="rascunho">Rascunho</option>
      <option value="aguardando_pagamento">Aguardando pagamento</option>
      <option value="publicada">Publicada</option>
    </select>
  );
}

export function LandingPageEditor({ page }: { page: LandingPage }) {
  const router = useRouter();
  const [plano, setPlano] = useState(page.plano);
  const [loadingForm, setLoadingForm] = useState(false);
  const [erroForm, setErroForm] = useState<string | null>(null);

  const [links, setLinks] = useState<LinkItem[]>(page.links ?? []);
  const [loadingLinks, setLoadingLinks] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingForm(true);
    setErroForm(null);
    const fd = new FormData(e.currentTarget);
    const res = await editarLandingPage(page.id, fd);
    setLoadingForm(false);
    if (res.error) { setErroForm(res.error); return; }
    router.refresh();
  }

  function updateLink(i: number, field: keyof LinkItem, value: string) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLink(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function salvarLinks() {
    setLoadingLinks(true);
    await atualizarLinksLandingPage(page.id, links.filter((l) => l.label && l.url));
    setLoadingLinks(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Dados do cliente e conteúdo */}
      <div className="glass rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
          Dados e conteúdo
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="admin-field">
              <label className="admin-label">Nome do cliente *</label>
              <input name="nome_cliente" required defaultValue={page.nome_cliente} className="admin-input" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Empresa / negócio</label>
              <input name="empresa" defaultValue={page.empresa ?? ""} className="admin-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="admin-field">
              <label className="admin-label">WhatsApp</label>
              <input name="whatsapp" defaultValue={page.whatsapp ?? ""} className="admin-input" />
            </div>
            <div className="admin-field">
              <label className="admin-label">E-mail</label>
              <input name="email" type="email" defaultValue={page.email ?? ""} className="admin-input" />
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
              <input name="dominio_customizado" required defaultValue={page.dominio_customizado ?? ""} className="admin-input" placeholder="Ex: clinicasaude.com.br" />
            </div>
          )}

          <hr className="section-divider" />

          <div className="admin-field">
            <label className="admin-label">Título exibido na página</label>
            <input name="titulo" defaultValue={page.titulo ?? ""} className="admin-input" />
          </div>

          <div className="admin-field">
            <label className="admin-label">Bio / descrição curta</label>
            <textarea name="bio" defaultValue={page.bio ?? ""} className="admin-textarea" rows={3} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="admin-field">
              <label className="admin-label">Cor do tema</label>
              <input name="cor_tema" type="color" defaultValue={page.cor_tema ?? "#9B6BB5"} className="admin-input" style={{ padding: "4px", height: "42px" }} />
            </div>
            <div className="admin-field">
              <label className="admin-label">URL do avatar/foto</label>
              <input name="avatar_url" defaultValue={page.avatar_url ?? ""} className="admin-input" placeholder="https://..." />
            </div>
          </div>

          {erroForm && (
            <p className="text-sm" style={{ color: "#F87171", fontFamily: "var(--font-inter), sans-serif" }}>{erroForm}</p>
          )}

          <div>
            <button type="submit" disabled={loadingForm} className="btn-primary" style={{ fontSize: "14px", padding: "12px 24px" }}>
              {loadingForm ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>

      {/* Links */}
      <div className="glass rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#2E9BAF", fontFamily: "var(--font-inter), sans-serif" }}>
          Botões de link
        </p>
        <div className="flex flex-col gap-3 mb-4">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                className="admin-input"
                placeholder="Texto do botão (ex: WhatsApp)"
                style={{ flex: 1 }}
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className="admin-input"
                placeholder="https://..."
                style={{ flex: 2 }}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="flex-shrink-0"
                style={{ color: "#F87171", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
                aria-label="Remover link"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
          {links.length === 0 && (
            <p className="text-sm" style={{ color: "#4B5563", fontFamily: "var(--font-inter), sans-serif" }}>
              Nenhum link adicionado ainda.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={addLink} className="btn-secondary" style={{ fontSize: "13px", padding: "9px 18px" }}>
            + Adicionar link
          </button>
          <button type="button" onClick={salvarLinks} disabled={loadingLinks} className="btn-primary" style={{ fontSize: "13px", padding: "9px 18px" }}>
            {loadingLinks ? "Salvando..." : "Salvar links"}
          </button>
        </div>
      </div>
    </div>
  );
}
