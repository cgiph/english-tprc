export type Review = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  overallScore: number;
  scores: {
    speaking: number;
    writing: number;
    reading: number;
    listening: number;
  };
  center: string;
  content: string;
  tags: string[];
  verified: boolean;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  type: "Guide" | "Practice Test" | "Video" | "Tool";
  level: "Beginner" | "Intermediate" | "Advanced";
  author: string;
  downloads: number;
  rating: number;
  image?: string;
  locked?: boolean;
  downloadUrl?: string;
  viewerUrl?: string;
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    date: "Oct 15, 2025",
    overallScore: 82,
    scores: { speaking: 85, writing: 79, reading: 80, listening: 84 },
    center: "Pearson Professional Centers-London Holborn",
    content: "The speaking section was faster than I practiced. Make sure to keep speaking even if you make a small mistake. The microphone quality at Holborn was excellent, heavily noise-cancelled.",
    tags: ["Speaking Tips", "London Center"],
    verified: true
  },
  {
    id: "2",
    author: "Michael O'Connor",
    avatar: "https://i.pravatar.cc/150?u=michael",
    date: "Nov 02, 2025",
    overallScore: 76,
    scores: { speaking: 72, writing: 75, reading: 78, listening: 79 },
    center: "Manchester Media City",
    content: "Writing essay topic was about 'Remote Work'. A very standard topic. I used the template from this site and it worked perfectly. Remember to manage your time in the reading section!",
    tags: ["Writing Template", "Time Management"],
    verified: true
  },
  {
    id: "3",
    author: "Priya Patel",
    avatar: "https://i.pravatar.cc/150?u=priya",
    date: "Nov 10, 2025",
    overallScore: 90,
    scores: { speaking: 90, writing: 90, reading: 90, listening: 90 },
    center: "Birmingham PPC",
    content: "Achieved a perfect 90! My strategy was consistent practice with mock tests. Don't underestimate Describe Image - it's a high scoring task. The staff at Birmingham were very supportive.",
    tags: ["Perfect Score", "Success Story"],
    verified: true
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Ultimate Writing Guide 2026",
    description: "A comprehensive guide for the 'Write Essay' task. Includes templates and outlines for A1-B1 levels.",
    type: "Guide",
    level: "Intermediate",
    author: "PrepUK Team",
    downloads: 12500,
    rating: 4.9,
    locked: true,
    downloadUrl: "/downloads/USEFUL_GUIDE_FOR_ESSAY_WRITING.txt",
    viewerUrl: "/resources/viewer?id=1"
  },
  {
    id: "2",
    title: "A Guide to Speaking Fluently",
    description: "A practical and easy-to-use tool designed to help students confidently pass their English speaking tests.",
    type: "Practice Test",
    level: "Advanced",
    author: "Dr. A. Smith",
    downloads: 8200,
    rating: 4.7,
    locked: true,
    downloadUrl: "/downloads/DESCRIBE_IMAGE_50_CHARTS.txt",
    viewerUrl: "/resources/viewer?id=2"
  },
  {
    id: "3",
    title: "Repeat Sentence & Write From Dictation Audio Trainer",
    description: "Interactive audio tool for short-term memory, accent familiarization, and simultaneous typing practice.",
    type: "Tool",
    level: "Beginner",
    author: "TechPrep",
    downloads: 5400,
    rating: 4.5,
    locked: true,
    viewerUrl: "/resources/audio-trainer"
  },
  {
    id: "4",
    title: "Full Mock Test - PTE Academic",
    description: "Complete 2-hour simulation of the actual exam including Speaking, Writing, Reading, and Listening.",
    type: "Practice Test",
    level: "Intermediate",
    author: "PrepUK Team",
    downloads: 3100,
    rating: 4.8,
    locked: true,
    viewerUrl: "/resources/full-mock-test"
  }
];