"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { ConnectWallet } from "./connect-wallet";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/30">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            AaveBase<span className="text-primary font-bold">Yield</span>
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
