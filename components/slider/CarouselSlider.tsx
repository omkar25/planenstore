"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    id: 1,
    src: "/images/pvc-planen-slider1-schmal.jpg",
    alt: "PVC Planen nach Maß",
    title: "PVC Planen nach Maß",
    subtitle: "In jeder Farbe und Form konfigurierbar",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 2,
    src: "/images/Slider2_Abdeckhauben-2020.jpg",
    alt: "Abdeckhauben",
    title: "Abdeckhauben",
    subtitle: "Moderne Terrasse mit Korbsitzen und überdachtem Grill neben großen Glasschiebetüren. Zwei leuchtende Laternen beleuchten den Steinboden und im Inneren ist ein Wohnbereich mit Fernseher sichtbar. Die Terrasse ist von Grün umgeben.",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 3,
    src: "/images/aufblasbare-poolplane-slider3.jpg",
    alt: "Aufblasbare Poolplane",
    title: "Aufblasbare Poolplane",
    subtitle: "Premium Qualität direkt vom Hersteller.",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  }
];

interface CarouselSliderProps {
  autoPlay?: boolean;
  interval?: number;
}

export default function CarouselSlider({
  autoPlay = true,
  interval = 5000,
}: CarouselSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }, []);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16/6" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Image carousel"
    >
      {/* Slides track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.id} className="relative h-full min-w-full">

            {/* Background image */}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />

            {/* Right half container — centers the floating panel */}
            <div className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-start px-12">

              {/* Floating dark panel — shrinks to content height */}
              <div
                className="flex flex-col items-start justify-center px-12 py-10"
                style={{ background: "rgba(20, 20, 20, 0.65)" }}
              >
                {/* Title */}
                <h2
                  className="mb-3 font-light tracking-wide text-white"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  {slide.title}
                </h2>

                {/* Subtitle */}
                <p
                  className="mb-8 font-light text-white/80"
                  style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
                >
                  {slide.subtitle}
                </p>

                {/* CTA button */}
                
                 <a href={slide.ctaHref}
                  className="inline-flex items-center gap-2 border border-white/70 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:bg-white hover:text-black"
                >
                  {slide.ctaLabel}
                  {/* Red accent square matching screenshot */}
                  <span className="inline-block h-3 w-3 bg-red-600" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev arrow */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 transition hover:text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 transition hover:text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-3.5 w-3.5 rounded-full border-2 transition-all duration-300",
              i === current
                ? "border-white bg-white"
                : "border-white/60 bg-transparent"
            )}
          />
        ))}
      </div>
    </div>
  );
}