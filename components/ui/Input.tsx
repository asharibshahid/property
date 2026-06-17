import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-[#07111F]/10 bg-white px-3 text-sm text-[#1F2937] outline-none transition placeholder:text-[#1F2937]/42 focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/20",
        className,
      )}
      {...props}
    />
  );
}
