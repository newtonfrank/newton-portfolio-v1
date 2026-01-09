import { TerminalHero } from "@/components/sections/TerminalHero";
import dynamic from "next/dynamic";

// Lazy load components that are not immediately visible
const OperatorProfile = dynamic(
  () => import("@/components/sections/OperatorProfile").then((mod) => ({ default: mod.OperatorProfile })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading profile...</div>
  }
);

const ExecutionProtocol = dynamic(
  () => import("@/components/sections/ExecutionProtocol").then((mod) => ({ default: mod.ExecutionProtocol })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading protocol...</div>
  }
);

const HoloDeck = dynamic(
  () => import("@/components/sections/HoloDeck").then((mod) => ({ default: mod.HoloDeck })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading projects...</div>
  }
);

const TechConstellation = dynamic(
  () => import("@/components/sections/TechConstellation").then((mod) => ({ default: mod.TechConstellation })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading tech stack...</div>
  }
);

const Footer = dynamic(
  () => import("@/components/sections/Footer").then((mod) => ({ default: mod.Footer })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading footer...</div>
  }
);

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


