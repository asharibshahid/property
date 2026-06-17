import {
  getApprovedProperties,
  getFeaturedProperties as getRankedFeaturedProperties,
  getPropertyById,
} from "@/lib/properties";
import { getUniqueLocations } from "@/lib/utils";
import type { PropertyFilters } from "@/types/property";

export async function getFeaturedProperties() {
  return getRankedFeaturedProperties(3);
}

export async function getProperties(filters: PropertyFilters = {}) {
  return getApprovedProperties(filters);
}

export async function getAvailableLocations() {
  return getUniqueLocations(await getApprovedProperties());
}

export { getPropertyById };
