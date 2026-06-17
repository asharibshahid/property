import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-session";

export async function requireAdminPage() {
  const admin = await requireAdminSession();

  if (!admin.ok) {
    redirect(admin.reason === "config" ? "/admin/login?error=config" : "/admin/login");
  }

  return admin.session;
}
