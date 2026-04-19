"use client";

import { HiChevronDown } from "react-icons/hi";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { AuroraText } from "@/components/shared/aurora-text";

export default function Hero() {
  const t = useTranslations("Hero");
  const taglines = [t("tagline1"), t("tagline2"), t("tagline3")];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "99999px 0px -100px 0px" });

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

      {/* Content: stacked on mobile, side-by-side on md+ */}
      <div className="absolute inset-0 pb-8 z-10 flex flex-col justify-end px-6 sm:px-10 md:flex-row md:items-end md:justify-between md:px-16">

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 md:mb-2">
          <AuroraText as="span" className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black">
            {t("titleLine1")}
          </AuroraText>
          <br />
          <AuroraText as="span" className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black">
            {t("titleLine2")}
          </AuroraText>
        </h1>

        {/* Taglines staggered diagonally */}
        <div className="flex flex-col items-start gap-2 sm:gap-3 md:gap-5">
          {taglines.map((tag, i) => (
            <motion.p
              key={tag}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.18, ease: "easeOut" }}
              className="text-foreground/90 font-light tracking-widest m-0"
              style={{
                fontSize: "clamp(0.75rem, 1.6vw, 2.35rem)",
                marginLeft: `${i * 20}px`,
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