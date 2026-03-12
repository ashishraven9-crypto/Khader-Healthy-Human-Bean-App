import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SymptomChecker from "./pages/SymptomChecker";
import HealthDashboard from "./pages/HealthDashboard";
import WellnessTools from "./pages/WellnessTools";
import EmergencyPage from "./pages/EmergencyPage";
import HealthLibrary from "./pages/HealthLibrary";
import HealthRiskAssessment from "./pages/HealthRiskAssessment";
import Layout from "./components/Layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/symptom-checker" component={SymptomChecker} />
        <Route path="/dashboard" component={HealthDashboard} />
        <Route path="/wellness-tools" component={WellnessTools} />
        <Route path="/emergency" component={EmergencyPage} />
        <Route path="/health-library" component={HealthLibrary} />
        <Route path="/risk-assessment" component={HealthRiskAssessment} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
