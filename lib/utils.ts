import type { AdminProperty, Property, PropertyFilters } from "@/types/property";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number, purpose?: string) {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)} Crore${
      purpose === "Rent" ? " / month" : ""
    }`;
  }

  if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} Lac${
      purpose === "Rent" ? " / month" : ""
    }`;
  }

  return `PKR ${new Intl.NumberFormat("en-PK").format(price)}${
    purpose === "Rent" ? " / month" : ""
  }`;
}

export function getPropertyReference(id: string) {
  let hash = 0;

  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 10000;
  }

  return `MIE-${hash.toString().padStart(4, "0")}`;
}

export function getUniqueLocations(properties: Pick<Property, "location">[]) {
  return Array.from(
    new Set(
      properties
        .map((property) => property.location.trim())
        .filter(Boolean),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

export function filterAdminProperties(
  properties: AdminProperty[],
  query?: string,
) {
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) {
    return properties;
  }

  return properties.filter((property) =>
    [
      getPropertyReference(property.id),
      property.id,
      property.title,
      property.location,
      property.area,
      property.propertyType,
      property.purpose,
      property.status,
      property.sellerName,
      property.sellerContact,
      property.sellerWhatsapp,
      property.sellerEmail || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function getApprovedProperties(properties: Property[]) {
  return properties.filter((property) => property.status === "approved");
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters,
) {
  return getApprovedProperties(properties).filter((property) => {
    const matchesLocation =
      !filters.location || property.location === filters.location;
    const matchesType =
      !filters.propertyType || property.propertyType === filters.propertyType;
    const matchesPurpose = !filters.purpose || property.purpose === filters.purpose;
    const matchesSize =
      !filters.size ||
      `${property.size} ${property.sizeUnit}`
        .toLowerCase()
        .includes(filters.size.toLowerCase());
    const matchesPrice = matchesPriceRange(property.price, filters.priceRange);

    return (
      matchesLocation &&
      matchesType &&
      matchesPurpose &&
      matchesSize &&
      matchesPrice
    );
  });
}

function matchesPriceRange(price: number, range?: string) {
  if (!range) {
    return true;
  }

  const [minValue, maxValue] = range.split("-");
  const min = minValue === "" ? Number.NaN : Number(minValue);
  const max = maxValue === "" ? Number.NaN : Number(maxValue);

  if (Number.isFinite(min) && Number.isFinite(max)) {
    return price >= min && price <= max;
  }

  if (Number.isFinite(min)) {
    return price >= min;
  }

  return true;
}
