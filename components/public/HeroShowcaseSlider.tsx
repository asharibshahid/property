"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { heroPropertySlides } from "@/lib/hero-slides";

export function HeroShowcaseSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = heroPropertySlides[activeIndex];

  return (
    <div className="hero-showcase-card absolute left-0 top-5 h-[360px] w-[90%] overflow-hidden sm:left-8 sm:top-8 sm:h-[430px] sm:w-[86%]">
      {heroPropertySlides.map((slide, index) => (
        <Image
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          fill
          sizes="(min-width: 1024px) 42vw, 86vw"
          className={`hero-showcase-image object-cover ${
            index === activeIndex ? "hero-showcase-image-active" : ""
          }`}
          unoptimized
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/94 via-[#07111F]/42 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(214,168,79,0.22),transparent_32%)]" />

      <div className="relative flex h-full flex-col justify-between p-4 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D6A84F] sm:text-sm">
              Live property showcase
            </p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              <MapPin size={14} className="text-[#D6A84F]" aria-hidden="true" />
              {active.location}
            </p>
          </div>
          <span className="hidden rounded-md border border-white/16 bg-white/12 px-3 py-2 text-right text-xs font-black text-white backdrop-blur sm:block">
            {active.price}
          </span>
        </div>

        <div>
          <h2 className="max-w-sm text-2xl font-black leading-tight text-white sm:text-4xl">
            {active.title}
          </h2>
          <p className="mt-3 text-sm font-semibold text-white/78">{active.meta}</p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {heroPropertySlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? "w-9 bg-[#D6A84F]" : "w-2.5 bg-white/38"
                  }`}
                  aria-label={`Show ${slide.title}`}
                />
              ))}
            </div>
            <span className="hidden h-10 w-10 items-center justify-center rounded-md bg-[#D6A84F] text-[#07111F] sm:inline-flex">
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
