import { Search } from "lucide-react";

export function AdminPropertySearch({
  defaultValue = "",
  action,
  placeholder = "Search ref, title, location, seller, contact",
}: {
  defaultValue?: string;
  action: string;
  placeholder?: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-3 rounded-md border border-[#07111F]/8 bg-white p-3 shadow-sm sm:grid-cols-[1fr_auto]"
    >
      <label className="relative">
        <span className="sr-only">Search properties</span>
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#07111F]/42"
          aria-hidden="true"
        />
        <input
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-11 w-full rounded-md border border-[#07111F]/10 px-10 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#07111F] px-4 text-sm font-bold text-white transition hover:bg-[#0d1d33]"
      >
        <Search size={17} aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
