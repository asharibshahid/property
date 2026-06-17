import Image from "next/image";
import Link from "next/link";
import { Check, Eye, PlayCircle, Trash2, X } from "lucide-react";
import {
  approvePropertyFormAction,
  deletePropertyFormAction,
  rejectPropertyFormAction,
} from "@/app/actions";
import { formatPrice, getPropertyReference } from "@/lib/utils";
import type { AdminProperty } from "@/types/property";
import { StatusBadge } from "./StatusBadge";

export function AdminPropertyTable({
  properties,
  returnTo = "/admin/properties",
}: {
  properties: AdminProperty[];
  returnTo?: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-[#07111F]/8 bg-white shadow-[0_18px_50px_rgba(7,17,31,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1380px] w-full text-left text-sm">
          <thead className="bg-[#07111F] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Ref</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Purpose</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Seller Name</th>
              <th className="px-4 py-3 font-semibold">Seller Contact</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold">Video</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-[#07111F]/8">
                <td className="px-4 py-4">
                  <div className="relative h-14 w-16 overflow-hidden rounded-md bg-[#07111F]">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-md bg-[#D6A84F]/14 px-2.5 py-1 text-xs font-black text-[#07111F]">
                    {getPropertyReference(property.id)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-[#07111F]">{property.title}</p>
                  <p className="mt-1 text-xs text-[#1F2937]/55">
                    {property.status}
                  </p>
                </td>
                <td className="px-4 py-4">{property.location}</td>
                <td className="px-4 py-4">{property.propertyType}</td>
                <td className="px-4 py-4">{property.purpose}</td>
                <td className="px-4 py-4 font-bold text-[#07111F]">
                  {formatPrice(property.price, property.purpose)}
                </td>
                <td className="px-4 py-4">{property.sellerName}</td>
                <td className="px-4 py-4">{property.sellerContact}</td>
                <td className="px-4 py-4">
                  <span className="rounded-md bg-[#F7F4EF] px-2 py-1 text-xs font-bold text-[#07111F]">
                    {property.isFeatured
                      ? `Yes${property.featuredRank ? ` #${property.featuredRank}` : ""}`
                      : "No"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {property.videoUrl ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#D6A84F]/18 px-2 py-1 text-xs font-black text-[#07111F]">
                      <PlayCircle size={13} aria-hidden="true" />
                      Video
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#1F2937]/45">
                      -
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={property.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#07111F]/10 text-[#07111F] transition hover:border-[#D6A84F] hover:bg-[#D6A84F]/10"
                      aria-label="View property"
                    >
                      <Eye size={16} aria-hidden="true" />
                    </Link>
                    <form action={approvePropertyFormAction.bind(null, property.id)}>
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <ActionButton label="Approve" icon={<Check size={16} />} />
                    </form>
                    <form action={rejectPropertyFormAction.bind(null, property.id)}>
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <ActionButton label="Reject" icon={<X size={16} />} />
                    </form>
                    <form action={deletePropertyFormAction.bind(null, property.id)}>
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <ActionButton label="Delete" icon={<Trash2 size={16} />} danger />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({
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
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${
        danger
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "border-[#07111F]/10 text-[#07111F] hover:border-[#D6A84F] hover:bg-[#D6A84F]/10"
      }`}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
