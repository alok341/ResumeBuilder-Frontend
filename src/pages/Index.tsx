import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-resume.jpg";
import modernPreview from "@/assets/templates/modern-preview.png";
import creativePreview from "@/assets/templates/creative-preview.png";
import classic from "@/assets/templates/classic.png";
import { useAuth } from "@/contexts/AuthContext"; // Add this import
import { 
  Eye, 
  Shield, 
  Palette, 
  Zap, 
  Crown, 
  Check, 
  Sparkles,
  Rocket,
  Star,
  Award,
  Users,
  Briefcase,
  FileText,
  Download,
  Mail,
  Image,
  Layout,
  Clock,
  Globe,
  Layers,
  ArrowDown
} from "lucide-react";

// Fixed fadeUp animation with proper Variants typing
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: i * 0.1, 
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]
    } 
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const features = [
  { 
    icon: Shield, 
    title: "ATS-Friendly", 
    desc: "Clean, semantic formatting that passes through applicant tracking systems effortlessly.",
    benefits: ["No complex tables", "Standard fonts", "Proper headings"]
  },
  { 
    icon: Eye, 
    title: "Live Preview", 
    desc: "See your changes in real-time as you build. No more switching between tabs.",
    benefits: ["Instant updates", "WYSIWYG editor", "Mobile preview"]
  },
  { 
    icon: Palette, 
    title: "3 Pro Templates", 
    desc: "Choose from classic, modern, or creative designs. Each fully customizable.",
    benefits: ["Minimal Classic", "Modern Two-Column", "Creative Bold"]
  },
  { 
    icon: Zap, 
    title: "Quick Export", 
    desc: "Download as PDF or share via email in one click. Ready to send to employers.",
    benefits: ["PDF export", "Email sharing", "Print ready"]
  },
];

const templateDetails = [
  {
    name: "Minimal Classic",
    image: classic,
    isPremium: false,
    description: "Timeless one-column design perfect for traditional industries",
    ideal: "Business, Education, Government",
    features: ["Clean layout", "Professional fonts", "Chronological format"]
  },
  {
    name: "Modern Two-Column",
    image: modernPreview,
    isPremium: true,
    description: "Contemporary layout that maximizes space for tech professionals",
    ideal: "Tech, IT, Engineering",
    features: ["Skills sidebar", "Project showcase", "Compact design"]
  },
  {
    name: "Creative Bold",
    image: creativePreview,
    isPremium: true,
    description: "Eye-catching design for creative roles that need visual impact",
    ideal: "Design, Marketing, Media",
    features: ["Color accents", "Visual hierarchy", "Portfolio ready"]
  },
];

const plans = [
  {
    name: "Free",
    price: "Free",
    period: "",
    description: "Perfect for getting started",
    features: [
      "Minimal Classic Template",
      "ATS-Friendly Format",
      "Live Preview Editor",
      "PDF Download",
      "Basic email support"
    ],
    cta: "Start Free",
    highlight: false,
    icon: Star,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "one-time",
    description: "For serious job seekers",
    features: [
      "All 3 Professional Templates",
      "Profile Image Upload",
      "Custom Color Themes",
      "Email Resume Sharing",
      "Priority Support",
      "Lifetime Access",
      "Unlimited Downloads"
    ],
    cta: "Get Pro Access",
    highlight: true,
    icon: Crown,
  },
];

const Index = () => {
  const { user } = useAuth(); // Add this line to get user authentication state
  const heroRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle CTA button clicks based on auth state
  const handleCTAClick = () => {
    if (user) {
      // If user is logged in, go to dashboard
      window.location.href = "/dashboard";
    } else {
      // If not logged in, go to register
      window.location.href = "/register";
    }
  };

 const handleImageClick = (image: string, name: string) => {
  setSelectedImage(image);
  setSelectedTemplateName(name);
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
};
const closeModal = () => {
  setSelectedImage(null);
  setSelectedTemplateName("");
  // Restore body scrolling
  document.body.style.overflow = 'unset';
};
  // Function to handle template access
  const handleTemplateClick = (isPremium: boolean) => {
    if (isPremium) {
      window.location.href = "/pricing";
    } else {
      if (user) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/register";
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-[120px] delay-1000" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container relative mx-auto grid gap-12 px-4 lg:grid-cols-2 lg:items-center"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-xl"
          >
            <motion.div 
              variants={fadeUp} 
              custom={0} 
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Create your professional resume in minutes</span>
            </motion.div>

            <motion.h1 
              variants={fadeUp} 
              custom={1} 
              className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl"
            >
              Build a <span className="text-primary">standout</span>{" "}
              <br />
              resume that gets noticed
            </motion.h1>

            <motion.p 
              variants={fadeUp} 
              custom={2} 
              className="mt-6 text-lg leading-relaxed text-muted-foreground"
            >
              Three professionally designed templates, real-time preview, and one-click export. 
              Everything you need to create an ATS-friendly resume that lands interviews.
            </motion.p>

            <motion.div 
              variants={fadeUp} 
              custom={3} 
              className="mt-10 flex flex-wrap gap-4"
            >
              {/* Fixed: Use button with onClick instead of Link */}
              <Button 
                size="lg" 
                className="group relative overflow-hidden px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                onClick={handleCTAClick}
              >
                <span className="relative z-10">
                  {user ? "Go to Dashboard" : "Create Your Resume"}
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="group px-8 py-6 text-lg border-2 border-primary text-primary hover:bg-primary/10 cursor-pointer"
                onClick={scrollToTemplates}
              >
                View Templates
                <ArrowDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
              </Button>
            </motion.div>

            {/* Feature highlights */}
            <motion.div 
              variants={fadeUp} 
              custom={4} 
              className="mt-12 grid grid-cols-3 gap-4"
            >
              {[
                { icon: Layout, label: "3 Templates" },
                { icon: Download, label: "PDF Export" },
                { icon: Globe, label: "ATS Ready" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative animate-float">
              <div className="absolute -inset-1 rounded-3xl bg-primary opacity-30 blur-2xl" />
              <img
                src={heroImage}
                alt="Resume Builder Preview"
                className="relative rounded-2xl border border-border/50 shadow-2xl"
              />
              
              {/* Feature badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-12 top-1/4 rounded-lg bg-background/95 backdrop-blur-sm border border-border px-4 py-2 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Real-time preview</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-12 bottom-1/4 rounded-lg bg-background/95 backdrop-blur-sm border border-border px-4 py-2 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">One-click PDF</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      </section>
// Template Showcase Section
<section ref={templatesRef} id="templates" className="py-24 bg-muted/30 scroll-mt-20">
  <div className="container mx-auto px-4">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="text-center max-w-3xl mx-auto"
    >
      <motion.span 
        variants={fadeUp}
        custom={0}
        className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
      >
        Choose Your Style
      </motion.span>
      <motion.h2 
        variants={fadeUp}
        custom={1}
        className="text-4xl font-bold"
      >
        Professional <span className="text-primary">Templates</span>
      </motion.h2>
      <motion.p 
        variants={fadeUp}
        custom={2}
        className="mt-4 text-lg text-muted-foreground"
      >
        Each template is crafted for ATS compatibility while maintaining visual appeal.
        Pick the one that best represents your professional story.
      </motion.p>
    </motion.div>

    <div className="mt-16 grid gap-8 md:grid-cols-3">
      {templateDetails.map((template, i) => (
        <motion.div
          key={template.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg hover:shadow-xl transition-all">
            {/* Template image - click to expand */}
            <div 
              className="relative h-80 w-full cursor-pointer overflow-hidden"
              onClick={() => handleImageClick(template.image, template.name)}
            >
              <img
                src={template.image}
                alt={template.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Zoom indicator overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-background/90 rounded-full p-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
              </div>
              
              {/* Premium badge - always visible */}
              {template.isPremium && (
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
                  <Crown className="mr-1 inline h-3 w-3" />
                  Pro Template
                </div>
              )}
              
              {/* Free badge - always visible */}
              {!template.isPremium && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
                  Free
                </div>
              )}
            </div>

            {/* Template info - always visible below image */}
            <div className="p-6 bg-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-semibold text-foreground">
                  {template.name}
                </h4>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>
              
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Perfect for: <span className="text-foreground">{template.ideal}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full"
                variant={template.isPremium ? "default" : "outline"}
                onClick={() => handleTemplateClick(template.isPremium)}
              >
                {template.isPremium 
                  ? "Upgrade to Access" 
                  : user 
                    ? "Start Building" 
                    : "Use Free Template"}
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Lightbox Modal for enlarged image - FIXED VERSION */}
    {selectedImage && (
      <div 
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={closeModal}
      >
        <div className="relative h-full w-full flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between p-4 text-white border-b border-white/10">
            <h3 className="text-lg font-semibold">
              {selectedTemplateName}
            </h3>
            <div className="flex items-center gap-4">
              <a
                href={selectedImage}
                download={`${selectedTemplateName.replace(/\s+/g, '-').toLowerCase()}-template.png`}
                className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span className="text-sm hidden sm:inline">Download</span>
              </a>
              <button
                onClick={closeModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable image container */}
          <div className="flex-1 overflow-auto p-4">
            <div className="min-h-full flex items-start justify-center">
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                src={selectedImage}
                alt={selectedTemplateName}
                className="max-w-full w-auto h-auto rounded-lg shadow-2xl"
                style={{ 
                  maxHeight: 'none',
                  width: 'auto',
                  height: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Footer with instructions */}
          <div className="p-2 text-center text-white/50 text-xs border-t border-white/10">
            Scroll to see full template • Click outside to close
          </div>
        </div>
      </div>
    )}
  </div>
</section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span 
              variants={fadeUp}
              custom={0}
              className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              Why Choose ResumeBuilder
            </motion.span>
            <motion.h2 
              variants={fadeUp}
              custom={1}
              className="text-4xl font-bold"
            >
              Everything you need to <br />
              <span className="text-primary">
                land your next role
              </span>
            </motion.h2>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 rounded-2xl bg-primary opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
                  <div className="glass-card relative h-full rounded-2xl p-6 transition-all group-hover:border-primary/30 group-hover:shadow-lg">
                    <div className="inline-flex rounded-xl bg-primary p-3 text-primary-foreground shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span 
              variants={fadeUp}
              custom={0}
              className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              Simple 3-Step Process
            </motion.span>
            <motion.h2 
              variants={fadeUp}
              custom={1}
              className="text-4xl font-bold"
            >
              Create your resume in <span className="text-primary">minutes</span>
            </motion.h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose Template",
                desc: "Select from 3 professionally designed templates that match your industry",
                icon: Layout
              },
              {
                step: "02",
                title: "Add Your Details",
                desc: "Fill in your experience, education, and skills with our intuitive editor",
                icon: FileText
              },
              {
                step: "03",
                title: "Export & Apply",
                desc: "Download as PDF or share via email. Start applying to jobs immediately",
                icon: Download
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  <div className="inline-flex rounded-2xl bg-primary/10 p-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-4 text-5xl font-bold text-primary/20">{item.step}</div>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span 
              variants={fadeUp}
              custom={0}
              className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              Simple Pricing
            </motion.span>
            <motion.h2 
              variants={fadeUp}
              custom={1}
              className="text-4xl font-bold"
            >
              Start free, upgrade when you're ready
            </motion.h2>
            <motion.p 
              variants={fadeUp}
              custom={2}
              className="mt-4 text-lg text-muted-foreground"
            >
              No credit card required. One classic template included in the free plan.
            </motion.p>
          </motion.div>

          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={plan.highlight ? { scale: 1.02 } : { scale: 1.01 }}
                  className={`relative w-96 rounded-3xl p-8 ${
                    plan.highlight 
                      ? "border-2 border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-2xl" 
                      : "glass-card border border-border"
                  }`}
                >
                  {plan.highlight && (
                    <>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
                          <Crown className="h-4 w-4" />
                          Most Popular
                        </span>
                      </div>
                      <div className="absolute -inset-0.5 rounded-3xl bg-primary opacity-20 blur" />
                    </>
                  )}

                  <div className="relative">
                    <div className={`inline-flex rounded-xl ${
                      plan.highlight ? "bg-primary" : "bg-primary/20"
                    } p-3`}>
                      <Icon className={`h-6 w-6 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`} />
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-foreground">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>

                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-foreground">
                        {plan.price}
                      </span>
                      {plan.period && plan.period !== "" && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          /{plan.period}
                        </span>
                      )}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                            plan.highlight ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Fixed: Handle CTA based on auth state */}
                    <div className="mt-8 block">
                      <Button 
                        className={`w-full py-6 text-base font-medium ${
                          plan.highlight 
                            ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90" 
                            : "border-primary text-primary hover:bg-primary/10"
                        }`}
                        variant={plan.highlight ? "default" : "outline"}
                        size="lg"
                        onClick={() => {
                          if (plan.name === "Free") {
                            if (user) {
                              window.location.href = "/dashboard";
                            } else {
                              window.location.href = "/register";
                            }
                          } else {
                            window.location.href = "/pricing";
                          }
                        }}
                      >
                        {plan.name === "Free" && user ? "Go to Dashboard" : plan.cta}
                      </Button>
                    </div>

                    {plan.name === "Free" && (
                      <p className="mt-4 text-center text-xs text-muted-foreground">
                        No credit card required
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-primary/5 p-12 text-center lg:p-20 border border-primary/10"
          >
            <div className="absolute inset-0">
              <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
              <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
                Ready to create your professional resume?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Join thousands of job seekers who've built better resumes with our templates. 
                Start free, upgrade anytime.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {/* Fixed: Use button with onClick instead of Link */}
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg shadow-lg hover:shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  onClick={handleCTAClick}
                >
                  {user ? "Go to Dashboard" : "Create Your Resume"}
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-2 border-primary text-primary hover:bg-primary/10 cursor-pointer"
                  onClick={scrollToTemplates}
                >
                  View Templates
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                ✨ Free plan includes one classic template • Pro access unlocks all features
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;