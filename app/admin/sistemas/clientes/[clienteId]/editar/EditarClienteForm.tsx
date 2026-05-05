"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editarCliente } from "@/app/admin/sistemas/actions";

type Cliente = {
  id: string; nome: string; empresa: string; segmento: string | null;
  whatsapp: string | null; email: string | null; como_conheceu: string | null;
  observacoes: string | null;
};

export function EditarClienteForm({ cliente }: { cliente: Cliente }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    const fd = new FormData(e.currentTarget);
    const res = await editarCliente(cliente.id, fd);
    setLoading(false);
    if (res.error) { setErro(res.error); return; }
    router.push(`/admin/sistemas/clientes/${cliente.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="admin-field">
          <label className="admin-label">Nome completo *</label>
          <input name="nome" required defaultValue={cliente.nome} className="admin-input" placeholder="Nome do contato" />
        </div>
        <div className="admin-field">
          <label className="admin-label">Empresa *</label>
          <input name="empresa" required defaultValue={cliente.empresa} className="admin-input" placeholder="Nome da empresa" />
        </div>
        <div className="admin-field">
          <label className="admin-label">Segmento</label>
          <input name="segmento" defaultValue={cliente.segmento ?? ""} className="admin-input" placeholder="Ex: Clínica, E-commerce, Construtora..." />
        </div>
        <div className="admin-field">
          <label className="admin-label">WhatsApp</label>
          <input name="whatsapp" defaultValue={cliente.whatsapp ?? ""} className="admin-input" placeholder="+55 51 9 9999-9999" />
        </div>
        <div className="admin-field">
          <label className="admin-label">E-mail</label>
          <input name="email" type="email" defaultValue={cliente.email ?? ""} className="admin-input" placeholder="contato@empresa.com" />
        </div>
        <div className="admin-field">
          <label className="admin-label">Como conheceu a BeSmart</label>
          <select name="como_conheceu" defaultValue={cliente.como_conheceu ?? ""} className="admin-select">
            <option value="">Selecione...</option>
            <option value="indicação">Indicação</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="google">Google</option>
            <option value="evento">Evento</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>
      <div className="admin-field">
        <label className="admin-label">Observações</label>
        <textarea name="observacoes" defaultValue={cliente.observacoes ?? ""} className="admin-textarea" rows={3} placeholder="Contexto inicial, dores mencionadas, referências..." />
      </div>
      {erro && (
        <p className="text-sm" style={{ color: "#F87171", fontFamily: "var(--font-inter), sans-serif" }}>{erro}</p>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary" style={{ fontSize: "14px", padding: "12px 24px" }}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary" style={{ fontSize: "14px", padding: "12px 24px" }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
