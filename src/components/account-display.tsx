"use client";

import { Button } from "./ui/button";
import { useAccount } from "wagmi";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AccountDisplay() {
  const { address } = useAccount();
  const { toast } = useToast();

  if (!address) return null;

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const explorerUrl = `https://basescan.org/address/${address}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address has been copied to clipboard",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" className="gap-2" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
        {shortenedAddress}
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" asChild>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>View on BaseScan</TooltipContent>
      </Tooltip>
    </div>
  );
}