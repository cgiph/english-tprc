import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Play, CheckCircle2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  speaker: "ai" | "user";
  text: string;
}

const SCRIPT = [
  { ai: "G'day! How are you going today?", expectedUser: ["good", "great", "not bad", "well", "okay"] },
  { ai: "Where do you live?", expectedUser: ["i live in", "from", "staying at"] },
  { ai: "What do you do for work, mate?", expectedUser: ["work as", "i am a", "job", "profession"] },
  { ai: "Why are you studying English?", expectedUser: ["to get a job", "for my visa", "pte", "assessment", "improve"] },
  { ai: "When are you planning to take your test?", expectedUser: ["next month", "soon", "in a few weeks", "this year"] }
];

export function AustralianConversationPractice({ onComplete }: { onComplete: (completed: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [auVoice, setAuVoice] = useState<SpeechSynthesisVoice | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const au = voices.find(v => v.lang === "en-AU" || v.lang.includes("AU")) || voices[0];
      setAuVoice(au || null);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (auVoice) utterance.voice = auVoice;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startConversation = () => {
    setCurrentTurn(0);
    const firstMsg = SCRIPT[0].ai;
    setMessages([{ id: 1, speaker: "ai", text: firstMsg }]);
    speak(firstMsg);
  };

  const handleSimulatedSpeech = () => {
    setIsRecording(true);
    // Simulate thinking/recording time
    setTimeout(() => {
      setIsRecording(false);
      
      // Simulate user's response based on the current turn
      let userText = "";
      if (currentTurn === 0) userText = "I'm doing great, thanks!";
      if (currentTurn === 1) userText = "I live in Sydney right now.";
      if (currentTurn === 2) userText = "I work as a mechanic.";
      if (currentTurn === 3) userText = "I'm studying to pass my PTE for my visa.";
      if (currentTurn === 4) userText = "I plan to take it next month.";

      setMessages(prev => [...prev, { id: Date.now(), speaker: "user", text: userText }]);
      
      // AI's next response
      setTimeout(() => {
        if (currentTurn < SCRIPT.length - 1) {
          const nextTurn = currentTurn + 1;
          const nextMsg = SCRIPT[nextTurn].ai;
          setCurrentTurn(nextTurn);
          setMessages(prev => [...prev, { id: Date.now(), speaker: "ai", text: nextMsg }]);
          speak(nextMsg);
        } else {
          const endMsg = "Good on ya! You did a fantastic job answering those questions.";
          setMessages(prev => [...prev, { id: Date.now(), speaker: "ai", text: endMsg }]);
          speak(endMsg);
          setTimeout(() => {
            setIsCompleted(true);
            onComplete(true);
          }, 3000);
        }
      }, 1000);

    }, 2000);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 w-full max-w-4xl mx-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-200">
            <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Aussie Conversation Practice</h2>
            <p className="text-slate-600 mb-8 text-lg">
                Practice answering common "WH" questions with our AI trainer who speaks with an Australian accent. 
                Listen carefully and respond clearly!
            </p>
            <Button onClick={startConversation} size="lg" className="px-10 py-6 text-xl bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                Start Chat
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[600px] p-4 md:p-8 w-full max-w-4xl mx-auto">
      <div className="w-full flex-1 bg-slate-50 rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-4 md:p-6 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold">WH-Questions: Daily Life</h2>
            <p className="text-slate-400 text-sm mt-1">Talking to AI Trainer (Aussie Accent)</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium bg-slate-800 px-3 py-1.5 rounded-full text-blue-300">
            Turn {currentTurn + 1} of {SCRIPT.length}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 bg-slate-50">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={cn(
                  "flex w-full",
                  msg.speaker === "ai" ? "justify-start" : "justify-end"
                )}
              >
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-4 shadow-sm",
                  msg.speaker === "ai" 
                    ? "bg-white border border-slate-200 text-slate-800 rounded-tl-sm" 
                    : "bg-blue-600 text-white rounded-tr-sm"
                )}>
                  {msg.speaker === "ai" && (
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
                      <Volume2 className="w-4 h-4" /> AI Trainer
                    </div>
                  )}
                  <p className="text-lg leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t border-slate-200 flex flex-col items-center justify-center shrink-0">
            {isCompleted ? (
                <div className="text-center text-green-600 font-bold flex items-center gap-2 text-xl">
                    <CheckCircle2 className="w-6 h-6" /> Conversation Completed!
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    <p className="text-sm text-slate-500 font-medium">
                        {isRecording ? "Listening to your answer..." : "Click the microphone to simulate answering."}
                    </p>
                    <Button 
                        size="lg" 
                        onClick={handleSimulatedSpeech}
                        disabled={isRecording || messages[messages.length - 1]?.speaker === "user"}
                        className={cn(
                            "w-20 h-20 rounded-full transition-all duration-300 shadow-lg",
                            isRecording 
                                ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110" 
                                : "bg-blue-600 hover:bg-blue-700"
                        )}
                    >
                        {isRecording ? <Mic className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
