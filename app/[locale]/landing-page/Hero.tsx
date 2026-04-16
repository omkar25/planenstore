"use client";

import { HiChevronDown } from "react-icons/hi";
import { AuroraText } from "@/components/shared/aurora-text";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const taglines = ["Sicherheit", "Umweltschutz", "Wetterschutz"];
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  return (
    
    <section id="hero" className="relative py-24 bg-background">
      
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-1">
          Professionelle Lösungen für <span className="text-primary">Baustellen</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>
        {/* Background video */}
      <div className="absolute">
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
