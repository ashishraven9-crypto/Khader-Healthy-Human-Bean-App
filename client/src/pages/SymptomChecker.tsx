/*
 * DESIGN: Organic Wellness Symptom Checker
 * Multi-step questionnaire with body area selection, severity tracking
 * Progressive disclosure, warm sage/cream palette
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Activity,
  Thermometer,
  Brain,
  Heart,
  Bone,
  Eye,
  Ear,
  Wind,
  Droplets,
  Zap,
  RotateCcw,
} from "lucide-react";

const SYMPTOM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/symptom-checker-bg-5HdnguaK5dJp9WNKE922Xs.webp";

type BodyArea = {
  id: string;
  label: string;
  icon: React.ElementType;
  symptoms: string[];
};

const bodyAreas: BodyArea[] = [
  { id: "head", label: "Head & Brain", icon: Brain, symptoms: ["Headache", "Dizziness", "Migraine", "Confusion", "Memory issues", "Fainting"] },
  { id: "eyes", label: "Eyes", icon: Eye, symptoms: ["Blurred vision", "Eye pain", "Redness", "Watery eyes", "Light sensitivity", "Double vision"] },
  { id: "ears", label: "Ears & Throat", icon: Ear, symptoms: ["Ear pain", "Hearing loss", "Ringing", "Sore throat", "Difficulty swallowing", "Hoarseness"] },
  { id: "chest", label: "Chest & Heart", icon: Heart, symptoms: ["Chest pain", "Palpitations", "Shortness of breath", "Rapid heartbeat", "Chest tightness", "Coughing blood"] },
  { id: "respiratory", label: "Respiratory", icon: Wind, symptoms: ["Cough", "Wheezing", "Shortness of breath", "Congestion", "Runny nose", "Sneezing"] },
  { id: "abdomen", label: "Abdomen", icon: Activity, symptoms: ["Stomach pain", "Nausea", "Vomiting", "Diarrhea", "Constipation", "Bloating"] },
  { id: "musculoskeletal", label: "Muscles & Joints", icon: Bone, symptoms: ["Joint pain", "Muscle aches", "Back pain", "Stiffness", "Swelling", "Weakness"] },
  { id: "skin", label: "Skin", icon: Droplets, symptoms: ["Rash", "Itching", "Swelling", "Bruising", "Dry skin", "Color changes"] },
  { id: "general", label: "General", icon: Thermometer, symptoms: ["Fever", "Fatigue", "Weight changes", "Night sweats", "Chills", "Loss of appetite"] },
  { id: "neurological", label: "Neurological", icon: Zap, symptoms: ["Numbness", "Tingling", "Tremors", "Seizures", "Balance issues", "Coordination problems"] },
];

const durationOptions = [
  { value: "hours", label: "A few hours" },
  { value: "days", label: "1-3 days" },
  { value: "week", label: "About a week" },
  { value: "weeks", label: "2-4 weeks" },
  { value: "months", label: "More than a month" },
  { value: "chronic", label: "Ongoing / Chronic" },
];

const ageGroups = [
  { value: "child", label: "Under 12" },
  { value: "teen", label: "12-17" },
  { value: "young-adult", label: "18-35" },
  { value: "adult", label: "36-55" },
  { value: "senior", label: "56-75" },
  { value: "elderly", label: "75+" },
];

type AssessmentResult = {
  severity: "low" | "moderate" | "high" | "emergency";
  title: string;
  description: string;
  recommendations: string[];
  nextSteps: string[];
};

function getAssessment(
  selectedAreas: string[],
  selectedSymptoms: string[],
  severity: number,
  duration: string,
  additionalInfo: string
): AssessmentResult {
  const hasChestPain = selectedSymptoms.some(s => s.toLowerCase().includes("chest pain"));
  const hasSevereSymptoms = selectedSymptoms.some(s =>
    ["seizures", "coughing blood", "fainting", "confusion"].includes(s.toLowerCase())
  );
  const isHighSeverity = severity >= 8;
  const isChronic = duration === "chronic" || duration === "months";

  if (hasChestPain || hasSevereSymptoms || (isHighSeverity && hasChestPain)) {
    return {
      severity: "emergency",
      title: "Seek Immediate Medical Attention",
      description: "Based on your symptoms, we strongly recommend seeking emergency medical care immediately. Some of your reported symptoms may indicate a serious condition that requires urgent evaluation.",
      recommendations: [
        "Call emergency services (911) or go to the nearest emergency room",
        "Do not drive yourself — have someone take you or call an ambulance",
        "If experiencing chest pain, chew an aspirin if not allergic",
        "Stay calm and try to rest in a comfortable position",
      ],
      nextSteps: [
        "Call 911 or your local emergency number",
        "Go to the nearest emergency department",
        "Bring a list of your current medications",
        "Have someone accompany you if possible",
      ],
    };
  }

  if (isHighSeverity || (severity >= 6 && selectedSymptoms.length >= 4)) {
    return {
      severity: "high",
      title: "See a Doctor Soon",
      description: "Your symptoms suggest you should consult with a healthcare provider within the next 24-48 hours. While not immediately life-threatening, your combination of symptoms warrants professional evaluation.",
      recommendations: [
        "Schedule an urgent appointment with your primary care physician",
        "If symptoms worsen, go to an urgent care center",
        "Keep track of any changes in your symptoms",
        "Stay hydrated and get adequate rest",
        "Avoid strenuous physical activity until evaluated",
      ],
      nextSteps: [
        "Call your doctor's office for an urgent appointment",
        "Visit an urgent care clinic if no appointment is available",
        "Document your symptoms and their timeline",
        "Prepare a list of questions for your doctor",
      ],
    };
  }

  if (severity >= 4 || selectedSymptoms.length >= 3 || isChronic) {
    return {
      severity: "moderate",
      title: "Schedule a Medical Appointment",
      description: "Your symptoms are moderate and should be evaluated by a healthcare professional. We recommend scheduling an appointment within the next week to discuss your concerns.",
      recommendations: [
        "Schedule a regular appointment with your doctor",
        "Monitor your symptoms and note any changes",
        "Try over-the-counter remedies for symptom relief",
        "Maintain good hydration and nutrition",
        "Get adequate rest and avoid overexertion",
      ],
      nextSteps: [
        "Book an appointment with your primary care provider",
        "Keep a symptom diary until your appointment",
        "Try recommended home remedies for comfort",
        "Return here if symptoms significantly worsen",
      ],
    };
  }

  return {
    severity: "low",
    title: "Self-Care Recommended",
    description: "Based on your reported symptoms, home care and monitoring may be appropriate. However, if your symptoms persist or worsen, please consult a healthcare professional.",
    recommendations: [
      "Rest and allow your body time to recover",
      "Stay well-hydrated with water and clear fluids",
      "Use over-the-counter medications as appropriate",
      "Monitor your symptoms over the next few days",
      "Maintain a balanced diet to support recovery",
    ],
    nextSteps: [
      "Follow the self-care recommendations above",
      "Re-assess your symptoms in 2-3 days",
      "See a doctor if symptoms persist beyond a week",
      "Return here anytime to re-evaluate your condition",
    ],
  };
}

const severityColors: Record<string, string> = {
  low: "bg-moss/10 text-moss border-moss/20",
  moderate: "bg-amber-warm/10 text-amber-warm border-amber-warm/20",
  high: "bg-terracotta/10 text-terracotta border-terracotta/20",
  emergency: "bg-coral/10 text-coral border-coral/20",
};

const severityIcons: Record<string, React.ElementType> = {
  low: CheckCircle,
  moderate: Clock,
  high: AlertTriangle,
  emergency: Shield,
};

export default function SymptomChecker() {
  const [step, setStep] = useState(0);
  const [ageGroup, setAgeGroup] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState([5]);
  const [duration, setDuration] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  const availableSymptoms = useMemo(() => {
    return bodyAreas
      .filter((area) => selectedAreas.includes(area.id))
      .flatMap((area) => area.symptoms);
  }, [selectedAreas]);

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId) ? prev.filter((a) => a !== areaId) : [...prev, areaId]
    );
    setSelectedSymptoms([]);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0: return ageGroup !== "";
      case 1: return selectedAreas.length > 0;
      case 2: return selectedSymptoms.length > 0;
      case 3: return true;
      case 4: return duration !== "";
      default: return true;
    }
  };

  const handleSubmit = () => {
    const assessment = getAssessment(selectedAreas, selectedSymptoms, severity[0], duration, additionalInfo);
    setResult(assessment);
    setStep(5);
  };

  const handleReset = () => {
    setStep(0);
    setAgeGroup("");
    setSelectedAreas([]);
    setSelectedSymptoms([]);
    setSeverity([5]);
    setDuration("");
    setAdditionalInfo("");
    setResult(null);
  };

  return (
    <div className="grain-overlay min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-secondary/30 pb-8 pt-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blob-shape blur-3xl" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Symptom Checker</h1>
              <p className="text-sm text-muted-foreground">Comprehensive health assessment</p>
            </div>
          </div>

          {step < 5 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Step {step + 1} of {totalSteps - 1}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container max-w-3xl">
          <AnimatePresence mode="wait">
            {/* Step 0: Age Group */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">What is your age group?</CardTitle>
                    <p className="text-sm text-muted-foreground">This helps us provide more accurate recommendations.</p>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={ageGroup} onValueChange={setAgeGroup} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ageGroups.map((group) => (
                        <Label
                          key={group.value}
                          className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            ageGroup === group.value
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <RadioGroupItem value={group.value} className="sr-only" />
                          <span className="text-sm font-medium">{group.label}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 1: Body Area Selection */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Where are you experiencing symptoms?</CardTitle>
                    <p className="text-sm text-muted-foreground">Select all areas that apply.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {bodyAreas.map((area) => {
                        const Icon = area.icon;
                        const isSelected = selectedAreas.includes(area.id);
                        return (
                          <motion.button
                            key={area.id}
                            onClick={() => toggleArea(area.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border/50 hover:border-primary/30"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <span className="text-xs font-medium text-center">{area.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Specific Symptoms */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">What specific symptoms are you experiencing?</CardTitle>
                    <p className="text-sm text-muted-foreground">Select all symptoms that apply.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bodyAreas
                        .filter((area) => selectedAreas.includes(area.id))
                        .map((area) => (
                          <div key={area.id}>
                            <h4 className="font-serif text-sm text-muted-foreground mb-2">{area.label}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {area.symptoms.map((symptom) => {
                                const isChecked = selectedSymptoms.includes(symptom);
                                return (
                                  <label
                                    key={symptom}
                                    className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all cursor-pointer ${
                                      isChecked
                                        ? "border-primary bg-primary/5"
                                        : "border-border/50 hover:border-primary/30"
                                    }`}
                                  >
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={() => toggleSymptom(symptom)}
                                    />
                                    <span className="text-sm">{symptom}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <Separator className="mt-4" />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Severity */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">How severe are your symptoms?</CardTitle>
                    <p className="text-sm text-muted-foreground">Rate your overall discomfort level.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Mild</span>
                        <span className="font-serif text-3xl text-primary">{severity[0]}</span>
                        <span className="text-sm text-muted-foreground">Severe</span>
                      </div>
                      <Slider
                        value={severity}
                        onValueChange={setSeverity}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <span key={n}>{n}</span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-sm text-muted-foreground">
                        {severity[0] <= 3 && "Mild discomfort that doesn't significantly affect daily activities."}
                        {severity[0] >= 4 && severity[0] <= 6 && "Moderate symptoms that may interfere with some daily activities."}
                        {severity[0] >= 7 && severity[0] <= 8 && "Significant symptoms that substantially impact daily life."}
                        {severity[0] >= 9 && "Severe symptoms requiring urgent medical attention."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Duration & Additional Info */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">How long have you had these symptoms?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-2 gap-3">
                      {durationOptions.map((opt) => (
                        <Label
                          key={opt.value}
                          className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                            duration === opt.value
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <RadioGroupItem value={opt.value} className="sr-only" />
                          <span className="text-sm font-medium">{opt.label}</span>
                        </Label>
                      ))}
                    </RadioGroup>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Additional Information (Optional)</Label>
                      <Textarea
                        placeholder="Describe any other symptoms, medications you're taking, or relevant medical history..."
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Results */}
            {step === 5 && result && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                {/* Severity Badge */}
                <Card className={`border-2 ${severityColors[result.severity]}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {(() => {
                        const SevIcon = severityIcons[result.severity];
                        return (
                          <div className="w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center shrink-0">
                            <SevIcon className="w-6 h-6" />
                          </div>
                        );
                      })()}
                      <div>
                        <Badge className={`mb-2 ${severityColors[result.severity]} border`}>
                          {result.severity.toUpperCase()} PRIORITY
                        </Badge>
                        <h2 className="font-serif text-2xl text-foreground mb-2">{result.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Your Symptom Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge key={symptom} variant="secondary" className="rounded-full">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <p className="text-xs text-muted-foreground">Severity</p>
                        <p className="font-serif text-lg">{severity[0]}/10</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-serif text-lg capitalize">
                          {durationOptions.find((d) => d.value === duration)?.label || duration}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {result.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <Alert className="border-amber-warm/20 bg-amber-warm/5">
                  <AlertTriangle className="w-4 h-4 text-amber-warm" />
                  <AlertDescription className="text-sm text-muted-foreground">
                    This assessment is for informational purposes only and does not constitute medical advice.
                    Always consult a qualified healthcare professional for proper diagnosis and treatment.
                  </AlertDescription>
                </Alert>

                <Button onClick={handleReset} variant="outline" className="w-full rounded-xl gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Start New Assessment
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="gap-2 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="gap-2 rounded-full px-6"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="gap-2 rounded-full px-6"
                >
                  Get Assessment
                  <Stethoscope className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
