import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-resume.jpg";
import modernPreview from "@/assets/templates/modern-preview.png";
import creativePreview from "@/assets/templates/creative-preview.png";
import classic from "@/assets/templates/classic.png"
import { Eye, Shield, Palette, Zap, Crown, Check } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Shield, title: "ATS-Friendly", desc: "Built to pass Applicant Tracking Systems with clean, semantic formatting." },
  { icon: Eye, title: "Live Preview", desc: "See changes in real-time as you build your resume. What you see is what you get." },
  { icon: Palette, title: "Pro Templates", desc: "Choose from beautifully designed templates that make your resume stand out." },
  { icon: Zap, title: "One-Click Export", desc: "Download your resume as PDF or share it via email instantly." },
];

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    features: ["1 Resume Template", "ATS-Friendly Format", "Live Preview", "PDF Download", "Basic Support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹999",
    period: "/lifetime",
    features: ["All 3 Pro Templates", "ATS-Friendly Format", "Live Preview", "PDF Download", "Email Resume", "Priority Support", "Profile Image Upload"],
    cta: "Upgrade Now",
    highlight: true,
  },
];

const templates = [
  {
    name: "Minimal Classic",
    image: classic,
    isPremium: false,
  },
  {
    name: "Modern Two-Column",
    image: modernPreview,
    isPremium: true,
  },
  {
    name: "Creative Bold",
    image: creativePreview,
    isPremium: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />
        </div>
        <div className="container relative mx-auto grid gap-12 px-4 lg:grid-cols-2 lg:items-center">
          <motion.div initial="hidden" animate="visible" className="max-w-xl">
            <motion.div variants={fadeUp} custom={0} className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-primary" /> ATS-Friendly Resumes
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
              Build Resumes<br />
              <span className="text-gradient">Like a Pro</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg text-muted-foreground">
              Create stunning, ATS-optimized resumes with live preview. Choose from professional templates and land your dream job.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex gap-3">
              <Link to="/register">
                <Button size="lg" className="btn-glow px-8">
                  Start Building — It's Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline">
                  View Plans
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="animate-float">
              <img
                src={heroImage}
                alt="Resume Builder Preview"
                className="w-full rounded-2xl glow-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold">
              Everything You Need to <span className="text-gradient">Stand Out</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Our tools are designed to help you create professional resumes that get noticed by recruiters and ATS systems.
            </motion.p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="glass-card group rounded-xl p-6 transition-all hover:glow-primary"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Templates Preview with Images */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Professional <span className="text-gradient-accent">Templates</span></h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Choose from 3 beautifully crafted templates — each designed for ATS compatibility and visual impact.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template, i) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card group overflow-hidden rounded-xl transition-all hover:glow-primary"
              >
                <div className="aspect-[794/1123] relative overflow-hidden bg-secondary">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {template.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Crown className="h-5 w-5 text-accent" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-foreground">{template.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.isPremium ? "Premium" : "Free"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Simple <span className="text-gradient">Pricing</span></h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Start free, upgrade when you're ready.</p>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`w-80 rounded-2xl p-8 text-left ${
                  plan.highlight ? "glass-card glow-primary border border-primary/30" : "glass-card"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Crown className="h-3 w-3" /> Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.highlight ? "/pricing" : "/register"} className="mt-6 block">
                  <Button className={`w-full ${plan.highlight ? "btn-glow" : ""}`} variant={plan.highlight ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;