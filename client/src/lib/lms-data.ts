
import { CheckCircle2, Lock, PlayCircle, BookOpen, PenTool, Mic, Headphones } from "lucide-react";

export type ModuleStatus = "locked" | "unlocked" | "in-progress" | "completed";

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment";
  duration: string; // e.g. "10 min"
  isCompleted: boolean;
  videoUrl?: string; // Optional YouTube embed URL
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
    title: "Industrial Welding Specialist",
    category: "Technical",
    silo: "Welders",
    description: "Specialized technical training for welding professionals. Includes safety, MIG/TIG/Arc welding techniques, and blueprint reading.",
    thumbnail: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    totalModules: 3,
    completedModules: 0,
    modules: [
      {
        id: "tw1",
        title: "Module 1: Workshop Safety & PPE",
        description: "Essential safety protocols, hazard identification, and Personal Protective Equipment standards.",
        status: "unlocked",
        progress: 0,
        lessons: [
          { id: "tw1-l1", title: "PPE Standards & Usage", type: "video", duration: "12 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/uW8a2zE7ySE" },
          { id: "tw1-l2", title: "Hazard Identification", type: "reading", duration: "15 min", isCompleted: false },
          { id: "tw1-l3", title: "Safety Quiz", type: "quiz", duration: "10 min", isCompleted: false }
        ]
      },
      {
        id: "tw2",
        title: "Module 2: Arc Welding Fundamentals",
        description: "Core principles of Shielded Metal Arc Welding (SMAW), electrode selection, and current settings.",
        status: "locked",
        progress: 0,
        lessons: [
          { id: "tw2-l1", title: "Arc Welding Basics", type: "video", duration: "15 min", isCompleted: false },
          { id: "tw2-l2", title: "Electrode Classification", type: "reading", duration: "20 min", isCompleted: false },
          { id: "tw2-l3", title: "Process Quiz", type: "quiz", duration: "15 min", isCompleted: false }
        ]
      },
      {
        id: "tw3",
        title: "Technical Exam (Hard Tier)",
        description: "Comprehensive assessment of welding knowledge. Pass at 80%+ to verify technical skills.",
        status: "locked",
        progress: 0,
        lessons: [
          { id: "tw3-final", title: "Final Technical Assessment", type: "quiz", duration: "60 min", isCompleted: false }
        ]
      }
    ]
  },
  {
    id: "tech-mechanic",
    title: "Automotive Mechanics",
    category: "Technical",
    silo: "Mechanics",
    description: "Diagnostic and repair training for automotive systems. Covers engine performance, braking systems, and electrical diagnostics.",
    thumbnail: "https://images.unsplash.com/photo-1486262715619-72a604e3d7a9?w=800&q=80",
    totalModules: 3,
    completedModules: 0,
    modules: [
      {
        id: "tmec1",
        title: "Module 1: Engine Fundamentals",
        description: "Internal combustion engine operation and components.",
        status: "locked",
        progress: 0,
        lessons: [
          { id: "tmec1-l1", title: "Four-Stroke Cycle", type: "video", duration: "10 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/OGj8OneMjek" },
          { id: "tmec1-l2", title: "Engine Components", type: "reading", duration: "15 min", isCompleted: false },
          { id: "tmec1-l3", title: "Engine Quiz", type: "quiz", duration: "10 min", isCompleted: false }
        ]
      },
      {
        id: "tmec2",
        title: "Module 2: Brake Systems",
        description: "Hydraulic braking principles and maintenance.",
        status: "locked",
        progress: 0,
        lessons: [
            { id: "tmec2-l1", title: "Hydraulic Principles", type: "video", duration: "12 min", isCompleted: false },
            { id: "tmec2-l2", title: "Disc vs Drum Brakes", type: "reading", duration: "20 min", isCompleted: false },
            { id: "tmec2-l3", title: "Brake Systems Quiz", type: "quiz", duration: "15 min", isCompleted: false }
        ]
      },
      {
        id: "tmec3",
        title: "Technical Exam (Hard Tier)",
        description: "Final verification of mechanical aptitude.",
        status: "locked",
        progress: 0,
        lessons: [
            { id: "tmec3-final", title: "Final Mechanics Assessment", type: "quiz", duration: "60 min", isCompleted: false }
        ]
      }
    ]
  },
  {
    id: "tech-carpenter",
    title: "Master Carpentry",
    category: "Technical",
    silo: "Carpenters",
    description: "Professional carpentry skills from framing to finish work. Includes blueprint reading and structural integrity.",
    thumbnail: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80",
    totalModules: 3,
    completedModules: 0,
    modules: [
      {
        id: "tcarp1",
        title: "Module 1: Tools & Materials",
        description: "Proper use of power tools and wood selection.",
        status: "locked",
        progress: 0,
        lessons: [
            { id: "tcarp1-l1", title: "Power Tool Safety", type: "video", duration: "15 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/H-3b9e_Qc4c" },
            { id: "tcarp1-l2", title: "Wood Types & Grades", type: "reading", duration: "20 min", isCompleted: false },
            { id: "tcarp1-l3", title: "Tools Quiz", type: "quiz", duration: "10 min", isCompleted: false }
        ]
      },
      {
        id: "tcarp2",
        title: "Module 2: Framing Basics",
        description: "Structural framing for walls and roofs.",
        status: "locked",
        progress: 0,
        lessons: [
            { id: "tcarp2-l1", title: "Wall Framing", type: "video", duration: "20 min", isCompleted: false },
            { id: "tcarp2-l2", title: "Roof Systems", type: "reading", duration: "25 min", isCompleted: false },
            { id: "tcarp2-l3", title: "Framing Quiz", type: "quiz", duration: "15 min", isCompleted: false }
        ]
      },
      {
        id: "tcarp3",
        title: "Technical Exam (Hard Tier)",
        description: "Final verification of carpentry skills.",
        status: "locked",
        progress: 0,
        lessons: [
            { id: "tcarp3-final", title: "Final Carpentry Assessment", type: "quiz", duration: "60 min", isCompleted: false }
        ]
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
