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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/resources" component={Resources} />
        <Route path="/resources/viewer" component={ResourceViewer} />
        <Route path="/practice/speaking" component={SpeakingPractice} />
        <Route path="/practice/reading" component={ReadingPractice} />
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