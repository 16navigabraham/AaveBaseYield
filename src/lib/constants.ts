export const AAVE_POOL_ADDRESS = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5" as const;
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
export const WETH_ADDRESS = "0x4200000000000000000000000000000000000006" as const;
export const POOL_DATA_PROVIDER = "0x2d8A3C5677189723C4cB8873CfC9C8976FDF38Ac" as const;

export const AAVE_POOL_ABI = [
  "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
  "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
] as const;

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)"
] as const;

export const WETH_ABI = [
    "function deposit() payable",
    "function withdraw(uint256 wad)"
] as const;

export const DATA_PROVIDER_ABI = [
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getReserveData",
    outputs: [{
      components: [
        { name: "unbacked", type: "uint256" },
        { name: "scaledATokenTotalSupply", type: "uint256" },
        { name: "totalScaledVariableDebt", type: "uint256" },
        { name: "liquidityRate", type: "uint256" },
        { name: "variableBorrowRate", type: "uint256" },
        { name: "stableBorrowRate", type: "uint256" },
        { name: "averageStableBorrowRate", type: "uint256" },
        { name: "liquidityIndex", type: "uint256" },
        { name: "variableBorrowIndex", type: "uint256" },
        { name: "lastUpdateTimestamp", type: "uint40" }
      ],
      name: "configuration",
      type: "tuple"
    }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "asset", type: "address" },
      { name: "user", type: "address" }
    ],
    name: "getUserReserveData",
    outputs: [
      { name: "currentATokenBalance", type: "uint256" },
      { name: "currentStableDebt", type: "uint256" },
      { name: "currentVariableDebt", type: "uint256" },
      { name: "principalStableDebt", type: "uint256" },
      { name: "scaledVariableDebt", type: "uint256" },
      { name: "stableBorrowRate", type: "uint256" },
      { name: "liquidityRate", type: "uint256" },
      { name: "stableRateLastUpdated", type: "uint40" },
      { name: "usageAsCollateralEnabled", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const USDC_DECIMALS = 6;
export const ETH_DECIMALS = 18;
