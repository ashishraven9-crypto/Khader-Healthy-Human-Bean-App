/*
 * DESIGN: Organic Wellness Health Library
 * Searchable medical information, categorized articles
 * Warm sage/cream palette, organic card layouts
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  BookOpen,
  Search,
  Heart,
  Brain,
  Bone,
  Droplets,
  Wind,
  Eye,
  Activity,
  Shield,
  Apple,
  Dumbbell,
  Moon,
  Sun,
  Thermometer,
  Baby,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
  tags: string[];
  icon: React.ElementType;
  readTime: string;
};

const categories = [
  { id: "all", label: "All Topics", icon: BookOpen },
  { id: "heart", label: "Heart Health", icon: Heart },
  { id: "mental", label: "Mental Health", icon: Brain },
  { id: "nutrition", label: "Nutrition", icon: Apple },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "prevention", label: "Prevention", icon: Shield },
  { id: "respiratory", label: "Respiratory", icon: Wind },
  { id: "bones", label: "Bones & Joints", icon: Bone },
];

const articles: Article[] = [
  {
    id: "heart-health-basics",
    title: "Understanding Heart Health: A Complete Guide",
    category: "heart",
    summary: "Learn about the fundamentals of cardiovascular health, risk factors, and how to maintain a healthy heart.",
    content: [
      "Heart disease remains the leading cause of death worldwide, but the good news is that many risk factors are within your control. Understanding how your heart works and what affects its health is the first step toward prevention.",
      "Your heart beats approximately 100,000 times per day, pumping about 2,000 gallons of blood through your body. This remarkable organ needs proper care to function optimally throughout your life.",
      "Key risk factors for heart disease include high blood pressure, high cholesterol, smoking, diabetes, obesity, physical inactivity, unhealthy diet, and excessive alcohol consumption. Family history also plays a role, but lifestyle modifications can significantly reduce your risk.",
      "To maintain a healthy heart, aim for at least 150 minutes of moderate aerobic activity per week, eat a diet rich in fruits, vegetables, whole grains, and lean proteins, maintain a healthy weight, manage stress, avoid smoking, and limit alcohol intake.",
      "Regular check-ups are essential. Have your blood pressure, cholesterol, and blood sugar levels checked regularly. Know your numbers and work with your healthcare provider to keep them in a healthy range.",
    ],
    tags: ["cardiovascular", "prevention", "exercise", "diet"],
    icon: Heart,
    readTime: "5 min",
  },
  {
    id: "mental-health-awareness",
    title: "Mental Health: Breaking the Stigma",
    category: "mental",
    summary: "Understanding mental health conditions, recognizing signs, and knowing when to seek help.",
    content: [
      "Mental health is just as important as physical health, yet it often receives less attention. One in five adults experiences a mental health condition each year, making it one of the most common health challenges worldwide.",
      "Common mental health conditions include depression, anxiety disorders, bipolar disorder, PTSD, and OCD. These are medical conditions, not personal weaknesses, and they respond well to treatment.",
      "Signs that you or someone you know may need help include persistent sadness, excessive worry, dramatic mood changes, withdrawal from activities, changes in eating or sleeping patterns, difficulty concentrating, and thoughts of self-harm.",
      "Effective treatments include psychotherapy (talk therapy), medication, lifestyle changes, and support groups. Many people benefit from a combination of approaches. The key is to seek help early — mental health conditions are highly treatable.",
      "You can support your mental health daily by maintaining social connections, exercising regularly, getting adequate sleep, practicing mindfulness or meditation, limiting alcohol and avoiding drugs, and setting healthy boundaries.",
    ],
    tags: ["depression", "anxiety", "therapy", "wellness"],
    icon: Brain,
    readTime: "6 min",
  },
  {
    id: "nutrition-fundamentals",
    title: "Nutrition 101: Building a Balanced Diet",
    category: "nutrition",
    summary: "Essential nutrition knowledge for a healthier life, including macronutrients, micronutrients, and meal planning.",
    content: [
      "Good nutrition is the foundation of good health. What you eat directly affects your energy levels, immune function, brain health, and risk of chronic diseases. Understanding the basics of nutrition empowers you to make better food choices.",
      "Macronutrients — carbohydrates, proteins, and fats — provide the energy your body needs. Carbohydrates should make up 45-65% of your calories, proteins 10-35%, and fats 20-35%. Focus on complex carbs, lean proteins, and healthy fats.",
      "Micronutrients — vitamins and minerals — are needed in smaller amounts but are essential for hundreds of bodily functions. Key micronutrients include Vitamin D, B12, iron, calcium, magnesium, and omega-3 fatty acids.",
      "The Mediterranean diet is consistently rated as one of the healthiest eating patterns. It emphasizes fruits, vegetables, whole grains, legumes, nuts, olive oil, and moderate amounts of fish and poultry.",
      "Practical tips: Fill half your plate with vegetables, eat a variety of colorful foods, stay hydrated, limit processed foods and added sugars, read nutrition labels, and practice mindful eating.",
    ],
    tags: ["diet", "vitamins", "minerals", "healthy eating"],
    icon: Apple,
    readTime: "5 min",
  },
  {
    id: "exercise-guide",
    title: "Exercise for Every Body: Getting Started",
    category: "fitness",
    summary: "A beginner-friendly guide to physical activity, including types of exercise and how to build a routine.",
    content: [
      "Regular physical activity is one of the most important things you can do for your health. It can help control weight, reduce risk of heart disease, strengthen bones and muscles, improve mental health, and increase longevity.",
      "The four main types of exercise are aerobic (cardio), strength training, flexibility, and balance. A well-rounded fitness routine includes all four types. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity per week.",
      "Starting an exercise routine doesn't require a gym membership or expensive equipment. Walking, bodyweight exercises, yoga, and dancing are all excellent options. The best exercise is one you enjoy and will do consistently.",
      "To avoid injury, always warm up before exercise and cool down afterward. Start slowly and gradually increase intensity. Listen to your body — some muscle soreness is normal, but sharp pain is a warning sign.",
      "Tips for staying motivated: Set realistic goals, find an exercise buddy, track your progress, vary your routine, celebrate small wins, and remember that any movement is better than none.",
    ],
    tags: ["workout", "cardio", "strength", "flexibility"],
    icon: Dumbbell,
    readTime: "5 min",
  },
  {
    id: "sleep-science",
    title: "The Science of Sleep: Why It Matters",
    category: "sleep",
    summary: "Understanding sleep cycles, sleep disorders, and evidence-based strategies for better sleep.",
    content: [
      "Sleep is not a luxury — it's a biological necessity. During sleep, your body repairs tissues, consolidates memories, releases hormones, and strengthens the immune system. Chronic sleep deprivation is linked to obesity, diabetes, heart disease, and mental health disorders.",
      "Adults need 7-9 hours of sleep per night. Sleep occurs in cycles of about 90 minutes, alternating between NREM (non-rapid eye movement) and REM (rapid eye movement) stages. Both are essential for different aspects of health and cognitive function.",
      "Common sleep disorders include insomnia, sleep apnea, restless leg syndrome, and narcolepsy. If you consistently have trouble sleeping or feel tired despite adequate sleep time, consult a healthcare provider.",
      "Sleep hygiene practices that improve sleep quality: maintain a consistent sleep schedule, create a dark and cool bedroom environment, avoid screens for 30-60 minutes before bed, limit caffeine after noon, avoid large meals before bedtime, and exercise regularly (but not too close to bedtime).",
      "If you struggle with falling asleep, try relaxation techniques such as deep breathing, progressive muscle relaxation, or guided meditation. Cognitive behavioral therapy for insomnia (CBT-I) is the most effective long-term treatment for chronic insomnia.",
    ],
    tags: ["insomnia", "sleep hygiene", "circadian rhythm", "rest"],
    icon: Moon,
    readTime: "6 min",
  },
  {
    id: "immune-system",
    title: "Boosting Your Immune System Naturally",
    category: "prevention",
    summary: "Evidence-based strategies to support your immune system and prevent illness.",
    content: [
      "Your immune system is a complex network of cells, tissues, and organs that work together to defend your body against harmful invaders. While you can't 'boost' your immune system overnight, you can support its optimal function through lifestyle choices.",
      "Key nutrients for immune health include Vitamin C (citrus fruits, bell peppers), Vitamin D (sunlight, fatty fish), Zinc (meat, legumes, nuts), and probiotics (yogurt, fermented foods). A balanced diet is the best way to get these nutrients.",
      "Regular moderate exercise enhances immune function by promoting good circulation, which allows immune cells to move through the body more effectively. However, excessive intense exercise can temporarily suppress immunity.",
      "Chronic stress weakens the immune system by producing cortisol, which suppresses immune cell function. Managing stress through meditation, exercise, social connections, and adequate sleep is crucial for immune health.",
      "Practical immune-supporting habits: wash hands frequently, stay up-to-date on vaccinations, get 7-9 hours of sleep, eat a varied diet rich in fruits and vegetables, exercise regularly, manage stress, stay hydrated, and avoid smoking.",
    ],
    tags: ["immunity", "vitamins", "prevention", "wellness"],
    icon: Shield,
    readTime: "5 min",
  },
  {
    id: "respiratory-health",
    title: "Respiratory Health: Breathing Easy",
    category: "respiratory",
    summary: "Understanding common respiratory conditions and how to maintain healthy lungs.",
    content: [
      "Your lungs process about 20,000 liters of air each day. Keeping them healthy is essential for overall wellbeing. Common respiratory conditions include asthma, COPD, pneumonia, bronchitis, and allergies.",
      "Air quality significantly impacts respiratory health. Avoid exposure to tobacco smoke, air pollution, workplace chemicals, and indoor allergens like dust mites and mold. Use air purifiers if needed and ventilate your home regularly.",
      "Breathing exercises can improve lung capacity and reduce stress. Try diaphragmatic breathing: breathe in slowly through your nose, letting your belly rise, then exhale slowly through pursed lips. Practice for 5-10 minutes daily.",
      "Signs of respiratory problems include persistent cough, shortness of breath, wheezing, chest tightness, frequent respiratory infections, and coughing up blood. Seek medical attention if you experience any of these symptoms.",
      "To maintain healthy lungs: don't smoke, exercise regularly, maintain good posture, stay hydrated, practice deep breathing exercises, get vaccinated against flu and pneumonia, and minimize exposure to air pollutants.",
    ],
    tags: ["lungs", "asthma", "breathing", "air quality"],
    icon: Wind,
    readTime: "5 min",
  },
  {
    id: "bone-joint-health",
    title: "Keeping Your Bones and Joints Strong",
    category: "bones",
    summary: "Essential information about bone density, joint health, and preventing osteoporosis and arthritis.",
    content: [
      "Your skeletal system provides structure, protects organs, and stores minerals. Bone density peaks around age 30, after which you gradually lose bone mass. Taking steps to maintain bone health early can prevent osteoporosis later in life.",
      "Calcium and Vitamin D are essential for bone health. Adults need 1,000-1,200mg of calcium daily and 600-800 IU of Vitamin D. Good sources include dairy products, leafy greens, fortified foods, and sunlight exposure.",
      "Weight-bearing exercises like walking, jogging, dancing, and resistance training stimulate bone formation and slow bone loss. Aim for at least 30 minutes of weight-bearing activity most days of the week.",
      "Joint health is equally important. Osteoarthritis affects millions worldwide and is characterized by the breakdown of cartilage. Maintaining a healthy weight, staying active, and avoiding repetitive joint stress can help prevent it.",
      "Warning signs of bone and joint problems include persistent joint pain, stiffness, swelling, decreased range of motion, and fractures from minor falls. If you experience these, consult a healthcare provider for evaluation.",
    ],
    tags: ["osteoporosis", "arthritis", "calcium", "exercise"],
    icon: Bone,
    readTime: "5 min",
  },
];

export default function HealthLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="grain-overlay min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-secondary/30 pb-8 pt-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blob-shape blur-3xl" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Health Library</h1>
              <p className="text-sm text-muted-foreground">Trusted health information at your fingertips</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, topics, or conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {/* Category Pills */}
          <ScrollArea className="w-full mb-6">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="rounded-full gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Article Detail View */}
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                  className="mb-4 gap-2 rounded-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Library
                </Button>

                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const Icon = selectedArticle.icon;
                        return (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                        );
                      })()}
                      <Badge variant="secondary" className="rounded-full text-xs capitalize">
                        {selectedArticle.category}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full text-xs">
                        {selectedArticle.readTime} read
                      </Badge>
                    </div>
                    <CardTitle className="font-serif text-2xl">{selectedArticle.title}</CardTitle>
                    <p className="text-muted-foreground">{selectedArticle.summary}</p>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-6" />
                    <div className="prose prose-sm max-w-none">
                      {selectedArticle.content.map((paragraph, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
                </p>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map((article, i) => {
                    const Icon = article.icon;
                    return (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <Card
                          className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md cursor-pointer h-full"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="secondary" className="rounded-full text-[10px] capitalize">
                                    {article.category}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
                                </div>
                                <h3 className="font-serif text-base text-foreground mb-1 line-clamp-2">
                                  {article.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {article.summary}
                                </p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                                  Read more
                                  <ChevronRight className="w-3 h-3" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No articles found matching your search.</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
