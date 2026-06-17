"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SITE_NAME } from "@/lib/constants";

const introKey = "malik-imperium-intro-seen";

export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(introKey)) {
      const hideTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(hideTimer);
    }

    sessionStorage.setItem(introKey, "true");

    const leaveTimer = window.setTimeout(() => setLeaving(true), 2000);
    const hideTimer = window.setTimeout(() => setVisible(false), 2500);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`intro-loader fixed inset-0 z-[100] grid place-items-center bg-[#07111F] px-5 text-white ${
        leaving ? "intro-loader-exit" : ""
      }`}
    >
      <div className="intro-loader-content text-center">
        <div className="relative mx-auto h-32 w-64 overflow-hidden rounded-md border border-[#D6A84F]/35 bg-white/8 shadow-[0_0_90px_rgba(214,168,79,0.34)] backdrop-blur sm:h-40 sm:w-80">
          <Image
            src="/logo.png?v=malik-imperium"
            alt={`${SITE_NAME} logo`}
            fill
            sizes="320px"
            className="object-contain p-3"
            priority
            unoptimized
          />
        </div>
        <p className="mt-7 text-3xl font-black tracking-[0.12em] text-white sm:text-5xl">
          {SITE_NAME}
        </p>
        <div className="mx-auto mt-6 h-px w-64 max-w-full overflow-hidden rounded-full bg-white/12">
          <span className="intro-loader-line block h-full w-1/2 rounded-full bg-[#D6A84F]" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-white/52">
          Karachi Real Estate
        </p>
      </div>
    </div>
  );
}
