import Link from "next/link";
import { ArrowRight, Crown, MapPin, PlusCircle, ShieldCheck, Sparkles } from "lucide-react";
import { HeroBackdropSlider } from "./HeroBackdropSlider";
import { HeroShowcaseSlider } from "./HeroShowcaseSlider";
import { SearchBar } from "./SearchBar";
import { Floating3DShapes } from "./Floating3DShapes";
import { SITE_NAME } from "@/lib/constants";

export function HeroSection({ locations = [] }: { locations?: string[] }) {
  return (
    <section className="cinematic-hero relative overflow-hidden bg-[#07111F] text-white">
      <Floating3DShapes />
      <HeroBackdropSlider />
      <div className="mx-auto grid min-h-[calc(100svh-68px)] max-w-7xl items-center gap-7 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#D6A84F]/35 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md">
            <Sparkles size={15} className="text-[#D6A84F]" aria-hidden="true" />
            {SITE_NAME}
          </div>
          <h1 className="mt-5 max-w-4xl break-words text-4xl font-black leading-[1.04] text-white sm:mt-6 sm:text-6xl lg:text-7xl">
            <span className="block">Karachi&apos;s Premium</span>
            <span className="block">Gateway to</span>
            <span className="block sm:inline">Landmark</span>{" "}
            <span className="block sm:inline">Properties</span>
          </h1>
          <p className="mt-5 max-w-[32ch] text-base leading-8 text-white/76 sm:mt-6 sm:max-w-2xl sm:text-lg">
            Discover approved flats, houses, plots, shops, and commercial spaces
            across Karachi with a refined buying experience built around trust.
          </p>

          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <Link
              href="/properties"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#D6A84F] px-5 py-3 text-sm font-black text-[#07111F] shadow-[0_22px_60px_rgba(214,168,79,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e4ba62]"
            >
              Browse Properties
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/submit-property"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/18 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#D6A84F]"
            >
              <PlusCircle size={18} className="text-[#D6A84F]" aria-hidden="true" />
              List Your Property
            </Link>
          </div>

          <div className="mt-7 grid max-w-2xl gap-3 text-sm font-semibold text-white/76 sm:mt-8 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 py-3 backdrop-blur">
              <ShieldCheck size={17} className="text-[#D6A84F]" aria-hidden="true" />
              Approved listings
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 py-3 backdrop-blur">
              <Crown size={17} className="text-[#D6A84F]" aria-hidden="true" />
              Premium curation
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 py-3 backdrop-blur">
              <MapPin size={17} className="text-[#D6A84F]" aria-hidden="true" />
              Karachi focus
            </span>
          </div>

          <div className="mt-8 max-w-5xl sm:mt-9">
            <SearchBar locations={locations} />
          </div>
        </div>

        <div className="relative z-10 min-h-[420px] sm:min-h-[500px] lg:min-h-[590px]">
          <HeroShowcaseSlider />
          <div className="hero-stat-card absolute bottom-8 right-0 hidden w-[74%] p-4 text-[#07111F] sm:bottom-12 sm:block sm:w-[68%] sm:p-5">
            <p className="text-sm font-bold text-[#D6A84F]">Verified areas</p>
            <p className="mt-2 text-3xl font-black sm:mt-3 sm:text-4xl">8+</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#1F2937]/72">
              Karachi neighborhoods ready for quick browsing.
            </p>
          </div>
          <div className="absolute bottom-2 left-2 hidden h-20 w-20 rounded-md bg-[#D6A84F] shadow-[0_28px_80px_rgba(214,168,79,0.34)] sm:bottom-4 sm:left-1 sm:block sm:h-28 sm:w-28" />
          <div className="absolute right-2 top-0 hidden rounded-md border border-white/16 bg-white/10 px-3 py-2 text-xs font-black text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-md sm:right-8 sm:top-2 sm:block sm:px-4 sm:py-3 sm:text-sm">
            Luxury portfolio
            <span className="mt-1 block text-xl text-[#D6A84F] sm:text-2xl">PKR 3.2 Cr+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
