
import { CheckCircle2, Lock, PlayCircle, BookOpen, PenTool, Mic, Headphones } from "lucide-react";

export type ModuleStatus = "locked" | "unlocked" | "in-progress" | "completed";

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment";
  duration: string; // e.g. "10 min"
  isCompleted: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  status: ModuleStatus;
  lessons: Lesson[];
  progress: number; // 0-100
}

export interface Course {
  id: string;
  title: string;
  category: "English" | "Technical" | "Mock Test";
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Easy" | "Medium" | "Hard"; // For English & Mock Tests
  silo?: "Mechanics" | "Welders" | "Healthcare" | "General"; // For Technical
  description: string;
  thumbnail: string;
  totalModules: number;
  completedModules: number;
  modules: Module[];
}

// Mock Data
export const COURSES: Course[] = [
  {
    id: "eng-a1",
    title: "Foundational English (A1)",
    category: "English",
    level: "A1",
    description: "Build a strong foundation in English grammar, vocabulary, and basic communication skills.",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    totalModules: 5,
    completedModules: 1,
    modules: [
      {
        id: "m1",
        title: "Module 1: Basic Sentence Structure & Nouns",
        description: "Understanding subject-verb-object order and noun types.",
        status: "unlocked",
        progress: 0,
        lessons: [
          { id: "l1", title: "Sentence Basics", type: "video", duration: "5 min", isCompleted: false },
          { id: "l2", title: "Common Nouns vs Proper Nouns", type: "reading", duration: "10 min", isCompleted: false },
          { id: "l3", title: "Module Quiz", type: "quiz", duration: "15 min", isCompleted: false }
        ]
      },
      {
        id: "m2",
        title: "Module 2: Essential Verbs & Tenses",
        description: "Mastering common verbs and present/past simple tenses.",
        status: "locked",
        progress: 0,
        lessons: [
          { id: "l4", title: "Action Verbs", type: "video", duration: "8 min", isCompleted: false },
          { id: "l5", title: "Present Simple Practice", type: "assignment", duration: "20 min", isCompleted: false },
          { id: "l6", title: "Module Quiz", type: "quiz", duration: "10 min", isCompleted: false }
        ]
      },
      {
        id: "m3",
        title: "Module 3: Daily Communication & Greetings",
        description: "Formal and informal ways to greet and introduce yourself.",
        status: "locked",
        progress: 0,
        lessons: [
          { id: "l7", title: "Greetings & Farewells", type: "video", duration: "6 min", isCompleted: false },
          { id: "l8", title: "Introduction Scripts", type: "reading", duration: "15 min", isCompleted: false },
          { id: "l9", title: "Module Quiz", type: "quiz", duration: "10 min", isCompleted: false }
        ]
      },
      {
        id: "m4",
        title: "Module 4: Reading Simple Texts",
        description: "Signs, posters, and simple catalogs.",
        status: "locked",
        progress: 0,
        lessons: []
      },
      {
        id: "m5",
        title: "Module 5: Writing Simple Notes",
        description: "Short messages and filling forms.",
        status: "locked",
        progress: 0,
        lessons: []
      }
    ]
  },
  {
    id: "tech-welder",
    title: "English for Welders",
    category: "Technical",
    silo: "Welders",
    description: "Specialized technical English for welding professionals, focusing on safety and equipment terminology.",
    thumbnail: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    totalModules: 4,
    completedModules: 0,
    modules: [
      {
        id: "tm1",
        title: "Safety Terminology",
        description: "PPE, Hazards, and Workshop Safety",
        status: "unlocked",
        progress: 0,
        lessons: [
          { id: "tl1", title: "PPE Vocabulary", type: "video", duration: "10 min", isCompleted: false },
          { id: "tl2", title: "Hazard Signs", type: "quiz", duration: "5 min", isCompleted: false }
        ]
      },
      {
        id: "tm2",
        title: "Welding Equipment",
        description: "Names and functions of tools.",
        status: "locked",
        progress: 0,
        lessons: []
      },
      {
        id: "tm3",
        title: "Process Descriptions",
        description: "Explaining welding procedures.",
        status: "locked",
        progress: 0,
        lessons: []
      },
      {
        id: "tm4",
        title: "Workplace Communication",
        description: "Reporting issues and progress.",
        status: "locked",
        progress: 0,
        lessons: []
      }
    ]
  },
  {
    id: "mock-easy",
    title: "PTE Mock Test: Easy",
    category: "Mock Test",
    level: "Easy",
    description: "Beginner-friendly mock test to get familiar with the exam format without time pressure.",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    totalModules: 1,
    completedModules: 0,
    modules: [
      {
        id: "mock1",
        title: "Full Assessment",
        description: "Complete test covering all 4 skills.",
        status: "unlocked",
        progress: 0,
        lessons: [
          { id: "mt1", title: "Start Test", type: "quiz", duration: "2 hrs", isCompleted: false }
        ]
      }
    ]
  }
];

export const getCourseById = (id: string) => COURSES.find(c => c.id === id);
