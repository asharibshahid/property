import { propertyPurposes, propertyStatuses, propertyTypes, sizeUnits } from "@/lib/constants";
import { updatePropertyFormAction } from "@/app/actions";
import type { AdminProperty } from "@/types/property";

export function AdminPropertyForm({
  property,
  returnTo = `/admin/properties/${property.id}`,
}: {
  property: AdminProperty;
  returnTo?: string;
}) {
  return (
    <form
      action={updatePropertyFormAction.bind(null, property.id)}
      className="grid gap-5 rounded-md bg-white p-5 shadow-[0_18px_50px_rgba(7,17,31,0.08)]"
    >
      <input type="hidden" name="returnTo" value={returnTo} />
      <SectionTitle title="Property Details" />
      <Field label="Title" name="title" defaultValue={property.title} />
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Type"
          name="propertyType"
          defaultValue={property.propertyType}
          options={propertyTypes}
        />
        <Select
          label="Purpose"
          name="purpose"
          defaultValue={property.purpose}
          options={propertyPurposes}
        />
        <Field label="Location" name="location" defaultValue={property.location} />
        <Field label="Address" name="address" defaultValue={property.address} />
        <Field label="Size" name="size" defaultValue={property.size} />
        <Select
          label="Size Unit"
          name="sizeUnit"
          defaultValue={property.sizeUnit}
          options={sizeUnits}
        />
        <Field
          label="Price"
          name="price"
          defaultValue={String(property.price)}
          type="number"
        />
        <Select
          label="Status"
          name="status"
          defaultValue={property.status}
          options={propertyStatuses}
        />
        <Field
          label="Featured Rank"
          name="featuredRank"
          defaultValue={property.featuredRank?.toString() || ""}
          type="number"
        />
        <Field
          label="Bedrooms"
          name="bedrooms"
          defaultValue={property.bedrooms?.toString() || ""}
          type="number"
        />
        <Field
          label="Bathrooms"
          name="bathrooms"
          defaultValue={property.bathrooms?.toString() || ""}
          type="number"
        />
      </div>
      <label className="inline-flex items-center gap-3 rounded-md border border-[#D6A84F]/30 bg-[#D6A84F]/10 p-4 text-sm font-bold text-[#07111F]">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={property.isFeatured}
          className="h-5 w-5 rounded border-[#07111F]/20 accent-[#D6A84F]"
        />
        Show this property in homepage featured slider
      </label>
      <Textarea
        label="Description"
        name="description"
        defaultValue={property.description}
      />
      <Textarea
        label="Features"
        name="features"
        defaultValue={property.features.join(", ")}
      />

      <SectionTitle title="Video" />
      <input type="hidden" name="videoUrl" value={property.videoUrl || ""} />
      <input
        type="hidden"
        name="videoSizeMb"
        value={property.videoSizeMb?.toString() || ""}
      />
      <input
        type="hidden"
        name="videoDurationSeconds"
        value={property.videoDurationSeconds?.toString() || ""}
      />
      <input
        type="hidden"
        name="videoMimeType"
        value={property.videoMimeType || ""}
      />
      <div className="rounded-md border border-[#07111F]/10 bg-[#F7F4EF] p-4">
        <p className="text-sm font-bold text-[#07111F]">
          {property.videoUrl
            ? "This property has a Bunny CDN video attached."
            : "No property video is attached."}
        </p>
        {property.videoUrl ? (
          <label className="mt-3 inline-flex items-center gap-3 text-sm font-bold text-red-700">
            <input
              name="clearVideo"
              type="checkbox"
              className="h-5 w-5 rounded border-red-200 accent-red-600"
            />
            Clear/remove video URL and metadata on save
          </label>
        ) : null}
      </div>

      <SectionTitle title="Seller Details" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Seller Full Name" name="sellerName" defaultValue={property.sellerName} />
        <Field label="Seller Contact" name="sellerContact" defaultValue={property.sellerContact} />
        <Field
          label="Seller WhatsApp"
          name="sellerWhatsapp"
          defaultValue={property.sellerWhatsapp}
        />
        <Field label="Seller Email" name="sellerEmail" defaultValue={property.sellerEmail || ""} />
      </div>
      <Textarea
        label="Admin Notes"
        name="adminNotes"
        defaultValue={property.adminNotes || ""}
      />
      <Textarea
        label="Rejection Reason"
        name="rejectionReason"
        defaultValue={property.rejectionReason || ""}
      />
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-[#07111F] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1d33]"
      >
        Save property details
      </button>
    </form>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="border-b border-[#07111F]/10 pb-3 text-xl font-black text-[#07111F]">
      {title}
    </h2>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#07111F]">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="h-11 rounded-md border border-[#07111F]/10 px-3 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: readonly string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#07111F]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 rounded-md border border-[#07111F]/10 bg-white px-3 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#07111F]">{label}</span>
      <textarea
        name={name}
        rows={4}
        defaultValue={defaultValue}
        className="rounded-md border border-[#07111F]/10 px-3 py-3 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
      />
    </label>
  );
}
