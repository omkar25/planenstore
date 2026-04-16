"use client";

import { HiChevronDown } from "react-icons/hi";
import { AuroraText } from "@/components/shared/aurora-text";

export default function Hero() {
  const taglines = ["Sicherheit", "Umweltschutz", "Wetterschutz"];

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-background">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video/Tori-Video-Webbbb_1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-background/60 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <AuroraText as="span" className="text-sm font-medium tracking-widest uppercase">
              Professionelle Lösungen für Baustellen
            </AuroraText>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2">
          <AuroraText as="span" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black">
            TORİ Planen
          </AuroraText>
          <br />
          <AuroraText as="span" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">
            &amp; Netze
          </AuroraText>
        </h1>

        {/* Divider */}
        <div className="w-48 h-[2px] mx-auto mb-8 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Taglines */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-10">
          {taglines.map((tag, i) => (
            <div key={tag} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-primary/50 hidden sm:inline">•</span>
              )}
              <AuroraText as="span" className="text-lg sm:text-xl font-light tracking-wide">
                {tag}
              </AuroraText>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#kontakt"
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
          >
            <AuroraText as="span" className="text-lg font-semibold">Kontakt aufnehmen</AuroraText>
          </a>
          <a
            href="#portfolio"
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
          >
            <AuroraText as="span" className="text-lg font-semibold">Unsere Produkte</AuroraText>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
        <AuroraText as="span" className="text-xs tracking-[0.3em] uppercase mb-2">
          Scroll
        </AuroraText>
        <HiChevronDown className="text-primary text-2xl" />
      </div>
    </section>
  );
}
