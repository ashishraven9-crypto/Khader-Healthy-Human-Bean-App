/*
 * DESIGN: Organic Wellness Home Page
 * Hero with watercolor background, feature cards with organic shapes
 * Spring animations, warm sage/cream/terracotta palette
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  BarChart3,
  Wrench,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Shield,
  Activity,
  Brain,
  Droplets,
  Moon as MoonIcon,
  Scale,
  Heart,
  Sparkles,
  ChevronRight,
  Leaf,
  Users,
  Clock,
} from "lucide-react";

// Animated counter hook
function useCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/hero-wellness-39SPgreZpqYxec7Hie2P8W.webp";
const SYMPTOM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/symptom-checker-bg-5HdnguaK5dJp9WNKE922Xs.webp";
const DASHBOARD_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/health-dashboard-bg-mgVaxK5gwaafEySoZbCMoj.webp";
const WELLNESS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/wellness-tools-bg-FpFU8wmwzzey6N7nT3dUoH.webp";
const EMERGENCY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/emergency-bg-9QahftvhpRkHhfHDqc9uoE.webp";

const features = [
  {
    title: "Symptom Checker",
    description: "Intelligent health triage with comprehensive symptom analysis and personalized recommendations.",
    icon: Stethoscope,
    href: "/symptom-checker",
    image: SYMPTOM_IMG,
    color: "bg-sage/10 text-sage",
    accent: "from-sage/5 to-transparent",
  },
  {
    title: "Health Dashboard",
    description: "Track your wellness journey with interactive charts, health scores, and trend analytics.",
    icon: BarChart3,
    href: "/dashboard",
    image: DASHBOARD_IMG,
    color: "bg-terracotta/10 text-terracotta",
    accent: "from-terracotta/5 to-transparent",
  },
  {
    title: "Wellness Tools",
    description: "BMI calculator, hydration tracker, sleep quality assessment, and more wellness utilities.",
    icon: Wrench,
    href: "/wellness-tools",
    image: WELLNESS_IMG,
    color: "bg-moss/10 text-moss",
    accent: "from-moss/5 to-transparent",
  },
  {
    title: "Emergency Services",
    description: "Quick access to emergency contacts, nearby hospitals, and first aid guidance.",
    icon: AlertTriangle,
    href: "/emergency",
    image: EMERGENCY_IMG,
    color: "bg-coral/10 text-coral",
    accent: "from-coral/5 to-transparent",
  },
  {
    title: "Health Library",
    description: "Searchable medical knowledge base with trusted articles on nutrition, fitness, and prevention.",
    icon: BookOpen,
    href: "/health-library",
    image: WELLNESS_IMG,
    color: "bg-amber-warm/10 text-amber-warm",
    accent: "from-amber-warm/5 to-transparent",
  },
  {
    title: "Risk Assessment",
    description: "Comprehensive multi-factor health risk analysis across cardiovascular, mental, nutrition, and fitness.",
    icon: Shield,
    href: "/risk-assessment",
    image: DASHBOARD_IMG,
    color: "bg-primary/10 text-primary",
    accent: "from-primary/5 to-transparent",
  },
];

const stats = [
  { label: "Health Topics", value: 200, suffix: "+", icon: BookOpen },
  { label: "Symptoms Tracked", value: 150, suffix: "+", icon: Activity },
  { label: "Wellness Tools", value: 8, suffix: "+", icon: Wrench },
  { label: "Users Helped", value: 5000, suffix: "+", icon: Users },
];

const wellnessAreas = [
  { icon: Brain, label: "Mental Health", desc: "Stress & anxiety assessment" },
  { icon: Heart, label: "Heart Health", desc: "Cardiovascular risk analysis" },
  { icon: Droplets, label: "Hydration", desc: "Daily water intake tracking" },
  { icon: MoonIcon, label: "Sleep Quality", desc: "Sleep pattern analysis" },
  { icon: Scale, label: "Body Metrics", desc: "BMI & body composition" },
  { icon: Activity, label: "Fitness", desc: "Activity level monitoring" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.3 } },
};

function StatCard({ stat, index }: { stat: typeof stats[number]; index: number }) {
  const { count, ref } = useCounter(stat.value);
  const Icon = stat.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-serif text-xl text-foreground">
          {count.toLocaleString()}{stat.suffix}
        </p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="grain-overlay">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMG}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 blob-shape blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-terracotta/5 blob-shape blur-3xl" />

        <div className="container relative z-10 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge
                variant="secondary"
                className="mb-5 px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full"
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                Your Personal Health Companion
              </Badge>
            </motion.div>

            <motion.h1
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight text-foreground mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              Nurture Your{" "}
              <span className="text-primary">Wellbeing</span>,{" "}
              <span className="italic">Naturally</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              A comprehensive health assessment platform that helps you understand your symptoms,
              track your wellness, and make informed health decisions with confidence.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Link href="/symptom-checker">
                <Button size="lg" className="rounded-full px-6 gap-2 shadow-lg shadow-primary/20">
                  Start Health Check
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="rounded-full px-6 gap-2">
                  View Dashboard
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative -mb-1">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 60C240 20 480 80 720 60C960 40 1200 80 1440 60V120H0V60Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 -mt-1 bg-background relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return <StatCard key={stat.label} stat={stat} index={i} />;
            })}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <motion.div
            className="text-center mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">
              Core Features
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              Everything You Need for{" "}
              <span className="text-primary italic">Better Health</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From symptom analysis to wellness tracking, our tools work together to give you
              a complete picture of your health.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={item}>
                  <Link href={feature.href}>
                    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
                      <CardContent className="p-0">
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${feature.accent}`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                          <div className={`absolute bottom-4 left-4 w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="p-5 pt-3">
                          <h3 className="font-serif text-xl text-card-foreground mb-1.5 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                          <div className="flex items-center gap-1 mt-3 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Wellness Areas Grid */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
              Holistic Wellness <span className="text-primary italic">Coverage</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We cover every aspect of your health journey, from mental wellness to physical fitness.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {wellnessAreas.map((area, i) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-base text-foreground mb-0.5">{area.label}</h3>
                  <p className="text-xs text-muted-foreground">{area.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">
              Simple Process
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
              How It <span className="text-primary italic">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to take control of your health journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe Symptoms",
                desc: "Answer a series of guided questions about how you're feeling. Our intelligent system adapts to your responses.",
                icon: Stethoscope,
              },
              {
                step: "02",
                title: "Get Analysis",
                desc: "Receive a comprehensive health assessment with risk levels, possible conditions, and personalized recommendations.",
                icon: Activity,
              },
              {
                step: "03",
                title: "Take Action",
                desc: "Follow tailored guidance, track your progress over time, and access emergency resources when needed.",
                icon: Shield,
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-6xl font-serif text-primary/10 absolute -top-4 -left-2">{s.step}</div>
                <div className="relative pt-8 pl-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-muted-foreground/20">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">
              Trusted by Many
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
              What People <span className="text-primary italic">Say</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The symptom checker helped me understand my recurring headaches. The recommendations were spot-on and I finally got the right treatment.",
                name: "Sarah M.",
                role: "Teacher",
                rating: 5,
              },
              {
                quote: "I use the wellness tools daily. The hydration tracker and sleep assessment have genuinely improved my daily routine and energy levels.",
                name: "James K.",
                role: "Software Engineer",
                rating: 5,
              },
              {
                quote: "The health risk assessment opened my eyes to areas I was neglecting. The personalized tips were practical and easy to follow.",
                name: "Dr. Priya R.",
                role: "Nutritionist",
                rating: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="border-border/50 h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Sparkles key={j} className="w-4 h-4 text-amber-warm" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-serif text-sm text-primary">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 p-8 lg:p-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blob-shape blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-terracotta/5 blob-shape blur-3xl" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
                Ready to Take Control of Your <span className="text-primary italic">Health</span>?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Start with a quick symptom check or explore our comprehensive wellness tools.
                Your health journey begins here.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/symptom-checker">
                  <Button size="lg" className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20">
                    Begin Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/health-library">
                  <Button variant="outline" size="lg" className="rounded-full px-8 gap-2">
                    Browse Library
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
