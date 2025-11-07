"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set');
}

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base],
  ssr: true,
});

const config = wagmiAdapter.wagmiConfig;

const metadata = {
  name: 'AaveBaseYield',
  description: 'One-Click Aave Yield Deposit on Base Mainnet',
  url: 'https://aave-base-yield.web.app', // replace with your app url
  icons: ['https://aave-base-yield.web.app/icon.png'] // replace with your app icon
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata: metadata,
});


const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
