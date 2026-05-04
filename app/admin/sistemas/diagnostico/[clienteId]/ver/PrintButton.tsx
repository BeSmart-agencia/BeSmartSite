"use client";

function PrintIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-secondary flex-shrink-0 no-print"
      style={{ fontSize: "13px", padding: "8px 16px" }}
    >
      <PrintIcon />
      Exportar PDF
    </button>
  );
}
