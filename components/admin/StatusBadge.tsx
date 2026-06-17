import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types/property";

const statusClasses: Record<PropertyStatus, string> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-1 text-xs font-bold capitalize",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
