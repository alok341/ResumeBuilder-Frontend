export interface Template {
  theme: string;
  colorPalette: string[];
}

export interface ProfileInfo {
  profilePreviewUrl: string;
  fullName: string;
  designation: string;
  summary: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  github: string;
  website: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  name: string;
  progress: number;
}

export interface Project {
  name: string;
  description: string;
  githubLink: string;
  liveDemo: string;
}

export interface Certification {
  title: string;
  issuingOrganization: string;
  issueDate: string;
  credentialLink: string;
}

export interface Language {
  name: string;
  progress: number;
}

export interface Resume {
  _id?: string;
  id?: string;
  userId?: string;
  title: string;
  thumbnailLink?: string;
  template: Template;
  profileInfo: ProfileInfo;
  contactInfo: ContactInfo;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  interests: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  subscriptionPlan: string;
  emailVerified: boolean;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const createEmptyResume = (): Omit<Resume, '_id' | 'id' | 'userId' | 'createdAt' | 'updatedAt'> => ({
  title: "Untitled Resume",
  template: { theme: "01", colorPalette: ["#0ea5e9", "#1e293b"] },
  profileInfo: { profilePreviewUrl: "", fullName: "", designation: "", summary: "" },
  contactInfo: { email: "", phone: "", location: "", linkedIn: "", github: "", website: "" },
  workExperiences: [],
  educations: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
});
