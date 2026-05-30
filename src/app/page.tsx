"use client";

import { AaveDashboard } from "@/components/aave-dashboard";
import { LandingHero } from "@/components/landing-hero";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LoadingScreen } from "@/components/loading-screen";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="flex flex-col min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConnected ? (
          <div className="animate-fade-up">
            <AaveDashboard />
          </div>
        ) : (
          <div className="animate-fade-up">
            <LandingHero />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
