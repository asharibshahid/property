"use client";

import { useMemo, useState } from "react";
import { MessageCircle, SearchCheck } from "lucide-react";
import { propertyPurposes, propertyTypes } from "@/lib/constants";
import { createCustomPropertyRequestWhatsAppUrl } from "@/lib/whatsapp";

type RequestValues = {
  name: string;
  phone: string;
  propertyType: string;
  location: string;
  budget: string;
  purpose: string;
  message: string;
};

const initialValues: RequestValues = {
  name: "",
  phone: "",
  propertyType: "",
  location: "",
  budget: "",
  purpose: "",
  message: "",
};

function hasUsablePhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "").length >= 10;
}

export function CustomPropertyRequestBar({
  adminWhatsAppNumber,
  compact = false,
  locations = [],
}: {
  adminWhatsAppNumber: string;
  compact?: boolean;
  locations?: string[];
}) {
  const [values, setValues] = useState<RequestValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof RequestValues, string>>>({});

  const requiredFields = useMemo(
    () => Object.keys(initialValues) as Array<keyof RequestValues>,
    [],
  );

  function updateValue(name: keyof RequestValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function validate() {
    const nextErrors: Partial<Record<keyof RequestValues, string>> = {};

    for (const field of requiredFields) {
      if (!values[field].trim()) {
        nextErrors[field] = "Required";
      }
    }

    if (values.phone && !hasUsablePhoneNumber(values.phone)) {
      nextErrors.phone = "Enter a valid phone number";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const url = createCustomPropertyRequestWhatsAppUrl(
      {
        name: values.name.trim(),
        phone: values.phone.trim(),
        propertyType: values.propertyType,
        location: values.location.trim(),
        budget: values.budget.trim(),
        purpose: values.purpose,
        message: values.message.trim(),
      },
      adminWhatsAppNumber,
    );

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      className={`relative overflow-hidden rounded-md bg-[#07111F] p-4 text-white shadow-[0_28px_90px_rgba(7,17,31,0.22)] sm:p-5 ${
        compact ? "" : "lg:p-6"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(214,168,79,0.3),transparent_28%),radial-gradient(circle_at_88%_30%,rgba(255,255,255,0.1),transparent_24%)]" />
      <div className="relative grid gap-5 xl:grid-cols-[0.7fr_1.3fr] xl:items-center">
        <div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#D6A84F] text-[#07111F] shadow-[0_18px_45px_rgba(214,168,79,0.25)]">
            <SearchCheck size={21} aria-hidden="true" />
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#D6A84F]">
            Custom property request
          </p>
          <h2 className="mt-2 max-w-[12ch] break-words text-2xl font-black leading-tight sm:max-w-none sm:text-3xl">
            Can&apos;t find the right property?
          </h2>
          <p className="mt-3 max-w-[32ch] text-sm leading-6 text-white/70 sm:max-w-none">
            Send your requirement to our admin WhatsApp and we&apos;ll guide you
            with available Karachi options.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Field
              label="Name"
              name="name"
              value={values.name}
              error={errors.name}
              onChange={updateValue}
            />
            <Field
              label="Phone / WhatsApp"
              name="phone"
              value={values.phone}
              error={errors.phone}
              onChange={updateValue}
            />
            <Select
              label="Property Type"
              name="propertyType"
              value={values.propertyType}
              error={errors.propertyType}
              onChange={updateValue}
              options={propertyTypes}
            />
            {locations.length ? (
              <Select
                label="Preferred Location"
                name="location"
                value={values.location}
                error={errors.location}
                onChange={updateValue}
                options={locations}
              />
            ) : (
              <Field
                label="Preferred Location"
                name="location"
                value={values.location}
                error={errors.location}
                onChange={updateValue}
              />
            )}
            <Field
              label="Budget Range"
              name="budget"
              value={values.budget}
              error={errors.budget}
              placeholder="e.g. PKR 2 Cr"
              onChange={updateValue}
            />
            <Select
              label="Purpose"
              name="purpose"
              value={values.purpose}
              error={errors.purpose}
              onChange={updateValue}
              options={propertyPurposes}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/58">
                Requirement
              </span>
              <textarea
                value={values.message}
                onChange={(event) => updateValue("message", event.target.value)}
                placeholder="Area, bedrooms, floor preference, possession, or any special need"
                rows={compact ? 3 : 2}
                className="min-h-24 rounded-md border border-white/12 bg-white px-3 py-3 text-base text-[#07111F] outline-none transition placeholder:text-[#1F2937]/38 focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/20 lg:min-h-12 lg:text-sm"
              />
              {errors.message ? (
                <span className="text-xs font-semibold text-[#ffd1d1]">
                  {errors.message}
                </span>
              ) : null}
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 self-end rounded-md bg-[#D6A84F] px-5 text-sm font-black text-[#07111F] shadow-[0_20px_50px_rgba(214,168,79,0.24)] transition hover:-translate-y-0.5 hover:bg-[#e4ba62]"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Send Request on WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  value,
  error,
  placeholder,
  onChange,
}: {
  label: string;
  name: keyof RequestValues;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (name: keyof RequestValues, value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/58">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 rounded-md border border-white/12 bg-white px-3 text-base text-[#07111F] outline-none transition placeholder:text-[#1F2937]/38 focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/20 lg:text-sm"
      />
      {error ? (
        <span className="text-xs font-semibold text-[#ffd1d1]">{error}</span>
      ) : null}
    </label>
  );
}

function Select({
  label,
  name,
  value,
  error,
  options,
  onChange,
}: {
  label: string;
  name: keyof RequestValues;
  value: string;
  error?: string;
  options: readonly string[];
  onChange: (name: keyof RequestValues, value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/58">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 rounded-md border border-white/12 bg-white px-3 text-base text-[#07111F] outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/20 lg:text-sm"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-xs font-semibold text-[#ffd1d1]">{error}</span>
      ) : null}
    </label>
  );
}
