"use client";

import { Button } from "./ui/button";
import { ArrowRight, Shield, Zap, TrendingUp, BarChart3, Lock, Globe } from "lucide-react";

export function LandingHero() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live on Base Mainnet
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Institutional-Grade<br />
            <span className="gold-gradient">Yield on Base</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Deposit ETH or USDC directly into Aave V3 with a single transaction.
            Earn real yield, fully non-custodial, no minimum.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <appkit-button>
              <Button size="lg" className="gap-2 px-8 font-semibold">
                Start Earning <ArrowRight className="h-4 w-4" />
              </Button>
            </appkit-button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://aave.com/" target="_blank" rel="noopener noreferrer">
                View Aave Protocol
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {[
            { value: "$10M+", label: "Total Value Deposited", icon: BarChart3 },
            { value: "Up to 8.2%", label: "Live APY on Base", icon: TrendingUp },
            { value: "1,000+", label: "Active Depositors", icon: Globe },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center justify-center py-8 gap-1">
              <Icon className="h-4 w-4 text-primary mb-1 opacity-80" />
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Why AaveBaseYield</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Everything you need to put idle assets to work — without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Shield,
              title: "Battle-Tested Protocol",
              description:
                "Built directly on Aave V3, the most audited lending protocol in DeFi with over $10B secured across networks.",
            },
            {
              icon: Zap,
              title: "One Transaction",
              description:
                "Connect your wallet, enter an amount, click deposit. No wrapping, no routing, no complexity.",
            },
            {
              icon: Lock,
              title: "Non-Custodial",
              description:
                "Your assets go directly into Aave. We never hold your funds. Withdraw any time with no lock-up.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-lg border border-border/60 bg-card p-6 space-y-3 hover:border-primary/40 hover:bg-card/80 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary/15 transition-colors">
                <Icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="rounded-lg border border-primary/25 bg-primary/5 px-8 py-10 text-center space-y-4 mb-12">
        <h3 className="text-xl font-bold">Ready to start earning?</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Connect your wallet and make your first deposit in under a minute.
        </p>
        <appkit-button>
          <Button size="lg" className="gap-2 font-semibold">
            Connect Wallet <ArrowRight className="h-4 w-4" />
          </Button>
        </appkit-button>
      </section>
    </div>
  );
}
