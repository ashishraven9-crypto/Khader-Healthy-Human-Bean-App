/*
 * DESIGN: Organic Wellness Emergency Page
 * Emergency contacts, first aid guides, hospital finder
 * Warm sage/cream palette with coral emergency accents
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Heart,
  Shield,
  Flame,
  Droplets,
  Zap,
  Bug,
  Bone,
  Brain,
  Eye,
  ThermometerSun,
  Siren,
  Cross,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";

const EMERGENCY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/emergency-bg-9QahftvhpRkHhfHDqc9uoE.webp";

const emergencyNumbers = [
  { country: "United States", number: "911", label: "Emergency Services" },
  { country: "United Kingdom", number: "999", label: "Emergency Services" },
  { country: "European Union", number: "112", label: "Emergency Services" },
  { country: "Australia", number: "000", label: "Emergency Services" },
  { country: "India", number: "112", label: "Emergency Services" },
  { country: "Canada", number: "911", label: "Emergency Services" },
  { country: "Japan", number: "119", label: "Ambulance" },
  { country: "China", number: "120", label: "Ambulance" },
];

const helplines = [
  { name: "Suicide Prevention Lifeline", number: "988", desc: "24/7 crisis support", icon: Brain },
  { name: "Poison Control", number: "1-800-222-1222", desc: "Poisoning emergencies", icon: Bug },
  { name: "Domestic Violence Hotline", number: "1-800-799-7233", desc: "Safety and support", icon: Shield },
  { name: "Crisis Text Line", number: "Text HOME to 741741", desc: "Text-based crisis support", icon: Phone },
];

const firstAidGuides = [
  {
    id: "cpr",
    title: "CPR (Cardiopulmonary Resuscitation)",
    icon: Heart,
    severity: "critical",
    steps: [
      "Check the scene for safety and check the person for responsiveness.",
      "Call 911 or ask someone else to call immediately.",
      "Place the person on their back on a firm, flat surface.",
      "Place the heel of one hand on the center of the chest, between the nipples.",
      "Place your other hand on top, interlocking fingers.",
      "Push hard and fast — at least 2 inches deep, at a rate of 100-120 compressions per minute.",
      "After 30 compressions, tilt the head back, lift the chin, and give 2 rescue breaths.",
      "Continue cycles of 30 compressions and 2 breaths until help arrives.",
    ],
  },
  {
    id: "choking",
    title: "Choking (Heimlich Maneuver)",
    icon: Zap,
    severity: "critical",
    steps: [
      "Ask the person if they are choking. If they cannot speak, cough, or breathe, act immediately.",
      "Stand behind the person and wrap your arms around their waist.",
      "Make a fist with one hand and place it above the navel, below the ribcage.",
      "Grasp your fist with your other hand.",
      "Perform quick, upward thrusts into the abdomen.",
      "Repeat until the object is dislodged or the person can breathe.",
      "If the person becomes unconscious, begin CPR and call 911.",
    ],
  },
  {
    id: "bleeding",
    title: "Severe Bleeding",
    icon: Droplets,
    severity: "high",
    steps: [
      "Call 911 if bleeding is severe or won't stop.",
      "Apply direct pressure to the wound using a clean cloth or bandage.",
      "If blood soaks through, add more cloth on top — do not remove the first layer.",
      "Elevate the injured area above the heart if possible.",
      "Apply a tourniquet only if direct pressure fails and bleeding is life-threatening.",
      "Keep the person warm and calm while waiting for help.",
    ],
  },
  {
    id: "burns",
    title: "Burns",
    icon: Flame,
    severity: "moderate",
    steps: [
      "Remove the person from the source of the burn.",
      "Cool the burn under cool (not cold) running water for at least 10-20 minutes.",
      "Remove jewelry or tight clothing near the burn before swelling occurs.",
      "Cover the burn loosely with a sterile, non-stick bandage.",
      "Do NOT apply ice, butter, or ointments to the burn.",
      "For severe burns (large area, deep, or on face/hands/feet), call 911.",
      "Give over-the-counter pain relief if needed.",
    ],
  },
  {
    id: "fracture",
    title: "Fractures & Broken Bones",
    icon: Bone,
    severity: "moderate",
    steps: [
      "Keep the injured area still — do not try to realign the bone.",
      "Apply ice wrapped in cloth to reduce swelling (20 minutes on, 20 minutes off).",
      "Immobilize the area with a splint if available.",
      "Elevate the injured limb if possible.",
      "Call 911 if the bone is protruding, the person cannot move, or there is heavy bleeding.",
      "Treat for shock if the person feels faint or dizzy.",
    ],
  },
  {
    id: "heatstroke",
    title: "Heat Stroke",
    icon: ThermometerSun,
    severity: "high",
    steps: [
      "Call 911 immediately — heat stroke is a medical emergency.",
      "Move the person to a cool, shaded area.",
      "Remove excess clothing.",
      "Cool the person rapidly: apply cold water or ice packs to neck, armpits, and groin.",
      "Fan the person while misting with cool water.",
      "Do NOT give fluids if the person is unconscious.",
      "Monitor body temperature and continue cooling until help arrives.",
    ],
  },
  {
    id: "allergic",
    title: "Severe Allergic Reaction (Anaphylaxis)",
    icon: Bug,
    severity: "critical",
    steps: [
      "Call 911 immediately.",
      "If the person has an EpiPen, help them use it on the outer thigh.",
      "Have the person lie down with legs elevated (unless they have trouble breathing).",
      "Loosen tight clothing.",
      "If breathing stops, begin CPR.",
      "Do NOT give oral medications if the person is having trouble swallowing.",
      "A second dose of epinephrine may be needed if symptoms don't improve in 5-15 minutes.",
    ],
  },
  {
    id: "eye",
    title: "Eye Injuries",
    icon: Eye,
    severity: "moderate",
    steps: [
      "Do NOT rub or press on the injured eye.",
      "For chemical exposure: flush the eye with clean water for at least 15-20 minutes.",
      "For a foreign object: try to flush it out with clean water or saline.",
      "Do NOT try to remove objects embedded in the eye.",
      "Cover the eye loosely with a clean cloth or eye shield.",
      "Seek medical attention promptly for any significant eye injury.",
    ],
  },
];

const severityBadge: Record<string, string> = {
  critical: "bg-coral/10 text-coral border-coral/20",
  high: "bg-terracotta/10 text-terracotta border-terracotta/20",
  moderate: "bg-amber-warm/10 text-amber-warm border-amber-warm/20",
};

export default function EmergencyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = firstAidGuides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grain-overlay min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-coral/5 pb-8 pt-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-coral/5 blob-shape blur-3xl" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-coral" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Emergency Services</h1>
              <p className="text-sm text-muted-foreground">Quick access to emergency help and first aid</p>
            </div>
          </div>

          <Alert className="border-coral/20 bg-coral/5">
            <Siren className="w-4 h-4 text-coral" />
            <AlertTitle className="font-serif text-sm">If this is a life-threatening emergency</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              Call your local emergency number immediately. Do not rely on this app for emergency situations.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <Tabs defaultValue="contacts">
            <TabsList className="bg-secondary/50 rounded-full p-1 mb-6">
              <TabsTrigger value="contacts" className="rounded-full text-xs gap-1.5">
                <Phone className="w-3 h-3" /> Contacts
              </TabsTrigger>
              <TabsTrigger value="firstaid" className="rounded-full text-xs gap-1.5">
                <Cross className="w-3 h-3" /> First Aid
              </TabsTrigger>
              <TabsTrigger value="helplines" className="rounded-full text-xs gap-1.5">
                <Shield className="w-3 h-3" /> Helplines
              </TabsTrigger>
            </TabsList>

            {/* Emergency Contacts */}
            <TabsContent value="contacts">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border/50 mb-6">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Emergency Numbers by Country</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {emergencyNumbers.map((item) => (
                        <div
                          key={item.country}
                          className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-coral/30 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium">{item.country}</p>
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                          </div>
                          <a
                            href={`tel:${item.number}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-coral/10 text-coral text-sm font-bold hover:bg-coral/20 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {item.number}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Find Nearby Hospitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use the button below to search for hospitals and emergency rooms near your current location.
                    </p>
                    <Button
                      className="w-full rounded-xl gap-2"
                      onClick={() => {
                        window.open("https://www.google.com/maps/search/hospital+near+me", "_blank");
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                      Find Hospitals Near Me
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* First Aid Guides */}
            <TabsContent value="firstaid">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search first aid guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {filteredGuides.map((guide) => {
                    const Icon = guide.icon;
                    return (
                      <AccordionItem
                        key={guide.id}
                        value={guide.id}
                        className="border border-border/50 rounded-xl px-4 overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-left">
                              <p className="font-serif text-sm">{guide.title}</p>
                              <Badge variant="secondary" className={`mt-1 text-[10px] rounded-full ${severityBadge[guide.severity]}`}>
                                {guide.severity}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <ol className="space-y-3 ml-11">
                            {guide.steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </motion.div>
            </TabsContent>

            {/* Helplines */}
            <TabsContent value="helplines">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {helplines.map((line) => {
                  const Icon = line.icon;
                  return (
                    <Card key={line.name} className="border-border/50">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-serif text-base">{line.name}</p>
                              <p className="text-xs text-muted-foreground">{line.desc}</p>
                            </div>
                          </div>
                          <a
                            href={`tel:${line.number.replace(/[^0-9]/g, "")}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors whitespace-nowrap"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {line.number}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                <Alert className="border-primary/20 bg-primary/5">
                  <Info className="w-4 h-4 text-primary" />
                  <AlertDescription className="text-sm text-muted-foreground">
                    These helplines are primarily for the United States. If you are in another country,
                    please search for your local crisis helplines.
                  </AlertDescription>
                </Alert>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
