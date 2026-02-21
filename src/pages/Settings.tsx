import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Save } from "lucide-react";

interface UserSettings {
  darkMode: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Load settings from localStorage
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("themeSettings");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      darkMode: true, // Default to dark
    };
  });

  // Apply theme when settings change
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleToggle = () => {
    setSettings(prev => ({
      darkMode: !prev.darkMode
    }));
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem("themeSettings", JSON.stringify(settings));
      toast({ 
        title: "Settings saved", 
        description: "Your theme preference has been updated." 
      });
    } catch (error) {
      toast({ 
        title: "Failed to save", 
        description: "Please try again.", 
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
          <span className="text-primary">Settings</span>
        </h1>

        <div className="grid gap-6 max-w-md mx-auto">
          {/* Theme Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {settings.darkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              Theme Preference
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.darkMode ? "Dark theme is active" : "Light theme is active"}
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={handleToggle}
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Theme"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Theme preference is saved locally in your browser
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;