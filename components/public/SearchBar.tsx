import { Building, MapPin, Search } from "lucide-react";
import { propertyPurposes, propertyTypes } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  propertyType?: string;
  purpose?: string;
  location?: string;
  locations?: string[];
  className?: string;
};

export function SearchBar({
  propertyType,
  purpose,
  location,
  locations = [],
  className,
}: SearchBarProps) {
  return (
    <form
      action="/properties"
      className={cn(
        "grid gap-3 rounded-md border border-white/55 bg-white/88 p-2.5 shadow-[0_20px_60px_rgba(7,17,31,0.14)] backdrop-blur-xl sm:p-3 md:grid-cols-[1fr_1fr_1fr_auto]",
        className,
      )}
    >
      <label className="relative">
        <span className="sr-only">Property type</span>
        <Building
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#07111F]/45"
          aria-hidden="true"
        />
        <select
          name="propertyType"
          defaultValue={propertyType || ""}
          className="h-12 w-full rounded-md border border-[#07111F]/10 bg-white px-10 text-base text-[#1F2937] outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18 md:text-sm"
        >
          <option value="">All types</option>
          {propertyTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Purpose</span>
        <select
          name="purpose"
          defaultValue={purpose || ""}
          className="h-12 w-full rounded-md border border-[#07111F]/10 bg-white px-3 text-base text-[#1F2937] outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18 md:text-sm"
        >
          <option value="">Sale or rent</option>
          {propertyPurposes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="relative">
        <span className="sr-only">Location</span>
        <MapPin
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#07111F]/45"
          aria-hidden="true"
        />
        <select
          name="location"
          defaultValue={location || ""}
          className="h-12 w-full rounded-md border border-[#07111F]/10 bg-white px-10 text-base text-[#1F2937] outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18 md:text-sm"
        >
          <option value="">All available locations</option>
          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#07111F] px-5 text-base font-bold text-white shadow-[0_16px_36px_rgba(7,17,31,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0d1d33] md:text-sm"
      >
        <Search size={18} aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
