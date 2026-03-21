import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, Square, PlayCircle, RefreshCw, AlertCircle, Info, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const PRACTICE_SENTENCES = [
  {
    id: 1,
    text: "The development of artificial intelligence has transformed various sectors of the economy.",
    phonemeTargets: [
      { word: "artificial", sound: "/ʃ/", issue: "Often mispronounced as /s/ (e.g. artisicial)" },
      { word: "the", sound: "/ð/", issue: "Often mispronounced as /d/ or /z/" }
    ]
  },
  {
    id: 2,
    text: "Sustainable architecture is gaining popularity as cities strive to reduce their carbon footprint.",
    phonemeTargets: [
      { word: "architecture", sound: "/k/", issue: "Often mispronounced as /tʃ/ (ch)" },
      { word: "sustainable", sound: "/eɪ/", issue: "Vowel length and stress often missed" }
    ]
  },
  {
    id: 3,
    text: "Although big malls offer many choices, small shops are important, and both should remain.",
    phonemeTargets: [
      { word: "Although", sound: "/ð/", issue: "Often pronounced as /d/ or /t/" },
      { word: "choices", sound: "/ɔɪ/", issue: "Diphthong /ɔɪ/ often reduced" }
    ]
  }
];

export default function AIPronunciationCoach() {
  const [currentSentenceIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'analyzing' | 'results'>('idle');
  const [recordingProgress, setRecordingProgress] = useState(0);
  
  // Mock results state
  const [fluencyScore, setFluencyScore] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  
  const currentSentence = PRACTICE_SENTENCES[currentSentenceIndex];
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setRecordingState('recording');
    setRecordingProgress(0);
    
    // Simulate recording for 30 seconds
    timerRef.current = setInterval(() => {
      setRecordingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current!);
          analyzeRecording();
          return 100;
        }
        return prev + (100 / 600); // 600 ticks * 50ms = 30 seconds
      });
    }, 50);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    analyzeRecording();
  };

  const analyzeRecording = () => {
    setRecordingState('analyzing');
    // Simulate API analysis delay
    setTimeout(() => {
      setFluencyScore(Math.floor(Math.random() * 20) + 65); // 65-85
      setPronunciationScore(Math.floor(Math.random() * 20) + 60); // 60-80
      setRecordingState('results');
    }, 2000);
  };

  const nextSentence = () => {
    setCurrentIndex((prev) => (prev + 1) % PRACTICE_SENTENCES.length);
    setRecordingState('idle');
    setRecordingProgress(0);
  };

  const retry = () => {
    setRecordingState('idle');
    setRecordingProgress(0);
  };

  // Helper to render words with mock stress and intonation highlighting
  const renderAnalyzedText = (text: string) => {
    const words = text.split(" ");
    return words.map((word, index) => {
      // Mock some issues based on index to look realistic
      let statusClass = "text-emerald-600 border-b-2 border-transparent";
      let tooltip = "Perfect pronunciation";
      
      // Randomly assign some words as hesitated or mispronounced in the results
      if (recordingState === 'results') {
        if (index === 2 || index === 5) {
          statusClass = "text-amber-500 border-b-2 border-amber-300 bg-amber-50 rounded px-1";
          tooltip = "Hesitation / Unnatural Pause detected";
        } else if (index === 7 || index === Math.floor(words.length / 2)) {
          statusClass = "text-rose-500 border-b-2 border-rose-400 bg-rose-50 rounded px-1 font-bold";
          tooltip = "Incorrect stress or phoneme error";
        }
      }

      return (
        <span key={index} className="relative group inline-block mx-1 cursor-pointer">
          <span className={`transition-colors duration-300 ${statusClass}`}>
            {word}
          </span>
          {recordingState === 'results' && statusClass.includes("text-") && !statusClass.includes("emerald") && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10 text-center pointer-events-none">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          )}
        </span>
      );
    });
  };

  // Generate mock waveform bars
  const renderWaveform = () => {
    const bars = 40;
    return (
      <div className="flex items-end justify-center gap-1 h-24 w-full bg-slate-900 rounded-xl p-4 overflow-hidden relative">
        {Array.from({ length: bars }).map((_, i) => {
          // Animate heights if recording
          const isRecording = recordingState === 'recording';
          const height = isRecording ? Math.max(10, Math.random() * 100) : 10;
          return (
            <motion.div
              key={i}
              initial={{ height: "10%" }}
              animate={{ height: `${height}%` }}
              transition={{ 
                duration: 0.2, 
                repeat: isRecording ? Infinity : 0,
                repeatType: "reverse",
                delay: i * 0.05
              }}
              className={`w-2 rounded-t-sm ${isRecording ? 'bg-blue-400' : 'bg-slate-700'}`}
            />
          );
        })}
        
        {recordingState === 'analyzing' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-blue-400 gap-3">
             <RefreshCw className="w-8 h-8 animate-spin" />
             <span className="font-medium tracking-widest uppercase text-sm">ANALYZING WAVEFORM...</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-serif font-bold text-slate-800">AI Pronunciation & Fluency Coach</h1>
          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">BETA</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 max-w-5xl grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-slate-900 text-white rounded-t-lg pb-8">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-slate-300 border-slate-600">Read Aloud Task</Badge>
                <span className="text-sm font-medium text-slate-400">Sentence {currentSentenceIndex + 1} of {PRACTICE_SENTENCES.length}</span>
              </div>
              <CardTitle className="text-3xl font-serif leading-relaxed">
                {recordingState === 'results' ? renderAnalyzedText(currentSentence.text) : currentSentence.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              {renderWaveform()}

              <div className="flex flex-col items-center gap-4">
                {recordingState === 'idle' && (
                  <Button size="lg" onClick={startRecording} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg gap-3 shadow-lg hover:shadow-blue-500/30 transition-all">
                    <Mic className="w-6 h-6" /> Start Recording
                  </Button>
                )}
                
                {recordingState === 'recording' && (
                  <div className="w-full max-w-md space-y-4">
                    <div className="flex justify-center">
                       <Button size="lg" variant="destructive" onClick={stopRecording} className="rounded-full px-8 h-14 text-lg gap-3 animate-pulse shadow-lg shadow-red-500/30">
                         <Square className="w-6 h-6 fill-current" /> Stop Recording
                       </Button>
                    </div>
                    <Progress value={recordingProgress} className="h-2" />
                  </div>
                )}

                {recordingState === 'results' && (
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={retry} className="gap-2 h-12 px-6">
                      <RefreshCw className="w-4 h-4" /> Try Again
                    </Button>
                    <Button onClick={nextSentence} className="bg-slate-900 hover:bg-slate-800 text-white gap-2 h-12 px-6">
                      Next Sentence <PlayCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {recordingState === 'results' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Good Pacing
                  </h4>
                  <p className="text-sm text-emerald-700">Your speaking rate was mostly consistent with native speaker benchmarks. Keep avoiding unnatural pauses.</p>
                </CardContent>
              </Card>
              <Card className="bg-rose-50 border-rose-200">
                <CardContent className="p-6">
                  <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> Phoneme Focus
                  </h4>
                  <p className="text-sm text-rose-700">Careful with the <strong>/ð/</strong> sound in "the". Keep your tongue between your teeth.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Live PTE Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-slate-700">Oral Fluency</h4>
                    <p className="text-xs text-slate-500">Rhythm, phrasing, and hesitations</p>
                  </div>
                  <span className="text-3xl font-bold font-mono text-blue-600">
                    {recordingState === 'results' ? fluencyScore : '--'}
                    <span className="text-sm text-slate-400">/90</span>
                  </span>
                </div>
                <Progress 
                  value={recordingState === 'results' ? (fluencyScore / 90) * 100 : 0} 
                  className={`h-3 ${fluencyScore >= 79 ? '[&>div]:bg-emerald-500' : fluencyScore >= 65 ? '[&>div]:bg-blue-500' : '[&>div]:bg-amber-500'}`}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-slate-700">Pronunciation</h4>
                    <p className="text-xs text-slate-500">Vowels, consonants, and stress</p>
                  </div>
                  <span className="text-3xl font-bold font-mono text-purple-600">
                    {recordingState === 'results' ? pronunciationScore : '--'}
                    <span className="text-sm text-slate-400">/90</span>
                  </span>
                </div>
                <Progress 
                  value={recordingState === 'results' ? (pronunciationScore / 90) * 100 : 0} 
                  className={`h-3 ${pronunciationScore >= 79 ? '[&>div]:bg-emerald-500' : pronunciationScore >= 65 ? '[&>div]:bg-purple-500' : '[&>div]:bg-amber-500'}`}
                />
              </div>

              <div className="pt-6 border-t space-y-4">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Target Sounds in this phrase</h4>
                <div className="space-y-3">
                  {currentSentence.phonemeTargets.map((target, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-slate-700">"{target.word}"</span>
                        <Badge variant="outline" className="font-mono bg-white">{target.sound}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{target.issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
                <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                <p>This AI coach mimics the Pearson PTE automated scoring engine by analyzing voice spectrograms.</p>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}