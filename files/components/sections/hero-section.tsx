import type { Slider } from "@/types/api";
import { HeroBannerCarousel } from "@/components/sections/hero-banner-carousel";

export function HeroSection({ sliders }: { sliders: Slider[] }) {
  return (
    <section className="bg-transparent py-4 md:py-5">
      <div className="mx-auto max-w-7xl px-4">
        <HeroBannerCarousel sliders={sliders} />
      </div>
    </section>
  );
}
