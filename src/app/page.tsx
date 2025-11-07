import { AaveDashboard } from '@/components/aave-dashboard';
import { LandingHero } from '@/components/landing-hero';
import { useAccount } from 'wagmi';

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-body">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-16">
          <LandingHero />
          <AaveDashboard />
        </div>
      </div>
    </main>
  );
}
