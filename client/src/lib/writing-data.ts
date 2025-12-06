export type WritingTaskType = "Summarize Written Text" | "Write Essay";

export interface WritingQuestion {
  id: string;
  title: string;
  content: string; // The text to summarize or the essay prompt
  type: WritingTaskType;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number; // seconds
  minWords?: number;
  maxWords?: number;
  keywords?: string[]; // For basic checking
}

export const WRITING_QUESTIONS: Record<WritingTaskType, WritingQuestion[]> = {
  "Summarize Written Text": [
    {
      id: "swt-1",
      title: "The Importance of Sleep",
      type: "Summarize Written Text",
      difficulty: "Easy",
      timeLimit: 600,
      minWords: 5,
      maxWords: 75,
      content: "Sleep is essential for health and well-being. It allows the body to repair itself and the brain to consolidate memories. Lack of sleep can lead to various health problems, including heart disease, kidney disease, high blood pressure, diabetes, and stroke. Getting enough quality sleep at the right times can help protect your mental health, physical health, quality of life, and safety. Therefore, it is important to prioritize sleep in our daily lives."
    },
    {
      id: "swt-2",
      title: "Benefits of Reading",
      type: "Summarize Written Text",
      difficulty: "Easy",
      timeLimit: 600,
      minWords: 5,
      maxWords: 75,
      content: "Reading is a fundamental skill that provides numerous benefits. It improves vocabulary and language skills, stimulates the mind, and reduces stress. Whether reading fiction or non-fiction, people gain knowledge and empathy by exploring different perspectives. In today's digital age, while the medium may change from paper to screens, the value of reading remains undiminished as a key driver of personal growth and education."
    },
    {
      id: "swt-3",
      title: "Climate Change Impact",
      type: "Summarize Written Text",
      difficulty: "Medium",
      timeLimit: 600,
      minWords: 5,
      maxWords: 75,
      content: "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas. Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. Examples of greenhouse gas emissions that are causing climate change include carbon dioxide and methane."
    },
    {
      id: "swt-4",
      title: "The Role of Artificial Intelligence",
      type: "Summarize Written Text",
      difficulty: "Medium",
      timeLimit: 600,
      minWords: 5,
      maxWords: 75,
      content: "Artificial Intelligence (AI) is rapidly transforming various sectors of society. From healthcare diagnostics to autonomous vehicles, AI offers solutions that can increase efficiency and accuracy. However, the rise of AI also raises ethical concerns regarding privacy, job displacement, and decision-making transparency. As AI technology continues to evolve, balancing innovation with regulation becomes crucial to ensure that these advancements benefit humanity as a whole without causing unintended harm."
    },
    {
      id: "swt-5",
      title: "Urbanization Challenges",
      type: "Summarize Written Text",
      difficulty: "Hard",
      timeLimit: 600,
      minWords: 5,
      maxWords: 75,
      content: "Urbanization, the shift of population from rural to urban areas, is a defining trend of the 21st century. While cities offer economic opportunities and improved infrastructure, rapid urbanization presents significant challenges. These include overcrowding, pollution, inadequate housing, and strain on public services. Sustainable urban planning is therefore essential to mitigate these negative impacts, ensuring that cities remain livable, resilient, and inclusive for their growing populations in the face of environmental and social pressures."
    }
  ],
  "Write Essay": [
    {
      id: "we-1",
      title: "Technology in Education",
      type: "Write Essay",
      difficulty: "Easy",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Computers are being used more and more in education. Do you think this is a positive or negative development? Support your answer with reasons and examples."
    },
    {
      id: "we-2",
      title: "Remote Work",
      type: "Write Essay",
      difficulty: "Easy",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Many companies now allow employees to work from home. Discuss the advantages and disadvantages of this trend."
    },
    {
      id: "we-3",
      title: "Public Transport",
      type: "Write Essay",
      difficulty: "Easy",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Traffic congestion is a major problem in many cities. Should the government discourage the use of private cars and invest more in public transport? Give your opinion."
    },
    {
      id: "we-4",
      title: "Health and Diet",
      type: "Write Essay",
      difficulty: "Medium",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "The rise in obesity is a significant health concern in many countries. Some people believe the government should impose a tax on sugary drinks and junk food. To what extent do you agree or disagree?"
    },
    {
      id: "we-5",
      title: "University Education",
      type: "Write Essay",
      difficulty: "Medium",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Some people think that universities should focus on preparing students for specific careers, while others believe they should provide a broad education. Discuss both views and give your own opinion."
    },
    {
      id: "we-6",
      title: "Social Media Influence",
      type: "Write Essay",
      difficulty: "Medium",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Social media has become a huge part of our daily lives. Does it have more positive or negative effects on society? Support your argument with specific examples."
    },
    {
      id: "we-7",
      title: "Space Exploration",
      type: "Write Essay",
      difficulty: "Medium",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Governments spend billions of dollars on space exploration. Some people believe this money would be better spent on solving problems on Earth. Discuss both sides and give your opinion."
    },
    {
      id: "we-8",
      title: "The Role of Art",
      type: "Write Essay",
      difficulty: "Hard",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Some people argue that the government should fund the arts (music, painting, theater), while others believe that art should be funded by private businesses or individuals. Discuss both views and state your opinion."
    },
    {
      id: "we-9",
      title: "Globalization",
      type: "Write Essay",
      difficulty: "Hard",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "Globalization has led to the mixing of cultures around the world. Some people think this is good, while others fear it leads to the loss of national identities. What is your opinion?"
    },
    {
      id: "we-10",
      title: "Automation and Jobs",
      type: "Write Essay",
      difficulty: "Hard",
      timeLimit: 1200,
      minWords: 200,
      maxWords: 300,
      content: "With the advancement of technology, many jobs are being automated. Do the benefits of automation outweigh the potential negative impact on employment? Use reasons and examples to support your answer."
    }
  ]
};
