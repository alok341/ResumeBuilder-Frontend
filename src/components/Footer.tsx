import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Github, Linkedin, Mail, Sparkles } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/alok341", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/alokkumar-ajaykumar-dubey-2b68282b9", label: "LinkedIn" },
    { icon: Mail, href: "mailto:dubeyalokkumar2005@gmail.com", label: "Email" }
  ];

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">
              Resume<span className="text-primary">Builder</span>
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Create ATS-friendly resumes that stand out. Professional templates, real-time preview, one-click export.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>

          {/* Stats badge */}
          <div className="flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">
              <span className="text-primary font-bold">3</span> Professional Templates
            </span>
          </div>

          {/* Bottom bar */}
          <div className="w-full pt-4 mt-2 border-t border-border/50">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-xs text-muted-foreground">
                © {currentYear} ResumeBuilder. All rights reserved.
              </p>
              
              <p className="text-xs text-muted-foreground">
                Made by <span className="text-primary font-medium">Alok Kumar Dubey</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;