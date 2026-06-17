"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, PlusCircle, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

const links = [
  { label: "Properties", href: "/properties" },
  { label: "List Property", href: "/submit-property" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const mobileLinks = links.filter((link) => link.href !== "/submit-property");

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/78 shadow-[0_12px_40px_rgba(7,17,31,0.08)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <BrandLogo
            priority
            showText={false}
            className="max-w-[205px] sm:max-w-none"
            markClassName="h-12 w-44 sm:h-[52px] sm:w-52"
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[#1F2937] transition hover:bg-[#07111F]/5 hover:text-[#07111F]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/submit-property"
            className="hidden shrink-0 items-center justify-center gap-2 rounded-md bg-[#D6A84F] px-3 py-2 text-sm font-bold text-[#07111F] shadow-[0_14px_28px_rgba(214,168,79,0.26)] transition hover:-translate-y-0.5 hover:bg-[#c99b42] sm:inline-flex"
          >
            <PlusCircle size={17} aria-hidden="true" />
            List
          </Link>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#07111F]/10 bg-white text-[#07111F] shadow-sm transition hover:border-[#D6A84F] hover:bg-[#D6A84F]/10 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <div
        className={`overflow-hidden border-t border-[#07111F]/8 bg-white/90 shadow-[0_28px_70px_rgba(7,17,31,0.1)] backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? "max-h-[430px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="grid gap-1 rounded-md border border-[#07111F]/8 bg-white/94 p-2 shadow-[0_20px_55px_rgba(7,17,31,0.1)]">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="mb-1 rounded-md bg-[#F7F4EF] px-3 py-3"
            >
              <BrandLogo showText={false} markClassName="h-14 w-48" />
            </Link>
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3.5 text-base font-bold text-[#07111F] transition hover:bg-[#07111F]/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit-property"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#07111F] px-4 py-3.5 text-base font-black text-white shadow-[0_16px_36px_rgba(7,17,31,0.18)] transition hover:bg-[#0d1d33]"
            >
              <PlusCircle size={18} aria-hidden="true" />
              List Your Property
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
