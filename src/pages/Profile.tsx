import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiUploadProfileImage } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Crown, Mail, Calendar, Shield } from "lucide-react";

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      await apiUploadProfileImage(file);
      await refreshProfile();
      toast({ title: "Profile image updated!" });
    } catch (error: any) {
      toast({ 
        title: "Upload failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          Your <span className="text-gradient">Profile</span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Image */}
          <div>
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Profile Picture</h2>
              <ImageUpload
                onUpload={handleImageUpload}
                currentImageUrl={user?.profileImageUrl}
                aspectRatio="square"
                label=""
              />
              {uploading && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Uploading...
                </p>
              )}
            </Card>
          </div>

          {/* Right Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={user?.name || ""} disabled className="mt-1 bg-muted" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled className="mt-1 bg-muted" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Account Details</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Subscription Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.subscriptionPlan === "premium" ? (
                      <>
                        <Crown className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Premium</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Basic</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Email Verified</span>
                  </div>
                  <span className={`text-sm ${user?.emailVerified ? "text-green-500" : "text-destructive"}`}>
                    {user?.emailVerified ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Member Since</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              {!user?.emailVerified && (
                <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  Your email is not verified. Please check your inbox or{' '}
                  <button 
                    onClick={() => navigate("/resend-verification")}
                    className="font-medium underline underline-offset-2"
                  >
                    resend verification email
                  </button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;