import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Resume, WorkExperience, Education, Skill, Project, Certification, Language } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  resume: Resume;
  onSave: (updatedResume: Resume) => void;
  isSaving?: boolean;
}

const ResumeForm = ({ resume, onSave, isSaving = false }: Props) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Resume>(resume);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profile: true,
    contact: true,
    summary: true,
  });

  const handleChange = (field: keyof Resume, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field: keyof Resume["profileInfo"], value: string) => {
    setFormData(prev => ({
      ...prev,
      profileInfo: { ...prev.profileInfo, [field]: value }
    }));
  };

  const handleContactChange = (field: keyof Resume["contactInfo"], value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  };

  // Work Experience handlers
  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setFormData(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, newWork]
    }));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      institution: "",
      degree: "",
      startDate: "",
      endDate: ""
    };
    setFormData(prev => ({
      ...prev,
      educations: [...prev.educations, newEdu]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }));
  };

  // Skills handlers
  const addSkill = () => {
    const newSkill: Skill = { name: "", progress: 50 };
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Projects handlers
  const addProject = () => {
    const newProject: Project = {
      name: "",
      description: "",
      githubLink: "",
      liveDemo: ""
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert: Certification = {
      title: "",
      issuingOrganization: "",
      issueDate: "",
      credentialLink: ""
    };
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Languages handlers
  const addLanguage = () => {
    const newLang: Language = { name: "", progress: 50 };
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const updateLanguage = (index: number, field: keyof Language, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Interests handlers
  const addInterest = () => {
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, ""]
    }));
  };

  const updateInterest = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.map((item, i) => i === index ? value : item)
    }));
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="more">More</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Resume Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g., Software Engineer Resume"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.profileInfo.fullName}
                      onChange={(e) => handleProfileChange("fullName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.profileInfo.designation}
                      onChange={(e) => handleProfileChange("designation", e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.profileInfo.summary}
                    onChange={(e) => handleProfileChange("summary", e.target.value)}
                    placeholder="Brief description about yourself..."
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleContactChange("email", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.contactInfo.phone}
                        onChange={(e) => handleContactChange("phone", e.target.value)}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.contactInfo.location}
                        onChange={(e) => handleContactChange("location", e.target.value)}
                        placeholder="New York, NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.contactInfo.linkedIn}
                        onChange={(e) => handleContactChange("linkedIn", e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={formData.contactInfo.github}
                        onChange={(e) => handleContactChange("github", e.target.value)}
                        placeholder="github.com/johndoe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.contactInfo.website}
                        onChange={(e) => handleContactChange("website", e.target.value)}
                        placeholder="johndoe.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Work Experience</h3>
                  <Button type="button" onClick={addWorkExperience} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Experience
                  </Button>
                </div>

                {formData.workExperiences.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No work experience added. Click the button above to add.
                  </p>
                )}

                {formData.workExperiences.map((exp, index) => (
                  <Card key={index} className="relative border border-border">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="font-medium text-sm">Experience {index + 1}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWorkExperience(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                            placeholder="Company name"
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) => updateWorkExperience(index, "role", e.target.value)}
                            placeholder="Job title"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            value={exp.startDate}
                            onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            value={exp.endDate}
                            onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                            placeholder="MM/YYYY or Present"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Education</h3>
                  <Button type="button" onClick={addEducation} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Education
                  </Button>
                </div>

                {formData.educations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No education added. Click the button above to add.
                  </p>
                )}

                {formData.educations.map((edu, index) => (
                  <Card key={index} className="relative border border-border">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm">Education {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                            placeholder="University/School name"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            placeholder="B.Sc. Computer Science"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                            placeholder="MM/YYYY"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Skills</h3>
                    <Button type="button" onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Skill
                    </Button>
                  </div>

                  {formData.skills.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No skills added.
                    </p>
                  )}

                  <div className="space-y-3">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label className="text-xs">Skill Name</Label>
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(index, "name", e.target.value)}
                            placeholder="e.g., JavaScript"
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-xs">Progress</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={skill.progress}
                            onChange={(e) => updateSkill(index, "progress", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          className="text-destructive mb-0.5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Languages</h3>
                    <Button type="button" onClick={addLanguage} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Language
                    </Button>
                  </div>

                  {formData.languages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No languages added.
                    </p>
                  )}

                  <div className="space-y-3">
                    {formData.languages.map((lang, index) => (
                      <div key={index} className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label className="text-xs">Language</Label>
                          <Input
                            value={lang.name}
                            onChange={(e) => updateLanguage(index, "name", e.target.value)}
                            placeholder="e.g., English"
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-xs">Proficiency</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={lang.progress}
                            onChange={(e) => updateLanguage(index, "progress", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLanguage(index)}
                          className="text-destructive mb-0.5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="more" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Projects</h3>
                  <Button type="button" onClick={addProject} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Project
                  </Button>
                </div>

                {formData.projects.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No projects added.
                  </p>
                )}

                {formData.projects.map((project, index) => (
                  <Card key={index} className="mb-3">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm">Project {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(index, "name", e.target.value)}
                          placeholder="Project name"
                        />
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          placeholder="Project description"
                          rows={2}
                        />
                        <Input
                          value={project.githubLink}
                          onChange={(e) => updateProject(index, "githubLink", e.target.value)}
                          placeholder="GitHub link (optional)"
                        />
                        <Input
                          value={project.liveDemo}
                          onChange={(e) => updateProject(index, "liveDemo", e.target.value)}
                          placeholder="Live demo link (optional)"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Certifications</h3>
                  <Button type="button" onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Certification
                  </Button>
                </div>

                {formData.certifications.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No certifications added.
                  </p>
                )}

                {formData.certifications.map((cert, index) => (
                  <Card key={index} className="mb-3">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm">Certification {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          value={cert.title}
                          onChange={(e) => updateCertification(index, "title", e.target.value)}
                          placeholder="Certification title"
                        />
                        <Input
                          value={cert.issuingOrganization}
                          onChange={(e) => updateCertification(index, "issuingOrganization", e.target.value)}
                          placeholder="Issuing organization"
                        />
                        <Input
                          value={cert.issueDate}
                          onChange={(e) => updateCertification(index, "issueDate", e.target.value)}
                          placeholder="Issue date (MM/YYYY)"
                        />
                        <Input
                          value={cert.credentialLink}
                          onChange={(e) => updateCertification(index, "credentialLink", e.target.value)}
                          placeholder="Credential link (optional)"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Interests</h3>
                  <Button type="button" onClick={addInterest} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Interest
                  </Button>
                </div>

                {formData.interests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No interests added.
                  </p>
                )}

                <div className="space-y-3">
                  {formData.interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={interest}
                        onChange={(e) => updateInterest(index, e.target.value)}
                        placeholder="e.g., Reading, Chess, Traveling"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInterest(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default ResumeForm;