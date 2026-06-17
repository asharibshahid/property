"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  MapPin,
  Maximize2,
  PlayCircle,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types/property";

export function FeaturedPropertySlider({
  properties,
}: {
  properties: Property[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const featured = useMemo(
    () =>
      [...properties].sort((left, right) => {
        const leftRank = left.featuredRank ?? Number.MAX_SAFE_INTEGER;
        const rightRank = right.featuredRank ?? Number.MAX_SAFE_INTEGER;
        return leftRank - rightRank;
      }),
    [properties],
  );

  const goTo = useCallback(
    (index: number) => {
      if (featured.length === 0) {
        return;
      }

      const nextIndex = (index + featured.length) % featured.length;
      setActiveIndex(nextIndex);
      const track = trackRef.current;
      const card = track?.children.item(nextIndex);

      if (track && card instanceof HTMLElement) {
        track.scrollLeft = card.offsetLeft - track.offsetLeft;
      }
    },
    [featured.length],
  );

  if (featured.length === 0) {
    return (
      <EmptyState
        title="No featured properties yet"
        description="Mark approved listings as featured from the admin edit page to control this slider."
      />
    );
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-md border border-[#07111F]/10 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#07111F] shadow-sm">
          <BadgeCheck size={16} className="text-[#D6A84F]" aria-hidden="true" />
          Admin ranked
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#07111F]/10 bg-white text-[#07111F] shadow-sm transition hover:border-[#D6A84F] hover:bg-[#D6A84F]/10"
            aria-label="Previous featured property"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#07111F] text-white shadow-[0_16px_36px_rgba(7,17,31,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0d1d33]"
            aria-label="Next featured property"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mobile-scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:gap-5"
      >
        {featured.map((property, index) => (
          <article
            key={property.id}
            className={`group relative min-w-[86%] snap-start overflow-hidden rounded-md border bg-white shadow-[0_22px_65px_rgba(7,17,31,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_85px_rgba(7,17,31,0.18)] sm:min-w-[48%] lg:min-w-[31.6%] ${
              index === activeIndex ? "border-[#D6A84F]" : "border-[#07111F]/8"
            }`}
          >
            <Link href={`/properties/${property.id}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#07111F]">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 86vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  unoptimized
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/86 via-[#07111F]/18 to-transparent" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-[#D6A84F] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#07111F]">
                    Rank {property.featuredRank ?? index + 1}
                  </span>
                  <span className="rounded-md bg-white/90 px-3 py-1 text-xs font-bold text-[#07111F] backdrop-blur">
                    {property.purpose}
                  </span>
                  {property.videoUrl ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#07111F]/88 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      <PlayCircle size={13} aria-hidden="true" />
                      Video Tour
                    </span>
                  ) : null}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-2xl font-black leading-tight text-white">
                    {formatPrice(property.price, property.purpose)}
                  </p>
                </div>
              </div>
            </Link>

            <div className="p-4">
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-md bg-[#07111F] px-3 py-1 text-white">
                  {property.propertyType}
                </span>
                <span className="rounded-md bg-[#F7F4EF] px-3 py-1 text-[#07111F]">
                  Featured
                </span>
              </div>
              <Link
                href={`/properties/${property.id}`}
                className="mt-3 line-clamp-2 block min-h-14 text-xl font-black leading-7 text-[#07111F] transition hover:text-[#D6A84F]"
              >
                {property.title}
              </Link>
              <div className="mt-4 grid gap-2 text-sm font-semibold text-[#1F2937]/68">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} className="text-[#D6A84F]" aria-hidden="true" />
                  {property.area}, {property.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Maximize2
                    size={16}
                    className="text-[#D6A84F]"
                    aria-hidden="true"
                  />
                  {property.size} {property.sizeUnit}
                </span>
              </div>
              <Link
                href={`/properties/${property.id}`}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#07111F]/10 px-4 py-2 text-sm font-black text-[#07111F] transition hover:border-[#D6A84F] hover:bg-[#D6A84F]/10"
              >
                View Details
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {featured.map((property, index) => (
          <button
            key={property.id}
            type="button"
            onClick={() => goTo(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-[#D6A84F]" : "w-2.5 bg-[#07111F]/18"
            }`}
            aria-label={`Show featured property ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
