import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { AdminPropertySearch } from "@/components/admin/AdminPropertySearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireAdminPage } from "@/lib/admin";
import { getPendingProperties } from "@/lib/properties";
import { filterAdminProperties } from "@/lib/utils";

type PendingPropertiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PendingPropertiesPage({
  searchParams,
}: PendingPropertiesPageProps) {
  await requireAdminPage();

  const params = await searchParams;
  const query = single(params.q) || "";
  const pendingProperties = await getPendingProperties();
  const visibleProperties = filterAdminProperties(pendingProperties, query);

  return (
    <AdminShell noticeMessage={single(params.notice)} noticeType={single(params.noticeType)}>
      <div>
        <p className="text-sm font-bold uppercase text-[#D6A84F]">Review queue</p>
        <h1 className="mt-2 text-3xl font-black text-[#07111F] sm:text-4xl">
          Pending properties
        </h1>
        <p className="mt-3 text-sm text-[#1F2937]/68">
          Listings submitted by sellers remain pending until admin approval.
        </p>
      </div>

      <div className="mt-6">
        <AdminPropertySearch
          defaultValue={query}
          action="/admin/properties/pending"
          placeholder="Search pending ref, title, seller, contact"
        />
      </div>

      <div className="mt-4">
        {visibleProperties.length ? (
          <AdminPropertyTable
            properties={visibleProperties}
            returnTo={`/admin/properties/pending${query ? `?q=${encodeURIComponent(query)}` : ""}`}
          />
        ) : (
          <EmptyState
            title={pendingProperties.length ? "No matching pending properties" : "No pending properties"}
            description={
              pendingProperties.length
                ? "Try another ref, title, seller, or contact number."
                : "The review queue is currently empty."
            }
          />
        )}
      </div>
    </AdminShell>
  );
}
