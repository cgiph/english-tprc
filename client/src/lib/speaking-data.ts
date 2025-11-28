import imgRenewable from "@assets/generated_images/bar_chart_showing_global_renewable_energy_consumption_trends.png";
import imgPopulation from "@assets/generated_images/line_graph_depicting_population_growth_in_urban_vs_rural_areas.png";
import imgSmartphone from "@assets/generated_images/pie_chart_illustrating_smartphone_market_share_by_brand.png";
import imgWaterCycle from "@assets/generated_images/process_diagram_showing_the_water_cycle.png";

export type SpeakingTaskType = 
  | "Read Aloud" 
  | "Repeat Sentence" 
  | "Describe Image" 
  | "Retell Lecture" 
  | "Summarize Group Discussion" 
  | "Respond to a Situation";

export type SpeakingQuestion = {
  id: string;
  type: SpeakingTaskType;
  title?: string;
  content: string; // The text to read, the sentence to repeat, or the prompt/situation
  audioScript?: string; // For Retell Lecture / Summarize Group Discussion
  imageUrl?: string; // For Describe Image
};

export const SPEAKING_QUESTIONS: Record<SpeakingTaskType, SpeakingQuestion[]> = {
  "Read Aloud": [
    {
      id: "ra-1",
      type: "Read Aloud",
      content: "The development of sustainable energy sources is no longer a choice but a necessity. As fossil fuels deplete and the effects of climate change become more pronounced, nations worldwide are racing to implement green technologies that can power our future without compromising the environment."
    },
    {
      id: "ra-2",
      type: "Read Aloud",
      content: "Urban planning has evolved significantly over the last century. Modern architects focus not only on the aesthetic appeal of buildings but also on their functionality and environmental impact, creating spaces that promote community interaction and mental well-being."
    },
    {
      id: "ra-3",
      type: "Read Aloud",
      content: "Artificial intelligence is transforming the healthcare industry at an unprecedented rate. From diagnosing rare diseases with high accuracy to personalizing treatment plans for patients, AI algorithms are assisting doctors in making better-informed decisions that save lives."
    },
    {
      id: "ra-4",
      type: "Read Aloud",
      content: "The migration patterns of birds have fascinated scientists for decades. Recent studies utilizing satellite tracking have revealed that these journeys are even more complex than previously thought, with some species traveling thousands of miles without stopping for rest."
    },
    {
      id: "ra-5",
      type: "Read Aloud",
      content: "Economic stability is often linked to the quality of a nation's education system. Countries that invest heavily in primary and secondary education tend to have more innovative workforces, leading to higher productivity and sustained long-term economic growth."
    },
    {
      id: "ra-6",
      type: "Read Aloud",
      content: "History teaches us that civilizations rise and fall based on their ability to adapt to changing circumstances. Those societies that were rigid and resistant to change often collapsed, while those that embraced innovation and cultural exchange thrived for centuries."
    },
    {
      id: "ra-7",
      type: "Read Aloud",
      content: "The human brain is capable of remarkable plasticity, meaning it can reorganize itself by forming new neural connections. This ability allows us to learn new skills, recover from injuries, and adapt to new environments throughout our entire lives."
    },
    {
      id: "ra-8",
      type: "Read Aloud",
      content: "Globalization has made the world smaller, connecting people from diverse cultures through technology and trade. While this has brought economic benefits, it has also raised concerns about the preservation of local traditions and languages in an increasingly homogenized world."
    },
    {
      id: "ra-9",
      type: "Read Aloud",
      content: "Water scarcity is emerging as one of the most critical challenges of the 21st century. With growing populations and changing climate patterns, effective water management strategies are essential to ensure that all communities have access to clean and safe drinking water."
    },
    {
      id: "ra-10",
      type: "Read Aloud",
      content: "The study of psychology provides insights into human behavior and mental processes. By understanding why we think and act the way we do, we can develop better methods for treating mental health disorders and improving interpersonal relationships in society."
    }
  ],
  "Repeat Sentence": [
    { id: "rs-1", type: "Repeat Sentence", content: "The lecture on modern art has been cancelled for today." },
    { id: "rs-2", type: "Repeat Sentence", content: "Students are required to submit their assignments by Friday noon." },
    { id: "rs-3", type: "Repeat Sentence", content: "The library will be closed for renovations until next month." },
    { id: "rs-4", type: "Repeat Sentence", content: "Global warming is a serious threat to the planet's biodiversity." },
    { id: "rs-5", type: "Repeat Sentence", content: "Please make sure your mobile phones are turned off during the exam." },
    { id: "rs-6", type: "Repeat Sentence", content: "The research paper must include a bibliography and proper citations." },
    { id: "rs-7", type: "Repeat Sentence", content: "Most of the students in this class are from international backgrounds." },
    { id: "rs-8", type: "Repeat Sentence", content: "The university offers a wide range of extracurricular activities." },
    { id: "rs-9", type: "Repeat Sentence", content: "Economic theories are often difficult to apply in real-world situations." },
    { id: "rs-10", type: "Repeat Sentence", content: "You need to register for the course before the semester begins." }
  ],
  "Describe Image": [
    { id: "di-1", type: "Describe Image", title: "Renewable Energy Trends", content: "Describe the bar chart showing renewable energy consumption.", imageUrl: imgRenewable },
    { id: "di-2", type: "Describe Image", title: "Urban vs Rural Population", content: "Describe the line graph comparing population growth.", imageUrl: imgPopulation },
    { id: "di-3", type: "Describe Image", title: "Smartphone Market Share", content: "Describe the pie chart illustrating market share.", imageUrl: imgSmartphone },
    { id: "di-4", type: "Describe Image", title: "The Water Cycle", content: "Describe the process diagram of the water cycle.", imageUrl: imgWaterCycle },
    { id: "di-5", type: "Describe Image", title: "Global Temperature Rise", content: "Describe the graph showing average temperature increase over the last century.", imageUrl: "https://placehold.co/600x400?text=Global+Temperature+Graph" },
    { id: "di-6", type: "Describe Image", title: "University Enrollment", content: "Describe the chart showing enrollment numbers by department.", imageUrl: "https://placehold.co/600x400?text=University+Enrollment+Chart" },
    { id: "di-7", type: "Describe Image", title: "Life Cycle of a Butterfly", content: "Describe the diagram showing the life stages of a butterfly.", imageUrl: "https://placehold.co/600x400?text=Butterfly+Life+Cycle" },
    { id: "di-8", type: "Describe Image", title: "Internet Usage by Age", content: "Describe the bar chart showing internet usage across age groups.", imageUrl: "https://placehold.co/600x400?text=Internet+Usage+Stats" },
    { id: "di-9", type: "Describe Image", title: "Library Floor Plan", content: "Describe the layout of the university library.", imageUrl: "https://placehold.co/600x400?text=Library+Map" },
    { id: "di-10", type: "Describe Image", title: "Steps to Recycle", content: "Describe the flow chart showing the recycling process.", imageUrl: "https://placehold.co/600x400?text=Recycling+Process" }
  ],
  "Retell Lecture": [
    { 
      id: "rl-1", 
      type: "Retell Lecture", 
      title: "The History of Coffee",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Today we are looking at the origins of coffee. It was originally discovered in Ethiopia, where legends say a goat herder noticed his goats becoming energetic after eating certain berries. From Africa, it spread to the Middle East and then to Europe in the 17th century. Coffee houses became centers for intellectual exchange, often called 'Penny Universities' because for the price of a penny, one could buy coffee and join the conversation."
    },
    { 
      id: "rl-2", 
      type: "Retell Lecture", 
      title: "Urbanization Impacts",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Urbanization is the mass movement of populations from rural to urban settings. While it drives economic growth, it creates challenges like overcrowding, pollution, and strain on infrastructure. Cities must adapt by investing in green transport and sustainable housing to maintain a high quality of life for residents."
    },
    { 
      id: "rl-3", 
      type: "Retell Lecture", 
      title: "Marine Biology",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Coral reefs are often called the rainforests of the sea. They support 25% of all marine life despite covering less than 1% of the ocean floor. However, rising ocean temperatures are causing coral bleaching, a phenomenon where corals expel the algae living in their tissues, turning them white and leaving them vulnerable to disease."
    },
    { 
      id: "rl-4", 
      type: "Retell Lecture", 
      title: "Space Exploration",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: The future of space exploration lies in Mars. Scientists are currently developing technologies to sustain human life on the Red Planet. The biggest challenges include radiation exposure, the psychological effects of isolation, and the need for sustainable food and water sources."
    },
    { 
      id: "rl-5", 
      type: "Retell Lecture", 
      title: "Digital Marketing",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Traditional marketing is being rapidly replaced by digital strategies. Social media algorithms now dictate what consumers see. The key to successful digital marketing is not just reaching a large audience, but engaging with the right audience through personalized content and data-driven insights."
    },
    { 
      id: "rl-6", 
      type: "Retell Lecture", 
      title: "Renewable Energy",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Solar power is becoming the cheapest form of electricity in history. The efficiency of photovoltaic cells has doubled in the last decade. However, the main issue remains storage; we need better battery technology to store energy for use when the sun isn't shining."
    },
    { 
      id: "rl-7", 
      type: "Retell Lecture", 
      title: "Linguistics",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Language evolution is a natural process. New words enter the lexicon through technology and cultural exchange, while older words fade away. This fluidity is a sign of a healthy, living language, not a degradation of standards as some purists might argue."
    },
    { 
      id: "rl-8", 
      type: "Retell Lecture", 
      title: "Artificial Intelligence",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: AI is not just about robots. It's about machine learning models that can predict patterns. In finance, AI detects fraud. In healthcare, it predicts patient outcomes. The ethical concern is bias; if the data fed into the AI is biased, the results will be too."
    },
    { 
      id: "rl-9", 
      type: "Retell Lecture", 
      title: "Architecture",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Brutalist architecture emerged in the 1950s, characterized by raw concrete and geometric shapes. While often criticized for being cold, it was originally intended to be honest and egalitarian, showcasing the materials without decoration."
    },
    { 
      id: "rl-10", 
      type: "Retell Lecture", 
      title: "Psychology of Sleep",
      content: "Listen to the lecture and retell the key points.",
      audioScript: "Speaker: Sleep is vital for memory consolidation. During REM sleep, the brain processes information gathered during the day. Chronic sleep deprivation is linked to cognitive decline and a weakened immune system, highlighting the importance of getting 7-9 hours of rest."
    }
  ],
  "Summarize Group Discussion": [
    {
      id: "sgd-1",
      type: "Summarize Group Discussion",
      title: "Project Deadline",
      content: "Summarize the discussion between three students about their group project.",
      audioScript: "Person A: I think we should focus on the research part first. Person B: But the deadline is in two days, we need to start writing the report now! Person C: Let's split the work. A, you do the research. B and I will start drafting the introduction and conclusion. That way we cover both bases."
    },
    {
      id: "sgd-2",
      type: "Summarize Group Discussion",
      title: "Choosing a Major",
      content: "Summarize the discussion about choosing a university major.",
      audioScript: "Student 1: I'm torn between Computer Science and Art History. Student 2: Computer Science has better job prospects, but Art History is your passion. Student 3: Why not do a double major? It's more work, but you won't have to sacrifice either interest."
    },
    {
      id: "sgd-3",
      type: "Summarize Group Discussion",
      title: "Campus Parking",
      content: "Summarize the discussion about the new parking policy.",
      audioScript: "Admin: We are increasing parking fees to encourage public transport. Student Rep: But many students commute from far away where buses don't run. Admin: We are introducing a shuttle service from the main train station to bridge that gap."
    },
    {
      id: "sgd-4",
      type: "Summarize Group Discussion",
      title: "Online Learning",
      content: "Summarize the discussion on the pros and cons of online classes.",
      audioScript: "Teacher: Do you prefer Zoom classes? Student 1: I like the flexibility, I can watch lectures anytime. Student 2: I miss the social interaction. It's hard to make friends through a screen. Teacher: We need to find a hybrid balance."
    },
    {
      id: "sgd-5",
      type: "Summarize Group Discussion",
      title: "Healthy Eating",
      content: "Summarize the discussion about the cafeteria menu.",
      audioScript: "Manager: We want to remove soda from the menu. Student: That's a bit extreme. Maybe just offer healthier alternatives? Manager: We could replace sugary drinks with flavored water and fresh juices at a lower price."
    },
    {
      id: "sgd-6",
      type: "Summarize Group Discussion",
      title: "Budgeting",
      content: "Summarize the discussion about the club's budget.",
      audioScript: "Treasurer: We are running low on funds for the annual party. President: Can we increase the membership fee? Member: That might scare away new members. Let's do a fundraising bake sale instead."
    },
    {
      id: "sgd-7",
      type: "Summarize Group Discussion",
      title: "Library Noise",
      content: "Summarize the discussion about noise levels in the library.",
      audioScript: "Librarian: We've had complaints about noise on the second floor. Student: It's the group study area, people need to talk. Librarian: Perhaps we should install soundproof glass partitions to separate the study pods from the reading area."
    },
    {
      id: "sgd-8",
      type: "Summarize Group Discussion",
      title: "Internships",
      content: "Summarize the discussion about finding internships.",
      audioScript: "Advisor: You should start applying now for summer internships. Student: I don't have enough experience yet. Advisor: Internships are for gaining experience. Focus on your soft skills and willingness to learn in your cover letter."
    },
    {
      id: "sgd-9",
      type: "Summarize Group Discussion",
      title: "Climate Action",
      content: "Summarize the discussion about the university's carbon footprint.",
      audioScript: "Activist: The university uses too much plastic. Admin: We are switching to biodegradable packaging next month. Activist: That's a start, but we also need to look at energy consumption in the dorms."
    },
    {
      id: "sgd-10",
      type: "Summarize Group Discussion",
      title: "Exam Stress",
      content: "Summarize the discussion about managing exam stress.",
      audioScript: "Counselor: It's important to take breaks. Student: But I feel guilty when I'm not studying. Counselor: Think of rest as part of the study process. Your brain needs time to absorb the information."
    }
  ],
  "Respond to a Situation": [
    {
      id: "rts-1",
      type: "Respond to a Situation",
      title: "Lost ID Card",
      content: "You have lost your student ID card and you have an exam in 30 minutes. You are at the student services desk. Explain your situation to the receptionist and ask for a temporary pass."
    },
    {
      id: "rts-2",
      type: "Respond to a Situation",
      title: "Late Assignment",
      content: "You were sick for the past three days and could not complete your assignment on time. You are speaking to your professor. Apologize for the delay and ask for a 2-day extension."
    },
    {
      id: "rts-3",
      type: "Respond to a Situation",
      title: "Library Fine",
      content: "You are returning a book to the library but you are one week late. The librarian tells you there is a fine. Explain that you were out of town for a family emergency and ask if the fine can be waived."
    },
    {
      id: "rts-4",
      type: "Respond to a Situation",
      title: "Roommate Issue",
      content: "Your roommate plays loud music late at night which disturbs your sleep. You are talking to your roommate. Politely explain the problem and suggest a compromise."
    },
    {
      id: "rts-5",
      type: "Respond to a Situation",
      title: "Wrong Order",
      content: "You ordered a vegetarian meal at the campus cafe, but they served you a chicken burger. You are at the counter. Point out the mistake and ask for a replacement."
    },
    {
      id: "rts-6",
      type: "Respond to a Situation",
      title: "Missed Group Meeting",
      content: "You missed a scheduled group project meeting because your bus broke down. You are speaking to your group members. Apologize for your absence and ask what you missed."
    },
    {
      id: "rts-7",
      type: "Respond to a Situation",
      title: "Course Registration",
      content: "You are trying to register for a course, but the system says it is full. You really need this course to graduate. Speak to the course coordinator and ask if they can squeeze you in."
    },
    {
      id: "rts-8",
      type: "Respond to a Situation",
      title: "Damaged Equipment",
      content: "You accidentally dropped a beaker in the chemistry lab and it broke. You are speaking to the lab supervisor. Admit your mistake and ask how you can pay for the replacement."
    },
    {
      id: "rts-9",
      type: "Respond to a Situation",
      title: "Giving Directions",
      content: "A new student asks you where the main auditorium is. You know it is next to the library, past the cafeteria. Give them clear directions."
    },
    {
      id: "rts-10",
      type: "Respond to a Situation",
      title: "Scheduling Conflict",
      content: "You have two exams scheduled at the same time on the same day. You are at the exam office. Explain the conflict to the officer and ask to reschedule one of them."
    }
  ]
};