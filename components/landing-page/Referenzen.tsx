"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProtectedImage from "@/components/shared/ProtectedImage";

const projectKeys = ["pvcInstall", "kederInstall", "geruestbandInstall", "blastNets", "dustNets", "personenauffangInstall"] as const;

const projectSlugs: Record<string, string> = {
  pvcInstall: "pvc-planen-montage",
  kederInstall: "keder-planen-montage",
  geruestbandInstall: "geruestband-montage",
  blastNets: "strahlschutznetze",
  dustNets: "staubschutznetze",
  personenauffangInstall: "personenauffangnetze-montage",
};

const projectImages: Record<string, string> = {
  pvcInstall: "/images/references/pvc-referenzen/pvc-19.jpg",
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
  const description = t(`projects.${projectKey}.description`);

  const slug = projectSlugs[projectKey];

  return (
    <Link href={`/referenzen/${slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
        className="group relative bg-card/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 cursor-pointer"
      >
        <div className="relative aspect-video overflow-hidden">
          <ProtectedImage
            src={projectImages[projectKey]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
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
    </Link>
  );
}

export default function Referenzen() {
  const t = useTranslations("Referenzen");
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "99999px 0px -100px 0px" });

  return (
    <section id="referenzen" className="relative pt-5 pb-20 scroll-mt-16">
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
