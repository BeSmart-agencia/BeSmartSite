"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/app/lib/auth";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await login(formData);
      return result ?? initialState;
    },
    initialState
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Orbs */}
      <div
        className="orb w-[500px] h-[500px] top-[-200px] left-[-200px]"
        style={{ background: "rgba(155, 107, 181, 0.10)" }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[-150px] right-[-150px]"
        style={{ background: "rgba(46, 155, 175, 0.08)" }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-6">
          <Image
            src="/logo.png"
            alt="BeSmart"
            width={140}
            height={44}
            className="object-contain h-10 w-auto"
            priority
          />

          <div className="text-center">
            <h1
              className="text-xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Painel Interno
            </h1>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Sistemas Sob Medida
            </p>
          </div>

          <form action={formAction} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#6B7280", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="admin-input"
              />
            </div>

            {state.error && (
              <p
                className="text-sm text-center"
                style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full justify-center"
              style={{ opacity: pending ? 0.7 : 1 }}
            >
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
