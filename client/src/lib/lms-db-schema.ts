
// LMS Database Schema & Type Definitions

export type CourseId = string;
export type ModuleId = string;
export type LessonId = string;

// -- Progression Status --
export type UnlockStatus = 'locked' | 'unlocked' | 'in-progress' | 'completed';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

// -- User Progress State --
export interface UserLMSState {
  userId: string;
  
  // 1. Enrolled Courses
  // List of course IDs the user has access to (e.g. ['eng-a1', 'tech-welder'])
  enrolledCourses: CourseId[];

  // 2. Module Progression (The 'Keys')
  // Track status of every module. If a module ID is missing, it's assumed 'locked' (unless it's the first one).
  modules: {
    [moduleId: string]: {
      status: UnlockStatus;
      completedLessons: LessonId[]; // Array of completed lesson IDs within this module
      unlockedAt?: string; // ISO Date
      completedAt?: string; // ISO Date
    };
  };

  // 3. Quiz & Assessment History
  // Detailed log of all attempts for module quizzes
  quizHistory: {
    attemptId: string;
    moduleId: ModuleId;
    score: number; // 0-100
    passed: boolean;
    date: string; // ISO timestamp
  }[];

  // 4. Mock Test Results
  // Official record of full mock test attempts
  mockTestResults: {
    attemptId: string;
    testId: string; // e.g. 'mock-easy'
    difficulty: DifficultyLevel;
    overallScore: number; // 10-90 (PTE Scale)
    breakdown: {
      speaking: number;
      writing: number;
      reading: number;
      listening: number;
    };
    date: string; // ISO timestamp
    verified: boolean; // Integrity check flag
    proctorLogId?: string; // Reference to proctoring session log
  }[];
}

// -- Source of Truth Integrity --
export interface IntegrityLog {
  logId: string;
  userId: string;
  action: 'MODULE_UNLOCK' | 'TEST_SUBMISSION' | 'CERTIFICATE_GENERATION';
  timestamp: string;
  metadata: any;
  hash: string; // Integrity hash to prevent tampering
}
