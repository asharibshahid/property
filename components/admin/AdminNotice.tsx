import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

type AdminNoticeProps = {
  message?: string;
  type?: string;
};

export function AdminNotice({ message, type }: AdminNoticeProps) {
  if (!message) {
    return null;
  }

  const isError = type === "error";
  const isSuccess = type === "success";
  const styles = isError
    ? "border-red-200 bg-red-50 text-red-800"
    : isSuccess
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-[#D6A84F]/35 bg-[#D6A84F]/10 text-[#07111F]";
  const icon = isError ? (
    <AlertTriangle size={18} aria-hidden="true" />
  ) : isSuccess ? (
    <CheckCircle2 size={18} aria-hidden="true" />
  ) : (
    <Info size={18} aria-hidden="true" />
  );

  return (
    <div
      className={`mb-5 flex items-start gap-3 rounded-md border p-4 text-sm font-semibold leading-6 ${styles}`}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{message}</span>
    </div>
  );
}
