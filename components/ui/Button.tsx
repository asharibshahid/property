import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-[#07111F] text-white shadow-[0_16px_34px_rgba(7,17,31,0.22)] hover:bg-[#102033]",
  secondary:
    "bg-[#D6A84F] text-[#07111F] shadow-[0_16px_34px_rgba(214,168,79,0.22)] hover:bg-[#c99b42]",
  ghost:
    "border border-[#07111F]/10 bg-white/80 text-[#07111F] hover:border-[#D6A84F] hover:bg-white",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
