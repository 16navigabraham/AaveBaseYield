"use client";

import { useBalance, useReadContract } from "wagmi";
import {
  AAVE_POOL_ABI,
  AAVE_POOL_ADDRESS,
  DATA_PROVIDER_ABI,
  POOL_DATA_PROVIDER,
  USDC_ADDRESS,
  WETH_ADDRESS,
} from "@/lib/constants";
import { useMemo } from "react";

const REFETCH_INTERVAL = 10000; // 10 seconds

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
    functionName: 'getReserveData',
    args: [WETH_ADDRESS],
    chainId: 8453,
    query: { 
      refetchInterval: REFETCH_INTERVAL,
      onError: (error) => {
        console.error('Error fetching ETH reserve data:', error);
        console.error('Contract call details:', {
          address: POOL_DATA_PROVIDER,
          functionName: 'getReserveData',
          args: [WETH_ADDRESS]
        });
      }
    },
  });

  const { data: usdcReserveData, isLoading: isUsdcApyLoading, error: usdcApyError } = useReadContract({
    address: POOL_DATA_PROVIDER,
    abi: DATA_PROVIDER_ABI,
    functionName: 'getReserveData',
    args: [USDC_ADDRESS],
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL },
  });  const { data: userEthData, isLoading: isUserEthDataLoading, refetch: refetchUserEthData } = useReadContract({
    address: POOL_DATA_PROVIDER,
    abi: DATA_PROVIDER_ABI,
    functionName: 'getUserReserveData',
    args: [WETH_ADDRESS, address!],
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL, enabled: !!address },
  });

  const { data: userUsdcData, isLoading: isUserUsdcDataLoading, refetch: refetchUserUsdcData } = useReadContract({
    address: POOL_DATA_PROVIDER,
    abi: DATA_PROVIDER_ABI,
    functionName: 'getUserReserveData',
    args: [USDC_ADDRESS, address!],
    chainId: 8453,
    query: { refetchInterval: REFETCH_INTERVAL, enabled: !!address },
  });
  
  const calculateApy = (liquidityRate: bigint | undefined) => {
    try {
      if (!liquidityRate) {
        console.warn('No liquidity rate provided for APY calculation');
        return 0;
      }
      
      const RAY = 10n ** 27n;
      const SECONDS_PER_YEAR = 31536000;
      
      console.log('Raw liquidity rate:', liquidityRate.toString());
      const depositAPR = Number(liquidityRate) / Number(RAY);
      console.log('Calculated APR:', depositAPR);
      
      const depositAPY = (Math.pow(1 + (depositAPR / SECONDS_PER_YEAR), SECONDS_PER_YEAR) - 1);
      console.log('Calculated APY:', depositAPY);
      
      // Sanity check for unrealistic APY values
      if (depositAPY < 0 || depositAPY > 1) {
        console.warn('Unrealistic APY calculated:', depositAPY);
        return 0;
      }
      
      return depositAPY;
    } catch (error) {
      console.error('Error calculating APY:', error);
      console.error('Error details:', {
        liquidityRate: liquidityRate?.toString(),
        error: error instanceof Error ? error.message : String(error)
      });
      return 0;
    }
  }

  const ethApy = useMemo(() => {
    if (!ethReserveData) return 0;
    return calculateApy(ethReserveData.liquidityRate);
  }, [ethReserveData]);

  const usdcApy = useMemo(() => {
    if (!usdcReserveData) return 0;
    return calculateApy(usdcReserveData.liquidityRate);
  }, [usdcReserveData]);

  const {data: usdcAllowance, isLoading: isUsdcAllowanceLoading, refetch: refetchUsdcAllowance} = useReadContract({
    address: USDC_ADDRESS,
    abi: AAVE_POOL_ABI,
    functionName: "allowance",
    args: [address!, AAVE_POOL_ADDRESS],
    chainId: 8453,
    query: { enabled: !!address }
  });

  const errors: string[] = [];
  if (ethBalanceError) errors.push('Failed to fetch ETH balance');
  if (usdcBalanceError) errors.push('Failed to fetch USDC balance');
  if (ethApyError) errors.push('Failed to fetch ETH APY');
  if (usdcApyError) errors.push('Failed to fetch USDC APY');

  const error = errors.length > 0 ? errors.join(', ') : undefined;

  return {
    ethBalance: ethBalance?.value ?? BigInt(0),
    usdcBalance: usdcBalance?.value ?? BigInt(0),
    ethApy,
    usdcApy,
    error,
    userEthData: userEthData?.currentATokenBalance ?? 0n,
    userUsdcData: userUsdcData?.currentATokenBalance ?? 0n,
    usdcAllowance: usdcAllowance ?? 0n,
    isLoading: isEthBalanceLoading || isUsdcBalanceLoading || isEthApyLoading || isUsdcApyLoading || isUserEthDataLoading || isUserUsdcDataLoading || isUsdcAllowanceLoading,
    refetch: () => {
        refetchUserEthData();
        refetchUserUsdcData();
        refetchUsdcAllowance();
    }
  };
}
