"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useMemo, useEffect } from "react";
import { useAaveData } from "@/hooks/use-aave-data";
import { Skeleton } from "./ui/skeleton";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { parseUnits, maxUint256, formatUnits } from "viem";
import { AAVE_POOL_ABI, AAVE_POOL_ADDRESS, ERC20_ABI, USDC_ADDRESS, WETH_ADDRESS, ETH_DECIMALS, USDC_DECIMALS } from "@/lib/constants";
import { PlusCircle, Loader2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function DepositCard({ address }: { address: `0x${string}` }) {
  const [asset, setAsset] = useState<'ETH' | 'USDC'>('USDC');
  const [amount, setAmount] = useState('');
  
  const { ethBalance, usdcBalance, ethApy, usdcApy, isLoading: isDataLoading, usdcAllowance, error, refetch } = useAaveData(address);
  const { toast } = useToast();
  const { data: hash, writeContractAsync, isPending } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const currentApy = asset === 'ETH' ? ethApy : usdcApy;
  const currentBalance = asset === 'ETH' ? ethBalance : usdcBalance;
  const decimals = asset === 'ETH' ? ETH_DECIMALS : USDC_DECIMALS;
  const needsApproval = useMemo(() => {
    if (asset !== 'USDC' || !amount || parseFloat(amount) <= 0) return false;
    const amountWei = parseUnits(amount, decimals);
    return amountWei > usdcAllowance;
  }, [asset, amount, usdcAllowance, decimals]);

  useEffect(() => {
    if (isConfirming) {
        // Refetch allowance after a transaction (could be approve or deposit)
        refetch();
    }
  }, [isConfirming, refetch]);

  const handleAction = async () => {
    if (!amount) return;

    if (asset === 'USDC' && needsApproval) {
      await handleApprove();
    } else {
      await handleDeposit();
    }
  };

  const handleApprove = async () => {
    try {
        await writeContractAsync({
            address: USDC_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [AAVE_POOL_ADDRESS, maxUint256],
        });
        toast({
            title: "Approval Sent",
            description: "Approving Aave to spend your USDC. You can now proceed with the deposit.",
        });
    } catch(err) {
        toast({ variant: 'destructive', title: 'Approval Failed', description: 'Could not send approval transaction.' });
    }
  }

  const handleDeposit = async () => {
    const amountToDeposit = parseUnits(amount, decimals);
    
    try {
      if (asset === 'ETH') {
        await writeContractAsync({
          address: AAVE_POOL_ADDRESS,
          abi: AAVE_POOL_ABI,
          functionName: 'supply',
          args: [WETH_ADDRESS, amountToDeposit, address, 0],
          value: amountToDeposit,
        });
      } else {
        await writeContractAsync({
          address: AAVE_POOL_ADDRESS,
          abi: AAVE_POOL_ABI,
          functionName: 'supply',
          args: [USDC_ADDRESS, amountToDeposit, address, 0],
        });
      }
      toast({
        title: "Deposit Sent",
        description: "Your funds are on their way to Aave.",
      });
      setAmount(''); // Reset amount on success
      refetch();
    } catch (error) {
        console.error(error);
        toast({
            title: "Deposit Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        });
    }
  };

  const handleMax = () => {
    if (currentBalance > 0n) {
      setAmount(formatUnits(currentBalance, decimals));
    }
  };
  
  const actionText = () => {
    if(isPending) return 'Check Wallet...';
    if(isConfirming) return 'Processing...';
    if(asset === 'USDC' && needsApproval) return 'Approve USDC';
    return `Deposit ${asset}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit to Aave</CardTitle>
        <CardDescription>
          Select an asset to deposit and start earning yield.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={asset} onValueChange={(value) => {setAmount(''); setAsset(value as 'ETH' | 'USDC')}}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="USDC">USDC</TabsTrigger>
            <TabsTrigger value="ETH">ETH</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-muted-foreground flex items-center gap-1">
                        Current APY 📈
                        <HelpCircle className="h-4 w-4" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Annual Percentage Yield (APY) shows your expected yearly returns, including compound interest. This rate updates based on market conditions.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {isDataLoading ? (
                  <Skeleton className="h-5 w-20" />
                ) : error ? (
                  <span className="text-destructive">Failed to load APY</span>
                ) : (
                  <span className="font-semibold text-green-400">{(currentApy * 100).toFixed(2)}%</span>
                )}
            </div>
            <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-muted-foreground">Amount</label>
                <div className="flex gap-2">
                    <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={isPending || isConfirming}
                    />
                    <Button variant="outline" onClick={handleMax} disabled={isPending || isConfirming || currentBalance === 0n}>Max</Button>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full"
            disabled={!amount || parseFloat(amount) <= 0 || isPending || isConfirming}
            onClick={handleAction}
        >
          {isPending || isConfirming ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {actionText()}
        </Button>
      </CardFooter>
    </Card>
  );
}
