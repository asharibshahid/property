import { EmptyState } from "@/components/ui/EmptyState";
import type { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No approved properties found"
        description="Try another location, type, purpose, price range, or size."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
