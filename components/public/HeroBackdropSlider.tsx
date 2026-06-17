import Image from "next/image";
import { heroPropertySlides } from "@/lib/hero-slides";

export function HeroBackdropSlider() {
  const activeIndex = 0;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {heroPropertySlides.map((slide, index) => (
        <Image
          key={slide.image}
          src={slide.image}
          alt=""
          fill
          sizes="100vw"
          className={`hero-bg-slide object-cover ${
            index === activeIndex ? "hero-bg-slide-active" : ""
          }`}
          unoptimized
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_16%,rgba(214,168,79,0.26),transparent_30%),linear-gradient(90deg,#07111F_0%,rgba(7,17,31,0.86)_38%,rgba(7,17,31,0.42)_72%,rgba(7,17,31,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.16),rgba(7,17,31,0.72))]" />
    </div>
  );
}
