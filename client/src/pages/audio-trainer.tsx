import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, PauseCircle, RotateCcw, Eye, EyeOff, Keyboard, Ear, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

type AudioTask = {
  id: string;
  title: string;
  transcript: string;
  difficulty: "Easy" | "Medium" | "Hard";
  focus?: string; // e.g., "Blended Sounds", "British Accent"
  audioFile?: string; // Optional: path to actual audio file
};

const REPEAT_SENTENCE_ITEMS: AudioTask[] = [
  { id: "rs-1", title: "Academic Deadline", transcript: "You must submit your assignment by next Friday at the latest.", difficulty: "Easy", focus: "Standard British" },
  { id: "rs-2", title: "Library Resources", transcript: "The library holds a substantial collection of early economic history books.", difficulty: "Medium", focus: "Blended Sounds" },
  { id: "rs-3", title: "Lab Safety", transcript: "Protective clothing must always be worn in the laboratory.", difficulty: "Easy", focus: "Clear Enunciation" },
  { id: "rs-4", title: "Globalization", transcript: "Globalization has been an overwhelming urban and urbanization phenomenon.", difficulty: "Hard", focus: "Fast Paced" },
  { id: "rs-5", title: "Biology Class", transcript: "The cell is the basic structural and functional unit of all known living organisms.", difficulty: "Medium", focus: "Scientific Terminology" },
  { id: "rs-6", title: "Economic Theory", transcript: "Inflation affects the purchasing power of the currency.", difficulty: "Medium", focus: "Connected Speech" },
  { id: "rs-7", title: "History Lecture", transcript: "The industrial revolution changed the way people lived and worked.", difficulty: "Easy", focus: "Past Tense Verbs" },
  { id: "rs-8", title: "University Policy", transcript: "Student concession cards can be obtained by completing an application form.", difficulty: "Hard", focus: "Complex Sentence Structure" },
  { id: "rs-9", title: "Geography", transcript: "Rivers provide a habitat and migration route for numerous species of fish.", difficulty: "Medium", focus: "Plural Endings" },
  { id: "rs-10", title: "Medical Research", transcript: "Clinical trials are currently evaluating the safety of the new vaccine.", difficulty: "Hard", focus: "Medical Vocabulary" },
  { id: "rs-30", title: "Academic Writing", transcript: "The essay should include an introduction, body paragraphs, and a conclusion.", difficulty: "Easy", focus: "Clear Structure", audioFile: "/audio/Rs_Version_6-_(30)_1767948563022.mp3" },
  { id: "rs-31", title: "Research Methods", transcript: "Quantitative research involves the collection and analysis of numerical data.", difficulty: "Medium", focus: "Academic Terms", audioFile: "/audio/Rs_Version_6-_(31)_1767948563022.mp3" },
  { id: "rs-32", title: "Climate Change", transcript: "Rising sea levels are a direct consequence of global warming and ice cap melting.", difficulty: "Hard", focus: "Environmental Vocabulary", audioFile: "/audio/Rs_Version_6-_(32)_1767948563022.mp3" },
  { id: "rs-33", title: "Psychology Lecture", transcript: "Cognitive behavioral therapy is widely used to treat anxiety and depression.", difficulty: "Medium", focus: "Medical Terminology", audioFile: "/audio/Rs_Version_6-_(33)_1767948563023.mp3" },
  { id: "rs-34", title: "Campus Facilities", transcript: "The new sports complex will be open to all registered students from next semester.", difficulty: "Easy", focus: "Future Tense", audioFile: "/audio/Rs_Version_6-_(34)_1767948563023.mp3" },
  { id: "rs-35", title: "Art History", transcript: "The Renaissance period marked a significant shift in artistic expression and technique.", difficulty: "Medium", focus: "Historical Terms", audioFile: "/audio/Rs_Version_6-_(35)_1767948563024.mp3" },
  { id: "rs-36", title: "Business Studies", transcript: "Effective marketing strategies can significantly increase brand awareness and sales.", difficulty: "Medium", focus: "Business Vocabulary", audioFile: "/audio/Rs_Version_6-_(36)_1767948563019.mp3" },
  { id: "rs-37", title: "Environmental Science", transcript: "Renewable energy sources are becoming increasingly important for sustainable development.", difficulty: "Hard", focus: "Technical Terms", audioFile: "/audio/Rs_Version_6-_(37)_1767948563020.mp3" },
  { id: "rs-38", title: "Study Skills", transcript: "Time management is essential for balancing academic work and personal life.", difficulty: "Easy", focus: "Clear Pronunciation", audioFile: "/audio/Rs_Version_6-_(38)_1767948563020.mp3" },
  { id: "rs-39", title: "Technology Trends", transcript: "Artificial intelligence is transforming various industries and job markets.", difficulty: "Medium", focus: "Modern Vocabulary", audioFile: "/audio/Rs_Version_6-_(39)_1767948563021.mp3" },
];

const DICTATION_ITEMS: AudioTask[] = [
  { id: "wfd-1", title: "Course Registration", transcript: "Please make sure you have registered for the course before the deadline.", difficulty: "Easy" },
  { id: "wfd-2", title: "Campus Parking", transcript: "Car parking permits can be obtained from the student service centre.", difficulty: "Medium" },
  { id: "wfd-3", title: "Research Paper", transcript: "Your research paper should include a comprehensive literature review.", difficulty: "Hard" },
  { id: "wfd-4", title: "Office Hours", transcript: "Professor Smith will hold office hours on Tuesdays and Thursdays.", difficulty: "Easy" },
  { id: "wfd-5", title: "Graduation Ceremony", transcript: "The graduation ceremony will be held in the grand hall next month.", difficulty: "Medium" },
  { id: "wfd-6", title: "Online Portal", transcript: "You can access the lecture notes through the university's online portal.", difficulty: "Easy" },
  { id: "wfd-7", title: "Group Project", transcript: "Collaboration is essential for the success of this group project.", difficulty: "Medium" },
  { id: "wfd-8", title: "Financial Aid", transcript: "Financial aid applications must be submitted by the end of the semester.", difficulty: "Hard" },
  { id: "wfd-9", title: "Guest Speaker", transcript: "A renowned scientist will be delivering a guest lecture tomorrow.", difficulty: "Medium" },
  { id: "wfd-10", title: "Library Fine", transcript: "Overdue books will incur a daily fine until they are returned.", difficulty: "Easy" },
  { id: "wfd-40", title: "Lecture Recording", transcript: "Students can download the lecture recordings from the online platform.", difficulty: "Easy", audioFile: "/audio/Rs_Version_6-_(40)_1767948638553.mp3" },
  { id: "wfd-41", title: "Thesis Submission", transcript: "The final thesis must be submitted before the end of the academic year.", difficulty: "Medium", audioFile: "/audio/Rs_Version_6-_(41)_1767948638554.mp3" },
  { id: "wfd-42", title: "Student Housing", transcript: "Applications for student accommodation should be made well in advance.", difficulty: "Medium", audioFile: "/audio/Rs_Version_6-_(42)_1767948638555.mp3" },
  { id: "wfd-43", title: "Lab Equipment", transcript: "All laboratory equipment must be returned at the end of the semester.", difficulty: "Easy", audioFile: "/audio/Rs_Version_6-_(43)_1767948638555.mp3" },
  { id: "wfd-44", title: "Academic Calendar", transcript: "The academic calendar is available on the university website.", difficulty: "Easy", audioFile: "/audio/Rs_Version_6-_(44)_1767948638549.mp3" },
  { id: "wfd-45", title: "Research Grant", transcript: "Researchers must apply for funding before starting their projects.", difficulty: "Medium", audioFile: "/audio/Rs_Version_6-_(45)_1767948638550.mp3" },
  { id: "wfd-46", title: "Tutorial Sessions", transcript: "Tutorial sessions are scheduled for Friday afternoons in the main building.", difficulty: "Medium", audioFile: "/audio/Rs_Version_6-_(46)_1767948638551.mp3" },
  { id: "wfd-47", title: "Exam Preparation", transcript: "Students are advised to begin their exam preparation at least two weeks early.", difficulty: "Hard", audioFile: "/audio/Rs_Version_6-_(47)_1767948638551.mp3" },
  { id: "wfd-48", title: "Career Fair", transcript: "The annual career fair will feature over fifty employers this year.", difficulty: "Medium", audioFile: "/audio/Rs_Version_6-_(48)_1767948638552.mp3" },
  { id: "wfd-49", title: "International Students", transcript: "International students must register with the immigration office upon arrival.", difficulty: "Hard", audioFile: "/audio/Rs_Version_6-_(49)_1767948638553.mp3" },
];

export default function AudioTrainer() {
  const [activeTab, setActiveTab] = useState("repeat-sentence");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
      window.speechSynthesis.cancel();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
    } else {
      // Cancel any previous speech or audio
      window.speechSynthesis.cancel();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      const task = activeTab === "repeat-sentence" 
        ? REPEAT_SENTENCE_ITEMS.find(i => i.id === id) 
        : DICTATION_ITEMS.find(i => i.id === id);
      
      if (task) {
        setPlayingId(id);
        
        // Use actual audio file if available
        if (task.audioFile) {
          const audio = new Audio(task.audioFile);
          setCurrentAudio(audio);
          audio.onended = () => {
            setPlayingId(null);
            setCurrentAudio(null);
          };
          audio.onerror = () => {
            setPlayingId(null);
            setCurrentAudio(null);
          };
          audio.play();
          return;
        }
        
        // Fallback to speech synthesis
        const utterance = new SpeechSynthesisUtterance(task.transcript);
        
        // Attempt to find a British voice for 'Standard British' focus
        // Otherwise use default
        if (task.focus?.includes("British")) {
          const voices = window.speechSynthesis.getVoices();
          const britishVoice = voices.find(v => v.lang.includes("GB") || v.name.includes("UK"));
          if (britishVoice) utterance.voice = britishVoice;
        }

        // Adjust rate for "Fast Paced"
        if (task.focus === "Fast Paced") {
          utterance.rate = 1.2;
        } else {
          utterance.rate = 0.9; // Slightly slower for clarity by default
        }

        utterance.onend = () => {
          setPlayingId(null);
        };

        utterance.onerror = () => {
          setPlayingId(null);
        };

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedId(revealedId === id ? null : id);
  };

  const checkDictation = (id: string, correct: string) => {
    const input = userInputs[id] || "";
    if (!input) return null;
    
    // Simple word match check
    const correctWords = correct.toLowerCase().replace(/[.,]/g, "").split(" ");
    const inputWords = input.toLowerCase().replace(/[.,]/g, "").split(" ");
    
    return {
      total: correctWords.length,
      matched: inputWords.filter(w => correctWords.includes(w)).length
    };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/resources">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Resources
            </Button>
          </Link>
          <h1 className="font-serif font-bold text-xl hidden md:block">
            Audio Trainer
          </h1>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Ear className="h-3 w-3" /> Short-term Memory & Dictation
        </Badge>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="repeat-sentence" className="gap-2">
              <Ear className="h-4 w-4" /> Repeat Sentence
            </TabsTrigger>
            <TabsTrigger value="write-dictation" className="gap-2">
              <Keyboard className="h-4 w-4" /> Write From Dictation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repeat-sentence" className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-6">
              <h3 className="font-bold text-blue-800 mb-2">Instructions</h3>
              <p className="text-blue-700 text-sm">
                Listen to the sentence and repeat it exactly as you hear it. 
                Focus on the <strong>{activeTab === 'repeat-sentence' ? 'pronunciation and intonation' : 'spelling and grammar'}</strong>. 
                Use the "Show Transcript" button only after you have attempted to repeat the sentence.
              </p>
            </div>

            <div className="grid gap-4">
              {REPEAT_SENTENCE_ITEMS.map((item) => (
                <Card key={item.id} className="hover:border-primary/20 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-medium">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                          {item.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {item.focus}
                        </Badge>
                      </CardDescription>
                    </div>
                    <Button
                      size="icon"
                      variant={playingId === item.id ? "destructive" : "default"}
                      className="rounded-full h-10 w-10 shrink-0"
                      onClick={() => togglePlay(item.id)}
                    >
                      {playingId === item.id ? (
                        <PauseCircle className="h-5 w-5" />
                      ) : (
                        <PlayCircle className="h-5 w-5" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {playingId === item.id && (
                      <div className="mb-4">
                        <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                          <div className="h-full bg-primary animate-[progress_3s_linear]" style={{ width: '100%' }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-center">Playing...</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-primary gap-2"
                        onClick={() => toggleReveal(item.id)}
                      >
                        {revealedId === item.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {revealedId === item.id ? "Hide Transcript" : "Show Transcript"}
                      </Button>
                    </div>
                    
                    {revealedId === item.id && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg text-lg font-medium text-center animate-in fade-in slide-in-from-top-2">
                        "{item.transcript}"
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="write-dictation" className="space-y-6">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl mb-6">
              <h3 className="font-bold text-amber-800 mb-2">Instructions</h3>
              <p className="text-amber-700 text-sm">
                Listen to the audio and type exactly what you hear. 
                Pay attention to spelling, punctuation, and capitalization. 
                Click "Check" to compare your answer with the transcript.
              </p>
            </div>

            <div className="grid gap-6">
              {DICTATION_ITEMS.map((item) => {
                const result = revealedId === item.id ? checkDictation(item.id, item.transcript) : null;
                
                return (
                  <Card key={item.id} className="hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-medium">
                          {item.title}
                        </CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="text-xs font-normal">
                            {item.difficulty}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Button
                        size="icon"
                        variant={playingId === item.id ? "destructive" : "default"}
                        className="rounded-full h-10 w-10 shrink-0"
                        onClick={() => togglePlay(item.id)}
                      >
                        {playingId === item.id ? (
                          <PauseCircle className="h-5 w-5" />
                        ) : (
                          <PlayCircle className="h-5 w-5" />
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {playingId === item.id && (
                         <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                           <div className="h-full bg-primary animate-[progress_3s_linear]" style={{ width: '100%' }} />
                         </div>
                      )}

                      <div className="space-y-2">
                        <Input 
                          placeholder="Type what you hear..." 
                          className="font-medium text-lg"
                          value={userInputs[item.id] || ""}
                          onChange={(e) => setUserInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                          disabled={revealedId === item.id}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Button 
                          variant={revealedId === item.id ? "outline" : "secondary"}
                          size="sm" 
                          onClick={() => toggleReveal(item.id)}
                          disabled={!userInputs[item.id] && !revealedId}
                        >
                          {revealedId === item.id ? "Try Again" : "Check Answer"}
                        </Button>
                        
                        {result && (
                          <Badge variant={result.matched === result.total ? "default" : "secondary"} className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                             {result.matched} / {result.total} words matched
                          </Badge>
                        )}
                      </div>

                      {revealedId === item.id && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Correct Transcript</p>
                          <p className="text-lg font-medium">"{item.transcript}"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}