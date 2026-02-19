import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Bell, Eye, Save } from "lucide-react";

interface UserSettings {
  darkMode: boolean;
  emailNotifications: boolean;
  autoSave: boolean;
  showPreviewOnEdit: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Load settings from localStorage
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      darkMode: true, // Default to dark
      emailNotifications: true,
      autoSave: true,
      showPreviewOnEdit: true,
    };
  });

  // Apply theme when settings change and save to localStorage
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save to localStorage whenever theme changes
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings.darkMode]);

  // Also save other settings when they change
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (key: keyof UserSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem("userSettings", JSON.stringify(settings));
      toast({ title: "Settings saved successfully!" });
    } catch (error) {
      toast({ 
        title: "Failed to save settings", 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          <span className="text-gradient">Settings</span>
        </h1>

        <div className="grid gap-6 max-w-2xl">
          {/* Appearance */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {settings.darkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.darkMode ? "Dark theme active" : "Light theme active"}
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle("darkMode")}
                />
              </div>
            </div>
          </Card>

          {/* Notifications - Only show if logged in */}
          {user && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your resumes
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle("emailNotifications")}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Resume Editor - Only show if logged in */}
          {user && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Resume Editor
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes while editing
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={() => handleToggle("autoSave")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Live Preview</Label>
                    <p className="text-sm text-muted-foreground">
                      Display preview panel while editing
                    </p>
                  </div>
                  <Switch
                    checked={settings.showPreviewOnEdit}
                    onCheckedChange={() => handleToggle("showPreviewOnEdit")}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="btn-glow">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;