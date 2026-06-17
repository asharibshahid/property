import type { PropertyPurpose, PropertyType } from "@/types/property";

export const SITE_NAME = "MALIK IMPERIUM ESTATES";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const ADMIN_WHATSAPP_NUMBER =
  process.env.ADMIN_WHATSAPP_NUMBER || "923000000000";
export const PROPERTY_IMAGES_BUCKET =
  process.env.PROPERTY_IMAGES_BUCKET || "property-images";

function positiveNumberEnv(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const propertyMediaLimits = {
  maxImages: positiveNumberEnv("MAX_PROPERTY_IMAGES", 5),
  maxImageSizeMb: positiveNumberEnv("MAX_PROPERTY_IMAGE_SIZE_MB", 5),
  maxVideoSizeMb: positiveNumberEnv("MAX_PROPERTY_VIDEO_SIZE_MB", 50),
  maxVideoDurationSeconds: positiveNumberEnv(
    "MAX_PROPERTY_VIDEO_DURATION_SECONDS",
    120,
  ),
};

export const propertyTypes: PropertyType[] = [
  "Flat",
  "House",
  "Plot",
  "Portion",
  "Shop",
  "Office",
  "Commercial",
];

export const propertyPurposes: PropertyPurpose[] = ["Sale", "Rent"];
export const propertyStatuses = ["approved", "pending", "rejected"] as const;
export const sizeUnits = ["Sq Ft", "Sq Yards", "Marla", "Kanal"] as const;

export const popularAreas = [
  "DHA",
  "Clifton",
  "Bahria Town Karachi",
  "Gulshan-e-Iqbal",
  "Gulistan-e-Johar",
  "North Nazimabad",
  "Scheme 33",
  "Malir",
] as const;

export const categoryCards = [
  {
    label: "Flats",
    href: "/properties?propertyType=Flat",
    stat: "Apartments",
  },
  {
    label: "Houses",
    href: "/properties?propertyType=House",
    stat: "Family homes",
  },
  {
    label: "Plots",
    href: "/properties?propertyType=Plot",
    stat: "Residential land",
  },
  {
    label: "Portions",
    href: "/properties?propertyType=Portion",
    stat: "Upper & lower",
  },
  {
    label: "Shops",
    href: "/properties?propertyType=Shop",
    stat: "Retail spaces",
  },
  {
    label: "Commercial",
    href: "/properties?propertyType=Commercial",
    stat: "Offices & plazas",
  },
];
