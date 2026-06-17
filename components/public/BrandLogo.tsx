import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const logoSrc = "/logo.png?v=malik-imperium";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
  priority?: boolean;
};

export function BrandLogo({
  className,
  markClassName,
  textClassName,
  showText = true,
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      <span
        className={cn(
          "relative flex h-12 w-40 shrink-0 overflow-hidden",
          markClassName,
        )}
      >
        <Image
          src={logoSrc}
          alt={`${SITE_NAME} logo`}
          fill
          sizes="180px"
          className="object-contain"
          priority={priority}
          unoptimized
        />
      </span>
      {showText ? (
        <span
          className={cn(
            "truncate text-sm font-black tracking-[0.02em] text-[#07111F] sm:text-lg",
            textClassName,
          )}
        >
          {SITE_NAME}
        </span>
      ) : null}
    </span>
  );
}
