import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, PauseCircle, Mic, Square, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ShadowingRecorderProps = {
  audioUrl?: string;
  transcript: string;
};

export default function ShadowingRecorder({ audioUrl, transcript }: ShadowingRecorderProps) {
  // Container refs
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const studentContainerRef = useRef<HTMLDivElement>(null);

  // WaveSurfer instances
  const modelWavesurfer = useRef<WaveSurfer | null>(null);
  const studentWavesurfer = useRef<WaveSurfer | null>(null);

  // State
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [studentAudioUrl, setStudentAudioUrl] = useState<string | null>(null);
  const [isPlayingStudent, setIsPlayingStudent] = useState(false);
  const [isPlayingBoth, setIsPlayingBoth] = useState(false);
  
  // MediaRecorder
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  // Initialize Model WaveSurfer
  useEffect(() => {
    if (!modelContainerRef.current) return;

    modelWavesurfer.current = WaveSurfer.create({
      container: modelContainerRef.current,
      waveColor: "#4f46e5",
      progressColor: "#818cf8",
      cursorColor: "#4338ca",
      barWidth: 2,
      barGap: 1,
      height: 80,
      normalize: true,
    });

    if (audioUrl) {
      modelWavesurfer.current.load(audioUrl);
    } else {
      // If no audio file, we can't really visualize the model waveform easily without generating it.
      // For mockup, maybe we just show a placeholder or handle it gracefully.
      // But the requirement says "from the audio", assuming audio exists.
    }

    modelWavesurfer.current.on('finish', () => {
       setIsPlayingModel(false);
       if (isPlayingBoth && studentWavesurfer.current) {
           // Wait for student audio to finish if it's longer? 
           // Or just stop both state when one finishes? Usually sync play stops when longest finishes.
       }
    });

    return () => {
      modelWavesurfer.current?.destroy();
    };
  }, [audioUrl]);

  // Initialize Student WaveSurfer
  useEffect(() => {
    if (!studentContainerRef.current) return;

    studentWavesurfer.current = WaveSurfer.create({
      container: studentContainerRef.current,
      waveColor: "#10b981", // Green for student
      progressColor: "#34d399",
      cursorColor: "#059669",
      barWidth: 2,
      barGap: 1,
      height: 80,
      normalize: true,
    });

    studentWavesurfer.current.on('finish', () => {
      setIsPlayingStudent(false);
      setIsPlayingBoth(false); // Stop sync play state if student finishes (assuming similar length)
    });

    return () => {
      studentWavesurfer.current?.destroy();
    };
  }, []);

  const handlePlayModel = () => {
    if (modelWavesurfer.current) {
      modelWavesurfer.current.playPause();
      setIsPlayingModel(modelWavesurfer.current.isPlaying());
    }
  };

  const handlePlayStudent = () => {
    if (studentWavesurfer.current) {
      studentWavesurfer.current.playPause();
      setIsPlayingStudent(studentWavesurfer.current.isPlaying());
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/ogg; codecs=opus" });
        const url = URL.createObjectURL(blob);
        setStudentAudioUrl(url);
        if (studentWavesurfer.current) {
          studentWavesurfer.current.load(url);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      
      // Auto-play model audio when recording starts? Requirement says:
      // "It plays a 5-second official clip, then immediately opens the mic"
      // So this function might need to be part of a sequence.
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      // Stop stream tracks
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSyncPlay = () => {
    if (modelWavesurfer.current && studentWavesurfer.current) {
      if (isPlayingBoth) {
        modelWavesurfer.current.pause();
        studentWavesurfer.current.pause();
        setIsPlayingBoth(false);
        setIsPlayingModel(false);
        setIsPlayingStudent(false);
      } else {
        // Seek to start for both to ensure sync
        modelWavesurfer.current.seekTo(0);
        studentWavesurfer.current.seekTo(0);
        
        modelWavesurfer.current.play();
        studentWavesurfer.current.play();
        setIsPlayingBoth(true);
        setIsPlayingModel(true);
        setIsPlayingStudent(true);
      }
    }
  };

  const startShadowingSession = () => {
    // 1. Play model audio
    if (modelWavesurfer.current) {
      modelWavesurfer.current.play();
      setIsPlayingModel(true);
      
      // 2. When model finishes, start recording immediately
      modelWavesurfer.current.once('finish', () => {
        setIsPlayingModel(false);
        handleStartRecording();
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Model Audio */}
        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/20">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-indigo-700 border-indigo-200 bg-indigo-50">Model Audio</Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handlePlayModel}>
                        {isPlayingModel ? <PauseCircle className="h-5 w-5 text-indigo-600" /> : <PlayCircle className="h-5 w-5 text-indigo-600" />}
                    </Button>
                </div>
                <div ref={modelContainerRef} className="w-full" />
                <p className="mt-2 text-sm text-muted-foreground italic">"{transcript}"</p>
            </CardContent>
        </Card>

        {/* Student Audio */}
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/20">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">Your Recording</Badge>
                    {studentAudioUrl && (
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handlePlayStudent}>
                            {isPlayingStudent ? <PauseCircle className="h-5 w-5 text-emerald-600" /> : <PlayCircle className="h-5 w-5 text-emerald-600" />}
                        </Button>
                    )}
                </div>
                
                {!studentAudioUrl && !isRecording && (
                    <div className="h-20 flex items-center justify-center border-2 border-dashed border-emerald-200 rounded bg-emerald-50/50">
                        <span className="text-sm text-emerald-600/70">Recording will appear here</span>
                    </div>
                )}
                
                <div ref={studentContainerRef} className={!studentAudioUrl && !isRecording ? "hidden" : "w-full"} />
                
                {isRecording && (
                     <div className="mt-2 flex items-center gap-2 text-red-500 animate-pulse text-sm font-medium">
                         <span className="h-2 w-2 rounded-full bg-red-500 block"></span>
                         Recording...
                     </div>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap justify-center gap-4 py-4">
         {!isRecording ? (
             <Button size="lg" onClick={startShadowingSession} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-md hover:shadow-lg transition-all">
                <Mic className="h-5 w-5" />
                Start Shadowing Session
             </Button>
         ) : (
             <Button size="lg" variant="destructive" onClick={handleStopRecording} className="gap-2 animate-pulse">
                <Square className="h-5 w-5 fill-current" />
                Stop Recording
             </Button>
         )}

         {studentAudioUrl && (
             <>
                <Button size="lg" variant="outline" onClick={handleSyncPlay} className="border-purple-200 hover:bg-purple-50 text-purple-700 gap-2">
                    {isPlayingBoth ? <PauseCircle className="h-5 w-5" /> : <RefreshCcw className="h-5 w-5" />}
                    {isPlayingBoth ? "Stop Sync Play" : "Sync Play (Compare)"}
                </Button>
                
                <Button size="icon" variant="ghost" onClick={() => {
                    setStudentAudioUrl(null);
                    if (studentWavesurfer.current) studentWavesurfer.current.empty();
                }} title="Clear Recording">
                    <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                </Button>
             </>
         )}
      </div>

      <div className="bg-muted/30 p-4 rounded-lg text-sm text-center text-muted-foreground">
          <strong>How to use:</strong> Click "Start Shadowing Session". Listen to the model, then repeat immediately when the recording starts. Use "Sync Play" to check your rhythm.
      </div>
    </div>
  );
}
