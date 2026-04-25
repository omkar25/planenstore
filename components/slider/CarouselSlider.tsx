"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedImage from "@/components/shared/ProtectedImage";
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
    src: "/images/slider_1.JPG",
    alt: "PVC Planen nach Maß",
    title: "PVC Planen nach Maß",
    subtitle: "In jeder Farbe und Form konfigurierbar",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 2,
    src: "/images/slider2.JPG",
    alt: "Abdeckhauben",
    title: "Abdeckhauben",
    subtitle: "Moderne Terrasse mit Korbsitzen und überdachtem Grill neben großen Glasschiebetüren. Zwei leuchtende Laternen beleuchten den Steinboden und im Inneren ist ein Wohnbereich mit Fernseher sichtbar. Die Terrasse ist von Grün umgeben.",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 3,
    src: "/images/slider3.jpg",
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
      className="relative w-full overflow-hidden max-h-[500px] md:max-h-[600px] aspect-video"
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
          <ProtectedImage
            src={slides[current].src}
            alt={slides[current].alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={current === 0}
            loading={current === 0 ? "eager" : "lazy"}
          />
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