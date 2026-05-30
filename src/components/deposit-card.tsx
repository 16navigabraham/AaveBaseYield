"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useState, useMemo, useEffect } from "react";
import { useAaveData } from "@/hooks/use-aave-data";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { parseUnits, maxUint256, formatUnits } from "viem";
import {
  AAVE_POOL_ABI, AAVE_POOL_ADDRESS, ERC20_ABI, USDC_ADDRESS,
  WETH_ADDRESS, ETH_DECIMALS, USDC_DECIMALS,
} from "@/lib/constants";
import { PlusCircle, Loader2, HelpCircle, ArrowDownToLine } from "lucide-react";
import { Badge } from "./ui/badge";

export function DepositCard({ address }: { address: `0x${string}` }) {
  const [asset, setAsset] = useState<"ETH" | "USDC">("USDC");
  const [amount, setAmount] = useState("");

  const { ethBalance, usdcBalance, ethApy, usdcApy, isLoading, usdcAllowance, error, refetch } =
    useAaveData(address);
  const { toast } = useToast();
  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const currentApy = asset === "ETH" ? ethApy : usdcApy;
  const currentBalance = asset === "ETH" ? ethBalance : usdcBalance;
  const decimals = asset === "ETH" ? ETH_DECIMALS : USDC_DECIMALS;

  const amountBigInt = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return 0n;
    try { return parseUnits(amount, decimals); } catch { return 0n; }
  }, [amount, decimals]);

  const needsApproval = useMemo(() => {
    if (asset !== "USDC" || amountBigInt === 0n) return false;
    return amountBigInt > usdcAllowance;
  }, [asset, amountBigInt, usdcAllowance]);

  const exceedsBalance = amountBigInt > 0n && amountBigInt > currentBalance;

  useEffect(() => { if (isConfirmed) refetch(); }, [isConfirmed, refetch]);

  const handleAction = async () => {
    if (!amount || amountBigInt === 0n) return;
    if (asset === "USDC" && needsApproval) {
      try {
        await writeContractAsync({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: "approve", args: [AAVE_POOL_ADDRESS, maxUint256] });
        toast({ title: "Approval Submitted", description: "Waiting for confirmation before deposit is available." });
      } catch (err: unknown) {
        const code = (err as { code?: number })?.code;
        if (code === 4001) {
          toast({ variant: "destructive", title: "Approval Cancelled", description: "You rejected the approval request." });
        } else {
          toast({ variant: "destructive", title: "Approval Failed", description: "Could not send approval transaction." });
        }
      }
    } else {
      try {
        await writeContractAsync({ address: AAVE_POOL_ADDRESS, abi: AAVE_POOL_ABI, functionName: "supply", args: [USDC_ADDRESS, amountBigInt, address, 0] });
        toast({ title: "Deposit Sent", description: "Your funds are on their way to Aave." });
        setAmount("");
        refetch();
      } catch (err: unknown) {
        const code = (err as { code?: number })?.code;
        if (code === 4001) {
          toast({ variant: "destructive", title: "Deposit Cancelled", description: "You rejected the transaction." });
        } else {
          toast({ title: "Deposit Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
        }
      }
    }
  };

  const actionLabel = () => {
    if (isPending) return "Check Wallet…";
    if (isConfirming) return "Processing…";
    if (asset === "USDC" && needsApproval) return "Approve USDC";
    return `Deposit ${asset}`;
  };

  const displayBalance = currentBalance > 0n ? formatUnits(currentBalance, decimals) : "0";

  return (
    <Card className="border-border/60 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ArrowDownToLine className="h-4 w-4 text-primary" />
              Deposit to Aave
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              Supply assets and start earning yield instantly.
            </CardDescription>
          </div>
          {/* Live APY badge */}
          <div className="flex flex-col items-end gap-1">
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : error ? null : (
              <>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 font-mono text-sm px-2.5 py-0.5">
                  {(currentApy * 100).toFixed(2)}% APY
                </Badge>
                <span className="text-[10px] text-muted-foreground">current rate</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Asset selector */}
        <Tabs value={asset} onValueChange={(v) => { setAmount(""); setAsset(v as "ETH" | "USDC"); }}>
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="USDC" className="text-sm font-medium">USDC</TabsTrigger>
            <TabsTrigger value="ETH" className="text-sm font-medium" disabled title="ETH deposits require WETH gateway — coming soon">ETH</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Amount input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="deposit-amount" className="text-xs font-medium text-muted-foreground">
              Amount
            </label>
            <span className="text-xs text-muted-foreground">
              Balance: <span className="font-mono text-foreground">{isLoading ? "—" : displayBalance}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              id="deposit-amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending || isConfirming}
              className="h-10 text-sm font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 text-xs"
              onClick={() => currentBalance > 0n && setAmount(formatUnits(currentBalance, decimals))}
              disabled={isPending || isConfirming || currentBalance === 0n}
            >
              Max
            </Button>
          </div>
        </div>

        {/* Info row */}
        <div className="rounded-md border border-border/60 bg-muted/30 px-4 py-3 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              Annual Yield
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  APY compounds automatically. Rates update in real time based on utilisation.
                </TooltipContent>
              </Tooltip>
            </span>
            {isLoading ? (
              <Skeleton className="h-4 w-12" />
            ) : (
              <span className="font-mono font-semibold text-emerald-500">
                {(currentApy * 100).toFixed(2)}%
              </span>
            )}
          </div>
          {amount && parseFloat(amount) > 0 && (
            <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2">
              <span className="text-muted-foreground">Est. annual return</span>
              <span className="font-mono font-semibold text-foreground">
                {(parseFloat(amount) * currentApy).toFixed(4)} {asset}
              </span>
            </div>
          )}
          {exceedsBalance && (
            <p className="text-[11px] text-destructive border-t border-border/40 pt-2">
              Amount exceeds your wallet balance.
            </p>
          )}
          {!exceedsBalance && asset === "USDC" && needsApproval && (
            <p className="text-[11px] text-amber-500 border-t border-border/40 pt-2">
              One-time approval required before your first USDC deposit.
            </p>
          )}
        </div>

        <Button
          className="w-full h-10 font-semibold"
          disabled={!amount || amountBigInt === 0n || exceedsBalance || isPending || isConfirming}
          onClick={handleAction}
        >
          {isPending || isConfirming ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {actionLabel()}
        </Button>
      </CardContent>
    </Card>
  );
}
