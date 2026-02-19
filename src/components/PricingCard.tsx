import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap, Sparkles, FileText } from "lucide-react";

interface Props {
  plan: "basic" | "premium";
  currentPlan?: string;
  onUpgrade?: () => void;
}

const PricingCard = ({ plan, currentPlan, onUpgrade }: Props) => {
  const isPremium = plan === "premium";
  const isCurrentPlan = currentPlan === plan;

  const features = {
    basic: [
      "1 Classic Template",
      "Basic resume sections",
      "PDF Export",
      "Email sharing",
    ],
    premium: [
      "All 3 Templates (Classic, Modern, Creative)",
      "Unlimited resumes",
      "Priority support",
      "Advanced customization",
      "Profile image upload",
      "All export formats",
    ],
  };

  return (
    <Card className={`relative overflow-hidden p-6 ${
      isPremium ? "border-primary shadow-lg" : ""
    }`}>
      {isPremium && (
        <>
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <div className="absolute -top-10 -right-10 h-20 w-20 bg-primary/10 rounded-full" />
        </>
      )}

      <div className="text-center mb-6">
        <div className={`inline-flex p-3 rounded-full mb-4 ${
          isPremium ? "bg-primary/10" : "bg-muted"
        }`}>
          {isPremium ? (
            <Crown className="h-6 w-6 text-primary" />
          ) : (
            <FileText className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-xl font-bold capitalize">{plan}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">
            {isPremium ? "₹999" : "Free"}
          </span>
          {isPremium && <span className="text-muted-foreground"> one-time</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features[plan].map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className={`h-4 w-4 mt-0.5 ${
              isPremium ? "text-primary" : "text-muted-foreground"
            }`} />
            <span className={isPremium ? "text-foreground" : "text-muted-foreground"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        className="w-full"
        variant={isPremium ? "default" : "outline"}
        disabled={isCurrentPlan}
        onClick={onUpgrade}
      >
        {isCurrentPlan ? "Current Plan" : isPremium ? "Upgrade Now" : "Get Started"}
      </Button>
    </Card>
  );
};

export default PricingCard;