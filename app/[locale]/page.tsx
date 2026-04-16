import Hero from "./landing-page/Hero";
import About from "./landing-page/About";
import Portfolio from "./landing-page/Portfolio";
import Referenzen from "./landing-page/Referenzen";
import Kontakt from "./landing-page/Kontakt";

export default function Home() {
  return (
    <main>
      <Hero />
      <Portfolio />
      <About />
      <Referenzen />
      <Kontakt />
    </main>
  );
}
