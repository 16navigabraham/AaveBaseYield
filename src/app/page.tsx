import { AaveDashboard } from '@/components/aave-dashboard';
import { LandingHero } from '@/components/landing-hero';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-background font-body">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isConnected ? <AaveDashboard /> : <LandingHero />}
      </div>
    </main>
  );
}
