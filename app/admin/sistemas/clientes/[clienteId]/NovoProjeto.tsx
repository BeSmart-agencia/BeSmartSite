"use client";

import { useState, useActionState } from "react";
import { criarProjeto } from "@/app/admin/sistemas/actions";
import { useRouter } from "next/navigation";

type State = { error?: string; success?: boolean; projetoId?: string };

export function NovoProjeto({ clienteId }: { clienteId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const result = await criarProjeto(clienteId, formData);
      if (result.success && result.projetoId) {
        setOpen(false);
        router.push(`/admin/sistemas/clientes/${clienteId}/projeto/${result.projetoId}`);
      }
      return result;
    },
    {}
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-medium transition-all hover:bg-white/5"
        style={{
          border: "2px dashed rgba(255,255,255,0.10)",
          color: "#6B7280",
          fontFamily: "var(--font-inter), sans-serif",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Novo Projeto
      </button>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold text-white mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Novo Projeto
      </h3>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="admin-field">
            <label className="admin-label">Nome do projeto *</label>
            <input name="nome" required className="admin-input" placeholder="Ex: Sistema de Atendimento IA" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Status</label>
            <select name="status" className="admin-select">
              <option>Em diagnóstico</option>
              <option>Proposta enviada</option>
              <option>Aprovado</option>
              <option>Em desenvolvimento</option>
              <option>Entregue</option>
              <option>Pausado</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label">Descrição resumida</label>
          <textarea name="descricao" className="admin-textarea" placeholder="O que será desenvolvido..." rows={2} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="admin-field">
            <label className="admin-label">Valor total (R$)</label>
            <input name="valor_total" type="number" step="0.01" className="admin-input" placeholder="5000.00" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Forma de pagamento</label>
            <select name="forma_pagamento" className="admin-select">
              <option value="">Selecionar...</option>
              <option>Pagamento único</option>
              <option>Mensalidade</option>
              <option>Entrada + parcelas</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="admin-field">
            <label className="admin-label">Data de início</label>
            <input name="data_inicio" type="date" className="admin-input" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Prazo de entrega</label>
            <input name="prazo_entrega" type="date" className="admin-input" />
          </div>
        </div>

        {state.error && (
          <p className="text-sm" style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}>
            {state.error}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="btn-primary flex-1 justify-center" style={{ opacity: pending ? 0.7 : 1 }}>
            {pending ? "Criando..." : "Criar projeto"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
