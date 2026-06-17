import { cn } from "@/lib/utils";

export function SmoothReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("reveal-on-scroll is-visible", className)}>{children}</div>;
}
