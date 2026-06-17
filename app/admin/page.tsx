import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { requireAdminPage } from "@/lib/admin";
import { getAllPropertiesForAdmin } from "@/lib/properties";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  await requireAdminPage();

  const params = await searchParams;
  const properties = await getAllPropertiesForAdmin();
  const stats = {
    total: properties.length,
    pending: properties.filter((property) => property.status === "pending").length,
    approved: properties.filter((property) => property.status === "approved").length,
    rejected: properties.filter((property) => property.status === "rejected").length,
  };

  return (
    <AdminShell noticeMessage={single(params.notice)} noticeType={single(params.noticeType)}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-[#D6A84F]">Admin</p>
          <h1 className="mt-2 text-3xl font-black text-[#07111F] sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-3 text-sm text-[#1F2937]/68">
            Seller contacts are visible only inside admin pages.
          </p>
        </div>
        <Link
          href="/admin/properties/pending"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#07111F] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1d33]"
        >
          Review pending
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6">
        <AdminStatsCards stats={stats} />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-[#07111F]">Recent Properties</h2>
          <Link
            href="/admin/properties"
            className="text-sm font-bold text-[#07111F] hover:text-[#D6A84F]"
          >
            View all
          </Link>
        </div>
        <AdminPropertyTable properties={properties.slice(0, 4)} returnTo="/admin" />
      </section>
    </AdminShell>
  );
}
