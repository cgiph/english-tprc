export type ReadingTaskType = 
  | "Multiple Choice (Multiple)" 
  | "R&W Fill in the Blanks" 
  | "Reorder Paragraphs" 
  | "Multiple Choice (Single)" 
  | "Reading Fill in the Blanks";

export type Difficulty = "Easy" | "Difficult";

export type ReadingQuestion = {
  id: string;
  type: ReadingTaskType;
  difficulty: Difficulty;
  title: string;
  text: string; // The main passage or context
  prompt?: string; // The specific question to answer
  options?: string[]; // For MCQs
  correctAnswer?: string | string[]; // For MCQs
  blanks?: { // For FIB questions
    index: number;
    correct: string;
    options?: string[]; // For Dropdown (R&W FIB)
  }[]; 
  paragraphs?: { // For Reorder Paragraphs
    id: string;
    text: string;
    correctOrder: number;
  }[];
};

export const READING_QUESTIONS: Record<ReadingTaskType, ReadingQuestion[]> = {
  "Multiple Choice (Single)": [
    // EASY (A1/Foundation)
    {
      id: "mcs-1",
      type: "Multiple Choice (Single)",
      difficulty: "Easy",
      title: "Library Rules",
      text: "Students must remain quiet in the library to respect others who are studying. Talking on mobile phones is strictly prohibited.",
      prompt: "What is the main rule mentioned in the text?",
      options: ["Students can talk loudly", "Mobile phones are allowed", "Silence is required", "Eating is encouraged"],
      correctAnswer: "Silence is required"
    },
    {
      id: "mcs-2",
      type: "Multiple Choice (Single)",
      difficulty: "Easy",
      title: "Daily Routine",
      text: "Sarah wakes up at 7 AM every day. She eats breakfast and then catches the bus to the university.",
      prompt: "How does Sarah get to the university?",
      options: ["She drives to university", "She wakes up at 8 AM", "She takes the bus", "She skips breakfast"],
      correctAnswer: "She takes the bus"
    },
    {
      id: "mcs-3",
      type: "Multiple Choice (Single)",
      difficulty: "Easy",
      title: "Weather Forecast",
      text: "Tomorrow will be sunny and warm. It is a perfect day for a picnic in the park.",
      prompt: "What is suggested for tomorrow?",
      options: ["It will rain", "It will be cold", "It is good for a picnic", "Stay indoors"],
      correctAnswer: "It is good for a picnic"
    },
    {
      id: "mcs-4",
      type: "Multiple Choice (Single)",
      difficulty: "Easy",
      title: "Class Schedule",
      text: "The history class starts at 10:00 AM on Mondays. Please do not be late.",
      prompt: "When does the history class start?",
      options: ["Class is on Tuesday", "Class starts at 10:00 AM", "Being late is okay", "It is a math class"],
      correctAnswer: "Class starts at 10:00 AM"
    },
    {
      id: "mcs-5",
      type: "Multiple Choice (Single)",
      difficulty: "Easy",
      title: "Healthy Eating",
      text: "Eating fruits and vegetables keeps you healthy. You should also drink plenty of water.",
      prompt: "According to the text, what helps keep you healthy?",
      options: ["Eat only meat", "Drink soda", "Water is important", "Vegetables are bad"],
      correctAnswer: "Water is important"
    },
    // DIFFICULT (A2/Intermediate)
    {
      id: "mcs-6",
      type: "Multiple Choice (Single)",
      difficulty: "Difficult",
      title: "Climate Change",
      text: "The rapid acceleration of climate change has led to unpredictable weather patterns. Scientists warn that without immediate intervention, the consequences could be irreversible.",
      prompt: "What is the main warning given by scientists?",
      options: ["Weather is becoming more predictable", "Immediate action is unnecessary", "Consequences may be permanent", "Scientists are optimistic"],
      correctAnswer: "Consequences may be permanent"
    },
    {
      id: "mcs-7",
      type: "Multiple Choice (Single)",
      difficulty: "Difficult",
      title: "Economic Policy",
      text: "Inflationary pressures have forced the central bank to raise interest rates. This move is intended to cool down the economy but risks slowing growth.",
      prompt: "What is a potential risk of raising interest rates?",
      options: ["Interest rates were lowered", "The goal is to increase inflation", "Growth might slow down", "The economy is already cool"],
      correctAnswer: "Growth might slow down"
    },
    {
      id: "mcs-8",
      type: "Multiple Choice (Single)",
      difficulty: "Difficult",
      title: "Artificial Intelligence",
      text: "While AI promises efficiency, ethical concerns regarding privacy and bias remain prevalent. Developers must prioritize transparency to build public trust.",
      prompt: "What must developers prioritize to build public trust?",
      options: ["AI has no ethical issues", "Privacy is not a concern", "Transparency builds trust", "Efficiency is the only goal"],
      correctAnswer: "Transparency builds trust"
    },
    {
      id: "mcs-9",
      type: "Multiple Choice (Single)",
      difficulty: "Difficult",
      title: "Space Exploration",
      text: "The colonization of Mars presents numerous physiological challenges, including muscle atrophy due to lower gravity and radiation exposure.",
      prompt: "What is mentioned as a challenge of colonizing Mars?",
      options: ["Mars has high gravity", "Radiation is not a threat", "Muscle atrophy is a risk", "Colonization is easy"],
      correctAnswer: "Muscle atrophy is a risk"
    },
    {
      id: "mcs-10",
      type: "Multiple Choice (Single)",
      difficulty: "Difficult",
      title: "Modern Literature",
      text: "Post-modern literature often deconstructs traditional narrative structures, challenging the reader to question the reliability of the narrator.",
      prompt: "What does post-modern literature challenge the reader to do?",
      options: ["Narratives are always traditional", "The narrator is always reliable", "Readers should question the narrator", "It avoids deconstruction"],
      correctAnswer: "Readers should question the narrator"
    }
  ],
  "Multiple Choice (Multiple)": [
    // EASY
    {
      id: "mcm-1",
      type: "Multiple Choice (Multiple)",
      difficulty: "Easy",
      title: "Grocery List",
      text: "For the cake, we need eggs, flour, sugar, and butter. Do not buy milk or salt.",
      prompt: "Which ingredients are needed for the cake?",
      options: ["Eggs", "Milk", "Sugar", "Salt", "Butter"],
      correctAnswer: ["Eggs", "Sugar", "Butter"]
    },
    {
      id: "mcm-2",
      type: "Multiple Choice (Multiple)",
      difficulty: "Easy",
      title: "Travel Plans",
      text: "We are visiting Paris and London. We will not go to Rome or Berlin this time.",
      prompt: "Which cities will be visited?",
      options: ["Paris", "Rome", "London", "Berlin"],
      correctAnswer: ["Paris", "London"]
    },
    {
      id: "mcm-3",
      type: "Multiple Choice (Multiple)",
      difficulty: "Easy",
      title: "Sports Day",
      text: "Students can choose to play football or basketball. Tennis and swimming are not available.",
      prompt: "Which sports are available for students?",
      options: ["Football", "Tennis", "Basketball", "Swimming"],
      correctAnswer: ["Football", "Basketball"]
    },
    {
      id: "mcm-4",
      type: "Multiple Choice (Multiple)",
      difficulty: "Easy",
      title: "Office Supplies",
      text: "Please order pens and notebooks. We have enough paper and staples.",
      prompt: "What needs to be ordered?",
      options: ["Pens", "Paper", "Notebooks", "Staples"],
      correctAnswer: ["Pens", "Notebooks"]
    },
    {
      id: "mcm-5",
      type: "Multiple Choice (Multiple)",
      difficulty: "Easy",
      title: "Breakfast Menu",
      text: "The hotel serves coffee, tea, and juice. There is no hot chocolate.",
      prompt: "Which drinks are served at the hotel?",
      options: ["Coffee", "Hot Chocolate", "Tea", "Juice"],
      correctAnswer: ["Coffee", "Tea", "Juice"]
    },
    // DIFFICULT (IELTS/PTE Academic Style)
    {
      id: "mcm-6",
      type: "Multiple Choice (Multiple)",
      difficulty: "Difficult",
      title: "Urbanization and Biodiversity",
      text: "Urbanization represents one of the most significant land-use changes globally, profoundly affecting biodiversity and ecosystem functioning. As cities expand, natural habitats are fragmented, degraded, or completely destroyed, leading to local extinctions and a homogenization of species. However, the relationship between urbanization and biodiversity is complex and not entirely negative. While many native species decline in urban areas, some 'urban adapters' thrive, exploiting the novel resources and reduced predation pressures found in cities.\n\nRecent studies have highlighted the importance of 'green infrastructure'—parks, gardens, and green roofs—in maintaining urban biodiversity. These patches of vegetation can serve as refuges for native species and stepping stones facilitating movement across the urban matrix. Yet, the quality of these green spaces matters immensely. Manicured lawns with exotic plant species offer little value to native pollinators or birds compared to areas with complex vegetation structure and native flora.\n\nFurthermore, the 'heat island' effect, where cities are significantly warmer than surrounding rural areas, alters the phenology of urban plants and animals. Trees in cities often leaf out earlier in spring, and some insect species have adapted to have longer breeding seasons. This decoupling of phenological events can disrupt food webs; for instance, if caterpillars emerge earlier due to warmth but migratory birds arrive at their usual time, the birds may miss their peak food source, leading to reduced reproductive success.\n\nConservationists argue that incorporating biodiversity-friendly practices into urban planning is crucial. This includes preserving remnant natural patches, reducing chemical use, and increasing structural complexity in green spaces. By understanding the specific traits that allow certain species to persist in urban environments, planners can design cities that support a wider array of life, turning urban areas from ecological sinks into potential reservoirs of biodiversity.",
      prompt: "Which of the following statements are supported by the text regarding urbanization and biodiversity?",
      options: [
        "Urbanization universally leads to the extinction of all native species.",
        "Some species, known as 'urban adapters', can flourish in city environments.",
        "The 'heat island' effect can cause a mismatch in the timing of ecological events, disrupting food webs.",
        "Manicured lawns are just as effective as complex vegetation in supporting native wildlife.",
        "Urban green spaces can act as stepping stones for species movement if managed correctly.",
        "Migratory birds are unaffected by the phenological changes caused by urban heat.",
        "Reducing chemical use is mentioned as a strategy to improve urban biodiversity."
      ],
      correctAnswer: [
        "Some species, known as 'urban adapters', can flourish in city environments.",
        "The 'heat island' effect can cause a mismatch in the timing of ecological events, disrupting food webs.",
        "Urban green spaces can act as stepping stones for species movement if managed correctly.",
        "Reducing chemical use is mentioned as a strategy to improve urban biodiversity."
      ]
    },
    {
      id: "mcm-7",
      type: "Multiple Choice (Multiple)",
      difficulty: "Difficult",
      title: "The Neurobiology of Language",
      text: "The human capacity for language is a biological anomaly, a trait so complex and unique that its evolutionary origins remain one of science's greatest puzzles. For decades, the dominant view was localized: language resided in specific areas of the brain, most notably Broca's area for production and Wernicke's area for comprehension. While these regions are undeniably critical, modern neuroimaging has revealed a far more distributed and dynamic network. Language processing involves a vast interplay of neural circuits that span both hemispheres, integrating sensory perception, motor control, memory, and high-level cognitive planning.\n\nOne of the most intriguing findings is the plasticity of the language network. In cases of early brain injury, the right hemisphere—typically less involved in language—can take over linguistic functions with remarkable proficiency, a feat less likely in adults. This suggests that while there is a genetic blueprint for language architecture, the system is highly adaptive and shaped by experience. Furthermore, the discovery of 'mirror neurons' has sparked debate about the origins of communication, suggesting that the neural systems for action execution and action observation are linked, potentially providing a scaffold for gesture-based communication to evolve into spoken language.\n\nGenetics has also provided key insights, particularly with the discovery of the FOXP2 gene. Mutations in this gene cause severe speech and language disorders, yet FOXP2 is not a 'language gene' in the simple sense. It is a regulatory gene that influences the development of neural circuits involved in motor sequencing and synaptic plasticity. This implies that language did not arise from a single mutation but rather from the fine-tuning of ancient neural systems governing movement and sequence learning, repurposed over millions of years for the complex hierarchical structure of syntax and grammar.",
      prompt: "According to the passage, what has modern research revealed about the human capacity for language?",
      options: [
        "Language function is strictly confined to Broca's and Wernicke's areas.",
        "The right hemisphere can assume language functions in cases of early brain injury.",
        "The FOXP2 gene is solely responsible for the existence of human language.",
        "Neural plasticity allows the language network to adapt, especially in children.",
        "Language processing engages a wide network of neural circuits across the brain.",
        "Mirror neurons prove that language evolved directly from sign language.",
        "FOXP2 influences neural circuits related to motor sequencing."
      ],
      correctAnswer: [
        "The right hemisphere can assume language functions in cases of early brain injury.",
        "Neural plasticity allows the language network to adapt, especially in children.",
        "Language processing engages a wide network of neural circuits across the brain.",
        "FOXP2 influences neural circuits related to motor sequencing."
      ]
    },
    {
      id: "mcm-8",
      type: "Multiple Choice (Multiple)",
      difficulty: "Difficult",
      title: "The Industrial Revolution",
      text: "The Industrial Revolution, which began in Britain in the late 18th century, marked a profound turning point in human history, fundamentally altering the way goods were produced and how people lived. Prior to this transformation, most manufacturing was done in small shops or homes using hand tools or basic machines—a system known as cottage industry. The shift to powered, special-purpose machinery, factories, and mass production was driven by several key innovations, most notably the steam engine, developed by James Watt. This invention allowed for the efficient conversion of heat energy into mechanical work, liberating industry from reliance on variable water and wind power.\n\nThe textile industry was the first to be industrialized, with the invention of the spinning jenny and power loom dramatically increasing output. However, the revolution was not merely technological; it was also social and economic. It led to rapid urbanization as people flocked from rural farms to booming industrial cities like Manchester and Birmingham in search of work. This mass migration created a new urban working class but also resulted in overcrowded, unsanitary living conditions and significant environmental pollution.\n\nEconomically, the Industrial Revolution gave rise to capitalism and free-market economies, challenging the old mercantilist structures. It spurred global trade as industrialized nations sought raw materials and new markets for their finished goods. Yet, it also sparked social unrest and the rise of labor movements, as workers fought for better wages, safer conditions, and shorter hours. The legacy of this period is double-edged: it ushered in an era of unprecedented economic growth and technological progress, but at a high social and environmental cost that society continues to grapple with today.",
      prompt: "Which of the following were consequences of the Industrial Revolution mentioned in the text?",
      options: [
        "A shift from cottage industries to factory-based mass production.",
        "The immediate implementation of strict environmental protection laws.",
        "Rapid urbanization and the growth of industrial cities.",
        "The decline of the textile industry due to automation.",
        "The rise of a new urban working class living in often poor conditions.",
        "The complete replacement of capitalism with mercantilism.",
        "Global trade expansion driven by the need for raw materials."
      ],
      correctAnswer: [
        "A shift from cottage industries to factory-based mass production.",
        "Rapid urbanization and the growth of industrial cities.",
        "The rise of a new urban working class living in often poor conditions.",
        "Global trade expansion driven by the need for raw materials."
      ]
    },
    {
      id: "mcm-11",
      type: "Multiple Choice (Multiple)",
      difficulty: "Difficult",
      title: "The Old Man of the Lake",
      text: "Small, localised enterprises are becoming ever-more imaginative in identifying opportunities to boost tourism for their areas. A more unusual attraction is the Old Man of the Lake, which is the name given to a 9-metre-tall tree stump that has been bobbing vertically in Oregon’s Crater Lake since at least 1896. For over one hundred years, it has been largely ignored but recently it has become a must-see item on the list of lake attractions. Since January 2012, tour boats regularly include the Old Man on their sightseeing trips around the lake.\n\nAt the waterline, the stump is about 60 centimetres in diameter, and the exposed part stands approximately 120 centimetres above the surface of the water. Over the years, the stump has been bleached white by the elements. The exposed end of the floating tree is splintered and worn but wide and buoyant enough to support a person’s weight.\n\nObservations indicated that the Old Man of Crater lake travels quite extensively, and sometimes with surprising rapidity. Since it can be seen Virtually anywhere on the lake, boat pilots commonly communicate its position to each other as a general matter of safety.",
      prompt: "Which of the following are true of the Old Man of the lake according to the passage?",
      options: [
         "It has been a tourist attraction for decades.",
         "It is a drifting piece of wood.",
         "It is close to the edge of Crater Lake.",
         "It is owned by a local businessman.",
         "It can quickly move about the lake.",
         "It can be a danger to boat users.",
         "It is too small for someone to stand on."
      ],
      correctAnswer: [
         "It is a drifting piece of wood.",
         "It can quickly move about the lake.",
         "It can be a danger to boat users."
      ]
    }
  ],
  "R&W Fill in the Blanks": [
    // EASY
    {
      id: "rw-1",
      type: "R&W Fill in the Blanks",
      difficulty: "Easy",
      title: "My Pet",
      text: "I have a dog named Max. He likes to {{0}} in the park. He is very {{1}} and loves people.",
      blanks: [
        { index: 0, correct: "play", options: ["read", "play", "fly", "cook"] },
        { index: 1, correct: "friendly", options: ["angry", "friendly", "slow", "green"] }
      ]
    },
    {
      id: "rw-2",
      type: "R&W Fill in the Blanks",
      difficulty: "Easy",
      title: "School Trip",
      text: "Yesterday we went to the zoo. We saw many {{0}}. My favorite was the {{1}} because it has a long neck.",
      blanks: [
        { index: 0, correct: "animals", options: ["cars", "animals", "books", "houses"] },
        { index: 1, correct: "giraffe", options: ["lion", "giraffe", "snake", "fish"] }
      ]
    },
    {
      id: "rw-3",
      type: "R&W Fill in the Blanks",
      difficulty: "Easy",
      title: "Cooking Dinner",
      text: "To make pasta, you need to {{0}} water in a pot. Then, add the pasta and {{1}} for ten minutes.",
      blanks: [
        { index: 0, correct: "boil", options: ["freeze", "boil", "cut", "fry"] },
        { index: 1, correct: "cook", options: ["sleep", "cook", "drive", "sing"] }
      ]
    },
    {
      id: "rw-4",
      type: "R&W Fill in the Blanks",
      difficulty: "Easy",
      title: "Learning English",
      text: "I study English every day. I want to {{0}} my speaking skills. It is important to {{1}} regularly.",
      blanks: [
        { index: 0, correct: "improve", options: ["lose", "improve", "break", "hide"] },
        { index: 1, correct: "practice", options: ["practice", "forget", "sleep", "stop"] }
      ]
    },
    {
      id: "rw-5",
      type: "R&W Fill in the Blanks",
      difficulty: "Easy",
      title: "Weekend Plans",
      text: "On Saturday, I will {{0}} my grandparents. We usually {{1}} lunch together.",
      blanks: [
        { index: 0, correct: "visit", options: ["visit", "watch", "run", "sell"] },
        { index: 1, correct: "eat", options: ["play", "eat", "draw", "fly"] }
      ]
    },
    // DIFFICULT
    {
      id: "rw-6",
      type: "R&W Fill in the Blanks",
      difficulty: "Difficult",
      title: "Scientific Method",
      text: "The scientific method involves making an observation, forming a {{0}}, and conducting experiments to test it. The results must be {{1}} to be considered valid.",
      blanks: [
        { index: 0, correct: "hypothesis", options: ["conclusion", "hypothesis", "guess", "story"] },
        { index: 1, correct: "reproducible", options: ["random", "reproducible", "secret", "expensive"] }
      ]
    },
    {
      id: "rw-7",
      type: "R&W Fill in the Blanks",
      difficulty: "Difficult",
      title: "Urbanization",
      text: "Rapid urbanization has led to significant {{0}} on city infrastructure. Governments must implement {{1}} planning strategies to manage this growth.",
      blanks: [
        { index: 0, correct: "strain", options: ["ease", "strain", "joy", "help"] },
        { index: 1, correct: "sustainable", options: ["temporary", "sustainable", "careless", "quick"] }
      ]
    },
    {
      id: "rw-8",
      type: "R&W Fill in the Blanks",
      difficulty: "Difficult",
      title: "Language Acquisition",
      text: "Linguists argue that immersion is the most {{0}} method for language acquisition. It forces the learner to {{1}} to new linguistic environments constantly.",
      blanks: [
        { index: 0, correct: "effective", options: ["boring", "effective", "slow", "costly"] },
        { index: 1, correct: "adapt", options: ["resign", "adapt", "fail", "leave"] }
      ]
    },
    {
      id: "rw-9",
      type: "R&W Fill in the Blanks",
      difficulty: "Difficult",
      title: "Economic Recession",
      text: "During a recession, consumer spending typically {{0}}. This can lead to a cycle of reduced production and higher {{1}} rates.",
      blanks: [
        { index: 0, correct: "declines", options: ["increases", "declines", "stabilizes", "peaks"] },
        { index: 1, correct: "unemployment", options: ["employment", "unemployment", "interest", "tax"] }
      ]
    },
    {
      id: "rw-10",
      type: "R&W Fill in the Blanks",
      difficulty: "Difficult",
      title: "Photosynthesis",
      text: "Photosynthesis is the process by which plants convert light energy into {{0}} energy. This process releases oxygen as a {{1}}.",
      blanks: [
        { index: 0, correct: "chemical", options: ["solar", "chemical", "kinetic", "thermal"] },
        { index: 1, correct: "byproduct", options: ["toxin", "byproduct", "source", "fuel"] }
      ]
    },
    {
      id: "rw-11",
      type: "R&W Fill in the Blanks",
      difficulty: "Difficult",
      title: "Customer Service",
      text: "Promoting good customer service must start at the top. If management doesn't realise how important this {{0}} of their business is, they will be at an instant {{1}} in their industry. Good customer response {{2}} to loyal customers, which are the cornerstone of any successful business. No matter how much money you invest in your {{3}}, if you don't have the fundamental elements of your business right, its {{4}} money.",
      blanks: [
        { index: 0, correct: "aspect", options: ["aspect", "division", "creation", "service"] },
        { index: 1, correct: "disadvantage", options: ["trouble", "disadvantage", "danger", "risk"] },
        { index: 2, correct: "equates", options: ["equates", "leads", "responds", "calls"] },
        { index: 3, correct: "marketing", options: ["marketing", "finance", "infrastructure", "products"] },
        { index: 4, correct: "wasted", options: ["wasted", "lost", "gone", "saved"] }
      ]
    }
  ],
  "Reading Fill in the Blanks": [
    // EASY
    {
      id: "rf-1",
      type: "Reading Fill in the Blanks",
      difficulty: "Easy",
      title: "Summer Vacation",
      text: "In summer, the weather is hot. We like to go to the {{0}} and swim in the {{1}}.",
      blanks: [
        { index: 0, correct: "beach" },
        { index: 1, correct: "sea" }
      ],
      options: ["beach", "sea", "mountain", "snow", "car"]
    },
    {
      id: "rf-2",
      type: "Reading Fill in the Blanks",
      difficulty: "Easy",
      title: "Morning Routine",
      text: "I brush my {{0}} every morning. Then I wash my {{1}} with warm water.",
      blanks: [
        { index: 0, correct: "teeth" },
        { index: 1, correct: "face" }
      ],
      options: ["teeth", "face", "hair", "shoes", "cat"]
    },
    {
      id: "rf-3",
      type: "Reading Fill in the Blanks",
      difficulty: "Easy",
      title: "The Garden",
      text: "My mother loves flowers. She plants {{0}} in the garden. They smell very {{1}}.",
      blanks: [
        { index: 0, correct: "roses" },
        { index: 1, correct: "good" }
      ],
      options: ["roses", "good", "trees", "bad", "stones"]
    },
    {
      id: "rf-4",
      type: "Reading Fill in the Blanks",
      difficulty: "Easy",
      title: "Homework",
      text: "After school, I do my {{0}}. It is sometimes difficult, but my teacher {{1}} me.",
      blanks: [
        { index: 0, correct: "homework" },
        { index: 1, correct: "helps" }
      ],
      options: ["homework", "helps", "game", "hurts", "sleeps"]
    },
    {
      id: "rf-5",
      type: "Reading Fill in the Blanks",
      difficulty: "Easy",
      title: "New Car",
      text: "My dad bought a new {{0}}. It is red and very {{1}}. We went for a drive.",
      blanks: [
        { index: 0, correct: "car" },
        { index: 1, correct: "fast" }
      ],
      options: ["car", "fast", "house", "slow", "dog"]
    },
    // DIFFICULT
    {
      id: "rf-6",
      type: "Reading Fill in the Blanks",
      difficulty: "Difficult",
      title: "Geology",
      text: "Geologists study the Earth's structure. They examine rocks to understand the planet's {{0}}. This helps predict future {{1}} events.",
      blanks: [
        { index: 0, correct: "history" },
        { index: 1, correct: "geological" }
      ],
      options: ["history", "geological", "future", "weather", "biological"]
    },
    {
      id: "rf-7",
      type: "Reading Fill in the Blanks",
      difficulty: "Difficult",
      title: "Marketing Strategy",
      text: "A successful marketing strategy requires understanding the target {{0}}. Companies must analyze consumer {{1}} to create effective campaigns.",
      blanks: [
        { index: 0, correct: "audience" },
        { index: 1, correct: "behavior" }
      ],
      options: ["audience", "behavior", "product", "manager", "price"]
    },
    {
      id: "rf-8",
      type: "Reading Fill in the Blanks",
      difficulty: "Difficult",
      title: "Cognitive Science",
      text: "Memory is not a perfect recording of events. It is a {{0}} process where the brain reconstructs past experiences, often subject to {{1}}.",
      blanks: [
        { index: 0, correct: "reconstructive" },
        { index: 1, correct: "distortion" }
      ],
      options: ["reconstructive", "distortion", "simple", "accuracy", "physical"]
    },
    {
      id: "rf-9",
      type: "Reading Fill in the Blanks",
      difficulty: "Difficult",
      title: "International Law",
      text: "International treaties are binding agreements between nations. However, enforcement relies heavily on diplomatic {{0}} rather than strict {{1}} authority.",
      blanks: [
        { index: 0, correct: "pressure" },
        { index: 1, correct: "judicial" }
      ],
      options: ["pressure", "judicial", "war", "local", "economic"]
    },
    {
      id: "rf-10",
      type: "Reading Fill in the Blanks",
      difficulty: "Difficult",
      title: "Architecture",
      text: "Sustainable architecture prioritizes energy {{0}}. Using materials that provide good {{1}} reduces the need for artificial heating and cooling.",
      blanks: [
        { index: 0, correct: "efficiency" },
        { index: 1, correct: "insulation" }
      ],
      options: ["efficiency", "insulation", "waste", "decoration", "height"]
    }
  ],
  "Reorder Paragraphs": [
    // EASY
    {
      id: "ro-1",
      type: "Reorder Paragraphs",
      difficulty: "Easy",
      title: "Making Tea",
      text: "Arrange the steps to make tea.",
      paragraphs: [
        { id: "p1", text: "First, boil some water in a kettle.", correctOrder: 1 },
        { id: "p2", text: "Then, put a teabag in a cup.", correctOrder: 2 },
        { id: "p3", text: "Pour the hot water into the cup.", correctOrder: 3 },
        { id: "p4", text: "Finally, add milk and sugar if you like.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-2",
      type: "Reorder Paragraphs",
      difficulty: "Easy",
      title: "Morning Routine",
      text: "Arrange the morning activities.",
      paragraphs: [
        { id: "p1", text: "John woke up when his alarm rang.", correctOrder: 1 },
        { id: "p2", text: "He got out of bed and brushed his teeth.", correctOrder: 2 },
        { id: "p3", text: "After getting dressed, he went to the kitchen.", correctOrder: 3 },
        { id: "p4", text: "He ate toast and drank coffee for breakfast.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-3",
      type: "Reorder Paragraphs",
      difficulty: "Easy",
      title: "Planting a Seed",
      text: "How to grow a plant.",
      paragraphs: [
        { id: "p1", text: "Dig a small hole in the soil.", correctOrder: 1 },
        { id: "p2", text: "Place the seed inside the hole.", correctOrder: 2 },
        { id: "p3", text: "Cover the seed with soil.", correctOrder: 3 },
        { id: "p4", text: "Water it every day until it grows.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-4",
      type: "Reorder Paragraphs",
      difficulty: "Easy",
      title: "Sending a Letter",
      text: "Steps to send a letter.",
      paragraphs: [
        { id: "p1", text: "Write your message on a piece of paper.", correctOrder: 1 },
        { id: "p2", text: "Put the paper inside an envelope.", correctOrder: 2 },
        { id: "p3", text: "Write the address on the front.", correctOrder: 3 },
        { id: "p4", text: "Stick a stamp and drop it in the mailbox.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-5",
      type: "Reorder Paragraphs",
      difficulty: "Easy",
      title: "Buying Groceries",
      text: "Shopping at the supermarket.",
      paragraphs: [
        { id: "p1", text: "Make a list of things you need.", correctOrder: 1 },
        { id: "p2", text: "Go to the supermarket with a cart.", correctOrder: 2 },
        { id: "p3", text: "Pick the items from the shelves.", correctOrder: 3 },
        { id: "p4", text: "Pay for your groceries at the checkout.", correctOrder: 4 }
      ]
    },
    // DIFFICULT
    {
      id: "ro-6",
      type: "Reorder Paragraphs",
      difficulty: "Difficult",
      title: "Industrial Revolution",
      text: "The impact of the Industrial Revolution.",
      paragraphs: [
        { id: "p1", text: "The Industrial Revolution began in Britain in the late 18th century.", correctOrder: 1 },
        { id: "p2", text: "It marked a major turning point in history, shifting from hand production to machines.", correctOrder: 2 },
        { id: "p3", text: "Factories emerged, drawing people from rural areas to growing cities.", correctOrder: 3 },
        { id: "p4", text: "However, this rapid urbanization also led to poor living conditions and pollution.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-7",
      type: "Reorder Paragraphs",
      difficulty: "Difficult",
      title: "Scientific Peer Review",
      text: "The process of publishing research.",
      paragraphs: [
        { id: "p1", text: "A scientist conducts research and writes a manuscript detailing the findings.", correctOrder: 1 },
        { id: "p2", text: "The manuscript is submitted to an academic journal for consideration.", correctOrder: 2 },
        { id: "p3", text: "Editors send the paper to independent experts for peer review.", correctOrder: 3 },
        { id: "p4", text: "Based on the feedback, the paper is either accepted, rejected, or revised.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-8",
      type: "Reorder Paragraphs",
      difficulty: "Difficult",
      title: "Antibiotic Resistance",
      text: "A growing global health threat.",
      paragraphs: [
        { id: "p1", text: "Antibiotics are drugs used to treat bacterial infections.", correctOrder: 1 },
        { id: "p2", text: "Overuse and misuse of these drugs have contributed to antibiotic resistance.", correctOrder: 2 },
        { id: "p3", text: "This occurs when bacteria evolve mechanisms to survive the drugs designed to kill them.", correctOrder: 3 },
        { id: "p4", text: "Consequently, common infections are becoming harder to treat, posing a risk to global health.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-9",
      type: "Reorder Paragraphs",
      difficulty: "Difficult",
      title: "The Internet's Evolution",
      text: "From ARPANET to the World Wide Web.",
      paragraphs: [
        { id: "p1", text: "The origins of the internet date back to ARPANET in the 1960s.", correctOrder: 1 },
        { id: "p2", text: "It was originally designed for military communication and research.", correctOrder: 2 },
        { id: "p3", text: "In the 1990s, Tim Berners-Lee invented the World Wide Web, making it accessible to the public.", correctOrder: 3 },
        { id: "p4", text: "Today, it connects billions of devices, transforming how we live and work.", correctOrder: 4 }
      ]
    },
    {
      id: "ro-10",
      type: "Reorder Paragraphs",
      difficulty: "Difficult",
      title: "Renewable Energy Adoption",
      text: "Challenges in green energy transition.",
      paragraphs: [
        { id: "p1", text: "Transitioning to renewable energy is crucial for mitigating climate change.", correctOrder: 1 },
        { id: "p2", text: "However, sources like solar and wind are intermittent by nature.", correctOrder: 2 },
        { id: "p3", text: "This creates a need for efficient energy storage solutions like advanced batteries.", correctOrder: 3 },
        { id: "p4", text: "Without these technologies, a stable and reliable power grid remains a challenge.", correctOrder: 4 }
      ]
    }
  ]
};