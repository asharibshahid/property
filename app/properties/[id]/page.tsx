import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Hash,
  MapPin,
  Maximize2,
  MessageCircle,
} from "lucide-react";
import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { PropertyImageGallery } from "@/components/public/PropertyImageGallery";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants";
import { getPropertyById } from "@/lib/data";
import { createPropertyWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice, getPropertyReference } from "@/lib/utils";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const whatsappUrl = createPropertyWhatsAppUrl(property, ADMIN_WHATSAPP_NUMBER);
  const propertyRef = getPropertyReference(property.id);

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F4EF]">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#07111F] hover:text-[#D6A84F]"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to properties
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="min-w-0">
              <PropertyImageGallery
                title={property.title}
                images={property.images}
              />

              <article className="mt-6 rounded-md bg-white p-5 shadow-[0_18px_50px_rgba(7,17,31,0.08)] sm:p-7">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-[#07111F] px-3 py-1 text-xs font-bold text-white">
                    {property.propertyType}
                  </span>
                  <span className="rounded-md bg-[#D6A84F] px-3 py-1 text-xs font-bold text-[#07111F]">
                    {property.purpose}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-black leading-tight text-[#07111F] sm:text-4xl">
                  {property.title}
                </h1>
                <p className="mt-4 flex items-center gap-2 text-[#1F2937]/68">
                  <MapPin size={18} className="text-[#D6A84F]" aria-hidden="true" />
                  {property.address}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Spec
                    icon={<Maximize2 size={18} />}
                    label="Size"
                    value={`${property.size} ${property.sizeUnit}`}
                  />
                  <Spec
                    icon={<BedDouble size={18} />}
                    label="Bedrooms"
                    value={property.bedrooms ?? "-"}
                  />
                  <Spec
                    icon={<Bath size={18} />}
                    label="Bathrooms"
                    value={property.bathrooms ?? "-"}
                  />
                  <Spec icon={<Hash size={18} />} label="Property Ref" value={propertyRef} />
                </div>

                <section className="mt-8">
                  <h2 className="text-xl font-black text-[#07111F]">Description</h2>
                  <p className="mt-3 leading-8 text-[#1F2937]/72">
                    {property.description}
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-xl font-black text-[#07111F]">Features</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {property.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-md border border-[#07111F]/10 bg-[#F7F4EF] px-3 py-2 text-sm font-semibold text-[#1F2937]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </section>
              </article>

              {property.videoUrl ? (
                <section className="mt-6 overflow-hidden rounded-md border border-[#07111F]/8 bg-white p-4 shadow-[0_18px_50px_rgba(7,17,31,0.08)] sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold uppercase text-[#D6A84F]">
                        Video Tour
                      </p>
                      <h2 className="mt-1 text-2xl font-black text-[#07111F]">
                        Property Walkthrough Video
                      </h2>
                    </div>
                    <span className="rounded-md bg-[#07111F] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
                      No autoplay
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-md bg-[#07111F] shadow-[0_20px_60px_rgba(7,17,31,0.16)]">
                    <video
                      controls
                      preload="metadata"
                      poster={property.images[0]}
                      className="aspect-video w-full bg-[#07111F]"
                    >
                      <source
                        src={property.videoUrl}
                        type={property.videoMimeType || "video/mp4"}
                      />
                    </video>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="rounded-md border border-[#07111F]/8 bg-white p-5 shadow-[0_18px_50px_rgba(7,17,31,0.08)] lg:sticky lg:top-24">
              <p className="text-sm font-bold uppercase text-[#D6A84F]">
                Admin assisted inquiry
              </p>
              <p className="mt-3 text-3xl font-black text-[#07111F]">
                {formatPrice(property.price, property.purpose)}
              </p>
              <div className="mt-5 grid gap-3 text-sm text-[#1F2937]/72">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#D6A84F]" aria-hidden="true" />
                  {property.area}, {property.location}
                </p>
                <p className="flex items-center gap-2">
                  <Maximize2
                    size={16}
                    className="text-[#D6A84F]"
                    aria-hidden="true"
                  />
                  {property.size} {property.sizeUnit}
                </p>
                <p className="flex items-center gap-2">
                  <Hash size={16} className="text-[#D6A84F]" aria-hidden="true" />
                  {propertyRef}
                </p>
                <p>
                  Owner details are private. This button opens admin WhatsApp
                  only.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-bold text-[#07111F] shadow-[0_18px_44px_rgba(37,211,102,0.25)] transition hover:-translate-y-0.5 hover:bg-[#20bd59]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Contact on WhatsApp
              </a>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[#07111F]/8 bg-[#F7F4EF] p-4">
      <div className="text-[#D6A84F]">{icon}</div>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#1F2937]/55">
        {label}
      </p>
      <p className="mt-1 break-words font-black text-[#07111F]">{value}</p>
    </div>
  );
}
