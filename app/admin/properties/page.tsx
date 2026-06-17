import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { AdminPropertySearch } from "@/components/admin/AdminPropertySearch";
import { requireAdminPage } from "@/lib/admin";
import { getAllPropertiesForAdmin } from "@/lib/properties";
import { filterAdminProperties } from "@/lib/utils";

type AdminPropertiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  await requireAdminPage();

  const params = await searchParams;
  const query = single(params.q) || "";
  const properties = await getAllPropertiesForAdmin();
  const visibleProperties = filterAdminProperties(properties, query);

  return (
    <AdminShell noticeMessage={single(params.notice)} noticeType={single(params.noticeType)}>
      <div>
        <p className="text-sm font-bold uppercase text-[#D6A84F]">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-[#07111F] sm:text-4xl">
          All properties
        </h1>
        <p className="mt-3 text-sm text-[#1F2937]/68">
          Seller contact columns are allowed here because this is an admin-only
          area.
        </p>
      </div>

      <div className="mt-6">
        <AdminPropertySearch defaultValue={query} action="/admin/properties" />
      </div>

      <div className="mt-4">
        <AdminPropertyTable
          properties={visibleProperties}
          returnTo={`/admin/properties${query ? `?q=${encodeURIComponent(query)}` : ""}`}
        />
      </div>
    </AdminShell>
  );
}
