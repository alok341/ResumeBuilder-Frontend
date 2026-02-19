import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface Props {
  resume: Resume;
  scale?: number;
}

// Template 01 - Minimal Classic with dynamic colors (ADDED INTERESTS)
const Template01 = ({ resume }: { resume: Resume }) => {
  // Get colors from template or use defaults
  const colors = resume.template?.colorPalette || ["#0ea5e9", "#1e293b", "#64748b"];
  const [primaryColor, secondaryColor, accentColor] = colors;

  // Add defensive checks
  const profileInfo = resume.profileInfo || { fullName: "", designation: "", summary: "" };
  const contactInfo = resume.contactInfo || { email: "", phone: "", location: "", linkedIn: "", github: "", website: "" };
  const workExperiences = resume.workExperiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const languages = resume.languages || [];
  const interests = resume.interests || []; // ADDED interests

  return (
    <div className="h-full w-full bg-white p-8" style={{ fontFamily: "'Georgia', serif", color: secondaryColor }}>
      {/* Header with dynamic border color */}
      <div className="border-b-2 pb-4 text-center" style={{ borderColor: primaryColor }}>
        <h1 className="text-2xl font-bold tracking-wide" style={{ color: primaryColor }}>
          {profileInfo.fullName || "Your Name"}
        </h1>
        <p className="mt-1 text-sm font-medium" style={{ color: accentColor }}>
          {profileInfo.designation || "Your Title"}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
          {contactInfo.email && <span className="flex items-center gap-1"><Mail size={10} style={{ color: primaryColor }} />{contactInfo.email}</span>}
          {contactInfo.phone && <span className="flex items-center gap-1"><Phone size={10} style={{ color: primaryColor }} />{contactInfo.phone}</span>}
          {contactInfo.location && <span className="flex items-center gap-1"><MapPin size={10} style={{ color: primaryColor }} />{contactInfo.location}</span>}
          {contactInfo.linkedIn && <span className="flex items-center gap-1"><Linkedin size={10} style={{ color: primaryColor }} />{contactInfo.linkedIn}</span>}
          {contactInfo.github && <span className="flex items-center gap-1"><Github size={10} style={{ color: primaryColor }} />{contactInfo.github}</span>}
        </div>
      </div>

      {profileInfo.summary && (
        <div className="mt-4">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-600">{profileInfo.summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Experience
          </h2>
          {workExperiences.map((w, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <span className="text-xs font-semibold" style={{ color: secondaryColor }}>{w.role}</span>
                <span className="text-xs text-gray-500">{w.startDate} – {w.endDate || "Present"}</span>
              </div>
              <p className="text-xs italic" style={{ color: accentColor }}>{w.company}</p>
              {w.description && <p className="mt-0.5 text-xs text-gray-600">{w.description}</p>}
            </div>
          ))}
        </div>
      )}

      {educations.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Education
          </h2>
          {educations.map((e, i) => (
            <div key={i} className="mb-1 flex justify-between">
              <div>
                <span className="text-xs font-semibold" style={{ color: secondaryColor }}>{e.degree}</span>
                <span className="text-xs text-gray-500"> — {e.institution}</span>
              </div>
              <span className="text-xs text-gray-500">{e.startDate} – {e.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((s, i) => (
              <span key={i} className="rounded px-2 py-0.5 text-xs" style={{ backgroundColor: primaryColor + '20', color: secondaryColor }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Projects
          </h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-1">
              <span className="text-xs font-semibold" style={{ color: secondaryColor }}>{p.name}</span>
              {p.description && <p className="text-xs text-gray-600">{p.description}</p>}
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Certifications
          </h2>
          {certifications.map((c, i) => (
            <div key={i} className="text-xs text-gray-700">{c.title} — {c.issuingOrganization}</div>
          ))}
        </div>
      )}

      {languages.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Languages
          </h2>
          <div className="flex gap-2 text-xs" style={{ color: accentColor }}>
            {languages.map((l, i) => <span key={i}>{l.name}</span>)}
          </div>
        </div>
      )}

      {/* ADDED Interests section */}
      {interests.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            Interests
          </h2>
          <div className="flex flex-wrap gap-1">
            {interests.map((interest, i) => (
              <span key={i} className="rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: accentColor + '20', color: secondaryColor }}>
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Template 02 - Modern Two-Column with dynamic colors
const Template02 = ({ resume }: { resume: Resume }) => {
  // Get colors from template or use defaults
  const colors = resume.template?.colorPalette || ["#0891b2", "#164e63", "#06b6d4"];
  const [primaryColor, secondaryColor, accentColor] = colors;

  const profileInfo = resume.profileInfo || { fullName: "", designation: "", summary: "", profilePreviewUrl: "" };
  const contactInfo = resume.contactInfo || { email: "", phone: "", location: "", linkedIn: "", github: "", website: "" };
  const workExperiences = resume.workExperiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const languages = resume.languages || [];
  const interests = resume.interests || [];

  return (
    <div className="flex h-full w-full bg-white" style={{ fontFamily: "'Helvetica', 'Arial', sans-serif", color: secondaryColor }}>
      {/* Sidebar with dynamic background */}
      <div className="w-[35%] p-5 text-white" style={{ backgroundColor: secondaryColor }}>
        {/* Profile Image */}
        {profileInfo.profilePreviewUrl && (
          <img src={profileInfo.profilePreviewUrl} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full object-cover border-2" style={{ borderColor: primaryColor }} />
        )}
        <h1 className="text-lg font-bold">{profileInfo.fullName || "Your Name"}</h1>
        <p className="mb-4 text-xs" style={{ color: accentColor + 'CC' }}>{profileInfo.designation || "Your Title"}</p>

        <div className="space-y-1.5 text-xs">
          {contactInfo.email && <div className="flex items-center gap-1.5"><Mail size={10} style={{ color: primaryColor }} />{contactInfo.email}</div>}
          {contactInfo.phone && <div className="flex items-center gap-1.5"><Phone size={10} style={{ color: primaryColor }} />{contactInfo.phone}</div>}
          {contactInfo.location && <div className="flex items-center gap-1.5"><MapPin size={10} style={{ color: primaryColor }} />{contactInfo.location}</div>}
          {contactInfo.linkedIn && <div className="flex items-center gap-1.5"><Linkedin size={10} style={{ color: primaryColor }} />{contactInfo.linkedIn}</div>}
          {contactInfo.github && <div className="flex items-center gap-1.5"><Github size={10} style={{ color: primaryColor }} />{contactInfo.github}</div>}
          {contactInfo.website && <div className="flex items-center gap-1.5"><Globe size={10} style={{ color: primaryColor }} />{contactInfo.website}</div>}
        </div>

        {skills.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Skills</h3>
            {skills.map((s, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex justify-between text-xs"><span>{s.name}</span><span>{s.progress}%</span></div>
                <div className="mt-0.5 h-1 rounded-full" style={{ backgroundColor: secondaryColor + '80' }}>
                  <div className="h-1 rounded-full" style={{ width: `${s.progress}%`, backgroundColor: primaryColor }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {languages.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Languages</h3>
            {languages.map((l, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex justify-between text-xs"><span>{l.name}</span><span>{l.progress}%</span></div>
                <div className="mt-0.5 h-1 rounded-full" style={{ backgroundColor: secondaryColor + '80' }}>
                  <div className="h-1 rounded-full" style={{ width: `${l.progress}%`, backgroundColor: primaryColor }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {interests.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Interests</h3>
            <div className="flex flex-wrap gap-1">
              {interests.map((interest, i) => (
                <span key={i} className="rounded px-2 py-0.5 text-xs" style={{ backgroundColor: primaryColor + '30', color: 'white' }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {profileInfo.summary && (
          <div className="mb-4">
            <h2 className="mb-1 border-b pb-1 text-xs font-bold uppercase tracking-wider" style={{ borderColor: primaryColor + '40', color: secondaryColor }}>
              About Me
            </h2>
            <p className="text-xs leading-relaxed text-gray-600">{profileInfo.summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-4">
            <h2 className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider" style={{ borderColor: primaryColor + '40', color: secondaryColor }}>
              Experience
            </h2>
            {workExperiences.map((w, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold" style={{ color: secondaryColor }}>{w.role}</span>
                  <span className="text-xs text-gray-400">{w.startDate} – {w.endDate || "Present"}</span>
                </div>
                <p className="text-xs" style={{ color: primaryColor }}>{w.company}</p>
                {w.description && <p className="mt-0.5 text-xs text-gray-600">{w.description}</p>}
              </div>
            ))}
          </div>
        )}

        {educations.length > 0 && (
          <div className="mb-4">
            <h2 className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider" style={{ borderColor: primaryColor + '40', color: secondaryColor }}>
              Education
            </h2>
            {educations.map((e, i) => (
              <div key={i} className="mb-1 flex justify-between">
                <div>
                  <span className="text-xs font-semibold" style={{ color: secondaryColor }}>{e.degree}</span>
                  <span className="text-xs text-gray-500"> — {e.institution}</span>
                </div>
                <span className="text-xs text-gray-500">{e.startDate} – {e.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-4">
            <h2 className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider" style={{ borderColor: primaryColor + '40', color: secondaryColor }}>
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-1">
                <span className="text-xs font-semibold" style={{ color: secondaryColor }}>{p.name}</span>
                {p.description && <p className="text-xs text-gray-600">{p.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Template 03 - Creative Bold with dynamic colors (ADDED PROFILE IMAGE)
const Template03 = ({ resume }: { resume: Resume }) => {
  // Get colors from template or use defaults
  const colors = resume.template?.colorPalette || ["#059669", "#065f46", "#10b981"];
  const [primaryColor, secondaryColor, accentColor] = colors;

  const profileInfo = resume.profileInfo || { fullName: "", designation: "", summary: "", profilePreviewUrl: "" };
  const contactInfo = resume.contactInfo || { email: "", phone: "", location: "", linkedIn: "", github: "", website: "" };
  const workExperiences = resume.workExperiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const languages = resume.languages || [];
  const interests = resume.interests || [];

  return (
    <div className="h-full w-full bg-white" style={{ fontFamily: "'Montserrat', 'Segoe UI', sans-serif", color: secondaryColor }}>
      {/* Header with gradient bar using dynamic colors - ADDED profile image */}
      <div className="px-6 py-5 text-white flex items-start gap-4" style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}>
        {/* Profile Image - ADDED */}
        {profileInfo.profilePreviewUrl && (
          <div className="flex-shrink-0">
            <img 
              src={profileInfo.profilePreviewUrl} 
              alt={profileInfo.fullName}
              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-lg" 
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-extrabold tracking-tight">{profileInfo.fullName || "Your Name"}</h1>
          <p className="text-sm font-light opacity-90">{profileInfo.designation || "Your Title"}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs opacity-80">
            {contactInfo.email && <span>{contactInfo.email}</span>}
            {contactInfo.phone && <span>• {contactInfo.phone}</span>}
            {contactInfo.location && <span>• {contactInfo.location}</span>}
            {contactInfo.github && <span>• {contactInfo.github}</span>}
            {contactInfo.linkedIn && <span>• {contactInfo.linkedIn}</span>}
            {contactInfo.website && <span>• {contactInfo.website}</span>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary with accent border */}
        {profileInfo.summary && (
          <div className="mb-4 rounded-lg border-l-4 p-3" style={{ borderColor: primaryColor, backgroundColor: primaryColor + '10' }}>
            <p className="text-xs leading-relaxed text-gray-700">{profileInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            {workExperiences.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase" style={{ color: primaryColor }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Experience
                </h2>
                {workExperiences.map((w, i) => (
                  <div key={i} className="mb-2 border-l-2 pl-3" style={{ borderColor: primaryColor + '30' }}>
                    <p className="text-xs font-semibold" style={{ color: secondaryColor }}>{w.role}</p>
                    <p className="text-xs" style={{ color: primaryColor }}>
                      {w.company} • {w.startDate} – {w.endDate || "Present"}
                    </p>
                    {w.description && <p className="mt-0.5 text-xs text-gray-500">{w.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase" style={{ color: primaryColor }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Projects
                </h2>
                {projects.map((p, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-xs font-semibold" style={{ color: secondaryColor }}>{p.name}</p>
                    {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
                    <div className="flex gap-2 mt-1">
                      {p.githubLink && (
                        <a href={p.githubLink} className="text-xs hover:underline" style={{ color: primaryColor }} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      )}
                      {p.liveDemo && (
                        <a href={p.liveDemo} className="text-xs hover:underline" style={{ color: primaryColor }} target="_blank" rel="noopener noreferrer">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {educations.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase" style={{ color: primaryColor }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Education
                </h2>
                {educations.map((e, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-xs font-semibold" style={{ color: secondaryColor }}>{e.degree}</p>
                    <p className="text-xs text-gray-500">{e.institution} • {e.startDate} – {e.endDate}</p>
                  </div>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase" style={{ color: primaryColor }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Skills
                </h2>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s, i) => (
                    <span key={i} className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: primaryColor + '20', color: secondaryColor }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase" style={{ color: primaryColor }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Certifications
                </h2>
                {certifications.map((c, i) => (
                  <div key={i} className="mb-1 text-xs">
                    <span style={{ color: secondaryColor }}>{c.title}</span> — {c.issuingOrganization}
                  </div>
                ))}
              </div>
            )}

            {languages.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase" style={{ color: primaryColor }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Languages
                </h2>
                <div className="space-y-2">
                  {languages.map((l, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: secondaryColor }}>{l.name}</span>
                        <span className="text-gray-500">{l.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${l.progress}%`, backgroundColor: primaryColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {interests.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase" style={{ color: primaryColor }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Interests
                </h2>
                <div className="flex flex-wrap gap-1">
                  {interests.map((interest, i) => (
                    <span key={i} className="rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: primaryColor + '10', color: secondaryColor }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumePreview = ({ resume, scale = 0.5 }: Props) => {
  // Add error boundary
  try {
    const templateId = resume.template?.theme || "01";
    
    // Log for debugging
    console.log("Rendering with colors:", resume.template?.colorPalette);

    return (
      <div className="overflow-hidden rounded-lg resume-shadow" style={{ width: 794 * scale, height: 1123 * scale }}>
        <div
          style={{
            width: 794,
            height: 1123,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {templateId === "01" && <Template01 resume={resume} />}
          {templateId === "02" && <Template02 resume={resume} />}
          {templateId === "03" && <Template03 resume={resume} />}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering template:", error);
    return (
      <div className="flex items-center justify-center bg-red-50 p-8 text-red-500">
        Error loading template. Please check console.
      </div>
    );
  }
};

export default ResumePreview;