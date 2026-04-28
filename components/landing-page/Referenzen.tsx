"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import ProtectedImage from "@/components/shared/ProtectedImage";

const projectKeys = ["pvcInstall", "kederInstall", "geruestbandInstall", "blastNets", "dustNets", "personenauffangInstall"] as const;
const projectYears: Record<string, string> = {
  pvcInstall: "2023",
  kederInstall: "2023",
  geruestbandInstall: "2024",
  blastNets: "2024",
  dustNets: "2024",
  personenauffangInstall: "2025",
};
const projectImages: Record<string, string> = {
  pvcInstall: "/images/PVC_Muster_referenzen.png",
  kederInstall: "/images/Keder_Plane_referenzen.jpg",
  geruestbandInstall: "/images/Gersuetplane_referenzen.jpg",
  blastNets: "/images/blast-protection.jpg",
  dustNets: "/images/Staubschutznetze_referenzen.jpg",
  personenauffangInstall: "/images/Personauffangnetze_Muster_2.jpg",
};

function ProjectCard({
  projectKey,
  index,
  t,
}: {
  projectKey: string;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "99999px 0px -50px 0px" });
  const title = t(`projects.${projectKey}.title`);
  const category = t(`projects.${projectKey}.category`);
  const description = t(`projects.${projectKey}.description`);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
      className="group relative bg-card/50 rounded-2xl overflow-hidden  hover:border-primary/30 transition-all duration-500"
    >
      <div className="relative aspect-video overflow-hidden">
        <ProtectedImage
          src={projectImages[projectKey]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold text-primary bg-primary/20 rounded-full border border-primary/30">
          {projectYears[projectKey]}
        </span>

        
      </div>

      <div className="p-5">
        <h3 className="text-foreground font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Referenzen() {
  const t = useTranslations("Referenzen");
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "99999px 0px -100px 0px" });

  return (
    <section id="referenzen" className="relative pt-5 pb-24 bg-background scroll-mt-16">
      <div className="max-w-screen-2xl mx-auto px-1">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("sectionTitle")} <span className="text-primary">{t("sectionTitleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectKeys.map((key, i) => (
            <ProjectCard key={key} projectKey={key} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
