"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft, Wallet, Coins, TrendingUp, Landmark } from "lucide-react";

interface WalkthroughStep {
  title: string;
  description: string;
  icon: JSX.Element;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    title: "Welcome to AaveBaseYield!",
    description: "You've successfully connected your wallet. Let's walk through how to start earning yields on your assets.",
    icon: <Wallet className="h-12 w-12 text-primary" />,
  },
  {
    title: "Check Your Balances",
    description: "View your current ETH and USDC balances. These are the assets you can deposit to start earning.",
    icon: <Coins className="h-12 w-12 text-primary" />,
  },
  {
    title: "View Current APY",
    description: "See the current Annual Percentage Yield (APY) rates for both ETH and USDC. These rates update in real-time based on market conditions.",
    icon: <TrendingUp className="h-12 w-12 text-primary" />,
  },
  {
    title: "Make Your First Deposit",
    description: "Choose your asset, enter the amount you want to deposit, and click 'Deposit' to start earning. Your funds will be supplied to Aave's lending pool.",
    icon: <Landmark className="h-12 w-12 text-primary" />,
  },
  {
    title: "Stay Updated!",
    description: (
      <div className="space-y-2">
        <p>Follow us on X (Twitter) to stay updated with the latest features and announcements!</p>
        <a
          href="https://x.com/AbrahamNAVIG1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Follow @AbrahamNAVIG1
        </a>
      </div>
    ),
    icon: <svg viewBox="0 0 24 24" className="h-12 w-12 text-primary" aria-hidden="true">
      <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>,
  },
];

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalkthroughModal({ isOpen, onClose }: WalkthroughModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = WALKTHROUGH_STEPS[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto p-3 bg-primary/10 rounded-lg mb-4">
            {currentStepData.icon}
          </div>
          <DialogTitle className="text-center text-xl">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {WALKTHROUGH_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full mx-0.5 ${
                  index === currentStep ? "bg-primary" : "bg-primary/20"
                }`}
              />
            ))}
          </div>
          <Button onClick={handleNext} className="flex items-center gap-2">
            {currentStep === WALKTHROUGH_STEPS.length - 1 ? (
              "Get Started"
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}