import { TerminalHero } from "@/components/sections/TerminalHero";
import { OperatorProfile } from "@/components/sections/OperatorProfile";
import { ExecutionProtocol } from "@/components/sections/ExecutionProtocol";
import { HoloDeck } from "@/components/sections/HoloDeck";
import { TechConstellation } from "@/components/sections/TechConstellation";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
    return (
        <main className="bg-transparent min-h-screen">
            <TerminalHero />
            <OperatorProfile />
            <ExecutionProtocol />
            <HoloDeck />
            <TechConstellation />
            <Footer />
        </main>
    );
}


