import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  BookOpen, Mic, Headphones, PenTool, Brain, CheckCircle2, 
  BarChart3, Clock, Target, Users, Sparkles, ChevronRight,
  Volume2, FileText, GraduationCap, Award, Zap, Shield
} from "lucide-react";

export default function DemoPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Speaking Practice",
      description: "Real-time audio recording with PTE-aligned scoring for Read Aloud, Repeat Sentence, Describe Image, and more.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <PenTool className="h-8 w-8" />,
      title: "Writing Tools",
      description: "AI-powered grammar checker with context-aware feedback for pre-A1 to B1 level ESL learners.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Listening Trainer",
      description: "40+ audio items including Repeat Sentence and Write from Dictation with actual MP3 playback.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Reading Practice",
      description: "Fill in the Blanks, Multiple Choice, and Re-order Paragraphs with instant feedback.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const keyMetrics = [
    { value: "90", label: "PTE Score Scale", icon: <Target className="h-5 w-5" /> },
    { value: "6", label: "Enabling Skills", icon: <BarChart3 className="h-5 w-5" /> },
    { value: "40+", label: "Audio Items", icon: <Volume2 className="h-5 w-5" /> },
    { value: "20+", label: "Grammar Rules", icon: <CheckCircle2 className="h-5 w-5" /> }
  ];

  const grammarExamples = [
    { wrong: "I go to work yesterday.", correct: "I went to work yesterday.", type: "Tense Error" },
    { wrong: "She want to finished the task.", correct: "She wants to finish the task.", type: "Infinitive + Agreement" },
    { wrong: "My mother cook for us.", correct: "My mother cooks for us.", type: "Subject-Verb Agreement" },
    { wrong: "I have went there before.", correct: "I have gone there before.", type: "Perfect Tense" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" /> Board Presentation Demo
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            PTE Academic<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Preparation Portal
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            A comprehensive exam simulation platform with accurate question formats, 
            AI-powered grammar checking, and PTE-aligned scoring based on weighted enabling skills.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/full-mock-test">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 gap-2 text-lg px-8">
                <GraduationCap className="h-5 w-5" />
                Try Full Mock Test
              </Button>
            </Link>
            <Link href="/grammar-tool">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 text-lg px-8">
                <Brain className="h-5 w-5" />
                AI Grammar Checker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {keyMetrics.map((metric, i) => (
              <div key={i} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3">
                  {metric.icon}
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-1">{metric.value}</div>
                <div className="text-sm text-slate-500">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4">Core Features</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Complete PTE Academic Experience</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Four integrated modules covering all communicative skills with exam-accurate question formats
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden"
                onClick={() => setActiveFeature(i)}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Grammar Checker Highlight */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-700">AI-Powered</Badge>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Context-Aware Grammar Checking
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Specifically designed for <strong>pre-A1 to B1 level ESL learners</strong> preparing for PTE Academic. 
                Detects common errors that affect exam scores:
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Tense errors (past/present/future confusion)",
                  "Subject-verb agreement with complex subjects",
                  "Infinitive form errors (to + verb)",
                  "Perfect tense irregular verb patterns",
                  "Continuous tense formation",
                  "Word form errors (noun vs verb)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/grammar-tool">
                <Button size="lg" className="gap-2">
                  Try Grammar Checker <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border-2">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Live Error Detection Examples
              </h4>
              <div className="space-y-4">
                {grammarExamples.map((ex, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border">
                    <Badge variant="outline" className="mb-2 text-xs">{ex.type}</Badge>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-red-500 font-mono text-sm">✗</span>
                      <span className="text-red-700 line-through">{ex.wrong}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-mono text-sm">✓</span>
                      <span className="text-green-700">{ex.correct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">PTE-Aligned Scoring</Badge>
            <h2 className="text-4xl font-bold mb-4">Authentic Scoring Methodology</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Overall score derived exclusively from weighted enabling skills, matching real PTE Academic criteria
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  Enabling Skills
                </h3>
                <ul className="space-y-3">
                  {["Grammar", "Oral Fluency", "Pronunciation", "Spelling", "Vocabulary", "Written Discourse"].map((skill, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-400" />
                  Communicative Skills
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: "Listening", items: "SST, WFD, HIW, HCS, SMW, MCQ" },
                    { name: "Reading", items: "FIB, MCQ, ROP, RW-FIB" },
                    { name: "Speaking", items: "RA, RS, DI, RL, ASQ, RTS, SGD" },
                    { name: "Writing", items: "SWT, WE" }
                  ].map((skill, i) => (
                    <li key={i}>
                      <div className="font-medium text-green-300">{skill.name}</div>
                      <div className="text-sm text-slate-400">{skill.items}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Audio Trainer */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-white">
                    <Headphones className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl">Audio Trainer</h4>
                    <p className="text-green-600">40 professionally recorded items</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-3xl font-bold text-green-600 mb-1">20</div>
                    <div className="text-sm text-slate-600">Repeat Sentence</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-3xl font-bold text-blue-600 mb-1">20</div>
                    <div className="text-sm text-slate-600">Write from Dictation</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <div className="text-sm text-slate-600 mb-2">Sample Audio Item:</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Volume2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 h-2 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-sm text-slate-500">0:08</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-green-100 text-green-700">Listening Skills</Badge>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Real MP3 Audio Playback
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Authentic audio recordings for Repeat Sentence and Write from Dictation practice. 
                Each item carefully crafted to match PTE Academic difficulty levels.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Native speaker recordings",
                  "Varied accents and speeds",
                  "Auto-play with recording prompt",
                  "Instant scoring feedback"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/audio-trainer">
                <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                  Try Audio Trainer <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Test Results Feature */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4">Detailed Feedback</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Test Reports</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Students see exactly what they missed and what they need to improve
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      What Students See
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        Overall score (0-90 scale)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        Communicative skill breakdown
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        Enabling skills scores
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        Click-to-expand answer review
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        Mistakes with corrections
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        Personalized improvement tips
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-100 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold text-blue-600">61</div>
                      <div className="text-sm text-slate-500">/ 90 Overall</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white p-2 rounded text-center">
                        <div className="font-bold text-blue-600">63</div>
                        <div className="text-xs text-slate-500">Listening</div>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <div className="font-bold text-blue-600">10</div>
                        <div className="text-xs text-slate-500">Reading</div>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <div className="font-bold text-blue-600">40</div>
                        <div className="text-xs text-slate-500">Speaking</div>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <div className="font-bold text-blue-600">72</div>
                        <div className="text-xs text-slate-500">Writing</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <Award className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-bold mb-4">Ready for the Demo?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            Experience the full PTE Academic simulation with all features enabled
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/full-mock-test">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2 text-lg px-8">
                <GraduationCap className="h-5 w-5" />
                Start Full Mock Test
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2 text-lg px-8">
                <BookOpen className="h-5 w-5" />
                View All Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center text-sm">
        <div className="container mx-auto px-6">
          <p>PTE Academic Preparation Portal — Board Presentation Demo</p>
          <p className="mt-2 text-slate-500">Prototype Mode | All features functional for demonstration</p>
        </div>
      </footer>
    </div>
  );
}
