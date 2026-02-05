
import { CheckCircle2, Lock, PlayCircle, BookOpen, PenTool, Mic, Headphones } from "lucide-react";

export type ModuleStatus = "locked" | "unlocked" | "in-progress" | "completed";

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment";
  duration: string; // e.g. "10 min"
  isCompleted: boolean;
  videoUrl?: string; // Optional YouTube embed URL
  content?: string; // Optional rich text content for reading lessons
  resources?: { title: string; type: "pdf" | "doc" | "link" }[];
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
          { 
            id: "l1", 
            title: "Grammar Overview: Structure & Tenses", 
            type: "reading", 
            duration: "15 min", 
            isCompleted: false, 
            content: `
              <div class="space-y-12 max-w-3xl mx-auto">
                <div class="bg-white text-slate-900 aspect-video rounded-xl shadow-2xl overflow-hidden flex flex-col border-4 border-slate-200">
                  <div class="bg-blue-600 p-8 flex-1 flex flex-col justify-center items-center text-center text-white">
                    <h1 class="text-5xl font-bold mb-4 tracking-tight">Grammar Overview</h1>
                    <p class="text-xl opacity-90">Structure, Tenses & Agreement • Module 1</p>
                  </div>
                  <div class="bg-slate-50 p-4 text-xs text-slate-500 flex justify-between">
                    <span>Cirrus LMS</span>
                    <span>Slide 1 of 6</span>
                  </div>
                </div>

                <div class="bg-white text-slate-900 aspect-video rounded-xl shadow-2xl overflow-hidden flex flex-col border-4 border-slate-200">
                  <div class="p-8 flex-1 flex flex-col justify-center">
                    <h2 class="text-2xl font-bold text-blue-700 mb-6 border-b-2 border-blue-100 pb-2">Subject-Verb Agreement</h2>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 class="font-bold text-base mb-1 text-blue-800">Singular Rule</h3>
                        <p class="text-slate-600 text-sm mb-2">Singular Nouns take Singular Verbs.</p>
                        <div class="bg-white p-2 rounded border border-blue-200 text-xs">
                          <span class="text-green-600">✅</span> The <strong>dog</strong> <u>barks</u>.
                        </div>
                      </div>
                      <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h3 class="font-bold text-base mb-1 text-green-800">Plural Rule</h3>
                        <p class="text-slate-600 text-sm mb-2">Plural Nouns take Plural Verbs.</p>
                        <div class="bg-white p-2 rounded border border-green-200 text-xs">
                          <span class="text-green-600">✅</span> The <strong>dogs</strong> <u>bark</u>.
                        </div>
                      </div>
                      <div class="col-span-2 bg-purple-50 p-4 rounded-lg border border-purple-100">
                         <h3 class="font-bold text-base mb-1 text-purple-800">Compound Rule</h3>
                         <p class="text-slate-600 text-sm mb-2">Compound Nouns (joined by "and") generally take Plural Verbs.</p>
                         <div class="bg-white p-2 rounded border border-purple-200 text-xs">
                          <span class="text-green-600">✅</span> <strong>Bob and Tom</strong> <u>are</u> going to the gym.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-slate-50 p-4 text-xs text-slate-500 flex justify-between">
                    <span>Cirrus LMS</span>
                    <span>Slide 2 of 6</span>
                  </div>
                </div>

                <div class="bg-white text-slate-900 aspect-video rounded-xl shadow-2xl overflow-hidden flex flex-col border-4 border-slate-200">
                  <div class="p-12 flex-1 flex flex-col justify-center">
                    <h2 class="text-3xl font-bold text-blue-700 mb-6">Verb Tenses Overview</h2>
                    <div class="overflow-hidden rounded-lg border border-slate-200">
                      <table class="w-full text-left text-sm">
                        <thead class="bg-slate-100 text-slate-700">
                          <tr>
                            <th class="p-3 font-bold">Tense</th>
                            <th class="p-3 font-bold">Use Case</th>
                            <th class="p-3 font-bold">Example</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                          <tr>
                            <td class="p-3 font-medium text-blue-600">Simple Present</td>
                            <td class="p-3 text-slate-600">Daily routines, facts</td>
                            <td class="p-3 text-slate-800">I <u>eat</u> lunch at noon.</td>
                          </tr>
                          <tr>
                            <td class="p-3 font-medium text-green-600">Simple Past</td>
                            <td class="p-3 text-slate-600">Completed actions</td>
                            <td class="p-3 text-slate-800">I <u>ate</u> lunch yesterday.</td>
                          </tr>
                          <tr>
                            <td class="p-3 font-medium text-purple-600">Simple Future</td>
                            <td class="p-3 text-slate-600">Upcoming actions</td>
                            <td class="p-3 text-slate-800">I <u>will eat</u> lunch later.</td>
                          </tr>
                           <tr>
                            <td class="p-3 font-medium text-orange-600">Present Perfect</td>
                            <td class="p-3 text-slate-600">Past action, present relevance</td>
                            <td class="p-3 text-slate-800">I <u>have eaten</u> already.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="bg-slate-50 p-4 text-xs text-slate-500 flex justify-between">
                    <span>Cirrus LMS</span>
                    <span>Slide 3 of 6</span>
                  </div>
                </div>

                 <div class="bg-white text-slate-900 aspect-video rounded-xl shadow-2xl overflow-hidden flex flex-col border-4 border-slate-200">
                  <div class="p-12 flex-1 flex flex-col justify-center">
                    <h2 class="text-3xl font-bold text-blue-700 mb-6">Sentence Patterns</h2>
                     <div class="space-y-6">
                        <div class="flex gap-4 items-center bg-slate-50 p-4 rounded-lg">
                            <div class="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">S-V</div>
                            <div>
                                <h3 class="font-bold text-slate-900">Subject + Verb</h3>
                                <p class="text-slate-600 italic">"She sleeps."</p>
                            </div>
                        </div>
                        <div class="flex gap-4 items-center bg-slate-50 p-4 rounded-lg">
                            <div class="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">S-V-O</div>
                            <div>
                                <h3 class="font-bold text-slate-900">Subject + Verb + Object</h3>
                                <p class="text-slate-600 italic">"He kicks the ball."</p>
                            </div>
                        </div>
                         <div class="flex gap-4 items-center bg-slate-50 p-4 rounded-lg">
                            <div class="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">S-V-C</div>
                            <div>
                                <h3 class="font-bold text-slate-900">Subject + Verb + Complement</h3>
                                <p class="text-slate-600 italic">"They are happy."</p>
                            </div>
                        </div>
                     </div>
                  </div>
                  <div class="bg-slate-50 p-4 text-xs text-slate-500 flex justify-between">
                    <span>Cirrus LMS</span>
                    <span>Slide 4 of 6</span>
                  </div>
                </div>

                <div class="bg-white text-slate-900 aspect-video rounded-xl shadow-2xl overflow-hidden flex flex-col border-4 border-slate-200">
                  <div class="p-12 flex-1 flex flex-col justify-center">
                    <h2 class="text-3xl font-bold text-blue-700 mb-6">Prepositions: In, On, At</h2>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <div class="text-4xl font-bold text-blue-600 mb-2">IN</div>
                            <p class="text-xs font-bold text-slate-500 uppercase mb-2">General</p>
                            <p class="text-sm text-slate-700 border-t border-blue-200 pt-2">in the morning</p>
                            <p class="text-sm text-slate-700">in 2024</p>
                            <p class="text-sm text-slate-700">in Australia</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center">
                            <div class="text-4xl font-bold text-green-600 mb-2">ON</div>
                            <p class="text-xs font-bold text-slate-500 uppercase mb-2">More Specific</p>
                            <p class="text-sm text-slate-700 border-t border-green-200 pt-2">on Monday</p>
                            <p class="text-sm text-slate-700">on my birthday</p>
                            <p class="text-sm text-slate-700">on the bus</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center">
                            <div class="text-4xl font-bold text-purple-600 mb-2">AT</div>
                            <p class="text-xs font-bold text-slate-500 uppercase mb-2">Very Specific</p>
                            <p class="text-sm text-slate-700 border-t border-purple-200 pt-2">at 7:00 PM</p>
                            <p class="text-sm text-slate-700">at night</p>
                            <p class="text-sm text-slate-700">at home</p>
                        </div>
                    </div>
                  </div>
                  <div class="bg-slate-50 p-4 text-xs text-slate-500 flex justify-between">
                    <span>Cirrus LMS</span>
                    <span>Slide 5 of 6</span>
                  </div>
                </div>

                <div class="bg-white text-slate-900 aspect-video rounded-xl shadow-2xl overflow-hidden flex flex-col border-4 border-slate-200">
                  <div class="bg-slate-900 p-12 flex-1 flex flex-col justify-center items-center text-center text-white">
                    <h2 class="text-3xl font-bold mb-6 text-blue-400">Practice Time!</h2>
                    <p class="text-xl mb-8 leading-relaxed max-w-lg">Complete the sentence:</p>
                    <div class="bg-white/10 p-6 rounded-xl border border-white/20 mb-8">
                      <p class="text-2xl font-mono tracking-widest">"I _______ to the store _______ Monday."</p>
                      <div class="grid grid-cols-2 gap-4 mt-6">
                         <button class="bg-slate-700 hover:bg-slate-600 p-3 rounded text-sm">go / in</button>
                         <button class="bg-green-600 hover:bg-green-500 p-3 rounded text-sm font-bold shadow-lg transform scale-105">went / on</button>
                         <button class="bg-slate-700 hover:bg-slate-600 p-3 rounded text-sm">going / at</button>
                         <button class="bg-slate-700 hover:bg-slate-600 p-3 rounded text-sm">gone / in</button>
                      </div>
                    </div>
                  </div>
                  <div class="bg-slate-50 p-4 text-xs text-slate-500 flex justify-between">
                    <span>Cirrus LMS</span>
                    <span>Slide 6 of 6</span>
                  </div>
                </div>
              </div>
            `
          },
          { 
            id: "l2", 
            title: "Common Nouns vs Proper Nouns", 
            type: "reading", 
            duration: "10 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div>
                  <h3 class="text-2xl font-bold mb-4 text-primary">Part 1: Parts of Speech</h3>
                  <div class="grid gap-4 md:grid-cols-3">
                    <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 class="font-bold text-lg text-blue-400 mb-2">Nouns</h4>
                      <p class="text-slate-300 mb-2">Names of people, places, or things.</p>
                      <div class="text-sm bg-slate-900 p-2 rounded text-slate-400">
                        Examples: <span class="text-white">Welder, Australia, Helmet</span>
                      </div>
                    </div>
                    <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 class="font-bold text-lg text-green-400 mb-2">Verbs</h4>
                      <p class="text-slate-300 mb-2">Action words.</p>
                      <div class="text-sm bg-slate-900 p-2 rounded text-slate-400">
                        Examples: <span class="text-white">Fix, Build, Speak</span>
                      </div>
                    </div>
                    <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 class="font-bold text-lg text-purple-400 mb-2">Adjectives</h4>
                      <p class="text-slate-300 mb-2">Describing words.</p>
                      <div class="text-sm bg-slate-900 p-2 rounded text-slate-400">
                        Examples: <span class="text-white">Heavy, Strong, Clear</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-2xl font-bold mb-4 text-primary">Part 2: Common vs. Proper Nouns</h3>
                  <div class="overflow-hidden rounded-lg border border-slate-700">
                    <table class="w-full text-left text-sm">
                      <thead class="bg-slate-800 text-slate-200">
                        <tr>
                          <th class="p-4 font-bold">Type</th>
                          <th class="p-4 font-bold">Definition</th>
                          <th class="p-4 font-bold">Rule</th>
                          <th class="p-4 font-bold">Examples</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-700 bg-slate-900/50">
                        <tr>
                          <td class="p-4 font-medium text-blue-400">Common Nouns</td>
                          <td class="p-4 text-slate-300">General items</td>
                          <td class="p-4 text-slate-400">Not capitalized</td>
                          <td class="p-4 text-slate-200">car, mechanic, city</td>
                        </tr>
                        <tr>
                          <td class="p-4 font-medium text-green-400">Proper Nouns</td>
                          <td class="p-4 text-slate-300">Specific names</td>
                          <td class="p-4 text-slate-400">Always capitalized</td>
                          <td class="p-4 text-slate-200">Toyota, John, Sydney</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            `
          },
          { id: "l3-bonus", title: "Practice: Noun Identification", type: "assignment", duration: "10 min", isCompleted: false },
          { 
            id: "l3-vid", 
            title: "Video: Sentence Examples", 
            type: "video", 
            duration: "5 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/54jIMyeq744",
            resources: [
              { title: "Sentence Structure Cheat Sheet.pdf", type: "pdf" },
              { title: "50 Common English Sentences.pdf", type: "pdf" },
              { title: "Extra Practice Worksheet.docx", type: "doc" }
            ]
          },
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
          { id: "l4-read", title: "Verb List: Top 50 Common Verbs", type: "reading", duration: "15 min", isCompleted: false },
          { id: "l5", title: "Present Simple Practice", type: "assignment", duration: "20 min", isCompleted: false },
          { id: "l5-vid", title: "Past Tense Introduction", type: "video", duration: "10 min", isCompleted: false },
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
          { 
            id: "tw1-l1", 
            title: "PPE Standards & Usage", 
            type: "video", 
            duration: "12 min", 
            isCompleted: false, 
            videoUrl: "https://www.youtube.com/embed/KzVvjX_2u_A",
            content: "<h3>Safety Essentials</h3><ul><li>Wear a Level 10 Shade Helmet</li><li>Leather gloves are mandatory</li></ul>"
          },
          { id: "tw1-l1-check", title: "Knowledge Check: PPE", type: "assignment", duration: "10 min", isCompleted: false },
          { id: "tw1-l2", title: "Hazard Identification", type: "reading", duration: "15 min", isCompleted: false },
          { id: "tw1-l2-vid", title: "Video: Recognizing Hazards", type: "video", duration: "8 min", isCompleted: false },
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
            { id: "tcarp1-l1", title: "Power Tool Safety", type: "video", duration: "15 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/AtpZ4OQZ-c4" },
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
