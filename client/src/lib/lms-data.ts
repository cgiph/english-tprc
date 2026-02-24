
import { CheckCircle2, Lock, PlayCircle, BookOpen, PenTool, Mic, Headphones } from "lucide-react";

export type ModuleStatus = "locked" | "unlocked" | "in-progress" | "completed";

export type LessonType = "video" | "reading" | "quiz" | "assignment";

export interface LessonBase {
  id: string;
  title: string;
  duration: string; // e.g. "10 min"
  isCompleted: boolean;
  resources?: { title: string; type: "pdf" | "doc" | "link"; url?: string }[];
  quizId?: string; // Optional quiz to complete before finishing the lesson
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
            quizId: "l0-quiz",
            content: `
              <div class="space-y-8">
                <div class="bg-violet-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">The 9 Parts of Speech</h1>
                   <p class="text-violet-200 text-lg">Understanding these building blocks is the first step to mastering English grammar.</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                   <div class="bg-green-100 px-6 py-4 shrink-0 rounded-lg border border-green-200 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-green-800 mb-2 uppercase tracking-wider">Noun</h3>
                      <p class="text-green-900 text-sm mb-3 font-medium">Refers to a person, place, thing, activity, quality, or idea.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-green-900 border border-green-200">
                         <p>🐶 dog, cat, school, work, teacher</p>
                      </div>
                   </div>

                   <div class="bg-yellow-100 px-6 py-4 shrink-0 rounded-lg border border-yellow-200 shadow-sm relative overflow-hidden">
                       <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-yellow-800 mb-2 uppercase tracking-wider">Pronoun</h3>
                      <p class="text-yellow-900 text-sm mb-3 font-medium">Words used instead of a noun or noun phrase.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-yellow-900 border border-yellow-200">
                         <p>👤 he, I, me, she, that, this</p>
                      </div>
                   </div>

                   <div class="bg-orange-100 px-6 py-4 shrink-0 rounded-lg border border-orange-200 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-orange-800 mb-2 uppercase tracking-wider">Verb</h3>
                      <p class="text-orange-900 text-sm mb-3 font-medium">Describes an action, experience, or state of being.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-orange-900 border border-orange-200">
                         <p>🏃 run, sit, go, have, get, invite</p>
                      </div>
                   </div>

                   <div class="bg-amber-100 px-6 py-4 shrink-0 rounded-lg border border-amber-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-amber-800 mb-2 uppercase tracking-wider">Adjective</h3>
                      <p class="text-amber-900 text-sm mb-3 font-medium">Describes a noun or pronoun.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-amber-900 border border-amber-200">
                         <p>🌟 angry, brave, healthy, good, big</p>
                      </div>
                   </div>

                   <div class="bg-purple-100 px-6 py-4 shrink-0 rounded-lg border border-purple-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-purple-800 mb-2 uppercase tracking-wider">Adverb</h3>
                      <p class="text-purple-900 text-sm mb-3 font-medium">Describes a verb, adjective, or another adverb.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-purple-900 border border-purple-200">
                         <p>⚡ badly, fully, carefully, never</p>
                      </div>
                   </div>

                   <div class="bg-yellow-200 px-6 py-4 shrink-0 rounded-lg border border-yellow-300 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-yellow-900 mb-2 uppercase tracking-wider">Article</h3>
                      <p class="text-yellow-950 text-sm mb-3 font-medium">Words used before a noun to modify it.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-yellow-950 border border-yellow-300">
                         <p>🅰️ the, a, an</p>
                      </div>
                   </div>

                   <div class="bg-cyan-100 px-6 py-4 shrink-0 rounded-lg border border-cyan-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-cyan-800 mb-2 uppercase tracking-wider">Preposition</h3>
                      <p class="text-cyan-900 text-sm mb-3 font-medium">Shows place, time, or direction before a noun.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-cyan-900 border border-cyan-200">
                         <p>📍 in, from, of, before, since</p>
                      </div>
                   </div>

                   <div class="bg-lime-100 px-6 py-4 shrink-0 rounded-lg border border-lime-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-lime-800 mb-2 uppercase tracking-wider">Conjunction</h3>
                      <p class="text-lime-900 text-sm mb-3 font-medium">Connects words, phrases, or clauses.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-lime-900 border border-lime-200">
                         <p>🔗 and, or, so, after, either</p>
                      </div>
                   </div>

                   <div class="bg-blue-100 px-6 py-4 shrink-0 rounded-lg border border-blue-200 shadow-sm relative overflow-hidden">
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
            quizId: "l1-quiz",
            content: `
              <div class="space-y-8">
                <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Grammar Overview</h1>
                   <p class="text-indigo-200 text-lg">Mastering these top grammar rules is essential for strong communication skills.</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Have / Has / Had + V3</h3>
                      </div>
                      <p class="text-slate-600 mb-3">These words are always followed by the <strong>Past Participle</strong> (3rd form) of the verb.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-blue-500 text-slate-700">
                         <p class="mb-1">✅ She has <strong>completed</strong> her work.</p>
                         <p>❌ She has <strong>complete</strong> her work.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">To + V1</h3>
                      </div>
                      <p class="text-slate-600 mb-3">The preposition 'to' is followed by the <strong>Base Form</strong> (1st form) of the verb.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-green-500 text-slate-700">
                         <p class="mb-1">✅ He decided to <strong>take</strong> a leave.</p>
                         <p>❌ He decided to <strong>took</strong> a leave.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Modals + V1</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Can, could, may, might, should, will, would are followed by the <strong>Base Form</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-purple-500 text-slate-700">
                         <p class="mb-1">✅ You should <strong>speak</strong> English.</p>
                         <p>❌ You should <strong>speaking</strong> English.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">4</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Prepositions + V-ing</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Prepositions like 'of', 'for', 'with', 'in' (except 'to') are followed by the <strong>-ing form</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-orange-500 text-slate-700">
                         <p class="mb-1">✅ Thanks for <strong>giving</strong> me this chance.</p>
                         <p>❌ Thanks for <strong>give</strong> me this chance.</p>
                      </div>
                   </div>
                   
                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">5</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Many + Plural Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">'Many' indicates multiple items, so the noun must be <strong>Plural</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-teal-500 text-slate-700">
                         <p class="mb-1">✅ Many <strong>languages</strong> are spoken here.</p>
                         <p>❌ Many <strong>language</strong> are spoken here.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">6</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Article + (Adj) + Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Articles (a, an, the) are followed by a Noun. If there's a word in between, it's an Adjective.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-rose-500 text-slate-700">
                         <p class="mb-1">✅ The <strong>book</strong> (Article + Noun)</p>
                         <p>✅ The <strong>big</strong> book (Article + Adj + Noun)</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">7</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Subject-Verb Agreement</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Singular Subject = Singular Verb (with 's'). Plural Subject = Plural Verb (no 's').</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-indigo-500 text-slate-700">
                         <p class="mb-1">✅ The student <strong>writes</strong>.</p>
                         <p>✅ The students <strong>write</strong>.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">8</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Passive Voice</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Forms of 'Be' (is, am, are, was, were, be, been, being) + <strong>V3</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-yellow-500 text-slate-700">
                         <p class="mb-1">✅ The report was <strong>written</strong> by him.</p>
                         <p>❌ The report was <strong>write</strong> by him.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">9</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">One of the + Plural Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">After 'One of the', the noun is always <strong>Plural</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-cyan-500 text-slate-700">
                         <p class="mb-1">✅ One of the <strong>problems</strong> is...</p>
                         <p>❌ One of the <strong>problem</strong> is...</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold">10</div>
                         <h3 class="font-bold text-base md:text-lg text-slate-900 leading-tight">Despite / In spite of</h3>
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
            duration: "30 min", // Increased to reflect deeper content
            isCompleted: false,
            content: `
              <div class="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div>
                  <h3 class="text-3xl font-extrabold mb-6 text-indigo-900 border-b pb-2">Technical Grammar: Common vs. Proper Nouns</h3>

                  <div class="mb-8 space-y-6 text-slate-800 leading-relaxed text-lg">
                    <p>In a professional environment, the distinction between common and proper nouns is not just about grammar—it is about <strong>specificity and authority</strong>. Miscapitalizing a common noun looks unprofessional, but failing to capitalize a proper noun (like a brand or a client name) can be seen as a lack of attention to detail.</p>

                    <div class="bg-blue-50 px-6 py-4 shrink-0 rounded-lg border-l-4 border-blue-500">
                      <h4 class="font-bold text-blue-900 mb-2">The Golden Rule</h4>
                      <p>A <strong>common noun</strong> is a generic label for a category. A <strong>proper noun</strong> is a specific entity's "legal" name.</p>
                    </div>
                  </div>

                  <div class="overflow-hidden rounded-xl border border-slate-300 shadow-md">
                    <table class="w-full text-left">
                      <thead class="bg-slate-100 text-slate-900">
                        <tr>
                          <th class="p-5 font-bold">Category</th>
                          <th class="p-5 font-bold">Common Noun (General)</th>
                          <th class="p-5 font-bold">Proper Noun (Specific)</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200 bg-white">
                        <tr>
                          <td class="p-5 font-semibold text-indigo-700">Technology</td>
                          <td class="p-5 text-slate-600 italic text-sm">"The company issued a new smartphone."</td>
                          <td class="p-5 text-slate-900 font-medium">"The company issued an iPhone."</td>
                        </tr>
                        <tr>
                          <td class="p-5 font-semibold text-indigo-700">Professional Roles</td>
                          <td class="p-5 text-slate-600 italic text-sm">"Contact the manager for approval."</td>
                          <td class="p-5 text-slate-900 font-medium">"Contact Manager Sarah Jenkins."</td>
                        </tr>
                        <tr>
                          <td class="p-5 font-semibold text-indigo-700">Locations</td>
                          <td class="p-5 text-slate-600 italic text-sm">"The ship arrived at the port."</td>
                          <td class="p-5 text-slate-900 font-medium">"The ship arrived at Port Singapore."</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="mt-10 space-y-6">
                    <h4 class="text-xl font-bold text-slate-900">Advanced Usage: The "Job Title" Trap</h4>
                    <p class="text-slate-700">Candidates often struggle with job titles. This is a primary focus for professional deployment:</p>
                    <ul class="list-disc ml-6 space-y-3 text-slate-700">
                      <li><strong>Lowercase:</strong> "He is a <em>doctor</em> at the local clinic." (General role)</li>
                      <li><strong>Uppercase:</strong> "I am meeting with <em>Doctor Smith</em>." (Title as part of a name)</li>
                      <li><strong>Lowercase:</strong> "The <em>president</em> of the company is away." (Common noun)</li>
                      <li><strong>Uppercase:</strong> "We welcome <em>President Biden</em> to the summit." (Proper noun)</li>
                    </ul>
                  </div>

                  <div class="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 class="font-bold text-amber-900 mb-2">⏱️ Reading Exercise (10 Mins)</h4>
                    <p class="text-amber-800 text-sm italic">Analyze the last three emails you sent. Highlight every noun. Identify which ones you capitalized and justify if they were truly proper nouns or if you were "Emphasis Capitalizing" (a common mistake).</p>
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
            videoUrl: "https://www.youtube.com/embed/v9fCKTwytJA",
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
          { 
            id: "l4", 
            title: "Action Verbs", 
            type: "video", 
            duration: "8 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/ZYPjmjff0Zo", 
            content: "<h3>Action Verbs</h3><p>Verbs that express physical or mental action. Essential for describing work tasks.</p>"
          },
          { 
            id: "l4-read", 
            title: "Verb List: Top 50 Common Verbs", 
            type: "reading", 
            duration: "15 min", 
            isCompleted: false,
            content: `
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-slate-800">Top 50 Essential Verbs</h3>
              <p class="text-slate-600">These are the most frequent verbs you will use in daily workplace communication.</p>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="bg-white p-3 rounded border shadow-sm">
                  <div class="font-bold text-indigo-600">To Be</div>
                  <div class="text-xs text-slate-500">I am, You are, He is</div>
                </div>
                <div class="bg-white p-3 rounded border shadow-sm">
                  <div class="font-bold text-indigo-600">To Have</div>
                  <div class="text-xs text-slate-500">I have, She has</div>
                </div>
                <div class="bg-white p-3 rounded border shadow-sm">
                  <div class="font-bold text-indigo-600">To Do</div>
                  <div class="text-xs text-slate-500">I do, He does</div>
                </div>
                 <div class="bg-white p-3 rounded border shadow-sm">
                  <div class="font-bold text-indigo-600">To Make</div>
                  <div class="text-xs text-slate-500">Create / Build</div>
                </div>
                <div class="bg-white p-3 rounded border shadow-sm">
                  <div class="font-bold text-indigo-600">To Go</div>
                  <div class="text-xs text-slate-500">Movement</div>
                </div>
                <div class="bg-white p-3 rounded border shadow-sm">
                  <div class="font-bold text-indigo-600">To Take</div>
                  <div class="text-xs text-slate-500">Grab / Receive</div>
                </div>
              </div>

              <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="font-bold text-blue-900 mb-2">Workplace Verbs</h4>
                <ul class="list-disc ml-5 space-y-1 text-blue-800">
                  <li><strong>Operate:</strong> Use a machine.</li>
                  <li><strong>Inspect:</strong> Check for quality.</li>
                  <li><strong>Repair:</strong> Fix something broken.</li>
                  <li><strong>Assemble:</strong> Put parts together.</li>
                </ul>
              </div>
            </div>
            `
          },
          { 
            id: "l5", 
            title: "Present Simple Practice", 
            type: "assignment", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                 <div class="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h3 class="text-xl font-bold text-green-900 mb-3">Assignment: Daily Routine</h3>
                    <p class="text-green-800 mb-4">Write 5 sentences describing what you do every day at work using the <strong>Present Simple</strong> tense.</p>
                    <div class="bg-white p-4 rounded border border-green-200 font-mono text-sm text-slate-600">
                      Example: "I <strong>start</strong> work at 8:00 AM. I <strong>check</strong> the machines."
                    </div>
                    <textarea class="w-full mt-4 p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" rows="4" placeholder="Type your sentences here..."></textarea>
                 </div>
              </div>
            `
          },
          { 
            id: "l5-vid", 
            title: "Past Tense Introduction", 
            type: "video", 
            duration: "10 min", 
            isCompleted: false,
             videoUrl: "https://www.youtube.com/embed/ZFZqiurLmBs",
             content: "<h3>Past Simple Tense</h3><p>Learn how to talk about finished actions. Regular verbs end in -ed (walked, worked), irregular verbs change (go -> went).</p>"
          },
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
          { 
            id: "l7", 
            title: "Greetings & Farewells", 
            type: "video", 
            duration: "6 min", 
            isCompleted: false, 
            videoUrl: "https://www.youtube.com/embed/bdX1D6HNnyw",
            content: "<h3>Greetings & Introductions</h3><p>Learn the difference between formal and informal greetings in English. Start every conversation with confidence.</p>"
          },
          { 
            id: "l8", 
            title: "Introduction Scripts", 
            type: "reading", 
            duration: "15 min", 
            isCompleted: false,
            content: `
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-slate-800">Self-Introduction Templates</h3>
              <p class="text-slate-600">Use these scripts to introduce yourself in different situations.</p>
              
              <div class="grid md:grid-cols-2 gap-6">
                 <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div class="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-3">FORMAL</div>
                    <h4 class="font-bold text-lg mb-2">Job Interview / Official Meeting</h4>
                    <div class="bg-slate-50 p-4 rounded border-l-4 border-indigo-500 text-slate-700 italic">
                      "Good morning. My name is [Name]. I am a [Profession] with [Number] years of experience. I specialize in [Skill 1] and [Skill 2]. I am pleased to meet you."
                    </div>
                 </div>

                 <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div class="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-3">INFORMAL</div>
                    <h4 class="font-bold text-lg mb-2">New Coworker / Social</h4>
                    <div class="bg-slate-50 p-4 rounded border-l-4 border-green-500 text-slate-700 italic">
                      "Hi, I'm [Name]. I just started in the [Department] team. Nice to meet you! How long have you worked here?"
                    </div>
                 </div>
              </div>

              <div class="bg-amber-50 px-6 py-4 shrink-0 rounded-lg border border-amber-200">
                <h4 class="font-bold text-amber-900 mb-2">Culture Tip: Handshakes</h4>
                <p class="text-amber-800 text-sm">In many Western countries, a firm handshake and direct eye contact during an introduction show confidence and respect.</p>
              </div>
            </div>
            `
          },
          { id: "l9", title: "Module Quiz", type: "quiz", duration: "10 min", isCompleted: false }
        ]
      },
      {
        id: "m4",
        title: "Module 4: Reading Simple Texts",
        description: "Signs, posters, and simple catalogs.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "l10", 
            title: "Understanding Safety Signs", 
            type: "video", 
            duration: "8 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/3buO9MfzKuI",
            content: "<h3>Safety First</h3><p>Learn to identify common workplace safety signs. Red means prohibition (STOP), Yellow means warning (CAUTION), Green means safety (GO).</p>"
          },
          { 
            id: "l11", 
            title: "Reading Work Schedules", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-slate-800">Weekly Work Schedule</h3>
              <p class="text-slate-600">Understand how to read a shift roster.</p>
              
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <thead class="bg-slate-100">
                    <tr>
                      <th class="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                      <th class="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Monday</th>
                      <th class="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tuesday</th>
                      <th class="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Wednesday</th>
                      <th class="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thursday</th>
                      <th class="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Friday</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr>
                      <td class="py-3 px-4 font-medium text-slate-900">John Smith</td>
                      <td class="py-3 px-4 text-sm text-slate-600">08:00 - 16:00</td>
                      <td class="py-3 px-4 text-sm text-slate-600">08:00 - 16:00</td>
                      <td class="py-3 px-4 text-sm text-slate-600">OFF</td>
                      <td class="py-3 px-4 text-sm text-slate-600">08:00 - 16:00</td>
                      <td class="py-3 px-4 text-sm text-slate-600">08:00 - 16:00</td>
                    </tr>
                    <tr class="bg-slate-50">
                      <td class="py-3 px-4 font-medium text-slate-900">Sarah Jones</td>
                      <td class="py-3 px-4 text-sm text-slate-600">16:00 - 00:00</td>
                      <td class="py-3 px-4 text-sm text-slate-600">16:00 - 00:00</td>
                      <td class="py-3 px-4 text-sm text-slate-600">16:00 - 00:00</td>
                      <td class="py-3 px-4 text-sm text-slate-600">16:00 - 00:00</td>
                      <td class="py-3 px-4 text-sm text-slate-600">OFF</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="bg-blue-50 px-6 py-4 shrink-0 rounded-lg border border-blue-200">
                <h4 class="font-bold text-blue-900 mb-2">Key Vocabulary</h4>
                <ul class="list-disc pl-5 space-y-1 text-blue-800 text-sm">
                   <li><strong>Shift:</strong> The time period you work (e.g., Morning Shift, Night Shift).</li>
                   <li><strong>Roster:</strong> The list of people and their work times.</li>
                   <li><strong>Day Off:</strong> A day when you do not work.</li>
                   <li><strong>Overtime:</strong> Working extra hours.</li>
                </ul>
              </div>
            </div>
            `
          },
          { id: "l12", title: "Module Quiz", type: "quiz", duration: "10 min", isCompleted: false }
        ]
      },
      {
        id: "m5",
        title: "Module 5: Writing Simple Notes",
        description: "Short messages and filling forms.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "m5-l1", 
            title: "Writing Short Emails", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                 <h3 class="text-2xl font-bold text-slate-800">Email Basics</h3>
                 <p class="text-slate-600">How to write a simple professional email.</p>
                 
                 <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div class="mb-4 pb-4 border-b">
                       <p class="text-sm text-slate-500">Subject: <strong>Sick Leave</strong></p>
                    </div>
                    <div class="space-y-4 text-slate-800">
                       <p>Dear Mr. Smith,</p>
                       <p>I am writing to tell you that I am sick today. I have a fever and cannot come to work.</p>
                       <p>I will go to the doctor and send you the medical certificate later.</p>
                       <p>Best regards,<br/>John Doe</p>
                    </div>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div class="bg-green-50 p-4 rounded border border-green-100">
                       <h4 class="font-bold text-green-800 mb-2">Openings</h4>
                       <ul class="text-sm space-y-1 text-green-700">
                          <li>Dear [Name],</li>
                          <li>Hi [Name], (Informal)</li>
                          <li>To whom it may concern,</li>
                       </ul>
                    </div>
                    <div class="bg-blue-50 p-4 rounded border border-blue-100">
                       <h4 class="font-bold text-blue-800 mb-2">Closings</h4>
                       <ul class="text-sm space-y-1 text-blue-700">
                          <li>Best regards,</li>
                          <li>Sincerely,</li>
                          <li>Thank you,</li>
                       </ul>
                    </div>
                 </div>
              </div>
            `
          },
          { 
            id: "m5-l2", 
            title: "Filling Out Forms", 
            type: "reading", 
            duration: "15 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                 <h3 class="text-2xl font-bold text-slate-800">Understanding Forms</h3>
                 <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Surname / Family Name</label>
                          <div class="bg-white p-2 border rounded text-slate-800">Doe</div>
                       </div>
                       <div>
                          <label class="block text-xs font-bold uppercase text-slate-500 mb-1">First Name / Given Name</label>
                          <div class="bg-white p-2 border rounded text-slate-800">John</div>
                       </div>
                       <div class="md:col-span-2">
                          <label class="block text-xs font-bold uppercase text-slate-500 mb-1">DOB (Date of Birth)</label>
                          <div class="bg-white p-2 border rounded text-slate-800">12 / 05 / 1990 (DD/MM/YYYY)</div>
                       </div>
                       <div class="md:col-span-2">
                          <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Address</label>
                          <div class="bg-white p-2 border rounded text-slate-800">123 Maple Street, London</div>
                       </div>
                    </div>
                 </div>
              </div>
            `
          },
          { id: "m5-quiz", title: "Writing Skills Quiz", type: "quiz", duration: "20 min", isCompleted: false }
        ]
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
            videoUrl: "https://www.youtube.com/embed/QEB7wE-YFXg",
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
                <div class="bg-blue-50 px-6 py-4 shrink-0 rounded-lg border border-blue-100">
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

                <div class="bg-yellow-50 px-6 py-4 shrink-0 rounded-lg border border-yellow-200">
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
            videoUrl: "https://www.youtube.com/embed/LJjRbeAUivY" 
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
            videoUrl: "https://www.youtube.com/embed/DIf_l8l5BkY" 
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
          {
            id: "tw3-l1",
            title: "Scenario: Welding Specs",
            type: "reading",
            duration: "15 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-xl font-bold text-slate-800">Applied Communication: Welding</h3>
                <p class="text-slate-600">Welding procedures (WPS) must be followed exactly. If a verbal instruction conflicts with the WPS, ask.</p>

                <div class="space-y-4">
                  <div class="border-l-4 border-blue-500 bg-blue-50 p-4">
                    <p class="font-bold text-blue-900">Supervisor Says:</p>
                    <p class="italic text-blue-800">"Just tack that bracket on quickly."</p>
                  </div>

                  <div class="flex flex-col gap-2 pl-8 border-l-2 border-slate-200">
                    <p class="text-sm font-bold text-slate-500 uppercase">Better Responses (Clarification)</p>
                    
                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Check Assumptions (Process):</strong>
                      <p class="text-slate-700">"Should I use TIG for a cleaner finish, or is MIG fine for speed?"</p>
                    </div>

                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Confirm Prep:</strong>
                      <p class="text-slate-700">"Do you want me to grind the paint off first, or just burn through for the tack?" (Always suggest safety/quality).</p>
                    </div>
                    
                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Paraphrasing:</strong>
                      <p class="text-slate-700">"So, just a temporary fit-up tack for now, and you'll inspect before final weld?"</p>
                    </div>
                  </div>
                </div>
              </div>
            `
          },
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
    thumbnail: "https://images.unsplash.com/photo-1486262715619-72a604e3d7a9?auto=format&fit=crop&w=800&q=80",
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
          { id: "tmec1-l1", title: "Four-Stroke Cycle", type: "video", duration: "20 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/Z_V_Qd89Jg8" },
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
                videoUrl: "https://www.youtube.com/embed/Px1wnARs12Q" 
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
            {
            id: "tmec3-l1",
            title: "Scenario: Clarifying Diagnostic Instructions",
            type: "reading",
            duration: "15 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-xl font-bold text-slate-800">Applied Communication: Diagnostics</h3>
                <p class="text-slate-600">Diagnostic instructions are often vague. You must clarify before you start replacing parts.</p>

                <div class="space-y-4">
                  <div class="border-l-4 border-red-500 bg-red-50 p-4">
                    <p class="font-bold text-red-900">Supervisor Says:</p>
                    <p class="italic text-red-800">"Check the engine, it's running rough."</p>
                  </div>

                  <div class="flex flex-col gap-2 pl-8 border-l-2 border-slate-200">
                    <p class="text-sm font-bold text-slate-500 uppercase">Better Responses (Clarification)</p>
                    
                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Seek Specifics (Conditions):</strong>
                      <p class="text-slate-700">"Does it run rough at idle, or only under load?"</p>
                    </div>

                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Check Assumptions (History):</strong>
                      <p class="text-slate-700">"Has this vehicle had a recent tune-up, or should I start with the basics like spark plugs?"</p>
                    </div>
                    
                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Confirm Scope:</strong>
                      <p class="text-slate-700">"Do you want me to perform a full compression test, or just check for codes first?"</p>
                    </div>
                  </div>
                </div>
              </div>
            `
          },
          { 
            id: "tmec3-l2", 
            title: "Video: When to Ask?", 
            type: "video", 
            duration: "5 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/Xe1C9LoSWlA"
          },
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
            { id: "tcarp1-l1", title: "Power Tool Safety", type: "video", duration: "20 min", isCompleted: false, videoUrl: "https://www.youtube.com/embed/qQnrZeofF84" },
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
                videoUrl: "https://www.youtube.com/embed/KGJaA5u9Yj8" 
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
            {
            id: "tcarp3-l1",
            title: "Scenario: Site Instructions",
            type: "reading",
            duration: "15 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-xl font-bold text-slate-800">Applied Communication: Carpentry</h3>
                <p class="text-slate-600">On a job site, a "small error" in measurement can cost thousands. Always clarify "rough" vs "finish" instructions.</p>

                <div class="space-y-4">
                  <div class="border-l-4 border-amber-500 bg-amber-50 p-4">
                    <p class="font-bold text-amber-900">Foreman Says:</p>
                    <p class="italic text-amber-800">"Frame up that wall over there and leave a gap for the door."</p>
                  </div>

                  <div class="flex flex-col gap-2 pl-8 border-l-2 border-slate-200">
                    <p class="text-sm font-bold text-slate-500 uppercase">Better Responses (Clarification)</p>
                    
                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Seek Specifics (Measurements):</strong>
                      <p class="text-slate-700">"What is the Rough Opening (RO) width you need for the door? Standard 32-inch?"</p>
                    </div>

                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Confirm Location:</strong>
                      <p class="text-slate-700">"Just to confirm—is the wall flush with this existing column, or set back?"</p>
                    </div>
                    
                    <div class="bg-white p-3 rounded border shadow-sm">
                      <strong class="text-indigo-600 block mb-1">Check Assumptions (Material):</strong>
                      <p class="text-slate-700">"Are we using 2x4 or 2x6 studs for this section?"</p>
                    </div>
                  </div>
                </div>
              </div>
            `
          },
          { 
            id: "tcarp3-l2", 
            title: "Video: Asking for Clarification", 
            type: "video", 
            duration: "5 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/eOmR3Pj0Rk4"
          },
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
    description: "Preparation for the PTE Academic exam. Master Speaking, Reading, Writing, and Listening strategies with targeted practice and a final mock test.",
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
            id: "pte-parts-speech",
            title: "The 9 Parts of Speech",
            type: "reading",
            duration: "20 min",
            isCompleted: false,
            quizId: "pte-grammar-quiz",
            content: `
              <div class="space-y-8">
                <div class="bg-violet-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">The 9 Parts of Speech</h1>
                   <p class="text-violet-200 text-lg">Understanding these building blocks is the first step to mastering English grammar.</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                   <div class="bg-green-100 px-6 py-4 shrink-0 rounded-lg border border-green-200 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-green-800 mb-2 uppercase tracking-wider">Noun</h3>
                      <p class="text-green-900 text-sm mb-3 font-medium">Refers to a person, place, thing, activity, quality, or idea.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-green-900 border border-green-200">
                         <p>🐶 dog, cat, school, work, teacher</p>
                      </div>
                   </div>

                   <div class="bg-yellow-100 px-6 py-4 shrink-0 rounded-lg border border-yellow-200 shadow-sm relative overflow-hidden">
                       <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-yellow-800 mb-2 uppercase tracking-wider">Pronoun</h3>
                      <p class="text-yellow-900 text-sm mb-3 font-medium">Words used instead of a noun or noun phrase.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-yellow-900 border border-yellow-200">
                         <p>👤 he, I, me, she, that, this</p>
                      </div>
                   </div>

                   <div class="bg-orange-100 px-6 py-4 shrink-0 rounded-lg border border-orange-200 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 p-2 opacity-10">
                         <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                      </div>
                      <h3 class="font-bold text-xl text-orange-800 mb-2 uppercase tracking-wider">Verb</h3>
                      <p class="text-orange-900 text-sm mb-3 font-medium">Describes an action, experience, or state of being.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-orange-900 border border-orange-200">
                         <p>🏃 run, sit, go, have, get, invite</p>
                      </div>
                   </div>

                   <div class="bg-amber-100 px-6 py-4 shrink-0 rounded-lg border border-amber-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-amber-800 mb-2 uppercase tracking-wider">Adjective</h3>
                      <p class="text-amber-900 text-sm mb-3 font-medium">Describes a noun or pronoun.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-amber-900 border border-amber-200">
                         <p>🌟 angry, brave, healthy, good, big</p>
                      </div>
                   </div>

                   <div class="bg-purple-100 px-6 py-4 shrink-0 rounded-lg border border-purple-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-purple-800 mb-2 uppercase tracking-wider">Adverb</h3>
                      <p class="text-purple-900 text-sm mb-3 font-medium">Describes a verb, adjective, or another adverb.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-purple-900 border border-purple-200">
                         <p>⚡ badly, fully, carefully, never</p>
                      </div>
                   </div>

                   <div class="bg-yellow-200 px-6 py-4 shrink-0 rounded-lg border border-yellow-300 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-yellow-900 mb-2 uppercase tracking-wider">Article</h3>
                      <p class="text-yellow-950 text-sm mb-3 font-medium">Words used before a noun to modify it.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-yellow-950 border border-yellow-300">
                         <p>🅰️ the, a, an</p>
                      </div>
                   </div>

                   <div class="bg-cyan-100 px-6 py-4 shrink-0 rounded-lg border border-cyan-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-cyan-800 mb-2 uppercase tracking-wider">Preposition</h3>
                      <p class="text-cyan-900 text-sm mb-3 font-medium">Shows place, time, or direction before a noun.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-cyan-900 border border-cyan-200">
                         <p>📍 in, from, of, before, since</p>
                      </div>
                   </div>

                   <div class="bg-lime-100 px-6 py-4 shrink-0 rounded-lg border border-lime-200 shadow-sm relative overflow-hidden">
                      <h3 class="font-bold text-xl text-lime-800 mb-2 uppercase tracking-wider">Conjunction</h3>
                      <p class="text-lime-900 text-sm mb-3 font-medium">Connects words, phrases, or clauses.</p>
                      <div class="bg-white/60 p-3 rounded text-sm text-lime-900 border border-lime-200">
                         <p>🔗 and, or, so, after, either</p>
                      </div>
                   </div>

                   <div class="bg-blue-100 px-6 py-4 shrink-0 rounded-lg border border-blue-200 shadow-sm relative overflow-hidden">
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
            id: "pte-sentence-structure", 
            title: "Sentence Structures", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Sentence Structures</h1>
                   <p class="text-indigo-200 text-lg">Understanding sentence variety is key to high scores in PTE Writing and Summarization.</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-blue-50 px-6 py-6 rounded-lg border border-blue-200 shadow-sm">
                      <h3 class="font-bold text-xl text-blue-900 mb-2">1. Simple Sentence</h3>
                      <p class="text-slate-700 mb-4">Contains one independent clause (subject + verb).</p>
                      <div class="bg-white p-4 rounded border-l-4 border-blue-500 text-slate-800">
                         <p class="font-medium">✅ The cat sat on the mat.</p>
                         <p class="text-sm text-slate-500 mt-1">One subject (cat) + One verb (sat).</p>
                      </div>
                   </div>

                   <div class="bg-green-50 px-6 py-6 rounded-lg border border-green-200 shadow-sm">
                      <h3 class="font-bold text-xl text-green-900 mb-2">2. Compound Sentence</h3>
                      <p class="text-slate-700 mb-4">Two independent clauses joined by a conjunction (FANBOYS).</p>
                      <div class="bg-white p-4 rounded border-l-4 border-green-500 text-slate-800">
                         <p class="font-medium">✅ The cat sat on the mat, <strong>and</strong> the dog barked.</p>
                         <p class="text-sm text-slate-500 mt-1">FANBOYS: For, And, Nor, But, Or, Yet, So.</p>
                      </div>
                   </div>

                   <div class="bg-purple-50 px-6 py-6 rounded-lg border border-purple-200 shadow-sm">
                      <h3 class="font-bold text-xl text-purple-900 mb-2">3. Complex Sentence</h3>
                      <p class="text-slate-700 mb-4">One independent clause + one or more dependent clauses.</p>
                      <div class="bg-white p-4 rounded border-l-4 border-purple-500 text-slate-800">
                         <p class="font-medium">✅ The dog barked <strong>because</strong> he was hungry.</p>
                         <p class="text-sm text-slate-500 mt-1">Joined by subordinating conjunctions (because, although, if, when).</p>
                      </div>
                   </div>

                   <div class="bg-orange-50 px-6 py-6 rounded-lg border border-orange-200 shadow-sm">
                      <h3 class="font-bold text-xl text-orange-900 mb-2">4. Compound-Complex</h3>
                      <p class="text-slate-700 mb-4">Two independent clauses + one or more dependent clauses.</p>
                      <div class="bg-white p-4 rounded border-l-4 border-orange-500 text-slate-800">
                         <p class="font-medium">✅ <strong>Although</strong> it was raining, I went for a walk, <strong>and</strong> I saw a rainbow.</p>
                         <p class="text-sm text-slate-500 mt-1">Demonstrates high-level writing ability.</p>
                      </div>
                   </div>
                </div>

                <div class="bg-amber-50 p-6 rounded-xl border border-amber-200 mt-8">
                   <h3 class="text-lg font-bold text-amber-900 mb-2">💡 PTE Tip for Summarize Written Text</h3>
                   <p class="text-amber-800">You must write exactly <strong>ONE sentence</strong> (5-75 words). Mastering <strong>Complex</strong> and <strong>Compound-Complex</strong> structures is essential to combine multiple ideas into a single sentence without grammar errors.</p>
                </div>
              </div>
            `
          },
          { 
            id: "pte-subject-verb-agreement", 
            title: "Subject-Verb Agreement", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Subject-Verb Agreement</h1>
                   <p class="text-indigo-200 text-lg">The Golden Rule: The verb must agree with its subject in number.</p>
                </div>

                <div class="space-y-6">
                   <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 class="font-bold text-xl text-indigo-900 mb-4 flex items-center gap-2">
                        <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
                        Basic Rule
                      </h3>
                      <div class="grid md:grid-cols-2 gap-6">
                         <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-green-500">
                            <h4 class="font-bold text-green-800 mb-2">Singular Subject = Singular Verb</h4>
                            <p class="text-slate-600 text-sm mb-2">Singular verbs often end in <strong>'s'</strong>.</p>
                            <p class="font-medium">✅ The cat <strong>runs</strong> fast.</p>
                            <p class="font-medium">✅ He <strong>is</strong> happy.</p>
                         </div>
                         <div class="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <h4 class="font-bold text-blue-800 mb-2">Plural Subject = Plural Verb</h4>
                            <p class="text-slate-600 text-sm mb-2">Plural verbs do <strong>not</strong> end in 's'.</p>
                            <p class="font-medium">✅ The cats <strong>run</strong> fast.</p>
                            <p class="font-medium">✅ They <strong>are</strong> happy.</p>
                         </div>
                      </div>
                   </div>

                   <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 class="font-bold text-xl text-orange-900 mb-4 flex items-center gap-2">
                        <span class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">2</span>
                        Tricky Cases
                      </h3>
                      <div class="space-y-4">
                         <div class="flex items-start gap-4 p-3 bg-orange-50 rounded-lg">
                            <div class="font-bold text-orange-700 min-w-[120px]">Indefinite Pronouns</div>
                            <div>
                               <p class="text-slate-800 mb-1">Everyone, someone, anyone, nobody are <strong>Singular</strong>.</p>
                               <p class="text-sm font-medium">✅ Everyone <strong>is</strong> here. (Not 'are')</p>
                            </div>
                         </div>
                         <div class="flex items-start gap-4 p-3 bg-orange-50 rounded-lg">
                            <div class="font-bold text-orange-700 min-w-[120px]">Compound Subjects</div>
                            <div>
                               <p class="text-slate-800 mb-1">Subjects joined by 'and' are usually <strong>Plural</strong>.</p>
                               <p class="text-sm font-medium">✅ John and Mary <strong>are</strong> coming.</p>
                            </div>
                         </div>
                         <div class="flex items-start gap-4 p-3 bg-orange-50 rounded-lg">
                            <div class="font-bold text-orange-700 min-w-[120px]">Collective Nouns</div>
                            <div>
                               <p class="text-slate-800 mb-1">Group nouns (team, family, class) are usually <strong>Singular</strong> when acting as one unit.</p>
                               <p class="text-sm font-medium">✅ The team <strong>wins</strong> the game.</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div class="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                      <h3 class="text-lg font-bold text-yellow-900 mb-2">⚠️ The "Prepositional Phrase" Trap</h3>
                      <p class="text-yellow-950 mb-3">Ignore words between the subject and the verb. They do not affect agreement.</p>
                      <div class="bg-white/60 p-4 rounded border border-yellow-300">
                         <p class="mb-2">❌ The box <s>of apples</s> <strong>are</strong> heavy.</p>
                         <p>✅ The <strong>box</strong> (of apples) <strong>is</strong> heavy.</p>
                         <p class="text-xs text-slate-500 mt-1">'Box' is the subject, not 'apples'.</p>
                      </div>
                   </div>
                </div>
              </div>
            `
          },
          { 
            id: "pte-gram-l1", 
            title: "Rule #1-5: Verbs & Prepositions", 
            type: "reading", 
            duration: "30 min", 
            isCompleted: false,
            quizId: "pte-grammar-quiz",
            content: `
              <div class="space-y-8">
                <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Grammar for PTE Reading</h1>
                   <p class="text-indigo-200 text-lg">Mastering these 10 rules will significantly improve your scores in "Fill in the Blanks".</p>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
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

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
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

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
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

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
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

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm md:col-span-2">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">5</div>
                         <h3 class="font-bold text-lg">Passive Voice (Be + V3)</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Any form of the verb 'to be' (am, is, are, was, were, be, been, being) is followed by the <strong>Past Participle (V3)</strong> in passive sentences.</p>
                      <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-red-500">
                           <p class="font-bold text-xs text-slate-500 mb-1">PRESENT TENSE</p>
                           <p class="mb-1">✅ The work is <strong>done</strong>.</p>
                           <p>❌ The work is <strong>do</strong>.</p>
                        </div>
                        <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-red-500">
                           <p class="font-bold text-xs text-slate-500 mb-1">CONTINUOUS</p>
                           <p class="mb-1">✅ It is being <strong>prepared</strong>.</p>
                           <p>❌ It is being <strong>prepare</strong>.</p>
                        </div>
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
                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">6</div>
                         <h3 class="font-bold text-lg">Many + Plural Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">'Many', 'few', 'several', 'various' indicate multiple items, so the noun must be <strong>Plural</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-teal-500">
                         <p class="mb-1">✅ Many <strong>languages</strong> are spoken.</p>
                         <p>❌ Many <strong>language</strong> are spoken.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">7</div>
                         <h3 class="font-bold text-lg">Article + (Adj) + Noun</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Articles (a, an, the) are followed by a Noun. If there's a word in between, it's an Adjective.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-rose-500">
                         <p class="mb-1">✅ The <strong>book</strong> (Art + Noun)</p>
                         <p>✅ The <strong>big</strong> book (Art + Adj + Noun)</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">8</div>
                         <h3 class="font-bold text-lg">Subject-Verb Agreement</h3>
                      </div>
                      <p class="text-slate-600 mb-3">Singular Subject takes Singular Verb (usually ends in 's'). Plural Subject takes Plural Verb (no 's').</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-indigo-500">
                         <p class="mb-1">✅ The student <strong>writes</strong>.</p>
                         <p>✅ The students <strong>write</strong>.</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">9</div>
                         <h3 class="font-bold text-lg">One of the + Plural</h3>
                      </div>
                      <p class="text-slate-600 mb-3">After 'One of the', the noun is always <strong>Plural</strong>, but the verb is <strong>Singular</strong>.</p>
                      <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-cyan-500">
                         <p class="mb-1">✅ One of the <strong>reasons</strong> is...</p>
                         <p>❌ One of the <strong>reason</strong> is...</p>
                      </div>
                   </div>

                   <div class="bg-white px-6 py-4 shrink-0 rounded-lg border border-slate-200 shadow-sm md:col-span-2">
                      <div class="flex items-center gap-3 mb-4">
                         <div class="w-8 h-8 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold">10</div>
                         <h3 class="font-bold text-lg">Despite vs. Although</h3>
                      </div>
                      <p class="text-slate-600 mb-3"><strong>Despite</strong> is a preposition (followed by Noun/V-ing). <strong>Although</strong> is a conjunction (followed by a full sentence).</p>
                      <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-fuchsia-500">
                           <p class="mb-1">✅ <strong>Despite</strong> the rain, we went out.</p>
                           <p>❌ <strong>Despite</strong> it was raining...</p>
                        </div>
                        <div class="bg-slate-50 p-3 rounded text-sm border-l-4 border-fuchsia-500">
                           <p class="mb-1">✅ <strong>Although</strong> it was raining...</p>
                           <p>❌ <strong>Although</strong> the rain...</p>
                        </div>
                      </div>
                   </div>
                 </div>
              </div>
            `
          },
          { 
            id: "pte-grammar-quiz", 
            title: "Grammar Rules Assessment", 
            type: "quiz", 
            duration: "30 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <div class="bg-indigo-900 text-white p-6 rounded-lg shadow-lg mb-6">
                   <h2 class="text-2xl font-bold mb-2">PTE Grammar Proficiency Check</h2>
                   <p class="text-indigo-200">Test your mastery of the rules before proceeding to speaking modules.</p>
                </div>
                
                <!-- Question 1: Passive Voice -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="1">
                   <h4 class="font-bold text-lg mb-4">1. Select the grammatically correct sentence:</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q1" value="0" class="w-4 h-4 text-indigo-600">
                         <span>The report was write by the manager yesterday.</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q1" value="1" class="w-4 h-4 text-indigo-600">
                         <span>The report was written by the manager yesterday.</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q1" value="2" class="w-4 h-4 text-indigo-600">
                         <span>The report was writing by the manager yesterday.</span>
                      </label>
                   </div>
                </div>

                <!-- Question 2: Prepositions -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="2">
                   <h4 class="font-bold text-lg mb-4">2. Fill in the blank: "He is responsible ___ managing the team."</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q2" value="0" class="w-4 h-4 text-indigo-600">
                         <span>to</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q2" value="1" class="w-4 h-4 text-indigo-600">
                         <span>of</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q2" value="2" class="w-4 h-4 text-indigo-600">
                         <span>for</span>
                      </label>
                   </div>
                </div>

                <!-- Question 3: Subject-Verb Agreement (NEW) -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="0">
                   <h4 class="font-bold text-lg mb-4">3. Choose the correct verb form: "One of the students ___ absent today."</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q3" value="0" class="w-4 h-4 text-indigo-600">
                         <span>is</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q3" value="1" class="w-4 h-4 text-indigo-600">
                         <span>are</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q3" value="2" class="w-4 h-4 text-indigo-600">
                         <span>were</span>
                      </label>
                   </div>
                </div>

                <!-- Question 4: Parts of Speech (NEW) -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="1">
                   <h4 class="font-bold text-lg mb-4">4. Identify the ADVERB in this sentence: "She spoke softly to the child."</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q4" value="0" class="w-4 h-4 text-indigo-600">
                         <span>spoke</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q4" value="1" class="w-4 h-4 text-indigo-600">
                         <span>softly</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q4" value="2" class="w-4 h-4 text-indigo-600">
                         <span>child</span>
                      </label>
                   </div>
                </div>

                <!-- Question 5: Sentence Structure (NEW) -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="2">
                   <h4 class="font-bold text-lg mb-4">5. What type of sentence is this? "I wanted to go to the park, but it started raining."</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q5" value="0" class="w-4 h-4 text-indigo-600">
                         <span>Simple</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q5" value="1" class="w-4 h-4 text-indigo-600">
                         <span>Complex</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q5" value="2" class="w-4 h-4 text-indigo-600">
                         <span>Compound</span>
                      </label>
                   </div>
                </div>

                <!-- Question 6: Despite vs Although (NEW) -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="0">
                   <h4 class="font-bold text-lg mb-4">6. Choose the correct word: "___ the heavy traffic, we arrived on time."</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q6" value="0" class="w-4 h-4 text-indigo-600">
                         <span>Despite</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q6" value="1" class="w-4 h-4 text-indigo-600">
                         <span>Although</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q6" value="2" class="w-4 h-4 text-indigo-600">
                         <span>However</span>
                      </label>
                   </div>
                </div>

                <!-- Question 7: Modals (NEW) -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="1">
                   <h4 class="font-bold text-lg mb-4">7. Correct the error: "You must to submit the form."</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q7" value="0" class="w-4 h-4 text-indigo-600">
                         <span>You must submitting the form.</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q7" value="1" class="w-4 h-4 text-indigo-600">
                         <span>You must submit the form.</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q7" value="2" class="w-4 h-4 text-indigo-600">
                         <span>You must submitted the form.</span>
                      </label>
                   </div>
                </div>

                <!-- Question 8: Article + Noun (NEW) -->
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm question-item" data-correct="2">
                   <h4 class="font-bold text-lg mb-4">8. Which phrase is correct?</h4>
                   <div class="space-y-3">
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q8" value="0" class="w-4 h-4 text-indigo-600">
                         <span>A important decision</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q8" value="1" class="w-4 h-4 text-indigo-600">
                         <span>An important decisions</span>
                      </label>
                      <label class="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                         <input type="radio" name="q8" value="2" class="w-4 h-4 text-indigo-600">
                         <span>An important decision</span>
                      </label>
                   </div>
                </div>

              </div>
            `
          }
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
            videoUrl: "https://www.youtube.com/embed/uNGb7bDtdW0",
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
                
                <!-- REPEAT_SENTENCE_PRACTICE -->
              </div>
            `
          },
          { 
             id: "pte-m1-l3", 
             title: "Describe Image: The Fluency First Strategy", 
             type: "reading", 
             duration: "30 min", 
             isCompleted: false,
             content: `
<div class="space-y-6">
  <h3 class="text-2xl font-bold text-slate-800">Describe Image: The Fluency First Strategy</h3>
  <p class="text-slate-600">The computer doesn't care if you understand the data; it cares that you speak <strong>without hesitation</strong> for 40 seconds.</p>

  <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
    <div class="flex items-start justify-between mb-2">
      <h4 class="font-bold text-blue-900">The "Universal" DI Template</h4>
      <div class="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded border border-red-200 max-w-[50%] text-right">
        ⚠️ DO NOT use the template as a script in the actual exam. Scripts or templates are banned. Use the template as your GUIDE.
      </div>
    </div>
    
    <!-- DESCRIBE_IMAGE_PRACTICE -->

    <div class="bg-white p-4 rounded font-serif text-slate-700 shadow-inner">
      "The supplied <strong class="text-slate-900">[Bar/Line/Pie]</strong> chart provides information about <strong class="text-slate-900">[Topic]</strong>. 
      It is clear from the image that the highest value is <strong class="text-slate-900">[Max Value]</strong>, 
      while the lowest value can be seen in <strong class="text-slate-900">[Min Value]</strong>. 
      Additionally, there are some fluctuations in <strong class="text-slate-900">[Trend/Category]</strong>. 
      In conclusion, this image is very informative for understanding <strong class="text-slate-900">[Topic]</strong>."
    </div>
  </div>

  <!-- DESCRIBE_IMAGE_PRACTICE -->

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="p-4 bg-slate-50 rounded-lg border">
      <h5 class="font-bold text-slate-800">Do:</h5>
      <ul class="text-sm list-disc ml-5 space-y-1 text-slate-600">
        <li>Speak at a steady, moderate pace.</li>
        <li>Keep talking even if you make a mistake.</li>
        <li>Focus on Nouns and Numbers.</li>
      </ul>
    </div>
    <div class="p-4 bg-red-50 rounded-lg border border-red-100">
      <h5 class="font-bold text-red-800">Don't:</h5>
      <ul class="text-sm list-disc ml-5 space-y-1 text-red-700">
        <li>Pause to think about the data logic.</li>
        <li>Stay silent for more than 3 seconds.</li>
        <li>Try to be 100% accurate with complex trends.</li>
      </ul>
    </div>
  </div>
</div>
`
          },
          { 
            id: "pte-m2-l4", 
            title: "Speech Analysis Lab", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
<div class="space-y-6">
  <h3 class="text-2xl font-bold text-slate-800">AI Scoring Rules</h3>
  
  <div class="grid grid-cols-1 gap-4">
    <div class="bg-white p-6 rounded-xl border-2 border-red-100 shadow-sm">
      <h4 class="text-red-600 font-black uppercase text-sm mb-4 tracking-tighter">● Avoid the Death Triangle</h4>
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-2 bg-red-50 rounded">
          <span class="font-bold text-red-700 w-32">False Starts:</span>
          <span class="text-sm text-slate-600">Stopping and restarting a sentence.</span>
        </div>
        <div class="flex items-center gap-3 p-2 bg-red-50 rounded">
          <span class="font-bold text-red-700 w-32">Self-Correction:</span>
          <span class="text-sm text-slate-600">Fixing grammar (e.g., "She go—goes").</span>
        </div>
        <div class="flex items-center gap-3 p-2 bg-red-50 rounded">
          <span class="font-bold text-red-700 w-32">Fillers:</span>
          <span class="text-sm text-slate-600">"Uhm", "Ah", "Like", "You know".</span>
        </div>
      </div>
    </div>

    <div class="bg-indigo-900 p-6 rounded-xl text-center shadow-xl">
      <p class="text-indigo-100 text-lg italic">
        "One <strong class="text-white underline">smooth</strong>, incorrect sentence is worth <strong class="text-white underline">more</strong> than one hesitant, perfect sentence."
      </p>
    </div>
    
    <!-- AUDIO_EXAMPLES -->
  </div>
</div>
`
          },
          { id: "pte-m2-quiz-ai", title: "AI Auditor Assessment", type: "quiz", duration: "10 min", isCompleted: false },
          { 
            id: "pte-m2-l5-sgd", 
            title: "Summarize Group Discussion", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/-TWLcLqfC6Y"
          },
          { 
            id: "pte-m2-l6-rts", 
            title: "Respond to a Situation", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/YoV25DFFADs"
          },
          { 
            id: "pte-m2-l7-rl", 
            title: "Retell Lecture", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/GmofpAGRFvE"
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
             videoUrl: "https://www.youtube.com/embed/bhUr3gGMmi4" 
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

                <h4 class="text-xl font-bold text-slate-800 mt-6">Essential Topic-Based Collocations</h4>
                
                <div class="space-y-4">
                  <!-- Business & Economy -->
                  <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h5 class="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <span class="p-1 bg-blue-200 rounded text-blue-800">💼</span> Business & Economy
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-blue-200 shadow-sm font-medium">Take responsibility</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-blue-200 shadow-sm font-medium">Make a profit/loss</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-blue-200 shadow-sm font-medium">Boost sales/revenue</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-blue-200 shadow-sm font-medium">Attract investment/customers</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-blue-200 shadow-sm font-medium">Generate income/employment</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-blue-200 shadow-sm font-medium">Meet demand/expectations</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-blue-200 shadow-sm font-medium">Reduce costs/expenses</span>
                    </div>
                  </div>

                  <!-- Education & Learning -->
                  <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h5 class="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                      <span class="p-1 bg-indigo-200 rounded text-indigo-800">🎓</span> Education & Learning
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-indigo-200 shadow-sm font-medium">Acquire knowledge/skills</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-indigo-200 shadow-sm font-medium">Gain experience/confidence</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-indigo-200 shadow-sm font-medium">Conduct research/study</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-indigo-200 shadow-sm font-medium">Achieve success/progress</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-indigo-200 shadow-sm font-medium">Develop skills/abilities</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-indigo-200 shadow-sm font-medium">Enhance learning/performance</span>
                    </div>
                  </div>

                  <!-- Science & Technology -->
                  <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h5 class="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <span class="p-1 bg-emerald-200 rounded text-emerald-800">🔬</span> Science & Technology
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-emerald-200 shadow-sm font-medium">Carry out an experiment/research</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-emerald-200 shadow-sm font-medium">Develop a technique/method</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-emerald-200 shadow-sm font-medium">Innovative solution/approach</span>
                      <span class="bg-white px-3 py-1.5 rounded-full text-sm text-slate-700 border border-emerald-200 shadow-sm font-medium">Breakthrough discovery/technology</span>
                    </div>
                  </div>
                </div>

                <div class="bg-amber-50 p-6 rounded-xl border border-amber-200 mt-6 shadow-sm">
                  <div class="flex gap-3">
                    <span class="text-2xl">💡</span>
                    <p class="text-amber-900 italic font-serif text-lg leading-relaxed">
                      "Mastering these collocations will help you sound more natural and accurate in your responses, ultimately contributing to a higher score on the PTE Academic reading test."
                    </p>
                  </div>
                </div>
              </div>
            `,
             resources: [
               {
                 title: "High-frequency PTE Collocations List",
                 type: "pdf",
                 url:  "https://drive.google.com/uc?id=1uYYQ8S1ICro4GdEfJL6lL7-42G0_YmAD&export=download"
               }
             ]
           },
           { id: "pte-m2-quiz", title: "Reading Assessment", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "pte-writing",
        title: "Module 4: Writing",
        description: "Essay writing templates and Summarize Written Text techniques.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "pte-m3-l1", 
            title: "Summarize Written Text: The One-Sentence Rule", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
<div class="space-y-6">
  <div class="bg-blue-900 text-white p-6 rounded-xl shadow-lg border-b-4 border-blue-400">
    <h3 class="text-xl font-bold mb-2">The Golden Rule: One Period Only</h3>
    <p class="text-blue-100 italic text-sm">"If you hit the 'Full Stop' key twice, you score 0. Period."</p>
  </div>

  <div class="bg-white border-2 border-slate-200 rounded-xl p-6">
    <h4 class="font-bold text-slate-800 mb-4">The 'Connector' Strategy</h4>
    <p class="text-slate-600 text-sm mb-4">Pick two main ideas from the text and join them using <strong>; however,</strong> or <strong>, and</strong>.</p>
    
    <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm border-l-4 border-indigo-500">
      <span class="text-indigo-600 font-bold">[Main Idea A]</span>; however, <span class="text-indigo-600 font-bold">[Main Idea B]</span>.
    </div>
  </div>

  <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
    <h5 class="text-amber-800 font-bold text-xs uppercase mb-2">Pro-Tip for Mechanics</h5>
    <p class="text-amber-900 text-sm">Don't try to be creative. Copy-paste the most 'technical-looking' phrases from the start and the end of the text.</p>
  </div>
</div>
<!-- INTERACTIVE_COMPONENT -->
`
          },
          { id: "pte-m3-l1-quiz", title: "Logic Check: Punctuation", type: "quiz", duration: "10 min", isCompleted: false },
          { 
            id: "pte-m3-l3-lab", 
            title: "Lab: SWT Interactive Practice", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: "<!-- SWT Practice Lab -->"
          },
          { 
            id: "pte-m3-l2",  
            title: "Summarize Spoken Text & Retell Lecture", 
            type: "reading", 
            duration: "25 min", 
            isCompleted: false,
            content: `
<div class="space-y-8">
  <!-- RETELL LECTURE SECTION -->
  <div class="border-b border-slate-200 pb-8">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-2xl font-bold text-slate-800">Retell Lecture</h3>
        <span class="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Speaking Task</span>
    </div>
    <p class="text-slate-600 mb-6">Success is 80% notes, 20% template. You have 40 seconds to retell the information.</p>

    <!-- AUDIO PLAYER SIMULATION -->
    <div class="bg-slate-100 p-4 rounded-lg mb-6 flex items-center gap-4 border border-slate-200">
        <div class="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <div class="flex-1">
            <div class="text-sm font-bold text-slate-800">Sample Lecture: Climate Change</div>
            <div class="text-xs text-slate-500">00:00 / 01:30</div>
            <div class="w-full bg-slate-300 h-1.5 mt-2 rounded-full overflow-hidden">
                <div class="bg-indigo-500 h-full w-1/3"></div>
            </div>
        </div>
        <button data-tts="The lecture mainly discusses the impact of industrialization on global warming. Specifically, the speaker highlights how carbon dioxide emissions from factories are leading to the melting of ice caps. Furthermore, the lecture emphasizes that immediate action is required to combat these environmental changes." class="text-xs bg-white border border-slate-300 px-4 py-2 rounded-lg font-bold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2">
            <span>🔊 Play Snippet</span>
        </button>
    </div>

    <div class="bg-indigo-50 border border-indigo-100 p-6 rounded-xl shadow-sm mb-6">
      <h4 class="text-indigo-900 font-bold mb-3 flex items-center gap-2">
        <span class="bg-indigo-600 text-white text-xs px-2 py-1 rounded">STEP 1</span>
        Note-Taking Frame
      </h4>
      <p class="text-sm text-indigo-800 mb-4 font-medium">Capture 10-12 'Big' nouns. Avoid verbs.</p>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white border border-indigo-200 p-2 rounded text-xs font-mono text-indigo-600">● Global Warming</div>
        <div class="bg-white border border-indigo-200 p-2 rounded text-xs font-mono text-indigo-600">● Carbon Dioxide</div>
        <div class="bg-white border border-indigo-200 p-2 rounded text-xs font-mono text-indigo-600">● Ice Caps</div>
        <div class="bg-white border border-indigo-200 p-2 rounded text-xs font-mono text-indigo-600">● Industrialization</div>
      </div>
    </div>

    <div class="bg-slate-900 p-6 rounded-xl shadow-xl border-t-4 border-indigo-500">
      <h4 class="text-indigo-400 font-bold mb-3 uppercase tracking-widest text-xs">The Speaking Frame (Memorize This)</h4>
      <div class="text-slate-200 leading-relaxed font-serif text-lg italic">
        "The speaker was discussing <span class="text-indigo-400 font-bold">[Topic]</span>. 
        He mentioned <span class="text-indigo-400 font-bold">[Keyword 1]</span>, 
        <span class="text-indigo-400 font-bold">[Keyword 2]</span>, and 
        <span class="text-indigo-400 font-bold">[Keyword 3]</span>. 
        Furthermore, the lecture highlighted <span class="text-indigo-400 font-bold">[Keyword 4]</span>. 
        In conclusion, the speaker suggested that <span class="text-indigo-400 font-bold">[Keyword 5]</span> is vital."
      </div>
    </div>
  </div>

  <!-- SUMMARIZE SPOKEN TEXT SECTION -->
  <div>
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-2xl font-bold text-slate-800">Summarize Spoken Text</h3>
        <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Writing Task</span>
    </div>
    <div class="flex items-start gap-4 mb-6">
        <div class="bg-emerald-100 text-emerald-700 p-3 rounded-lg text-2xl">✍️</div>
        <div>
            <p class="text-slate-700 font-medium">Same audio, different output.</p>
            <p class="text-slate-600 text-sm mt-1">You will hear the same type of lecture, but instead of speaking, you must write a <strong>50-70 word summary</strong> in 10 minutes.</p>
        </div>
    </div>
    
    <div class="bg-emerald-50 border border-emerald-100 p-6 rounded-xl shadow-sm">
        <h4 class="text-emerald-900 font-bold mb-3">The Writing Template</h4>
        <p class="text-sm text-emerald-800 mb-4">Unlike Retell Lecture, grammar and spelling count here. Use simple, correct sentences.</p>
        
        <div class="bg-white p-5 rounded-lg border border-emerald-200 font-serif text-slate-700 italic leading-loose shadow-inner">
            "The lecture discusses the importance of <span class="text-emerald-600 font-bold">[Topic]</span>. 
            Firstly, the speaker emphasizes that <span class="text-emerald-600 font-bold">[Main Point 1]</span> is significant. 
            Secondly, it is mentioned that <span class="text-emerald-600 font-bold">[Main Point 2]</span> plays a crucial role. 
            Finally, the lecturer concludes that <span class="text-emerald-600 font-bold">[Conclusion/Implication]</span>."
        </div>
        
        <div class="mt-4 flex gap-2 text-xs text-emerald-700 font-bold bg-emerald-100/50 p-2 rounded inline-block">
            <span>✅ 50-70 Words</span>
            <span>•</span>
            <span>✅ Good Grammar</span>
            <span>•</span>
            <span>✅ Correct Spelling</span>
        </div>
    </div>
  </div>
</div>
`,
          },
          { id: "pte-m3-quiz", title: "Writing Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "pte-listening",
        title: "Module 5: Listening",
        description: "Master the 8 listening question types with focused strategies.",
        status: "locked",
        progress: 0,
        lessons: [
           {
             id: "pte-m5-intro",
             title: "Overview: The PTE Listening Section",
             type: "reading",
             duration: "10 min",
             isCompleted: false,
             content: `
               <div class="space-y-6">
                 <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">The PTE Listening Section</h1>
                   <p class="text-indigo-200 text-lg">30-43 Minutes | 8 Question Types | One Hearing Only</p>
                 </div>
                 
                 <div class="grid md:grid-cols-2 gap-6">
                   <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 class="font-bold text-xl text-slate-800 mb-4">Critical Constraints</h3>
                      <ul class="space-y-3 text-slate-600">
                        <li class="flex items-start gap-2">
                          <span class="bg-red-100 text-red-600 p-1 rounded text-xs font-bold">ONCE</span>
                          <span>You hear the audio <strong>only once</strong>. Never rewind.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="bg-amber-100 text-amber-600 p-1 rounded text-xs font-bold">AUTO</span>
                          <span>Audio plays automatically after 3-5 seconds.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="bg-blue-100 text-blue-600 p-1 rounded text-xs font-bold">NOTES</span>
                          <span>Use your erasable notebook constantly.</span>
                        </li>
                      </ul>
                   </div>

                   <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                      <h3 class="font-bold text-xl text-indigo-900 mb-4">Section Breakdown</h3>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">1. Summarize Spoken Text</span>
                          <span class="text-slate-500">Writing & Listening</span>
                        </div>
                        <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">2. Multiple Choice (Multiple)</span>
                          <span class="text-slate-500">Listening</span>
                        </div>
                        <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">3. Fill in the Blanks</span>
                          <span class="text-slate-500">Listening & Writing</span>
                        </div>
                        <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">4. Highlight Correct Summary</span>
                          <span class="text-slate-500">Listening & Reading</span>
                        </div>
                         <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">5. Multiple Choice (Single)</span>
                          <span class="text-slate-500">Listening</span>
                        </div>
                         <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">6. Select Missing Word</span>
                          <span class="text-slate-500">Listening</span>
                        </div>
                         <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">7. Highlight Incorrect Words</span>
                          <span class="text-slate-500">Listening & Reading</span>
                        </div>
                         <div class="flex justify-between items-center bg-white p-2 rounded border border-indigo-200">
                          <span class="font-medium text-indigo-700">8. Write from Dictation</span>
                          <span class="text-slate-500">Listening & Writing</span>
                        </div>
                      </div>
                   </div>
                 </div>
               </div>
             `
           },
           { 
            id: "pte-m3-l3", 
            title: "Listening: Multiple Choice Multiple Answers", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/m1c3X4YtexI"
          },
          { 
            id: "pte-m3-l4", 
            title: "Listening: Select Missing Word", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/uZx4fpHT_Dw"
          },
          { 
            id: "pte-m3-l5", 
            title: "Listening: Highlight Incorrect Words", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/1xraH11zCBI"
          },
          { 
            id: "pte-m3-l6", 
            title: "Listening: Fill in the Blanks", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/UIrtM-hSJcA"
          },
          { 
            id: "pte-m3-l7", 
            title: "Writing: Write from Dictation", 
            type: "video", 
            duration: "15 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/9edG9TRte8o"
          },
          { id: "pte-listening-quiz", title: "Listening Strategy Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "pte-mock-exam",
        title: "Module 6: PTE Mock Exam",
        description: "Full-length simulation of the PTE Speaking section.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "pte-mock-1", 
            title: "Test 1: Read Aloud", 
            type: "reading", 
            duration: "5 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <div class="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-indigo-900 mb-2">Task 1: Read Aloud</h4>
                  <p class="text-slate-700 mb-4 text-lg font-serif leading-relaxed">
                    "The inherent neuroplasticity of the adult brain allows for significant cognitive recovery even after traumatic injury. However, this regenerative potential is heavily dependent on the immediacy and intensity of therapeutic intervention, suggesting that rehabilitation protocols must be both rapid and rigorous to maximize functional outcomes."
                  </p>
                </div>
                
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h5 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Scoring Criteria</h5>
                   <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Content & Pronunciation:</strong> All terms must be clear, audible, and meaningful.</li>
                      <li><strong>Fluency:</strong> Delivery must be natural, smooth, and without unnecessary pauses or hesitation.</li>
                   </ul>
                </div>
                
                <!-- SPEAKING_MOCK_TEST -->
              </div>
            `
          },
          { 
            id: "pte-mock-2", 
            title: "Test 2: Repeat Sentence", 
            type: "reading", 
            duration: "5 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <div class="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-indigo-900 mb-4">Task 2: Repeat Sentence</h4>
                  <p class="text-slate-600 mb-4">You will hear a sentence. Please repeat the sentence exactly as you hear it.</p>
                  
                  <div data-tts="The statistical evidence suggests that the correlation between these two variables is not coincidental but causal." class="bg-white p-4 rounded border border-slate-200 flex items-center gap-3">
                     <!-- TTS_TRIGGER -->
                     <span class="text-sm text-slate-400 italic">Click play to hear the sentence (Audio hidden)</span>
                  </div>
                </div>
                
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h5 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Scoring Criteria</h5>
                   <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Pronunciation:</strong> Clear articulation of all sounds.</li>
                      <li><strong>Fluency:</strong> Smooth rhythm and phrasing.</li>
                   </ul>
                </div>
                
                <!-- SPEAKING_MOCK_TEST -->
              </div>
            `
          },
          { 
            id: "pte-mock-3", 
            title: "Test 3: Describe Image", 
            type: "reading", 
            duration: "5 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <div class="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-indigo-900 mb-4">Task 3: Describe Image</h4>
                  <div class="border rounded-lg overflow-hidden mb-4">
                     <img src="/assets/meeting-discussion.jpg" alt="Meeting discussion" class="w-full h-auto object-cover max-h-[400px]" />
                  </div>
                  <p class="text-slate-600 text-sm">Describe this image in detail.</p>
                </div>
                
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h5 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Scoring Criteria</h5>
                   <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Content:</strong> Mention key elements (people, setting, actions).</li>
                      <li><strong>Fluency:</strong> Maintain a steady flow without long pauses.</li>
                   </ul>
                </div>
                
                <!-- SPEAKING_MOCK_TEST -->
              </div>
            `
          },
          { 
            id: "pte-mock-4", 
            title: "Test 4: Retell Lecture", 
            type: "reading", 
            duration: "5 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6" data-tts="Urbanization has fundamentally shifted the demographic landscape of the 21st century. For the first time in history, more people reside in cities than in rural areas. This shift presents unique challenges for infrastructure, sanitation, and social cohesion, requiring innovative policy solutions.">
                <div class="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-indigo-900 mb-4">Task 4: Retell Lecture</h4>
                   <p class="text-slate-600 mb-4">You will hear a lecture. Retell the lecture in your own words.</p>
                   
                   <!-- AUDIO_PLAYER_PLACEHOLDER -->
                </div>
                
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h5 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Scoring Criteria</h5>
                   <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Content:</strong> Mention keywords (Urbanization, demographics, challenges, infrastructure).</li>
                      <li><strong>Fluency:</strong> Speak continuously for 40 seconds.</li>
                   </ul>
                </div>
                
                <!-- SPEAKING_MOCK_TEST -->
              </div>
            `
          },
          { 
            id: "pte-mock-5", 
            title: "Test 5: Answer Short Question", 
            type: "reading", 
            duration: "2 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6" data-tts="What is the term for a period of ten years?">
                <div class="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-indigo-900 mb-4">Task 5: Answer Short Question</h4>
                  
                  <!-- AUDIO_PLAYER_PLACEHOLDER -->
                </div>
                
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h5 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Scoring Criteria</h5>
                   <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Fluency:</strong> Immediate, clear response (e.g., 'Decade').</li>
                   </ul>
                </div>
                
                <!-- SPEAKING_MOCK_TEST -->
              </div>
            `
          },
          { 
            id: "pte-mock-6", 
            title: "Test 6: Summarize Group Discussion", 
            type: "reading", 
            duration: "5 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6" data-tts="Speaker A: I think we should focus on digital marketing. It's cheaper. Speaker B: I disagree, traditional ads reach older people better. Speaker C: Maybe we can do a mix of both to cover all bases.">
                <div class="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-indigo-900 mb-4">Task 6: Summarize Group Discussion</h4>
                  
                  <!-- AUDIO_PLAYER_PLACEHOLDER -->
                </div>
                
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h5 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Scoring Criteria</h5>
                   <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Content:</strong> Mention keywords (Digital marketing, traditional ads, mix/compromise).</li>
                      <li><strong>Fluency:</strong> Provide a balanced summary smoothly.</li>
                   </ul>
                </div>
                
                <!-- SPEAKING_MOCK_TEST -->
              </div>
            `
          },
          { 
            id: "pte-mock-7", 
            title: "Test 7: Respond to a Situation", 
            type: "reading", 
            duration: "5 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6" data-tts="You are late for an important meeting because your car broke down. Call your manager, explain the situation, and suggest a solution.">
                <div class="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-indigo-900 mb-4">Task 7: Respond to a Situation</h4>
                  
                  <div class="mb-4 text-slate-800 font-medium p-4 bg-white border rounded">
                     Prompt: "You are late for an important meeting because your car broke down. Call your manager, explain the situation, and suggest a solution."
                  </div>
                  
                  <!-- AUDIO_PLAYER_PLACEHOLDER -->
                </div>
                
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h5 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Scoring Criteria</h5>
                   <ul class="text-sm text-slate-600 space-y-1 list-disc pl-5">
                      <li><strong>Content:</strong> Explain (car trouble) and Solve (Zoom meeting / reschedule).</li>
                      <li><strong>Fluency:</strong> Natural, polite tone.</li>
                   </ul>
                </div>
                
                <!-- SPEAKING_MOCK_TEST -->
              </div>
            `
          },
          { 
            id: "pte-mock-writing-section", 
            title: "Section 1: Writing Test", 
            type: "reading", 
            duration: "30 min", 
            isCompleted: false,
            content: "<!-- WRITING_MOCK_TEST -->" 
          },
          { 
            id: "pte-mock-reading-section", 
            title: "Section 2: Reading Test", 
            type: "reading", 
            duration: "18 min", 
            isCompleted: false,
            content: `<!-- READING_MOCK_TEST -->`
          },
          { 
            id: "pte-mock-listening-section", 
            title: "Section 3: Listening Test", 
            type: "reading", 
            duration: "45 min", 
            isCompleted: false,
            content: "<!-- LISTENING_MOCK_TEST -->" 
          },
          { 
            id: "pte-mock-completion", 
            title: "Completion: Full Mock Unlock", 
            type: "reading", 
            duration: "5 min", 
            isCompleted: false,
            content: "<!-- MOCK_EXAM_COMPLETION -->" 
          }
        ]
      },
    ]
  },
  {
    id: "tech-english",
    title: "Technical English Bridge",
    category: "English",
    level: "B1",
    description: "Essential vocabulary and reading skills for technical trades.",
    thumbnail: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800&q=80",
    totalModules: 3,
    completedModules: 0,
    modules: [
      {
        id: "tech-m1",
        title: "Module 1: Safety & Tools",
        description: "Essential vocabulary for workplace safety and tool identification.",
        status: "unlocked",
        progress: 0,
        lessons: [
          { 
            id: "tech-m1-l1", 
            title: "Essential Tools & Safety", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
<div class="space-y-6">
  <h3 class="text-2xl font-bold text-slate-800">Technical Vocabulary: Tools & Safety</h3>
  <p class="text-slate-600">Mastering these terms is essential for both the PTE Reading exam and your workplace safety certifications.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="p-4 border border-orange-200 bg-orange-50 rounded-lg">
      <h4 class="font-bold text-orange-800 mb-2">PPE (Personal Protective Equipment)</h4>
      <ul class="list-disc ml-5 text-sm space-y-1 text-slate-700">
        <li><strong>Auto-darkening Helmet:</strong> Protects eyes from flash burn.</li>
        <li><strong>Respirator:</strong> Filters hazardous fumes/particulates.</li>
        <li><strong>Insulated Gloves:</strong> Prevents electrical shock and burns.</li>
      </ul>
    </div>

    <div class="p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <h4 class="font-bold text-blue-800 mb-2">Precision Measurement</h4>
      <ul class="list-disc ml-5 text-sm space-y-1 text-slate-700">
        <li><strong>Vernier Caliper:</strong> Measures internal/external dimensions precisely.</li>
        <li><strong>Feeler Gauge:</strong> Measures gap widths between parts.</li>
        <li><strong>Micrometer:</strong> Used for extremely fine thickness measurements.</li>
      </ul>
    </div>
  </div>

  <div class="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
    <h4 class="text-lg font-semibold mb-3 border-b border-slate-600 pb-2">Common Action Verbs</h4>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-slate-400">Welding Context:</p>
        <p><strong>Beveling:</strong> Shaping the edge of a joint.</p>
        <p><strong>Tacking:</strong> Making temporary small welds.</p>
      </div>
      <div>
        <p class="text-slate-400">Mechanical Context:</p>
        <p><strong>Torquing:</strong> Applying specific rotational force.</p>
        <p><strong>Fastening:</strong> Securing two parts together.</p>
      </div>
    </div>
  </div>
  
  <p class="text-xs text-slate-400 italic">Pro-tip: In PTE 'Fill in the Blanks', look for collocations like "measure the gap" or "apply the torque."</p>
</div>
`
          },
          { 
            id: "tech-m1-l2", 
            title: "Reading: Technical Manuals", 
            type: "reading", 
            duration: "25 min", 
            isCompleted: false,
            content: `
<div class="space-y-6">
  <h3 class="text-2xl font-bold text-slate-800">Reading Technical Manuals & Logs</h3>
  <p class="text-slate-600">In technical exams, you aren't reading for "feeling"—you are reading for <strong>specifications</strong> and <strong>sequence</strong>.</p>

  <div class="bg-amber-50 border-l-4 border-amber-400 p-4">
    <h4 class="font-bold text-amber-900">The "Spec-Scan" Technique</h4>
    <p class="text-sm text-amber-800">When faced with a technical paragraph, ignore the adjectives. Scan immediately for:</p>
    <ul class="list-disc ml-5 mt-2 text-sm text-amber-900">
      <li><strong>Measurements:</strong> (e.g., 5mm, 200°C, 50 psi)</li>
      <li><strong>Conditions:</strong> (e.g., "If", "Unless", "Prior to")</li>
      <li><strong>Sequencing:</strong> (e.g., "Simultaneously", "Subsequently", "Following")</li>
    </ul>
  </div>

  <div class="border rounded-lg overflow-hidden">
    <div class="bg-slate-100 p-2 text-xs font-bold uppercase text-slate-500">Practice Text Fragment</div>
    <div class="p-4 text-sm font-mono bg-white">
      "Prior to <strong>igniting</strong> the torch, ensure the <strong>regulator</strong> pressure does not exceed <strong>15 psi</strong>. Subsequently, open the oxygen valve slowly to avoid a backfire."
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4">
    <div class="bg-white border p-4 rounded-lg shadow-sm">
      <h4 class="font-bold text-slate-800 mb-2 italic">Common PTE Technical Distractors:</h4>
      <p class="text-sm text-slate-600 italic">Watch out for "Opposite Conditions." If the manual says "not exceeding 15 psi," the question might try to trick you with "at least 15 psi."</p>
    </div>
  </div>
</div>
`
          },
          { id: "tech-m1-quiz", title: "Technical Vocabulary Quiz", type: "quiz", duration: "20 min", isCompleted: false }
        ]
      },
      {
        id: "tech-m2",
        title: "Module 2: Technical Listening",
        description: "Filtering noise and identifying key technical instructions.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "tech-m2-l1", 
            title: "Listening for Technical Briefings", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
<div class="space-y-6">
  <h3 class="text-2xl font-bold text-slate-800">Listening in High-Noise Environments</h3>
  <p class="text-slate-600">Workshops are noisy. To pass the PTE Listening or follow a site briefing, you must filter out ambient noise and focus on <strong>Signpost Words</strong>.</p>

  <div class="bg-red-50 border-l-4 border-red-500 p-4">
    <h4 class="font-bold text-red-900">Priority 1: Safety & Emergency Cues</h4>
    <p class="text-sm text-red-800 italic mb-2">If you hear these, stop everything else:</p>
    <div class="grid grid-cols-2 gap-2 text-xs font-bold uppercase">
      <div class="bg-white p-2 rounded border">"Isolate"</div>
      <div class="bg-white p-2 rounded border">"Shut Down"</div>
      <div class="bg-white p-2 rounded border">"Evacuate"</div>
      <div class="bg-white p-2 rounded border">"Hazard"</div>
    </div>
  </div>

  <div class="space-y-4">
    <h4 class="font-bold text-slate-800">The "Three-Point" Listening Strategy</h4>
    <div class="flex items-start gap-3">
      <div class="bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 text-xs">1</div>
      <p class="text-sm"><span class="font-bold">Identify the Object:</span> What machine or tool is the speaker referring to? (e.g., "The lathe," "The MIG welder").</p>
    </div>
    <div class="flex items-start gap-3">
      <div class="bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 text-xs">2</div>
      <p class="text-sm"><span class="font-bold">Capture the Value:</span> Listen for numbers. Is it a temperature, a pressure, or a measurement?</p>
    </div>
    <div class="flex items-start gap-3">
      <div class="bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 text-xs">3</div>
      <p class="text-sm"><span class="font-bold">Confirm the State:</span> Is the object being turned ON, OFF, or ADJUSTED?</p>
    </div>
  </div>

  <div class="p-4 bg-slate-100 rounded-lg">
    <p class="text-xs text-slate-500"><strong>PTE Tip:</strong> In 'Write from Dictation', if background noise in the audio makes a word unclear, use grammar rules to guess. If you hear "The welder ____ the metal," and the middle is fuzzy, it is likely a past-tense verb like 'joined' or 'fixed'.</p>
  </div>
</div>
`
          },
          { id: "tech-m2-quiz", title: "Listening Assessment", type: "quiz", duration: "15 min", isCompleted: false }
        ]
      },
      {
        id: "tech-m3",
        title: "Module 3: Workplace Communication",
        description: "Writing reports and requesting materials professionally.",
        status: "locked",
        progress: 0,
        lessons: [
          { 
            id: "tech-m3-l1", 
            title: "Incident Reports", 
            type: "reading", 
            duration: "25 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-2xl font-bold text-slate-800">Writing an Incident Report</h3>
                <p class="text-slate-600">Accurate reporting is crucial for safety and insurance. Stick to the facts.</p>
                
                <div class="bg-red-50 p-6 rounded-xl border border-red-100">
                   <h4 class="font-bold text-red-900 mb-4">The 5 W's of Reporting</h4>
                   <ul class="space-y-2 text-slate-700">
                      <li><strong>Who:</strong> Who was involved? (Names, not just "he/she")</li>
                      <li><strong>What:</strong> What happened exactly? (Use specific verbs: "slipped," "fell," "sparked")</li>
                      <li><strong>When:</strong> Date and Time (24-hour format preferred).</li>
                      <li><strong>Where:</strong> Exact location (e.g., "Workshop B, Bay 4").</li>
                      <li><strong>Why:</strong> The immediate cause (e.g., "Oil spill on floor").</li>
                   </ul>
                </div>

                <div class="bg-white border rounded-lg p-6 shadow-sm">
                   <h4 class="font-bold text-slate-800 mb-2">Example Report</h4>
                   <p class="font-mono text-sm text-slate-600 bg-slate-50 p-4 rounded border">
                     "On 12 Oct at 14:30, John Smith slipped in Bay 4. There was an oil leak from the forklift. He injured his left ankle. First aid was applied immediately."
                   </p>
                </div>
              </div>
            `
          },
          { 
            id: "tech-m3-l2", 
            title: "Requesting Materials", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-2xl font-bold text-slate-800">Material Request Forms</h3>
                <p class="text-slate-600">Getting the right parts prevents delays. Be specific.</p>
                
                <div class="grid md:grid-cols-2 gap-6">
                   <div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <h4 class="font-bold text-blue-900 mb-2">Key Vocabulary</h4>
                      <ul class="space-y-2 text-sm text-blue-800">
                         <li><strong>SKU / Part #:</strong> The unique ID code.</li>
                         <li><strong>Quantity (Qty):</strong> How many?</li>
                         <li><strong>Dimensions:</strong> Size (Length x Width x Height).</li>
                         <li><strong>Grade:</strong> Quality level (e.g., "Marine Grade").</li>
                      </ul>
                   </div>
                   
                   <div class="bg-white p-6 rounded-xl border border-slate-200">
                      <h4 class="font-bold text-slate-800 mb-2">Sample Request</h4>
                      <table class="w-full text-sm text-left">
                         <tr class="border-b">
                            <th class="py-2 text-slate-500">Item</th>
                            <th class="py-2 text-slate-500">Qty</th>
                            <th class="py-2 text-slate-500">Reason</th>
                         </tr>
                         <tr>
                            <td class="py-2 font-mono">M10 x 50mm Bolts</td>
                            <td class="py-2">100</td>
                            <td class="py-2">Project A Assembly</td>
                         </tr>
                         <tr>
                            <td class="py-2 font-mono">5W-30 Oil (5L)</td>
                            <td class="py-2">2</td>
                            <td class="py-2">Forklift Service</td>
                         </tr>
                      </table>
                   </div>
                </div>
              </div>
            `
          },
          { 
            id: "tech-m3-l3", 
            title: "Clarification Techniques", 
            type: "reading", 
            duration: "20 min", 
            isCompleted: false, 
            content: `
              <div class="space-y-6">
                <h3 class="text-2xl font-bold text-slate-800">Clarification Techniques for Technical Assessments</h3>
                <p class="text-slate-600">In a technical assessment, asking for clarification is not a weakness—it is a safety requirement. Use these Australian workplace standards.</p>

                <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                      <h4 class="font-bold text-indigo-900 mb-2">1. Paraphrasing</h4>
                      <p class="text-sm text-slate-700 mb-2">Restate the instruction in your own words to check accuracy.</p>
                      <div class="bg-white p-3 rounded text-sm italic text-slate-600">"So just to confirm, you want me to align the conduit before securing it?"</div>
                   </div>

                   <div class="bg-green-50 p-5 rounded-lg border border-green-100">
                      <h4 class="font-bold text-green-900 mb-2">2. Checking Assumptions</h4>
                      <p class="text-sm text-slate-700 mb-2">Verify before acting to avoid dangerous mistakes.</p>
                      <div class="bg-white p-3 rounded text-sm italic text-slate-600">"Should I proceed as if this system is energised, or treat it as isolated?"</div>
                   </div>

                   <div class="bg-amber-50 p-5 rounded-lg border border-amber-100">
                      <h4 class="font-bold text-amber-900 mb-2">3. Seeking Specifics</h4>
                      <p class="text-sm text-slate-700 mb-2">Challenge vague words like "properly" or "secure".</p>
                      <div class="bg-white p-3 rounded text-sm italic text-slate-600">"When you say 'proper alignment', do you mean within ±2 mm?"</div>
                   </div>

                   <div class="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <h4 class="font-bold text-blue-900 mb-2">4. Fixing Deletions</h4>
                      <p class="text-sm text-slate-700 mb-2">Ask for missing information politely.</p>
                      <div class="bg-white p-3 rounded text-sm italic text-slate-600">"You mentioned this step is important—should it be done before or after re-pressurising?"</div>
                   </div>
                </div>

                <div class="bg-slate-800 text-white p-6 rounded-xl">
                   <h4 class="font-bold mb-2">Pro Tip: The "Stop & Recap"</h4>
                   <p class="text-slate-300 text-sm">Before starting any high-risk task in an exam, use the Summary Technique:</p>
                   <p class="mt-2 font-mono text-green-400">"To make sure I'm following correctly: First isolate, then verify zero energy, then remove the cover. Correct?"</p>
                </div>
              </div>
            `
          },
          { 
            id: "tech-m3-l4", 
            title: "Video: Stop Miscommunication", 
            type: "video", 
            duration: "5 min", 
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/EFTGvTAh9O8"
          },
          { id: "tech-m3-quiz", title: "Communication Assessment", type: "quiz", duration: "20 min", isCompleted: false }
        ]
      },
      {
        id: "tech-m4",
        title: "Module 4: Australian Workplace Culture",
        description: "Mastering the unique slang and communication style of Aussie job sites.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "tech-m4-l1",
            title: "Aussie Slang 101",
            type: "reading",
            duration: "15 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-2xl font-bold text-slate-800">Survival Guide: Aussie Workplace Slang</h3>
                <p class="text-slate-600">Australians (Aussies) love to shorten words. Understanding these terms is critical for building rapport and following instructions quickly.</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 class="font-bold text-amber-900 mb-2">The Essentials</h4>
                    <ul class="space-y-2 text-sm text-slate-700">
                      <li><strong>Arvo:</strong> Afternoon ("See you this arvo").</li>
                      <li><strong>Smoko:</strong> Short break for food/coffee (morning tea).</li>
                      <li><strong>Tradie:</strong> A skilled tradesperson (You!).</li>
                      <li><strong>Mate:</strong> Friend, colleague, or anyone really.</li>
                      <li><strong>Hard Yakka:</strong> Hard work.</li>
                    </ul>
                  </div>

                  <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 class="font-bold text-blue-900 mb-2">Feedback & Attitude</h4>
                    <ul class="space-y-2 text-sm text-slate-700">
                      <li><strong>She'll be right:</strong> It will be okay / Don't worry.</li>
                      <li><strong>No worries:</strong> You're welcome / It's fine.</li>
                      <li><strong>Too easy:</strong> I can do that easily / Agreed.</li>
                      <li><strong>Flat out:</strong> Very busy ("We are flat out today").</li>
                    </ul>
                  </div>
                </div>

                <div class="bg-slate-800 text-white p-6 rounded-xl">
                   <h4 class="font-bold mb-2">⚠️ Warning: "Yeah, nah" vs "Nah, yeah"</h4>
                   <p class="text-slate-300 text-sm mb-2">Australians often say 'yes' and 'no' together. Context is key:</p>
                   <div class="grid grid-cols-2 gap-4 text-center">
                      <div class="bg-red-900/50 p-2 rounded">
                        <div class="font-bold text-red-200">"Yeah, nah"</div>
                        <div class="text-xs text-slate-400">Means: NO</div>
                      </div>
                      <div class="bg-green-900/50 p-2 rounded">
                        <div class="font-bold text-green-200">"Nah, yeah"</div>
                        <div class="text-xs text-slate-400">Means: YES</div>
                      </div>
                   </div>
                </div>
              </div>
            `
          },
          {
            id: "tech-m4-l2",
            title: "Trade Specific Slang",
            type: "reading",
            duration: "20 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <h3 class="text-2xl font-bold text-slate-800">Slang by Trade</h3>
                <p class="text-slate-600">Specific terms you will hear in the workshop or on site.</p>

                <div class="space-y-6">
                  <!-- Automotive -->
                  <div class="border rounded-xl overflow-hidden">
                    <div class="bg-slate-100 p-3 font-bold text-slate-700 border-b">🚗 Automotive (Mechanics)</div>
                    <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                      <div>
                        <strong class="block text-indigo-600">Ute</strong>
                        <span class="text-sm text-slate-600">Utility vehicle / Pickup truck.</span>
                      </div>
                      <div>
                        <strong class="block text-indigo-600">Servo</strong>
                        <span class="text-sm text-slate-600">Service Station / Gas Station.</span>
                      </div>
                      <div>
                        <strong class="block text-indigo-600">Rego</strong>
                        <span class="text-sm text-slate-600">Vehicle Registration.</span>
                      </div>
                      <div>
                        <strong class="block text-indigo-600">Blowie / Blower</strong>
                        <span class="text-sm text-slate-600">Supercharger (or sometimes Turbo).</span>
                      </div>
                    </div>
                  </div>

                  <!-- Construction/Welding -->
                  <div class="border rounded-xl overflow-hidden">
                    <div class="bg-slate-100 p-3 font-bold text-slate-700 border-b">🏗️ Construction & Welding</div>
                    <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                      <div>
                        <strong class="block text-orange-600">Sparkie</strong>
                        <span class="text-sm text-slate-600">Electrician.</span>
                      </div>
                      <div>
                        <strong class="block text-orange-600">Chippie</strong>
                        <span class="text-sm text-slate-600">Carpenter.</span>
                      </div>
                      <div>
                        <strong class="block text-orange-600">Brickie</strong>
                        <span class="text-sm text-slate-600">Bricklayer.</span>
                      </div>
                      <div>
                        <strong class="block text-orange-600">Boilermaker (Boily)</strong>
                        <span class="text-sm text-slate-600">Heavy fabricator/welder.</span>
                      </div>
                      <div>
                        <strong class="block text-orange-600">Slab</strong>
                        <span class="text-sm text-slate-600">Concrete foundation OR a carton of 24 beers (currency for favors).</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                   <h4 class="font-bold text-yellow-800">Cultural Tip: "The Shout"</h4>
                   <p class="text-sm text-yellow-900">If someone says "It's your shout," it means it is your turn to buy the coffee or drinks for the group. Do not ignore this—it is key to team bonding.</p>
                </div>
              </div>
            `
          },
          { id: "tech-m4-quiz", title: "Aussie Slang Quiz", type: "quiz", duration: "15 min", isCompleted: false }
        ]
      }
    ]
  }
];

export const getCourseById = (id: string) => COURSES.find(c => c.id === id);
