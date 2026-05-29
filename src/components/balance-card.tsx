"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import { useAaveData } from "@/hooks/use-aave-data";
import { formatBigInt } from "@/lib/utils";
import { ETH_DECIMALS, USDC_DECIMALS } from "@/lib/constants";
import { Wallet } from "lucide-react";

export function BalanceCard({ address }: { address: `0x${string}` }) {
  const { ethBalance, usdcBalance, isLoading } = useAaveData(address);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Wallet className="h-3.5 w-3.5" />
          Wallet Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-foreground/70">
                <path d="M11.944 17.97L4.58 13.62l7.364 4.35zm.056-16.77v6.573l7.359 4.35L12 1.2zM12 10.266v.001L4.58 5.91 12 10.267zm.005-.357L19.42 10.27l-7.415-4.36zm0-8.71v6.573l7.359 4.35L12.005 1.2zM12 1.2L4.58 5.57l7.359 4.35L12 1.2zM4.58 13.62l7.364-4.35v6.573L4.58 13.62zm7.42 8.73l7.42-4.356L12.005 22.35zm0 0v-6.573l-7.42-4.35L12 22.35z" />
              </svg>
            </div>
            <span className="text-sm font-medium">ETH</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <span className="font-mono text-sm font-semibold">
              {formatBigInt(ethBalance, ETH_DECIMALS, 4)}
            </span>
          )}
        </div>

        <div className="h-px bg-border/60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
              <span className="text-xs font-bold text-foreground/70">$</span>
            </div>
            <span className="text-sm font-medium">USDC</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <span className="font-mono text-sm font-semibold">
              {formatBigInt(usdcBalance, USDC_DECIMALS, 2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
