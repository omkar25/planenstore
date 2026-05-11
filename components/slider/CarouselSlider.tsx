"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedImage from "@/components/shared/ProtectedImage";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

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
    src: "/images/slider/slider1.jpg",
    alt: "PVC Planen nach Maß",
    title: "PVC Planen nach Maß",
    subtitle: "In jeder Farbe und Form konfigurierbar",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 2,
    src: "/images/slider/slider2.jpg",
    alt: "Abdeckhauben",
    title: "Abdeckhauben",
    subtitle: "Moderne Terrasse mit Korbsitzen und überdachtem Grill neben großen Glasschiebetüren. Zwei leuchtende Laternen beleuchten den Steinboden und im Inneren ist ein Wohnbereich mit Fernseher sichtbar. Die Terrasse ist von Grün umgeben.",
    ctaLabel: "Jetzt konfigurieren",
    ctaHref: "/konfigurator",
  },
  {
    id: 3,
    src: "/images/slider/slider3.jpg",
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
      className="relative w-full overflow-hidden max-h-[800px] min-h-[500px] aspect-video"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Image carousel"
    >
      {/* Online Shop Link - Top Right with Cart Animation */}
      <motion.a
        href="https://www.toriplanen.de/shop"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-lime-600 to-lime-500 text-white font-semibold rounded-full shadow-lg hover:from-lime-700 hover:to-lime-600 transition-all duration-300 hover:scale-105"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: [
            "0 0 0 0 rgba(132, 204, 22, 0.7)",
            "0 0 0 10px rgba(132, 204, 22, 0)",
            "0 0 0 0 rgba(132, 204, 22, 0)"
          ]
        }}
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 0.5 },
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5
          }
        }}
      >
        {/* Cart Icon Container with Items Animation */}
        <div className="relative">
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              repeatDelay: 2.5
            }}
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>
          
          {/* Animated items dropping into cart */}
          <motion.span
            className="absolute -top-2 left-1/2 w-1.5 h-1.5 bg-white rounded-full"
            animate={{
              y: [0, 8, 8],
              opacity: [1, 1, 0],
              scale: [1, 0.8, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: "easeIn"
            }}
          />
          <motion.span
            className="absolute -top-2 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full"
            animate={{
              y: [0, 8, 8],
              opacity: [1, 1, 0],
              scale: [1, 0.8, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1.4,
              delay: 0.7,
              ease: "easeIn"
            }}
          />
          <motion.span
            className="absolute -top-2 left-1/2 w-1.5 h-1.5 bg-lime-300 rounded-full"
            animate={{
              y: [0, 8, 8],
              opacity: [1, 1, 0],
              scale: [1, 0.8, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1.4,
              delay: 1.4,
              ease: "easeIn"
            }}
          />
        </div>
        
        <motion.span 
          className="text-sm sm:text-base"
          animate={{
            opacity: [1, 0.5, 1],
            textShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 8px rgba(255,255,255,0.8)",
              "0 0 0px rgba(255,255,255,0)"
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Online Shop
        </motion.span>
        
        {/* Item count badge with pulse */}
        <motion.span
          className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-[10px] font-bold bg-yellow-400 text-gray-900 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 1.4
          }}
        >
          <motion.span
            animate={{
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            3+
          </motion.span>
        </motion.span>
      </motion.a>

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
            className="object-cover object-center"
            priority={current === 0}
            loading={current === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-3 sm:bottom-5 right-4 sm:right-6 flex items-center gap-1.5 sm:gap-2">
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