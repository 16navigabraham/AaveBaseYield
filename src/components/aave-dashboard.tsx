"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Landmark, Link, Wallet } from "lucide-react";
import { ConnectWallet } from "./connect-wallet";
import { BalanceCard } from "./balance-card";
import { DepositCard } from "./deposit-card";
import { PositionCard } from "./position-card";
import { WalkthroughModal } from "./walkthrough-modal";
import { useWalkthroughState } from "@/hooks/use-walkthrough-state";
import { useEffect } from "react";

export function AaveDashboard() {
  const { isConnected, address } = useAccount();
  const {
    hasSeenWalkthrough,
    showWalkthrough,
    handleShowWalkthrough,
    handleCloseWalkthrough,
  } = useWalkthroughState();

  // Show walkthrough when user connects wallet for the first time
  useEffect(() => {
    if (isConnected && !hasSeenWalkthrough) {
      handleShowWalkthrough();
    }
  }, [isConnected, hasSeenWalkthrough, handleShowWalkthrough]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
          <div className="p-2 bg-primary/10 rounded-lg">
             <Landmark className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-headline">AaveBaseYield</h1>
        </div>
        <div>
          <ConnectWallet />
        </div>
      </header>
      
      {isConnected && address ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BalanceCard address={address} />
          <PositionCard address={address} />
        </div>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please connect your wallet to view your balances and interact with Aave.</p>
          </CardContent>
        </Card>
      )}

      {isConnected && address && (
        <div>
          <DepositCard address={address} />
        </div>
      )}

      <footer className="text-center text-muted-foreground text-sm mt-8">
        <p>Built for Aave on Base Mainnet.</p>
        <a href="https://aave.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            Learn more about Aave <Link className="h-3 w-3" />
        </a>
      </footer>

      {/* Walkthrough Modal */}
      <WalkthroughModal 
        isOpen={showWalkthrough}
        onClose={handleCloseWalkthrough}
      />
    </div>
  );
}
