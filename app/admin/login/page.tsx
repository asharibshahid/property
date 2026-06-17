import Link from "next/link";
import { KeyRound } from "lucide-react";
import { loginAdminAction } from "@/app/actions";
import { SITE_NAME } from "@/lib/constants";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const error = single(params.error);

  return (
    <main className="grid min-h-screen place-items-center bg-[#07111F] px-4 py-10">
      <div className="w-full max-w-md rounded-md border border-white/10 bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#07111F] text-[#D6A84F]">
            <KeyRound size={22} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-black text-[#07111F]">Admin Login</h1>
            <p className="text-sm text-[#1F2937]/62">{SITE_NAME}</p>
          </div>
        </div>
        <p className="mt-5 rounded-md border border-[#D6A84F]/30 bg-[#D6A84F]/10 p-3 text-sm font-semibold leading-6 text-[#07111F]">
          Use the server env credentials: ADMIN_USERNAME and ADMIN_PASSWORD.
          This is not Supabase email login.
        </p>
        {error ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error === "config"
              ? "Admin username, password, or session secret is missing in .env."
              : "Login failed. Use the username/email and password from your .env file."}
          </div>
        ) : null}
        <form action={loginAdminAction} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#07111F]">Username / Email</span>
            <input
              name="username"
              type="text"
              required
              placeholder="admin or admin@example.com"
              className="h-12 rounded-md border border-[#07111F]/10 px-3 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#07111F]">Password</span>
            <input
              name="password"
              type="password"
              required
              placeholder="Admin password"
              className="h-12 rounded-md border border-[#07111F]/10 px-3 text-sm outline-none transition focus:border-[#D6A84F] focus:ring-4 focus:ring-[#D6A84F]/18"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#07111F] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1d33]"
          >
            Enter Dashboard
          </button>
          <Link href="/" className="text-center text-sm font-bold text-[#07111F]">
            Back to site
          </Link>
        </form>
      </div>
    </main>
  );
}
