import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Reviews from "@/pages/reviews";
import Resources from "@/pages/resources";
import SpeakingPractice from "@/pages/speaking-practice";
import ReadingPractice from "@/pages/reading-practice";
import TypingPractice from "@/pages/typing-practice";
import ResourceViewer from "@/pages/resource-viewer";
import AudioTrainer from "@/pages/audio-trainer";
import ListeningPractice from "@/pages/listening-practice";
import WritingPractice from "@/pages/writing-practice";
import FullMockTest from "@/pages/full-mock-test";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";

import SpeakingGuide from "@/pages/speaking-guide";
import ReadingGuide from "@/pages/reading-guide";
import ListeningGuide from "@/pages/listening-guide";
import WritingGuide from "@/pages/writing-guide";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/resources" component={Resources} />
        <Route path="/resources/viewer" component={ResourceViewer} />
        <Route path="/resources/audio-trainer" component={AudioTrainer} />
        <Route path="/resources/full-mock-test" component={FullMockTest} />
        
        {/* Guides */}
        <Route path="/guide/speaking" component={SpeakingGuide} />
        <Route path="/guide/reading" component={ReadingGuide} />
        <Route path="/guide/listening" component={ListeningGuide} />
        <Route path="/guide/writing" component={WritingGuide} />

        {/* Practice */}
        <Route path="/practice/speaking" component={SpeakingPractice} />
        <Route path="/practice/reading" component={ReadingPractice} />
        <Route path="/practice/listening" component={ListeningPractice} />
        <Route path="/practice/writing" component={WritingPractice} />
        <Route path="/practice/typing" component={TypingPractice} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;