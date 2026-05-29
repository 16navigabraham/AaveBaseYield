"use client";

import { TrendingUp } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-6 animate-fade-in">
      {/* Logo with pulse ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full animate-pulse-ring" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <TrendingUp className="h-6 w-6 text-primary animate-spin-slow" />
        </div>
      </div>

      {/* Brand */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-base font-semibold tracking-tight">
          AaveBase<span className="text-primary font-bold">Yield</span>
        </span>
        <span className="text-xs text-muted-foreground">Connecting to Base Mainnet…</span>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
