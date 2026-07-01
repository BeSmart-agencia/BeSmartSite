import { AdminSidebar } from "@/app/admin/landingpages/components/AdminSidebar";
import { AdminBottomNav } from "@/app/admin/landingpages/components/AdminBottomNav";

export default function LandingPagesLayout({ children }: { children: React.ReactNode }) {
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
