"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
      style={{
        color: copied ? "#4ADE80" : "#9B6BB5",
        border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(155,107,181,0.3)",
        background: copied ? "rgba(34,197,94,0.10)" : "rgba(155,107,181,0.08)",
        fontFamily: "var(--font-inter), sans-serif",
        cursor: "pointer",
      }}
      onClick={handleCopy}
    >
      {copied ? "Copiado!" : label}
    </button>
  );
}
