import { TrendingUp, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
              <TrendingUp className="h-3 w-3 text-primary" />
            </div>
            <span>AaveBaseYield</span>
            <span className="text-border">·</span>
            <span>Built on Base Mainnet</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://aave.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
            >
              Aave Protocol <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://base.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
            >
              Base <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-muted-foreground/50">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
