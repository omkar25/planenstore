"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    src: "/images/slider_1_image.png",
    alt: "PVC Planen nach Maß",
    title: "PVC Planen nach Maß",
    subtitle: "In jeder Farbe und Form konfigurierbar",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 2,
    src: "/images/slider-2.png",
    alt: "Abdeckhauben",
    title: "Abdeckhauben",
    subtitle: "Moderne Terrasse mit Korbsitzen und überdachtem Grill neben großen Glasschiebetüren. Zwei leuchtende Laternen beleuchten den Steinboden und im Inneren ist ein Wohnbereich mit Fernseher sichtbar. Die Terrasse ist von Grün umgeben.",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 3,
    src: "/images/slider-3.png",
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
      className="relative w-full overflow-hidden aspect-3/4 sm:aspect-4/3 md:aspect-video lg:aspect-16/7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Image carousel"
    >
      {/* Slides */}
      <AnimatePresence>
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <Image
            src={slides[current].src}
            alt={slides[current].alt}
            fill
            className="object-cover"
            priority={current === 0}
          />

          {/* Right half container — centers the floating panel */}
          <div className="absolute inset-0 flex items-end sm:items-center justify-center md:inset-y-0 md:right-0 md:left-auto md:w-1/2 md:justify-start px-4 sm:px-6 md:px-12 pb-16 sm:pb-0">

            {/* Floating dark panel — slides in from right */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col items-start justify-center rounded-2xl px-5 sm:px-8 md:px-12 py-5 sm:py-8 md:py-10 backdrop-blur-sm max-w-[90vw] sm:max-w-none"
              style={{ background: "rgba(20, 20, 20, 0.65)" }}
            >
              {/* Title */}
              <h2
                className="mb-2 sm:mb-3 font-light tracking-wide text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
              >
                {slides[current].title}
              </h2>

              {/* Subtitle */}
              <p
                className="mb-4 sm:mb-8 font-light text-white/80 text-xs sm:text-sm md:text-base line-clamp-3 sm:line-clamp-none"
              >
                {slides[current].subtitle}
              </p>

              {/* CTA button */}
              <a
                href={slides[current].ctaHref}
                className="inline-flex items-center gap-2 rounded-lg border border-white/70 px-4 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:bg-white hover:text-black"
              >
                {slides[current].ctaLabel}
                <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev arrow */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 transition hover:text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={1.5} />
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 transition hover:text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={1.5} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 rounded-full border-2 transition-all duration-300",
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