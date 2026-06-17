import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize2, PlayCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group overflow-hidden rounded-md border border-[#07111F]/8 bg-white shadow-[0_18px_45px_rgba(7,17,31,0.1)] transition duration-300 hover:-translate-y-1 hover:rotate-[0.25deg] hover:shadow-[0_26px_70px_rgba(7,17,31,0.16)] active:translate-y-0">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#07111F]/5">
          <Image
            src={property.image}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/72 via-[#07111F]/8 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-white/90 px-3 py-1 text-xs font-bold text-[#07111F] backdrop-blur">
              {property.propertyType}
            </span>
            <span className="rounded-md bg-[#D6A84F] px-3 py-1 text-xs font-bold text-[#07111F]">
              {property.purpose}
            </span>
            {property.videoUrl ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#07111F]/88 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                <PlayCircle size={13} aria-hidden="true" />
                Video Tour
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-lg font-black text-[#07111F]">
          {formatPrice(property.price, property.purpose)}
        </p>
        <Link
          href={`/properties/${property.id}`}
          className="mt-2 line-clamp-2 block min-h-14 text-xl font-bold leading-7 text-[#1F2937] transition hover:text-[#07111F]"
        >
          {property.title}
        </Link>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#1F2937]/68">
          <MapPin size={16} className="text-[#D6A84F]" aria-hidden="true" />
          {property.area}, {property.location}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 border-y border-[#07111F]/8 py-3 text-sm font-semibold text-[#1F2937]/72">
          <span className="flex items-center gap-2">
            <Maximize2 size={15} aria-hidden="true" />
            {property.size} {property.sizeUnit}
          </span>
          <span>{property.propertyType}</span>
        </div>
        <Link
          href={`/properties/${property.id}`}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#07111F]/10 px-3 py-2 text-sm font-bold text-[#07111F] transition hover:border-[#D6A84F] hover:bg-[#D6A84F]/10"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
