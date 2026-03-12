/*
 * DESIGN: Organic Wellness Layout
 * Floating pill navigation, organic shapes, warm sage/cream palette
 * DM Serif Display headings, DM Sans body
 * Scroll-to-top button, enhanced footer with newsletter-style CTA
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Heart,
  Stethoscope,
  BarChart3,
  Wrench,
  AlertTriangle,
  BookOpen,
  Shield,
  Menu,
  Sun,
  Moon,
  Leaf,
  ArrowUp,
  Github,
  Mail,
  Phone,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Heart },
  { path: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/wellness-tools", label: "Wellness Tools", icon: Wrench },
  { path: "/emergency", label: "Emergency", icon: AlertTriangle },
  { path: "/health-library", label: "Library", icon: BookOpen },
  { path: "/risk-assessment", label: "Risk Assessment", icon: Shield },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-2.5 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg leading-tight tracking-tight text-foreground">
                  Healthy Human Bean
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                  Wellness Companion
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-secondary/60 backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-border/40">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary rounded-full"
                        transition={{ type: "spring" as const, bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10 hidden xl:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-9 h-9"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full w-9 h-9"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="p-5 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-serif text-lg">Healthy Human Bean</span>
                    </div>
                  </div>
                  <nav className="flex-1 p-3">
                    {navItems.map((item) => {
                      const isActive = location === item.path;
                      const Icon = item.icon;
                      return (
                        <Link key={item.path} href={item.path}>
                          <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="p-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl gap-2"
                      onClick={toggleTheme}
                    >
                      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-18">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary/90 transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/30 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/3 blob-shape blur-3xl" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-primary/3 blob-shape blur-3xl" />

        <div className="container relative z-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="font-serif text-xl">Healthy Human Bean</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-5">
                Your comprehensive wellness companion. Track symptoms, monitor health metrics,
                and access trusted medical information — all in one nurturing space.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/ashishraven9-crypto/Khader-Healthy-Human-Bean-App"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:hello@healthyhumanbean.com"
                  className="w-9 h-9 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Features Column */}
            <div className="md:col-span-3">
              <h4 className="font-serif text-sm mb-4 text-foreground">Features</h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/symptom-checker" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Symptom Checker
                </Link>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Health Dashboard
                </Link>
                <Link href="/wellness-tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Wellness Tools
                </Link>
              </div>
            </div>

            {/* Resources Column */}
            <div className="md:col-span-2">
              <h4 className="font-serif text-sm mb-4 text-foreground">Resources</h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/health-library" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Health Library
                </Link>
                <Link href="/emergency" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Emergency
                </Link>
                <Link href="/risk-assessment" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Risk Assessment
                </Link>
              </div>
            </div>

            {/* Contact Column */}
            <div className="md:col-span-2">
              <h4 className="font-serif text-sm mb-4 text-foreground">Support</h4>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>112 (Emergency)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>108 (Ambulance)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="w-3.5 h-3.5" />
                  <span>100 (Police)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border/30 flex flex-col items-center gap-4">
            <p className="text-xs text-muted-foreground text-center">
              This app provides general health information only and is not a substitute for professional medical advice.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-primary/30" />
              <p className="text-sm font-serif font-semibold text-primary">
                Made with <Heart className="w-3.5 h-3.5 inline-block text-coral fill-coral mx-0.5 -mt-0.5" /> by Khader
              </p>
              <div className="h-px w-8 bg-primary/30" />
            </div>
            <p className="text-[10px] text-muted-foreground/60">
              &copy; {new Date().getFullYear()} Healthy Human Bean. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
