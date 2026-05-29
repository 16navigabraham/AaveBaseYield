"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, MinusCircle, BarChart2 } from "lucide-react";
import { useAaveData } from "@/hooks/use-aave-data";
import { formatBigInt } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { parseUnits, maxUint256, formatUnits } from "viem";
import { AAVE_POOL_ABI, AAVE_POOL_ADDRESS, ETH_DECIMALS, USDC_DECIMALS, USDC_ADDRESS, WETH_ADDRESS } from "@/lib/constants";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function PositionCard({ address }: { address: `0x${string}` }) {
  const [asset, setAsset] = useState<"ETH" | "USDC">("USDC");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { userEthData, userUsdcData, isLoading, refetch } = useAaveData(address);
  const { toast } = useToast();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const currentBalance = asset === "ETH" ? userEthData : userUsdcData;
  const decimals = asset === "ETH" ? ETH_DECIMALS : USDC_DECIMALS;
  const assetAddress = asset === "ETH" ? WETH_ADDRESS : USDC_ADDRESS;
  const hasPosition = currentBalance > 0n;

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    const isMax =
      parseFloat(withdrawAmount) === parseFloat(formatUnits(currentBalance, decimals));
    const amountToWithdraw = isMax ? maxUint256 : parseUnits(withdrawAmount, decimals);

    try {
      await writeContractAsync({
        address: AAVE_POOL_ADDRESS,
        abi: AAVE_POOL_ABI,
        functionName: "withdraw",
        args: [assetAddress, amountToWithdraw, address],
      });
      toast({ title: "Withdrawal Sent", description: "Withdrawing funds from Aave..." });
      setWithdrawAmount("");
      refetch();
    } catch {
      toast({ title: "Withdrawal Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <BarChart2 className="h-3.5 w-3.5" />
          Aave Position
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={asset} onValueChange={(v) => { setWithdrawAmount(""); setAsset(v as "ETH" | "USDC"); }}>
          <TabsList className="h-8 w-full grid grid-cols-2 bg-muted/50">
            <TabsTrigger value="USDC" className="text-xs">USDC</TabsTrigger>
            <TabsTrigger value="ETH" className="text-xs">ETH</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-muted-foreground">Deposited</span>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <span className={`font-mono text-sm font-semibold ${hasPosition ? "text-emerald-500" : "text-muted-foreground"}`}>
              {formatBigInt(currentBalance, decimals, 4)} {asset}
            </span>
          )}
        </div>

        {hasPosition && (
          <div className="space-y-2 pt-1 border-t border-border/60">
            <label className="text-xs font-medium text-muted-foreground">Withdraw Amount</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isPending || isConfirming}
                className="h-9 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWithdrawAmount(formatUnits(currentBalance, decimals))}
                disabled={isPending || isConfirming}
                className="h-9 text-xs px-3"
              >
                Max
              </Button>
            </div>
          </div>
        )}

        {!hasPosition && !isLoading && (
          <p className="text-xs text-muted-foreground text-center py-2">
            No active position. Make a deposit to start earning.
          </p>
        )}
      </CardContent>

      {hasPosition && (
        <CardFooter className="pt-0">
          <Button
            className="w-full h-9 text-sm"
            variant="outline"
            onClick={handleWithdraw}
            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <MinusCircle className="mr-2 h-3.5 w-3.5" />
            )}
            {isPending ? "Check Wallet…" : isConfirming ? "Withdrawing…" : `Withdraw ${asset}`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
