import Link from "next/link";
import { MapPin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-[#07111F]/10 bg-[#07111F] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex">
            <BrandLogo
              showText={false}
              markClassName="h-16 w-56"
            />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            A simple premium Karachi real estate experience for browsing verified
            listings and preparing seller submissions for admin approval.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#D6A84F]">Explore</p>
          <div className="mt-4 grid gap-2 text-sm text-white/72">
            <Link href="/properties" className="hover:text-white">
              Properties
            </Link>
            <Link href="/submit-property" className="hover:text-white">
              List Property
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              Admin Login
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#D6A84F]">Karachi Focus</p>
          <div className="mt-4 grid gap-3 text-sm text-white/72">
            <span className="flex items-center gap-2">
              <MapPin size={16} aria-hidden="true" />
              Karachi, Pakistan
            </span>
            <span>Flats, houses, plots, shops, portions, and commercial spaces.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
