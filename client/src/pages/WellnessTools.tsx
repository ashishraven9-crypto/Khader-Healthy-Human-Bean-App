/*
 * DESIGN: Organic Wellness Tools Page
 * BMI Calculator, Hydration Tracker, Sleep Assessment, Calorie Estimator
 * Warm sage/cream palette, organic card layouts
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wrench,
  Scale,
  Droplets,
  Moon,
  Flame,
  Calculator,
  Heart,
  Activity,
  CheckCircle,
  Info,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

const WELLNESS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/wellness-tools-bg-FpFU8wmwzzey6N7nT3dUoH.webp";

// BMI Calculator
function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return;

    let bmi: number;
    if (unit === "metric") {
      bmi = w / ((h / 100) * (h / 100));
    } else {
      bmi = (w / (h * h)) * 703;
    }

    let category: string;
    let color: string;
    if (bmi < 18.5) { category = "Underweight"; color = "text-amber-warm"; }
    else if (bmi < 25) { category = "Normal Weight"; color = "text-moss"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-terracotta"; }
    else { category = "Obese"; color = "text-coral"; }

    setResult({ bmi: Math.round(bmi * 10) / 10, category, color });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          BMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-2">
          <Button
            variant={unit === "metric" ? "default" : "outline"}
            size="sm"
            onClick={() => { setUnit("metric"); setResult(null); }}
            className="rounded-full text-xs"
          >
            Metric (cm/kg)
          </Button>
          <Button
            variant={unit === "imperial" ? "default" : "outline"}
            size="sm"
            onClick={() => { setUnit("imperial"); setResult(null); }}
            className="rounded-full text-xs"
          >
            Imperial (in/lbs)
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm mb-1.5 block">
              Height ({unit === "metric" ? "cm" : "inches"})
            </Label>
            <Input
              type="number"
              placeholder={unit === "metric" ? "170" : "67"}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              type="number"
              placeholder={unit === "metric" ? "70" : "154"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full rounded-xl gap-2">
          <Calculator className="w-4 h-4" />
          Calculate BMI
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-secondary/50 text-center"
          >
            <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
            <p className={`font-serif text-4xl ${result.color}`}>{result.bmi}</p>
            <Badge variant="secondary" className={`mt-2 rounded-full ${result.color}`}>
              {result.category}
            </Badge>
            <div className="mt-4 w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-warm via-moss to-coral transition-all"
                style={{ width: `${Math.min((result.bmi / 40) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Hydration Tracker
function HydrationTracker() {
  const [glasses, setGlasses] = useState(0);
  const [weight, setWeight] = useState("70");
  const goal = Math.round(parseFloat(weight || "70") * 0.033 * 4); // glasses (250ml each)

  const percentage = Math.min((glasses / goal) * 100, 100);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Droplets className="w-5 h-5 text-moss" />
          Hydration Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="text-sm mb-1.5 block">Your Weight (kg)</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Daily goal: {goal} glasses ({Math.round(goal * 250 / 1000 * 10) / 10}L)
          </p>
        </div>

        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="currentColor" strokeWidth="8"
                strokeDasharray={`${(percentage / 100) * 327} 327`}
                strokeLinecap="round"
                className="text-moss"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="w-5 h-5 text-moss mb-1" />
              <span className="font-serif text-2xl text-foreground">{glasses}</span>
              <span className="text-xs text-muted-foreground">/ {goal}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlasses(Math.max(0, glasses - 1))}
              className="rounded-full w-10 h-10 p-0"
            >
              -
            </Button>
            <span className="text-sm text-muted-foreground">glasses</span>
            <Button
              size="sm"
              onClick={() => setGlasses(glasses + 1)}
              className="rounded-full w-10 h-10 p-0"
            >
              +
            </Button>
          </div>
        </div>

        {percentage >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-moss/10 text-center"
          >
            <CheckCircle className="w-5 h-5 text-moss mx-auto mb-1" />
            <p className="text-sm font-medium text-moss">Goal Reached!</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Sleep Quality Assessment
function SleepAssessment() {
  const [sleepHours, setSleepHours] = useState([7]);
  const [sleepQuality, setSleepQuality] = useState("");
  const [wakeUps, setWakeUps] = useState("0");
  const [result, setResult] = useState<{ score: number; tips: string[] } | null>(null);

  const assess = () => {
    let score = 0;
    const hours = sleepHours[0];

    if (hours >= 7 && hours <= 9) score += 40;
    else if (hours >= 6 && hours < 7) score += 25;
    else if (hours > 9) score += 30;
    else score += 10;

    if (sleepQuality === "excellent") score += 35;
    else if (sleepQuality === "good") score += 25;
    else if (sleepQuality === "fair") score += 15;
    else score += 5;

    const wakes = parseInt(wakeUps);
    if (wakes === 0) score += 25;
    else if (wakes === 1) score += 18;
    else if (wakes === 2) score += 10;
    else score += 3;

    const tips: string[] = [];
    if (hours < 7) tips.push("Try to get at least 7 hours of sleep per night.");
    if (hours > 9) tips.push("Sleeping too much can indicate underlying health issues. Aim for 7-9 hours.");
    if (sleepQuality === "poor" || sleepQuality === "fair") {
      tips.push("Create a relaxing bedtime routine to improve sleep quality.");
      tips.push("Avoid screens at least 30 minutes before bed.");
    }
    if (parseInt(wakeUps) >= 2) {
      tips.push("Frequent wake-ups may indicate sleep apnea or stress. Consider consulting a doctor.");
      tips.push("Keep your bedroom cool, dark, and quiet for better sleep.");
    }
    if (tips.length === 0) tips.push("Great sleep habits! Keep maintaining your current routine.");

    setResult({ score, tips });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Moon className="w-5 h-5 text-sage" />
          Sleep Quality Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="text-sm mb-3 block">Hours of Sleep: {sleepHours[0]}</Label>
          <Slider
            value={sleepHours}
            onValueChange={setSleepHours}
            min={3}
            max={12}
            step={0.5}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>3h</span>
            <span>7.5h</span>
            <span>12h</span>
          </div>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Sleep Quality</Label>
          <RadioGroup value={sleepQuality} onValueChange={setSleepQuality} className="grid grid-cols-2 gap-2">
            {["excellent", "good", "fair", "poor"].map((q) => (
              <Label
                key={q}
                className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer capitalize ${
                  sleepQuality === q ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value={q} className="sr-only" />
                <span className="text-sm">{q}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm mb-1.5 block">Night Wake-ups</Label>
          <Select value={wakeUps} onValueChange={setWakeUps}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              <SelectItem value="1">Once</SelectItem>
              <SelectItem value="2">Twice</SelectItem>
              <SelectItem value="3">3 or more</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={assess} className="w-full rounded-xl gap-2" disabled={!sleepQuality}>
          <Moon className="w-4 h-4" />
          Assess Sleep
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-5 rounded-xl bg-secondary/50 text-center">
              <p className="text-sm text-muted-foreground mb-1">Sleep Score</p>
              <p className={`font-serif text-4xl ${
                result.score >= 75 ? "text-moss" : result.score >= 50 ? "text-amber-warm" : "text-coral"
              }`}>
                {result.score}
              </p>
              <p className="text-xs text-muted-foreground mt-1">/ 100</p>
              <Progress value={result.score} className="mt-3 h-1.5" />
            </div>
            <div className="space-y-2">
              {result.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Calorie Estimator
function CalorieEstimator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [result, setResult] = useState<{ bmr: number; tdee: number; goals: { lose: number; maintain: number; gain: number } } | null>(null);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (!a || !h || !w) return;

    let bmr: number;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }

    const tdee = bmr * activityMultipliers[activityLevel];

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goals: {
        lose: Math.round(tdee - 500),
        maintain: Math.round(tdee),
        gain: Math.round(tdee + 500),
      },
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-terracotta" />
          Calorie Estimator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm mb-1.5 block">Age</Label>
            <Input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Height (cm)</Label>
            <Input type="number" placeholder="170" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Weight (kg)</Label>
            <Input type="number" placeholder="70" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </div>
        </div>

        <div>
          <Label className="text-sm mb-1.5 block">Activity Level</Label>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little exercise)</SelectItem>
              <SelectItem value="light">Light (1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (6-7 days/week)</SelectItem>
              <SelectItem value="very_active">Very Active (intense daily)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculate} className="w-full rounded-xl gap-2">
          <Calculator className="w-4 h-4" />
          Calculate
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-xs text-muted-foreground">BMR</p>
                <p className="font-serif text-2xl text-foreground">{result.bmr}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 text-center">
                <p className="text-xs text-muted-foreground">TDEE</p>
                <p className="font-serif text-2xl text-primary">{result.tdee}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-moss/5 border border-moss/10">
                <span className="text-sm">Weight Loss</span>
                <span className="font-serif text-lg text-moss">{result.goals.lose} kcal</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-sm">Maintenance</span>
                <span className="font-serif text-lg text-primary">{result.goals.maintain} kcal</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-terracotta/5 border border-terracotta/10">
                <span className="text-sm">Weight Gain</span>
                <span className="font-serif text-lg text-terracotta">{result.goals.gain} kcal</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Heart Rate Zone Calculator
function HeartRateZones() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [zones, setZones] = useState<{ name: string; min: number; max: number; desc: string; color: string }[] | null>(null);

  const calculate = () => {
    const a = parseInt(age);
    const rhr = parseInt(restingHR) || 70;
    if (!a) return;

    const maxHR = 220 - a;
    const hrr = maxHR - rhr;

    setZones([
      { name: "Zone 1 - Recovery", min: Math.round(rhr + hrr * 0.5), max: Math.round(rhr + hrr * 0.6), desc: "Very light, warm-up", color: "bg-sage/10 text-sage" },
      { name: "Zone 2 - Fat Burn", min: Math.round(rhr + hrr * 0.6), max: Math.round(rhr + hrr * 0.7), desc: "Light, fat burning", color: "bg-moss/10 text-moss" },
      { name: "Zone 3 - Cardio", min: Math.round(rhr + hrr * 0.7), max: Math.round(rhr + hrr * 0.8), desc: "Moderate, aerobic", color: "bg-amber-warm/10 text-amber-warm" },
      { name: "Zone 4 - Threshold", min: Math.round(rhr + hrr * 0.8), max: Math.round(rhr + hrr * 0.9), desc: "Hard, anaerobic", color: "bg-terracotta/10 text-terracotta" },
      { name: "Zone 5 - Maximum", min: Math.round(rhr + hrr * 0.9), max: maxHR, desc: "Maximum effort", color: "bg-coral/10 text-coral" },
    ]);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-coral" />
          Heart Rate Zones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm mb-1.5 block">Age</Label>
            <Input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Resting HR (bpm)</Label>
            <Input type="number" placeholder="70" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} />
          </div>
        </div>

        <Button onClick={calculate} className="w-full rounded-xl gap-2">
          <Activity className="w-4 h-4" />
          Calculate Zones
        </Button>

        {zones && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {zones.map((zone) => (
              <div key={zone.name} className={`flex items-center justify-between p-3 rounded-lg ${zone.color} border border-current/10`}>
                <div>
                  <p className="text-sm font-medium">{zone.name}</p>
                  <p className="text-xs opacity-70">{zone.desc}</p>
                </div>
                <span className="font-serif text-lg">{zone.min}-{zone.max}</span>
              </div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function WellnessTools() {
  return (
    <div className="grain-overlay min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-secondary/30 pb-8 pt-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blob-shape blur-3xl" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Wellness Tools</h1>
              <p className="text-sm text-muted-foreground">Calculate, track, and optimize your health</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BMICalculator />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <HydrationTracker />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SleepAssessment />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <CalorieEstimator />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <HeartRateZones />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
