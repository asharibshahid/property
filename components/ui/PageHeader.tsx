import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 max-w-3xl", className)}>
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#D6A84F]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 max-w-[13ch] break-words text-3xl font-black leading-tight text-[#07111F] sm:max-w-full sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-[33ch] text-base leading-7 text-[#1F2937]/70 sm:max-w-full">
          {description}
        </p>
      ) : null}
    </div>
  );
}
