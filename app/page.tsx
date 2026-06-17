import Link from "next/link";
import { ArrowRight, MapPin, PlusCircle } from "lucide-react";
import { CategoryCards } from "@/components/public/CategoryCards";
import { CustomPropertyRequestBar } from "@/components/public/CustomPropertyRequestBar";
import { FeaturedPropertySlider } from "@/components/public/FeaturedPropertySlider";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { IntroLoader } from "@/components/public/IntroLoader";
import { Navbar } from "@/components/public/Navbar";
import { SectionShell } from "@/components/ui/SectionShell";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants";
import { getAvailableLocations, getFeaturedProperties } from "@/lib/data";

export default async function Home() {
  const [featuredProperties, availableLocations] = await Promise.all([
    getFeaturedProperties(),
    getAvailableLocations(),
  ]);

  return (
    <>
      <IntroLoader />
      <Navbar />
      <main>
        <HeroSection locations={availableLocations} />

        <section className="relative z-20 -mt-7 bg-transparent px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <CustomPropertyRequestBar
              adminWhatsAppNumber={ADMIN_WHATSAPP_NUMBER}
              locations={availableLocations}
            />
          </div>
        </section>

        <SectionShell surface="white">
          <CategoryCards />
        </SectionShell>

        <SectionShell className="relative overflow-hidden">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-[#D6A84F]">
                Featured showcase
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#07111F] sm:text-4xl">
                Curated properties, ordered by admin ranking
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#1F2937]/68">
                Only admin-selected featured properties appear here, sorted by
                featured rank so the most important listing leads the experience.
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#07111F] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1d33]"
            >
              View all
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8">
            <FeaturedPropertySlider properties={featuredProperties} />
          </div>
        </SectionShell>

        <SectionShell surface="white">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-[#D6A84F]">
                Popular areas
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#07111F] sm:text-4xl">
                Explore Karachi neighborhoods
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {availableLocations.map((area) => (
              <Link
                key={area}
                href={`/properties?location=${encodeURIComponent(area)}`}
                className="group flex min-h-16 items-center justify-between rounded-md border border-[#07111F]/8 bg-[#F7F4EF] p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#D6A84F]/55 hover:bg-white hover:shadow-[0_18px_45px_rgba(7,17,31,0.1)]"
              >
                <span className="flex items-center gap-2 font-bold text-[#07111F]">
                  <MapPin size={17} className="text-[#D6A84F]" aria-hidden="true" />
                  {area}
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#07111F]/35 transition group-hover:text-[#D6A84F]"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </SectionShell>

        <SectionShell surface="navy">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-[#D6A84F]">
                For sellers
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                List your property for admin approval
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
                Submitted listings are saved as pending and remain hidden from
                public pages until admin approval.
              </p>
            </div>
            <Link
              href="/submit-property"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#D6A84F] px-5 py-3 text-sm font-bold text-[#07111F] transition hover:-translate-y-0.5 hover:bg-[#c99b42]"
            >
              <PlusCircle size={18} aria-hidden="true" />
              List Your Property
            </Link>
          </div>
        </SectionShell>
      </main>
      <Footer />
    </>
  );
}
