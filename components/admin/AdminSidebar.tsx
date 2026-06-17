import Link from "next/link";
import { Building2, Home, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import { logoutAdminAction } from "@/app/actions";
import { SITE_NAME } from "@/lib/constants";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "All Properties", href: "/admin/properties", icon: Home },
  { label: "Pending", href: "/admin/properties/pending", icon: Inbox },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#07111F] text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-4 py-5 lg:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-[#D6A84F]">
          <Building2 size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-black">{SITE_NAME}</p>
          <p className="text-xs text-white/55">Admin panel</p>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Icon size={17} aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAdminAction} className="px-4 pb-4 lg:px-6">
        <button
          type="submit"
          className="inline-flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={17} aria-hidden="true" />
          Logout
        </button>
      </form>
    </aside>
  );
}
