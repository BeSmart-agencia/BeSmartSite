"use client";

export default function LaisaApresentacaoPage() {
  const handleExportPDF = () => {
    const iframe = document.getElementById("apresentacao-frame") as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <button
        onClick={handleExportPDF}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,
          background: "#27AE60",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "12px 22px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Exportar PDF
      </button>

      <iframe
        id="apresentacao-frame"
        src="/apresentacao_laisa.html"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Apresentação Laisa"
      />
    </div>
  );
}
