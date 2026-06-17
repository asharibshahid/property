export type PropertyStatus = "approved" | "pending" | "rejected";

export type PropertyType =
  | "Flat"
  | "House"
  | "Plot"
  | "Portion"
  | "Shop"
  | "Office"
  | "Commercial";

export type PropertyPurpose = "Sale" | "Rent";

export type SizeUnit = "Sq Ft" | "Sq Yards" | "Marla" | "Kanal";

export type DbProperty = {
  id: string;
  title: string;
  property_type: string;
  purpose: PropertyPurpose;
  location: string;
  address: string | null;
  size: string;
  size_unit: SizeUnit | string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string | null;
  features: string[] | null;
  images: string[] | null;
  video_url?: string | null;
  video_size_mb?: number | null;
  video_duration_seconds?: number | null;
  video_mime_type?: string | null;
  status: PropertyStatus;
  is_featured: boolean | null;
  featured_rank: number | null;
  seller_name: string;
  seller_contact: string;
  seller_whatsapp: string | null;
  seller_email: string | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbPublicProperty = Omit<
  DbProperty,
  | "seller_name"
  | "seller_contact"
  | "seller_whatsapp"
  | "seller_email"
  | "admin_notes"
  | "rejection_reason"
>;

export type PublicProperty = {
  id: string;
  title: string;
  location: string;
  area: string;
  address: string;
  price: number;
  size: string;
  sizeUnit: SizeUnit;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  isFeatured: boolean;
  featuredRank?: number;
  image: string;
  images: string[];
  videoUrl?: string;
  videoSizeMb?: number;
  videoDurationSeconds?: number;
  videoMimeType?: string;
  description: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  approvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProperty = PublicProperty & {
  sellerName: string;
  sellerContact: string;
  sellerWhatsapp: string;
  sellerEmail?: string;
  adminNotes?: string;
  rejectionReason?: string;
};

export type Property = PublicProperty;

export type PropertyFilters = {
  location?: string;
  propertyType?: string;
  purpose?: string;
  priceRange?: string;
  size?: string;
};

export type PendingPropertyInput = {
  title: string;
  property_type: string;
  purpose: PropertyPurpose;
  location: string;
  address?: string | null;
  size: string;
  size_unit: SizeUnit;
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  description?: string | null;
  features?: string[];
  images?: string[];
  video_url?: string | null;
  video_size_mb?: number | null;
  video_duration_seconds?: number | null;
  video_mime_type?: string | null;
  is_featured?: boolean;
  featured_rank?: number | null;
  seller_name: string;
  seller_contact: string;
  seller_whatsapp?: string | null;
  seller_email?: string | null;
};

export type AdminPropertyUpdateInput = Partial<
  Omit<PendingPropertyInput, "images"> & {
    status: PropertyStatus;
    is_featured: boolean;
    featured_rank: number | null;
    admin_notes: string | null;
    rejection_reason: string | null;
  }
>;

export type ActionResult = {
  ok: boolean;
  message: string;
};
