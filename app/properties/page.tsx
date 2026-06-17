import { Footer } from "@/components/public/Footer";
import { CustomPropertyRequestBar } from "@/components/public/CustomPropertyRequestBar";
import { Navbar } from "@/components/public/Navbar";
import { PropertyFilters } from "@/components/public/PropertyFilters";
import { PropertyGrid } from "@/components/public/PropertyGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants";
import { getAvailableLocations, getProperties } from "@/lib/data";
import type { PropertyFilters as PropertyFiltersType } from "@/types/property";

type PropertiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const filters: PropertyFiltersType = {
    location: single(params.location),
    propertyType: single(params.propertyType),
    purpose: single(params.purpose),
    priceRange: single(params.priceRange),
    size: single(params.size),
  };
  const [properties, availableLocations] = await Promise.all([
    getProperties(filters),
    getAvailableLocations(),
  ]);

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F4EF]">
        <section className="border-b border-[#07111F]/8 bg-[#07111F] px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase text-[#D6A84F]">
              Approved listings
            </p>
            <h1 className="mt-3 max-w-full break-words text-3xl font-black leading-tight sm:text-5xl">
              <span className="block">Properties in</span>
              <span className="block">Karachi</span>
            </h1>
            <p className="mt-4 max-w-[31ch] text-sm leading-6 text-white/70 sm:max-w-2xl">
              Browse approved Karachi listings only, with private owner details
              protected from the public experience.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="Filters"
            title="Find the right property"
            description="Filter by area, property type, purpose, price range, and size."
            className="mb-6"
          />
          <PropertyFilters filters={filters} locations={availableLocations} />
          <div className="mt-6">
            <CustomPropertyRequestBar
              adminWhatsAppNumber={ADMIN_WHATSAPP_NUMBER}
              compact
              locations={availableLocations}
            />
          </div>
          <div className="mt-8">
            <PropertyGrid properties={properties} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
