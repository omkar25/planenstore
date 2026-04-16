"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const projects = [
  {
    title: "Strahlschutznetze",
    year: "2023",
    category: "Industriebau",
    image: "/images/ref1.jpg",
    description:
      "Installation von Strahlschutznetzen für ein großes Industrieprojekt in Hamburg. Schutz von umliegenden Gebäuden während Sandstrahlarbeiten.",
  },
  {
    title: "PVC-Planen Montage",
    year: "2023",
    category: "Hochbau",
    image: "/images/pvc-planen.jpg",
    description:
      "Komplettverkleidung eines Hochbauprojekts mit maßgeschneiderten PVC-Planen für ganzjährigen Wetterschutz.",
  },
  {
    title: "Staubschutznetze",
    year: "2024",
    category: "Sanierung",
    image: "/images/staubschutz.jpg",
    description:
      "Großflächige Staubschutznetze für die Sanierung eines historischen Gebäudes in der Hamburger Innenstadt.",
  },
  {
    title: "Wetterschutzplanen",
    year: "2024",
    category: "Wohnungsbau",
    image: "/images/ref2.jpg",
    description:
      "Wetterschutzlösungen für ein Wohnbauprojekt mit über 200 Wohneinheiten. Ermöglichte termingerechte Fertigstellung.",
  },
  {
    title: "Fassadenschutz",
    year: "2024",
    category: "Denkmalschutz",
    image: "/images/wetterschutz.jpg",
    description:
      "Schutzverhüllung einer denkmalgeschützten Fassade während umfangreicher Restaurierungsarbeiten.",
  },
  {
    title: "Gerüstverkleidung",
    year: "2025",
    category: "Gewerbebau",
    image: "/images/strahlschutz.jpg",
    description:
      "Vollständige Gerüstverkleidung eines Gewerbegebäudes mit kombinierten Planen- und Netzlösungen.",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
      className="group relative rounded-2xl overflow-hidden bg-card/50 border border-border hover:border-primary/30 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />

        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold text-primary bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
          {project.year}
        </span>

        <span className="absolute bottom-4 left-4 px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/80 backdrop-blur-sm rounded-full">
          {project.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-foreground font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Referenzen() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="referenzen" className="relative py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unsere <span className="text-primary">Referenzen</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ausgewählte Projekte, die unsere Kompetenz und Erfahrung in der
            Planen- und Netzmontage demonstrieren.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
