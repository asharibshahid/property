import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-[#07111F]/20 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#F7F4EF] text-[#D6A84F]">
        <SearchX size={23} aria-hidden="true" />
      </span>
      <p className="mt-4 text-lg font-black text-[#07111F]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#1F2937]/65">{description}</p>
    </div>
  );
}
