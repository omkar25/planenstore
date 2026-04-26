"use client";

import dynamic from "next/dynamic";
//import Hero from "@/components/landing-page/Hero";
import CarouselSlider from "@/components/slider/CarouselSlider";

const VideoSection = dynamic(() => import("@/components/landing-page/VideoSection"));
const Portfolio = dynamic(() => import("@/components/landing-page/Portfolio"));
const About = dynamic(() => import("@/components/landing-page/About"));
const Referenzen = dynamic(() => import("@/components/landing-page/Referenzen"));
const Kontakt = dynamic(() => import("@/components/landing-page/Kontakt"));

export default function Home() {
  return (
    <main>
      <CarouselSlider autoPlay interval={5000} />
      <VideoSection />
      {/* <Hero /> */}
      <Portfolio />
      <About />
      <Referenzen />
      <Kontakt />
    </main>
  );
}
