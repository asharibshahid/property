"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PropertyImageGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [activeImage, setActiveImage] = useState(images[0] || "/window.svg");

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#07111F] shadow-[0_24px_70px_rgba(7,17,31,0.18)]">
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/45 via-transparent to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(image)}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-md border bg-[#07111F] transition hover:-translate-y-0.5",
              activeImage === image ? "border-[#D6A84F]" : "border-[#07111F]/10",
            )}
            aria-label={`Show property image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              sizes="140px"
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

    </div>
  );
}
