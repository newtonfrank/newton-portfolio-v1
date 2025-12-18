import { HeroParallaxSection } from "@/components/sections/HeroParallaxSection";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
    return (
        <main className="bg-black min-h-screen">
            <HeroParallaxSection />
            <About />
            <Projects />
            <Skills />
            <Footer />
        </main>
    );
}
