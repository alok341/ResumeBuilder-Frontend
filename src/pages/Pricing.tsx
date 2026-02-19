import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiCreateOrder, apiVerifyPayment } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Crown, Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isPremium = user?.subscriptionPlan === "premium";

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!user) {
      toast({ title: "Please login first", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create order
      const orderData = await apiCreateOrder("premium");
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ResumeBuilder",
        description: "Premium Plan - Lifetime Access",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment using apiVerifyPayment
            const verificationResult = await apiVerifyPayment({
              razorpay_order_Id: response.razorpay_order_id,
              razorpay_payment_Id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.status === "success") {
              toast({ 
                title: "Payment successful!", 
                description: "Welcome to Premium!" 
              });
              await refreshProfile(); // Update user context
            } else {
              toast({ 
                title: "Payment verification failed", 
                variant: "destructive" 
              });
            }
          } catch {
            toast({ 
              title: "Verification error", 
              variant: "destructive" 
            });
          }
        },
        prefill: { 
          name: user.name, 
          email: user.email 
        },
        theme: { 
          color: "#0ea5e9" 
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      toast({ 
        title: "Failed to create order", 
        description: err.message, 
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      icon: Zap,
      features: ["1 Resume Template (Minimal Classic)", "ATS-Friendly Formatting", "Live Preview Editor", "PDF Export", "Unlimited Resumes"],
      current: !isPremium,
      action: null,
    },
    {
      name: "Premium",
      price: "₹999",
      period: "/lifetime",
      icon: Crown,
      features: [
        "All 3 Pro Templates",
        "ATS-Friendly Formatting",
        "Live Preview Editor",
        "PDF Export",
        "Email Resume Directly",
        "Profile Image Upload",
        "Priority Support",
        "Lifetime Access",
      ],
      current: isPremium,
      action: handleUpgrade,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold text-foreground">
            Choose Your <span className="text-gradient">Plan</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-3 text-muted-foreground">
            Start free, go premium when you need more power.
          </motion.p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`w-96 rounded-2xl p-8 ${
                plan.name === "Premium" ? "glass-card glow-primary border border-primary/30" : "glass-card"
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <plan.icon className={`h-6 w-6 ${plan.name === "Premium" ? "text-accent" : "text-primary"}`} />
                <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
              </div>
              {plan.current && (
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Current Plan
                </span>
              )}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              {plan.action && !plan.current ? (
                <Button onClick={plan.action} disabled={loading} className="btn-glow w-full" size="lg">
                  {loading ? "Processing..." : "Upgrade to Premium"}
                </Button>
              ) : plan.current ? (
                <Button variant="outline" className="w-full" size="lg" disabled>
                  ✓ Active
                </Button>
              ) : (
                <Button variant="outline" className="w-full" size="lg" disabled>
                  Free Plan
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;