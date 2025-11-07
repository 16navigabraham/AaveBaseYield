"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Landmark, Coins, Loader2, MinusCircle, TrendingUp } from "lucide-react";
import { useAaveData } from "@/hooks/use-aave-data";
import { formatBigInt } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { parseUnits, maxUint256 } from "viem";
import { AAVE_POOL_ABI, AAVE_POOL_ADDRESS, ETH_DECIMALS, USDC_DECIMALS, USDC_ADDRESS, WETH_ADDRESS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function PositionCard({ address }: { address: `0x${string}` }) {
  const [asset, setAsset] = useState<"ETH" | "USDC">("USDC");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { userEthData, userUsdcData, isLoading, refetch } = useAaveData(address);
  const { toast } = useToast();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const currentBalance = asset === "ETH" ? userEthData : userUsdcData;
  const decimals = asset === "ETH" ? ETH_DECIMALS : USDC_DECIMALS;
  const assetAddress = asset === "ETH" ? WETH_ADDRESS : USDC_ADDRESS;

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;

    const isMax = withdrawAmount.toLowerCase() === 'max';
    const amountToWithdraw = isMax ? maxUint256 : parseUnits(withdrawAmount, decimals);

    try {
      await writeContractAsync({
        address: AAVE_POOL_ADDRESS,
        abi: AAVE_POOL_ABI,
        functionName: 'withdraw',
        args: [assetAddress, amountToWithdraw, address],
      });

      toast({
        title: "Transaction Sent",
        description: "Withdrawing funds from Aave...",
      });
      
      // Reset amount after sending
      setWithdrawAmount("");
      refetch();

    } catch (error) {
      console.error(error);
      toast({
        title: "Withdrawal Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleMax = () => {
    setWithdrawAmount(formatBigInt(currentBalance, decimals, 6));
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Landmark className="h-5 w-5 text-primary" />
          Your Aave Position
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={asset} onValueChange={(v) => setAsset(v as "ETH" | "USDC")}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="USDC">USDC</TabsTrigger>
                <TabsTrigger value="ETH">ETH</TabsTrigger>
            </TabsList>
        </Tabs>
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2">
                Current Balance
            </span>
            {isLoading ? (
                <Skeleton className="h-6 w-24" />
            ) : (
                <span className="font-mono font-semibold text-lg">
                {formatBigInt(currentBalance, decimals, 4)}
                </span>
            )}
        </div>
        {currentBalance > 0n && (
            <div className="space-y-2 pt-4 border-t">
                <label className="text-sm font-medium text-muted-foreground">Withdraw Amount</label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="0.0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        disabled={isPending || isConfirming}
                    />
                    <Button variant="outline" onClick={handleMax} disabled={isPending || isConfirming}>Max</Button>
                </div>
            </div>
        )}
      </CardContent>
      {currentBalance > 0n && (
        <CardFooter>
            <Button 
                className="w-full" 
                onClick={handleWithdraw} 
                disabled={!withdrawAmount || isPending || isConfirming}
            >
                {isPending || isConfirming ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <MinusCircle className="mr-2 h-4 w-4" />
                )}
                {isPending ? 'Check Wallet...' : isConfirming ? 'Withdrawing...' : `Withdraw ${asset}`}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
