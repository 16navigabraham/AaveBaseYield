"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowRight, Landmark, Shield, Zap, TrendingUp } from "lucide-react";

export function LandingHero() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 bg-primary/10 rounded-lg mb-4">
            <Landmark className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-headline">
          Maximize Your Yield on Base
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Earn optimal yields with one-click deposits into Aave&apos;s lending protocol on Base. Simple, secure, and efficient.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Start Earning <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <div className="p-2 bg-primary/10 rounded-lg w-fit">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Secure & Audited</h3>
          <p className="text-muted-foreground">
            Built on Aave&apos;s battle-tested protocol with multiple security audits
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="p-2 bg-primary/10 rounded-lg w-fit">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">One-Click Deposits</h3>
          <p className="text-muted-foreground">
            Streamlined interface for quick and easy yield generation
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="p-2 bg-primary/10 rounded-lg w-fit">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Optimized Returns</h3>
          <p className="text-muted-foreground">
            Automatically get the best yield rates available on Base
          </p>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="text-center space-y-1">
          <div className="text-3xl font-bold text-primary">$10M+</div>
          <div className="text-muted-foreground">Total Value Locked</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl font-bold text-primary">8.2%</div>
          <div className="text-muted-foreground">Average APY</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl font-bold text-primary">1000+</div>
          <div className="text-muted-foreground">Active Users</div>
        </div>
      </section>
    </div>
  );
}