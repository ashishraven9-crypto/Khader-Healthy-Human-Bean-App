/*
 * DESIGN: Organic Wellness Health Dashboard
 * Interactive charts, health score, trend analytics
 * Warm sage/cream palette, organic card layouts
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Heart,
  Activity,
  Droplets,
  Moon,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Target,
  Award,
  Flame,
  Footprints,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DASHBOARD_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663338606801/9fjxRSTui3pzpChKNY8CxL/health-dashboard-bg-mgVaxK5gwaafEySoZbCMoj.webp";

// Mock health data
const weeklyData = [
  { day: "Mon", steps: 8200, calories: 2100, sleep: 7.5, water: 2.2, heartRate: 72 },
  { day: "Tue", steps: 6500, calories: 1950, sleep: 6.8, water: 1.8, heartRate: 75 },
  { day: "Wed", steps: 10200, calories: 2300, sleep: 8.0, water: 2.5, heartRate: 68 },
  { day: "Thu", steps: 7800, calories: 2050, sleep: 7.2, water: 2.0, heartRate: 71 },
  { day: "Fri", steps: 9100, calories: 2200, sleep: 7.8, water: 2.3, heartRate: 69 },
  { day: "Sat", steps: 11500, calories: 2400, sleep: 8.5, water: 2.8, heartRate: 65 },
  { day: "Sun", steps: 5200, calories: 1800, sleep: 9.0, water: 2.0, heartRate: 70 },
];

const monthlyTrend = [
  { week: "W1", score: 72, sleep: 7.0, activity: 65, nutrition: 70 },
  { week: "W2", score: 75, sleep: 7.3, activity: 68, nutrition: 72 },
  { week: "W3", score: 78, sleep: 7.5, activity: 72, nutrition: 75 },
  { week: "W4", score: 82, sleep: 7.8, activity: 78, nutrition: 80 },
];

const radarData = [
  { subject: "Sleep", A: 82, fullMark: 100 },
  { subject: "Activity", A: 75, fullMark: 100 },
  { subject: "Nutrition", A: 78, fullMark: 100 },
  { subject: "Hydration", A: 85, fullMark: 100 },
  { subject: "Mental", A: 70, fullMark: 100 },
  { subject: "Recovery", A: 88, fullMark: 100 },
];

const healthMetrics = [
  { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, trend: "stable", color: "text-coral" },
  { label: "Steps Today", value: "8,432", unit: "steps", icon: Footprints, trend: "up", color: "text-primary" },
  { label: "Sleep", value: "7.5", unit: "hours", icon: Moon, trend: "up", color: "text-sage" },
  { label: "Water Intake", value: "2.2", unit: "liters", icon: Droplets, trend: "down", color: "text-moss" },
  { label: "Calories", value: "2,100", unit: "kcal", icon: Flame, trend: "stable", color: "text-terracotta" },
  { label: "Stress Level", value: "Low", unit: "", icon: Brain, trend: "up", color: "text-amber-warm" },
];

const achievements = [
  { title: "7-Day Streak", desc: "Logged health data for 7 consecutive days", icon: Flame, earned: true },
  { title: "Hydration Hero", desc: "Met water intake goal 5 days in a row", icon: Droplets, earned: true },
  { title: "Step Master", desc: "Walked 10,000+ steps in a single day", icon: Footprints, earned: true },
  { title: "Sleep Champion", desc: "Averaged 8+ hours of sleep for a week", icon: Moon, earned: false },
  { title: "Wellness Warrior", desc: "Achieved 90+ overall health score", icon: Award, earned: false },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-moss" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-coral" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

const chartColors = {
  primary: "oklch(0.48 0.1 155)",
  secondary: "oklch(0.62 0.14 45)",
  tertiary: "oklch(0.58 0.1 145)",
  quaternary: "oklch(0.72 0.15 70)",
};

export default function HealthDashboard() {
  const [timeRange, setTimeRange] = useState("week");

  const overallScore = 78;

  return (
    <div className="grain-overlay min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-secondary/30 pb-8 pt-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blob-shape blur-3xl" />
        <div className="container relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Health Dashboard</h1>
                <p className="text-sm text-muted-foreground">Your wellness at a glance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 rounded-full">
                <Calendar className="w-3 h-3" />
                This Week
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {/* Overall Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-36 h-36 shrink-0">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke="currentColor" strokeWidth="8"
                        strokeDasharray={`${(overallScore / 100) * 327} 327`}
                        strokeLinecap="round"
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-serif text-3xl text-foreground">{overallScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-serif text-xl text-foreground mb-1">Overall Health Score</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your health score is <strong className="text-primary">Good</strong>. You've improved by 6 points this month.
                      Keep up the great work with your sleep and activity levels.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full gap-1">
                        <TrendingUp className="w-3 h-3 text-moss" /> +6 this month
                      </Badge>
                      <Badge variant="secondary" className="rounded-full gap-1">
                        <Target className="w-3 h-3" /> Goal: 85
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {healthMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${metric.color}`} />
                      <TrendIcon trend={metric.trend} />
                    </div>
                    <p className="font-serif text-xl text-foreground">
                      {metric.value}
                      {metric.unit && <span className="text-xs text-muted-foreground ml-1">{metric.unit}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{metric.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {/* Charts Section */}
          <Tabs defaultValue="activity" className="mb-6">
            <TabsList className="bg-secondary/50 rounded-full p-1 mb-4">
              <TabsTrigger value="activity" className="rounded-full text-xs">Activity</TabsTrigger>
              <TabsTrigger value="sleep" className="rounded-full text-xs">Sleep</TabsTrigger>
              <TabsTrigger value="vitals" className="rounded-full text-xs">Vitals</TabsTrigger>
              <TabsTrigger value="wellness" className="rounded-full text-xs">Wellness</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg">Daily Steps & Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                        <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid oklch(0.9 0.01 80)",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar yAxisId="left" dataKey="steps" fill={chartColors.primary} radius={[6, 6, 0, 0]} name="Steps" />
                        <Bar yAxisId="right" dataKey="calories" fill={chartColors.secondary} radius={[6, 6, 0, 0]} name="Calories" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sleep">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg">Sleep Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                        <YAxis domain={[5, 10]} tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid oklch(0.9 0.01 80)",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sleep"
                          stroke={chartColors.primary}
                          fill="url(#sleepGradient)"
                          strokeWidth={2}
                          name="Hours"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vitals">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg">Heart Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                        <YAxis domain={[60, 80]} tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid oklch(0.9 0.01 80)",
                            fontSize: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="heartRate"
                          stroke={chartColors.secondary}
                          strokeWidth={2}
                          dot={{ fill: chartColors.secondary, r: 4 }}
                          name="BPM"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wellness">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-serif text-lg">Wellness Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="oklch(0.9 0.01 80)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 50)" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="oklch(0.5 0.03 50)" />
                          <Radar
                            name="Score"
                            dataKey="A"
                            stroke={chartColors.primary}
                            fill={chartColors.primary}
                            fillOpacity={0.2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-serif text-lg">Monthly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
                          <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                          <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} stroke="oklch(0.5 0.03 50)" />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "12px",
                              border: "1px solid oklch(0.9 0.01 80)",
                              fontSize: "12px",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: "12px" }} />
                          <Line type="monotone" dataKey="score" stroke={chartColors.primary} strokeWidth={2} name="Overall" />
                          <Line type="monotone" dataKey="sleep" stroke={chartColors.tertiary} strokeWidth={2} name="Sleep" />
                          <Line type="monotone" dataKey="activity" stroke={chartColors.secondary} strokeWidth={2} name="Activity" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-warm" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {achievements.map((ach) => {
                    const Icon = ach.icon;
                    return (
                      <div
                        key={ach.title}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                          ach.earned
                            ? "border-amber-warm/20 bg-amber-warm/5"
                            : "border-border/50 opacity-50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          ach.earned ? "bg-amber-warm/10" : "bg-muted"
                        }`}>
                          <Icon className={`w-4 h-4 ${ach.earned ? "text-amber-warm" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{ach.title}</p>
                          <p className="text-xs text-muted-foreground">{ach.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
