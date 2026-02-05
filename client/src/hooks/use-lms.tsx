
import { createContext, useContext, useEffect, useState } from "react";
import { UserLMSState, CourseId, ModuleId, LessonId, UnlockStatus, DifficultyLevel } from "@/lib/lms-db-schema";
import { useUser } from "@/hooks/use-user";

// Default empty state
const defaultState: UserLMSState = {
  userId: "guest",
  enrolledCourses: ["eng-a1", "tech-welder", "mock-easy"], // Default enrollments for demo
  modules: {
    // Default unlocked first modules for demo courses
    "m1": { status: "unlocked", completedLessons: [] },
    "m2": { status: "locked", completedLessons: [] },
    "m3": { status: "locked", completedLessons: [] },
    "tm1": { status: "unlocked", completedLessons: [] },
    "mock1": { status: "unlocked", completedLessons: [] }
  },
  quizHistory: [],
  mockTestResults: []
};

interface LMSContextType {
  state: UserLMSState;
  unlockModule: (moduleId: ModuleId) => void;
  completeLesson: (moduleId: ModuleId, lessonId: LessonId) => void;
  submitQuizScore: (moduleId: ModuleId, score: number) => void;
  saveMockResult: (testId: string, difficulty: DifficultyLevel, score: number, breakdown: any) => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export function LMSProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [state, setState] = useState<UserLMSState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount or user change
  useEffect(() => {
    // Use email as ID since the mock user object doesn't have a numeric ID
    const userId = user?.email ? user.email : "guest";
    const storageKey = `lms_state_${userId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse LMS state", e);
        setState({ ...defaultState, userId });
      }
    } else {
      setState({ ...defaultState, userId });
    }
    setIsLoaded(true);
  }, [user]);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    const storageKey = `lms_state_${state.userId}`;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, isLoaded]);

  const unlockModule = (moduleId: ModuleId) => {
    setState(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleId]: {
          ...prev.modules[moduleId],
          status: "unlocked",
          unlockedAt: new Date().toISOString()
        }
      }
    }));
  };

  const completeLesson = (moduleId: ModuleId, lessonId: LessonId) => {
    setState(prev => {
      const currentModule = prev.modules[moduleId] || { status: "locked", completedLessons: [] };
      const completedLessons = currentModule.completedLessons.includes(lessonId) 
        ? currentModule.completedLessons 
        : [...currentModule.completedLessons, lessonId];
      
      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...currentModule,
            completedLessons,
            status: "in-progress" // Auto set to in-progress if a lesson is done
          }
        }
      };
    });
  };

  const submitQuizScore = (moduleId: ModuleId, score: number) => {
    setState(prev => ({
      ...prev,
      quizHistory: [
        ...prev.quizHistory,
        {
          attemptId: Math.random().toString(36).substr(2, 9),
          moduleId,
          score,
          passed: score >= 70,
          date: new Date().toISOString()
        }
      ]
    }));
  };

  const saveMockResult = (testId: string, difficulty: DifficultyLevel, overallScore: number, breakdown: any) => {
    setState(prev => ({
      ...prev,
      mockTestResults: [
        ...prev.mockTestResults,
        {
          attemptId: Math.random().toString(36).substr(2, 9),
          testId,
          difficulty,
          overallScore,
          breakdown,
          date: new Date().toISOString(),
          verified: true,
          // Source of Truth Logic: Hard Tier + Score >= 79 = Deployment Ready
          isDeploymentReady: difficulty === "Hard" && overallScore >= 79
        }
      ]
    }));
  };

  return (
    <LMSContext.Provider value={{ state, unlockModule, completeLesson, submitQuizScore, saveMockResult }}>
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (context === undefined) {
    throw new Error("useLMS must be used within an LMSProvider");
  }
  return context;
}
