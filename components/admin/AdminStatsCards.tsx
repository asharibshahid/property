import { CheckCircle2, Clock3, Home, XCircle } from "lucide-react";

const statMeta = [
  { key: "total", label: "Total Properties", icon: Home },
  { key: "pending", label: "Pending Properties", icon: Clock3 },
  { key: "approved", label: "Approved Properties", icon: CheckCircle2 },
  { key: "rejected", label: "Rejected Properties", icon: XCircle },
] as const;

export function AdminStatsCards({
  stats,
}: {
  stats: Record<(typeof statMeta)[number]["key"], number>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statMeta.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="rounded-md border border-[#07111F]/8 bg-white p-5 shadow-[0_16px_44px_rgba(7,17,31,0.08)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#1F2937]/62">
                {stat.label}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D6A84F]/16 text-[#07111F]">
                <Icon size={19} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 text-4xl font-black text-[#07111F]">
              {stats[stat.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
