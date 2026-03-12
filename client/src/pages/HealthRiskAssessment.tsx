/*
 * DESIGN: Organic Wellness Health Risk Assessment
 * Comprehensive multi-factor health risk calculator
 * Warm sage/cream palette, animated results
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Heart,
  Brain,
  Activity,
  Droplets,
  Moon,
  Apple,
  Cigarette,
  Wine,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Target,
  Zap,
  Dumbbell,
  ThermometerSun,
} from "lucide-react";

type RiskCategory = {
  name: string;
  score: number;
  maxScore: number;
  level: "low" | "moderate" | "high";
  tips: string[];
  icon: React.ElementType;
  color: string;
};

type FullResult = {
  overallScore: number;
  overallLevel: "low" | "moderate" | "high" | "very-high";
  categories: RiskCategory[];
  topRecommendations: string[];
};

export default function HealthRiskAssessment() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<FullResult | null>(null);

  // Demographics
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Lifestyle
  const [exerciseFreq, setExerciseFreq] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState([30]);
  const [smokingStatus, setSmokingStatus] = useState("");
  const [alcoholFreq, setAlcoholFreq] = useState("");
  const [sleepHours, setSleepHours] = useState([7]);
  const [stressLevel, setStressLevel] = useState([5]);

  // Diet
  const [fruitVegServings, setFruitVegServings] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [processedFood, setProcessedFood] = useState("");
  const [sugarIntake, setSugarIntake] = useState("");

  // Medical History
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [existingConditions, setExistingConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState("no");

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const familyConditions = [
    "Heart Disease", "Diabetes", "Cancer", "High Blood Pressure",
    "Stroke", "Obesity", "Mental Health Disorders", "Alzheimer's",
  ];

  const personalConditions = [
    "High Blood Pressure", "High Cholesterol", "Diabetes",
    "Asthma", "Arthritis", "Depression/Anxiety", "Thyroid Issues",
  ];

  const toggleFamilyHistory = (condition: string) => {
    setFamilyHistory((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const toggleExistingCondition = (condition: string) => {
    setExistingConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0: return age && gender && height && weight;
      case 1: return exerciseFreq && smokingStatus && alcoholFreq;
      case 2: return fruitVegServings && waterIntake && processedFood;
      case 3: return true;
      default: return true;
    }
  };

  const calculateResults = () => {
    const ageNum = parseInt(age) || 30;
    const heightCm = parseFloat(height) || 170;
    const weightKg = parseFloat(weight) || 70;
    const bmi = weightKg / ((heightCm / 100) ** 2);

    // Cardiovascular Risk
    let cardioScore = 0;
    if (bmi >= 18.5 && bmi < 25) cardioScore += 20;
    else if (bmi >= 25 && bmi < 30) cardioScore += 10;
    else cardioScore += 5;
    if (exerciseFreq === "daily" || exerciseFreq === "4-5") cardioScore += 20;
    else if (exerciseFreq === "2-3") cardioScore += 15;
    else if (exerciseFreq === "1") cardioScore += 8;
    if (smokingStatus === "never") cardioScore += 20;
    else if (smokingStatus === "former") cardioScore += 12;
    else cardioScore += 3;
    if (!familyHistory.includes("Heart Disease")) cardioScore += 10;
    if (!existingConditions.includes("High Blood Pressure") && !existingConditions.includes("High Cholesterol")) cardioScore += 10;
    if (alcoholFreq === "never" || alcoholFreq === "rarely") cardioScore += 10;
    else if (alcoholFreq === "moderate") cardioScore += 6;
    const cardioMax = 90;

    // Mental Health Risk
    let mentalScore = 0;
    const stress = stressLevel[0];
    if (stress <= 3) mentalScore += 25;
    else if (stress <= 5) mentalScore += 18;
    else if (stress <= 7) mentalScore += 10;
    else mentalScore += 3;
    const sleep = sleepHours[0];
    if (sleep >= 7 && sleep <= 9) mentalScore += 25;
    else if (sleep >= 6) mentalScore += 15;
    else mentalScore += 5;
    if (exerciseFreq === "daily" || exerciseFreq === "4-5") mentalScore += 15;
    else if (exerciseFreq === "2-3") mentalScore += 10;
    if (!existingConditions.includes("Depression/Anxiety")) mentalScore += 15;
    if (!familyHistory.includes("Mental Health Disorders")) mentalScore += 10;
    const mentalMax = 90;

    // Nutrition Score
    let nutritionScore = 0;
    if (fruitVegServings === "5+") nutritionScore += 25;
    else if (fruitVegServings === "3-4") nutritionScore += 18;
    else if (fruitVegServings === "1-2") nutritionScore += 10;
    else nutritionScore += 3;
    if (waterIntake === "8+") nutritionScore += 20;
    else if (waterIntake === "5-7") nutritionScore += 14;
    else if (waterIntake === "3-4") nutritionScore += 8;
    else nutritionScore += 3;
    if (processedFood === "rarely") nutritionScore += 20;
    else if (processedFood === "sometimes") nutritionScore += 12;
    else nutritionScore += 4;
    if (sugarIntake === "low") nutritionScore += 15;
    else if (sugarIntake === "moderate") nutritionScore += 10;
    else nutritionScore += 3;
    const nutritionMax = 80;

    // Physical Fitness Score
    let fitnessScore = 0;
    if (exerciseFreq === "daily") fitnessScore += 25;
    else if (exerciseFreq === "4-5") fitnessScore += 20;
    else if (exerciseFreq === "2-3") fitnessScore += 14;
    else if (exerciseFreq === "1") fitnessScore += 8;
    else fitnessScore += 2;
    const dur = exerciseDuration[0];
    if (dur >= 45) fitnessScore += 20;
    else if (dur >= 30) fitnessScore += 15;
    else if (dur >= 15) fitnessScore += 8;
    else fitnessScore += 3;
    if (bmi >= 18.5 && bmi < 25) fitnessScore += 20;
    else if (bmi >= 25 && bmi < 30) fitnessScore += 10;
    else fitnessScore += 4;
    if (ageNum < 40) fitnessScore += 10;
    else if (ageNum < 60) fitnessScore += 7;
    else fitnessScore += 4;
    const fitnessMax = 75;

    // Sleep & Recovery
    let sleepScore = 0;
    if (sleep >= 7 && sleep <= 9) sleepScore += 30;
    else if (sleep >= 6 && sleep < 7) sleepScore += 18;
    else if (sleep > 9) sleepScore += 22;
    else sleepScore += 8;
    if (stress <= 3) sleepScore += 20;
    else if (stress <= 5) sleepScore += 14;
    else if (stress <= 7) sleepScore += 8;
    else sleepScore += 3;
    if (alcoholFreq === "never" || alcoholFreq === "rarely") sleepScore += 15;
    else if (alcoholFreq === "moderate") sleepScore += 8;
    else sleepScore += 3;
    const sleepMax = 65;

    const getLevel = (score: number, max: number): "low" | "moderate" | "high" => {
      const pct = (score / max) * 100;
      if (pct >= 70) return "low";
      if (pct >= 45) return "moderate";
      return "high";
    };

    const categories: RiskCategory[] = [
      {
        name: "Cardiovascular",
        score: cardioScore,
        maxScore: cardioMax,
        level: getLevel(cardioScore, cardioMax),
        icon: Heart,
        color: "text-coral",
        tips: cardioScore / cardioMax < 0.7
          ? ["Increase aerobic exercise to at least 150 minutes per week", "Reduce sodium intake and eat more heart-healthy foods", "Monitor blood pressure and cholesterol regularly"]
          : ["Great cardiovascular health! Continue your current habits", "Consider adding variety to your exercise routine"],
      },
      {
        name: "Mental Wellness",
        score: mentalScore,
        maxScore: mentalMax,
        level: getLevel(mentalScore, mentalMax),
        icon: Brain,
        color: "text-sage",
        tips: mentalScore / mentalMax < 0.7
          ? ["Practice daily mindfulness or meditation for 10-15 minutes", "Prioritize social connections and meaningful relationships", "Consider speaking with a mental health professional"]
          : ["Excellent mental wellness practices!", "Continue prioritizing sleep and stress management"],
      },
      {
        name: "Nutrition",
        score: nutritionScore,
        maxScore: nutritionMax,
        level: getLevel(nutritionScore, nutritionMax),
        icon: Apple,
        color: "text-moss",
        tips: nutritionScore / nutritionMax < 0.7
          ? ["Aim for 5+ servings of fruits and vegetables daily", "Reduce processed food and added sugar consumption", "Stay hydrated with at least 8 glasses of water daily"]
          : ["Your nutrition habits are solid!", "Consider tracking micronutrients for optimization"],
      },
      {
        name: "Physical Fitness",
        score: fitnessScore,
        maxScore: fitnessMax,
        level: getLevel(fitnessScore, fitnessMax),
        icon: Dumbbell,
        color: "text-terracotta",
        tips: fitnessScore / fitnessMax < 0.7
          ? ["Start with 30 minutes of moderate exercise 3 times per week", "Include both cardio and strength training in your routine", "Set realistic fitness goals and track your progress"]
          : ["Impressive fitness level!", "Consider challenging yourself with new activities"],
      },
      {
        name: "Sleep & Recovery",
        score: sleepScore,
        maxScore: sleepMax,
        level: getLevel(sleepScore, sleepMax),
        icon: Moon,
        color: "text-amber-warm",
        tips: sleepScore / sleepMax < 0.7
          ? ["Establish a consistent sleep schedule, even on weekends", "Create a relaxing bedtime routine without screens", "Keep your bedroom cool, dark, and quiet"]
          : ["Great sleep habits!", "Continue maintaining your sleep schedule"],
      },
    ];

    const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
    const totalMax = categories.reduce((sum, c) => sum + c.maxScore, 0);
    const overallPct = (totalScore / totalMax) * 100;

    let overallLevel: FullResult["overallLevel"];
    if (overallPct >= 75) overallLevel = "low";
    else if (overallPct >= 55) overallLevel = "moderate";
    else if (overallPct >= 35) overallLevel = "high";
    else overallLevel = "very-high";

    const topRecommendations: string[] = [];
    categories
      .sort((a, b) => a.score / a.maxScore - b.score / b.maxScore)
      .slice(0, 3)
      .forEach((c) => {
        if (c.tips[0]) topRecommendations.push(c.tips[0]);
      });

    setResult({
      overallScore: Math.round(overallPct),
      overallLevel,
      categories: categories.sort((a, b) => a.score / a.maxScore - b.score / b.maxScore),
      topRecommendations,
    });
    setStep(4);
  };

  const handleReset = () => {
    setStep(0);
    setResult(null);
    setAge(""); setGender(""); setHeight(""); setWeight("");
    setExerciseFreq(""); setExerciseDuration([30]); setSmokingStatus(""); setAlcoholFreq("");
    setSleepHours([7]); setStressLevel([5]);
    setFruitVegServings(""); setWaterIntake(""); setProcessedFood(""); setSugarIntake("");
    setFamilyHistory([]); setExistingConditions([]); setMedications("no");
  };

  const levelColors: Record<string, string> = {
    low: "text-moss",
    moderate: "text-amber-warm",
    high: "text-terracotta",
    "very-high": "text-coral",
  };

  const levelBg: Record<string, string> = {
    low: "bg-moss/10 border-moss/20",
    moderate: "bg-amber-warm/10 border-amber-warm/20",
    high: "bg-terracotta/10 border-terracotta/20",
    "very-high": "bg-coral/10 border-coral/20",
  };

  const levelLabels: Record<string, string> = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    "very-high": "Very High Risk",
  };

  return (
    <div className="grain-overlay min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-secondary/30 pb-8 pt-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blob-shape blur-3xl" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Health Risk Assessment</h1>
              <p className="text-sm text-muted-foreground">Comprehensive multi-factor health analysis</p>
            </div>
          </div>

          {step < 4 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Step {step + 1} of {totalSteps - 1}
                </span>
                <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>
      </section>

      <section className="py-8">
        <div className="container max-w-3xl">
          <AnimatePresence mode="wait">
            {/* Step 0: Demographics */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Basic Information</CardTitle>
                    <p className="text-sm text-muted-foreground">Tell us about yourself to personalize your assessment.</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm mb-1.5 block">Age</Label>
                        <Input type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-sm mb-1.5 block">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm mb-1.5 block">Height (cm)</Label>
                        <Input type="number" placeholder="170" value={height} onChange={(e) => setHeight(e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-sm mb-1.5 block">Weight (kg)</Label>
                        <Input type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 1: Lifestyle */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Lifestyle Habits</CardTitle>
                    <p className="text-sm text-muted-foreground">Your daily habits significantly impact your health.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm mb-2 block">Exercise Frequency</Label>
                      <RadioGroup value={exerciseFreq} onValueChange={setExerciseFreq} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { value: "daily", label: "Daily" },
                          { value: "4-5", label: "4-5 days/week" },
                          { value: "2-3", label: "2-3 days/week" },
                          { value: "1", label: "Once a week" },
                          { value: "rarely", label: "Rarely" },
                          { value: "never", label: "Never" },
                        ].map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                              exerciseFreq === opt.value ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Exercise Duration: {exerciseDuration[0]} min</Label>
                      <Slider value={exerciseDuration} onValueChange={setExerciseDuration} min={0} max={120} step={5} />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Smoking Status</Label>
                      <RadioGroup value={smokingStatus} onValueChange={setSmokingStatus} className="grid grid-cols-3 gap-2">
                        {[
                          { value: "never", label: "Never" },
                          { value: "former", label: "Former" },
                          { value: "current", label: "Current" },
                        ].map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                              smokingStatus === opt.value ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Alcohol Consumption</Label>
                      <RadioGroup value={alcoholFreq} onValueChange={setAlcoholFreq} className="grid grid-cols-2 gap-2">
                        {[
                          { value: "never", label: "Never" },
                          { value: "rarely", label: "Rarely" },
                          { value: "moderate", label: "Moderate" },
                          { value: "heavy", label: "Heavy" },
                        ].map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                              alcoholFreq === opt.value ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Sleep: {sleepHours[0]} hours/night</Label>
                      <Slider value={sleepHours} onValueChange={setSleepHours} min={3} max={12} step={0.5} />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Stress Level: {stressLevel[0]}/10</Label>
                      <Slider value={stressLevel} onValueChange={setStressLevel} min={1} max={10} step={1} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Diet */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Dietary Habits</CardTitle>
                    <p className="text-sm text-muted-foreground">Your diet is the foundation of your health.</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <Label className="text-sm mb-2 block">Daily Fruit & Vegetable Servings</Label>
                      <RadioGroup value={fruitVegServings} onValueChange={setFruitVegServings} className="grid grid-cols-2 gap-2">
                        {[
                          { value: "0", label: "None" },
                          { value: "1-2", label: "1-2 servings" },
                          { value: "3-4", label: "3-4 servings" },
                          { value: "5+", label: "5+ servings" },
                        ].map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                              fruitVegServings === opt.value ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Daily Water Intake (glasses)</Label>
                      <RadioGroup value={waterIntake} onValueChange={setWaterIntake} className="grid grid-cols-2 gap-2">
                        {[
                          { value: "1-2", label: "1-2 glasses" },
                          { value: "3-4", label: "3-4 glasses" },
                          { value: "5-7", label: "5-7 glasses" },
                          { value: "8+", label: "8+ glasses" },
                        ].map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                              waterIntake === opt.value ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Processed Food Consumption</Label>
                      <RadioGroup value={processedFood} onValueChange={setProcessedFood} className="grid grid-cols-3 gap-2">
                        {[
                          { value: "rarely", label: "Rarely" },
                          { value: "sometimes", label: "Sometimes" },
                          { value: "often", label: "Often" },
                        ].map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                              processedFood === opt.value ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Added Sugar Intake</Label>
                      <RadioGroup value={sugarIntake} onValueChange={setSugarIntake} className="grid grid-cols-3 gap-2">
                        {[
                          { value: "low", label: "Low" },
                          { value: "moderate", label: "Moderate" },
                          { value: "high", label: "High" },
                        ].map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                              sugarIntake === opt.value ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Medical History */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Medical History</CardTitle>
                    <p className="text-sm text-muted-foreground">This helps us identify potential risk factors.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm mb-3 block">Family History (select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {familyConditions.map((condition) => (
                          <label
                            key={condition}
                            className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all cursor-pointer ${
                              familyHistory.includes(condition) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <Checkbox
                              checked={familyHistory.includes(condition)}
                              onCheckedChange={() => toggleFamilyHistory(condition)}
                            />
                            <span className="text-xs">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm mb-3 block">Existing Conditions (select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {personalConditions.map((condition) => (
                          <label
                            key={condition}
                            className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all cursor-pointer ${
                              existingConditions.includes(condition) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            <Checkbox
                              checked={existingConditions.includes(condition)}
                              onCheckedChange={() => toggleExistingCondition(condition)}
                            />
                            <span className="text-xs">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Currently Taking Medications?</Label>
                      <RadioGroup value={medications} onValueChange={setMedications} className="flex gap-3">
                        <Label className={`flex items-center justify-center px-6 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                          medications === "yes" ? "border-primary bg-primary/5" : "border-border/50"
                        }`}>
                          <RadioGroupItem value="yes" className="sr-only" />
                          <span className="text-sm">Yes</span>
                        </Label>
                        <Label className={`flex items-center justify-center px-6 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                          medications === "no" ? "border-primary bg-primary/5" : "border-border/50"
                        }`}>
                          <RadioGroupItem value="no" className="sr-only" />
                          <span className="text-sm">No</span>
                        </Label>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && result && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
                {/* Overall Score */}
                <Card className={`border-2 ${levelBg[result.overallLevel]}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative w-32 h-32 shrink-0">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                          <circle
                            cx="60" cy="60" r="52" fill="none"
                            stroke="currentColor" strokeWidth="8"
                            strokeDasharray={`${(result.overallScore / 100) * 327} 327`}
                            strokeLinecap="round"
                            className={levelColors[result.overallLevel]}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`font-serif text-3xl ${levelColors[result.overallLevel]}`}>{result.overallScore}</span>
                          <span className="text-xs text-muted-foreground">/ 100</span>
                        </div>
                      </div>
                      <div className="text-center md:text-left">
                        <Badge className={`mb-2 rounded-full border ${levelBg[result.overallLevel]} ${levelColors[result.overallLevel]}`}>
                          {levelLabels[result.overallLevel]}
                        </Badge>
                        <h2 className="font-serif text-2xl text-foreground mb-2">Your Health Risk Profile</h2>
                        <p className="text-sm text-muted-foreground">
                          {result.overallScore >= 75
                            ? "Excellent! Your lifestyle choices are supporting great health. Keep it up!"
                            : result.overallScore >= 55
                            ? "Good foundation, but there are areas where small changes could make a big difference."
                            : "There are several areas that need attention. Small, consistent changes can significantly improve your health."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Risk Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.categories.map((cat) => {
                      const Icon = cat.icon;
                      const pct = Math.round((cat.score / cat.maxScore) * 100);
                      return (
                        <motion.div
                          key={cat.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${cat.color}`} />
                              <span className="text-sm font-medium">{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`rounded-full text-[10px] ${
                                  cat.level === "low" ? "bg-moss/10 text-moss" :
                                  cat.level === "moderate" ? "bg-amber-warm/10 text-amber-warm" :
                                  "bg-coral/10 text-coral"
                                }`}
                              >
                                {cat.level === "low" ? "Low Risk" : cat.level === "moderate" ? "Moderate" : "High Risk"}
                              </Badge>
                              <span className="text-sm font-serif">{pct}%</span>
                            </div>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                          <div className="pl-6 space-y-1">
                            {cat.tips.map((tip, i) => (
                              <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <CheckCircle className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                                {tip}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Top Recommendations */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Priority Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {result.topRecommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <div className="p-4 rounded-xl bg-amber-warm/5 border border-amber-warm/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-warm mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      This assessment provides general guidance only and is not a substitute for professional medical advice.
                      Consult a healthcare provider for personalized recommendations.
                    </p>
                  </div>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full rounded-xl gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Take Assessment Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
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

              {step < 3 ? (
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
                  onClick={calculateResults}
                  className="gap-2 rounded-full px-6"
                >
                  Get Results
                  <Shield className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
