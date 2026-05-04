"use client";

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:opacity-90"
      style={{
        color: "#9B6BB5",
        border: "1px solid rgba(155,107,181,0.3)",
        background: "rgba(155,107,181,0.08)",
        fontFamily: "var(--font-inter), sans-serif",
        cursor: "pointer",
      }}
      onClick={() => navigator.clipboard.writeText(text)}
    >
      {label}
    </button>
  );
}
