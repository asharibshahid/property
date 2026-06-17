import { SlidersHorizontal } from "lucide-react";
import { propertyPurposes, propertyTypes } from "@/lib/constants";
import type { PropertyFilters as PropertyFiltersType } from "@/types/property";

const priceRanges = [
  { label: "Any price", value: "" },
  { label: "Under PKR 1 Cr", value: "0-10000000" },
  { label: "PKR 1 Cr to 5 Cr", value: "10000000-50000000" },
  { label: "PKR 5 Cr+", value: "50000000-" },
];

export function PropertyFilters({
  filters,
  locations,
}: {
  filters: PropertyFiltersType;
  locations: string[];
}) {
  return (
    <form className="grid gap-3 rounded-md border border-white/60 bg-white/86 p-4 shadow-[0_18px_50px_rgba(7,17,31,0.1)] backdrop-blur-xl md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
      <Select label="Location" name="location" defaultValue={filters.location}>
        <option value="">All locations</option>
        {locations.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </Select>

      <Select
        label="Property type"
        name="propertyType"
        defaultValue={filters.propertyType}
      >
        <option value="">All types</option>
        {propertyTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      <Select label="Purpose" name="purpose" defaultValue={filters.purpose}>
        <option value="">Sale / Rent</option>
        {propertyPurposes.map((purpose) => (
          <option key={purpose} value={purpose}>
            {purpose}
          </option>
        ))}
      </Select>

      <Select
        label="Price range"
        name="priceRange"
        defaultValue={filters.priceRange}
      >
        {priceRanges.map((range) => (
          <option key={range.label} value={range.value}>
            {range.label}
          </option>
        ))}
      </Select>

      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#07111F]/60">
          Size
        </span>
        <input
          name="size"
          defaultValue={filters.size || ""}
          placeholder="e.g. 500 sq yd"
          className="h-11 rounded-md border border-[#07111F]/10 bg-white px-3 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
        />
      </label>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-md bg-[#07111F] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1d33]"
      >
        <SlidersHorizontal size={17} aria-hidden="true" />
        Apply
      </button>
    </form>
  );
}

function Select({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#07111F]/60">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue || ""}
        className="h-11 rounded-md border border-[#07111F]/10 bg-white px-3 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
      >
        {children}
      </select>
    </label>
  );
}
