
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
  category: "English" | "Technical" | "Mock Test" | "Communication";
  examType?: "TRA" | "TSA";
  industry?: "Automotive" | "Welding" | "Construction";
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "A2-B1" | "Easy" | "Medium" | "Hard"; // For English & Mock Tests
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
    id: "ielts-reading",
    title: "IELTS Reading: Band 5 to 6",
    category: "English",
    level: "B2",
    description: "Improve your IELTS Reading band score from 5 to 6 with targeted scanning and vocabulary strategies.",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    totalModules: 1,
    completedModules: 0,
    modules: [
      {
        id: "m1",
        title: "Module 1: Build Core Skills (Scanning + Vocabulary Paraphrasing)",
        description: "Improve your IELTS Reading band score from 5 to 6 by learning to scan effectively and paraphrase vocabulary.",
        status: "unlocked",
        progress: 0,
        lessons: [
          {
            id: "l0-reading",
            title: "Reading Practice: Scanning & Paraphrasing",
            type: "reading",
            duration: "30 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-blue-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Reading Practice: Scanning & Paraphrasing</h1>
                   <p class="text-blue-200 text-lg">Read the article below and prepare to locate information quickly.</p>
                </div>

                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-slate-800 leading-relaxed text-lg space-y-6">
                  <p>
                    President Donald Trump is increasing his efforts to acquire Greenland. On Saturday, he announced he would impose 10 per cent tariffs on Denmark, Germany, Norway, Sweden, the UK and other countries if they did not "go along with Greenland". These countries recently sent officials to Greenland.
                  </p>
                  <p>
                    The tariffs will start on the first of February. President Trump suggested the levy would increase to 25 per cent in June, "due and payable until such time as a deal is reached for the complete and total purchase of Greenland".
                  </p>
                  <p>
                    UK Prime Minister Sir Keir Starmer responded to Trump's plans. He said: "Applying tariffs on allies for pursuing the collective security of NATO is completely wrong."
                  </p>
                  <p>
                    The acquisition of Greenland has been a high priority for President Trump since he took office again last year. He stressed that "the national security of the United States and the world at large is at stake" because "China and Russia want Greenland".
                  </p>
                  <p>
                    He added: "It is imperative that, in order to protect global peace and security, strong measures be taken so that this potentially perilous situation ends quickly." President Trump said Greenland was a key component of the USA's Golden Dome missile defence system.
                  </p>
                  <p>
                    Thousands of people in Greenland have protested against Trump's plans. In the capital city of Nuuk, protesters held signs reading "Greenland is not for sale".
                  </p>
                </div>
              </div>
            `
          },
          {
            id: "l1-scanning-quiz",
            title: "Paraphrase Training",
            type: "assignment",
            duration: "10 min",
            isCompleted: false,
            content: ""
          }
        ]
      },
      {
        id: "m2",
        title: "Module 2: Paraphrase Training",
        description: "Enhance your True/False/Not Given and Matching Headings skills by mastering synonym substitution.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "l2-reading",
            title: "Reading: Ageing and Lifespan",
            type: "reading",
            duration: "10 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-blue-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Reading: Ageing and Lifespan</h1>
                   <p class="text-blue-200 text-lg">Read the passage below carefully to prepare for the paraphrase training.</p>
                </div>

                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-slate-800 leading-relaxed text-lg space-y-6">
                  <p>
                    A new study suggests that the number of children a woman has might affect her rate of ageing and her lifespan. Research from the University of Helsinki in Finland found that women who had five children or more, or no children, aged faster than those who had a small number of kids. Researcher Mikaela Hukkanen said: "From an evolutionary biology perspective, organisms have limited resources, such as time and energy. When a large amount of energy is invested in reproduction, it is taken away from bodily maintenance and repair mechanisms, which could reduce lifespan." She added that the finding of shorter lifespans of women who never gave birth was "surprising".
                  </p>
                  <p>
                    The researchers used historical data in their analysis of parenthood and ageing. They analysed the health data on 14,836 women. Researchers examined DNA data and blood samples, then modelled the effects of reproduction on women's rates of ageing and longevity.
                  </p>
                  <p>
                    Ms Hukkanen postulated that having a smaller number of pregnancies could have favourable effects on a mother's health. One benefit is a possible lower risk of breast and ovarian cancer. However, the "wear and tear" and physical demands of multiple childbirths can negate this lowered risk. Another factor that could increase longevity is the increased social support a mother receives from the state for having children.
                  </p>
                </div>
              </div>
            `
          },
          {
            id: "l2-paraphrase-quiz",
            title: "Paraphrase Training Quiz",
            type: "assignment",
            duration: "15 min",
            isCompleted: false,
            content: ""
          }
        ]
      },
      {
        id: "m3",
        title: "Module 3: Question-type Mastery",
        description: "Master True/False/Not Given, Fill-in-the-Gaps, and Matching Information with practical exercises.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "l3-reading",
            title: "Reading: The Rise of Vertical Farming",
            type: "reading",
            duration: "10 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-blue-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Reading: The Rise of Vertical Farming</h1>
                   <p class="text-blue-200 text-lg">Read the text below to prepare for your question-type mastery practice.</p>
                </div>

                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-slate-800 leading-relaxed text-lg space-y-6">
                  <p>
                    The traditional method of high-intensity agriculture consumes vast amounts of water and relies heavily on favorable weather conditions. However, a new approach known as vertical farming—growing crops in stacked layers within controlled indoor environments—is gaining traction. Proponents argue that this method could drastically reduce the carbon footprint associated with transporting produce from rural farms to urban centers.
                  </p>
                  <p>
                    Furthermore, by utilizing advanced hydroponic systems, these facilities can recycle nearly 95% of the water used, a significant improvement over conventional soil-based farming which often results in wasteful runoff. While the initial setup costs for such high-tech infrastructure are substantial, the ability to harvest year-round regardless of the season offers a reliable solution to food security in a changing climate.
                  </p>
                </div>
              </div>
            `
          },
          {
            id: "l3-question-mastery-quiz",
            title: "Question-type Mastery Quiz",
            type: "assignment",
            duration: "20 min",
            isCompleted: false,
            content: ""
          }
        ]
      },
      {
        id: "m4",
        title: "Module 4: Timed Reading Practice",
        description: "Improve your reading speed and vocabulary comprehension under timed conditions.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "l4-timed-practice",
            title: "Urban Rewilding: 7-Part Timed Reading",
            type: "assignment",
            duration: "15 min",
            isCompleted: false,
            content: ""
          },
          {
            id: "l4-quiz",
            title: "Module 4: Reading Assessment",
            type: "assignment",
            duration: "20 min",
            isCompleted: false,
            content: ""
          }
        ]
      }
    ]
  },
  {
    id: "aussie-comm",
    title: "Australian Workplace Communication",
    category: "Communication",
    level: "A2-B1",
    description: "Master conversational English, WH-questions, and Australian slang to communicate effectively in daily life and on the job.",
    thumbnail: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
    totalModules: 2,
    completedModules: 0,
    modules: [
      {
        id: "am1",
        title: "Module 1: Conversational Skills (WH-Questions)",
        description: "Practice answering basic WH-questions with an AI trainer to improve your daily conversational fluency.",
        status: "unlocked",
        progress: 0,
        lessons: [
          {
            id: "l1-aussie-convo",
            title: "Interactive Conversation Practice",
            type: "assignment",
            duration: "15 min",
            isCompleted: false,
            content: ""
          }
        ]
      },
      {
        id: "am2",
        title: "Module 2: Listening & Mimicking Slang",
        description: "Listen to authentic Australian pronunciation of common slang words and mimic them.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "l2-aussie-mimic",
            title: "Slang Mimicry Lab",
            type: "assignment",
            duration: "15 min",
            isCompleted: false,
            content: ""
          }
        ]
      }
    ]
  },
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
            quizId: "l3-vid-quiz",
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
            { 
                id: "tcarp1-l1", 
                title: "Power Tool Safety", 
                type: "video", 
                duration: "20 min", 
                isCompleted: false, 
                videoUrl: "https://www.youtube.com/embed/qQnrZeofF84",
                quizId: "tcarp1-safety-quiz"
            },
            {
                id: "tcarp1-safety-quiz",
                title: "Power Tool Safety Assessment",
                type: "quiz",
                duration: "15 min",
                isCompleted: false,
                content: `
                    {
                        "questions": [
                            {
                                "id": "q1",
                                "question": "Before operating any power tool, what is the most important safety check?",
                                "options": [
                                    "Checking if the battery is fully charged",
                                    "Ensuring the tool is plugged in",
                                    "Inspecting the power cord and tool for damage",
                                    "Wiping off sawdust from the casing"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Always inspect tools and cords for damage before use. Damaged equipment is a major cause of workplace electrical hazards."
                            },
                            {
                                "id": "q2",
                                "question": "When changing a blade or drill bit on a power tool, you must ALWAYS:",
                                "options": [
                                    "Wear heavy leather gloves",
                                    "Disconnect the power source (unplug or remove battery)",
                                    "Keep your finger near the trigger for quick testing",
                                    "Have a coworker hold the tool steady"
                                ],
                                "correctAnswer": 1,
                                "explanation": "Never change accessories while a tool is connected to power. Accidental triggers cause severe lacerations and amputations."
                            },
                            {
                                "id": "q3",
                                "question": "Which of the following is considered appropriate Personal Protective Equipment (PPE) when using a circular saw?",
                                "options": [
                                    "Loose-fitting long sleeves and safety glasses",
                                    "Safety glasses, hearing protection, and avoiding loose clothing/jewelry",
                                    "Cotton gloves and a dust mask",
                                    "Steel-toe boots only"
                                ],
                                "correctAnswer": 1,
                                "explanation": "Loose clothing and jewelry are severe entanglement hazards. Eye and ear protection are mandatory for high-decibel, debris-generating tools."
                            },
                            {
                                "id": "q4",
                                "question": "If a power tool's safety guard is broken or sticks, you should:",
                                "options": [
                                    "Remove it completely so it doesn't get in the way",
                                    "Tape or tie it back temporarily to finish the job",
                                    "Tag the tool 'Out of Service' and report it immediately",
                                    "Use the tool carefully and slowly"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Never disable or bypass safety guards. Defective tools must be locked/tagged out to prevent use until repaired."
                            },
                            {
                                "id": "q5",
                                "question": "When operating a nail gun (pneumatic or cordless), what is a critical safety rule?",
                                "options": [
                                    "Always carry the tool with your finger on the trigger",
                                    "Point the tool toward a coworker only if unloaded",
                                    "Disconnect the air supply/battery when moving between work areas",
                                    "Modify the contact safety tip for faster firing"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Never carry a nail gun with your finger on the trigger, and always disconnect power/air when moving to prevent accidental discharge."
                            }
                        ]
                    }
                `
            },
            { 
                id: "tcarp1-l2", 
                title: "Formwork Systems", 
                type: "reading", 
                duration: "30 min", 
                isCompleted: false,
                quizId: "tcarp1-formwork-intro-quiz",
                content: `
                    <div class="space-y-8">
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-amber-800">Understanding Formwork</h3>
                            <p class="text-slate-600 mb-6">Formwork is the temporary mold that holds wet concrete in place until it cures. It can be divided into two main categories: Conventional Timber and Engineered Systems.</p>
                            
                            <div class="grid grid-cols-2 gap-0 border rounded-xl overflow-hidden">
                                <div class="bg-amber-50 p-6 border-r border-amber-100">
                                    <h4 class="font-bold text-lg text-amber-900 mb-2">Conventional Timber</h4>
                                    <p class="text-xs text-amber-700 uppercase font-bold tracking-wider mb-4">Custom Built On-Site</p>
                                    <ul class="text-sm space-y-2 text-amber-900/80">
                                        <li>• Timber framing & bearers</li>
                                        <li>• Plywood sheathing</li>
                                        <li>• Highly flexible for complex shapes</li>
                                        <li>• Lower initial material cost</li>
                                    </ul>
                                    <p class="mt-4 text-xs italic text-amber-600">Used for: Custom residential, stairs, complex architectural concrete.</p>
                                </div>
                                <div class="bg-stone-50 p-6">
                                    <h4 class="font-bold text-lg text-stone-900 mb-2">Engineered Systems</h4>
                                    <p class="text-xs text-stone-700 uppercase font-bold tracking-wider mb-4">Prefabricated / Modular</p>
                                    <ul class="text-sm space-y-2 text-stone-900/80">
                                        <li>• Steel or aluminum frames</li>
                                        <li>• Modular interlocking panels</li>
                                        <li>• Extremely fast to assemble</li>
                                        <li>• High reusability (100+ pours)</li>
                                    </ul>
                                    <p class="mt-4 text-xs italic text-stone-600">Used for: Large commercial slabs, high-rise lift cores, repetitive walls.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-bold text-lg mb-2">Common Formwork Components</h4>
                            <div class="flex gap-4 overflow-x-auto pb-4">
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center shadow-sm">
                                    <div class="font-bold text-slate-800">Acrow Prop</div>
                                    <div class="text-xs text-slate-500">Vertical steel support</div>
                                </div>
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center shadow-sm">
                                    <div class="font-bold text-slate-800">Bearer</div>
                                    <div class="text-xs text-slate-500">Primary beam support</div>
                                </div>
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center shadow-sm">
                                    <div class="font-bold text-slate-800">Joist</div>
                                    <div class="text-xs text-slate-500">Secondary cross support</div>
                                </div>
                                <div class="min-w-[120px] bg-white border p-3 rounded text-center shadow-sm">
                                    <div class="font-bold text-slate-800">Form Ply</div>
                                    <div class="text-xs text-slate-500">Coated concrete facing</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: "tcarp1-formwork-intro-quiz",
                title: "Formwork Systems Assessment",
                type: "quiz",
                duration: "15 min",
                isCompleted: false,
                content: `
                    {
                        "questions": [
                            {
                                "id": "q1",
                                "question": "What is the primary advantage of Engineered Formwork Systems over Conventional Timber?",
                                "options": [
                                    "They are cheaper to buy initially",
                                    "They are faster to assemble and highly reusable",
                                    "They are better for complex, custom architectural shapes",
                                    "They do not require release agents"
                                ],
                                "correctAnswer": 1,
                                "explanation": "Engineered systems have a high initial cost but save massive amounts of labor time and can be reused dozens or hundreds of times."
                            },
                            {
                                "id": "q2",
                                "question": "Which of the following is considered a 'Secondary cross support' in a slab formwork system?",
                                "options": [
                                    "Acrow Prop",
                                    "Bearer",
                                    "Joist",
                                    "Form Ply"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Joists run across the primary bearers to provide direct support for the form ply."
                            },
                            {
                                "id": "q3",
                                "question": "When would Conventional Timber formwork be preferred?",
                                "options": [
                                    "For a 50-story high-rise elevator core",
                                    "For a massive, flat warehouse slab",
                                    "For a custom residential staircase with unique curves",
                                    "When pouring underwater"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Timber is highly flexible and can be cut and shaped on-site to match complex, unique architectural details."
                            },
                            {
                                "id": "q4",
                                "question": "What is the function of an 'Acrow Prop'?",
                                "options": [
                                    "To provide a smooth finish to the concrete",
                                    "To provide adjustable vertical steel support for the formwork above",
                                    "To tie the rebar together",
                                    "To seal the edges against concrete leaks"
                                ],
                                "correctAnswer": 1,
                                "explanation": "Acrow props (or shore props) are heavy-duty, adjustable steel posts that carry the vertical load of the formwork and wet concrete."
                            }
                        ]
                    }
                `
            },
            { id: "tcarp1-l3", title: "Tools Quiz", type: "quiz", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "tcarp2",
        title: "Module 2: Formwork Basics",
        description: "Temporary structures for concrete pouring.",
        status: "locked",
        progress: 0,
        lessons: [
            { 
                id: "tcarp2-l1", 
                title: "Introduction to Formwork", 
                type: "video", 
                duration: "25 min", 
                isCompleted: false,
                quizId: "tcarp2-formwork-quiz",
                videoUrl: "https://www.youtube.com/embed/n3o1t2l4h3s" 
            },
            {
                id: "tcarp2-formwork-quiz",
                title: "Formwork Safety & Basics Assessment",
                type: "quiz",
                duration: "15 min",
                isCompleted: false,
                content: `
                    {
                        "questions": [
                            {
                                "id": "q1",
                                "question": "What is the primary purpose of formwork in construction?",
                                "options": [
                                    "To provide a permanent decorative finish",
                                    "To hold wet concrete in place until it cures and gains strength",
                                    "To reinforce the steel rebar",
                                    "To insulate the building"
                                ],
                                "correctAnswer": 1,
                                "explanation": "Formwork is a temporary mold that supports the weight and pressure of wet concrete until it is self-supporting."
                            },
                            {
                                "id": "q2",
                                "question": "When stripping (removing) formwork, what is a critical safety hazard to watch out for?",
                                "options": [
                                    "Concrete curing too quickly",
                                    "Falling materials and exposed nails in the timber",
                                    "The color of the concrete changing",
                                    "Dust from the concrete surface"
                                ],
                                "correctAnswer": 1,
                                "explanation": "Stripping formwork involves removing temporary supports. Falling timber and protruding nails are major injury risks."
                            },
                            {
                                "id": "q3",
                                "question": "What is 'form release agent' used for?",
                                "options": [
                                    "To make the concrete set faster",
                                    "To strengthen the timber supports",
                                    "To prevent the concrete from sticking to the formwork timber/plywood",
                                    "To clean the concrete surface after stripping"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Release agents (like form oil) are applied to the inside of the forms to ensure they can be removed cleanly without damaging the concrete face."
                            },
                            {
                                "id": "q4",
                                "question": "Why is bracing essential in vertical formwork (like columns or walls)?",
                                "options": [
                                    "To resist the lateral (hydrostatic) pressure of the wet concrete during pouring",
                                    "To make the formwork look neat",
                                    "To hold the rebar in the center",
                                    "To stop the concrete from drying out"
                                ],
                                "correctAnswer": 0,
                                "explanation": "Wet concrete exerts immense outward pressure. Without adequate bracing, the forms will blowout or shift during the pour."
                            }
                        ]
                    }
                `
            },
            { 
                id: "tcarp2-l2", 
                title: "Slab & Suspended Formwork", 
                type: "reading", 
                duration: "30 min", 
                isCompleted: false,
                quizId: "tcarp2-slab-quiz",
                content: `
                    <div class="space-y-6">
                        <h3 class="text-xl font-bold">Suspended Slab Fundamentals</h3>
                        <p class="text-slate-600">Suspended formwork requires careful engineering and precise load calculations as it supports the entire weight of the concrete floor above the ground.</p>
                        
                        <div class="bg-slate-900 text-white p-6 rounded-xl">
                            <h4 class="font-bold text-lg mb-4 text-blue-300">Key Components</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <strong class="block text-yellow-400">Props (Acrow Props)</strong>
                                    <span class="text-sm text-slate-400">Adjustable vertical steel supports that carry the load to the floor below.</span>
                                </div>
                                <div>
                                    <strong class="block text-yellow-400">Bearers (Primary Bearers)</strong>
                                    <span class="text-sm text-slate-400">Heavy timbers or aluminum beams resting directly on the props.</span>
                                </div>
                                <div>
                                    <strong class="block text-yellow-400">Joists (Secondary Bearers)</strong>
                                    <span class="text-sm text-slate-400">Run perpendicular to bearers to support the form ply.</span>
                                </div>
                                <div>
                                    <strong class="block text-yellow-400">Form Ply</strong>
                                    <span class="text-sm text-slate-400">Specialized, coated plywood that creates the smooth bottom surface of the slab.</span>
                                </div>
                            </div>
                        </div>

                        <div class="border border-slate-200 rounded-lg p-4">
                            <h4 class="font-bold mb-2">Pre-Pour Checklist</h4>
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50">
                                    <tr>
                                        <th class="p-2 text-left">Item</th>
                                        <th class="p-2 text-left">Check Required</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y">
                                    <tr>
                                        <td class="p-2 font-medium">Props</td>
                                        <td class="p-2">Plumb (perfectly vertical) and pins secure.</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2 font-medium">Bracing</td>
                                        <td class="p-2">Diagonal lacing installed to prevent lateral sway.</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2 font-medium">Cleanliness</td>
                                        <td class="p-2">All sawdust, tie wire, and debris blown out before pouring.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `
            },
            {
                id: "tcarp2-slab-quiz",
                title: "Suspended Formwork Assessment",
                type: "quiz",
                duration: "15 min",
                isCompleted: false,
                content: `
                    {
                        "questions": [
                            {
                                "id": "q1",
                                "question": "In suspended slab formwork, what rests directly on top of the Acrow props?",
                                "options": [
                                    "The concrete",
                                    "The Form Ply",
                                    "The Joists (Secondary Bearers)",
                                    "The Primary Bearers"
                                ],
                                "correctAnswer": 3,
                                "explanation": "The structural hierarchy from top to bottom is: Concrete -> Form Ply -> Joists -> Bearers -> Props."
                            },
                            {
                                "id": "q2",
                                "question": "Why must Acrow props be 'plumb'?",
                                "options": [
                                    "So they look straight",
                                    "To ensure they can carry their maximum rated safe working load",
                                    "To make them easier to remove later",
                                    "To allow for plumbing pipes to run alongside them"
                                ],
                                "correctAnswer": 1,
                                "explanation": "A prop that is out of plumb (leaning) loses a massive amount of its load-bearing capacity and can easily buckle under the weight of wet concrete."
                            },
                            {
                                "id": "q3",
                                "question": "What is the purpose of diagonal lacing/bracing on suspended formwork props?",
                                "options": [
                                    "To hang tools from",
                                    "To provide a scaffold for workers to walk on",
                                    "To prevent the entire support structure from swaying or collapsing laterally during the pour",
                                    "It is only required for aesthetic reasons"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Diagonal bracing ties the props together into a rigid structure, preventing a catastrophic domino-effect collapse."
                            },
                            {
                                "id": "q4",
                                "question": "Why is 'Cleanliness' a critical step on the pre-pour checklist?",
                                "options": [
                                    "Because the foreman likes a tidy site",
                                    "To recover lost tools",
                                    "Sawdust and debris trapped in the formwork will cause weak spots and defects in the final concrete structure",
                                    "So the concrete sets faster"
                                ],
                                "correctAnswer": 2,
                                "explanation": "Debris (like sawdust, tie wire, or trash) embedded in the concrete reduces its structural integrity and leaves ugly surface voids."
                            }
                        ]
                    }
                `
            },
            { id: "tcarp2-l3", title: "Formwork Quiz", type: "quiz", duration: "30 min", isCompleted: false }
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
          { id: "tcarp3-final", title: "Common Questions asked in Skills Assessments", type: "quiz", duration: "90 min", isCompleted: false }
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
            quizId: "pte-grammar-quiz",
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
            quizId: "pte-grammar-quiz",
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
            quizId: "pte-grammar-quiz",
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
            quizId: "pte-m1-quiz",
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/uNGb7bDtdW0",
            content: "<h3>Read Aloud Tips</h3><ul><li>Speak at a natural pace.</li><li>Do not correct yourself if you make a mistake; keep going.</li><li>Pause slightly at punctuation marks.</li></ul>"
          },
          { 
            id: "pte-m1-l2", 
            title: "Technique: Repeat Sentence", 
            type: "reading", 
            duration: "25 min", 
            quizId: "pte-m1-quiz",
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
             quizId: "pte-m1-quiz",
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
            quizId: "pte-m1-quiz",
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
            quizId: "pte-m1-quiz",
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/-TWLcLqfC6Y"
          },
          { 
            id: "pte-m2-l6-rts", 
            title: "Respond to a Situation", 
            type: "video", 
            duration: "15 min", 
            quizId: "pte-m1-quiz",
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/YoV25DFFADs"
          },
          { 
            id: "pte-m2-l7-rl", 
            title: "Retell Lecture", 
            type: "video", 
            duration: "15 min", 
            quizId: "pte-m1-quiz",
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
             quizId: "pte-m2-quiz",
             isCompleted: false,
             videoUrl: "https://www.youtube.com/embed/bhUr3gGMmi4" 
           },
           { 
             id: "pte-m2-l2", 
             title: "Fill in the Blanks (Reading & Writing)", 
             type: "reading", 
             duration: "30 min", 
             quizId: "pte-m2-quiz",
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
            quizId: "pte-m3-quiz",
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
            quizId: "pte-m3-quiz",
            isCompleted: false,
            content: "<!-- SWT Practice Lab -->"
          },
          { 
            id: "pte-m3-l2",  
            title: "Summarize Spoken Text & Retell Lecture", 
            type: "reading", 
            duration: "25 min", 
            quizId: "pte-m3-quiz",
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
             quizId: "pte-listening-quiz",
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
            quizId: "pte-listening-quiz",
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/m1c3X4YtexI"
          },
          { 
            id: "pte-m3-l4", 
            title: "Listening: Select Missing Word", 
            type: "video", 
            duration: "15 min", 
            quizId: "pte-listening-quiz",
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/uZx4fpHT_Dw"
          },
          { 
            id: "pte-m3-l5", 
            title: "Listening: Highlight Incorrect Words", 
            type: "video", 
            duration: "15 min", 
            quizId: "pte-listening-quiz",
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/1xraH11zCBI"
          },
          { 
            id: "pte-m3-l6", 
            title: "Listening: Fill in the Blanks", 
            type: "video", 
            duration: "15 min", 
            quizId: "pte-listening-quiz",
            isCompleted: false,
            videoUrl: "https://www.youtube.com/embed/UIrtM-hSJcA"
          },
          { 
            id: "pte-m3-l7", 
            title: "Writing: Write from Dictation", 
            type: "video", 
            duration: "15 min", 
            quizId: "pte-listening-quiz",
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
    id: "mock-mechanics-tra",
    title: "TRA Mock Test: Automotive Mechanic (Q&A)",
    category: "Mock Test",
    level: "Medium",
    examType: "TRA",
    industry: "Automotive",
    description: "Trade Recognition Australia-style interview questions and model answers for automotive workshops.",
    thumbnail: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80",
    totalModules: 1,
    completedModules: 0,
    modules: [
      {
        id: "mock-tra-mech-m1",
        title: "TRA Q&A Set 1",
        description: "Practice common TRA-style technical interview questions for automotive mechanics.",
        status: "unlocked",
        progress: 0,
        lessons: [
          {
            id: "mock-tra-mech-intro",
            title: "How the TRA Q&A Works",
            type: "reading",
            duration: "10 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <div class="bg-slate-900 text-white p-8 rounded-xl shadow-xl">
                  <h1 class="text-3xl font-bold mb-2">TRA Mock Test (Automotive): Q&A Format</h1>
                  <p class="text-slate-300">This module simulates the kind of questions you may be asked in a TRA assessment or technical interview. Focus on: (1) safe process, (2) correct tools, (3) correct measurements/specs, (4) clear communication.</p>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 class="font-bold text-slate-900 mb-2">What assessors look for</h3>
                    <ul class="list-disc ml-5 space-y-2 text-slate-700">
                      <li>Safety-first thinking (isolation, PPE, hazards)</li>
                      <li>Correct diagnostic sequence</li>
                      <li>Trade vocabulary (parts, systems, tools)</li>
                      <li>Quality checks + documentation</li>
                    </ul>
                  </div>
                  <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 class="font-bold text-indigo-900 mb-2">How to answer</h3>
                    <ol class="list-decimal ml-5 space-y-2 text-indigo-900/90">
                      <li>Repeat the task briefly (confirm understanding)</li>
                      <li>List the tools + safety controls</li>
                      <li>Give a step-by-step process</li>
                      <li>Finish with checks and sign-off</li>
                    </ol>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: "mock-tra-mech-q1",
            title: "Q1: Diagnose an Engine Misfire",
            type: "reading",
            duration: "12 min",
            isCompleted: false,
            quizId: "mock-tra-mech-quiz",
            content: `
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 class="text-2xl font-extrabold text-slate-900">Question</h3>
                  <p class="text-slate-700 mt-2">A customer reports a rough idle and the check engine light is on. Explain how you would diagnose an engine misfire.</p>
                </div>

                <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                  <h4 class="font-bold text-emerald-900 mb-2">Model Answer (Structure)</h4>
                  <ol class="list-decimal ml-5 space-y-2 text-emerald-900/90">
                    <li><strong>Safety + Confirm:</strong> Confirm symptoms, check for warning messages, ensure vehicle is secure.</li>
                    <li><strong>Scan Tool:</strong> Read DTCs, freeze frame data, misfire counters (e.g., P030X).</li>
                    <li><strong>Visual Checks:</strong> Inspect ignition leads/coils, vacuum leaks, intake hose, obvious wiring issues.</li>
                    <li><strong>Ignition Test:</strong> Swap coil/plug between cylinders to see if misfire follows.</li>
                    <li><strong>Fuel Test:</strong> Check injector pulse, fuel pressure, injector balance if required.</li>
                    <li><strong>Mechanical:</strong> Compression test / leak-down test if ignition/fuel are OK.</li>
                    <li><strong>Confirm Fix:</strong> Repair, clear codes, road test, recheck live data.</li>
                  </ol>
                </div>

                <div class="bg-amber-50 p-5 rounded-xl border border-amber-200">
                  <h4 class="font-bold text-amber-900 mb-2">Aussie workshop phrases you might hear</h4>
                  <ul class="list-disc ml-5 space-y-1 text-amber-900/90">
                    <li>"Chuck it on the scanner" (connect scan tool)</li>
                    <li>"Give it a quick squiz" (have a look)</li>
                    <li>"Take it for a run" (road test)</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            id: "mock-tra-mech-q2",
            title: "Q2: Brake Pad Replacement + Safety Check",
            type: "reading",
            duration: "12 min",
            isCompleted: false,
            quizId: "mock-tra-mech-quiz",
            content: `
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 class="text-2xl font-extrabold text-slate-900">Question</h3>
                  <p class="text-slate-700 mt-2">Explain the steps to replace front brake pads and the checks you must do before handing the vehicle back.</p>
                </div>

                <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                  <h4 class="font-bold text-emerald-900 mb-2">Model Answer (Step-by-step)</h4>
                  <ol class="list-decimal ml-5 space-y-2 text-emerald-900/90">
                    <li><strong>Safety:</strong> PPE, chock wheels, jack + stands, confirm correct lifting points.</li>
                    <li><strong>Remove wheel:</strong> Inspect rotor condition + thickness.</li>
                    <li><strong>Caliper:</strong> Remove caliper bolts, support caliper (don’t hang on hose).</li>
                    <li><strong>Pads:</strong> Remove pads, clean bracket, check sliders, apply correct grease.</li>
                    <li><strong>Piston:</strong> Retract piston with tool, watch brake fluid level.</li>
                    <li><strong>Fit new pads:</strong> Refit, torque bolts to spec, refit wheel, torque wheel nuts.</li>
                    <li><strong>Checks:</strong> Pump brake pedal, check fluid, road test, verify no noise/pull/vibration.</li>
                  </ol>
                </div>
              </div>
            `
          },
          {
            id: "mock-tra-mech-diagram-q",
            title: "Diagram Assessment: Braking System",
            type: "reading",
            duration: "20 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                <div class="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
                  <h3 class="text-2xl font-extrabold text-slate-900 mb-6 border-b pb-4">Technical Assessment Questions Based on the Diagram</h3>
                  
                  <div class="bg-slate-50 p-4 rounded-xl mb-8 flex justify-center border border-slate-200">
                    <img src="/assets/brake-diagram.png" alt="Automotive Braking System Diagram" class="max-w-full h-auto rounded-lg shadow-sm" style="max-height: 500px; object-fit: contain;" />
                  </div>
                  
                  <div class="space-y-10">
                    <!-- Section 1 -->
                    <div class="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
                      <h4 class="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <span class="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
                        Component Identification & Function
                      </h4>
                      <ol class="list-decimal ml-6 space-y-3 text-slate-700 marker:text-indigo-600 marker:font-medium">
                        <li>Point to the master cylinder and explain its function in generating hydraulic pressure.</li>
                        <li>What does the combination valve do? Describe the role of each part (proportioning, metering, residual functions).</li>
                        <li>Explain the purpose of a residual valve. Why is residual pressure sometimes needed?</li>
                        <li>Identify the metering valve. What braking condition does it control and why?</li>
                        <li>Point out the proportioning valve. How does it prevent rear-wheel lockup?</li>
                        <li>What is the function of the flex lines shown? Why can't rigid lines be used at wheel ends?</li>
                        <li>Describe the purpose of the "T" fitting on the rear circuit.</li>
                        <li>Identify where the system provides front vs. rear bias, based on the diagram.</li>
                      </ol>
                    </div>

                    <!-- Section 2 -->
                    <div class="bg-sky-50/50 p-5 rounded-xl border border-sky-100">
                      <h4 class="text-xl font-bold text-sky-900 mb-4 flex items-center gap-2">
                        <span class="bg-sky-100 text-sky-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
                        Hydraulic Principles
                      </h4>
                      <ol class="list-decimal ml-6 space-y-3 text-slate-700 marker:text-sky-600 marker:font-medium">
                        <li>Explain why hydraulic braking systems use incompressible fluid and how force multiplication occurs.</li>
                        <li>Using the diagram, describe how pressure is distributed from the master cylinder to the wheels.</li>
                        <li>What would happen if air entered the lines shown in the diagram?</li>
                        <li>Why are valves placed at different points in the system—what hydraulic conditions require their placement?</li>
                      </ol>
                    </div>

                    <!-- Section 3 -->
                    <div class="bg-amber-50/50 p-5 rounded-xl border border-amber-100">
                      <h4 class="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <span class="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span> 
                        Diagnostic Thinking
                      </h4>
                      <ol class="list-decimal ml-6 space-y-3 text-slate-700 marker:text-amber-600 marker:font-medium">
                        <li>If the front brakes engage too early compared to the rear, which valve(s) on the diagram are likely involved and why?</li>
                        <li>If the rear wheels lock during hard braking, what component(s) should be inspected first?</li>
                        <li>If the pedal sinks slowly to the floor, which part shown might be faulty?</li>
                        <li>If a flex line collapses internally, what symptoms might appear in the corresponding wheel shown in the diagram?</li>
                        <li>If one rear wheel brakes harder than the other, how would you use the diagram to trace the possible restriction?</li>
                        <li>If the vehicle pulls to one side during braking, how would you narrow down the cause using the illustrated components?</li>
                      </ol>
                    </div>

                    <!-- Section 4 -->
                    <div class="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                      <h4 class="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <span class="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span> 
                        System Behavior & Safety
                      </h4>
                      <ol class="list-decimal ml-6 space-y-3 text-slate-700 marker:text-emerald-600 marker:font-medium">
                        <li>Explain the importance of keeping brake fluid clean given the components shown.</li>
                        <li>What type of brake system layout is shown (front–rear split or diagonal split)? Explain your reasoning.</li>
                        <li>Why must braking systems include flexible hoses at wheel ends? What would happen if these were rigid?</li>
                        <li>Explain how heat affects the components in the diagram, especially the fluid and flexible lines.</li>
                      </ol>
                    </div>

                    <!-- Section 5 -->
                    <div class="bg-rose-50/50 p-5 rounded-xl border border-rose-100">
                      <h4 class="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                        <span class="bg-rose-100 text-rose-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span> 
                        Applied Real World Scenarios
                      </h4>
                      <ol class="list-decimal ml-6 space-y-3 text-slate-700 marker:text-rose-600 marker:font-medium">
                        <li>If upgrading to disc brakes on all four wheels, which of the valves in the diagram might need modification or removal?</li>
                        <li>If the combination valve is stuck, how would braking behavior change at the wheels shown?</li>
                        <li>What symptoms would appear if the master cylinder internal seals failed?</li>
                        <li>If there is a leak in the rear circuit at the "T" fitting, what pedal feel and braking results would you expect?</li>
                      </ol>
                    </div>

                    <!-- Section 6 -->
                    <div class="bg-fuchsia-50/50 p-5 rounded-xl border border-fuchsia-100">
                      <h4 class="text-xl font-bold text-fuchsia-900 mb-4 flex items-center gap-2">
                        <span class="bg-fuchsia-100 text-fuchsia-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span> 
                        Advanced Questions <span class="text-sm font-normal text-fuchsia-700 ml-2">(for highly skilled candidates)</span>
                      </h4>
                      <ol class="list-decimal ml-6 space-y-3 text-slate-700 marker:text-fuchsia-600 marker:font-medium">
                        <li>Explain how the metering valve affects front disc brake timing compared to rear brakes.</li>
                        <li>Discuss how proportioning changes with vehicle load and how an adjustable proportioning valve (like the one shown) is tuned.</li>
                        <li>If ABS were added to this system, where would the modulator likely be inserted based on the layout?</li>
                        <li>Explain how pedal force translates to clamping force at the calipers shown using Pascal's Principle.</li>
                      </ol>
                    </div>
                    
                    <div class="bg-slate-100 p-4 rounded-xl text-center">
                      <p class="text-slate-600 font-medium">Need the answer key? Consult your assigned TRA Assessor or Instructor.</p>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: "mock-welding-tra",
    title: "TRA Mock Test: Welder / Fabricator (Q&A)",
    category: "Mock Test",
    level: "Medium",
    examType: "TRA",
    industry: "Welding",
    description: "TRA-style technical interview questions for welders: procedure, safety, and quality control.",
    thumbnail: "https://images.unsplash.com/photo-1518882570151-157128e78fa1?w=800&q=80",
    totalModules: 1,
    completedModules: 0,
    modules: [
      {
        id: "mock-tra-weld-m1",
        title: "TRA Q&A Set 1",
        description: "Common welding workshop assessment questions.",
        status: "unlocked",
        progress: 0,
        lessons: [
          {
            id: "mock-tra-weld-q1",
            title: "Q1: Explain a Weld Procedure (SMAW)",
            type: "reading",
            duration: "12 min",
            isCompleted: false,
            quizId: "mock-tra-weld-quiz",
            content: `
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 class="text-2xl font-extrabold text-slate-900">Question</h3>
                  <p class="text-slate-700 mt-2">You need to weld mild steel plate using SMAW. Explain how you would select electrodes and set up safely.</p>
                </div>

                <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                  <h4 class="font-bold text-emerald-900 mb-2">Model Answer</h4>
                  <ul class="list-disc ml-5 space-y-2 text-emerald-900/90">
                    <li>Select electrode type (e.g., E6010 for penetration, E7018 for low-hydrogen structural).</li>
                    <li>Check WPS if available: amps range, polarity, travel speed.</li>
                    <li>Prep joint: clean rust/oil, correct bevel, fit-up and tack weld.</li>
                    <li>Safety: PPE, fume extraction, fire watch, check leads/earth clamp.</li>
                    <li>Quality: correct weave, slag removal between passes, visual inspection for undercut/porosity.</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            id: "mock-tra-weld-q2",
            title: "Q2: Control Distortion",
            type: "reading",
            duration: "10 min",
            isCompleted: false,
            quizId: "mock-tra-weld-quiz",
            content: `
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 class="text-2xl font-extrabold text-slate-900">Question</h3>
                  <p class="text-slate-700 mt-2">During fabrication, a frame is warping after welding. What steps can you take to reduce distortion?</p>
                </div>

                <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                  <h4 class="font-bold text-emerald-900 mb-2">Model Answer</h4>
                  <ol class="list-decimal ml-5 space-y-2 text-emerald-900/90">
                    <li>Use correct tack sequence and strong tacks.</li>
                    <li>Clamp and fixture the workpiece.</li>
                    <li>Back-step or skip weld to spread heat.</li>
                    <li>Alternate sides and balance welds.</li>
                    <li>Control heat input (amps, speed) and allow cooling.</li>
                  </ol>
                </div>
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: "mock-construction-tra",
    title: "TRA Mock Test: Construction (Q&A)",
    category: "Mock Test",
    level: "Medium",
    examType: "TRA",
    industry: "Construction",
    description: "TRA-style Q&A for construction sites: safety, set-out, and practical workflow communication.",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    totalModules: 1,
    completedModules: 0,
    modules: [
      {
        id: "mock-tra-cons-m1",
        title: "TRA Q&A Set 1",
        description: "Construction site interview questions with model answers.",
        status: "unlocked",
        progress: 0,
        lessons: [
          {
            id: "mock-tra-cons-q1",
            title: "Q1: Set-Out and Levels",
            type: "reading",
            duration: "12 min",
            isCompleted: false,
            quizId: "mock-tra-cons-quiz",
            content: `
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 class="text-2xl font-extrabold text-slate-900">Question</h3>
                  <p class="text-slate-700 mt-2">Explain how you would set out a small slab area on site and confirm levels before the pour.</p>
                </div>

                <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                  <h4 class="font-bold text-emerald-900 mb-2">Model Answer</h4>
                  <ol class="list-decimal ml-5 space-y-2 text-emerald-900/90">
                    <li>Review drawings, confirm dimensions and datum point.</li>
                    <li>Mark corners with pegs/string lines, check diagonals for square.</li>
                    <li>Use a laser level/dumpy level to transfer heights.</li>
                    <li>Confirm formwork height, allow for fall/drainage if required.</li>
                    <li>Before pour: confirm reinforcement, mesh chairs, penetrations, and access.</li>
                  </ol>
                </div>
              </div>
            `
          },
          {
            id: "mock-tra-cons-q2",
            title: "Q2: Toolbox Talk + Hazard Controls",
            type: "reading",
            duration: "10 min",
            isCompleted: false,
            quizId: "mock-tra-cons-quiz",
            content: `
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 class="text-2xl font-extrabold text-slate-900">Question</h3>
                  <p class="text-slate-700 mt-2">What is a toolbox talk, and what hazard controls would you cover before starting work near moving plant?</p>
                </div>

                <div class="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                  <h4 class="font-bold text-emerald-900 mb-2">Model Answer</h4>
                  <ul class="list-disc ml-5 space-y-2 text-emerald-900/90">
                    <li>A short pre-start safety briefing about today's tasks and hazards.</li>
                    <li>Controls: exclusion zones, spotter, hi-vis PPE, communication signals, plant inspection.</li>
                    <li>Emergency procedures and first aid location.</li>
                    <li>Stop-work authority if conditions change.</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      }
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
  },
  {
    id: "computer-essentials",
    title: "Computer Essentials",
    category: "Communication",
    level: "Easy",
    description: "Master the basics of computing: from using a mouse and keyboard to navigating the web and staying safe online.",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    totalModules: 6,
    completedModules: 0,
    modules: [
      {
        id: "comp-m1",
        title: "Module 1: The 'Digital Hand' (Mouse & Touchpad)",
        description: "Everything in modern computing starts with navigation. Learn how to control the cursor effectively.",
        status: "unlocked",
        progress: 0,
        lessons: [
          {
            id: "comp-l1",
            title: "Mouse & Touchpad Basics",
            type: "reading",
            duration: "15 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-blue-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">The "Digital Hand"</h1>
                   <p class="text-blue-200 text-lg">Everything in modern computing starts with navigation.</p>
                </div>
                
                <div class="bg-slate-100 p-4 rounded-xl border border-slate-200 flex justify-center">
                  <div class="aspect-video w-full max-w-2xl bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white z-20 group-hover:scale-110 transition-transform"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    <div class="absolute bottom-4 left-4 z-20 text-white font-medium text-sm drop-shadow-md">Video: Introduction to the Mouse (3:45)</div>
                  </div>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                   <div class="bg-white p-6 rounded-lg border shadow-sm">
                      <h3 class="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/><path d="M12 22v-4"/></svg> The Grip & Cursor</h3>
                      <p class="text-slate-600 mb-3"><strong>The Grip:</strong> Proper hand placement is crucial to avoid fatigue. Rest your palm gently on the desk, with your index finger lightly touching the left button.</p>
                      <p class="text-slate-600"><strong>The Cursor:</strong> Understanding how movement on the desk translates to movement on the screen. The small arrow on your screen follows your hand's exact movements.</p>
                   </div>
                   
                   <div class="bg-white p-6 rounded-lg border shadow-sm">
                      <h3 class="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> The "Three Clicks"</h3>
                      <ul class="space-y-3 text-slate-600">
                        <li><strong class="text-slate-800">Single Left-Click:</strong> To select an item or activate a button.</li>
                        <li><strong class="text-slate-800">Double Left-Click:</strong> Two quick clicks to open folders or start programs.</li>
                        <li><strong class="text-slate-800">Right-Click:</strong> To see "The Secret Menu" (Options for the selected item).</li>
                      </ul>
                   </div>
                   
                   <div class="bg-white p-6 rounded-lg border shadow-sm md:col-span-2">
                      <h3 class="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> Drag & Drop</h3>
                      <p class="text-slate-600">Holding the left button down while moving the mouse allows you to move items across the screen—a crucial skill for organizing files into folders.</p>
                      
                      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 class="font-bold text-blue-900 mb-2">Practice Exercise</h4>
                        <p class="text-sm text-blue-800 mb-4">Click and hold the block below, then drag it into the target area.</p>
                        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
                          <div class="w-24 h-24 bg-blue-500 rounded flex items-center justify-center text-white font-bold cursor-grab active:cursor-grabbing shadow-md hover:scale-105 transition-transform">Drag Me</div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-300 hidden sm:block"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          <div class="w-32 h-32 border-4 border-dashed border-blue-300 rounded flex items-center justify-center text-blue-400 font-medium">Drop Here</div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: "comp-m2",
        title: "Module 2: The Keyboard Safari",
        description: "Instead of teaching every key, focus on the 'Action Keys' that do the most work.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "comp-l2",
            title: "Essential Keys",
            type: "reading",
            duration: "15 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">The Keyboard Safari</h1>
                   <p class="text-indigo-200 text-lg">Master the action keys that do the most work.</p>
                </div>
                
                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                  <div>
                    <h3 class="font-bold text-2xl text-slate-800 mb-4">Home Row</h3>
                    <p class="text-slate-600 mb-4">Find the "bumps" on the <strong>F</strong> and <strong>J</strong> keys to orient your hands without looking. This is where your index fingers should rest.</p>
                    <div class="flex justify-center my-6">
                       <div class="bg-slate-100 p-4 rounded-xl border shadow-inner flex gap-2 overflow-x-auto w-full max-w-lg justify-center">
                          <div class="w-12 h-12 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-400">A</div>
                          <div class="w-12 h-12 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-400">S</div>
                          <div class="w-12 h-12 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-400">D</div>
                          <div class="w-12 h-12 bg-white border-b-4 border-indigo-400 shadow-md rounded flex flex-col items-center justify-center font-bold text-indigo-700 relative">
                            F
                            <div class="w-3 h-1 bg-indigo-300 rounded-full mt-1"></div>
                          </div>
                          <div class="w-8 h-12"></div>
                          <div class="w-12 h-12 bg-white border-b-4 border-indigo-400 shadow-md rounded flex flex-col items-center justify-center font-bold text-indigo-700 relative">
                            J
                            <div class="w-3 h-1 bg-indigo-300 rounded-full mt-1"></div>
                          </div>
                          <div class="w-12 h-12 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-400">K</div>
                          <div class="w-12 h-12 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-400">L</div>
                          <div class="w-12 h-12 bg-white border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-400">;</div>
                       </div>
                    </div>
                  </div>

                  <div class="grid sm:grid-cols-2 gap-6">
                    <div class="bg-slate-50 p-5 rounded-lg border">
                      <h4 class="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2"><div class="px-2 py-1 bg-white border rounded text-xs shadow-sm">Enter ↵</div> The Confirmer</h4>
                      <p class="text-slate-600 text-sm">The Enter (or Return) key is used to confirm an action, start a new line in a document, or send a message.</p>
                    </div>
                    
                    <div class="bg-slate-50 p-5 rounded-lg border">
                      <h4 class="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2"><div class="px-2 py-1 bg-white border rounded text-xs shadow-sm">Backspace ⌫</div> The Eraser</h4>
                      <p class="text-slate-600 text-sm">Used to delete text to the left of your cursor. The Delete key removes text to the right.</p>
                    </div>
                    
                    <div class="bg-slate-50 p-5 rounded-lg border">
                      <h4 class="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2"><div class="px-2 py-1 bg-white border rounded text-xs shadow-sm">Shift ⇧</div> The Modifier</h4>
                      <p class="text-slate-600 text-sm">Hold Shift while pressing a letter to capitalize it. For long strings of capital letters, use <strong>Caps Lock</strong> instead.</p>
                    </div>
                    
                    <div class="bg-rose-50 p-5 rounded-lg border border-rose-100">
                      <h4 class="font-bold text-lg text-rose-800 mb-2 flex items-center gap-2"><div class="px-2 py-1 bg-white border border-rose-200 text-rose-600 rounded text-xs shadow-sm">Esc</div> The Panic Button</h4>
                      <p class="text-rose-700 text-sm">The Escape key is your "get me out of here" button. Use it to close unwanted pop-ups, cancel menus, or exit full-screen mode.</p>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: "comp-m3",
        title: "Module 3: Windows and the Desktop",
        description: "Teaching them how to organize their 'Digital Desk'.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "comp-l3",
            title: "Navigating Your Digital Desk",
            type: "reading",
            duration: "20 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-teal-900 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Windows and the Desktop</h1>
                   <p class="text-teal-200 text-lg">Learn how to organize your "Digital Desk".</p>
                </div>
                
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 class="font-bold text-2xl text-slate-800 mb-4">The Start Menu & Taskbar</h3>
                   <p class="text-slate-600 mb-6">The Taskbar is the bar at the bottom of your screen. It shows you what programs are currently open. The Start Menu (usually the logo at the far left) is where all your programs live.</p>
                   
                   <div class="bg-slate-800 p-2 rounded-lg flex items-center justify-between shadow-inner">
                     <div class="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white cursor-pointer hover:bg-blue-400 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M14 14h6v6h-6z"/></svg>
                     </div>
                     <div class="flex gap-2">
                       <div class="w-10 h-10 bg-slate-600 rounded border-b-2 border-white flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-300"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg></div>
                       <div class="w-10 h-10 bg-slate-700 rounded flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg></div>
                       <div class="w-10 h-10 bg-slate-700 rounded flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                     </div>
                     <div class="text-white text-xs font-mono pr-2">12:00 PM</div>
                   </div>
                </div>

                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 class="font-bold text-2xl text-slate-800 mb-6">Window Controls</h3>
                   
                   <div class="border rounded-lg overflow-hidden mb-6 shadow-md max-w-2xl mx-auto">
                     <div class="bg-slate-200 px-4 py-2 flex justify-between items-center border-b">
                       <span class="text-sm font-medium text-slate-600">Sample Program</span>
                       <div class="flex gap-2">
                         <div class="w-8 h-8 bg-white hover:bg-slate-300 rounded flex items-center justify-center cursor-pointer transition-colors group" title="Minimize">
                           <div class="w-3 h-0.5 bg-slate-600 group-hover:bg-slate-900 mt-2"></div>
                         </div>
                         <div class="w-8 h-8 bg-white hover:bg-slate-300 rounded flex items-center justify-center cursor-pointer transition-colors group" title="Maximize">
                           <div class="w-3 h-3 border border-slate-600 group-hover:border-slate-900"></div>
                         </div>
                         <div class="w-8 h-8 bg-white hover:bg-red-500 rounded flex items-center justify-center cursor-pointer transition-colors group" title="Close">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-600 group-hover:text-white"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                         </div>
                       </div>
                     </div>
                     <div class="p-8 bg-white h-32 flex items-center justify-center text-slate-400">
                       Program Content Area
                     </div>
                   </div>
                   
                   <div class="grid grid-cols-3 gap-4">
                     <div class="bg-slate-50 p-4 rounded text-center border">
                       <h4 class="font-bold text-slate-800 mb-1">Minimize (_)</h4>
                       <p class="text-xs text-slate-600">Hides the window to the taskbar without closing it.</p>
                     </div>
                     <div class="bg-slate-50 p-4 rounded text-center border">
                       <h4 class="font-bold text-slate-800 mb-1">Maximize (□)</h4>
                       <p class="text-xs text-slate-600">Expands the window to fill your entire screen.</p>
                     </div>
                     <div class="bg-rose-50 p-4 rounded text-center border border-rose-100">
                       <h4 class="font-bold text-rose-800 mb-1">Close (X)</h4>
                       <p class="text-xs text-rose-700">Completely closes the program.</p>
                     </div>
                   </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: "comp-m4",
        title: "Module 4: Files, Folders, and Saving",
        description: "Knowing where your work went and how to keep it organized.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "comp-l4",
            title: "The Filing Cabinet Metaphor",
            type: "reading",
            duration: "20 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-amber-600 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Files, Folders, and Saving</h1>
                   <p class="text-amber-100 text-lg">Never lose a document again.</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="p-3 bg-amber-100 rounded-lg text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                      </div>
                      <div>
                        <h3 class="font-bold text-xl text-slate-800">Folders</h3>
                        <p class="text-slate-500 text-sm">The Filing Cabinet Drawers</p>
                      </div>
                    </div>
                    <p class="text-slate-600">A folder is a container. Just like a physical drawer in an office, it holds other items but doesn't do anything by itself. Use folders to group related items together (e.g., "Resumes", "Family Photos").</p>
                  </div>
                  
                  <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      </div>
                      <div>
                        <h3 class="font-bold text-xl text-slate-800">Files</h3>
                        <p class="text-slate-500 text-sm">The Documents inside</p>
                      </div>
                    </div>
                    <p class="text-slate-600">A file is an actual item—a document, a photo, a song, or a program. Files must be placed inside folders (even the Desktop is just a special folder!).</p>
                  </div>
                </div>

                <div class="bg-slate-50 p-8 rounded-xl border border-slate-200">
                  <h3 class="font-bold text-2xl text-slate-800 mb-6">"Save As" vs. "Save"</h3>
                  
                  <div class="space-y-4">
                    <div class="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-emerald-500">
                      <div class="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded mt-1 shrink-0">Save As</div>
                      <div>
                        <p class="font-medium text-slate-800">Used for brand new documents</p>
                        <p class="text-slate-600 text-sm mt-1">This asks you two questions: <strong>"What do you want to call this?"</strong> and <strong>"Where do you want to put it?"</strong>. Also use this to make a copy of an existing file with a new name.</p>
                      </div>
                    </div>
                    
                    <div class="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-blue-500">
                      <div class="font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded mt-1 shrink-0">Save (Ctrl+S)</div>
                      <div>
                        <p class="font-medium text-slate-800">Updates an existing document</p>
                        <p class="text-slate-600 text-sm mt-1">If the file already has a name and a location, clicking "Save" simply updates it with your newest changes. It won't ask you any questions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: "comp-m5",
        title: "Module 5: Navigating the Web (The Browser)",
        description: "Your gateway to the internet.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "comp-l5",
            title: "Browser Basics",
            type: "reading",
            duration: "20 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-rose-700 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Navigating the Web</h1>
                   <p class="text-rose-200 text-lg">Master your internet browser.</p>
                </div>
                
                <div class="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <div class="bg-slate-100 border-b p-2 flex items-center gap-2">
                    <div class="flex gap-1.5 px-2">
                      <div class="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div class="flex gap-1 bg-white rounded-t-lg px-3 py-1 text-xs font-medium border border-b-0 border-slate-200 mt-1 relative top-[1px]">
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline mr-1 text-slate-500"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> Tab 1</span>
                      <span class="text-slate-400 hover:text-slate-700 ml-2 cursor-pointer">×</span>
                    </div>
                    <div class="flex gap-1 bg-slate-200 hover:bg-slate-300 rounded-t-lg px-3 py-1 text-xs font-medium mt-1 cursor-pointer">
                      <span>Tab 2</span>
                    </div>
                    <div class="text-slate-500 hover:text-slate-800 cursor-pointer ml-1">+</div>
                  </div>
                  <div class="bg-white p-2 border-b flex items-center gap-2">
                    <div class="flex gap-1">
                      <div class="p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></div>
                      <div class="p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>
                      <div class="p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg></div>
                    </div>
                    <div class="flex-1 bg-slate-100 rounded-full px-4 py-1.5 text-sm text-slate-700 font-mono border border-slate-200">
                      https://www.example.com
                    </div>
                  </div>
                  
                  <div class="p-8 grid sm:grid-cols-2 gap-8 bg-slate-50">
                    <div>
                      <h4 class="font-bold text-slate-800 mb-2">The Address Bar</h4>
                      <p class="text-slate-600 text-sm">Where you type a website name (URL) to go directly to it. If you type a question here, it will usually search Google instead.</p>
                    </div>
                    
                    <div>
                      <h4 class="font-bold text-slate-800 mb-2">Tabs</h4>
                      <p class="text-slate-600 text-sm">How to have multiple pages open at once. Click the '+' to open a new one, or the '×' to close it.</p>
                    </div>
                    
                    <div>
                      <h4 class="font-bold text-slate-800 mb-2">Back and Forward</h4>
                      <p class="text-slate-600 text-sm">The "Undo" buttons of the internet. Click Back (left arrow) to return to the previous page.</p>
                    </div>
                    
                    <div>
                      <h4 class="font-bold text-slate-800 mb-2">Refresh (Reload)</h4>
                      <p class="text-slate-600 text-sm">The circular arrow. Click this if a website isn't loading correctly or seems stuck.</p>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: "comp-m6",
        title: "Module 6: Digital Safety & Hygiene",
        description: "Best practices for staying secure and keeping your computer running smoothly.",
        status: "locked",
        progress: 0,
        lessons: [
          {
            id: "comp-l6",
            title: "Security and Maintenance",
            type: "reading",
            duration: "15 min",
            isCompleted: false,
            content: `
              <div class="space-y-8">
                <div class="bg-emerald-800 text-white p-8 rounded-xl shadow-xl">
                   <h1 class="text-3xl font-bold mb-4">Digital Safety & Hygiene</h1>
                   <p class="text-emerald-200 text-lg">Protect yourself and your computer.</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6">
                  <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h3 class="font-bold text-lg text-slate-800 mb-2">Passwords</h3>
                    <p class="text-slate-600 text-sm">Don't use the same password everywhere. Use a phrase you can remember, like "BlueHorseRunsFast!", rather than a complex word you'll forget.</p>
                  </div>
                  
                  <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 animate-spin" style="animation-duration: 3s;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </div>
                    <h3 class="font-bold text-lg text-slate-800 mb-2">The "Wait" Rule</h3>
                    <p class="text-slate-600 text-sm">When you see a spinning circle or hourglass, the computer is "thinking". Do not click 20 more times—this confuses the computer and might make it crash!</p>
                  </div>
                  
                  <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div class="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" x2="12" y1="2" y2="12"/></svg>
                    </div>
                    <h3 class="font-bold text-lg text-slate-800 mb-2">Shutting Down</h3>
                    <p class="text-slate-600 text-sm">Always use the Start menu to shut down (Start > Power > Shut Down). Don't just hold the physical button or close the laptop lid if you're done for the day.</p>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: "comp-graduation",
            title: "Graduation Activity: Chain Task",
            type: "assignment",
            duration: "30 min",
            isCompleted: false,
            content: `
              <div class="space-y-6">
                 <div class="bg-indigo-900 text-white p-8 rounded-xl shadow-xl text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-800 rounded-full mb-4 border-4 border-indigo-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    </div>
                    <h2 class="text-3xl font-bold mb-2">Graduation Challenge</h2>
                    <p class="text-indigo-200">Prove you've mastered the essentials by completing this real-world task.</p>
                 </div>

                 <div class="bg-white p-8 rounded-xl border-2 border-indigo-100 shadow-sm">
                    <p class="text-lg text-slate-700 mb-6 font-medium">To pass this course, you must complete the following "Chain Task" in your actual computer environment (not in this course viewer).</p>
                    
                    <div class="space-y-4">
                      <div class="flex gap-4 items-start p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">1</div>
                        <div>
                          <h4 class="font-bold text-slate-800 text-lg">Open your Browser</h4>
                          <p class="text-slate-600">Open a new tab in Chrome, Edge, or Safari.</p>
                        </div>
                      </div>
                      
                      <div class="flex gap-4 items-start p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">2</div>
                        <div>
                          <h4 class="font-bold text-slate-800 text-lg">Navigate</h4>
                          <p class="text-slate-600">Type <strong>www.example.com</strong> into the Address Bar and press Enter.</p>
                        </div>
                      </div>
                      
                      <div class="flex gap-4 items-start p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">3</div>
                        <div>
                          <h4 class="font-bold text-slate-800 text-lg">Create a Folder</h4>
                          <p class="text-slate-600">Go to your computer's Desktop. Right-click, select "New Folder", and name it <strong>"My Practice"</strong>.</p>
                        </div>
                      </div>
                      
                      <div class="flex gap-4 items-start p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">4</div>
                        <div>
                          <h4 class="font-bold text-slate-800 text-lg">Download & Organize</h4>
                          <p class="text-slate-600">Save any image from the internet, then drag and drop it into your new "My Practice" folder.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-8 text-center">
                      <button class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-transform hover:scale-105" onclick="alert('Congratulations! You have completed the Computer Essentials course.')">
                        I Have Completed This Task
                      </button>
                    </div>
                 </div>
              </div>
            `
          }
        ]
      }
    ]
  }
];

export const getCourseById = (id: string) => COURSES.find(c => c.id === id);
