import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
      <Sidebar />
      <main className="ml-64 flex-1 overflow-y-auto" style={{ backgroundColor: "#f8fafc" }}>
        {children}
      </main>
    </div>
  );
}
