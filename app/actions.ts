"use server";

import { redirect } from "next/navigation";
import {
  approveProperty,
  createPendingProperty,
  deleteProperty,
  rejectProperty,
  updateProperty,
} from "@/lib/properties";
import {
  clearAdminSession,
  createAdminSession,
  requireAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-session";
import type {
  ActionResult,
  AdminPropertyUpdateInput,
  PendingPropertyInput,
  PropertyPurpose,
  PropertyStatus,
  SizeUnit,
} from "@/types/property";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function splitFeatures(value: string) {
  return value
    .split(/[\n,]/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function getSafeAdminReturnTo(formData: FormData, fallback = "/admin/properties") {
  const returnTo = text(formData, "returnTo") || fallback;

  if (!returnTo.startsWith("/admin")) {
    return fallback;
  }

  return returnTo;
}

function redirectWithAdminResult(returnTo: string, result: ActionResult) {
  const [pathname, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);
  params.set("noticeType", result.ok ? "success" : "error");
  params.set("notice", result.message);

  redirect(`${pathname}?${params.toString()}`);
}

async function requireAdminAction() {
  const admin = await requireAdminSession();

  if (!admin.ok) {
    redirect(admin.reason === "config" ? "/admin/login?error=config" : "/admin/login");
  }

  return admin.session;
}

export async function submitPropertyAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const price = Number(text(formData, "price"));

  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, message: "Enter a valid demand/price." };
  }

  const images = formData
    .getAll("images")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  const data: PendingPropertyInput = {
    title: text(formData, "title"),
    property_type: text(formData, "propertyType"),
    purpose: text(formData, "purpose") as PropertyPurpose,
    location: text(formData, "location"),
    address: optionalText(formData, "address"),
    size: text(formData, "size"),
    size_unit: text(formData, "sizeUnit") as SizeUnit,
    price,
    bedrooms: optionalNumber(formData, "bedrooms"),
    bathrooms: optionalNumber(formData, "bathrooms"),
    description: optionalText(formData, "description"),
    features: splitFeatures(text(formData, "features")),
    images,
    video_url: optionalText(formData, "videoUrl"),
    video_size_mb: optionalNumber(formData, "videoSizeMb"),
    video_duration_seconds: optionalNumber(formData, "videoDurationSeconds"),
    video_mime_type: optionalText(formData, "videoMimeType"),
    seller_name: text(formData, "fullName"),
    seller_contact: text(formData, "contactNumber"),
    seller_whatsapp: optionalText(formData, "whatsappNumber"),
    seller_email: optionalText(formData, "email"),
  };

  const required = [
    data.title,
    data.property_type,
    data.purpose,
    data.location,
    data.size,
    data.size_unit,
    data.seller_name,
    data.seller_contact,
    data.seller_whatsapp,
  ];

  if (required.some((value) => !value)) {
    return { ok: false, message: "Please complete all required fields." };
  }

  return createPendingProperty(data);
}

export async function loginAdminAction(formData: FormData) {
  const username = text(formData, "username");
  const password = text(formData, "password");
  const result = validateAdminCredentials(username, password);

  if (!result.ok) {
    redirect(
      result.reason === "config"
        ? "/admin/login?error=config"
        : "/admin/login?error=credentials",
    );
  }

  await createAdminSession(result.username);

  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function approvePropertyAction(id: string): Promise<ActionResult> {
  await requireAdminAction();
  return approveProperty(id);
}

export async function approvePropertyFormAction(
  id: string,
  formData: FormData,
): Promise<void> {
  const returnTo = getSafeAdminReturnTo(formData);
  const result = await approvePropertyAction(id);
  redirectWithAdminResult(returnTo, result);
}

export async function rejectPropertyAction(
  id: string,
  formData?: FormData,
): Promise<ActionResult> {
  await requireAdminAction();
  return rejectProperty(id, formData ? text(formData, "rejectionReason") : undefined);
}

export async function rejectPropertyFormAction(
  id: string,
  formData: FormData,
): Promise<void> {
  const returnTo = getSafeAdminReturnTo(formData);
  const result = await rejectPropertyAction(id, formData);
  redirectWithAdminResult(returnTo, result);
}

export async function deletePropertyAction(id: string): Promise<ActionResult> {
  await requireAdminAction();
  const result = await deleteProperty(id);
  return result;
}

export async function deletePropertyFormAction(
  id: string,
  formData: FormData,
): Promise<void> {
  const returnTo = getSafeAdminReturnTo(formData);
  const result = await deletePropertyAction(id);
  redirectWithAdminResult(returnTo, result);
}

export async function updatePropertyAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdminAction();

  const price = Number(text(formData, "price"));
  const data: AdminPropertyUpdateInput = {
    title: text(formData, "title"),
    property_type: text(formData, "propertyType"),
    purpose: text(formData, "purpose") as PropertyPurpose,
    location: text(formData, "location"),
    address: optionalText(formData, "address"),
    size: text(formData, "size"),
    size_unit: text(formData, "sizeUnit") as SizeUnit,
    price,
    bedrooms: optionalNumber(formData, "bedrooms"),
    bathrooms: optionalNumber(formData, "bathrooms"),
    description: optionalText(formData, "description"),
    features: splitFeatures(text(formData, "features")),
    video_url: optionalText(formData, "videoUrl"),
    video_size_mb: optionalNumber(formData, "videoSizeMb"),
    video_duration_seconds: optionalNumber(formData, "videoDurationSeconds"),
    video_mime_type: optionalText(formData, "videoMimeType"),
    status: text(formData, "status") as PropertyStatus,
    is_featured: checkbox(formData, "isFeatured"),
    featured_rank: optionalNumber(formData, "featuredRank"),
    seller_name: text(formData, "sellerName"),
    seller_contact: text(formData, "sellerContact"),
    seller_whatsapp: optionalText(formData, "sellerWhatsapp"),
    seller_email: optionalText(formData, "sellerEmail"),
    admin_notes: optionalText(formData, "adminNotes"),
    rejection_reason: optionalText(formData, "rejectionReason"),
  };

  if (checkbox(formData, "clearVideo")) {
    data.video_url = null;
    data.video_size_mb = null;
    data.video_duration_seconds = null;
    data.video_mime_type = null;
  }

  return updateProperty(id, data);
}

export async function updatePropertyFormAction(
  id: string,
  formData: FormData,
): Promise<void> {
  const returnTo = getSafeAdminReturnTo(formData, `/admin/properties/${id}`);
  const result = await updatePropertyAction(id, formData);
  redirectWithAdminResult(returnTo, result);
}
