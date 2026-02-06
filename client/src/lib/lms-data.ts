
import { CheckCircle2, Lock, PlayCircle, BookOpen, PenTool, Mic, Headphones } from "lucide-react";

export type ModuleStatus = "locked" | "unlocked" | "in-progress" | "completed";

export type LessonType = "video" | "reading" | "quiz" | "assignment";

export interface LessonBase {
  id: string;
  title: string;
  duration: string; // e.g. "10 min"
  isCompleted: boolean;
  resources?: { title: string; type: "pdf" | "doc" | "link" }[];
}

export interface VideoLesson extends LessonBase {
  type: "video";
  videoUrl?: string; // Optional YouTube embed URL
  content?: string; // Optional rich text content for reading lessons
}

export interface ReadingLesson extends LessonBase {
  type: "reading";
  content?: string; // Optional rich text content for reading lessons
}

export interface QuizLesson extends LessonBase {
  type: "quiz";
  content?: string;
}

export interface AssignmentLesson extends LessonBase {
  type: "assignment";
  content?: string;
}

export type Lesson = VideoLesson | ReadingLesson | QuizLesson | AssignmentLesson;

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
  silo?: "Mechanics" | "Welders" | "Healthcare" | "General" | "Carpenters"; // For Technical
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
        title: "Module 1: Basic Grammar",
        description: "Foundational rules for sentence structure, verb tenses, and agreements.",
        status: "unlocked",
        progress: 0,
        lessons: [
          {
            id: "l0-parts-speech",
            title: "The 9 Parts of Speech",
            type: "reading",
            duration: "20 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-violet-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">The 9 Parts of Speech</h1>
                   <p class="text-violet-200 text-lg">Understanding these building blocks is the first step to mastering English grammar.</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                   <div class="bg-green-100 p-6 rounded-lg border border-green-200 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-green-800 mb-2 uppercase tracking-wider">Noun</h3>
                      <p class="text-green-900 text-sm mb-3 font-medium">Refers to a person, place, thing, activity, quality, or idea.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-green-900 border border-green-200">
                         <p>🐶 dog, cat, school, work, teacher</p>
                      </div>
                   </div>

                   <div class="bg-yellow-100 p-6 rounded-lg border border-yellow-200 shadow-sm relative overflow-hidden">
                       <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-yellow-800 mb-2 uppercase tracking-wider">Pronoun</h3>
                      <p class="text-yellow-900 text-sm mb-3 font-medium">Words used instead of a noun or noun phrase.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-yellow-900 border border-yellow-200">
                         <p>👤 he, I, me, she, that, this</p>
                      </div>
                   </div>

                   <div class="bg-orange-100 p-6 rounded-lg border border-orange-200 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-orange-800 mb-2 uppercase tracking-wider">Verb</h3>
                      <p class="text-orange-900 text-sm mb-3 font-medium">Describes an action, experience, or state of being.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-orange-900 border border-orange-200">
                         <p>🏃 run, sit, go, have, get, invite</p>
                      </div>
                   </div>

                   <div class="bg-amber-100 p-6 rounded-lg border border-amber-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-amber-800 mb-2 uppercase tracking-wider">Adjective</h3>
                      <p class="text-amber-900 text-sm mb-3 font-medium">Describes a noun or pronoun.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-amber-900 border border-amber-200">
                         <p>🌟 angry, brave, healthy, good, big</p>
                      </div>
                   </div>

                   <div class="bg-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-purple-800 mb-2 uppercase tracking-wider">Adverb</h3>
                      <p class="text-purple-900 text-sm mb-3 font-medium">Describes a verb, adjective, or another adverb.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-purple-900 border border-purple-200">
                         <p>⚡ badly, fully, carefully, never</p>
                      </div>
                   </div>

                   <div class="bg-yellow-200 p-6 rounded-lg border border-yellow-300 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-yellow-900 mb-2 uppercase tracking-wider">Article</h3>
                      <p class="text-yellow-950 text-sm mb-3 font-medium">Words used before a noun to modify it.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-yellow-950 border border-yellow-300">
                         <p>🅰️ the, a, an</p>
                      </div>
                   </div>

                   <div class="bg-cyan-100 p-6 rounded-lg border border-cyan-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-cyan-800 mb-2 uppercase tracking-wider">Preposition</h3>
                      <p class="text-cyan-900 text-sm mb-3 font-medium">Shows place, time, or direction before a noun.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-cyan-900 border border-cyan-200">
                         <p>📍 in, from, of, before, since</p>
                      </div>
                   </div>

                   <div class="bg-lime-100 p-6 rounded-lg border border-lime-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-lime-800 mb-2 uppercase tracking-wider">Conjunction</h3>
                      <p class="text-lime-900 text-sm mb-3 font-medium">Connects words, phrases, or clauses.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-lime-900 border border-lime-200">
                         <p>🔗 and, or, so, after, either</p>
                      </div>
                   </div>

                   <div class="bg-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-blue-800 mb-2 uppercase tracking-wider">Interjection</h3>
                      <p class="text-blue-900 text-sm mb-3 font-medium">Expresses a strong feeling or emotion.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-blue-900 border border-blue-200">
                         <p>❗️ wow!, oh!, hey!, ouch!</p>
                      </div>
                   </div>
                </div>
              </div>
            `
          },
          { 
            id: "l1", 
            title: "Grammar Overview: Top 10 Rules", 
            type: "reading", 
            duration: "30 min", 
            isCompleted: false, 
            content: `
              <div class="space-y-8">
                <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Grammar Overview</h1>
                   <p class="text-indigo-200 text-lg">Mastering these top grammar rules is essential for strong communication skills.</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                         <h3 class="font-bold text-lg text-slate-900">Have / Has / Had + V3</h3>
                      </div>
                      <p class="text-slate-600 mb-3">These words are always followed by the <strong>Past Participle</strong> (3rd form) of the verb.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-blue-500 text-slate-700">
                         <p class="mb-1">✅ She has <strong>completed</strong> her work.</p>
                         <p>❌ She has <strong>complete</strong> her work.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</div>
                         <h3 class="font-bold text-lg text-slate-900">To + V1</h3>
                      </div>
                      <p class="text-slate-600 mb-3">The preposition 'to' is followed by the <strong>Base Form</strong> (1st form) of the verb.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-green-500 text-slate-700">
                         <p class="mb-1">✅ He decided to <strong>take</strong> a leave.</p>
                         <p>❌ He decided to <strong>took</strong> a leave.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
                         <h3 class="font-bold text-lg text-slate-900">Modals + V1</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Can, could, may, might, should, will, would are followed by the <strong>Base Form</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-purple-500 text-slate-700">
                         <p class="mb-1">✅ You should <strong>speak</strong> English.</p>
                         <p>❌ You should <strong>speaking</strong> English.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">4</div>
                         <h3 class="font-bold text-lg text-slate-900">Prepositions + V-ing</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Prepositions like 'of', 'for', 'with', 'in' (except 'to') are followed by the <strong>-ing form</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-orange-500 text-slate-700">
                         <p class="mb-1">✅ Thanks for <strong>giving</strong> me this chance.</p>
                         <p>❌ Thanks for <strong>give</strong> me this chance.</p>
                      </div>
                   </div>
                   
                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">5</div>
                         <h3 class="font-bold text-lg text-slate-900">Many + Plural Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">'Many' indicates multiple items, so the noun must be <strong>Plural</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-teal-500 text-slate-700">
                         <p class="mb-1">✅ Many <strong>languages</strong> are spoken here.</p>
                         <p>❌ Many <strong>language</strong> are spoken here.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">6</div>
                         <h3 class="font-bold text-lg text-slate-900">Article + (Adj) + Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Articles (a, an, the) are followed by a Noun. If there's a word in between, it's an Adjective.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-rose-500 text-slate-700">
                         <p class="mb-1">✅ The <strong>book</strong> (Article + Noun)</p>
                         <p>✅ The <strong>big</strong> book (Article + Adj + Noun)</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">7</div>
                         <h3 class="font-bold text-lg text-slate-900">Subject-Verb Agreement</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Singular Subject = Singular Verb (with 's'). Plural Subject = Plural Verb (no 's').</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-indigo-500 text-slate-700">
                         <p class="mb-1">✅ The student <strong>writes</strong>.</p>
                         <p>✅ The students <strong>write</strong>.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">8</div>
                         <h3 class="font-bold text-lg text-slate-900">Passive Voice</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Forms of 'Be' (is, am, are, was, were, be, been, being) + <strong>V3</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-yellow-500 text-slate-700">
                         <p class="mb-1">✅ The report was <strong>written</strong> by him.</p>
                         <p>❌ The report was <strong>write</strong> by him.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">9</div>
                         <h3 class="font-bold text-lg text-slate-900">One of the + Plural Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">After 'One of the', the noun is always <strong>Plural</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-cyan-500 text-slate-700">
                         <p class="mb-1">✅ One of the <strong>problems</strong> is...</p>
                         <p>❌ One of the <strong>problem</strong> is...</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold">10</div>
                         <h3 class="font-bold text-lg text-slate-900">Despite / In spite of</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Followed by a Noun or V-ing. 'Despite' never takes 'of'.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-fuchsia-500 text-slate-700">
                         <p class="mb-1">✅ <strong>Despite</strong> the rain...</p>
                         <p>❌ <strong>Despite of</strong> the rain...</p>
                      </div>
                   </div>
                </div>
              </div>
            `
          },
          { 
            id: "l2", 
            title: "Common Nouns vs Proper Nouns", 
            type: "reading", 
            duration: "20 min", 
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
          { 
            id: "l3-bonus", 
            title: "Practice: Noun Identification", 
            type: "assignment", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                 <div class="bg-indigo-50 p-8 rounded-xl border border-indigo-100 text-center">
                    <h3 class="text-2xl font-bold text-indigo-900 mb-4">Interactive Exercise</h3>
                    <p class="text-lg text-indigo-700 mb-6">Drag and drop the words into the correct category: <strong>Person</strong>, <strong>Place</strong>, or <strong>Thing</strong>.</p>
                    <div class="inline-block px-6 py-3 bg-white rounded-lg shadow-sm border border-indigo-200 text-indigo-600 font-medium">
                       Interactive component loaded below...
                    </div>
                 </div>
              </div>
            `
          },
          { 
            id: "l3-vid", 
            title: "Video: Sentence Examples", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/54jIMyeq744",
            resources: [
              { title: "Sentence Structure Cheat Sheet.pdf", type: "pdf" },
              { title: "50 Common English Sentences.pdf", type: "pdf" },
              { title: "Extra Practice Worksheet.docx", type: "doc" }
            ]
          },
          { id: "l3", title: "Module Quiz", type: "quiz", duration: "30 min", isCompleted: false }
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
          { 
            id: "tw1-l1-check", 
            title: "Knowledge Check: PPE Inspection", 
            type: "assignment", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-100">
                   <h3 class="text-xl font-bold text-blue-800 mb-4">Pre-Shift Inspection Checklist</h3>
                   <p class="text-slate-700 mb-4">Before striking an arc, verify the integrity of your personal protective equipment.</p>
                   
                   <div class="grid gap-4">
                      <div class="flex items-start gap-3 bg-white p-3 rounded shadow-sm">
                         <div class="mt-1 bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">1</div>
                         <div>
                            <strong class="block text-slate-800">Welding Helmet</strong>
                            <span class="text-sm text-slate-500">Check for cracks in the shell. Ensure auto-darkening lens has fresh batteries. Verify shade setting is at minimum #10 for amperage > 80A.</span>
                         </div>
                      </div>
                      <div class="flex items-start gap-3 bg-white p-3 rounded shadow-sm">
                         <div class="mt-1 bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">2</div>
                         <div>
                            <strong class="block text-slate-800">Protective Clothing</strong>
                            <span class="text-sm text-slate-500">Must be 100% cotton or wool. NO POLYESTER (it melts into skin). Sleeves rolled down. Pockets buttoned shut to prevent catching sparks.</span>
                         </div>
                      </div>
                      <div class="flex items-start gap-3 bg-white p-3 rounded shadow-sm">
                         <div class="mt-1 bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">3</div>
                         <div>
                            <strong class="block text-slate-800">Gloves & Boots</strong>
                            <span class="text-sm text-slate-500">Gauntlet-style leather gloves required. Boots must be leather, steel-toed, with metatarsal guards preferred.</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div class="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                   <h4 class="font-bold text-yellow-800 mb-2">Scenario Analysis</h4>
                   <p class="text-sm text-slate-700 italic mb-4">"A welder is wearing a cotton t-shirt with a polyester vest on top. He is welding in a damp area."</p>
                   <p class="font-bold text-slate-900">Identify the 2 major violations:</p>
                   <ul class="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-800">
                      <li>Synthetic material (polyester vest) presents a melting hazard.</li>
                      <li>Damp environment increases electrical shock risk.</li>
                   </ul>
                </div>
              </div>
            `
          },
          { 
            id: "tw1-l2", 
            title: "Hazard Identification", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h3 class="text-xl font-bold text-red-700 mb-2">CRITICAL: The Big Three Hazards</h3>
                  <ul class="list-disc pl-5 space-y-2 text-slate-700">
                    <li><strong>Arc Flash:</strong> UV radiation that can burn eyes and skin in seconds.</li>
                    <li><strong>Fumes:</strong> Toxic gases from welding galvanized steel or exotic alloys.</li>
                    <li><strong>Fire/Explosion:</strong> Sparks can travel up to 35 feet.</li>
                  </ul>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h4 class="text-lg font-bold text-blue-400 mb-4">Fume Control</h4>
                    <p class="text-slate-300 text-sm mb-4">Always position the fume extractor <strong>6-12 inches</strong> from the weld zone.</p>
                    <div class="bg-slate-900 p-3 rounded text-center text-xs text-slate-500">
                      Diagram: Extractor positioning
                    </div>
                  </div>
                  <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h4 class="text-lg font-bold text-orange-400 mb-4">Electrical Safety</h4>
                    <p class="text-slate-300 text-sm mb-4">Never weld in wet conditions. Ensure ground clamp has metal-to-metal contact.</p>
                    <div class="bg-slate-900 p-3 rounded text-center text-xs text-slate-500">
                      Diagram: Grounding circuit
                    </div>
                  </div>
                </div>
              </div>
            `
          },
          { 
            id: "tw1-l2-vid", 
            title: "Video: Recognizing Hazards", 
            type: "video", 
            duration: "8 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/9l7J0i7_WAg" 
          },
          { id: "tw1-l3", title: "Safety Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "tw2",
        title: "Module 2: Arc Welding Fundamentals",
        description: "Core principles of Shielded Metal Arc Welding (SMAW), electrode selection, and current settings.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "tw2-l1", 
            title: "Arc Welding Basics", 
            type: "video", 
            duration: "20 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/TeB2eWdK6aU" 
          },
          { 
            id: "tw2-l2", 
            title: "Electrode Classification", 
            type: "reading", 
            duration: "30 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div>
                  <h3 class="text-2xl font-bold mb-4 text-primary">Decoding the Numbers</h3>
                  <p class="text-lg text-slate-600 mb-6">Understanding the AWS classification system (e.g., E7018) is critical for selecting the right rod.</p>
                  
                  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div class="text-center mb-8">
                      <span class="text-6xl font-black text-slate-900 tracking-widest">E-70-1-8</span>
                    </div>
                    
                    <div class="grid grid-cols-4 gap-2 text-center text-sm">
                      <div class="space-y-2">
                        <div class="font-bold text-blue-600">E</div>
                        <div class="text-slate-500">Electrode</div>
                      </div>
                      <div class="space-y-2">
                        <div class="font-bold text-green-600">70</div>
                        <div class="text-slate-500">70,000 PSI<br/>Tensile Strength</div>
                      </div>
                      <div class="space-y-2">
                        <div class="font-bold text-purple-600">1</div>
                        <div class="text-slate-500">Position<br/>(1 = All Positions)</div>
                      </div>
                      <div class="space-y-2">
                        <div class="font-bold text-orange-600">8</div>
                        <div class="text-slate-500">Coating/Current<br/>(Low Hydrogen, AC/DCEP)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="font-bold text-lg mb-4">Common Electrodes</h4>
                  <div class="overflow-hidden rounded-lg border border-slate-200">
                    <table class="w-full text-left text-sm">
                      <thead class="bg-slate-100">
                        <tr>
                          <th class="p-3 font-bold">Rod</th>
                          <th class="p-3 font-bold">Nickname</th>
                          <th class="p-3 font-bold">Characteristics</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200">
                        <tr>
                          <td class="p-3 font-mono font-bold">E6010</td>
                          <td class="p-3">"60-10"</td>
                          <td class="p-3">Deep penetration, works on dirty/rusty metal.</td>
                        </tr>
                        <tr>
                          <td class="p-3 font-mono font-bold">E7018</td>
                          <td class="p-3">"Lo-Hy"</td>
                          <td class="p-3">Strong, smooth welds. Must be kept dry.</td>
                        </tr>
                        <tr>
                          <td class="p-3 font-mono font-bold">E6013</td>
                          <td class="p-3">"Farmers Rod"</td>
                          <td class="p-3">Easy to run, shallow penetration. Good for sheet metal.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            `
          },
          { id: "tw2-l3", title: "Process Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "tw3",
        title: "Technical Exam (Hard Tier)",
        description: "Comprehensive assessment of welding knowledge. Pass at 80%+ to verify technical skills.",
        status: "locked",
        progress: 0,
        lessons: [
          { id: "tw3-final", title: "Final Technical Assessment", type: "quiz", duration: "90 min", isCompleted: false }
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
          { id: "tmec1-l1", title: "Four-Stroke Cycle", type: "video", duration: "20 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/OGj8OneMjek" },
          { 
            id: "tmec1-l2", 
            title: "Engine Components", 
            type: "reading", 
            duration: "30 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="grid md:grid-cols-2 gap-8 items-center">
                   <div>
                      <h3 class="text-2xl font-bold mb-4 text-slate-800">The Heart of the Car</h3>
                      <p class="text-slate-600 mb-4">The internal combustion engine converts chemical energy (fuel) into mechanical energy (motion). This happens inside a sealed cylinder.</p>
                      <ul class="space-y-3">
                        <li class="flex items-start gap-3">
                           <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">1</div>
                           <div>
                              <strong class="block text-slate-800">Cylinder Block</strong>
                              <span class="text-sm text-slate-500">The main structure that houses the cylinders.</span>
                           </div>
                        </li>
                        <li class="flex items-start gap-3">
                           <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">2</div>
                           <div>
                              <strong class="block text-slate-800">Cylinder Head</strong>
                              <span class="text-sm text-slate-500">Sits on top, contains valves and spark plugs.</span>
                           </div>
                        </li>
                        <li class="flex items-start gap-3">
                           <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">3</div>
                           <div>
                              <strong class="block text-slate-800">Piston</strong>
                              <span class="text-sm text-slate-500">Moves up and down to compress fuel/air.</span>
                           </div>
                        </li>
                        <li class="flex items-start gap-3">
                           <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">4</div>
                           <div>
                              <strong class="block text-slate-800">Crankshaft</strong>
                              <span class="text-sm text-slate-500">Converts up/down motion into rotation.</span>
                           </div>
                        </li>
                      </ul>
                   </div>
                   <div class="bg-slate-100 rounded-xl p-8 flex items-center justify-center border border-slate-200">
                      <div class="text-center">
                         <div class="w-32 h-48 border-x-4 border-slate-400 mx-auto relative bg-white">
                            <div class="absolute bottom-0 w-full h-24 bg-slate-300 animate-pulse"></div>
                            <div class="absolute top-2 left-2 w-4 h-4 rounded-full bg-orange-500"></div>
                         </div>
                         <p class="mt-4 text-xs font-mono text-slate-500">SIMPLIFIED PISTON DIAGRAM</p>
                      </div>
                   </div>
                </div>
              </div>
            `
          },
          { id: "tmec1-l3", title: "Engine Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "tmec2",
        title: "Module 2: Brake Systems",
        description: "Hydraulic braking principles and maintenance.",
        status: "locked",
        progress: 0,
        lessons: [
            { 
                id: "tmec2-l1", 
                title: "Hydraulic Principles", 
                type: "video", 
                duration: "20 min", 
                isCompleted: false,
                videoUrl: "https://www.youtube.com/embed/Zz95_VvTxZM" 
            },
            { 
                id: "tmec2-l2", 
                title: "Disc vs Drum Brakes", 
                type: "reading", 
                duration: "30 min", 
                isCompleted: false,
                content: `
                    <div class="space-y-6">
                        <h3 class="text-xl font-bold">Braking Systems Compared</h3>
                        <p class="text-slate-600">Most modern vehicles use Disc brakes on the front and either Disc or Drum brakes on the rear.</p>
                        
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <h4 class="font-bold text-lg mb-2 text-blue-600">Disc Brakes</h4>
                                <ul class="list-disc pl-5 text-sm space-y-1 text-slate-600">
                                    <li>Uses a <strong>caliper</strong> to squeeze pads against a <strong>rotor</strong>.</li>
                                    <li>Better heat dissipation (less fade).</li>
                                    <li>Self-cleaning (water/dust spins off).</li>
                                    <li>Standard on front wheels.</li>
                                </ul>
                            </div>
                            <div class="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <h4 class="font-bold text-lg mb-2 text-orange-600">Drum Brakes</h4>
                                <ul class="list-disc pl-5 text-sm space-y-1 text-slate-600">
                                    <li>Uses <strong>shoes</strong> that press outward against a <strong>drum</strong>.</li>
                                    <li>Self-energizing effect (requires less pedal force).</li>
                                    <li>Cheaper to manufacture.</li>
                                    <li>Harder to service.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            },
            { id: "tmec2-l3", title: "Brake Systems Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "tmec3",
        title: "Technical Exam (Hard Tier)",
        description: "Final verification of mechanical aptitude.",
        status: "locked",
        progress: 0,
        lessons: [
            { id: "tmec3-final", title: "Final Mechanics Assessment", type: "quiz", duration: "90 min", isCompleted: false }
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
            { id: "tcarp1-l1", title: "Power Tool Safety", type: "video", duration: "20 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/AtpZ4OQZ-c4" },
            { 
                id: "tcarp1-l2", 
                title: "Wood Types & Grades", 
                type: "reading", 
                duration: "30 min", 
                isCompleted: false,
                content: `
                    <div class="space-y-8">
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-amber-800">Understanding Wood</h3>
                            <p class="text-slate-600 mb-6">Lumber is divided into two main categories: Hardwood and Softwood. This refers to the tree's reproduction (seeds), not necessarily physical hardness.</p>
                            
                            <div class="grid grid-cols-2 gap-0 border rounded-xl overflow-hidden">
                                <div class="bg-amber-50 p-6 border-r border-amber-100">
                                    <h4 class="font-bold text-lg text-amber-900 mb-2">Softwood</h4>
                                    <p class="text-xs text-amber-700 uppercase font-bold tracking-wider mb-4">Conifers (Needles/Cones)</p>
                                    <ul class="text-sm space-y-2 text-amber-900/80">
                                        <li>• Pine</li>
                                        <li>• Fir</li>
                                        <li>• Spruce</li>
                                        <li>• Cedar</li>
                                    </ul>
                                    <p class="mt-4 text-xs italic text-amber-600">Used for: Framing, construction, outdoor decks.</p>
                                </div>
                                <div class="bg-stone-50 p-6">
                                    <h4 class="font-bold text-lg text-stone-900 mb-2">Hardwood</h4>
                                    <p class="text-xs text-stone-700 uppercase font-bold tracking-wider mb-4">Deciduous (Leaves)</p>
                                    <ul class="text-sm space-y-2 text-stone-900/80">
                                        <li>• Oak</li>
                                        <li>• Maple</li>
                                        <li>• Cherry</li>
                                        <li>• Walnut</li>
                                    </ul>
                                    <p class="mt-4 text-xs italic text-stone-600">Used for: Furniture, flooring, fine cabinetry.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-bold text-lg mb-2">Common Lumber Defects</h4>
                            <div class="flex gap-4 overflow-x-auto pb-4">
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center">
                                    <div class="font-bold text-slate-800">Knot</div>
                                    <div class="text-xs text-slate-500">Branch base</div>
                                </div>
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center">
                                    <div class="font-bold text-slate-800">Check</div>
                                    <div class="text-xs text-slate-500">Crack along grain</div>
                                </div>
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center">
                                    <div class="font-bold text-slate-800">Wane</div>
                                    <div class="text-xs text-slate-500">Missing wood/bark edge</div>
                                </div>
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center">
                                    <div class="font-bold text-slate-800">Cup</div>
                                    <div class="text-xs text-slate-500">Curve across width</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            { id: "tcarp1-l3", title: "Tools Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "tcarp2",
        title: "Module 2: Framing Basics",
        description: "Structural framing for walls and roofs.",
        status: "locked",
        progress: 0,
        lessons: [
            { 
                id: "tcarp2-l1", 
                title: "Wall Framing", 
                type: "video", 
                duration: "25 min", 
                isCompleted: false,
                videoUrl: "https://www.youtube.com/embed/3ogM2q_bLhM" 
            },
            { 
                id: "tcarp2-l2", 
                title: "Roof Systems", 
                type: "reading", 
                duration: "30 min", 
                isCompleted: false,
                content: `
                    <div class="space-y-6">
                        <h3 class="text-xl font-bold">Roof Framing Fundamentals</h3>
                        <p class="text-slate-600">The roof structure supports the covering (shingles/metal) and transfers loads to the walls.</p>
                        
                        <div class="bg-slate-900 text-white p-6 rounded-xl">
                            <h4 class="font-bold text-lg mb-4 text-blue-300">Key Terminology</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <strong class="block text-yellow-400">Span</strong>
                                    <span class="text-sm text-slate-400">The distance between the outside edges of the supporting walls.</span>
                                </div>
                                <div>
                                    <strong class="block text-yellow-400">Run</strong>
                                    <span class="text-sm text-slate-400">Half the span (for a standard gable roof).</span>
                                </div>
                                <div>
                                    <strong class="block text-yellow-400">Rise</strong>
                                    <span class="text-sm text-slate-400">The vertical height of the roof from the wall plate to the ridge.</span>
                                </div>
                                <div>
                                    <strong class="block text-yellow-400">Pitch (Slope)</strong>
                                    <span class="text-sm text-slate-400">Ratio of Rise over Run (e.g., 4/12 pitch means 4" rise for every 12" run).</span>
                                </div>
                            </div>
                        </div>

                        <div class="border border-slate-200 rounded-lg p-4">
                            <h4 class="font-bold mb-2">Rafters vs. Trusses</h4>
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50">
                                    <tr>
                                        <th class="p-2 text-left">Feature</th>
                                        <th class="p-2 text-left">Stick Framing (Rafters)</th>
                                        <th class="p-2 text-left">Trusses</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y">
                                    <tr>
                                        <td class="p-2 font-medium">Space Use</td>
                                        <td class="p-2">Open (good for attics)</td>
                                        <td class="p-2">Webbed (hard to use for storage)</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2 font-medium">Speed</td>
                                        <td class="p-2">Slower, more skill required</td>
                                        <td class="p-2">Fast, crane installation</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2 font-medium">Cost</td>
                                        <td class="p-2">More labor, less material</td>
                                        <td class="p-2">Less labor, engineered cost</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `
            },
            { id: "tcarp2-l3", title: "Framing Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "tcarp3",
        title: "Technical Exam (Hard Tier)",
        description: "Final verification of carpentry skills.",
        status: "locked",
        progress: 0,
        lessons: [
            { id: "tcarp3-final", title: "Final Carpentry Assessment", type: "quiz", duration: "90 min", isCompleted: false }
        ]
      }
    ]
  },
  {
    id: "pte-crash-course",
    title: "PTE Academic Crash Course",
    category: "English",
    level: "B2",
    description: "Intensive preparation for the PTE Academic exam. Master Speaking, Reading, Writing, and Listening strategies with targeted practice and a final mock test.",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    totalModules: 5,
    completedModules: 0,
    modules: [
      {
        id: "pte-grammar",
        title: "Module 1: Basic Grammar Rules",
        description: "Top 10 Grammar Rules essential for PTE Reading Fill in the Blanks.",
        status: "unlocked",
        progress: 0,
        lessons: [
          { 
            id: "pte-gram-l1", 
            title: "Rule #1-5: Verbs & Prepositions", 
            type: "reading", 
            duration: "30 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Grammar for PTE Reading</h1>
                   <p class="text-indigo-200 text-lg">Mastering these 10 rules will significantly improve your scores in "Fill in the Blanks".</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                         <h3 class="font-bold text-lg">Have / Has / Had + V3</h3>
                      </div>
                      <p class="text-slate-600 mb-3">These words are always followed by the <strong>Past Participle</strong> (3rd form) of the verb.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-blue-500">
                         <p class="mb-1">✅ She has <strong>completed</strong> her work.</p>
                         <p>❌ She has <strong>complete</strong> her work.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</div>
                         <h3 class="font-bold text-lg">To + V1</h3>
                      </div>
                      <p class="text-slate-600 mb-3">The preposition 'to' is followed by the <strong>Base Form</strong> (1st form) of the verb.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-green-500">
                         <p class="mb-1">✅ He decided to <strong>take</strong> a leave.</p>
                         <p>❌ He decided to <strong>took</strong> a leave.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
                         <h3 class="font-bold text-lg">Modals + V1</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Can, could, may, might, should, will, would are followed by the <strong>Base Form</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-purple-500">
                         <p class="mb-1">✅ You should <strong>speak</strong> English.</p>
                         <p>❌ You should <strong>speaking</strong> English.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">4</div>
                         <h3 class="font-bold text-lg">Prepositions + V-ing</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Prepositions like 'of', 'for', 'with', 'in' (except 'to') are followed by the <strong>-ing form</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-orange-500">
                         <p class="mb-1">✅ Thanks for <strong>giving</strong> me this chance.</p>
                         <p>❌ Thanks for <strong>give</strong> me this chance.</p>
                      </div>
                   </div>
                </div>
              </div>
            `
          },
          { 
            id: "pte-gram-l2", 
            title: "Rule #6-10: Nouns & Articles", 
            type: "reading", 
            duration: "30 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                 <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">5</div>
                         <h3 class="font-bold text-lg">Many + Plural Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">'Many' indicates multiple items, so the noun must be <strong>Plural</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-teal-500">
                         <p class="mb-1">✅ Many <strong>languages</strong> are spoken here.</p>
                         <p>❌ Many <strong>language</strong> are spoken here.</p>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">6</div>
                         <h3 class="font-bold text-lg">Article + (Adj) + Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Articles (a, an, the) are followed by a Noun. If there's a word in between, it's an Adjective.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-rose-500">
                         <p class="mb-1">✅ The <strong>book</strong> (Article + Noun)</p>
                         <p>✅ The <strong>big</strong> book (Article + Adj + Noun)</p>
                      </div>
                   </div>
                 </div>

                 <div class="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h3 class="text-xl font-bold text-yellow-800 mb-4">Pro Tip: Passive Voice</h3>
                    <p class="text-slate-800 mb-2"><strong>Was / Were / Be / Been / Being + V3</strong></p>
                    <p class="text-slate-600">This structure creates the Passive Voice. If you see these helping verbs, look for a Past Participle.</p>
                    <p class="mt-4 font-mono text-sm bg-white p-2 rounded inline-block border border-yellow-300">"The work is being <strong>carried</strong> out."</p>
                 </div>
              </div>
            `
          },
          { id: "pte-grammar-quiz", title: "Grammar Rules Assessment", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "pte-speaking",
        title: "Module 2: Speaking Mastery",
        description: "Master oral fluency and pronunciation for Read Aloud, Repeat Sentence, Describe Image, and Retell Lecture.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "pte-m1-l1", 
            title: "Strategy: Read Aloud", 
            type: "video", 
            duration: "20 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/H3tZj_y8y6E",
            content: "<h3>Read Aloud Tips</h3><ul><li>Speak at a natural pace.</li><li>Do not correct yourself if you make a mistake; keep going.</li><li>Pause slightly at punctuation marks.</li></ul>"
          },
          { 
            id: "pte-m1-l2", 
            title: "Technique: Repeat Sentence", 
            type: "reading", 
            duration: "25 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-2xl font-bold text-blue-800">Repeat Sentence Strategy</h3>
                <p class="text-slate-700">You will hear a sentence. Please repeat the sentence exactly as you hear it. You will hear the sentence only once.</p>
                
                <div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
                   <h4 class="font-bold text-blue-900 mb-2">Key Tactics</h4>
                   <ul class="list-disc pl-5 space-y-2 text-slate-700">
                      <li><strong>Listen for Phrases:</strong> Don't try to memorize individual words. Group them into meaningful phrases.</li>
                      <li><strong>Mimic Intonation:</strong> Copy the speaker's stress and rising/falling tone.</li>
                      <li><strong>Don't Pause:</strong> If you forget a word, skip it and continue. Fluency is more important than 100% content accuracy.</li>
                   </ul>
                </div>
              </div>
            `
          },
          { 
             id: "pte-m1-l3", 
             title: "Template: Describe Image", 
             type: "reading", 
             duration: "30 min", 
             isCompleted: false,
             content: `
                <div class="space-y-6">
                   <h3 class="text-2xl font-bold text-slate-900">The Universal Template</h3>
                   <div class="bg-slate-900 text-slate-100 p-8 rounded-xl font-mono text-sm leading-relaxed shadow-2xl">
                      <p class="mb-4"><span class="text-blue-400">Introduction:</span> "The image describes [Title/Topic]. It provides several interesting details and figures."</p>
                      <p class="mb-4"><span class="text-green-400">Body:</span> "From the image, I can see [Highest Value/Key Feature] which is approximately [Number/Color]. I can also see [Lowest Value/Another Feature]."</p>
                      <p class="mb-4"><span class="text-yellow-400">Trend:</span> "On the contrary, there is a significant difference between [Item A] and [Item B]."</p>
                      <p><span class="text-purple-400">Conclusion:</span> "In conclusion, the image is very informative."</p>
                   </div>
                   <p class="text-slate-600 italic text-center">Memorize this structure to ensure you always have something to say, regardless of the image complexity.</p>
                </div>
             `
          },
          { id: "pte-m1-quiz", title: "Speaking Assessment", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "pte-reading",
        title: "Module 3: Reading Strategies",
        description: "Tactics for Multiple Choice, Re-order Paragraphs, and Fill in the Blanks.",
        status: "locked",
        progress: 0,
        lessons: [
           { 
             id: "pte-m2-l1", 
             title: "Multiple Choice Strategies", 
             type: "video", 
             duration: "25 min", 
             isCompleted: false,
             videoUrl: "https://www.youtube.com/embed/7Y4J8k5q6w0" 
           },
           { 
             id: "pte-m2-l2", 
             title: "Fill in the Blanks (Reading & Writing)", 
             type: "reading", 
             duration: "30 min", 
             isCompleted: false,
             content: `
               <div class="space-y-6">
                 <h3 class="text-2xl font-bold text-slate-800">Collocations are King</h3>
                 <p class="text-slate-600">The PTE algorithm loves collocations—words that naturally go together.</p>
                 <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-4 border rounded shadow-sm">
                       <div class="font-bold text-green-600">Correct</div>
                       <div class="text-slate-700">"Academic <u>performance</u>"</div>
                    </div>
                    <div class="bg-white p-4 border rounded shadow-sm">
                       <div class="font-bold text-red-600">Incorrect</div>
                       <div class="text-slate-700">"Academic <u>working</u>"</div>
                    </div>
                    <div class="bg-white p-4 border rounded shadow-sm">
                       <div class="font-bold text-green-600">Correct</div>
                       <div class="text-slate-700">"Rapid <u>growth</u>"</div>
                    </div>
                    <div class="bg-white p-4 border rounded shadow-sm">
                       <div class="font-bold text-red-600">Incorrect</div>
                       <div class="text-slate-700">"Fast <u>enlargement</u>"</div>
                    </div>
                 </div>
               </div>
             `
           },
           { id: "pte-m2-quiz", title: "Reading Assessment", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "pte-writing",
        title: "Module 4: Writing & Listening",
        description: "Essay writing templates and Summarize Spoken Text techniques.",
        status: "locked",
        progress: 0,
        lessons: [
           { id: "pte-m3-l1", title: "Essay Templates", type: "reading", duration: "30 min", isCompleted: false },
           { id: "pte-m3-l2", title: "Summarize Spoken Text", type: "video", duration: "25 min", isCompleted: false },
           { id: "pte-m3-quiz", title: "Writing & Listening Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "pte-mock",
        title: "Module 5: PTE Mock Exam",
        description: "Full-length simulation of the PTE Academic exam.",
        status: "locked",
        progress: 0,
        lessons: [
          { id: "pte-final", title: "Full Mock Test", type: "quiz", duration: "60 min", isCompleted: false }
        ]
      }
    ]
  }
];

export const getCourseById = (id: string) => COURSES.find(c => c.id === id);
