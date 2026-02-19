import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiCreateOrder, apiVerifyPayment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Loader2, CheckCircle, XCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PremiumModal = ({ open, onOpenChange, onSuccess }: Props) => {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus("processing");

      // Load Razorpay script if not already loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create order on backend
      const orderData = await apiCreateOrder("premium");
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ResumeBuilder",
        description: "Premium Plan Subscription",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResult = await apiVerifyPayment({
              razorpay_order_Id: response.razorpay_order_id,
              razorpay_payment_Id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResult.status === "success") {
              setPaymentStatus("success");
              await refreshProfile(); // Update user subscription plan
              setTimeout(() => {
                onOpenChange(false);
                onSuccess?.();
              }, 2000);
            } else {
              setPaymentStatus("error");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            setPaymentStatus("error");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#0ea5e9",
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("idle");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setPaymentStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Get access to all premium templates and features
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for upgrading to Premium. You now have access to all templates.
            </p>
          </div>
        ) : paymentStatus === "error" ? (
          <div className="py-8 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Something went wrong with your payment. Please try again.
            </p>
            <Button onClick={() => setPaymentStatus("idle")} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Premium Plan</span>
                  <span className="text-2xl font-bold">₹999</span>
                </div>
                <p className="text-xs text-muted-foreground">One-time payment • Lifetime access</p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  All 3 professional templates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Unlimited resume downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Priority email support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Export to multiple formats
                </li>
              </ul>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="sm:flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="sm:flex-1 btn-glow"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Pay ₹999
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;