import { useState } from "react";
import { Link } from "react-router-dom";
import { apiResendVerification } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle, FileText } from "lucide-react";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await apiResendVerification(email);
      setSent(true);
      toast({ 
        title: "Verification email sent!", 
        description: `Check your inbox at ${email}` 
      });
    } catch (err: any) {
      toast({ 
        title: "Failed to send", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <Card className="relative w-full max-w-md p-8">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Resume<span className="text-gradient">Builder</span></span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">Check Your Email</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="mb-6 text-xs text-muted-foreground">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <Button onClick={() => setSent(false)} variant="outline" className="w-full">
              Try another email
            </Button>
            <Link to="/login" className="mt-4 block text-sm text-primary hover:underline">
              <ArrowLeft className="mr-1 inline h-3 w-3" /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Resend Verification</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email to receive a new verification link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <Button type="submit" className="btn-glow w-full h-12" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </div>
                ) : (
                  "Send Verification Email"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                <ArrowLeft className="mr-1 inline h-3 w-3" /> Back to Login
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResendVerification;