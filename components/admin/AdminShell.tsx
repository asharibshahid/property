import { AdminSidebar } from "./AdminSidebar";
import { AdminNotice } from "./AdminNotice";
import { getAdminDatabaseHealth } from "@/lib/properties";

export async function AdminShell({
  children,
  noticeMessage,
  noticeType,
}: {
  children: React.ReactNode;
  noticeMessage?: string;
  noticeType?: string;
}) {
  const dbHealth = await getAdminDatabaseHealth();

  return (
    <div className="min-h-screen bg-[#F7F4EF] lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <AdminNotice message={noticeMessage} type={noticeType} />
        {!dbHealth.ok ? (
          <AdminNotice message={dbHealth.message} type={dbHealth.level} />
        ) : null}
        {children}
      </main>
    </div>
  );
}
