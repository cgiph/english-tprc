import imgRenewable from "@assets/generated_images/bar_chart_showing_global_renewable_energy_consumption_trends.png";
import imgPopulation from "@assets/generated_images/line_graph_depicting_population_growth_in_urban_vs_rural_areas.png";
import imgSmartphone from "@assets/generated_images/pie_chart_illustrating_smartphone_market_share_by_brand.png";
import imgWaterCycle from "@assets/generated_images/process_diagram_showing_the_water_cycle.png";
import imgTemp from "@assets/generated_images/line_graph_showing_global_temperature_rise_over_a_century.png";
import imgEnrollment from "@assets/generated_images/pie_chart_of_student_major_distribution.png";
import imgButterfly from "@assets/generated_images/diagram_of_butterfly_life_cycle_stages.png";
import imgInternet from "@assets/generated_images/bar_chart_of_internet_usage_by_age_group.png";
import imgLibraryMap from "@assets/generated_images/map_comparing_library_floor_plan_2010_vs_2025.png";
import imgRecycle from "@assets/generated_images/diagram_of_plastic_recycling_lifecycle.png";

export type SpeakingTaskType = 
  | "Read Aloud" 
  | "Repeat Sentence" 
  | "Describe Image" 
  | "Retell Lecture" 
  | "Answer Short Question"
  | "Summarize Group Discussion" 
  | "Respond to a Situation";

export type SpeakingQuestion = {
  id: string;
  type: SpeakingTaskType;
  title?: string;
  content: string; // The text to read, the sentence to repeat, or the prompt/situation
  audioScript?: string; // For Retell Lecture / Summarize Group Discussion
  imageUrl?: string; // For Describe Image
  durationSeconds?: number; // Estimated duration of the audio in seconds
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
    { id: "di-5", type: "Describe Image", title: "Global Temperature Rise", content: "Describe the graph showing average temperature increase over the last century.", imageUrl: imgTemp },
    { id: "di-6", type: "Describe Image", title: "University Enrollment", content: "Describe the chart showing enrollment numbers by department.", imageUrl: imgEnrollment },
    { id: "di-7", type: "Describe Image", title: "Life Cycle of a Butterfly", content: "Describe the diagram showing the life stages of a butterfly.", imageUrl: imgButterfly },
    { id: "di-8", type: "Describe Image", title: "Internet Usage by Age", content: "Describe the bar chart showing internet usage across age groups.", imageUrl: imgInternet },
    { id: "di-9", type: "Describe Image", title: "Library Floor Plan", content: "Describe the layout of the university library.", imageUrl: imgLibraryMap },
    { id: "di-10", type: "Describe Image", title: "Steps to Recycle", content: "Describe the flow chart showing the recycling process.", imageUrl: imgRecycle }
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
  "Answer Short Question": [
    { id: "asq-1", type: "Answer Short Question", content: "What do you call a person who writes books?", audioScript: "Author" },
    { id: "asq-2", type: "Answer Short Question", content: "Which month comes after June?", audioScript: "July" },
    { id: "asq-3", type: "Answer Short Question", content: "What is the opposite of hot?", audioScript: "Cold" },
    { id: "asq-4", type: "Answer Short Question", content: "What is the frozen form of water?", audioScript: "Ice" },
    { id: "asq-5", type: "Answer Short Question", content: "How many days are in a leap year?", audioScript: "366" },
    { id: "asq-6", type: "Answer Short Question", content: "What instrument is used to measure temperature?", audioScript: "Thermometer" },
    { id: "asq-7", type: "Answer Short Question", content: "What is the joint between the upper and lower arm?", audioScript: "Elbow" },
    { id: "asq-8", type: "Answer Short Question", content: "What do bees collect from flowers?", audioScript: "Nectar / Pollen" },
    { id: "asq-9", type: "Answer Short Question", content: "Which organ pumps blood throughout the body?", audioScript: "Heart" },
    { id: "asq-10", type: "Answer Short Question", content: "What is the study of stars and planets called?", audioScript: "Astronomy" }
  ],
  "Summarize Group Discussion": [
    {
      id: "sgd-1",
      type: "Summarize Group Discussion",
      title: "Impact of Artificial Intelligence on Education",
      content: "Summarize the discussion between three speakers about the role of AI in education.",
      audioScript: "Moderator: Welcome everyone. Today we're discussing the integration of Artificial Intelligence in higher education. Professor Chen, let's start with you. Some argue AI tools are undermining critical thinking skills in students. What is your perspective on this growing concern?\n\nProfessor Chen: That's a valid concern, but I believe it's a bit shortsighted. While there is a risk of students over-relying on AI for essay writing, the technology also offers unprecedented opportunities for personalized learning. AI tutors can provide 24/7 support, adapting to each student's pace and learning style in a way that a single human instructor simply cannot manage for a class of hundreds. The key is not banning these tools, but redesigning our assessment methods to focus on analysis and synthesis rather than rote information retrieval.\n\nStudent Rep: As a student, I have to agree with Professor Chen. The reality is that we will be using these tools in the workforce. Ignoring them now puts us at a disadvantage later. However, I do worry about the equity issue. Premium AI tools are expensive. If universities don't provide access to everyone, we risk creating a two-tiered system where wealthy students have a significant technological edge over their peers who can't afford subscriptions.\n\nModerator: That's an excellent point about the digital divide. Professor, how do universities address this cost barrier?\n\nProfessor Chen: It's a challenge. Ideally, institutions should license these tools for all students, treating them like library resources. But budgets are tight. We might need to look at open-source alternatives or government grants to ensure a level playing field.\n\nStudent Rep: Exactly. Also, we need more guidance on ethics. Many students are unsure about where the line is between 'assistance' and 'plagiarism' when using AI. Clearer policies would actually help us use these tools more responsibly.",
      durationSeconds: 110
    },
    {
      id: "sgd-2",
      type: "Summarize Group Discussion",
      title: "Sustainable Urban Planning",
      content: "Summarize the discussion regarding the new city development plan.",
      audioScript: "City Planner: Thank you for joining this town hall meeting. We are here to finalize the proposal for the Green District redevelopment. The current plan prioritizes pedestrian zones and public transit, aiming to reduce private car usage in the city center by 60% over the next five years. We believe this is crucial for meeting our carbon neutrality goals.\n\nBusiness Owner: I understand the environmental goals, and I support them in principle. However, as a local business owner, I'm very concerned about the economic impact. If you remove all the street parking and restrict vehicle access, my customers from the suburbs won't be able to reach my store easily. We're already struggling with inflation; this could be the nail in the coffin for small businesses in the area.\n\nResident: I hear your concerns, but we also have to think about the livability of the neighborhood. Right now, the noise and pollution levels are unbearable. My children can't play outside safely. A walkable city center would actually attract more foot traffic, which studies show often benefits local retail more than car traffic does. People linger longer and spend more when they aren't rushing back to a parking meter.\n\nCity Planner: That is what the data suggests. To address the business concerns, the plan includes a new park-and-ride facility on the outskirts with a free electric shuttle loop every 5 minutes. This should actually make it easier for suburban visitors to get here without the stress of finding parking downtown.\n\nBusiness Owner: Well, a shuttle sounds good in theory, but it adds travel time. Unless it's incredibly efficient, people will just go to the shopping malls with big parking lots instead. I'd like to see a guarantee or a tax break for businesses during the transition period.\n\nResident: A tax break seems fair. We all want a thriving community, not empty storefronts. But we can't compromise on air quality anymore.",
      durationSeconds: 125
    },
    {
      id: "sgd-3",
      type: "Summarize Group Discussion",
      title: "Remote Work Policies",
      content: "Summarize the discussion about the company's future work policy.",
      audioScript: "HR Director: As you know, we're reviewing our remote work policy for the upcoming year. The executive team is pushing for a 'Return to Office' mandate, requiring four days a week on-site. They feel that collaboration and company culture have suffered during the fully remote period.\n\nTeam Lead: I have to push back on that. My team's productivity has actually increased by 20% since we went remote. We have developers across three different time zones. Forcing them into an office isn't just logistical nonsense; it's going to cause a mass exodus. I've already had two senior engineers tell me they'll resign if we mandate a full return.\n\nOperations Manager: I see both sides. From an operations standpoint, maintaining our physical office space is a huge overhead cost if it's only 10% occupied. But we also have departments, like hardware testing, that simply cannot function remotely. There's a feeling of unfairness building up between the on-site essential staff and the remote workers. We need a policy that feels equitable.\n\nHR Director: That friction is exactly what leadership is worried about. But risking a talent drain is also dangerous. What if we proposed a 'Team-Anchor' model? Instead of a company-wide mandate, each team decides on 1 or 2 specific days per month for in-person collaboration, while keeping the rest flexible.\n\nTeam Lead: That's much more reasonable. It allows for that 'culture building' face-time without destroying the work-life balance people have built their lives around. It treats employees like adults.\n\nOperations Manager: It might work, provided we can sublease some of the unused office floors to reduce costs. And we'd need to ensure the on-site days are actually used for meaningful collaboration, not just sitting on Zoom calls from a cubicle.",
      durationSeconds: 115
    },
    {
      id: "sgd-4",
      type: "Summarize Group Discussion",
      title: "University Funding Allocation",
      content: "Summarize the discussion on how to allocate the new government grant.",
      audioScript: "Dean: We have received a significant government grant of $2 million, specifically earmarked for 'Campus Modernization'. The board is split on how to best utilize these funds. One faction wants to build a new state-of-the-art sports complex to attract more undergraduates. The other side argues we should renovate the science laboratories, which are decades old.\n\nHead of Sciences: It shouldn't even be a debate. Our chemistry labs are a safety hazard at this point. Ventilation is poor, and equipment is outdated. We are losing top research grants because our facilities aren't up to standard. A sports complex is a luxury; safe and functional labs are a necessity for a research university.\n\nAthletics Director: I disagree with the characterization of sports as a 'luxury'. Athletics brings in alumni donations and school spirit, which indirectly funds academics. Enrollment is down 5% this year. A new stadium would boost our visibility and appeal to prospective students who are looking for a holistic college experience, not just a degree factory.\n\nDean: Both valid points. But we must consider the grant's stipulations. It mentions 'modernization'. Could we potentially split the funds? Or perhaps renovate the labs now and launch a separate fundraising campaign for the sports complex?\n\nHead of Sciences: Splitting the money would result in two half-finished projects that satisfy no one. $1 million isn't enough to properly overhaul the labs. We need to prioritize academic integrity. If we can't do research, we aren't a university.\n\nAthletics Director: Maybe there's a compromise. What if we use the funds for the labs, but commit a percentage of future patent royalties from that research towards the athletics fund? That aligns our interests.",
      durationSeconds: 110
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