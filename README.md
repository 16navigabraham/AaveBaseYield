# AaveBaseYield

AaveBaseYield is a streamlined web application that allows users to deposit ETH and USDC into the Aave V3 liquidity pool on the Base Mainnet with a single click. It provides a simple interface to view wallet balances, check current Aave APYs, manage deposits, and view existing positions.

## ✨ Features

- **Wallet Integration**: Seamlessly connect your Web3 wallet using [Reown AppKit](https://reown.com/appkit).
- **Balance Overview**: View your native ETH and USDC balances on the Base network.
- **Live APY Rates**: Get real-time Annual Percentage Yield (APY) for depositing ETH and USDC on Aave.
- **Simple Deposits**: Easily deposit ETH or USDC into the Aave V3 pool. The app handles necessary approvals for USDC.
- **Position Management**: View your current deposited balances in Aave for both ETH and USDC.
- **Easy Withdrawals**: Withdraw your funds from Aave back to your wallet.
- **Responsive Design**: A clean, modern, and responsive UI built with ShadCN UI and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Web3**:
  - [Wagmi](https://wagmi.sh/): React Hooks for Ethereum.
  - [Viem](https://viem.sh/): A TypeScript interface for Ethereum.
  - [Reown AppKit](https://reown.com/appkit): For the wallet connection user interface.
- **Protocol**: [Aave V3](https://aave.com/) on Base Mainnet.

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- A package manager like `npm`, `yarn`, or `pnpm`.
- A Web3 wallet (e.g., MetaMask) configured for the Base network.

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone <repository-url>
cd aave-base-yield
```

### 2. Install Dependencies

Install the necessary packages using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

You'll need a WalletConnect Project ID to use the Reown AppKit.

1.  Go to [WalletConnect Cloud](https://cloud.walletconnect.com/) and create a new project.
2.  Copy your Project ID.
3.  Create a `.env.local` file in the root of the project.
4.  Add your Project ID to the `.env.local` file:

```
NEXT_PUBLIC_PROJECT_ID=your-walletconnect-project-id
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application should now be running at [http://localhost:9002](http://localhost:9002).

## 📂 Project Structure

Here's a brief overview of the key directories in this project:

- **/src/app**: Contains the main pages and layout of the application, following the Next.js App Router structure.
- **/src/components**: Reusable React components, including UI elements from ShadCN and custom-built dashboard components.
- **/src/hooks**: Custom React hooks, such as `useAaveData.ts` for fetching all blockchain-related data.
- **/src/lib**: Utility functions, constants (like contract addresses and ABIs), and other shared logic.
- **/public**: Static assets.

## 📚 Learn More

- **[Next.js](https://nextjs.org/docs)**: Learn about the React framework used.
- **[Aave Protocol](https://docs.aave.com/)**: Understand the liquidity protocol powering the yield.
- **[Wagmi](https://wagmi.sh/react/getting-started)**: Dive into the React Hooks for Ethereum.
- **[Reown AppKit](https://docs.reown.com/appkit/next/introduction)**: Explore the wallet connection toolkit.
