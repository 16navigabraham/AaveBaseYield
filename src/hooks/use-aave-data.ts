"use client";

import { useBalance, useReadContract } from "wagmi";
import {
  AAVE_POOL_ADDRESS,
  DATA_PROVIDER_ABI,
  ERC20_ABI,
  POOL_DATA_PROVIDER,
  USDC_ADDRESS,
  WETH_ADDRESS,
} from "@/lib/constants";
import { useMemo } from "react";

const REFETCH_INTERVAL = 10000;

const RAY = 10n ** 27n;
const SECONDS_PER_YEAR = 31536000;

function calculateApy(liquidityRate: bigint | undefined): number {
  if (!liquidityRate) return 0;
  try {
    const depositAPR = Number(liquidityRate) / Number(RAY);
    const depositAPY = Math.pow(1 + depositAPR / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
    if (depositAPY < 0 || depositAPY > 1) return 0;
    return depositAPY;
  } catch {
    return 0;
  }
}

export function useAaveData(address?: `0x${string}`) {
  const { data: ethBalance, isLoading: isEthBalanceLoading, error: ethBalanceError } = useBalance({
    address,
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL, enabled: !!address },
  });

  const { data: usdcBalance, isLoading: isUsdcBalanceLoading, error: usdcBalanceError } = useBalance({
    address,
    token: USDC_ADDRESS,
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL, enabled: !!address },
  });

  const { data: ethReserveData, isLoading: isEthApyLoading, error: ethApyError } = useReadContract({
    address: POOL_DATA_PROVIDER,
    abi: DATA_PROVIDER_ABI,
    functionName: "getReserveData",
    args: [WETH_ADDRESS],
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL },
  });

  const { data: usdcReserveData, isLoading: isUsdcApyLoading, error: usdcApyError } = useReadContract({
    address: POOL_DATA_PROVIDER,
    abi: DATA_PROVIDER_ABI,
    functionName: "getReserveData",
    args: [USDC_ADDRESS],
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL },
  });

  const { data: userEthData, isLoading: isUserEthDataLoading, refetch: refetchUserEthData } = useReadContract({
    address: POOL_DATA_PROVIDER,
    abi: DATA_PROVIDER_ABI,
    functionName: "getUserReserveData",
    args: [WETH_ADDRESS, address!],
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL, enabled: !!address },
  });

  const { data: userUsdcData, isLoading: isUserUsdcDataLoading, refetch: refetchUserUsdcData } = useReadContract({
    address: POOL_DATA_PROVIDER,
    abi: DATA_PROVIDER_ABI,
    functionName: "getUserReserveData",
    args: [USDC_ADDRESS, address!],
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL, enabled: !!address },
  });

  // Fix: use ERC20_ABI (not AAVE_POOL_ABI) — allowance() lives on the token contract
  const { data: usdcAllowance, isLoading: isUsdcAllowanceLoading, refetch: refetchUsdcAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address!, AAVE_POOL_ADDRESS],
    chainId: 8453,
    query: { enabled: !!address },
  });

  const ethApy = useMemo(() => calculateApy(ethReserveData?.liquidityRate), [ethReserveData]);
  const usdcApy = useMemo(() => calculateApy(usdcReserveData?.liquidityRate), [usdcReserveData]);

  const errors: string[] = [];
  if (ethBalanceError) errors.push("Failed to fetch ETH balance");
  if (usdcBalanceError) errors.push("Failed to fetch USDC balance");
  if (ethApyError) errors.push("Failed to fetch ETH APY");
  if (usdcApyError) errors.push("Failed to fetch USDC APY");

  return {
    ethBalance: ethBalance?.value ?? 0n,
    usdcBalance: usdcBalance?.value ?? 0n,
    ethApy,
    usdcApy,
    error: errors.length > 0 ? errors.join(", ") : undefined,
    userEthData: userEthData?.currentATokenBalance ?? 0n,
    userUsdcData: userUsdcData?.currentATokenBalance ?? 0n,
    usdcAllowance: usdcAllowance ?? 0n,
    isLoading:
      isEthBalanceLoading || isUsdcBalanceLoading || isEthApyLoading ||
      isUsdcApyLoading || isUserEthDataLoading || isUserUsdcDataLoading || isUsdcAllowanceLoading,
    refetch: () => {
      refetchUserEthData();
      refetchUserUsdcData();
      refetchUsdcAllowance();
    },
  };
}
