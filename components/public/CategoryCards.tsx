import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { categoryCards } from "@/lib/constants";

export function CategoryCards() {
  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-[#D6A84F]">Categories</p>
          <h2 className="mt-2 text-3xl font-black text-[#07111F] sm:text-4xl">
            Search by property type
          </h2>
        </div>
        <Link
          href="/properties"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#07111F] transition hover:text-[#D6A84F]"
        >
          View all listings
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCards.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="group rounded-md border border-[#07111F]/8 bg-white p-5 shadow-[0_18px_46px_rgba(7,17,31,0.1)] transition duration-300 hover:-translate-y-1 hover:rotate-[0.45deg] hover:border-[#D6A84F]/55 hover:shadow-[0_26px_70px_rgba(7,17,31,0.16)] active:translate-y-0"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#07111F] text-[#D6A84F] shadow-lg">
                <Building2 size={22} aria-hidden="true" />
              </span>
              <ArrowUpRight
                size={18}
                className="text-[#07111F]/45 transition group-hover:text-[#D6A84F]"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-6 text-2xl font-black text-[#07111F]">
              {category.label}
            </h3>
            <p className="mt-2 text-sm text-[#1F2937]/62">{category.stat}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
