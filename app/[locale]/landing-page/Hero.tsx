"use client";

import { HiChevronDown } from "react-icons/hi";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AuroraText } from "@/components/shared/aurora-text";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Hero() {
  const taglines = ["Sicherheit...", "Umweltschutz...", "Wetterschutz..."];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative w-full h-screen min-h-[600px] overflow-hidden mt-2"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video/Tori-Video-Webbbb_1.mp4" type="video/mp4" />
      </video>

    
      {/* Full-height flex row: title left | taglines right */}
      <div className="absolute inset-0 pb-8  z-10 flex items-end justify-between px-10 sm:px-16">

      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2">
          <AuroraText as="span" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xlfont-[family-name:var(--font-nunito-sans)]">
            TORİ Planen
          </AuroraText>
          <br />
          <AuroraText as="span" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">
            &amp; Netze
          </AuroraText>
        </h1>

        {/* RIGHT: Taglines staggered diagonally */}
        <div className="flex flex-col items-start gap-3 sm:gap-5">
          {taglines.map((tag, i) => (
            <motion.p
              key={tag}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.18, ease: "easeOut" }}
              className="text-white/90 font-light tracking-widest m-0"
              style={{
                fontSize: "clamp(0.85rem, 1.6vw, 2.35rem)",
                marginLeft: `${i * 40}px`,
              }}
            >
              {tag}
            </motion.p>
          ))}
        </div>

      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/40"
      >
        <HiChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
}