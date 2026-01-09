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
      addFeedback(/\bI\s+been\b/i, "Missing auxiliary verb. Use 'I have been' or 'I had been'.", 'error', ["Use 'I have been' or 'I had been'."]);
      addFeedback(/\b(he|she|it)\s+been\b/i, "Missing auxiliary verb. Use 'has been' or 'had been'.", 'error', ["Use 'has been' or 'had been'."]);
      addFeedback(/\b(we|they|you)\s+been\b/i, "Missing auxiliary verb. Use 'have been' or 'had been'.", 'error', ["Use 'have been' or 'had been'."]);
      
      // Missing auxiliary with past participle
      addFeedback(/\bI\s+(gone|done|seen|taken|given|written|spoken|eaten|driven|broken|chosen|forgotten|frozen|stolen|worn)\b(?!\s+by)/i, "Missing auxiliary verb. Past participles need 'have/has/had'.", 'error', ["Use 'I have gone', 'I had done', etc."]);
      addFeedback(/\b(he|she|it)\s+(gone|done|seen|taken|given|written|spoken|eaten|driven|broken|chosen|forgotten|frozen|stolen|worn)\b(?!\s+by)/i, "Missing auxiliary verb. Past participles need 'have/has/had'.", 'error', ["Use 'has gone', 'had done', etc."]);
      
      // Irregular verbs
      addFeedback(/\b(runned|goed|eated)\b/i, "Irregular verb error detected.", 'error', ["ran", "went", "ate"]);

      // Subject-verb agreement (this/that are)
      addFeedback(/(?:^|[.!?]\s+)(this|that)\s+are\b/i, "Subject-verb agreement error. 'This' and 'That' are singular, but 'are' is plural.", 'error', ["Use 'These are', 'Those are', 'This is', or 'That is'."]);

      // Punctuation (multiple marks)
      addFeedback(/[.,;?!]{2,}(?!\.)/g, "Punctuation error. Avoid using multiple punctuation marks.", 'error', ["Use a single punctuation mark."]);

      // Spacing after punctuation
      addFeedback(/[.,;?!][a-zA-Z]/g, "Spacing error. Always put a space after punctuation marks.", 'error', ["Add a space after the punctuation."]);

      // Capitalization (start of sentence)
      addFeedback(/\. [a-z]/g, "Capitalization error. Always capitalize the first letter of a new sentence.", 'error', ["Capitalize the first letter."]);

      // Space before comma
      addFeedback(/\s+,/g, "Punctuation error. Do not put a space before a comma.", 'error', ["Remove the space before the comma."]);

      // Subject-verb agreement (who)
      addFeedback(/\b(student|person|one)\s+who\s+(learn|build|make|do|go)\b/i, "Subject-verb agreement error in relative clause. Singular subject 'who' requires a singular verb.", 'error', ["Use 'learns', 'builds', etc."]);

      // Space before punctuation
      addFeedback(/\s+[.,;?!]/g, "Punctuation error. Do not put a space before punctuation marks.", 'error', ["Remove the space."]);

      // Plural subject singular verb
      addFeedback(/\b(skills|benefits|students|people)\s+(helps|makes|is|has)\b/i, "Subject-verb agreement error. Plural subject requires a plural verb.", 'error', ["Use 'help', 'make', 'are', 'have'."]);

      // Word form
      addFeedback(/\bthinking\s+creativity\b/i, "Word form error. Use an adverb to modify a verb.", 'error', ["Use 'think creatively'."]);

      // Spelling/Word choice
      addFeedback(/\bspear\s+parts\b/i, "Spelling error / Wrong word choice.", 'error', ["Did you mean 'spare parts'?"]);

      // Number agreement
      addFeedback(/\btheoretical\s+concept\b/i, "Number agreement error. In this context, the plural form is usually required.", 'error', ["Use 'theoretical concepts'."]);

      // Missing object
      addFeedback(/\breads\s+about\s+in\b/i, "Missing object error. The verb 'reads' needs an object here.", 'error', ["Use 'reads about it in'."]);

      // Capitalization (secondly)
      addFeedback(/\.\s+secondly/i, "Capitalization error. Sentences should start with a capital letter.", 'error', ["Use 'Secondly'."]);

      // Word choice
      addFeedback(/the\s+important\s+of/i, "Word choice error. 'Important' is an adjective, but a noun is needed here.", 'error', ["Use 'the importance of'."]);

      // Subject-verb agreement (singular subject)
      addFeedback(/\b(student|he|she|it)\s+(prepare|learn|need|want|go)\b(?!\s+(will|can|should|must|might|could|would))/i, "Subject-verb agreement error. Singular subjects require singular verbs.", 'error', ["Change to singular form (e.g., 'prepares')."]);

      // Passive voice
      addFeedback(/be\s+equip\b/i, "Passive voice error. After 'be', use the past participle form.", 'error', ["Use 'be equipped'."]);

      // Punctuation (?.)
      addFeedback(/\?\./g, "Punctuation error. Do not use a period immediately after a question mark.", 'error', ["Remove the period."]);

      // Awkward phrasing
      addFeedback(/number\s+one\s+benefits/i, "Awkward phrasing. 'Number one benefits' is not standard English.", 'error', ["Use 'numerous benefits'."]);

      // Verb form (is went)
      addFeedback(/\b(am|is|are|was|were)\s+went\b/i, "Incorrect verb form. 'To be' verbs cannot be used with 'went'.", 'error', ["Use 'I went' or 'I am going'."]);

      // Parallelism
      addFeedback(/\b(love|like|enjoy|hate|prefer)\s+(run|walk|swim|read|write|speak|talk)\s+and\s+\w+ing\b/i, "Parallelism error. Verbs should match in form.", 'error', ["Use matching forms (e.g., 'running and jogging')."]);

      // Stative verbs
      addFeedback(/\b(am|is|are|was|were)\s+(knowing|believing|wanting|hating|preferring|needing)\b/i, "Stative verb error. This verb isn't usually used in continuous forms.", 'error', ["Use simple tense (e.g., 'I know')."]);

      // Prepositions
      addFeedback(/depend\s+of/i, "Preposition error. 'Depend' is followed by 'on'.", 'error', ["Use 'depend on'."]);
      addFeedback(/interested\s+on/i, "Preposition error. 'Interested' is followed by 'in'.", 'error', ["Use 'interested in'."]);
      addFeedback(/married\s+with/i, "Preposition error. 'Married' is followed by 'to'.", 'error', ["Use 'married to'."]);
      addFeedback(/good\s+in\b/i, "Preposition error. 'Good' (ability) is followed by 'at'.", 'error', ["Use 'good at'."]);
      addFeedback(/responsible\s+of/i, "Preposition error. 'Responsible' is followed by 'for'.", 'error', ["Use 'responsible for'."]);

      // Compare structure errors
      addFeedback(/\bcompare[sd]?\s+[\w\s]+\s+than\b/i, "Grammar error. Do not use 'than' with the verb 'compare'. Correct patterns are: 'compare A with B' or 'compare A and B'.", 'error', ["Use 'compare A with B' or 'compare A and B'."]);
      addFeedback(/\bcomparing\s+[\w\s]+\s+than\b/i, "Grammar error. Do not use 'than' with 'comparing'. Correct patterns are: 'comparing A with B' or 'comparing A and B'.", 'error', ["Use 'comparing A with B' or 'comparing A and B'."]);
      
      // "for" misused with compare (when talking about aspects)
      addFeedback(/\bcompare[sd]?\s+[\w\s]+\s+for\s+the\b/i, "Preposition error. When discussing topics or aspects with 'compare', use 'in terms of', 'regarding', or 'based on', not 'for'.", 'error', ["Use 'in terms of', 'regarding', or 'based on'."]);
      addFeedback(/\bcomparing\s+[\w\s]+\s+for\s+the\b/i, "Preposition error. When discussing topics or aspects with 'comparing', use 'in terms of', 'regarding', or 'based on', not 'for'.", 'error', ["Use 'in terms of', 'regarding', or 'based on'."]);

      // Common spellings
      const misspellings: Record<string, string> = {
        "teh": "the", "recieve": "receive", "definately": "definitely", "seperate": "separate",
        "occured": "occurred", "accommodate": "accommodate", "truely": "truly", 
        "publically": "publicly", "goverment": "government", "environment": "environment"
      };
      Object.keys(misspellings).forEach(wrong => {
        addFeedback(new RegExp(`\\b${wrong}\\b`, 'i'), `Spelling error detected: '${wrong}'`, 'error', [`Did you mean '${misspellings[wrong]}'?`]);
      });

      // Tense/Time
      addFeedback(/\byesterday\s+(is|are|go|eat|walk)\b/i, "Tense error. 'Yesterday' requires past tense.", 'error', ["Use 'was', 'went', etc."]);
      addFeedback(/\btomorrow\s+(was|were|went|ate|walked)\b/i, "Tense error. 'Tomorrow' requires future tense.", 'error', ["Use 'will be', 'will go', etc."]);
      
      // Past time marker + present tense verb error
      addFeedback(/\bbefore\s+(is|are|am)\b/i, "Tense inconsistency. 'Before' indicates past time, so use past tense.", 'error', ["Use 'was' or 'were' instead of 'is/are'."]);
      addFeedback(/\b(ago|previously|formerly|earlier)\s+(is|are|am)\b/i, "Tense inconsistency. Past time markers require past tense verbs.", 'error', ["Use 'was' or 'were' instead."]);
      addFeedback(/\b(last\s+(?:week|month|year|time))\s+(is|are|am)\b/i, "Tense inconsistency. Past time references require past tense.", 'error', ["Use 'was' or 'were'."]);
      
      // Present/future time marker + past tense error
      addFeedback(/\b(now|currently|presently)\s+(was|were)\b/i, "Tense inconsistency. 'Now/Currently' requires present tense.", 'error', ["Use 'is' or 'are' instead."]);
      addFeedback(/\b(next\s+(?:week|month|year))\s+(was|were)\b/i, "Tense inconsistency. Future time references require future tense.", 'error', ["Use 'will be'."]);
      
      // "before is" pattern anywhere in sentence (more flexible)
      addFeedback(/\bbefore\b[^.!?]*\b(is|are|am)\s+\w+ing?\b/i, "Tense inconsistency. When describing past situations with 'before', use past tense verbs.", 'error', ["Change 'is/are' to 'was/were'."]);

      // Fragments - CONTEXT AWARE
      if (/^(because|although|since|if|when)\s+[a-z\s]+\.$/i.test(text) && !text.includes(",")) {
        if (isFormal || isAcademic) {
          newFeedbacks.push({
            type: 'error',
            message: "Sentence fragment. In formal/academic writing, subordinate clauses must be attached to a main clause.",
            corrections: ["Rewrite as a complete sentence, e.g., 'Because the experiment failed, the results were invalid.'"]
          });
        } else if (isCreative) {
          newFeedbacks.push({
            type: 'info',
            message: "Sentence fragment detected. In creative/reflective writing, fragments can be used intentionally for emphasis or stylistic effect.",
          });
        } else {
          newFeedbacks.push({
            type: 'warning',
            message: "Sentence fragment. Consider whether this is intentional for effect, or needs a main clause.",
            corrections: ["Add a main clause if clarity is the goal."]
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
      addFeedback(/\ba\s+(apple|orange|egg|elephant|umbrella|hour)\b/i, "Article error. Use 'an' before vowel sounds.", 'error', ["Use 'an'."]);
      addFeedback(/\ban\s+(car|house|university|book|cat)\b/i, "Article error. Use 'a' before consonant sounds.", 'error', ["Use 'a'."]);

      // Capitalization (I) - always an error
      addFeedback(/\bi\b/g, "Capitalization error. The pronoun 'I' must always be capitalized.", 'error', ["Use 'I'."]);

      // Slang/Contractions - CONTEXT AWARE
      if (isFormal || isAcademic) {
        addFeedback(/\bain't\b/i, "Avoid slang like 'ain't' in formal/academic writing.", 'error', ["Use 'is not', 'are not', or 'am not'."]);
        addFeedback(/\bgonna\b/i, "Avoid informal language in formal writing.", 'error', ["Use 'going to'."]);
        addFeedback(/\bwanna\b/i, "Avoid informal language in formal writing.", 'error', ["Use 'want to'."]);
        addFeedback(/\bgotta\b/i, "Avoid informal language in formal writing.", 'error', ["Use 'have to' or 'got to'."]);
        addFeedback(/\bkinda\b/i, "Avoid informal language in formal writing.", 'error', ["Use 'kind of' or 'somewhat'."]);
        addFeedback(/\bsorta\b/i, "Avoid informal language in formal writing.", 'error', ["Use 'sort of' or 'somewhat'."]);
      } else if (isSemiFormal) {
        addFeedback(/\bain't\b/i, "Slang may be too casual for business communication.", 'warning', ["Consider 'is not' or 'are not'."]);
        addFeedback(/\bgonna\b/i, "Consider more formal language for professional contexts.", 'warning', ["Consider 'going to'."]);
      }
      // In informal contexts, these are acceptable - no feedback given
      
      // Contractions in formal writing
      if (isAcademic) {
        addFeedback(/\b(don't|won't|can't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|wouldn't|couldn't|shouldn't|didn't)\b/i, 
          "Contractions are generally avoided in academic essays. Consider using full forms.", 'warning', 
          ["Use full forms: 'do not', 'will not', 'cannot', etc."]);
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
                   {feedback.type === 'error' ? 'Error' : feedback.type === 'warning' ? 'Suggestion' : feedback.type === 'info' ? 'Note' : 'Success'}
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
                                  {feedback.type === 'error' ? 'Error' : feedback.type === 'warning' ? 'Suggestion' : feedback.type === 'info' ? 'Note' : 'Good'}
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
