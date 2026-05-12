"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { excluirCliente } from "@/app/admin/sistemas/actions";

export function ExcluirCliente({ clienteId, nomeEmpresa }: { clienteId: string; nomeEmpresa: string }) {
  const [aberto, setAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function confirmar() {
    setLoading(true);
    const result = await excluirCliente(clienteId);
    if (result?.error) {
      setErro(result.error);
      setLoading(false);
      return;
    }
    router.push("/admin/sistemas/clientes");
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="text-xs px-3 py-2 rounded-xl transition-all"
        style={{
          background: "rgba(248,113,113,0.08)",
          color: "#F87171",
          border: "1px solid rgba(248,113,113,0.2)",
          fontFamily: "var(--font-inter), sans-serif",
          cursor: "pointer",
        }}
      >
        Excluir cliente
      </button>
    );
  }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)" }}>
      <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Excluir <strong>{nomeEmpresa}</strong>?
      </p>
      <p className="text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-inter), sans-serif" }}>
        Todos os projetos, diagnósticos, etapas, chamados e dados financeiros serão apagados permanentemente.
      </p>
      {erro && <p className="text-xs" style={{ color: "#F87171", fontFamily: "var(--font-inter), sans-serif" }}>{erro}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={confirmar}
          disabled={loading}
          className="text-sm px-4 py-2 rounded-xl"
          style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Excluindo..." : "Sim, excluir"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="btn-secondary"
          style={{ fontSize: "13px" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
