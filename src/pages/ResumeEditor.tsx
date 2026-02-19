import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetResume, apiUpdateResume, apiUploadResumeImages } from "@/lib/api";
import type { Resume, WorkExperience, Education, Skill, Project, Certification, Language } from "@/types/resume";
import { createEmptyResume } from "@/types/resume";
import ResumePreview from "@/components/ResumePreview";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, Plus, Trash2, ChevronDown, ChevronUp, Eye, ArrowLeft, 
  Lock, Crown, Palette, Upload, Image as ImageIcon, X, Check
} from "lucide-react";
import html2canvas from "html2canvas";

const Section = ({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card">
    <button onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </button>
    {open && <div className="border-t border-border p-4">{children}</div>}
  </div>
);

const templates = [
  { id: "01", name: "Minimal Classic", premium: false },
  { id: "02", name: "Modern Two-Column", premium: true },
  { id: "03", name: "Creative Bold", premium: true },
];

// Color palettes for each template
const colorPalettes = {
  "01": [
    ["#0ea5e9", "#1e293b", "#64748b"], // Blue, Slate, Gray
    ["#10b981", "#065f46", "#34d399"], // Green, Dark Green, Light Green
    ["#f59e0b", "#b45309", "#fbbf24"], // Amber, Orange, Yellow
    ["#8b5cf6", "#5b21b6", "#a78bfa"], // Purple, Dark Purple, Light Purple
  ],
  "02": [
    ["#0891b2", "#164e63", "#06b6d4"], // Cyan, Dark Cyan, Light Cyan
    ["#7c3aed", "#4c1d95", "#8b5cf6"], // Violet, Dark Violet, Light Violet
    ["#b45309", "#7b341e", "#d97706"], // Brown, Dark Brown, Orange
    ["#be123c", "#881337", "#fb7185"], // Rose, Dark Rose, Pink
  ],
  "03": [
    ["#059669", "#065f46", "#10b981"], // Emerald, Dark Emerald, Light Emerald
    ["#d97706", "#92400e", "#fbbf24"], // Yellow, Dark Yellow, Light Yellow
    ["#dc2626", "#991b1b", "#f87171"], // Red, Dark Red, Light Red
    ["#2563eb", "#1e3a8a", "#60a5fa"], // Blue, Dark Blue, Light Blue
  ],
};

const ResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<Resume>({ ...createEmptyResume() } as Resume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    profile: true, 
    contact: false, 
    experience: false, 
    education: false,
    skills: false, 
    projects: false, 
    certifications: false, 
    languages: false, 
    interests: false,
    profileImage: true,
  });

  const toggle = (key: string) => setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  useEffect(() => {
    if (!id) return;
    apiGetResume(id)
      .then((data) => {
        console.log("Loaded resume:", data);
        // Initialize template with color palette if not set
        if (!data.template) {
          data.template = { theme: "01", colorPalette: colorPalettes["01"][0] };
        } else if (!data.template.colorPalette || data.template.colorPalette.length === 0) {
          const templateId = data.template.theme || "01";
          data.template.colorPalette = colorPalettes[templateId as keyof typeof colorPalettes]?.[0] || colorPalettes["01"][0];
        }
        setResume(data);
      })
      .catch((err) => {
        console.error("Failed to load resume:", err);
        toast({ title: "Failed to load resume", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  const generateThumbnail = async (): Promise<string | null> => {
    if (!previewRef.current) return null;
    
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 0.5,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        useCORS: true
      });
      
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      return thumbnailDataUrl;
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const thumbnail = await generateThumbnail();
      let updatedResume = { ...resume };
      
      if (thumbnail) {
        updatedResume = { ...resume, thumbnailLink: thumbnail };
      }
      
      await apiUpdateResume(id, updatedResume);
      setResume(updatedResume);
      toast({ title: "Resume saved successfully!" });
    } catch (err: any) {
      console.error("Save failed:", err);
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setResume(prev => ({
        ...prev,
        profileInfo: {
          ...prev.profileInfo,
          profilePreviewUrl: reader.result as string
        }
      }));
    };
    reader.readAsDataURL(file);

    try {
      console.log("Uploading profile image:", file.name);
      const response = await apiUploadResumeImages(id, undefined, file);
      console.log("Upload response:", response);
      
      if (response.profileImageLink) {
        setResume(prev => ({
          ...prev,
          profileInfo: {
            ...prev.profileInfo,
            profilePreviewUrl: response.profileImageLink
          }
        }));
        toast({ title: "Profile image uploaded successfully!" });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload image", description: error.message, variant: "destructive" });
      setResume(prev => ({
        ...prev,
        profileInfo: {
          ...prev.profileInfo,
          profilePreviewUrl: prev.profileInfo?.profilePreviewUrl || ""
        }
      }));
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const updateField = useCallback((path: string, value: any) => {
    setResume((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (keys[i].match(/^\d+$/)) obj = obj[parseInt(keys[i])];
        else obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  }, []);

  const addItem = (field: string, item: any) => {
    setResume((prev) => ({ ...prev, [field]: [...((prev as any)[field] || []), item] }));
  };

  const removeItem = (field: string, index: number) => {
    setResume((prev) => ({ 
      ...prev, 
      [field]: ((prev as any)[field] || []).filter((_: any, i: number) => i !== index) 
    }));
  };

  const handleTemplateSelect = (templateId: string, isPremium: boolean) => {
    if (isPremium && user?.subscriptionPlan !== "premium") {
      toast({ 
        title: "Premium Template", 
        description: "Upgrade to premium to use this template",
        variant: "destructive" 
      });
      return;
    }
    
    setResume(prev => {
      const defaultColors = colorPalettes[templateId as keyof typeof colorPalettes]?.[0] || colorPalettes["01"][0];
      
      // Force a new object to ensure React detects the change
      return {
        ...prev,
        template: {
          theme: templateId,
          colorPalette: [...defaultColors] // Spread to create new array
        }
      };
    });
    
    toast({ 
      title: "Template Updated", 
      description: `Switched to ${templates.find(t => t.id === templateId)?.name}` 
    });
  };

  const handleColorSelect = (colors: string[]) => {
    setResume(prev => ({
      ...prev,
      template: {
        theme: prev.template?.theme || "01",
        colorPalette: [...colors] // Spread to create new array
      }
    }));
    
    toast({ 
      title: "Color Palette Updated", 
      duration: 1500 
    });
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  const currentTemplateId = resume.template?.theme || "01";
  const currentPalette = colorPalettes[currentTemplateId as keyof typeof colorPalettes] || colorPalettes["01"];
  const selectedColors = resume.template?.colorPalette || currentPalette[0];

  // Log the current template and colors for debugging
  console.log("Current template:", resume.template);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Input
              value={resume.title}
              onChange={(e) => setResume((p) => ({ ...p, title: e.target.value }))}
              className="max-w-xs border-none bg-transparent text-lg font-bold text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate(`/preview/${id}`)}
              className="btn-glow"
            >
              <Eye className="mr-1 h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="lg:hidden">
              <Eye className="mr-1 h-4 w-4" /> {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="btn-glow">
              <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {user?.subscriptionPlan === "premium" && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-accent">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">Premium Active - All templates unlocked!</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className={`space-y-4 ${showPreview ? "hidden lg:block" : ""}`}>
            {/* Template Selection */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 font-semibold text-foreground">Template</h3>
              <div className="flex gap-3 mb-4">
                {templates.map((t) => {
                  const isPremiumLocked = t.premium && user?.subscriptionPlan !== "premium";
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateSelect(t.id, t.premium)}
                      disabled={isPremiumLocked}
                      className={`relative flex-1 rounded-lg border p-3 text-center text-xs transition-all ${
                        resume.template?.theme === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : isPremiumLocked
                          ? "border-border bg-secondary/30 text-muted-foreground cursor-not-allowed opacity-60"
                          : "border-border hover:border-primary/50 cursor-pointer"
                      }`}
                    >
                      {t.name}
                      {isPremiumLocked && <Lock className="mx-auto mt-1 h-3 w-3 text-accent" />}
                      {t.premium && !isPremiumLocked && (
                        <Crown className="mx-auto mt-1 h-3 w-3 text-accent" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Color Palette Selection */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium text-foreground">Color Palette</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentPalette.map((colors, index) => {
                    const isSelected = JSON.stringify(selectedColors) === JSON.stringify(colors);
                    return (
                      <button
                        key={index}
                        onClick={() => handleColorSelect(colors)}
                        className={`relative p-2 rounded-lg border transition-all ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1">
                            <Check className="h-4 w-4 text-primary bg-background rounded-full" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Profile Image Upload Section */}
            <Section title="Profile Photo" open={openSections.profileImage} onToggle={() => toggle("profileImage")}>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {resume.profileInfo?.profilePreviewUrl ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                        <img 
                          src={resume.profileInfo.profilePreviewUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Failed to load image");
                            e.currentTarget.src = '';
                          }}
                        />
                        <button
                          onClick={() => {
                            setResume(prev => ({
                              ...prev,
                              profileInfo: { ...prev.profileInfo, profilePreviewUrl: "" }
                            }));
                          }}
                          className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full hover:bg-destructive"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-secondary flex items-center justify-center border border-border">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <label htmlFor="profile-image" className="cursor-pointer block">
                      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">
                          {uploadingImage ? "Uploading..." : "Click to upload profile photo"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Section>

            {/* Profile Information */}
            <Section title="Profile Information" open={openSections.profile} onToggle={() => toggle("profile")}>
              <div className="space-y-3">
                <div><Label>Full Name</Label><Input value={resume.profileInfo.fullName || ""} onChange={(e) => updateField("profileInfo.fullName", e.target.value)} className="mt-1" /></div>
                <div><Label>Designation</Label><Input value={resume.profileInfo.designation || ""} onChange={(e) => updateField("profileInfo.designation", e.target.value)} className="mt-1" /></div>
                <div><Label>Summary</Label><Textarea value={resume.profileInfo.summary || ""} onChange={(e) => updateField("profileInfo.summary", e.target.value)} rows={3} className="mt-1" /></div>
              </div>
            </Section>

            {/* Contact Information */}
            <Section title="Contact Information" open={openSections.contact} onToggle={() => toggle("contact")}>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Email</Label><Input value={resume.contactInfo.email || ""} onChange={(e) => updateField("contactInfo.email", e.target.value)} className="mt-1" /></div>
                <div><Label>Phone</Label><Input value={resume.contactInfo.phone || ""} onChange={(e) => updateField("contactInfo.phone", e.target.value)} className="mt-1" /></div>
                <div><Label>Location</Label><Input value={resume.contactInfo.location || ""} onChange={(e) => updateField("contactInfo.location", e.target.value)} className="mt-1" /></div>
                <div><Label>LinkedIn</Label><Input value={resume.contactInfo.linkedIn || ""} onChange={(e) => updateField("contactInfo.linkedIn", e.target.value)} className="mt-1" /></div>
                <div><Label>GitHub</Label><Input value={resume.contactInfo.github || ""} onChange={(e) => updateField("contactInfo.github", e.target.value)} className="mt-1" /></div>
                <div><Label>Website</Label><Input value={resume.contactInfo.website || ""} onChange={(e) => updateField("contactInfo.website", e.target.value)} className="mt-1" /></div>
              </div>
            </Section>

            {/* Work Experience */}
            <Section title="Work Experience" open={openSections.experience} onToggle={() => toggle("experience")}>
              {resume.workExperiences?.map((w, i) => (
                <div key={i} className="mb-4 rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Experience {i + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeItem("workExperiences", i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Company</Label><Input value={w.company || ""} onChange={(e) => updateField(`workExperiences.${i}.company`, e.target.value)} className="mt-1" /></div>
                    <div><Label className="text-xs">Role</Label><Input value={w.role || ""} onChange={(e) => updateField(`workExperiences.${i}.role`, e.target.value)} className="mt-1" /></div>
                    <div><Label className="text-xs">Start Date</Label><Input value={w.startDate || ""} onChange={(e) => updateField(`workExperiences.${i}.startDate`, e.target.value)} className="mt-1" placeholder="Jan 2023" /></div>
                    <div><Label className="text-xs">End Date</Label><Input value={w.endDate || ""} onChange={(e) => updateField(`workExperiences.${i}.endDate`, e.target.value)} className="mt-1" placeholder="Present" /></div>
                  </div>
                  <div className="mt-2"><Label className="text-xs">Description</Label><Textarea value={w.description || ""} onChange={(e) => updateField(`workExperiences.${i}.description`, e.target.value)} rows={2} className="mt-1" /></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("workExperiences", { company: "", role: "", startDate: "", endDate: "", description: "" })}>
                <Plus className="mr-1 h-3 w-3" /> Add Experience
              </Button>
            </Section>

            {/* Education */}
            <Section title="Education" open={openSections.education} onToggle={() => toggle("education")}>
              {resume.educations?.map((e, i) => (
                <div key={i} className="mb-3 rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Education {i + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeItem("educations", i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Institution</Label><Input value={e.institution || ""} onChange={(ev) => updateField(`educations.${i}.institution`, ev.target.value)} className="mt-1" /></div>
                    <div><Label className="text-xs">Degree</Label><Input value={e.degree || ""} onChange={(ev) => updateField(`educations.${i}.degree`, ev.target.value)} className="mt-1" /></div>
                    <div><Label className="text-xs">Start</Label><Input value={e.startDate || ""} onChange={(ev) => updateField(`educations.${i}.startDate`, ev.target.value)} className="mt-1" /></div>
                    <div><Label className="text-xs">End</Label><Input value={e.endDate || ""} onChange={(ev) => updateField(`educations.${i}.endDate`, ev.target.value)} className="mt-1" /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("educations", { institution: "", degree: "", startDate: "", endDate: "" })}>
                <Plus className="mr-1 h-3 w-3" /> Add Education
              </Button>
            </Section>

            {/* Skills */}
            <Section title="Skills" open={openSections.skills} onToggle={() => toggle("skills")}>
              {resume.skills?.map((s, i) => (
                <div key={i} className="mb-2 flex items-center gap-2">
                  <Input value={s.name || ""} onChange={(e) => updateField(`skills.${i}.name`, e.target.value)} placeholder="Skill name" className="flex-1" />
                  <Input type="number" value={s.progress || 0} onChange={(e) => updateField(`skills.${i}.progress`, parseInt(e.target.value) || 0)} className="w-20" min={0} max={100} />
                  <Button variant="ghost" size="sm" onClick={() => removeItem("skills", i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("skills", { name: "", progress: 80 })}>
                <Plus className="mr-1 h-3 w-3" /> Add Skill
              </Button>
            </Section>

            {/* Projects */}
            <Section title="Projects" open={openSections.projects} onToggle={() => toggle("projects")}>
              {resume.projects?.map((p, i) => (
                <div key={i} className="mb-3 rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Project {i + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeItem("projects", i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Name</Label><Input value={p.name || ""} onChange={(e) => updateField(`projects.${i}.name`, e.target.value)} className="mt-1" /></div>
                    <div><Label className="text-xs">Live Demo</Label><Input value={p.liveDemo || ""} onChange={(e) => updateField(`projects.${i}.liveDemo`, e.target.value)} className="mt-1" /></div>
                  </div>
                  <div className="mt-2"><Label className="text-xs">Description</Label><Textarea value={p.description || ""} onChange={(e) => updateField(`projects.${i}.description`, e.target.value)} rows={2} className="mt-1" /></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("projects", { name: "", description: "", githubLink: "", liveDemo: "" })}>
                <Plus className="mr-1 h-3 w-3" /> Add Project
              </Button>
            </Section>

            {/* Certifications */}
            <Section title="Certifications" open={openSections.certifications} onToggle={() => toggle("certifications")}>
              {resume.certifications?.map((c, i) => (
                <div key={i} className="mb-2 flex items-center gap-2">
                  <Input value={c.title || ""} onChange={(e) => updateField(`certifications.${i}.title`, e.target.value)} placeholder="Title" className="flex-1" />
                  <Input value={c.issuingOrganization || ""} onChange={(e) => updateField(`certifications.${i}.issuingOrganization`, e.target.value)} placeholder="Org" className="flex-1" />
                  <Button variant="ghost" size="sm" onClick={() => removeItem("certifications", i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("certifications", { title: "", issuingOrganization: "", issueDate: "", credentialLink: "" })}>
                <Plus className="mr-1 h-3 w-3" /> Add Certification
              </Button>
            </Section>

            {/* Languages */}
            <Section title="Languages" open={openSections.languages} onToggle={() => toggle("languages")}>
              {resume.languages?.map((l, i) => (
                <div key={i} className="mb-2 flex items-center gap-2">
                  <Input value={l.name || ""} onChange={(e) => updateField(`languages.${i}.name`, e.target.value)} placeholder="Language" className="flex-1" />
                  <Input type="number" value={l.progress || 0} onChange={(e) => updateField(`languages.${i}.progress`, parseInt(e.target.value) || 0)} className="w-20" min={0} max={100} />
                  <Button variant="ghost" size="sm" onClick={() => removeItem("languages", i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("languages", { name: "", progress: 70 })}>
                <Plus className="mr-1 h-3 w-3" /> Add Language
              </Button>
            </Section>

            {/* Interests - FIXED */}
            <Section title="Interests" open={openSections.interests} onToggle={() => toggle("interests")}>
              <div className="flex flex-wrap gap-2 mb-3">
                {(resume.interests || []).map((interest, i) => (
                  <div key={i} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                    {interest}
                    <button 
                      type="button"
                      onClick={() => {
                        setResume(prev => ({
                          ...prev,
                          interests: (prev.interests || []).filter((_, idx) => idx !== i)
                        }));
                      }}
                    >
                      <X className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an interest and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                      e.preventDefault();
                      const newInterest = (e.target as HTMLInputElement).value.trim();
                      setResume((prev) => ({ 
                        ...prev, 
                        interests: [...(prev.interests || []), newInterest] 
                      }));
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
            </Section>
          </div>

          <div className={`${!showPreview ? "hidden lg:block" : ""}`}>
            <div className="sticky top-20">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Live Preview</h3>
              <div className="flex justify-center rounded-xl border border-border bg-secondary/30 p-6">
                <div ref={previewRef}>
                  <ResumePreview 
                    resume={resume} 
                    scale={0.55} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;