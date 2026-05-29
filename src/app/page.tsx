"use client";

import { AaveDashboard } from "@/components/aave-dashboard";
import { LandingHero } from "@/components/landing-hero";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConnected ? <AaveDashboard /> : <LandingHero />}
      </main>
      <Footer />
    </div>
  );
}
