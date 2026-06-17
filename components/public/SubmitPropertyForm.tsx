"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Crown,
  Film,
  ImagePlus,
  MessageCircle,
  Send,
  X,
  XCircle,
} from "lucide-react";
import { submitPropertyAction } from "@/app/actions";
import { propertyPurposes, propertyTypes, sizeUnits } from "@/lib/constants";
import {
  formatFileSize,
  getRoundedMb,
  readClientVideoDuration,
  validateImageFiles,
  validateVideoFile,
  type PropertyMediaLimits,
  type VideoMetadata,
} from "@/lib/media-validation";
import {
  createPromotionWhatsAppUrl,
  type PromotionRequest,
} from "@/lib/whatsapp";
import type { ActionResult } from "@/types/property";

type FormState = Record<string, string>;
type PreviewImage = {
  file: File;
  url: string;
};
type SelectedVideo = {
  file: File;
  metadata: VideoMetadata;
};
type UploadedMedia = {
  imageUrls: string[];
  video?: {
    url: string;
    sizeMb: number;
    durationSeconds: number;
    mimeType: string;
  };
};

const requiredFields = [
  "fullName",
  "contactNumber",
  "whatsappNumber",
  "title",
  "propertyType",
  "purpose",
  "location",
  "address",
  "size",
  "sizeUnit",
  "price",
  "description",
] as const;

const initialActionState: ActionResult = {
  ok: false,
  message: "",
};

function hasUsablePhoneNumber(value?: string) {
  return (value || "").replace(/[^\d]/g, "").length >= 10;
}

export function SubmitPropertyForm({
  adminWhatsAppNumber,
  mediaLimits,
}: {
  adminWhatsAppNumber: string;
  mediaLimits: PropertyMediaLimits;
}) {
  const [values, setValues] = useState<FormState>({});
  const [errors, setErrors] = useState<FormState>({});
  const [actionResult, setActionResult] = useState<ActionResult>(initialActionState);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
  const [promotionRequest, setPromotionRequest] = useState<PromotionRequest | null>(
    null,
  );
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);
  const isSubmitting = isUploading || isPending;

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    setActionResult(initialActionState);
  }

  function validateForm() {
    const nextErrors: FormState = {};

    for (const field of requiredFields) {
      if (!values[field]?.trim()) {
        nextErrors[field] = "This field is required.";
      }
    }

    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (values.contactNumber && !hasUsablePhoneNumber(values.contactNumber)) {
      nextErrors.contactNumber = "Enter a valid contact number.";
    }

    if (values.whatsappNumber && !hasUsablePhoneNumber(values.whatsappNumber)) {
      nextErrors.whatsappNumber = "Enter a valid WhatsApp number.";
    }

    if (values.price && Number(values.price) <= 0) {
      nextErrors.price = "Enter a valid demand amount.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleImages(files: FileList | null) {
    setActionResult(initialActionState);
    const nextFiles = Array.from(files || []);
    const allFiles = [...previews.map((preview) => preview.file), ...nextFiles];
    const error = validateImageFiles(allFiles, mediaLimits);

    if (error) {
      setErrors((current) => ({
        ...current,
        images: error,
      }));
      return;
    }

    setPreviews((current) => [
      ...current,
      ...nextFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
    setErrors((current) => {
      const next = { ...current };
      delete next.images;
      return next;
    });
  }

  function removeImage(url: string) {
    setPreviews((current) => {
      const match = current.find((preview) => preview.url === url);
      if (match) {
        URL.revokeObjectURL(match.url);
      }
      return current.filter((preview) => preview.url !== url);
    });
  }

  async function handleVideo(files: FileList | null) {
    setActionResult(initialActionState);
    const file = files?.[0];

    if (!file) {
      return;
    }

    const baseError = validateVideoFile(file, mediaLimits, 1);

    if (baseError && !baseError.includes("duration")) {
      setErrors((current) => ({ ...current, video: baseError }));
      return;
    }

    try {
      const durationSeconds = await readClientVideoDuration(file);
      const error = validateVideoFile(file, mediaLimits, durationSeconds);

      if (error) {
        setErrors((current) => ({ ...current, video: error }));
        return;
      }

      setSelectedVideo({
        file,
        metadata: {
          sizeMb: getRoundedMb(file.size),
          durationSeconds: Number(durationSeconds.toFixed(2)),
          mimeType: file.type,
        },
      });
      setErrors((current) => {
        const next = { ...current };
        delete next.video;
        return next;
      });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        video:
          error instanceof Error
            ? error.message
            : "Could not read video duration.",
      }));
    }
  }

  function removeVideo() {
    setSelectedVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  }

  async function uploadMedia(): Promise<UploadedMedia> {
    if (previews.length === 0 && !selectedVideo) {
      return { imageUrls: [] };
    }

    const formData = new FormData();
    previews.forEach((preview) => formData.append("images", preview.file));

    if (selectedVideo) {
      formData.set("video", selectedVideo.file);
      formData.set(
        "videoDurationSeconds",
        String(selectedVideo.metadata.durationSeconds),
      );
    }

    const response = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json().catch(() => null)) as
      | UploadedMedia & { ok?: boolean; message?: string }
      | null;

    if (!response.ok || !payload?.ok) {
      throw new Error(
        payload?.message || "Media upload failed. Please try again.",
      );
    }

    return {
      imageUrls: payload.imageUrls || [],
      video: payload.video,
    };
  }

  function resetMediaInputs() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    setPreviews((current) => {
      current.forEach((preview) => URL.revokeObjectURL(preview.url));
      return [];
    });
    setSelectedVideo(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionResult(initialActionState);
    setShowPromotionModal(false);

    if (!validateForm()) {
      return;
    }

    const submittedPromotion: PromotionRequest = {
      title: values.title.trim(),
      location: values.location.trim(),
      price: values.price.trim(),
      sellerName: values.fullName.trim(),
      sellerContact: values.contactNumber.trim(),
    };

    try {
      setIsUploading(true);
      const uploadedMedia = await uploadMedia();
      const formData = new FormData();
      setIsUploading(false);

      Object.entries(values).forEach(([key, value]) => {
        formData.set(key, value);
      });
      uploadedMedia.imageUrls.forEach((url) => formData.append("images", url));

      if (uploadedMedia.video) {
        formData.set("videoUrl", uploadedMedia.video.url);
        formData.set("videoSizeMb", String(uploadedMedia.video.sizeMb));
        formData.set(
          "videoDurationSeconds",
          String(uploadedMedia.video.durationSeconds),
        );
        formData.set("videoMimeType", uploadedMedia.video.mimeType);
      }

      startTransition(async () => {
        const result = await submitPropertyAction(initialActionState, formData);
        setActionResult(result);

        if (result.ok) {
          setPromotionRequest(submittedPromotion);
          setShowPromotionModal(true);
          setValues({});
          resetMediaInputs();
        }
      });
    } catch (error) {
      setIsUploading(false);
      setActionResult({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Media upload failed. Please try again.",
      });
    }
  }

  function openPromotionWhatsApp() {
    if (!promotionRequest) {
      return;
    }

    window.open(
      createPromotionWhatsAppUrl(promotionRequest, adminWhatsAppNumber),
      "_blank",
      "noopener,noreferrer",
    );
    setShowPromotionModal(false);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-6 rounded-md bg-white p-4 shadow-[0_24px_70px_rgba(7,17,31,0.12)] sm:p-5"
      >
        {actionResult.message ? (
          <div
            className={`flex items-start gap-3 rounded-md border p-4 text-sm font-semibold leading-6 ${
              actionResult.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {actionResult.ok ? (
              <CheckCircle2 size={20} aria-hidden="true" />
            ) : (
              <XCircle size={20} aria-hidden="true" />
            )}
            {actionResult.message}
          </div>
        ) : null}

        {hasErrors ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            Please fix the highlighted fields before submitting.
          </div>
        ) : null}

        <SectionTitle title="Seller Details" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name" name="fullName" value={values.fullName} error={errors.fullName} onChange={updateValue} />
          <Field label="Contact Number" name="contactNumber" value={values.contactNumber} error={errors.contactNumber} onChange={updateValue} />
          <Field label="WhatsApp Number" name="whatsappNumber" value={values.whatsappNumber} error={errors.whatsappNumber} onChange={updateValue} />
          <Field label="Email" name="email" type="email" optional value={values.email} error={errors.email} onChange={updateValue} />
        </div>

        <SectionTitle title="Property Details" />
        <Field label="Property Title" name="title" value={values.title} error={errors.title} onChange={updateValue} />
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Property Type" name="propertyType" value={values.propertyType} error={errors.propertyType} onChange={updateValue} options={propertyTypes} />
          <Select label="Purpose" name="purpose" value={values.purpose} error={errors.purpose} onChange={updateValue} options={propertyPurposes} />
          <Field label="Location" name="location" value={values.location} error={errors.location} onChange={updateValue} />
          <Field label="Complete Address" name="address" value={values.address} error={errors.address} onChange={updateValue} />
          <Field label="Property Size" name="size" value={values.size} error={errors.size} onChange={updateValue} />
          <Select label="Size Unit" name="sizeUnit" value={values.sizeUnit} error={errors.sizeUnit} onChange={updateValue} options={sizeUnits} />
          <Field label="Demand / Price" name="price" type="number" value={values.price} error={errors.price} onChange={updateValue} />
          <Field label="Bedrooms" name="bedrooms" type="number" optional value={values.bedrooms} error={errors.bedrooms} onChange={updateValue} />
          <Field label="Bathrooms" name="bathrooms" type="number" optional value={values.bathrooms} error={errors.bathrooms} onChange={updateValue} />
        </div>
        <Textarea label="Description" name="description" value={values.description} error={errors.description} onChange={updateValue} />
        <Textarea label="Features" name="features" optional value={values.features} error={errors.features} onChange={updateValue} placeholder="Lift, parking, corner, west open" />

        <label className="grid gap-2 rounded-md border border-dashed border-[#07111F]/20 bg-[#F7F4EF] p-4">
          <span className="flex items-center gap-2 text-sm font-bold text-[#07111F]">
            <ImagePlus size={18} className="text-[#D6A84F]" aria-hidden="true" />
            Property images
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => handleImages(event.target.files)}
            className="text-base text-[#1F2937] md:text-sm"
          />
          <span className="text-xs font-semibold text-[#1F2937]/62">
            JPG, JPEG, PNG, or WEBP. Max {mediaLimits.maxImages} images,{" "}
            {mediaLimits.maxImageSizeMb}MB each.
          </span>
          {errors.images ? (
            <span className="text-xs font-semibold text-red-700">{errors.images}</span>
          ) : null}
          {previews.length ? (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((preview) => (
                <div
                  key={preview.url}
                  className="relative aspect-[4/3] overflow-hidden rounded-md border border-[#07111F]/10 bg-white"
                >
                  <Image
                    src={preview.url}
                    alt={preview.file.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(preview.url)}
                    className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/92 text-[#07111F] shadow-sm transition hover:bg-red-50 hover:text-red-700"
                    aria-label={`Remove ${preview.file.name}`}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </label>

        <label className="grid gap-2 rounded-md border border-dashed border-[#07111F]/20 bg-[#F7F4EF] p-4">
          <span className="flex items-center gap-2 text-sm font-bold text-[#07111F]">
            <Film size={18} className="text-[#D6A84F]" aria-hidden="true" />
            Property video optional
          </span>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4"
            onChange={(event) => handleVideo(event.target.files)}
            className="text-base text-[#1F2937] md:text-sm"
          />
          <span className="text-xs font-semibold text-[#1F2937]/62">
            MP4 only. Max {mediaLimits.maxVideoSizeMb}MB and{" "}
            {mediaLimits.maxVideoDurationSeconds} seconds.
          </span>
          {errors.video ? (
            <span className="text-xs font-semibold text-red-700">{errors.video}</span>
          ) : null}
          {selectedVideo ? (
            <div className="mt-3 flex flex-col gap-3 rounded-md border border-[#07111F]/10 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#07111F]">
                  {selectedVideo.file.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#1F2937]/62">
                  {formatFileSize(selectedVideo.file.size)} ·{" "}
                  {selectedVideo.metadata.durationSeconds.toFixed(1)} sec · MP4
                </p>
              </div>
              <button
                type="button"
                onClick={removeVideo}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
              >
                <X size={16} aria-hidden="true" />
                Remove
              </button>
            </div>
          ) : null}
        </label>

        <div className="rounded-md border border-[#D6A84F]/30 bg-[#D6A84F]/10 p-4 text-sm font-semibold leading-6 text-[#07111F]">
          Submitted properties are saved with status pending and do not appear
          publicly until admin approval.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#07111F] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1d33] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={18} aria-hidden="true" />
          {isUploading ? "Uploading media..." : isPending ? "Submitting..." : "Submit Property"}
        </button>
      </form>

      {showPromotionModal ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#07111F]/72 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-md bg-white p-5 text-[#07111F] shadow-[0_30px_100px_rgba(0,0,0,0.34)] sm:p-6">
            <button
              type="button"
              onClick={() => setShowPromotionModal(false)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#07111F]/10 text-[#07111F] transition hover:bg-[#07111F]/5"
              aria-label="Close promotion popup"
            >
              <X size={17} aria-hidden="true" />
            </button>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#D6A84F] text-[#07111F] shadow-[0_18px_45px_rgba(214,168,79,0.28)]">
              <Crown size={23} aria-hidden="true" />
            </div>
            <h2 className="mt-5 pr-8 text-2xl font-black leading-tight">
              Want to Rank Your Property Higher?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#1F2937]/70">
              Get your property featured on the homepage and top property cards
              for better visibility.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={openPromotionWhatsApp}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-sm font-black text-[#07111F] transition hover:-translate-y-0.5 hover:bg-[#20bd59]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Yes, Promote My Property
              </button>
              <button
                type="button"
                onClick={() => setShowPromotionModal(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#07111F]/10 px-4 py-3 text-sm font-black text-[#07111F] transition hover:border-[#D6A84F] hover:bg-[#D6A84F]/10"
              >
                No, Maybe Later
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
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
  value = "",
  error,
  type = "text",
  optional,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  error?: string;
  type?: string;
  optional?: boolean;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#07111F]">
        {label}
        {optional ? <span className="font-medium text-[#1F2937]/50"> optional</span> : " *"}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 rounded-md border border-[#07111F]/10 px-3 text-base outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18 md:text-sm"
      />
      {error ? <span className="text-xs font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}

function Select({
  label,
  name,
  value = "",
  error,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  error?: string;
  options: readonly string[];
  onChange: (name: string, value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#07111F]">{label} *</span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 rounded-md border border-[#07111F]/10 bg-white px-3 text-base outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18 md:text-sm"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}

function Textarea({
  label,
  name,
  value = "",
  error,
  optional,
  placeholder,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  error?: string;
  optional?: boolean;
  placeholder?: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#07111F]">
        {label}
        {optional ? <span className="font-medium text-[#1F2937]/50"> optional</span> : " *"}
      </span>
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        rows={5}
        onChange={(event) => onChange(name, event.target.value)}
        className="rounded-md border border-[#07111F]/10 px-3 py-3 text-base outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18 md:text-sm"
      />
      {error ? <span className="text-xs font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}
