import { cn } from "@/lib/utils";
import { SmoothReveal } from "@/components/public/SmoothReveal";

export function SectionShell({
  children,
  className,
  surface = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  surface?: "paper" | "white" | "navy";
}) {
  const surfaces = {
    paper: "bg-[#F7F4EF]",
    white: "bg-white",
    navy: "bg-[#07111F] text-white",
  };

  return (
    <section className={cn("py-12 sm:py-16 lg:py-18", surfaces[surface], className)}>
      <SmoothReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </SmoothReveal>
    </section>
  );
}
