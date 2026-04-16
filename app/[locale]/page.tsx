import Hero from "./landing-page/Hero";
import About from "./landing-page/About";
import Portfolio from "./landing-page/Portfolio";
import Referenzen from "./landing-page/Referenzen";
import Kontakt from "./landing-page/Kontakt";
import CarouselSlider from "@/components/slider/CarouselSlider";

export default function Home() {
  return (
    <main>
      <CarouselSlider autoPlay interval={2000} />
      <Hero />
      <Portfolio />
      <About />
      <Referenzen />
      <Kontakt />
    </main>
  );
}
