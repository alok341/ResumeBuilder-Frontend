import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRegister, apiResendVerification } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Eye, EyeOff, Mail, Clock } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRegister({ name, email, password });
      toast({ 
        title: "Account created!", 
        description: "Check your email to verify your account before logging in." 
      });
      setShowVerificationMessage(true);
      setCountdown(120); // Start 120 second countdown
    } catch (err: any) {
      toast({ 
        title: "Registration failed", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({ 
        title: "Email required", 
        description: "Please provide your email address", 
        variant: "destructive" 
      });
      return;
    }

    setResendLoading(true);
    try {
      await apiResendVerification(email);
      toast({ 
        title: "Verification email sent!", 
        description: `Please check your inbox at ${email}` 
      });
      setCountdown(120); // Reset countdown
    } catch (err: any) {
      toast({ 
        title: "Failed to send", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-1/3 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[150px]" />
      </div>
      <div className="glass-card relative w-full max-w-md rounded-2xl p-8">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Resume<span className="text-gradient">Builder</span></span>
        </Link>

        <h1 className="mb-1 text-center text-2xl font-bold text-foreground">Create Account</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">Start building professional resumes</p>

        {showVerificationMessage ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="rounded-lg bg-green-500/10 p-4 text-center">
              <Mail className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Verify Your Email</h2>
              <p className="text-sm text-muted-foreground mb-1">
                We've sent a verification link to:
              </p>
              <p className="text-sm font-medium text-primary mb-4">{email}</p>
              <p className="text-xs text-muted-foreground">
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>

            {/* Resend Section */}
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-center text-muted-foreground mb-3">
                Didn't receive the email?
              </p>
              
              {countdown > 0 ? (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Resend available in {formatTime(countdown)}</span>
                </div>
              ) : (
                <Button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  variant="outline"
                  className="w-full"
                >
                  {resendLoading ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm text-primary hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Alok Kumar" 
                  required 
                  minLength={2} 
                  maxLength={20} 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com" 
                  required 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input 
                    id="password" 
                    type={showPw ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Min 6 characters" 
                    required 
                    minLength={6} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="btn-glow w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;