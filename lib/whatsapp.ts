import { formatPrice, getPropertyReference } from "@/lib/utils";
import type { Property } from "@/types/property";

export type CustomPropertyRequest = {
  name: string;
  phone: string;
  propertyType: string;
  location: string;
  budget: string;
  purpose: string;
  message: string;
};

export type PromotionRequest = {
  title: string;
  location: string;
  price: string;
  sellerName: string;
  sellerContact: string;
};

export function normalizeWhatsAppNumber(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  if (digits.startsWith("0")) {
    return `92${digits.slice(1)}`;
  }

  return digits;
}

export function createWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(
    message,
  )}`;
}

export function createPropertyWhatsAppMessage(property: Property) {
  return [
    "Hi, I am interested in this property:",
    `Property Ref: ${getPropertyReference(property.id)}`,
    `Title: ${property.title}`,
    `Location: ${property.location}`,
    `Price: ${formatPrice(property.price, property.purpose)}`,
    "Please share more details.",
  ].join("\n");
}

export function createPropertyWhatsAppUrl(property: Property, adminNumber: string) {
  return createWhatsAppUrl(adminNumber, createPropertyWhatsAppMessage(property));
}

export function createCustomPropertyRequestMessage(data: CustomPropertyRequest) {
  return [
    "Hi, I need a custom property in Karachi.",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Property Type: ${data.propertyType}`,
    `Preferred Location: ${data.location}`,
    `Budget: ${data.budget}`,
    `Purpose: ${data.purpose}`,
    `Requirement: ${data.message}`,
    "",
    "Please contact me with available options.",
  ].join("\n");
}

export function createCustomPropertyRequestWhatsAppUrl(
  data: CustomPropertyRequest,
  adminNumber: string,
) {
  return createWhatsAppUrl(adminNumber, createCustomPropertyRequestMessage(data));
}

export function createPromotionRequestMessage(data: PromotionRequest) {
  return [
    "Hi, I have submitted a property on MALIK IMPERIUM ESTATES and I want to rank/promote it.",
    "",
    `Property Title: ${data.title}`,
    `Location: ${data.location}`,
    `Demand: ${data.price}`,
    `Seller Name: ${data.sellerName}`,
    `Seller Contact: ${data.sellerContact}`,
    "",
    "Please guide me about featured/ranking options.",
  ].join("\n");
}

export function createPromotionWhatsAppUrl(
  data: PromotionRequest,
  adminNumber: string,
) {
  return createWhatsAppUrl(adminNumber, createPromotionRequestMessage(data));
}
