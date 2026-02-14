import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Reviews from "@/pages/reviews";
import Resources from "@/pages/resources";
import SpeakingPractice from "@/pages/speaking-practice";
import SpeakingFluency from "@/pages/speaking-fluency";
import ReadingPractice from "@/pages/reading-practice";
import TypingPractice from "@/pages/typing-practice";
import ResourceViewer from "@/pages/resource-viewer";
import AudioTrainer from "@/pages/audio-trainer";
import ListeningPractice from "@/pages/listening-practice";
import WritingPractice from "@/pages/writing-practice";
import VocabularyTool from "@/pages/vocabulary-tool";
import GrammarTool from "@/pages/grammar-tool";
import FullMockTest from "@/pages/full-mock-test";
import LMSDashboard from "@/pages/lms-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import CourseViewer from "@/pages/course-viewer";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import FAQ from "@/pages/faq";
import ExamPolicies from "@/pages/exam-policies";
import Profile from "@/pages/profile";

import SpeakingGuide from "@/pages/speaking-guide";
import ReadingGuide from "@/pages/reading-guide";
import ListeningGuide from "@/pages/listening-guide";
import WritingGuide from "@/pages/writing-guide";
import PricingPage from "@/pages/pricing";
import Demo from "@/pages/demo";

function Router() {
  return (
    <WouterRouter>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/demo" component={Demo} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/reviews" component={Reviews} />
          
          {/* Resources sub-routes must come before the main /resources route */}
          <Route path="/resources/viewer" component={ResourceViewer} />
          <Route path="/resources/audio-trainer" component={AudioTrainer} />
          <Route path="/resources/full-mock-test" component={FullMockTest} />
          
          {/* LMS Routes */}
          <Route path="/lms" component={LMSDashboard} />
          <Route path="/lms/admin" component={AdminDashboard} />
          <Route path="/lms/course/:id" component={CourseViewer} />

          <Route path="/resources/grammar-tool" component={GrammarTool} />
          <Route path="/resources" component={Resources} />
          
          {/* Legal */}
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/exam-policies" component={ExamPolicies} />
          <Route path="/faq" component={FAQ} />
          <Route path="/profile" component={Profile} />

          {/* Guides */}
          <Route path="/guide/speaking" component={SpeakingGuide} />
          <Route path="/guide/reading" component={ReadingGuide} />
          <Route path="/guide/listening" component={ListeningGuide} />
          <Route path="/guide/writing" component={WritingGuide} />

          {/* Practice */}
          <Route path="/practice/speaking" component={SpeakingPractice} />
          <Route path="/practice/speaking-fluency" component={SpeakingFluency} />
          <Route path="/practice/reading" component={ReadingPractice} />
          <Route path="/practice/listening" component={ListeningPractice} />
          <Route path="/practice/writing" component={WritingPractice} />
          <Route path="/practice/vocabulary" component={VocabularyTool} />
          <Route path="/practice/typing" component={TypingPractice} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </WouterRouter>
  );
}

import { LMSProvider } from "@/hooks/use-lms";
import { ErrorBoundary } from "@/components/ui/error-boundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LMSProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LMSProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;