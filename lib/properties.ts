import "server-only";

import { revalidatePath } from "next/cache";
import { placeholderProperties } from "@/lib/mock-data";
import {
  createSupabaseServiceClient,
  createSupabaseServerClient,
  hasSupabaseConfig,
  hasServiceSupabaseConfig,
} from "@/lib/supabase/server";
import { filterProperties } from "@/lib/utils";
import type {
  AdminProperty,
  AdminPropertyUpdateInput,
  DbProperty,
  DbPublicProperty,
  PendingPropertyInput,
  PropertyFilters,
  PublicProperty,
} from "@/types/property";

const publicColumnList = [
  "id",
  "title",
  "property_type",
  "purpose",
  "location",
  "address",
  "size",
  "size_unit",
  "price",
  "bedrooms",
  "bathrooms",
  "description",
  "features",
  "images",
  "video_url",
  "video_size_mb",
  "video_duration_seconds",
  "video_mime_type",
  "status",
  "is_featured",
  "featured_rank",
  "approved_at",
  "created_at",
  "updated_at",
];

const publicColumns = publicColumnList.join(",");
const legacyPublicColumns = publicColumnList
  .filter(
    (column) =>
      column !== "is_featured" &&
      column !== "featured_rank" &&
      column !== "video_url" &&
      column !== "video_size_mb" &&
      column !== "video_duration_seconds" &&
      column !== "video_mime_type",
  )
  .join(",");

const defaultPropertyImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

function normalizePropertyType(value: string): PublicProperty["propertyType"] {
  const normalized = value.replace(/s$/, "");

  if (
    normalized === "Flat" ||
    normalized === "House" ||
    normalized === "Plot" ||
    normalized === "Portion" ||
    normalized === "Shop" ||
    normalized === "Office" ||
    normalized === "Commercial"
  ) {
    return normalized;
  }

  return "Commercial";
}

function normalizeSizeUnit(value: string): PublicProperty["sizeUnit"] {
  if (
    value === "Sq Ft" ||
    value === "Sq Yards" ||
    value === "Marla" ||
    value === "Kanal"
  ) {
    return value;
  }

  return "Sq Ft";
}

function toPublicProperty(row: DbPublicProperty): PublicProperty {
  const images = row.images?.length ? row.images : [defaultPropertyImage];

  return {
    id: row.id,
    title: row.title,
    location: row.location,
    area: row.location,
    address: row.address || row.location,
    price: Number(row.price),
    size: row.size,
    sizeUnit: normalizeSizeUnit(row.size_unit),
    propertyType: normalizePropertyType(row.property_type),
    purpose: row.purpose,
    status: row.status,
    isFeatured: Boolean(row.is_featured),
    featuredRank: row.featured_rank ?? undefined,
    image: images[0],
    images,
    videoUrl: row.video_url || undefined,
    videoSizeMb:
      row.video_size_mb === null || row.video_size_mb === undefined
        ? undefined
        : Number(row.video_size_mb),
    videoDurationSeconds:
      row.video_duration_seconds === null ||
      row.video_duration_seconds === undefined
        ? undefined
        : Number(row.video_duration_seconds),
    videoMimeType: row.video_mime_type || undefined,
    description: row.description || "",
    features: row.features || [],
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toAdminProperty(row: DbProperty): AdminProperty {
  return {
    ...toPublicProperty(row),
    sellerName: row.seller_name,
    sellerContact: row.seller_contact,
    sellerWhatsapp: row.seller_whatsapp || "",
    sellerEmail: row.seller_email || "",
    adminNotes: row.admin_notes || "",
    rejectionReason: row.rejection_reason || "",
  };
}

function fromAdminToPublic(property: AdminProperty): PublicProperty {
  return {
    id: property.id,
    title: property.title,
    location: property.location,
    area: property.area,
    address: property.address,
    price: property.price,
    size: property.size,
    sizeUnit: property.sizeUnit,
    propertyType: property.propertyType,
    purpose: property.purpose,
    status: property.status,
    isFeatured: property.isFeatured,
    featuredRank: property.featuredRank,
    image: property.image,
    images: property.images,
    videoUrl: property.videoUrl,
    videoSizeMb: property.videoSizeMb,
    videoDurationSeconds: property.videoDurationSeconds,
    videoMimeType: property.videoMimeType,
    description: property.description,
    features: property.features,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    approvedAt: property.approvedAt,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
}

function fallbackApproved(filters: PropertyFilters = {}) {
  return filterProperties(
    placeholderProperties.map(fromAdminToPublic),
    filters,
  );
}

function logDataError(message: string, error: unknown) {
  if (process.env.NODE_ENV === "production") {
    console.error(message, error);
  }
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return "";
  }

  return String((error as { message?: unknown }).message || "");
}

function isMissingColumnError(error: unknown, columns: string[]) {
  const message = getErrorMessage(error);
  return columns.some((column) => message.includes(column));
}

function isMissingFeaturedColumnError(error: unknown) {
  return isMissingColumnError(error, ["featured_rank", "is_featured"]);
}

function isMissingOptionalPublicColumnError(error: unknown) {
  return isMissingColumnError(error, [
    "featured_rank",
    "is_featured",
    "video_url",
    "video_size_mb",
    "video_duration_seconds",
    "video_mime_type",
  ]);
}

function isMissingMediaColumnError(error: unknown) {
  return isMissingColumnError(error, [
    "video_url",
    "video_size_mb",
    "video_duration_seconds",
    "video_mime_type",
  ]);
}

export async function getAdminDatabaseHealth() {
  if (!hasSupabaseConfig()) {
    return {
      ok: false,
      level: "error" as const,
      message:
        "Supabase public env vars are missing. Admin pages are showing demo data.",
    };
  }

  if (!hasServiceSupabaseConfig()) {
    return {
      ok: false,
      level: "error" as const,
      message:
        "SUPABASE_SERVICE_ROLE_KEY is missing. Admin approve, reject, delete, and edit actions cannot write to Supabase.",
    };
  }

  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: false,
      level: "error" as const,
      message:
        "Supabase service client could not be created. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const tableCheck = await supabase
    .from("properties")
    .select("id,status,approved_at,rejection_reason")
    .limit(1);

  if (tableCheck.error) {
    return {
      ok: false,
      level: "error" as const,
      message: `Admin DB table check failed: ${tableCheck.error.message}`,
    };
  }

  const featuredCheck = await supabase
    .from("properties")
    .select("id,is_featured,featured_rank")
    .limit(1);

  if (featuredCheck.error) {
    return {
      ok: false,
      level: "warning" as const,
      message:
        "Admin writes work, but featured ranking columns are missing. Run supabase/migrations/20260523_add_featured_ranking.sql.",
    };
  }

  const publicViewCheck = await supabase
    .from("public_properties")
    .select("id,is_featured,featured_rank,video_url,video_size_mb,video_duration_seconds,video_mime_type")
    .limit(1);

  if (publicViewCheck.error) {
    return {
      ok: false,
      level: "warning" as const,
      message:
        "Public view is missing featured ranking or Bunny media fields. Run the Supabase migrations and reload schema cache.",
    };
  }

  return {
    ok: true,
    level: "success" as const,
    message: "Supabase admin wiring is connected.",
  };
}

export async function getApprovedProperties(filters: PropertyFilters = {}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase || !hasSupabaseConfig()) {
    return fallbackApproved(filters);
  }

  let { data, error } = await supabase
    .from("public_properties")
    .select(publicColumns)
    .order("created_at", { ascending: false });

  if (error && isMissingOptionalPublicColumnError(error)) {
    const legacyResult = await supabase
      .from("public_properties")
      .select(legacyPublicColumns)
      .order("created_at", { ascending: false });
    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error || !data) {
    logDataError("Failed to load public properties", error);
    return fallbackApproved(filters);
  }

  const rows = data as unknown as DbPublicProperty[];
  return filterProperties(rows.map((row) => toPublicProperty(row)), filters);
}

export async function getPropertyById(id: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase || !hasSupabaseConfig()) {
    return fallbackApproved().find((property) => property.id === id) || null;
  }

  let { data, error } = await supabase
    .from("public_properties")
    .select(publicColumns)
    .eq("id", id)
    .maybeSingle();

  if (error && isMissingOptionalPublicColumnError(error)) {
    const legacyResult = await supabase
      .from("public_properties")
      .select(legacyPublicColumns)
      .eq("id", id)
      .maybeSingle();
    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error || !data) {
    if (error) {
      logDataError("Failed to load public property", error);
    }
    return null;
  }

  return toPublicProperty(data as unknown as DbPublicProperty);
}

export async function createPendingProperty(data: PendingPropertyInput) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message:
        "Supabase is not configured. Add environment variables before submitting.",
    };
  }

  const insertPayload = {
    title: data.title,
    property_type: data.property_type,
    purpose: data.purpose,
    location: data.location,
    address: data.address ?? null,
    size: data.size,
    size_unit: data.size_unit,
    price: data.price,
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    description: data.description ?? null,
    features: data.features ?? [],
    images: data.images ?? [],
    video_url: data.video_url ?? null,
    video_size_mb: data.video_size_mb ?? null,
    video_duration_seconds: data.video_duration_seconds ?? null,
    video_mime_type: data.video_mime_type ?? null,
    status: "pending",
    seller_name: data.seller_name,
    seller_contact: data.seller_contact,
    seller_whatsapp: data.seller_whatsapp ?? null,
    seller_email: data.seller_email ?? null,
  };

  const { error } = await supabase.from("properties").insert(insertPayload);

  if (error) {
    console.error("Failed to create pending property", error);
    if (isMissingMediaColumnError(error)) {
      return {
        ok: false,
        message:
          "Database media columns are missing. Run supabase/migrations/20260617_add_bunny_video_fields.sql in Supabase and reload the schema cache.",
      };
    }
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath("/admin/properties/pending");

  return {
    ok: true,
    message:
      "Your property has been submitted successfully. Our team will review it before publishing.",
  };
}

export async function getAllPropertiesForAdmin() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return placeholderProperties;
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load admin properties", error);
    return placeholderProperties;
  }

  return (data as unknown as DbProperty[]).map((row) => toAdminProperty(row));
}

export async function getPendingProperties() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return placeholderProperties.filter((property) => property.status === "pending");
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load pending properties", error);
    return placeholderProperties.filter((property) => property.status === "pending");
  }

  return (data as unknown as DbProperty[]).map((row) => toAdminProperty(row));
}

export async function getFeaturedProperties(limit = 3) {
  const supabase = await createSupabaseServerClient();

  if (!supabase || !hasSupabaseConfig()) {
    return fallbackApproved()
      .filter((property) => property.isFeatured)
      .sort(compareFeaturedProperties)
      .slice(0, limit);
  }

  let { data, error } = await supabase
    .from("public_properties")
    .select(publicColumns)
    .eq("is_featured", true)
    .order("featured_rank", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error && isMissingOptionalPublicColumnError(error)) {
    const legacyResult = await supabase
      .from("public_properties")
      .select(legacyPublicColumns)
      .order("created_at", { ascending: false })
      .limit(limit);
    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error || !data) {
    logDataError("Failed to load featured properties", error);
    return fallbackApproved()
      .filter((property) => property.isFeatured)
      .sort(compareFeaturedProperties)
      .slice(0, limit);
  }

  return (data as unknown as DbPublicProperty[])
    .map((row) => toPublicProperty(row))
    .sort(compareFeaturedProperties)
    .slice(0, limit);
}

function compareFeaturedProperties(
  left: PublicProperty,
  right: PublicProperty,
) {
  const leftRank = left.featuredRank ?? Number.MAX_SAFE_INTEGER;
  const rightRank = right.featuredRank ?? Number.MAX_SAFE_INTEGER;

  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  return (right.createdAt || "").localeCompare(left.createdAt || "");
}

export async function getAdminPropertyById(id: string) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return placeholderProperties.find((property) => property.id === id) || null;
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("Failed to load admin property", error);
    }
    return null;
  }

  return toAdminProperty(data as unknown as DbProperty);
}

export async function approveProperty(id: string) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return { ok: false, message: "Supabase service role is not configured." };
  }

  const { error } = await supabase
    .from("properties")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", id);

  if (error) {
    if (isMissingColumnError(error, ["approved_at", "rejection_reason"])) {
      const { error: retryError } = await supabase
        .from("properties")
        .update({ status: "approved" })
        .eq("id", id);

      if (!retryError) {
        revalidatePropertyPaths(id);
        return {
          ok: true,
          message:
            "Property approved. Run the latest Supabase migration to add approved_at/rejection_reason tracking.",
        };
      }

      return { ok: false, message: retryError.message };
    }

    return { ok: false, message: error.message };
  }

  revalidatePropertyPaths(id);
  return { ok: true, message: "Property approved." };
}

export async function rejectProperty(id: string, rejectionReason?: string) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return { ok: false, message: "Supabase service role is not configured." };
  }

  const { error } = await supabase
    .from("properties")
    .update({
      status: "rejected",
      rejection_reason: rejectionReason || null,
      approved_at: null,
    })
    .eq("id", id);

  if (error) {
    if (isMissingColumnError(error, ["approved_at", "rejection_reason"])) {
      const { error: retryError } = await supabase
        .from("properties")
        .update({ status: "rejected" })
        .eq("id", id);

      if (!retryError) {
        revalidatePropertyPaths(id);
        return {
          ok: true,
          message:
            "Property rejected. Run the latest Supabase migration to add rejection reason tracking.",
        };
      }

      return { ok: false, message: retryError.message };
    }

    return { ok: false, message: error.message };
  }

  revalidatePropertyPaths(id);
  return { ok: true, message: "Property rejected." };
}

export async function deleteProperty(id: string) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return { ok: false, message: "Supabase service role is not configured." };
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePropertyPaths(id);
  return { ok: true, message: "Property deleted." };
}

export async function updateProperty(
  id: string,
  data: AdminPropertyUpdateInput,
) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return { ok: false, message: "Supabase service role is not configured." };
  }

  const { error } = await supabase.from("properties").update(data).eq("id", id);

  if (error) {
    if (isMissingFeaturedColumnError(error)) {
      const { is_featured, featured_rank, ...compatibleData } = data;
      void is_featured;
      void featured_rank;

      const { error: retryError } = await supabase
        .from("properties")
        .update(compatibleData)
        .eq("id", id);

      if (!retryError) {
        revalidatePropertyPaths(id);
        return {
          ok: true,
          message:
            "Property updated. Run the featured ranking migration to save homepage ranking controls.",
        };
      }

      return { ok: false, message: retryError.message };
    }

    return { ok: false, message: error.message };
  }

  revalidatePropertyPaths(id);
  return { ok: true, message: "Property updated." };
}

function revalidatePropertyPaths(id: string) {
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath("/admin/properties/pending");
  revalidatePath(`/admin/properties/${id}`);
}
