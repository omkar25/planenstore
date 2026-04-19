"use client";

import Hero from "@/components/landing-page/Hero";
import About from "@/components/landing-page/About";
import Portfolio from "@/components/landing-page/Portfolio";
import Referenzen from "@/components/landing-page/Referenzen";
import Kontakt from "@/components/landing-page/Kontakt";
import CarouselSlider from "@/components/slider/CarouselSlider";

export default function Home() {
  return (
    <main>
      <CarouselSlider autoPlay interval={5000} />
      <Hero />
      <Portfolio />
      <About />
      <Referenzen />
      <Kontakt />
    </main>
  );
}
