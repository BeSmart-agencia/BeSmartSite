import { AdminSidebar } from "@/app/admin/sistemas/components/AdminSidebar";
import { AdminBottomNav } from "@/app/admin/sistemas/components/AdminBottomNav";

export default function SistemasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <AdminSidebar />
      <AdminBottomNav />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
