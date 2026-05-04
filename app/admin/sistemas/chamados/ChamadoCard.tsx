"use client";

import { useState, useActionState } from "react";
import { responderChamado, atualizarStatusChamado } from "@/app/admin/sistemas/actions";
import { useRouter } from "next/navigation";

type Chamado = {
  id: string;
  titulo: string;
  descricao: string | null;
  status: string;
  urgencia: string | null;
  prazo_resolucao: string | null;
  resposta: string | null;
  created_at: string;
  clientes: { nome: string; empresa: string } | null;
  projetos: { nome: string } | null;
};

type State = { error?: string; success?: boolean };

function fmt(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function ChamadoCard({ chamado, statusClass }: { chamado: Chamado; statusClass: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const result = await responderChamado(chamado.id, formData);
      if (result.success) { setOpen(false); router.refresh(); }
      return result;
    },
    {}
  );

  async function fechar() {
    await atualizarStatusChamado(chamado.id, "resolvido");
    router.refresh();
  }

  const statusColors: Record<string, string> = {
    aberto: "#FCD34D",
    "em andamento": "#9B6BB5",
    resolvido: "#4ADE80",
  };

  return (
    <div
      className="glass rounded-2xl p-5 flex flex-col gap-3"
      style={{ borderLeft: `3px solid ${statusColors[chamado.status] ?? "#6B7280"}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {chamado.titulo}
          </p>
          <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}>
            {chamado.clientes && <span>{chamado.clientes.empresa} · {chamado.clientes.nome}</span>}
            {chamado.projetos && <span>Projeto: {chamado.projetos.nome}</span>}
            <span>{fmt(chamado.created_at)}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {chamado.urgencia && chamado.urgencia !== "normal" && (
              <span className={`status-badge urgencia-${chamado.urgencia}`}>
                {chamado.urgencia.charAt(0).toUpperCase() + chamado.urgencia.slice(1)}
              </span>
            )}
            {chamado.prazo_resolucao && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.10)", fontFamily: "var(--font-inter), sans-serif" }}>
                Prazo: {new Date(chamado.prazo_resolucao + "T12:00:00").toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>
        </div>
        <span className={statusClass}>{chamado.status}</span>
      </div>

      {/* Descrição */}
      {chamado.descricao && (
        <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
          {chamado.descricao}
        </p>
      )}

      {/* Resposta existente */}
      {chamado.resposta && (
        <div
          className="rounded-xl p-3 text-sm"
          style={{ background: "rgba(155,107,181,0.08)", border: "1px solid rgba(155,107,181,0.15)" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "#9B6BB5", fontFamily: "var(--font-inter), sans-serif" }}>
            Sua resposta
          </p>
          <p style={{ color: "#D1D5DB", fontFamily: "var(--font-inter), sans-serif" }}>{chamado.resposta}</p>
        </div>
      )}

      {/* Ações */}
      {chamado.status !== "resolvido" && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "rgba(155,107,181,0.12)", color: "#9B6BB5", border: "1px solid rgba(155,107,181,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {open ? "Cancelar" : chamado.resposta ? "Editar resposta" : "Responder"}
          </button>
          <button
            type="button"
            onClick={fechar}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "rgba(34,197,94,0.10)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Marcar resolvido
          </button>
        </div>
      )}

      {/* Form resposta */}
      {open && (
        <form action={formAction} className="flex flex-col gap-3 pt-1">
          <select name="status" className="admin-select" defaultValue={chamado.status}>
            <option value="em andamento">Em andamento</option>
            <option value="resolvido">Resolvido</option>
          </select>
          <textarea
            name="resposta"
            className="admin-textarea"
            placeholder="Escreva sua resposta para o cliente..."
            defaultValue={chamado.resposta ?? ""}
            rows={3}
            required
          />
          {state.error && (
            <p className="text-xs" style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}>{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="btn-primary"
            style={{ fontSize: "13px", padding: "9px 18px", opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "Salvando..." : "Salvar resposta"}
          </button>
        </form>
      )}
    </div>
  );
}
