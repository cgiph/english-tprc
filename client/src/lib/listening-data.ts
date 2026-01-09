
export type ListeningQuestion = {
  id: string;
  type: "SST" | "MC-MA" | "FIB-L" | "MC-SA" | "SMW" | "HIW" | "WFD";
  title: string;
  audioScript: string;
  audioSpeed?: number; // default 1.0
  prompt?: string; // For SST, FIB, etc.
  options?: string[]; // For MC, SMW
  correctAnswer?: string | string[] | number[]; // Varied formats
  transcript?: string; // For HIW (the text to show)
  displayTranscript?: string; // For HIW (the text to show with errors)
  wrongWords?: number[]; // Indices of wrong words for HIW
};

export const LISTENING_DATA: ListeningQuestion[] = [
  // 1. Summarize Spoken Text (5 items)
  {
    id: "sst-1",
    type: "SST",
    title: "Technological Singularity",
    audioScript: "The concept of technological singularity refers to a hypothetical point in time when technological growth becomes uncontrollable and irreversible, resulting in unfathomable changes to human civilization. Some experts believe this will happen when artificial intelligence surpasses human intelligence, leading to an intelligence explosion. Critics, however, argue that physical limits will prevent such rapid acceleration.",
    prompt: "Summarize the spoken text in 50-70 words."
  },
  {
    id: "sst-2",
    type: "SST",
    title: "Urban Planning",
    audioScript: "Modern urban planning has shifted focus from purely functional zoning to creating mixed-use developments. This approach integrates residential, commercial, and cultural spaces to foster community interaction and reduce reliance on automobiles. The goal is to create sustainable, walkable cities that improve the quality of life for residents while minimizing environmental impact.",
    prompt: "Summarize the spoken text in 50-70 words."
  },
  {
    id: "sst-3",
    type: "SST",
    title: "Climate Change Economics",
    audioScript: "The economics of climate change involves balancing the costs of mitigation against the potential damages of inaction. Economists argue that early investment in green technologies can stimulate innovation and create jobs. However, the transition requires significant policy support and international cooperation to manage the distribution of costs across different nations.",
    prompt: "Summarize the spoken text in 50-70 words."
  },
  {
    id: "sst-4",
    type: "SST",
    title: "Neuroplasticity",
    audioScript: "Neuroplasticity is the brain's ability to reorganize itself by forming new neural connections throughout life. This capability allows the neurons in the brain to compensate for injury and disease and to adjust their activities in response to new situations or to changes in their environment. It challenges the older belief that the adult brain is static.",
    prompt: "Summarize the spoken text in 50-70 words."
  },
  {
    id: "sst-5",
    type: "SST",
    title: "The History of Tea",
    audioScript: "Tea originated in ancient China, where it was initially used for medicinal purposes. It later became a recreational drink and spread to other East Asian countries. By the 16th century, Portuguese merchants introduced it to Europe, where it became a luxury item before eventually becoming a daily staple in British culture.",
    prompt: "Summarize the spoken text in 50-70 words."
  },

  // 2. Multiple Choice Multiple Answers (5 items)
  {
    id: "mcma-1",
    type: "MC-MA",
    title: "Renewable Energy Sources",
    audioScript: "While solar and wind power are the most well-known renewable energy sources, geothermal and tidal energy are gaining traction. Geothermal energy harnesses heat from beneath the earth's crust, providing a constant power supply. Tidal energy, though currently expensive to implement, offers highly predictable generation patterns based on lunar cycles.",
    prompt: "Which renewable energy sources are mentioned as gaining traction?",
    options: ["Solar Power", "Geothermal Energy", "Biomass", "Tidal Energy", "Hydroelectric"],
    correctAnswer: ["Geothermal Energy", "Tidal Energy"]
  },
  {
    id: "mcma-2",
    type: "MC-MA",
    title: "Renaissance Art",
    audioScript: "Renaissance art is characterized by a focus on realism and human emotion. Artists like Leonardo da Vinci and Michelangelo mastered the use of perspective to create depth. They also studied human anatomy extensively to depict the human form with unprecedented accuracy, moving away from the stylized forms of the medieval period.",
    prompt: "What characteristics of Renaissance art are highlighted?",
    options: ["Focus on realism", "Abstract forms", "Use of perspective", "Flat composition", "Anatomical accuracy"],
    correctAnswer: ["Focus on realism", "Use of perspective", "Anatomical accuracy"]
  },
  {
    id: "mcma-3",
    type: "MC-MA",
    title: "Mars Exploration",
    audioScript: "Exploring Mars presents numerous challenges. The thin atmosphere provides little protection from radiation. Dust storms can envelope the entire planet for weeks. Furthermore, the distance from Earth means communication delays of up to 20 minutes, requiring autonomous systems for rovers.",
    prompt: "What challenges of Mars exploration are discussed?",
    options: ["Extreme heat", "Radiation exposure", "Dust storms", "Communication delays", "Lack of water"],
    correctAnswer: ["Radiation exposure", "Dust storms", "Communication delays"]
  },
  {
    id: "mcma-4",
    type: "MC-MA",
    title: "Language Acquisition",
    audioScript: "Children acquire language through immersion and interaction. They mimic sounds, learn vocabulary in context, and deduce grammatical rules without formal instruction. Social interaction is crucial; children learn best when communicating with caregivers rather than just passively listening to audio.",
    prompt: "How do children acquire language according to the speaker?",
    options: ["Formal instruction", "Mimicking sounds", "Reading books", "Contextual vocabulary", "Social interaction"],
    correctAnswer: ["Mimicking sounds", "Contextual vocabulary", "Social interaction"]
  },
  {
    id: "mcma-5",
    type: "MC-MA",
    title: "Sustainable Agriculture",
    audioScript: "Sustainable agriculture aims to meet society's food needs without compromising future generations. Key practices include crop rotation to maintain soil health, reducing chemical pesticide use, and conserving water resources. It also emphasizes the economic viability of farm operations.",
    prompt: "Which practices are part of sustainable agriculture?",
    options: ["Monoculture farming", "Crop rotation", "Increased pesticide use", "Water conservation", "Economic viability"],
    correctAnswer: ["Crop rotation", "Water conservation", "Economic viability"]
  },

  // 3. Fill in the Blanks (10 items)
  {
    id: "fib-1",
    type: "FIB-L",
    title: "Digital Marketing",
    audioScript: "Digital marketing has revolutionized how businesses connect with consumers. By utilizing data analytics, companies can target specific demographics with personalized content. This strategy improves conversion rates and maximizes return on investment.",
    transcript: "Digital marketing has revolutionized how businesses connect with consumers. By utilizing data [analytics], companies can target specific [demographics] with personalized content. This strategy improves [conversion] rates and maximizes return on [investment].",
    correctAnswer: ["analytics", "demographics", "conversion", "investment"]
  },
  {
    id: "fib-2",
    type: "FIB-L",
    title: "Ocean Currents",
    audioScript: "Ocean currents play a vital role in regulating the global climate. They transport warm water from the equator toward the poles and cold water back to the tropics. This continuous flow helps to distribute heat energy around the planet.",
    transcript: "Ocean currents play a vital role in [regulating] the global climate. They transport warm water from the [equator] toward the poles and cold water back to the [tropics]. This continuous flow helps to [distribute] heat energy around the planet.",
    correctAnswer: ["regulating", "equator", "tropics", "distribute"]
  },
  {
    id: "fib-3",
    type: "FIB-L",
    title: "Artificial Intelligence",
    audioScript: "Artificial intelligence systems learn from vast amounts of data. Through a process called machine learning, algorithms identify patterns and make predictions. However, the quality of the output depends heavily on the quality of the input data.",
    transcript: "Artificial intelligence systems learn from vast amounts of [data]. Through a process called machine [learning], algorithms identify [patterns] and make predictions. However, the quality of the output depends heavily on the quality of the [input] data.",
    correctAnswer: ["data", "learning", "patterns", "input"]
  },
  {
    id: "fib-4",
    type: "FIB-L",
    title: "Photosynthesis",
    audioScript: "Photosynthesis is the process by which plants convert light energy into chemical energy. Chlorophyll absorbs sunlight, which is then used to transform carbon dioxide and water into glucose and oxygen. This process is essential for life on Earth.",
    transcript: "Photosynthesis is the process by which plants convert [light] energy into chemical energy. Chlorophyll [absorbs] sunlight, which is then used to transform carbon dioxide and water into [glucose] and oxygen. This process is [essential] for life on Earth.",
    correctAnswer: ["light", "absorbs", "glucose", "essential"]
  },
  {
    id: "fib-5",
    type: "FIB-L",
    title: "Supply Chain",
    audioScript: "A resilient supply chain is critical for business continuity. Companies must diversify their suppliers to mitigate risks such as natural disasters or geopolitical instability. Effective logistics management ensures the timely delivery of goods to customers.",
    transcript: "A resilient supply chain is [critical] for business continuity. Companies must [diversify] their suppliers to mitigate risks such as natural disasters or geopolitical [instability]. Effective logistics management ensures the [timely] delivery of goods to customers.",
    correctAnswer: ["critical", "diversify", "instability", "timely"]
  },
  {
    id: "fib-6",
    type: "FIB-L",
    title: "Urbanization",
    audioScript: "Rapid urbanization presents both opportunities and challenges. While cities offer better employment prospects, they also face issues like overcrowding and pollution. Sustainable urban planning is necessary to accommodate the growing population.",
    transcript: "Rapid urbanization presents both [opportunities] and challenges. While cities offer better [employment] prospects, they also face issues like [overcrowding] and pollution. Sustainable urban planning is necessary to [accommodate] the growing population.",
    correctAnswer: ["opportunities", "employment", "overcrowding", "accommodate"]
  },
  {
    id: "fib-7",
    type: "FIB-L",
    title: "Mental Health",
    audioScript: "Mental health awareness has increased significantly in recent years. Reducing the stigma associated with mental illness encourages more people to seek help. Early intervention and support systems are crucial for effective treatment and recovery.",
    transcript: "Mental health awareness has [increased] significantly in recent years. Reducing the [stigma] associated with mental illness encourages more people to seek help. Early [intervention] and support systems are crucial for effective [treatment] and recovery.",
    correctAnswer: ["increased", "stigma", "intervention", "treatment"]
  },
  {
    id: "fib-8",
    type: "FIB-L",
    title: "Cryptocurrency",
    audioScript: "Cryptocurrencies utilize blockchain technology to secure transactions. This decentralized ledger system ensures transparency and prevents fraud. However, the volatility of cryptocurrency markets remains a significant concern for investors.",
    transcript: "Cryptocurrencies utilize [blockchain] technology to secure transactions. This [decentralized] ledger system ensures transparency and prevents [fraud]. However, the [volatility] of cryptocurrency markets remains a significant concern for investors.",
    correctAnswer: ["blockchain", "decentralized", "fraud", "volatility"]
  },
  {
    id: "fib-9",
    type: "FIB-L",
    title: "Biodiversity",
    audioScript: "Biodiversity contributes to the stability of ecosystems. A diverse range of species ensures that ecosystems can recover from disturbances. Habitat loss and climate change are currently the biggest threats to global biodiversity.",
    transcript: "Biodiversity contributes to the [stability] of ecosystems. A diverse range of [species] ensures that ecosystems can [recover] from disturbances. Habitat loss and climate change are currently the biggest [threats] to global biodiversity.",
    correctAnswer: ["stability", "species", "recover", "threats"]
  },
  {
    id: "fib-10",
    type: "FIB-L",
    title: "Remote Work",
    audioScript: "The shift to remote work has transformed the traditional office dynamic. Employees appreciate the flexibility and reduced commute times. Employers, meanwhile, must adapt their management styles to maintain productivity and team cohesion.",
    transcript: "The shift to remote work has [transformed] the traditional office dynamic. Employees appreciate the [flexibility] and reduced commute times. Employers, meanwhile, must adapt their management styles to [maintain] productivity and team [cohesion].",
    correctAnswer: ["transformed", "flexibility", "maintain", "cohesion"]
  },
  {
    id: "fib-11",
    type: "FIB-L",
    title: "Global Economic Integration",
    audioScript: "The phenomenon of global economic integration has fundamentally altered the landscape of international commerce and financial markets. Multinational corporations now operate across borders with unprecedented ease, establishing subsidiaries and manufacturing facilities in developing nations to capitalize on lower labor costs and emerging consumer markets. This interconnectedness has created complex supply chains that span multiple continents, with raw materials sourced from one region, components manufactured in another, and final assembly occurring in a third location before products reach consumers worldwide. Critics argue that this model exacerbates inequality between developed and developing nations, while proponents contend that it accelerates technology transfer and creates employment opportunities in regions that previously had limited access to global markets. The regulatory frameworks governing these activities remain fragmented, with individual nations attempting to balance economic growth with environmental protection and labor rights.",
    transcript: "The phenomenon of global economic [integration] has fundamentally altered the landscape of international commerce and financial markets. [Multinational] corporations now operate across borders with unprecedented ease, establishing [subsidiaries] and manufacturing facilities in developing nations to capitalize on lower labor costs and emerging consumer markets. This [interconnectedness] has created complex supply chains that span multiple continents, with raw materials sourced from one region, components [manufactured] in another, and final assembly occurring in a third location before products reach consumers worldwide. Critics argue that this model [exacerbates] inequality between developed and developing nations, while proponents contend that it accelerates technology [transfer] and creates employment opportunities in regions that previously had limited access to global markets. The [regulatory] frameworks governing these activities remain fragmented, with individual nations attempting to balance economic growth with environmental protection and labor rights.",
    correctAnswer: ["integration", "Multinational", "subsidiaries", "interconnectedness", "manufactured", "exacerbates", "transfer", "regulatory"]
  },

  // 4. Multiple Choice Single Answer (5 items)
  {
    id: "mcsa-1",
    type: "MC-SA",
    title: "Sleep Cycle",
    audioScript: "The human sleep cycle consists of several stages, including REM and non-REM sleep. Deep sleep, a stage of non-REM sleep, is physically restorative, while REM sleep is associated with dreaming and memory consolidation. Most adults need 7-9 hours of sleep to function optimally.",
    prompt: "Which stage of sleep is primarily associated with memory consolidation?",
    options: ["Light sleep", "Deep sleep", "REM sleep", "Napping"],
    correctAnswer: "REM sleep"
  },
  {
    id: "mcsa-2",
    type: "MC-SA",
    title: "Market Competition",
    audioScript: "In a perfectly competitive market, numerous small firms sell identical products. No single firm has the market power to influence prices. This contrasts with a monopoly, where one firm dominates the market and sets the price.",
    prompt: "What characterizes a perfectly competitive market?",
    options: ["One dominant firm", "Identical products", "Variable prices", "High barriers to entry"],
    correctAnswer: "Identical products"
  },
  {
    id: "mcsa-3",
    type: "MC-SA",
    title: "Antibiotics",
    audioScript: "Antibiotics are powerful medicines that fight bacterial infections. They do not work against viral infections like the common cold or flu. Overuse of antibiotics can lead to antibiotic resistance, making infections harder to treat.",
    prompt: "Antibiotics are effective against which type of infection?",
    options: ["Viral", "Fungal", "Bacterial", "Parasitic"],
    correctAnswer: "Bacterial"
  },
  {
    id: "mcsa-4",
    type: "MC-SA",
    title: "Globalization Impact",
    audioScript: "Globalization has led to increased interconnectedness among nations. It facilitates the flow of goods, capital, and information. While it boosts economic growth, it can also lead to cultural homogenization and job displacement in certain sectors.",
    prompt: "What is a potential negative impact of globalization mentioned?",
    options: ["Decreased trade", "Cultural homogenization", "Reduced information flow", "Slower economic growth"],
    correctAnswer: "Cultural homogenization"
  },
  {
    id: "mcsa-5",
    type: "MC-SA",
    title: "Cognitive Dissonance",
    audioScript: "Cognitive dissonance occurs when a person holds contradictory beliefs or values. This mental conflict causes discomfort, motivating the individual to resolve the inconsistency by changing their attitude or behavior to align with their beliefs.",
    prompt: "What motivates individuals to resolve cognitive dissonance?",
    options: ["Mental comfort", "External pressure", "Discomfort", "Financial gain"],
    correctAnswer: "Discomfort"
  },

  // 5. Select Missing Words (5 items)
  {
    id: "smw-1",
    type: "SMW",
    title: "Economic Forecast",
    audioScript: "The economic forecast for the next quarter looks promising. Consumer spending is up, and unemployment is down. However, analysts warn that rising inflation could...",
    prompt: "Select the missing words to complete the sentence.",
    options: ["boost the economy", "dampen growth", "increase savings", "lower prices"],
    correctAnswer: "dampen growth"
  },
  {
    id: "smw-2",
    type: "SMW",
    title: "Scientific Method",
    audioScript: "The scientific method starts with an observation, followed by a hypothesis. Experiments are then conducted to test this hypothesis. If the results are consistent, the hypothesis may...",
    prompt: "Select the missing words.",
    options: ["be rejected", "become a theory", "be ignored", "remain a guess"],
    correctAnswer: "become a theory"
  },
  {
    id: "smw-3",
    type: "SMW",
    title: "Project Management",
    audioScript: "Effective project management requires clear communication and defined goals. Without these, the team may lose focus and the project could...",
    prompt: "Select the missing words.",
    options: ["succeed early", "go over budget", "save money", "finish on time"],
    correctAnswer: "go over budget"
  },
  {
    id: "smw-4",
    type: "SMW",
    title: "Healthy Diet",
    audioScript: "A balanced diet should include a variety of fruits, vegetables, and whole grains. Reducing the intake of processed foods and sugar is also recommended to...",
    prompt: "Select the missing words.",
    options: ["gain weight", "maintain health", "increase stress", "sleep less"],
    correctAnswer: "maintain health"
  },
  {
    id: "smw-5",
    type: "SMW",
    title: "Historical Analysis",
    audioScript: "Historians analyze primary sources to understand past events. However, they must be aware of potential biases in these documents, which can...",
    prompt: "Select the missing words.",
    options: ["clarify the truth", "skew the interpretation", "predict the future", "simplify the past"],
    correctAnswer: "skew the interpretation"
  },

  // 6. Highlight Incorrect Words (10 items)
  {
    id: "hiw-1",
    type: "HIW",
    title: "Astronomy",
    audioScript: "The telescope is an instrument used to observe remote objects. It gathers light to create a magnified image. Early telescopes were simple optical devices.",
    transcript: "The telescope is an instrument used to observe [distant] objects. It gathers light to create a [magnified] picture. Early telescopes were simple [optical] devices.",
    // Let's make the transcript have errors compared to audio
    // Audio: remote, image, optical
    // Text: distant, picture, visual
    // Wait, the user sees text and clicks wrong words.
    // Audio says "remote", text says "distant". "distant" is wrong (based on audio).
    // Let's follow standard PTE: text has some words different from audio.
    // I need to provide the 'display' text and mark which indices are wrong.
    // Let's redefine the data structure for HIW slightly in the component logic.
    // Here: transcript is the DISPLAY text. wrongWords are indices of words that differ from audioScript.
    // Actually, I'll just provide the display text and the audio script.
    // Audio: "The telescope is an instrument used to observe remote objects. It gathers light to create a magnified image."
    // Text: "The telescope is an instrument used to observe distant objects. It gathers light to create a magnified picture."
    // Wrong: distant (0), picture (1).
    // I'll manually construct the display text with errors.
    displayTranscript: "The telescope is an instrument used to observe distant objects. It gathers light to create a magnified picture. Early telescopes were simple visual devices.",
    wrongWords: [8, 16, 21] // distant(8), picture(16), visual(21) (0-indexed words)
  },
  {
    id: "hiw-2",
    type: "HIW",
    title: "Marketing Strategy",
    audioScript: "Effective marketing requires understanding your target audience. You must identify their needs and preferences to tailor your message appropriately.",
    displayTranscript: "Effective marketing requires understanding your target market. You must identify their needs and choices to tailor your message appropriately.",
    wrongWords: [6, 12] // market(6) vs audience, choices(12) vs preferences
  },
  {
    id: "hiw-3",
    type: "HIW",
    title: "Geology",
    audioScript: "Volcanoes are formed when magma from within the Earth's upper mantle works its way to the surface. At the surface, it erupts to form lava flows and ash deposits.",
    displayTranscript: "Volcanoes are formed when magma from within the Earth's upper crust works its way to the surface. At the surface, it explodes to form lava flows and ash deposits.",
    wrongWords: [10, 19] // crust(10) vs mantle, explodes(19) vs erupts
  },
  {
    id: "hiw-4",
    type: "HIW",
    title: "Computer Science",
    audioScript: "Algorithms are step-by-step procedures for calculations. They are used for data processing, automated reasoning, and other tasks.",
    displayTranscript: "Algorithms are step-by-step instructions for calculations. They are used for data processing, automated thinking, and other tasks.",
    wrongWords: [3, 13] // instructions(3) vs procedures, thinking(13) vs reasoning
  },
  {
    id: "hiw-5",
    type: "HIW",
    title: "Psychology",
    audioScript: "Memory is the faculty of the brain by which data or information is encoded, stored, and retrieved when needed.",
    displayTranscript: "Memory is the faculty of the mind by which data or information is encoded, kept, and retrieved when needed.",
    wrongWords: [6, 15] // mind(6) vs brain, kept(15) vs stored
  },
  {
    id: "hiw-6",
    type: "HIW",
    title: "Architecture",
    audioScript: "Modern architecture emphasizes function and simplicity. It often uses industrial materials like glass, steel, and concrete.",
    displayTranscript: "Modern architecture emphasizes form and simplicity. It often uses industrial materials like glass, iron, and concrete.",
    wrongWords: [3, 14] // form(3) vs function, iron(14) vs steel
  },
  {
    id: "hiw-7",
    type: "HIW",
    title: "Economics",
    audioScript: "Supply and demand is an economic model of price determination in a market. It postulates that in a competitive market, unit price will vary until it settles at a point.",
    displayTranscript: "Supply and demand is an economic theory of price determination in a market. It postulates that in a competitive market, unit cost will vary until it settles at a point.",
    wrongWords: [6, 17] // theory(6) vs model, cost(17) vs price
  },
  {
    id: "hiw-8",
    type: "HIW",
    title: "Chemistry",
    audioScript: "A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another.",
    displayTranscript: "A chemical reaction is a process that leads to the physical transformation of one set of chemical substances to another.",
    wrongWords: [10] // physical(10) vs chemical
  },
  {
    id: "hiw-9",
    type: "HIW",
    title: "Literature",
    audioScript: "A novel is a long, fictional narrative which describes intimate human experiences. The novel in the modern era usually makes use of a literary prose style.",
    displayTranscript: "A novel is a long, fictional story which describes intimate human experiences. The novel in the modern era usually makes use of a literary prose format.",
    wrongWords: [5, 25] // story(5) vs narrative, format(25) vs style
  },
  {
    id: "hiw-10",
    type: "HIW",
    title: "Physics",
    audioScript: "Energy is the quantitative property that must be transferred to a body or physical system to perform work on the body, or to heat it.",
    displayTranscript: "Energy is the quantitative property that must be transferred to a body or physical object to perform work on the body, or to heat it.",
    wrongWords: [14] // object(14) vs system
  },
  {
    id: "hiw-11",
    type: "HIW",
    title: "Climate Change and Biodiversity",
    audioScript: "The accelerating pace of climate change poses unprecedented challenges to global biodiversity and ecosystem stability. Rising temperatures are forcing species to migrate toward higher latitudes and elevations in search of suitable habitats, disrupting established ecological relationships that have evolved over millennia. Marine ecosystems are particularly vulnerable, with coral bleaching events becoming more frequent and severe as ocean temperatures rise and acidification increases. Scientists have documented significant shifts in the timing of seasonal events, such as flowering and migration patterns, which can lead to mismatches between species and their food sources. Conservation efforts must now incorporate climate projections into habitat protection strategies, acknowledging that the geographic ranges of many species will shift dramatically over the coming decades.",
    displayTranscript: "The accelerating pace of climate change poses unprecedented challenges to global biodiversity and ecosystem balance. Rising temperatures are forcing species to migrate toward higher altitudes and elevations in search of suitable habitats, disrupting established ecological relationships that have developed over millennia. Marine ecosystems are particularly sensitive, with coral bleaching events becoming more frequent and severe as ocean temperatures rise and acidification increases. Scientists have documented significant changes in the timing of seasonal events, such as flowering and migration patterns, which can lead to mismatches between species and their food sources. Conservation efforts must now incorporate climate predictions into habitat protection strategies, acknowledging that the geographic ranges of many species will shift dramatically over the coming decades.",
    wrongWords: [16, 25, 42, 53, 76, 94] // balance(16) vs stability, altitudes(25) vs latitudes, developed(42) vs evolved, sensitive(53) vs vulnerable, changes(76) vs shifts, predictions(94) vs projections
  },

  // 7. Write From Dictation (10 items)
  {
    id: "wfd-1",
    type: "WFD",
    title: "Course Registration",
    audioScript: "Please make sure you have registered for the course before the deadline.",
    correctAnswer: "Please make sure you have registered for the course before the deadline."
  },
  {
    id: "wfd-2",
    type: "WFD",
    title: "Campus Parking",
    audioScript: "Car parking permits can be obtained from the student service centre.",
    correctAnswer: "Car parking permits can be obtained from the student service centre."
  },
  {
    id: "wfd-3",
    type: "WFD",
    title: "Research Paper",
    audioScript: "Your research paper should include a comprehensive literature review.",
    correctAnswer: "Your research paper should include a comprehensive literature review."
  },
  {
    id: "wfd-4",
    type: "WFD",
    title: "Office Hours",
    audioScript: "Professor Smith will hold office hours on Tuesdays and Thursdays.",
    correctAnswer: "Professor Smith will hold office hours on Tuesdays and Thursdays."
  },
  {
    id: "wfd-5",
    type: "WFD",
    title: "Graduation Ceremony",
    audioScript: "The graduation ceremony will be held in the grand hall next month.",
    correctAnswer: "The graduation ceremony will be held in the grand hall next month."
  },
  {
    id: "wfd-6",
    type: "WFD",
    title: "Online Portal",
    audioScript: "You can access the lecture notes through the university's online portal.",
    correctAnswer: "You can access the lecture notes through the university's online portal."
  },
  {
    id: "wfd-7",
    type: "WFD",
    title: "Group Project",
    audioScript: "Collaboration is essential for the success of this group project.",
    correctAnswer: "Collaboration is essential for the success of this group project."
  },
  {
    id: "wfd-8",
    type: "WFD",
    title: "Financial Aid",
    audioScript: "Financial aid applications must be submitted by the end of the semester.",
    correctAnswer: "Financial aid applications must be submitted by the end of the semester."
  },
  {
    id: "wfd-9",
    type: "WFD",
    title: "Guest Speaker",
    audioScript: "A renowned scientist will be delivering a guest lecture tomorrow.",
    correctAnswer: "A renowned scientist will be delivering a guest lecture tomorrow."
  },
  {
    id: "wfd-10",
    type: "WFD",
    title: "Library Fine",
    audioScript: "Overdue books will incur a daily fine until they are returned.",
    correctAnswer: "Overdue books will incur a daily fine until they are returned."
  }
];
