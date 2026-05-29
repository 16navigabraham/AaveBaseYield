"use client";

import { useAccount } from "wagmi";
import { BalanceCard } from "./balance-card";
import { DepositCard } from "./deposit-card";
import { PositionCard } from "./position-card";
import { WalkthroughModal } from "./walkthrough-modal";
import { useWalkthroughState } from "@/hooks/use-walkthrough-state";
import { useEffect } from "react";
import { Wallet } from "lucide-react";
import { Button } from "./ui/button";

export function AaveDashboard() {
  const { isConnected, address } = useAccount();
  const { hasSeenWalkthrough, showWalkthrough, handleShowWalkthrough, handleCloseWalkthrough } =
    useWalkthroughState();

  useEffect(() => {
    if (isConnected && !hasSeenWalkthrough) handleShowWalkthrough();
  }, [isConnected, hasSeenWalkthrough, handleShowWalkthrough]);

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card">
          <Wallet className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Connect your wallet</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Connect to view your balances and start depositing into Aave.
          </p>
        </div>
        <appkit-button>
          <Button>Connect Wallet</Button>
        </appkit-button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Manage your Aave positions on Base Mainnet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column: balance + positions */}
        <div className="lg:col-span-1 space-y-5">
          <BalanceCard address={address} />
          <PositionCard address={address} />
        </div>

        {/* Right column: deposit */}
        <div className="lg:col-span-2">
          <DepositCard address={address} />
        </div>
      </div>

      <WalkthroughModal isOpen={showWalkthrough} onClose={handleCloseWalkthrough} />
    </>
  );
}
