import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Edit3, Trash2, X } from "lucide-react";
import { AdminPropertyForm } from "@/components/admin/AdminPropertyForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage } from "@/lib/admin";
import {
  approvePropertyFormAction,
  deletePropertyFormAction,
  rejectPropertyFormAction,
} from "@/app/actions";
import { getAdminPropertyById } from "@/lib/properties";
import { formatPrice, getPropertyReference } from "@/lib/utils";

type AdminPropertyDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPropertyDetailPage({
  params,
  searchParams,
}: AdminPropertyDetailProps) {
  await requireAdminPage();

  const { id } = await params;
  const query = await searchParams;
  const property = await getAdminPropertyById(id);

  if (!property) {
    notFound();
  }

  const detailPath = `/admin/properties/${property.id}`;
  const propertyRef = getPropertyReference(property.id);

  return (
    <AdminShell noticeMessage={single(query.notice)} noticeType={single(query.noticeType)}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#07111F] hover:text-[#D6A84F]"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to properties
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-[#07111F] sm:text-4xl">
              {property.title}
            </h1>
            <StatusBadge status={property.status} />
          </div>
          <p className="mt-2 text-sm text-[#1F2937]/68">
            {propertyRef} -{" "}
            {property.area}, {property.location} -{" "}
            {formatPrice(property.price, property.purpose)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={approvePropertyFormAction.bind(null, property.id)}>
            <input type="hidden" name="returnTo" value={detailPath} />
            <AdminAction label="Approve" icon={<Check size={17} />} />
          </form>
          <form action={rejectPropertyFormAction.bind(null, property.id)}>
            <input type="hidden" name="returnTo" value={detailPath} />
            <AdminAction label="Reject" icon={<X size={17} />} />
          </form>
          <a
            href="#edit-property"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D6A84F] px-4 py-3 text-sm font-bold text-[#07111F] transition hover:-translate-y-0.5 hover:bg-[#c99b42]"
          >
            <Edit3 size={17} aria-hidden="true" />
            Edit
          </a>
          <form action={deletePropertyFormAction.bind(null, property.id)}>
            <input type="hidden" name="returnTo" value="/admin/properties" />
            <AdminAction label="Delete" icon={<Trash2 size={17} />} danger />
          </form>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-6">
          <section className="rounded-md bg-white p-5 shadow-[0_18px_50px_rgba(7,17,31,0.08)]">
            <h2 className="text-xl font-black text-[#07111F]">Media</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {property.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#07111F]"
                >
                  <Image
                    src={image}
                    alt={`${property.title} admin image ${index + 1}`}
                    fill
                    sizes="(min-width: 1280px) 24vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            {property.videoUrl ? (
              <div className="mt-4 overflow-hidden rounded-md bg-[#07111F]">
                <video
                  controls
                  preload="metadata"
                  poster={property.images[0]}
                  className="aspect-video w-full"
                >
                  <source
                    src={property.videoUrl}
                    type={property.videoMimeType || "video/mp4"}
                  />
                </video>
              </div>
            ) : (
              <p className="mt-4 rounded-md border border-[#07111F]/10 bg-[#F7F4EF] p-3 text-sm font-semibold text-[#1F2937]/62">
                No property video uploaded.
              </p>
            )}
          </section>

          <section className="rounded-md bg-white p-5 shadow-[0_18px_50px_rgba(7,17,31,0.08)]">
            <h2 className="text-xl font-black text-[#07111F]">Full details</h2>
            <div className="mt-4 grid gap-3 text-sm text-[#1F2937]/72">
              <Detail label="Property Ref" value={propertyRef} />
              <Detail label="Database ID" value={property.id} />
              <Detail label="Location" value={`${property.address}`} />
              <Detail label="Type" value={property.propertyType} />
              <Detail label="Purpose" value={property.purpose} />
              <Detail label="Size" value={`${property.size} ${property.sizeUnit}`} />
              <Detail label="Bedrooms" value={property.bedrooms ?? "-"} />
              <Detail label="Bathrooms" value={property.bathrooms ?? "-"} />
              <Detail label="Video URL" value={property.videoUrl || "-"} />
              <Detail
                label="Video duration"
                value={
                  property.videoDurationSeconds
                    ? `${property.videoDurationSeconds} sec`
                    : "-"
                }
              />
              <Detail
                label="Video size"
                value={property.videoSizeMb ? `${property.videoSizeMb} MB` : "-"}
              />
              <Detail label="Video MIME type" value={property.videoMimeType || "-"} />
              <Detail label="Description" value={property.description} />
              <Detail label="Features" value={property.features.join(", ")} />
            </div>
          </section>

          <section className="rounded-md border border-[#D6A84F]/35 bg-[#07111F] p-5 text-white shadow-[0_18px_50px_rgba(7,17,31,0.12)]">
            <h2 className="text-xl font-black text-[#D6A84F]">Seller details</h2>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <Detail label="Seller full name" value={property.sellerName} dark />
              <Detail label="Seller contact" value={property.sellerContact} dark />
              <Detail label="Seller WhatsApp" value={property.sellerWhatsapp} dark />
              <Detail label="Seller email" value={property.sellerEmail || "-"} dark />
            </div>
          </section>
        </div>

        <div id="edit-property">
          <AdminPropertyForm property={property} returnTo={detailPath} />
        </div>
      </div>
    </AdminShell>
  );
}

function AdminAction({
  label,
  icon,
  danger,
}: {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="submit"
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
        danger
          ? "border border-red-200 bg-white text-red-700 hover:bg-red-50"
          : "bg-[#D6A84F] text-[#07111F] hover:bg-[#c99b42]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Detail({
  label,
  value,
  dark,
}: {
  label: string;
  value: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="grid gap-1 rounded-md border border-current/10 p-3">
      <span
        className={`text-xs font-bold uppercase tracking-[0.12em] ${
          dark ? "text-white/45" : "text-[#1F2937]/45"
        }`}
      >
        {label}
      </span>
      <span className={dark ? "font-semibold text-white" : "font-semibold text-[#07111F]"}>
        {value}
      </span>
    </div>
  );
}
