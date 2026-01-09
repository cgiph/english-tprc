import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Check, AlertCircle, Sparkles, Loader2, AlertTriangle, Info, Pencil, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type WritingContext = {
  register: 'formal' | 'semi-formal' | 'informal';
  genre: 'academic-essay' | 'business-email' | 'reflection' | 'creative' | 'conversation' | 'general';
  goal: 'clarity' | 'persuasion' | 'creativity' | 'fluency';
};

const REGISTER_OPTIONS = [
  { value: 'formal', label: 'Formal', desc: 'Academic essays, reports, official documents' },
  { value: 'semi-formal', label: 'Semi-Formal', desc: 'Business emails, presentations' },
  { value: 'informal', label: 'Informal', desc: 'Personal writing, chat, social media' }
];

const GENRE_OPTIONS = [
  { value: 'academic-essay', label: 'Academic Essay', desc: 'Research papers, thesis, scholarly writing' },
  { value: 'business-email', label: 'Business Email', desc: 'Professional correspondence' },
  { value: 'reflection', label: 'Reflection/Journal', desc: 'Personal reflections, diary entries' },
  { value: 'creative', label: 'Creative Writing', desc: 'Stories, poetry, narratives' },
  { value: 'conversation', label: 'Conversation/Chat', desc: 'Dialogue, messaging' },
  { value: 'general', label: 'General', desc: 'Standard writing, no specific genre' }
];

export default function GrammarTool() {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showContextSelector, setShowContextSelector] = useState(false);
  const [writingContext, setWritingContext] = useState<WritingContext>({
    register: 'formal',
    genre: 'general',
    goal: 'clarity'
  });
  const [feedbacks, setFeedbacks] = useState<Array<{ 
    type: 'success' | 'error' | 'warning' | 'info', 
    message: string, 
    corrections?: string[],
    range?: [number, number] 
  }>>([]);

  const handleCheck = () => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    setFeedbacks([]);

    // Simulate AI delay
    setTimeout(() => {
      setIsChecking(false);
      setIsReviewMode(true);
      
      const { register, genre } = writingContext;
      const isFormal = register === 'formal';
      const isSemiFormal = register === 'semi-formal';
      const isInformal = register === 'informal';
      const isAcademic = genre === 'academic-essay';
      const isCreative = genre === 'creative' || genre === 'reflection';
      const isConversation = genre === 'conversation';
      
      const lowerText = text.toLowerCase();
      const newFeedbacks: Array<{ 
        type: 'success' | 'error' | 'warning' | 'info', 
        message: string, 
        corrections?: string[],
        range?: [number, number]
      }> = [];
      
      const addFeedback = (pattern: RegExp | string, message: string, type: 'error' | 'warning' | 'info', corrections?: string[]) => {
        let match;
        const regex = typeof pattern === 'string' 
          ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi') 
          : new RegExp(pattern, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
        
        while ((match = regex.exec(text)) !== null) {
          newFeedbacks.push({
            type,
            message,
            corrections,
            range: [match.index, match.index + match[0].length]
          });
        }
      };
      
      // Context-aware feedback helper
      const addContextAwareFeedback = (
        pattern: RegExp | string,
        formalMessage: string,
        informalMessage: string | null,
        formalType: 'error' | 'warning',
        informalType: 'info' | 'warning' | null,
        corrections?: string[]
      ) => {
        if (isFormal || isSemiFormal) {
          addFeedback(pattern, formalMessage, formalType, corrections);
        } else if (informalMessage && informalType) {
          addFeedback(pattern, informalMessage, informalType);
        }
      };

      if (text.length < 10) {
        newFeedbacks.push({
          type: 'warning',
          message: "Your text is quite short. A longer sample provides better analysis.",
        });
      }

      // Specific stylistic checks based on user request
      addFeedback(
        /butterfly larvae or caterpillars/i,
        "Punctuation suggestion. When 'or' introduces a synonym or definition (appositive), use commas.",
        'warning',
        ["Butterfly larvae, or caterpillars,"]
      );

      addFeedback(
        /using\s+[\w\s]+\s+as\s+well\s+as\s+using/i,
        "Stylistic refinement. Reduce repetition for better flow.",
        'warning',
        ["Remove the second 'using'."]
      );

      // Interrupters like "in turn" not surrounded by commas
      // Matches "in turn" when NOT preceded by comma OR NOT followed by comma
      const inTurnRegex = /(?<!,)(\s+in\s+turn\s+)|(\s+in\s+turn\s+)(?!,)/gi;
      let inTurnMatch;
      while ((inTurnMatch = inTurnRegex.exec(text)) !== null) {
        // Double check context to avoid false positives if logic is tricky, but here:
        // If it's just "in turn" without commas
        newFeedbacks.push({
          type: 'warning',
          message: "Punctuation suggestion. 'In turn' as an interrupter is usually set off by commas.",
          corrections: ["... and, in turn, ..."],
          range: [inTurnMatch.index, inTurnMatch.index + inTurnMatch[0].length]
        });
      }

      // Missing auxiliary verb "have" in perfect tenses
      addFeedback(/\bI\s+been\b/i, "Consider adding an auxiliary verb here. Standard form: 'I have been' or 'I had been'.", 'warning', ["Formal alternative: 'I have been' or 'I had been'."]);
      addFeedback(/\b(he|she|it)\s+been\b/i, "Consider adding an auxiliary verb here. Standard form: 'has been' or 'had been'.", 'warning', ["Formal alternative: 'has been' or 'had been'."]);
      addFeedback(/\b(we|they|you)\s+been\b/i, "Consider adding an auxiliary verb here. Standard form: 'have been' or 'had been'.", 'warning', ["Formal alternative: 'have been' or 'had been'."]);
      
      // Missing auxiliary with past participle
      addFeedback(/\bI\s+(gone|done|seen|taken|given|written|spoken|eaten|driven|broken|chosen|forgotten|frozen|stolen|worn)\b(?!\s+by)/i, "Past participles typically need an auxiliary verb (have/has/had) in standard English.", 'warning', ["Formal alternative: 'I have gone', 'I had done', etc."]);
      addFeedback(/\b(he|she|it)\s+(gone|done|seen|taken|given|written|spoken|eaten|driven|broken|chosen|forgotten|frozen|stolen|worn)\b(?!\s+by)/i, "Past participles typically need an auxiliary verb in standard English.", 'warning', ["Formal alternative: 'has gone', 'had done', etc."]);
      
      // Irregular verbs
      addFeedback(/\b(runned|goed|eated)\b/i, "This verb has an irregular past form. Quick tip: run→ran, go→went, eat→ate.", 'warning', ["Standard forms: ran, went, ate"]);

      // Subject-verb agreement (this/that are)
      addFeedback(/(?:^|[.!?]\s+)(this|that)\s+are\b/i, "Quick grammar note: 'This' and 'That' are singular demonstratives, so they pair with singular verbs.", 'warning', ["Consider: 'These are', 'Those are', 'This is', or 'That is'."]);

      // ========== HIGH-IMPACT RULES WITH SAFEGUARDS ==========
      
      // 1️⃣ Subject-Verb Agreement: "A number of" vs "The number of"
      // "A number of + plural noun" = PLURAL verb (correct: "A number of students ARE absent")
      // "The number of + plural noun" = SINGULAR verb (correct: "The number of students IS increasing")
      
      // Flag incorrect: "a number of [noun] is/was/has"
      addFeedback(/\ba\s+number\s+of\s+\w+\s+(is|was|has)\b/i, 
        "Helpful tip: 'A number of' emphasizes the individuals, so it pairs with a plural verb.", 
        'warning', 
        ["Formal alternative: 'are', 'were', or 'have'. Example: 'A number of students ARE absent.'"]
      );
      
      // Flag incorrect: "the number of [noun] are/were/have"
      addFeedback(/\bthe\s+number\s+of\s+\w+\s+(are|were|have)\b/i, 
        "Helpful tip: 'The number of' refers to the quantity itself, so it pairs with a singular verb.", 
        'warning', 
        ["Formal alternative: 'is', 'was', or 'has'. Example: 'The number of students IS increasing.'"]
      );
      
      // Similar patterns: "a majority of", "a variety of" take plural
      addFeedback(/\ba\s+(majority|variety)\s+of\s+\w+\s+(is|was|has)\b/i,
        "Subject-verb agreement: 'A majority/variety of' typically takes a PLURAL verb.",
        'warning',
        ["Consider using 'are', 'were', or 'have'."]
      );
      
      // 2️⃣ Article Usage - DO NOT flag uncountable/abstract nouns
      // List of common uncountable nouns that don't need articles
      const uncountableNouns = [
        'knowledge', 'information', 'advice', 'news', 'furniture', 'equipment', 
        'research', 'evidence', 'progress', 'homework', 'music', 'art', 'love',
        'happiness', 'sadness', 'anger', 'courage', 'patience', 'honesty',
        'education', 'health', 'wealth', 'success', 'failure', 'experience',
        'water', 'air', 'rice', 'bread', 'coffee', 'tea', 'milk', 'sugar', 'salt'
      ];
      
      // Only flag article errors for COUNTABLE nouns, not uncountable ones
      // This prevents false positives like flagging "Knowledge is important"
      
      // 3️⃣ Spoken vs Written Grammar - "There's many/several/numerous"
      // In spoken English, "there's" with plural is common but grammatically informal
      if (isFormal || isAcademic) {
        addFeedback(/\bthere's\s+(many|several|numerous|various|multiple|some|a\s+lot\s+of|lots\s+of)\b/i,
          "Grammatically acceptable in speech, but consider 'There are' for formal/academic writing.",
          'warning',
          ["Formal alternative: 'There are many/several...'"]
        );
        addFeedback(/\bthere's\s+\d+\s+\w+s\b/i,
          "This is common in spoken English. For formal writing, 'There are' pairs with plural nouns.",
          'warning',
          ["Formal alternative: 'There are' with plural nouns."]
        );
      } else if (isSemiFormal) {
        addFeedback(/\bthere's\s+(many|several|numerous)\b/i,
          "Grammatically acceptable, but 'There are' may sound slightly more polished here.",
          'info',
          ["Optional refinement: 'There are many/several...'"]
        );
      }
      // In informal writing, this is acceptable - no feedback
      
      // 4️⃣ Passive Voice - Context-dependent, NOT always wrong
      // Only flag passive in contexts where active voice is preferred
      const passivePattern = /\b(is|are|was|were|been|being)\s+(being\s+)?(done|made|taken|given|shown|found|used|called|known|seen|considered|reported|believed|thought|expected|required|needed|allowed|asked|told|written|built|created|designed|developed|produced|manufactured|established|formed|organized|conducted|performed|completed|achieved|received|obtained|discovered|identified|observed|noted|recorded|measured|analyzed|examined|tested|evaluated|assessed|reviewed|discussed|described|explained|defined|determined|established|calculated|estimated|predicted|proposed|suggested|recommended|indicated|demonstrated|illustrated|confirmed|verified|validated|proved|supported|maintained|preserved|protected|prevented|reduced|increased|improved|enhanced|extended|expanded|modified|changed|adjusted|adapted|applied|implemented|introduced|incorporated|integrated|combined|separated|divided|distributed|transferred|transported|delivered|provided|supplied|offered|presented|displayed|represented|expressed|communicated|transmitted|sent|received)\b/i;
      
      // Only flag passive voice in informal/conversation contexts where active is more natural
      if (isConversation) {
        // Check for passive voice patterns
        const passiveMatch = text.match(passivePattern);
        if (passiveMatch) {
          newFeedbacks.push({
            type: 'info',
            message: "Passive voice detected. In conversational writing, active voice is often more engaging and direct.",
            corrections: ["Consider rephrasing in active voice for a more conversational tone."]
          });
        }
      }
      // In academic/formal writing, passive voice is often preferred - NO flag
      // "The data were collected" is CORRECT in research writing
      
      // ========== END HIGH-IMPACT RULES ==========

      // Punctuation (multiple marks)
      addFeedback(/[.,;?!]{2,}(?!\.)/g, "Punctuation tip: A single punctuation mark is typically cleaner.", 'warning', ["Consider using just one punctuation mark."]);

      // Spacing after punctuation
      addFeedback(/[.,;?!][a-zA-Z]/g, "Formatting suggestion: Adding a space after punctuation improves readability.", 'warning', ["Optional improvement: Add a space after the punctuation."]);

      // Capitalization (start of sentence)
      addFeedback(/\. [a-z]/g, "Capitalization note: New sentences typically start with a capital letter.", 'warning', ["Consider capitalizing the first letter."]);

      // Space before comma
      addFeedback(/\s+,/g, "Formatting tip: In standard punctuation, commas follow words directly without a space.", 'warning', ["Consider removing the space before the comma."]);

      // Subject-verb agreement (who)
      addFeedback(/\b(student|person|one)\s+who\s+(learn|build|make|do|go)\b/i, "Grammar note: When 'who' refers to a singular noun, the verb usually takes the singular form.", 'warning', ["Formal alternative: 'learns', 'builds', etc."]);

      // Space before punctuation
      addFeedback(/\s+[.,;?!]/g, "Formatting suggestion: Punctuation marks typically follow words directly.", 'warning', ["Consider removing the space."]);

      // Plural subject singular verb
      addFeedback(/\b(skills|benefits|students|people)\s+(helps|makes|is|has)\b/i, "Subject-verb tip: Plural subjects pair with plural verbs for agreement.", 'warning', ["Formal alternative: 'help', 'make', 'are', 'have'."]);

      // Word form
      addFeedback(/\bthinking\s+creativity\b/i, "Word form suggestion: Verbs are modified by adverbs, not nouns.", 'warning', ["Consider: 'think creatively'."]);

      // Spelling/Word choice
      addFeedback(/\bspear\s+parts\b/i, "Possible typo detected. Did you mean a different word?", 'warning', ["Did you mean 'spare parts'?"]);

      // Number agreement
      addFeedback(/\btheoretical\s+concept\b/i, "Optional improvement for academic writing: Consider using the plural form when discussing multiple ideas.", 'info', ["Consider: 'theoretical concepts'."]);

      // Missing object
      addFeedback(/\breads\s+about\s+in\b/i, "Clarity suggestion: Adding an object here would make the meaning clearer.", 'warning', ["Consider: 'reads about it in'."]);

      // Capitalization (secondly)
      addFeedback(/\.\s+secondly/i, "Capitalization note: Sentences begin with a capital letter.", 'warning', ["Consider: 'Secondly'."]);

      // Word choice
      addFeedback(/the\s+important\s+of/i, "Word form tip: This position needs a noun. 'Important' is an adjective.", 'warning', ["Formal alternative: 'the importance of'."]);

      // Subject-verb agreement (singular subject)
      addFeedback(/\b(student|he|she|it)\s+(prepare|learn|need|want|go)\b(?!\s+(will|can|should|must|might|could|would))/i, "Grammar note: Third-person singular subjects use verb forms ending in -s/-es.", 'warning', ["Formal alternative: 'prepares', 'learns', etc."]);

      // ========== PASSIVE VOICE ==========
      // ✅ Correctly formed passive is ACCEPTABLE (especially in academic writing)
      // "The data were collected" - CORRECT, do NOT flag
      // ❌ Only flag INCORRECTLY FORMED passive (missing past participle)
      // "The data was collect" - ERROR, missing -ed
      
      addFeedback(/\b(was|were|is|are|been|being)\s+(collect|conduct|analyze|organize|complete|create|develop|establish|examine|investigate|observe|present|produce|provide|receive|record|report|select|study|treat|use)\b(?!\w)/i, 
        "Passive voice formation error: Use the past participle (-ed form) after 'be' verbs.",
        'error',
        ["Correct form: 'was collected', 'were analyzed', 'is completed', etc."]
      );
      
      addFeedback(/\b(was|were|is|are|been|being)\s+(build|choose|drive|eat|give|grow|know|make|take|write|break|speak|steal|throw|wear|begin|drink|ring|sing|swim|do|go|see|draw|fly|show)\b(?!\w)/i,
        "Passive voice formation error: Use the past participle form after 'be' verbs.",
        'error',
        ["Correct forms: 'was built', 'were chosen', 'is given', 'was taken', 'were written', etc."]
      );
      
      addFeedback(/be\s+equip\b/i, "Verb form note: After 'be', use the past participle form for passive constructions.", 'warning', ["Standard form: 'be equipped'."]);

      // Punctuation (?.)
      addFeedback(/\?\./g, "Punctuation tip: A question mark already ends the sentence; no period needed.", 'info', ["Consider removing the period."]);

      // Awkward phrasing
      addFeedback(/number\s+one\s+benefits/i, "Phrasing suggestion: This expression may sound more natural with a different structure.", 'info', ["Consider: 'numerous benefits' or 'many benefits'."]);

      // Verb form (is went)
      addFeedback(/\b(am|is|are|was|were)\s+went\b/i, "Verb combination note: 'Be' verbs pair with -ing forms or past participles, not simple past.", 'warning', ["Consider: 'I went' or 'I am going'."]);

      // Parallelism
      addFeedback(/\b(love|like|enjoy|hate|prefer)\s+(run|walk|swim|read|write|speak|talk)\s+and\s+\w+ing\b/i, "Style tip: Parallel structure (matching verb forms) improves flow.", 'info', ["Consider matching forms: 'running and jogging' or 'run and jog'."]);

      // Stative verbs
      addFeedback(/\b(am|is|are|was|were)\s+(knowing|believing|wanting|hating|preferring|needing)\b/i, "Grammar note: Some verbs (stative verbs) typically aren't used in continuous forms.", 'info', ["Standard form: 'I know', 'I believe', etc."]);

      // ========== PREPOSITIONS (ESL-SENSITIVE) ==========
      // Meaning-affecting preposition errors (marked as errors)
      addFeedback(/married\s+with\s+(a|an|the|my|his|her)\s+\w+/i, 
        "Meaning-critical: 'Married to' refers to your spouse. 'Married with' would mean 'having' (e.g., married with children).", 
        'error', 
        ["Correct form: 'married to a doctor' (spouse relationship)"]
      );
      
      addFeedback(/\b(leads?|led)\s+for\b/i,
        "Preposition error: 'Lead' pairs with 'to' not 'for'.",
        'error',
        ["Correct form: 'leads to many problems' / 'led to success'"]
      );
      
      addFeedback(/\b(results?|resulted)\s+for\b/i,
        "Preposition error: 'Result' pairs with 'in' not 'for'.",
        'error',
        ["Correct form: 'results in problems' / 'resulted in failure'"]
      );
      
      addFeedback(/listen\s+(?!to\b)\w+/i, 
        "Meaning note: 'Listen' requires 'to' before its object in English.", 
        'warning', 
        ["Standard form: 'listen to music/someone'"]
      );
      
      // Common ESL patterns - marked as suggestions, not errors
      addFeedback(/discuss\s+about\s+(the|a|an|this|that|our|their|my|his|her)/i, 
        "Common ESL pattern: 'Discuss' is transitive and doesn't need 'about'. However, this is widely understood.", 
        'info', 
        ["Optional refinement: 'discuss the problem' (no 'about' needed)"]
      );
      
      addFeedback(/explain\s+(me|him|her|us|them)\s+/i, 
        "Common ESL pattern: 'Explain' uses 'to' before the person. This is a frequent learner pattern.", 
        'info', 
        ["Optional refinement: 'explain to me' / 'explain it to him'"]
      );
      
      addFeedback(/enter\s+(into|in)\s+(the|a|an)/i, 
        "Common ESL pattern: 'Enter' is transitive and doesn't need 'into/in'. However, meaning is clear.", 
        'info', 
        ["Optional refinement: 'enter the room' (no preposition needed)"]
      );
      
      addFeedback(/reach\s+(to|at)\s+(the|a|an)/i, 
        "Common ESL pattern: 'Reach' is transitive. The preposition isn't needed but meaning is clear.", 
        'info', 
        ["Optional refinement: 'reach the destination' (no preposition needed)"]
      );
      
      // Standard preposition collocations - suggestions not errors
      addFeedback(/depend\s+of/i, 
        "Collocation note: 'Depend' typically pairs with 'on' in standard usage.", 
        'info', 
        ["Standard collocation: 'depend on'"]
      );
      addFeedback(/interested\s+on/i, 
        "Collocation note: 'Interested' typically pairs with 'in'.", 
        'info', 
        ["Standard collocation: 'interested in'"]
      );
      addFeedback(/good\s+in\b/i, 
        "Collocation note: When describing ability, 'good at' is the standard form.", 
        'info', 
        ["Standard collocation: 'good at'"]
      );
      addFeedback(/responsible\s+of/i, 
        "Collocation note: 'Responsible' typically pairs with 'for'.", 
        'info', 
        ["Standard collocation: 'responsible for'"]
      );
      addFeedback(/consist\s+in\b/i, 
        "Collocation note: 'Consist of' is the standard form (though 'consist in' has a different, rarer meaning).", 
        'info', 
        ["Standard collocation: 'consist of'"]
      );
      addFeedback(/arrive\s+to\b/i, 
        "Collocation note: 'Arrive at' (specific place) or 'arrive in' (city/country) are standard.", 
        'info', 
        ["Standard collocations: 'arrive at the station' / 'arrive in London'"]
      );
      
      // ========== END PREPOSITIONS ==========

      // Compare structure errors
      addFeedback(/\bcompare[sd]?\s+[\w\s]+\s+than\b/i, "Grammar note: 'Compare' uses 'with' or 'to', not 'than'. ('Than' is for comparatives like 'bigger than'.)", 'warning', ["Standard patterns: 'compare A with B' or 'compare A and B'."]);
      addFeedback(/\bcomparing\s+[\w\s]+\s+than\b/i, "Grammar note: 'Comparing' uses 'with' or 'to', not 'than'.", 'warning', ["Standard patterns: 'comparing A with B' or 'comparing A and B'."]);
      
      // "for" misused with compare (when talking about aspects)
      addFeedback(/\bcompare[sd]?\s+[\w\s]+\s+for\s+the\b/i, "Preposition suggestion: When discussing aspects with 'compare', consider 'in terms of' or 'regarding'.", 'info', ["Formal alternatives: 'in terms of', 'regarding', or 'based on'."]);
      addFeedback(/\bcomparing\s+[\w\s]+\s+for\s+the\b/i, "Preposition suggestion: When discussing aspects, 'in terms of' or 'regarding' are more precise.", 'info', ["Formal alternatives: 'in terms of', 'regarding', or 'based on'."]);

      // Common spellings
      const misspellings: Record<string, string> = {
        "teh": "the", "recieve": "receive", "definately": "definitely", "seperate": "separate",
        "occured": "occurred", "accommodate": "accommodate", "truely": "truly", 
        "publically": "publicly", "goverment": "government", "environment": "environment"
      };
      Object.keys(misspellings).forEach(wrong => {
        addFeedback(new RegExp(`\\b${wrong}\\b`, 'i'), `Spelling suggestion: '${wrong}' may be a typo.`, 'warning', [`Standard spelling: '${misspellings[wrong]}'`]);
      });

      // ========== HIGH PRIORITY: MEANING-CRITICAL ERRORS ==========
      // These MUST be corrected because they obscure meaning and block basic clause structure
      
      // Relative Pronoun Error: "which" for people → should be "who"
      // "Students which study abroad" → "Students who study abroad"
      addFeedback(/\b(students?|people|persons?|children|kids|men|women|teachers?|doctors?|engineers?|workers?|employees?|managers?|customers?|users?|members?|players?|athletes?|artists?|writers?|readers?|speakers?|listeners?|learners?|researchers?|scientists?|politicians?|citizens?|residents?|visitors?|tourists?|passengers?|patients?|clients?|colleagues?|friends?|neighbors?|parents?|mothers?|fathers?|brothers?|sisters?|sons?|daughters?|grandparents?|babies?|adults?|teenagers?|individuals?|candidates?|applicants?|participants?|volunteers?|professionals?|experts?|specialists?|officials?|representatives?|leaders?|founders?|owners?|investors?|entrepreneurs?|executives?|directors?|presidents?|staff|team|crew|audience|crowd|population|community|society|humanity|mankind|everyone|someone|anyone|those|they)\s+which\b/i,
        "Relative pronoun error: Use 'who' for people, not 'which'. 'Which' is for things/objects.",
        'error',
        ["Correct form: 'Students who study abroad...' / 'People who work here...'"]
      );
      
      // Double Conjunction Error (Very High Exam Relevance)
      // "Although it is expensive, but many buy it" - cannot use both subordinator AND coordinator
      addFeedback(/\b(although|though|even though|while|whereas)\b[^.!?]*,\s*(but|however|yet)\b/i,
        "Grammar error: Cannot use both a subordinating conjunction ('although/though') AND a coordinating conjunction ('but/yet'). Choose one.",
        'error',
        ["Fix option 1: 'Although it is expensive, many buy it.' (remove 'but')", "Fix option 2: 'It is expensive, but many buy it.' (remove 'although')"]
      );
      
      addFeedback(/\b(because|since|as)\b[^.!?]*,\s*(so|therefore)\b/i,
        "Grammar error: Cannot use both 'because/since' AND 'so/therefore' in the same sentence. Choose one.",
        'error',
        ["Fix option 1: 'Because it rained, we stayed home.' (remove 'so')", "Fix option 2: 'It rained, so we stayed home.' (remove 'because')"]
      );
      
      addFeedback(/\b(if|unless|when|whenever)\b[^.!?]*,\s*(then)\b/i,
        "Style note: 'Then' is often redundant after 'if/when' clauses, though not strictly incorrect.",
        'info',
        ["Consider: 'If you study hard, you will pass.' (without 'then')"]
      );
      
      // 2️⃣ Missing Copula Verb (Sentence Skeleton Errors)
      // "She very happy" → "She is very happy"
      addFeedback(/\b(I|you|he|she|it|we|they)\s+(very|so|really|quite|extremely|absolutely|totally|completely)\s+(happy|sad|angry|tired|hungry|thirsty|busy|ready|sorry|afraid|sure|glad|proud|lucky|careful|certain|aware|able|different|similar|important|necessary|possible|impossible|difficult|easy|hard|simple|nice|good|bad|beautiful|ugly|tall|short|big|small|old|young|new|hot|cold|warm|cool|fast|slow|rich|poor|smart|clever|stupid|lazy|crazy|funny|serious|quiet|loud|clean|dirty|dry|wet|safe|dangerous|healthy|sick|ill|fine|okay|wrong|right|true|false|real|fake|free|expensive|cheap|empty|full)\b/i,
        "Meaning-critical: Missing verb 'be'. Without a linking verb, the sentence structure is incomplete.",
        'error',
        ["Correct form: Add 'am/is/are'. Example: 'She is very happy.'"]
      );
      
      // More specific patterns for copula omission
      addFeedback(/\b(he|she|it)\s+(very|so|really)\s+(good|bad|nice|kind|smart|fast|slow|big|small|tall|short)\b/i,
        "Meaning-critical: Missing 'is'. The sentence needs a linking verb.",
        'error',
        ["Correct form: 'He/She/It is very...' Example: 'She is very kind.'"]
      );
      
      addFeedback(/\b(I)\s+(very|so|really)\s+(happy|sad|tired|hungry|busy|sorry|sure|glad)\b/i,
        "Meaning-critical: Missing 'am'. The sentence needs a linking verb.",
        'error',
        ["Correct form: 'I am very...' Example: 'I am very happy.'"]
      );
      
      addFeedback(/\b(we|they|you)\s+(very|so|really)\s+(happy|sad|tired|hungry|busy|ready|sorry|sure|glad)\b/i,
        "Meaning-critical: Missing 'are'. The sentence needs a linking verb.",
        'error',
        ["Correct form: 'We/They/You are very...' Example: 'They are very busy.'"]
      );
      
      // 3️⃣ Subject-Verb Agreement (Third Person Singular - Basic Forms)
      // "He go to work" → "He goes to work"
      addFeedback(/\b(he|she|it)\s+(go|do|have|say|make|take|come|see|get|know|think|want|use|find|give|tell|work|call|try|ask|need|feel|become|leave|put|mean|keep|let|begin|seem|help|show|hear|play|run|move|live|believe|bring|happen|write|sit|stand|lose|pay|meet|include|continue|set|learn|change|lead|understand|watch|follow|stop|create|speak|read|allow|add|spend|grow|open|walk|win|offer|remember|love|consider|appear|buy|wait|serve|die|send|expect|build|stay|fall|cut|reach|kill|remain|suggest|raise|pass|sell|require|report|decide|pull)\b(?!\s+(to|that|it|him|her|them|us|me|you|up|down|in|out|on|off|back|away|over|through))/i,
        "Meaning-critical: Third-person singular subjects (he/she/it) need verb forms ending in -s/-es.",
        'error',
        ["Correct form: Add -s/-es. Example: 'He goes to work every day.'"]
      );
      
      // Specific common patterns
      addFeedback(/\b(he|she|it)\s+go\s+to\b/i,
        "Meaning-critical: 'He/She/It' requires 'goes' (third-person singular).",
        'error',
        ["Correct form: 'He goes to...' / 'She goes to...'"]
      );
      
      addFeedback(/\b(he|she|it)\s+have\s+(a|an|the|to|no|some|many)\b/i,
        "Meaning-critical: 'He/She/It' requires 'has' (third-person singular).",
        'error',
        ["Correct form: 'He has...' / 'She has...'"]
      );
      
      addFeedback(/\b(he|she|it)\s+do\s+not\b/i,
        "Meaning-critical: 'He/She/It' requires 'does not' (third-person singular).",
        'error',
        ["Correct form: 'He does not...' / 'She does not...'"]
      );
      
      // 4️⃣ Incorrect Word Order That Affects Meaning
      // "I like very much English" → "I like English very much"
      addFeedback(/\b(like|love|enjoy|hate|want|need)\s+(very\s+much|so\s+much|a\s+lot)\s+(\w+)\b/i,
        "Word order note: In English, the object typically comes before adverbs like 'very much'.",
        'error',
        ["Correct order: 'I like English very much' (object before adverb)"]
      );
      
      addFeedback(/\b(speak|know|understand|learn|study|teach)\s+(very\s+well|quite\s+well|really\s+well)\s+(\w+)\b/i,
        "Word order note: The object usually comes before adverbs of manner.",
        'error',
        ["Correct order: 'I speak English very well' (object before adverb)"]
      );
      
      // "Always I go" → "I always go"
      addFeedback(/\b(always|never|often|usually|sometimes|rarely|seldom)\s+(I|you|he|she|it|we|they)\s+(go|do|have|make|take|get|want|need|like|love)\b/i,
        "Word order note: Frequency adverbs typically come after the subject in statements.",
        'warning',
        ["Standard order: 'I always go...' / 'She never eats...'"]
      );
      
      // ========== TENSE ERRORS (MEANING-CRITICAL) ==========
      
      // Past time markers with present tense base verbs (meaning-critical)
      addFeedback(/\byesterday\s+I\s+(go|eat|walk|run|see|do|make|take|come|give|get|have|say|tell|know|think|find|leave|put|bring|begin|keep|hold|write|stand|hear|let|mean|set|meet|pay|sit|speak|lie|lead|read|grow|lose|fall|feel|catch|buy|send|build|spend|cut|win|teach|sell|throw|break|drive|draw|show|choose|wear)\b/i, 
        "Meaning-critical: 'Yesterday' requires past tense. The present tense here may confuse the time reference.", 
        'error', 
        ["Correct form: Use past tense. Example: 'Yesterday I went to school.'"]
      );
      addFeedback(/\byesterday\s+(he|she|it|we|they)\s+(go|eat|walk|run|see|do|make|take|come|give|get|have|say|tell|know|think|find|leave|put|bring|begin|keep|hold|write|stand|hear|let|mean|set|meet|pay|sit|speak|lie|lead|read|grow|lose|fall|feel|catch|buy|send|build|spend|cut|win|teach|sell|throw|break|drive|draw|show|choose|wear)\b/i, 
        "Meaning-critical: 'Yesterday' requires past tense to convey the correct time relationship.", 
        'error', 
        ["Correct form: Use past tense verbs (went, ate, walked, etc.)"]
      );
      
      // "Last week/month/year" with present tense
      addFeedback(/\blast\s+(week|month|year|night|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+I\s+(go|eat|walk|run|see|do|make|take|come|give|get|have|say|tell)\b/i, 
        "Meaning-critical: Past time reference requires past tense verbs.", 
        'error', 
        ["Correct form: Use past tense. Example: 'Last week I went...'"]
      );
      
      // "X days/weeks/months ago" with present tense
      addFeedback(/\b(\d+|two|three|four|five|six|seven|eight|nine|ten)\s+(days?|weeks?|months?|years?)\s+ago\s+(I|he|she|it|we|they)\s+(go|eat|walk|run|see|do|make|take|come|give|get|have)\b/i, 
        "Meaning-critical: 'Ago' signals past time and requires past tense verbs.", 
        'error', 
        ["Correct form: Use past tense. Example: 'Two days ago I went...'"]
      );
      
      // Future time markers with past tense (meaning-critical)
      addFeedback(/\btomorrow\s+I\s+(went|ate|walked|ran|saw|did|made|took|came|gave|got|had|said|told|knew|thought|found|left)\b/i, 
        "Meaning-critical: 'Tomorrow' requires future tense. Past tense here confuses the time reference.", 
        'error', 
        ["Correct form: Use 'will + verb' or 'am going to'. Example: 'Tomorrow I will go...'"]
      );
      addFeedback(/\bnext\s+(week|month|year|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+I\s+(went|ate|walked|ran|saw|did|made|took|came|gave|got|had)\b/i, 
        "Meaning-critical: 'Next week/month' requires future tense.", 
        'error', 
        ["Correct form: Use 'will + verb'. Example: 'Next week I will go...'"]
      );
      
      // ========== END MEANING-CRITICAL TENSE ERRORS ==========
      
      // General tense notes (less critical)
      addFeedback(/\byesterday\s+(is|are)\b/i, "Tense note: 'Yesterday' signals past time, so past tense verbs work best here.", 'warning', ["Consider: 'was', 'were'."]);
      addFeedback(/\btomorrow\s+(was|were)\b/i, "Tense note: 'Tomorrow' signals future time, so future tense works best.", 'warning', ["Consider: 'will be'"]);
      
      // Past time marker + present tense verb error
      addFeedback(/\bbefore\s+(is|are|am)\b/i, "Tense suggestion: 'Before' typically indicates past time, so past tense may be clearer.", 'warning', ["Consider: 'was' or 'were' instead of 'is/are'."]);
      addFeedback(/\b(ago|previously|formerly|earlier)\s+(is|are|am)\b/i, "Tense note: These time markers signal the past, so past tense maintains consistency.", 'warning', ["Consider: 'was' or 'were'."]);
      addFeedback(/\b(last\s+(?:week|month|year|time))\s+(is|are|am)\b/i, "Tense note: Past time references pair naturally with past tense verbs.", 'warning', ["Consider: 'was' or 'were'."]);
      
      // Present/future time marker + past tense error
      addFeedback(/\b(now|currently|presently)\s+(was|were)\b/i, "Tense note: 'Now/Currently' signals present time.", 'warning', ["Consider: 'is' or 'are'."]);
      addFeedback(/\b(next\s+(?:week|month|year))\s+(was|were)\b/i, "Tense note: Future time references work best with future tense.", 'warning', ["Consider: 'will be'."]);
      
      // "before is" pattern anywhere in sentence (more flexible)
      addFeedback(/\bbefore\b[^.!?]*\b(is|are|am)\s+\w+ing?\b/i, "Tense suggestion: When describing past situations with 'before', past tense maintains consistency.", 'warning', ["Consider changing 'is/are' to 'was/were'."]);

      // Fragments - CONTEXT AWARE
      // ✅ Task 1 / TOEFL Integrated / Academic Essay → Error (must be corrected)
      // ✅ Task 2 conclusions / Reflective / General → Suggestion (optional)
      // ✅ Creative → Acceptable stylistic choice
      if (/^(because|although|since|if|when|while|unless|until|after|before)\s+[a-z\s,]+\.$/i.test(text) && !/,\s*[a-z]/i.test(text)) {
        if (isFormal && isAcademic) {
          // Task 1 / Integrated / Academic Essay context - fragments are errors
          newFeedbacks.push({
            type: 'error',
            message: "Sentence fragment. In academic essays and formal task responses, subordinate clauses must be attached to a main clause.",
            corrections: ["Attach to a main clause: 'Because X happened, Y resulted.'", "Or rewrite as an independent statement."]
          });
        } else if (isFormal) {
          // Formal but not academic (e.g., business email) - still an error but different tone
          newFeedbacks.push({
            type: 'error',
            message: "Incomplete sentence. In professional writing, ensure all sentences have both a subject and a main verb.",
            corrections: ["Complete the thought: 'Because of X, we recommend Y.'"]
          });
        } else if (isCreative) {
          // Creative writing - fragments are stylistic choices, just note it
          newFeedbacks.push({
            type: 'info',
            message: "Fragment detected. In creative writing, this can be an effective stylistic choice for emphasis or pacing.",
          });
        } else if (genre === 'general') {
          // General writing - optional suggestion, not error
          newFeedbacks.push({
            type: 'warning',
            message: "Sentence fragment detected. Consider completing this thought with a main clause for clarity.",
            corrections: ["Optional: Add a main clause to complete the sentence."]
          });
        } else {
          // Reflective/conversation/other - fragments are acceptable, gentle suggestion
          newFeedbacks.push({
            type: 'info',
            message: "This is a fragment. In reflective or conversational writing, fragments can work for personal voice, but complete sentences may read more smoothly.",
          });
        }
      }

      // Run-ons - severity depends on register
      if (isFormal) {
        addFeedback(/,\s+(however|therefore|moreover|furthermore)/i, "Run-on sentence / Comma splice. In formal writing, use a semicolon or period.", 'error', ["Use '; however,' or '. However,'."]);
      } else {
        addFeedback(/,\s+(however|therefore|moreover|furthermore)/i, "Comma splice. Consider using a semicolon or period for clarity.", 'warning', ["Use '; however,' or '. However,'."]);
      }

      // Articles
      addFeedback(/\ba\s+(apple|orange|egg|elephant|umbrella|hour)\b/i, "Article tip: 'An' is used before vowel sounds for smoother pronunciation.", 'warning', ["Consider: 'an'"]);
      addFeedback(/\ban\s+(car|house|university|book|cat)\b/i, "Article tip: 'A' is used before consonant sounds.", 'warning', ["Consider: 'a'"]);

      // Capitalization (I) - always important
      addFeedback(/\bi\b/g, "Quick reminder: The pronoun 'I' is always capitalized in English.", 'warning', ["Standard form: 'I'"]);

      // Slang/Contractions - CONTEXT AWARE
      if (isFormal || isAcademic) {
        addFeedback(/\bain't\b/i, "Register note: 'Ain't' is informal/dialectal. For academic writing, consider standard forms.", 'warning', ["Formal alternatives: 'is not', 'are not', or 'am not'"]);
        addFeedback(/\bgonna\b/i, "Register note: Informal spelling. Consider the full form for academic writing.", 'warning', ["Formal alternative: 'going to'"]);
        addFeedback(/\bwanna\b/i, "Register note: Informal spelling. Consider the full form for academic writing.", 'warning', ["Formal alternative: 'want to'"]);
        addFeedback(/\bgotta\b/i, "Register note: Informal spelling. Consider the full form for academic writing.", 'warning', ["Formal alternative: 'have to' or 'got to'"]);
        addFeedback(/\bkinda\b/i, "Register note: Informal spelling. Consider more precise language for academic writing.", 'warning', ["Formal alternatives: 'kind of', 'somewhat', or 'rather'"]);
        addFeedback(/\bsorta\b/i, "Register note: Informal spelling. Consider more precise language for academic writing.", 'warning', ["Formal alternatives: 'sort of', 'somewhat', or 'rather'"]);
      } else if (isSemiFormal) {
        addFeedback(/\bain't\b/i, "This is quite casual for professional communication.", 'info', ["Consider: 'is not' or 'are not'"]);
        addFeedback(/\bgonna\b/i, "Optional refinement for professional contexts.", 'info', ["Consider: 'going to'"]);
      }
      // In informal contexts, these are acceptable - no feedback given
      
      // Contractions in formal writing
      if (isAcademic) {
        addFeedback(/\b(don't|won't|can't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|wouldn't|couldn't|shouldn't|didn't)\b/i, 
          "Style note for academic writing: Full verb forms are often preferred over contractions in formal essays.", 'info', 
          ["Optional improvement: 'do not', 'will not', 'cannot', etc."]);
      }

      // Add context summary at the end
      const contextLabel = `${REGISTER_OPTIONS.find(r => r.value === register)?.label} / ${GENRE_OPTIONS.find(g => g.value === genre)?.label}`;

      if (newFeedbacks.length === 0) {
         newFeedbacks.push({
          type: 'success',
          message: `Great job! Your writing looks grammatically correct for ${contextLabel.toLowerCase()} writing.`,
        });
      }

      // De-duplicate feedbacks based on message and range
      const uniqueFeedbacks = newFeedbacks.filter((v, i, a) => a.findIndex(t => (t.message === v.message && t.range?.[0] === v.range?.[0])) === i);

      setFeedbacks(uniqueFeedbacks);
    }, 1500);
  };

  const handleReset = () => {
    setText("");
    setFeedbacks([]);
    setIsReviewMode(false);
    setIsChecking(false);
  };

  const renderHighlightedText = () => {
    if (!text) return null;

    // Sort feedbacks by start position
    const sortedFeedbacks = [...feedbacks]
      .filter(f => f.range)
      .sort((a, b) => (a.range![0]) - (b.range![0]));
    
    // Filter out overlapping ranges (simple greedy approach)
    const nonOverlapping: typeof feedbacks = [];
    let lastEnd = 0;
    sortedFeedbacks.forEach(f => {
      if (f.range && f.range[0] >= lastEnd) {
        nonOverlapping.push(f);
        lastEnd = f.range[1];
      }
    });

    const elements = [];
    let lastIndex = 0;

    nonOverlapping.forEach((feedback, i) => {
      if (!feedback.range) return;
      const [start, end] = feedback.range;

      // Text before highlight
      if (start > lastIndex) {
        elements.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
      }

      // Highlighted text
      const highlightColor = feedback.type === 'error' ? 'bg-red-100 border-b-2 border-red-500' : 
                             feedback.type === 'warning' ? 'bg-amber-100 border-b-2 border-amber-500' : 
                             feedback.type === 'info' ? 'bg-blue-100 border-b-2 border-blue-500' : 'bg-green-100 border-b-2 border-green-500';

      elements.push(
        <HoverCard key={`highlight-${i}`} openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <span className={`${highlightColor} cursor-pointer rounded-sm px-0.5`}>
              {text.slice(start, end)}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4" align="start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                 {feedback.type === 'error' ? <AlertTriangle className="h-4 w-4 text-red-600" /> : 
                  feedback.type === 'warning' ? <Info className="h-4 w-4 text-amber-600" /> : 
                  feedback.type === 'info' ? <BookOpen className="h-4 w-4 text-blue-600" /> : <Check className="h-4 w-4 text-green-600" />}
                 <h4 className={`font-semibold text-sm ${
                   feedback.type === 'error' ? 'text-red-700' : 
                   feedback.type === 'warning' ? 'text-amber-700' : 
                   feedback.type === 'info' ? 'text-blue-700' : 'text-green-700'
                 }`}>
                   {feedback.type === 'error' ? 'Worth Reviewing' : feedback.type === 'warning' ? 'Consider This' : feedback.type === 'info' ? 'Helpful Tip' : 'Looks Good'}
                 </h4>
              </div>
              <p className="text-sm text-foreground">{feedback.message}</p>
              {feedback.corrections && feedback.corrections.length > 0 && (
                <div className="text-sm bg-muted/50 p-2 rounded border mt-2">
                  <div className="font-medium text-xs text-muted-foreground uppercase mb-1">Correction</div>
                  <div className="text-green-700 font-medium">
                    {feedback.corrections.map((c, i) => (
                      <div key={i}>{c}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );

      lastIndex = end;
    });

    // Remaining text
    if (lastIndex < text.length) {
      elements.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Grammar Refresher Tool</h1>
            <p className="text-muted-foreground mt-2">
              Essential grammar rules, structures, and punctuation for PTE Academic success.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ai-checker" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="ai-checker" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white border bg-background flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI Checker
          </TabsTrigger>
          <TabsTrigger value="sva" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Subject-Verb Agreement</TabsTrigger>
          <TabsTrigger value="pos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Parts of Speech</TabsTrigger>
          <TabsTrigger value="sentence" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Sentence Structures</TabsTrigger>
          <TabsTrigger value="punctuation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Punctuation</TabsTrigger>
          <TabsTrigger value="reported" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Reported Speech</TabsTrigger>
        </TabsList>

        {/* AI Checker */}
        <TabsContent value="ai-checker">
          <Card className="border-purple-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Sparkles className="h-5 w-5" />
                AI Grammar Checker
              </CardTitle>
              <CardDescription>
                Paste your text below to check for grammar, spelling, and punctuation errors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Writing Context Selector */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800 text-sm">Writing Context</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowContextSelector(!showContextSelector)}
                    className="text-xs h-7 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                  >
                    {showContextSelector ? 'Hide Options' : 'Change Context'}
                  </Button>
                </div>
                
                {!showContextSelector ? (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                      {REGISTER_OPTIONS.find(r => r.value === writingContext.register)?.label}
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                      {GENRE_OPTIONS.find(g => g.value === writingContext.genre)?.label}
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-4 mt-3">
                    <div>
                      <Label className="text-xs text-purple-700 mb-2 block">Register (Formality Level)</Label>
                      <div className="flex flex-wrap gap-2">
                        {REGISTER_OPTIONS.map(opt => (
                          <Button
                            key={opt.value}
                            variant={writingContext.register === opt.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setWritingContext(prev => ({ ...prev, register: opt.value as WritingContext['register'] }))}
                            className={`text-xs ${writingContext.register === opt.value ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-purple-50'}`}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {REGISTER_OPTIONS.find(r => r.value === writingContext.register)?.desc}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-indigo-700 mb-2 block">Genre (Type of Writing)</Label>
                      <div className="flex flex-wrap gap-2">
                        {GENRE_OPTIONS.map(opt => (
                          <Button
                            key={opt.value}
                            variant={writingContext.genre === opt.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setWritingContext(prev => ({ ...prev, genre: opt.value as WritingContext['genre'] }))}
                            className={`text-xs ${writingContext.genre === opt.value ? 'bg-indigo-600 hover:bg-indigo-700' : 'hover:bg-indigo-50'}`}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {GENRE_OPTIONS.find(g => g.value === writingContext.genre)?.desc}
                      </p>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-purple-600 mt-3 italic">
                  Grammar rules are applied based on your writing context. Fragments and informal language may be acceptable in creative writing but not in academic essays.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <Label htmlFor="grammar-input">Your Text</Label>
                   {isReviewMode && (
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setIsReviewMode(false)}
                       className="h-6 px-2 text-xs"
                     >
                       <Pencil className="h-3 w-3 mr-1" />
                       Edit Text
                     </Button>
                   )}
                </div>
                
                {isReviewMode ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 min-h-[300px] p-4 rounded-md border border-input bg-background text-base font-sans whitespace-pre-wrap leading-relaxed">
                      {renderHighlightedText()}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-semibold text-muted-foreground mb-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Suggested Improvements</span>
                      </div>
                      <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
                        {feedbacks.map((feedback, index) => (
                          <Card key={index} className={`border-l-4 shadow-sm ${
                            feedback.type === 'error' ? 'border-l-red-500' : 
                            feedback.type === 'warning' ? 'border-l-amber-500' : 
                            feedback.type === 'info' ? 'border-l-blue-500' : 'border-l-green-500'
                          }`}>
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <span className={`text-xs font-bold uppercase ${
                                  feedback.type === 'error' ? 'text-red-600' : 
                                  feedback.type === 'warning' ? 'text-amber-600' : 
                                  feedback.type === 'info' ? 'text-blue-600' : 'text-green-600'
                                }`}>
                                  {feedback.type === 'error' ? 'Review' : feedback.type === 'warning' ? 'Consider' : feedback.type === 'info' ? 'Tip' : 'Great'}
                                </span>
                              </div>
                              <p className="text-sm font-medium leading-snug">{feedback.message}</p>
                              {feedback.corrections && feedback.corrections.length > 0 && (
                                <div className="bg-muted/50 rounded p-2 text-sm mt-1">
                                  <span className="text-xs text-muted-foreground block mb-0.5">Correction:</span>
                                  <span className="font-medium text-green-700">{feedback.corrections[0]}</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        {feedbacks.length === 0 && (
                          <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                            <Check className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No issues found!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Textarea 
                    id="grammar-input" 
                    placeholder="Type or paste your sentence here..." 
                    className="min-h-[200px] resize-y text-base font-sans"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                )}
              </div>

              {feedbacks.length > 0 && !isReviewMode && (
                <div className="space-y-3">
                  {feedbacks.map((feedback, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
                      feedback.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                      feedback.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                      'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-start gap-3">
                        {feedback.type === 'success' ? (
                          <Check className="h-5 w-5 mt-0.5 shrink-0 text-green-600" />
                        ) : feedback.type === 'warning' ? (
                          <Info className="h-5 w-5 mt-0.5 shrink-0 text-amber-600" />
                        ) : feedback.type === 'info' ? (
                          <BookOpen className="h-5 w-5 mt-0.5 shrink-0 text-blue-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-red-600" />
                        )}
                        <div className="space-y-2">
                          <p className="font-medium">{feedback.message}</p>
                          {feedback.corrections && feedback.corrections.length > 0 && (
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {feedback.corrections.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-muted/5">
              <div className="flex items-center gap-4">
                 <p className="text-xs text-muted-foreground">
                  * This is a simulated AI tool for practice purposes.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={!text && feedbacks.length === 0}
                >
                  Reset
                </Button>
                
                {!isReviewMode && (
                  <Button 
                    onClick={handleCheck} 
                    disabled={isChecking || !text.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px]"
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Check Grammar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Subject-Verb Agreement */}
        <TabsContent value="sva">
          <Card>
            <CardHeader>
              <CardTitle>Subject-Verb Agreement</CardTitle>
              <CardDescription>
                The subject and verb must agree in number (singular or plural).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Basic Rules</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">Singular subjects</span> need singular verbs.
                      <div className="text-sm italic mt-1 text-green-600">"The <span className="font-bold">student writes</span> an essay."</div>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Plural subjects</span> need plural verbs.
                      <div className="text-sm italic mt-1 text-green-600">"The <span className="font-bold">students write</span> essays."</div>
                    </li>
                    <li>
                      When subjects are joined by <span className="font-medium text-foreground">and</span>, use a plural verb.
                      <div className="text-sm italic mt-1 text-green-600">"The teacher <span className="font-bold">and</span> the student <span className="font-bold">are</span> talking."</div>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Tricky Cases</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">Indefinite pronouns</span> (everyone, anyone, somebody) are singular.
                      <div className="text-sm italic mt-1 text-green-600">"<span className="font-bold">Everyone is</span> present today."</div>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Collective nouns</span> (team, group, family) usually take a singular verb if acting as one unit.
                      <div className="text-sm italic mt-1 text-green-600">"The <span className="font-bold">team is</span> winning."</div>
                    </li>
                    <li>
                      Words between subject and verb don't change agreement.
                      <div className="text-sm italic mt-1 text-green-600">"The <span className="font-bold">box</span> of chocolates <span className="font-bold">is</span> empty."</div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parts of Speech */}
        <TabsContent value="pos">
          <Card>
            <CardHeader>
              <CardTitle>Parts of Speech</CardTitle>
              <CardDescription>The building blocks of English sentences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Noun", desc: "A person, place, thing, or idea.", ex: "Cat, London, Happiness" },
                  { name: "Pronoun", desc: "Replaces a noun.", ex: "He, She, It, They" },
                  { name: "Verb", desc: "An action or state of being.", ex: "Run, Is, Study, Analyze" },
                  { name: "Adjective", desc: "Describes a noun.", ex: "Red, Big, Important, Academic" },
                  { name: "Adverb", desc: "Describes a verb, adjective, or adverb.", ex: "Quickly, Very, Well" },
                  { name: "Preposition", desc: "Links a noun to another word.", ex: "In, On, At, With, For" },
                  { name: "Conjunction", desc: "Joins clauses or sentences.", ex: "And, But, Or, Because" },
                  { name: "Interjection", desc: "Short exclamation.", ex: "Oh!, Wow!, Ouch!" },
                ].map((pos, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                    <h3 className="font-bold text-primary mb-1">{pos.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{pos.desc}</p>
                    <div className="text-xs bg-muted/50 p-2 rounded italic">Ex: {pos.ex}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentence Structures */}
        <TabsContent value="sentence">
          <Card>
            <CardHeader>
              <CardTitle>Sentence Structures</CardTitle>
              <CardDescription>Understanding the four types of sentences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="single" collapsible defaultValue="simple" className="w-full">
                <AccordionItem value="simple">
                  <AccordionTrigger>Simple Sentence</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Contains one independent clause (one subject and one verb).
                    <div className="mt-2 p-3 bg-muted rounded-md text-foreground">
                      "PTE Academic <span className="font-bold">is</span> a computer-based test."
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="compound">
                  <AccordionTrigger>Compound Sentence</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Contains two independent clauses joined by a conjunction (FANBOYS: For, And, Nor, But, Or, Yet, So).
                    <div className="mt-2 p-3 bg-muted rounded-md text-foreground">
                      "I studied hard, <span className="font-bold">but</span> I was still nervous."
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="complex">
                  <AccordionTrigger>Complex Sentence</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Contains an independent clause and one or more dependent clauses (using words like because, although, if, since).
                    <div className="mt-2 p-3 bg-muted rounded-md text-foreground">
                      "<span className="font-bold">Although</span> it was raining, we went to the center."
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="compound-complex">
                  <AccordionTrigger>Compound-Complex Sentence</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Contains two independent clauses and at least one dependent clause.
                    <div className="mt-2 p-3 bg-muted rounded-md text-foreground">
                      "Because I prepared well, I passed the test, <span className="font-bold">and</span> I was very happy."
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Punctuation Marks */}
        <TabsContent value="punctuation">
          <Card>
            <CardHeader>
              <CardTitle>Punctuation Marks</CardTitle>
              <CardDescription>Correct punctuation clarifies meaning.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { mark: ".", name: "Period / Full Stop", use: "Ends a sentence." },
                  { mark: ",", name: "Comma", use: "Separates items in a list, or clauses." },
                  { mark: ";", name: "Semicolon", use: "Joins two related independent clauses without a conjunction." },
                  { mark: ":", name: "Colon", use: "Introduces a list or explanation." },
                  { mark: "?", name: "Question Mark", use: "Ends a direct question." },
                  { mark: "!", name: "Exclamation Mark", use: "Expresses strong emotion (avoid in academic writing)." },
                  { mark: "'", name: "Apostrophe", use: "Shows possession (John's) or contraction (can't)." },
                  { mark: '" "', name: "Quotation Marks", use: "Indicates direct speech or a quote." },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border-b last:border-0">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full font-serif font-bold text-xl text-primary shrink-0">
                      {p.mark}
                    </div>
                    <div>
                      <h4 className="font-bold">{p.name}</h4>
                      <p className="text-sm text-muted-foreground">{p.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reported Speech */}
        <TabsContent value="reported">
          <Card>
            <CardHeader>
              <CardTitle>Reported (Indirect) Speech</CardTitle>
              <CardDescription>How to report what someone else has said.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>When changing direct speech to reported speech, you usually need to change pronouns, tense, and time/place words.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" /> Tense Changes
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2 border-b pb-2 font-medium text-muted-foreground">
                      <div>Direct Speech</div>
                      <div>Reported Speech</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>Simple Present<br/><span className="italic text-xs">"I study."</span></div>
                      <div>Simple Past<br/><span className="italic text-xs">He said he studied.</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>Present Continuous<br/><span className="italic text-xs">"I am studying."</span></div>
                      <div>Past Continuous<br/><span className="italic text-xs">He said he was studying.</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>Present Perfect<br/><span className="italic text-xs">"I have studied."</span></div>
                      <div>Past Perfect<br/><span className="italic text-xs">He said he had studied.</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>Simple Past<br/><span className="italic text-xs">"I studied."</span></div>
                      <div>Past Perfect<br/><span className="italic text-xs">He said he had studied.</span></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" /> Other Changes
                  </h3>
                   <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2 border-b pb-2 font-medium text-muted-foreground">
                      <div>Direct</div>
                      <div>Reported</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>tomorrow</div>
                      <div>the next day</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>yesterday</div>
                      <div>the day before</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>here</div>
                      <div>there</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>this</div>
                      <div>that</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
