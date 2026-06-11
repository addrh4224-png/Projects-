import { QuizQuestion, VocabWord } from "./types";

export const SAMPLE_EXAMS = [
  {
    id: "diploma-2022-sem2-s1",
    title: "Diploma, Core Sem 2 (2021/2022 - First Session)",
    description: "Contains authentic exercises focusing on safety professionals, London Marathon, robotic assembly kits, and William Kamkwamba windmill project.",
    rawText: `
GRADE TWELVE MARKING GUIDE
ENGLISH LANGUAGE 'ELECTIVE' SEMESTER TWO, 2021/2022, FIRST SESSION
LISTENING 1 (10 mks)
Assigned values and notes: responses must be indicated clearly.
Task One: June, October, December. 27th, 29th, 30th.
Task Two: Whale-watching boat trips - only 5/five boats.
Other attractions: local food, art and craft stands, music bands.
Sport activities: marathons, bike races, athletics.
Events for children: magic shows, fairground rides, watch movies/films/wildlife at Whale Museum.

LISTENING 2 (10 mks)
11. Microsoft 12. Nepal/(poor)village/country/Asia 13. charity/donors/organisations 14. support children's literacy/provide books.
15. 1999/nineteen ninety nine 16. schools and libraries.

READING 1 (12 mks)
21. Egypt 22. 1752/seventeen fifty two 23. To develop new medicines/improve animal health.
24. stuck in enclosed areas all the time/forced to behave unnaturally.
25. Endangered animals/wild animals in danger of extinction.
26. Hunters/Predators/Loss of natural habitat/breeding difficulty.
27. To increase genetic diversity.

Online versus Face-to-Face Job Interviews:
Since 2020, online job interviews have become very common due to social distancing.
The CEO of a famous health company in Switzerland stated that face-to-face interviews can be problematic and stressful.
German companies will only conduct interviews online to reduce costs.
An average face-to-face interview costs $4,129. The cost of online interviews is only $100.
    `
  },
  {
    id: "diploma-2021-sem2-s1",
    title: "Diploma, Core Sem 2 (2020/2021 - First Session)",
    description: "Focusing on Maryam's COVID, Lizzie the Entrepreneur, Al Hoota cave, digital cameras, and medical tourism trends.",
    rawText: `
Diploma, English 'Core', End of Year Exam - First Session Academic Year: 2020/2021
LISTENING 1
1. Maryam is in the UK.
2. Maryam's father got infected with COVID 19.
3. Maryam suffers from stress during the total lockdown.
4. Maryam's university has moved to online learning.
5. Main challenge is submitting work on time.
6. Father promised to send money.
7. Maryam can't return home because airports are closed.

VOCABULARY & GRAMMAR
16. "You can start your presentation with a funny story to grab the audience's attention."
17. Latest statistics indicate that the number of social media users has rapidly increased.
18. The tourists were fascinated with the beautiful sites in Al Hoota cave in Al Hamra.
19. Farah was the only candidate to win a prize.
20. Ahmed felt that he would not be able to cope with the new job.

Medical Tourism:
Medical tourism has become very popular nowadays. A report by 'Patients Beyond Borders' shows eight million patients travelled abroad in 2019.
Surgery prices are 30% to 70% lower in India, Thailand and Turkey.
Malaysia comes at the top of the popular medical destinations. Brazil is second.
    `
  },
  {
    id: "mussa-experience-series-g12b",
    title: "Mussa Experience Series (Grade 12B Study Kit)",
    description: "Authentic workbook unit vocabulary and drills: Reported Speech grammar keys, Adjectives ending in -ed/-ing, and Titanic glossary terms.",
    rawText: `
Grade 12B Experience "series" Prepared by : Mohamed Mussa
Theme 1 Overview - News and the Media
Vocabulary List:
Literature (n) - pieces of writing that are valued , novels, plays
journalism(n) - collecting and writing news for newspapers, radio etc
The press(n) - Newspapers and magazines
transform(v) - Change or convert
Gather(v) - Collect information from different sources
headlines(n) - The title of a newspaper article printed in large letters
grab(v) - Seize. To hold sth with your hand firmly
celebrity(n) - A famous person
obsession(n) - Strong and unhealthy interest in someone or sth
politician(n) - A person whose job is concerned with politics
The paparazzi - photographers who chases famous people to get pics
Freelance(adj) - Working independently for different companies
chase(v) - To run or drive after sth to catch them
obsolete(adj) - No longer used because sth new has been invented
Endangered species - Species that are about to extinct
Pose to(v) - Create a threat, problem that has to be dealt with
disaster(n) - Very bad situation that causes problems
cyclone(n) - A violent tropical storm in which winds move in a circle
The media(n) - Ways of providing information as TV, radio , newspaper
review(v) - To write an article giving opinion on something new
aggressive(adj) - Behaving in a threatening way
arrest(v) - Take by the police
kidnap(v) - To take away sb illegally to get money
hijack(v) - Use violence to control a vehicle especially a plane

Oman Vision 2040 emphasizes high-speed digital technologies. 
We must promote environmental sustainability, solar panel energy, green recycle grids, and reduce climate carbon footprint.
    `
  }
];

export const AUTHENTIC_QUIZ: QuizQuestion[] = [
  // --- GRAMMAR MULTIPLE CHOICE ---
  {
    id: "g-1",
    sourceExam: "Mohamed Mussa Workbook",
    section: "GRAMMAR",
    question: "He ______________________ Dina that he was writing a letter.",
    options: ["said", "told", "asked", "talked"],
    correctAnswer: "told"
  },
  {
    id: "g-2",
    sourceExam: "Mohamed Mussa Workbook",
    section: "GRAMMAR",
    question: "Samir ___________________ that the helicopter was flying high.",
    options: ["told", "said to", "asked", "said"],
    correctAnswer: "said"
  },
  {
    id: "g-3",
    sourceExam: "Mohamed Mussa Workbook",
    section: "GRAMMAR",
    question: "Leila said that she _______________ TV then.",
    options: ["is watching", "watched", "was watching", "had watched"],
    correctAnswer: "was watching"
  },
  {
    id: "g-4",
    sourceExam: "Mohamed Mussa Workbook",
    section: "GRAMMAR",
    question: "He said that he _________________ his friend the following day.",
    options: ["will visit", "would visit", "is visiting", "visited"],
    correctAnswer: "would visit"
  },
  {
    id: "g-5",
    sourceExam: "Mohamed Mussa Workbook",
    section: "GRAMMAR",
    question: "He said that he ____________________ her playing the piano.",
    options: ["had seen", "has seen", "will see", "can see"],
    correctAnswer: "had seen"
  },
  {
    id: "g-6",
    sourceExam: "Mohamed Mussa Workbook",
    section: "GRAMMAR",
    question: "I asked her if _______________________ use the new camera.",
    options: ["I could", "could I", "can I", "are I"],
    correctAnswer: "I could"
  },
  {
    id: "g-7",
    sourceExam: "Mohamed Mussa Workbook",
    section: "GRAMMAR",
    question: "Farouk asked Osman why __________________________ late.",
    options: ["was she", "are you", "is he", "he was"],
    correctAnswer: "he was"
  },

  // --- VOCABULARY FILL THE GAP (AUTHENTIC DRIL) ---
  {
    id: "v-g-1",
    sourceExam: "Grade 12B Workbook",
    section: "VOCABULARY",
    question: "Complete: The police will arr _ _ _ the woman for shoplifting.",
    options: ["arrest", "arrival", "arrange", "arrive"],
    correctAnswer: "arrest"
  },
  {
    id: "v-g-2",
    sourceExam: "Grade 12B Workbook",
    section: "VOCABULARY",
    question: "Complete: The landlord is taking a le _ _ _ action against the tenant.",
    options: ["legal", "legacy", "learned", "leave"],
    correctAnswer: "legal"
  },
  {
    id: "v-g-3",
    sourceExam: "Grade 12B Workbook",
    section: "VOCABULARY",
    question: "Complete: Do you think that chat programmes violate your pri _ _ _ _ ?",
    options: ["privacy", "private", "pricing", "privilege"],
    correctAnswer: "privacy"
  },
  {
    id: "v-g-4",
    sourceExam: "Grade 12B Workbook",
    section: "VOCABULARY",
    question: "Complete: Land line phones are soon going to be obs _ _ _ _ _ .",
    options: ["obsolete", "observed", "obstacle", "obstructed"],
    correctAnswer: "obsolete"
  },
  {
    id: "v-g-5",
    sourceExam: "Grade 12B Workbook",
    section: "VOCABULARY",
    question: "Complete: Research on animals is an eth_ _ _ _ question.",
    options: ["ethical", "ethnic", "ether", "ethos"],
    correctAnswer: "ethical"
  },

  // --- TRUE/FALSE COMPREHENSION ---
  {
    id: "r-tf-1",
    sourceExam: "2021/2022 Exam Reading 1",
    section: "READING",
    text: "Green peace is a global environmental NGO that was founded in 1972. Green peace activists aim to protect the environment and to promote peace. Currently they are conducting a campaign to reduce chemical waste.",
    question: "Statement: Green peace is a governmental organization to help the environment.",
    options: ["True", "False"],
    correctAnswer: "False"
  },
  {
    id: "r-tf-2",
    sourceExam: "2021/2022 Exam Reading 1",
    section: "READING",
    text: "When he was eight years old, Amir Hussain lost both his arms in an accident at his family's sawmill. Now, at 26, he's mastered cricket and is the captain of the Kashmir para-cricket team.",
    question: "Statement: Amir lost his legs when he was eight years old.",
    options: ["True", "False"],
    correctAnswer: "False"
  },
  {
    id: "r-tf-3",
    sourceExam: "2021/2022 Exam Reading 1",
    section: "READING",
    text: "A famous Omani Travel Company based in Muscat. We need a Marketing expert who has GCC experience with a Driving License. Experience not less than four years. Contact: mmm72@gmail.com",
    question: "Statement: New graduates cannot apply to this vacant job.",
    options: ["True", "False"],
    correctAnswer: "True"
  },

  // --- WRITING PROMPTS ---
  {
    id: "w-p-1",
    sourceExam: "Narrative Essay Prompt",
    section: "WRITING",
    question: "Task: Write a story of at least 100 words based on: Two boys go fishing inside a small boat, their engine breaks down, storm starts brewing, fortunately a police boat is nearby seeing them through binoculars, throwing a strong rope to save them.",
    modelAnswer: `Rescue at the sea:
One afternoon, Ahmed and his friend, Salim, were fishing in a small boat. The sea was calm and peaceful. At last, they decided to go home.
However, when they tried to start the engine, it wouldn't work. They tried again and again, but it was no good. "It is broken," said Salim. "What shall we do?" I don't know replied Ahmed. But I think there is going to be a storm. Look at those heavy clouds over the mountains.
The boat began to drift out to sea. By this time, the waves were getting bigger and stronger. It began to rain. The boys were extremely worried and afraid.
Fortunately, an Omani police boat was nearby. One alert policeman saw the boys through his binoculars. "Look!" he said. "That boat is in trouble. We have to go and help."
The police boat drove quickly to the boys' boat and the police officers threw the boys a strong rope. Ahmed and Salim were very happy and relieved. They were safe again.`
  },
  {
    id: "w-p-2",
    sourceExam: "Vision 2040 Tech Dilemma Email Advice",
    section: "WRITING",
    question: "Task: Write an email to your classmate Ali, advising him to care more about electronic waste, showing why obsolete phones shouldn't be thrown in the household bin but recycled to conserve Omani environment.",
    modelAnswer: `Dear Ali,
I hope this email finds you well. I am writing to advise you about a very important environmental issue that affects our beloved Oman. Yesterday, you mentioned that you were going to throw your old, obsolete mobile phone into the standard garbage bin. 
Please do not do that! Electronic devices contain toxic chemicals, which can leak into the ground and pollute our clean water and soil. Instead, as responsible Omani citizens supporting Oman Vision 2040, we should take obsolete technology to certified e-waste recycling centers. This promotes sustainability and keeps our environment safe for future generations.
Let me know if you would like me to go with you to the digital drop-off point this weekend.
Best regards,
Ahmed`
  }
];

export const INITIAL_VOCAB: VocabWord[] = [
  {
    word: "Journalism",
    lemma: "journalism",
    arabicTranslation: "الصحافة",
    definition: "The activity or profession of collecting, writing, and editing news stories for newspapers, magazines, television, or websites.",
    cefr: "B1",
    rawCount: 15,
    percentage: 3.33,
    sectionWeight: 1.0,
    contextualMultiplier: 1.0,
    weightedScore: 3.33,
    priorityTier: "Emergency",
    emoji: "📰",
    imagePrompt: "A minimal elegant clean news reporting icon"
  },
  {
    word: "Paparazzi",
    lemma: "paparazzi",
    arabicTranslation: "مصلحو الفلاش المتطفلون",
    definition: "Independent photographers who take pictures of athletes, entertainers, politicians, and other celebrities, typically while going about their life.",
    cefr: "B2",
    rawCount: 12,
    percentage: 2.67,
    sectionWeight: 1.0,
    contextualMultiplier: 1.0,
    weightedScore: 2.67,
    priorityTier: "Emergency",
    emoji: "📸",
    imagePrompt: "Camera flashing icon outline flat vectors"
  },
  {
    word: "Sustainability",
    lemma: "sustainability",
    arabicTranslation: "الاستدامة البيئية",
    definition: "The deliberate avoidance of the depletion of natural resources in order to maintain an ecological balance, central to Oman Vision 2040.",
    cefr: "B2",
    rawCount: 8,
    percentage: 1.78,
    sectionWeight: 1.2,
    contextualMultiplier: 1.3,
    weightedScore: 2.77,
    priorityTier: "Emergency",
    emoji: "🌱",
    isVision2040: true,
    imagePrompt: "Omani green environment leaf outline digital concept"
  },
  {
    word: "Obsolete",
    lemma: "obsolete",
    arabicTranslation: "عفا عليه الزمن / ملغى",
    definition: "No longer produced or used; out of date, commonly referencing old landlines or retro floppy disks.",
    cefr: "B2",
    rawCount: 10,
    percentage: 2.22,
    sectionWeight: 1.0,
    contextualMultiplier: 1.0,
    weightedScore: 2.22,
    priorityTier: "Important",
    emoji: "⏳",
    imagePrompt: "An old retro floppy diskette turning to dust minimal flat icon"
  },
  {
    word: "Cyclone",
    lemma: "cyclone",
    arabicTranslation: "الاعصار المداري",
    definition: "A system of winds rotating inward to an area of low atmospheric pressure, causing heavy tropical rainfall & flash flooding.",
    cefr: "B2",
    rawCount: 6,
    percentage: 1.33,
    sectionWeight: 1.4,
    contextualMultiplier: 1.0,
    weightedScore: 1.86,
    priorityTier: "Important",
    emoji: "🌀",
    imagePrompt: "Hurricane storm spin abstract dynamic emblem"
  }
];
