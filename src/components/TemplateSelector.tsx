import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetTemplates } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Lock, CheckCircle } from "lucide-react";
import PremiumModal from "./PremiumModal";
import classicPreview from "@/assets/templates/classic-preview.png";
import modernPreview from "@/assets/templates/modern-preview.png";
import creativePreview from "@/assets/templates/creative-preview.jpeg";

interface Props {
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
}

const TemplateSelector = ({ selectedTemplate, onSelect }: Props) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<{
    availableTemplates: string[];
    allTemplates: string[];
    isPremium: boolean;
  }>({
    availableTemplates: ["01"],
    allTemplates: ["01", "02", "03"],
    isPremium: false,
  });
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await apiGetTemplates();
      setTemplates({
        availableTemplates: data.availavleTemplates,
        allTemplates: data.allTemplates,
        isPremium: data.isPremium,
      });
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templates.availableTemplates.includes(templateId) || user?.subscriptionPlan === "premium") {
      onSelect(templateId);
    } else {
      setShowPremiumModal(true);
    }
  };

  const getTemplatePreview = (id: string) => {
    const previews: Record<string, { name: string; image: string; description: string }> = {
      "01": {
        name: "Classic",
        image: classicPreview,
        description: "Clean and professional, perfect for traditional industries",
      },
      "02": {
        name: "Modern",
        image: modernPreview,
        description: "Contemporary design with a sidebar for tech roles",
      },
      "03": {
        name: "Creative",
        image: creativePreview,
        description: "Stand out with this creative layout for design roles",
      },
    };
    return previews[id] || { name: `Template ${id}`, image: "", description: "" };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Choose a Template</h2>
          {!templates.isPremium && user?.subscriptionPlan !== "premium" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPremiumModal(true)}
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
            >
              <Crown className="h-4 w-4 mr-1 text-yellow-500" />
              Upgrade to unlock all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.allTemplates.map((templateId) => {
            const preview = getTemplatePreview(templateId);
            const isAvailable = templates.availableTemplates.includes(templateId) || user?.subscriptionPlan === "premium";
            const isSelected = selectedTemplate === templateId;

            return (
              <Card
                key={templateId}
                className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? "ring-2 ring-primary" : ""
                } ${!isAvailable ? "opacity-75" : ""}`}
                onClick={() => handleTemplateSelect(templateId)}
              >
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[2px] z-10">
                    <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Premium
                    </div>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-2 right-2 z-20">
                    <CheckCircle className="h-5 w-5 text-primary bg-white rounded-full" />
                  </div>
                )}

                <div className="aspect-[794/1123] bg-gray-50">
                  <img 
                    src={preview.image} 
                    alt={preview.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image for template ${templateId}`);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                    }}
                  />
                </div>

                <div className="p-3 border-t">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm">{preview.name}</h3>
                    {!isAvailable && <Crown className="h-3 w-3 text-yellow-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {preview.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <PremiumModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        onSuccess={() => {
          loadTemplates();
        }}
      />
    </>
  );
};

export default TemplateSelector;