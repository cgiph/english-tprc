import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Volume2, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import phonemicChart from "@assets/image_1766194097490.png";

export default function VocabularyTool() {
  const vocabList = [
    {
      word: "interconnection",
      type: "noun",
      phonetics: {
        uk: "/ˌɪn.tə.kəˈnek.ʃən/",
        us: "/ˌɪn.t̬ɚ.kəˈnek.ʃən/"
      },
      definition: "Connection to or with similar things",
      examples: [
        {
          source: "Pte.tools WFD – 42",
          text: "There are not many interconnections between philosophy and psychology."
        }
      ]
    },
    {
      word: "archaeologist",
      type: "noun",
      altSpelling: "US also 'archeologist'",
      phonetics: {
        uk: "/ˌɑː.kiˈɒl.ə.dʒɪst/",
        us: "/ˌɑːr.kiˈɑː.lə.dʒɪst/"
      },
      definition: "a person who studies archaeology",
      examples: [
        {
          source: "Pte.tools WFD – 58",
          text: "Archaeologists discovered tools and artifacts in ancient tombs."
        },
        {
          source: "Pte.tools WFD – 97",
          text: "The archaeologist's new discoveries stand out in previously overlooked foundations."
        }
      ]
    },
    {
      word: "recommendation",
      type: "noun",
      phonetics: {
        uk: "/ˌrek.ə.menˈdeɪ.ʃən/",
        us: "/ˌrek.ə.menˈdeɪ.ʃən/"
      },
      definition: "an official suggestion about the best thing to do",
      examples: [
        {
          source: "Pte.tools WFD – 4",
          text: "There is not enough evidence to support these recommendations."
        }
      ]
    },
    {
      word: "undergraduates",
      type: "noun",
      phonetics: {
        uk: "/ˌʌn.dəˈɡrædʒ.u.ət/",
        us: "/ˌʌn.dɚˈɡrædʒ.u.ət/"
      },
      definition: "a university or college student who is studying for their first degree",
      examples: [
        {
          source: "Pte.tools WFD – 371",
          text: "Undergraduates may pursue specific interests within certificate programs."
        },
        {
          source: "Pte.tools WFD – 120",
          text: "Undergraduates have a wide range of cultural modules to choose from."
        },
        {
          source: "Pte.tools WFD – 158",
          text: "The undergraduates need some specific sources to analyse a specific program."
        },
        {
          source: "Pte.tools WFD – 384",
          text: "These words recognized the excellence of the undergraduates’ research projects."
        },
        {
          source: "Pte.tools WFD – 428",
          text: "Reading widely is important for undergraduate study."
        }
      ]
    },
    {
      word: "communications",
      type: "plural noun",
      phonetics: {
        uk: "/kəˌmjuːnɪˈkeɪʃənz/",
        us: "/kəˌmju·nɪˈkeɪ·ʃənz/"
      },
      definition: "the activity or process of expressing ideas and feelings or of giving people information",
      examples: [
        {
          source: "Pte.tools WFD – 325",
          text: "Many graduates of journalism get jobs in the communications field."
        }
      ]
    },
    {
      word: "reconciliation",
      type: "noun",
      phonetics: {
        uk: "/ˌrek.ənˌsɪl.iˈeɪ.ʃən/",
        us: "/ˌrek.ənˌsɪl.iˈeɪ.ʃən/"
      },
      definition: "an end to a disagreement or conflict with somebody and the start of a good relationship again",
      examples: [
        {
          source: "Pte.tools WFD – 377",
          text: "While reconciliation is desirable, basic underlying issues must first be addressed."
        }
      ]
    },
    {
      word: "implementation",
      type: "noun",
      phonetics: {
        uk: "/ˌɪm.plɪ.menˈteɪ.ʃən/",
        us: "/ˌɪm.plə.menˈteɪ.ʃən/"
      },
      definition: "the process of putting a decision or plan into effect; execution",
      examples: [
        {
          source: "Pte.tools WFD – 19",
          text: "Implementation figures are expected to be improved in the next few years."
        }
      ]
    },
    {
      word: "transformation",
      type: "noun",
      phonetics: {
        uk: "/ˌtræns.fəˈmeɪ.ʃən/",
        us: "/ˌtræns.fɚˈmeɪ.ʃən/"
      },
      definition: "a complete change in somebody/something",
      examples: [
        {
          source: "Pte.tools WFD – 208",
          text: "The transformation of media has changed the way information both used and studied."
        }
      ]
    },
    {
      word: "transportation",
      type: "noun",
      phonetics: {
        uk: "/ˌtræn.spɔːˈteɪ.ʃən/",
        us: "/ˌtræn.spɚˈteɪ.ʃən/"
      },
      definition: "a system for carrying people or goods from one place to another using vehicles, roads, etc.",
      examples: [
        {
          source: "Pte.tools WFD – 40",
          text: "The toughest part of public transportation is funding."
        }
      ]
    },
    {
      word: "identification",
      type: "noun",
      phonetics: {
        uk: "/aɪˌden.tɪ.fɪˈkeɪ.ʃən/",
        us: "/aɪˌden.t̬ə.fəˈkeɪ.ʃən/"
      },
      definition: "the process of showing, proving or recognizing who or what somebody/something is",
      examples: [
        {
          source: "Pte.tools WFD – 340",
          text: "Student identification cards will be issued today and tomorrow."
        }
      ]
    },
    { 
      word: "abstract", 
      type: "adjective", 
      phonetics: {
        uk: "/æbstrækt/",
        us: "/æbstrækt/"
      },
      definition: "not concrete" 
    },
    { 
      word: "aesthetic", 
      type: "adjective", 
      phonetics: {
        uk: "/esˈθet̬.ɪk/",
        us: "[esˈTHedik]"
      },
      definition: "having to do with the appreciation of beauty" 
    },
    { 
      word: "alleviate", 
      type: "verb", 
      phonetics: {
        uk: "[əˈliːvieɪt]",
        us: "[əˈliːvieɪt]"
      },
      definition: "to ease a pain or a burden" 
    },
    { 
      word: "ambivalent", 
      type: "adjective", 
      phonetics: {
        uk: "/ˌæmˈbɪv.ə.lənt/",
        us: "/ˌæmˈbɪv.ə.lənt/"
      },
      definition: "simultaneously feeling opposing feelings; uncertain" 
    },
    { 
      word: "apathetic", 
      type: "adjective", 
      phonetics: {
        uk: "/ˌæp.əˈθet̬.ɪk/",
        us: "[ˌapəˈTHedik]"
      },
      definition: "feeling or showing little emotion" 
    },
    { 
      word: "auspicious", 
      type: "adjective", 
      phonetics: {
        uk: "/ɔːˈspɪʃ.əs/",
        us: "/ɑːˈspɪʃ.əs/"
      },
      definition: "favorable; promising" 
    },
    { 
      word: "benevolent", 
      type: "adjective", 
      phonetics: {
        uk: "/bəˈnev.əl.ənt/",
        us: "/bəˈnev.əl.ənt/"
      },
      definition: "well-meaning; generous" 
    },
    { word: "candor", type: "noun", definition: "sincerity; openness" },
    { word: "cogent", type: "adjective", definition: "convincing; reasonable" },
    { word: "comprehensive", type: "adjective", definition: "broad or complete in scope or content" },
    { word: "contemporary", type: "adjective", definition: "current, modern; from the same time" },
    { word: "conviction", type: "noun", definition: "a fixed or strong belief" },
    { word: "diligent", type: "adjective", definition: "marked by painstaking effort; hard-working" },
    { word: "dubious", type: "adjective", definition: "doubtful; of unlikely authenticity" },
    { word: "eclectic", type: "adjective", definition: "made up of a variety of sources or styles" },
    { word: "egregious", type: "adjective", definition: "conspicuously bad or offensive" },
    { word: "exculpate", type: "verb", definition: "to free from guilt or blame" },
    { word: "florid", type: "adjective", definition: "flowery or elaborate in style" },
    { word: "gratuitous", type: "adjective", definition: "given freely; unearned; unwarranted" },
    { word: "hackneyed", type: "adjective", definition: "worn out through overuse; trite" },
    { word: "idealize", type: "verb", definition: "to consider perfect" },
    { word: "impartial", type: "adjective", definition: "not in favor of one side or the other; unbiased" },
    { word: "imperious", type: "adjective", definition: "arrogantly domineering or overbearing" },
    { word: "inherent", type: "adjective", definition: "inborn; built-in" },
    { word: "innovative", type: "adjective", definition: "introducing something new" },
    { word: "inveterate", type: "adjective", definition: "long established; deep-rooted; habitual" },
    { word: "laudatory", type: "adjective", definition: "giving praise" },
    { word: "maverick", type: "noun", definition: "one who resists adherence to a group" },
    { word: "mollify", type: "verb", definition: "to calm or soothe" },
    { word: "novel", type: "adjective", definition: "strikingly new or unusual" },
    { word: "obdurate", type: "adjective", definition: "stubborn; inflexible" },
    { word: "objectivity", type: "noun", definition: "judgment uninfluenced by emotion" },
    { word: "obstinate", type: "adjective", definition: "stubbornly adhering to an opinion" },
    { word: "ornate", type: "adjective", definition: "elaborately decorated" },
    { word: "ostentatious", type: "adjective", definition: "describing a pretentious display" },
    { word: "paramount", type: "adjective", definition: "of chief concern or importance" },
    { word: "penitent", type: "adjective", definition: "expressing remorse for one’s misdeeds" },
    { word: "pervasive", type: "adjective", definition: "dispersed throughout" },
    { word: "plausible", type: "adjective", definition: "seemingly valid or acceptable; credible" },
    { word: "profound", type: "adjective", definition: "having great depth or seriousness" },
    { word: "prosaic", type: "adjective", definition: "unimaginative; dull; ordinary" },
    { word: "quandary", type: "noun", definition: "a state of uncertainty or perplexity" },
    { word: "rancorous", type: "adjective", definition: "hateful; marked by deep-seated ill will" },
    { word: "spurious", type: "adjective", definition: "not genuine; false; counterfeit" },
    { word: "stoic", type: "adjective", definition: "indifferent to pleasure or pain; impassive" },
    { word: "superfluous", type: "adjective", definition: "extra; unnecessary" },
    { word: "tenuous", type: "adjective", definition: "having little substance or strength; unsure; weak" },
    { word: "timorous", type: "adjective", definition: "timid; fearful" },
    { word: "transitory", type: "adjective", definition: "short-lived; temporary" },
    { word: "vindicated", type: "verb", definition: "freed from blame" },
    { 
      word: "ambiguous", 
      type: "adjective", 
      phonetics: {
        uk: "/æmˈbɪɡ.ju.əs/",
        us: "/æmˈbɪɡ.ju.əs/"
      },
      definition: "open to more than one interpretation; having a double meaning" 
    },
    { word: "coherent", type: "adjective", definition: "(of an argument, theory, or policy) logical and consistent" },
    { word: "differentiate", type: "verb", definition: "recognize or ascertain what makes (someone or something) different" },
    { word: "empirical", type: "adjective", definition: "based on, concerned with, or verifiable by observation or experience rather than theory or pure logic" },
    { word: "fluctuate", type: "verb", definition: "rise and fall irregularly in number or amount" },
    { word: "hierarchy", type: "noun", definition: "a system or organization in which people or groups are ranked one above the other according to status or authority" },
    { word: "intrinsic", type: "adjective", definition: "belonging naturally; essential" },
    { word: "legislation", type: "noun", definition: "laws, considered collectively" },
    { word: "qualitative", type: "adjective", definition: "relating to, measuring, or measured by the quality of something rather than its quantity" },
    { word: "rigorous", type: "adjective", definition: "extremely thorough, exhaustive, or accurate" },
    { word: "subsequent", type: "adjective", definition: "coming after something in time; following" },
    { word: "tangible", type: "adjective", definition: "perceptible by touch" },
    { word: "unprecedented", type: "adjective", definition: "never done or known before" },
    { word: "valid", type: "adjective", definition: "(of an argument or point) having a sound basis in logic or fact; reasonable or cogent" },
    { word: "widespread", type: "adjective", definition: "found or distributed over a large area or number of people" },
    { 
      word: "allocation", 
      type: "noun", 
      phonetics: {
        uk: "/ˌæl.əˈkeɪ.ʃən/",
        us: "/ˌæl.əˈkeɪ.ʃən/"
      },
      definition: "the action or process of allocating or sharing out something" 
    },
    { 
      word: "assignment", 
      type: "noun", 
      phonetics: {
        uk: "/əˈsaɪn.mənt/",
        us: "/əˈsaɪn.mənt/"
      },
      definition: "a task or piece of work allocated to someone as part of a job or course of study" 
    },
    { 
      word: "bibliography", 
      type: "noun", 
      phonetics: {
        uk: "/ˌbɪb.liˈɒɡ.rə.fi/",
        us: "/ˌbɪb.liˈɑː.ɡrə.fi/"
      },
      definition: "a list of the books referred to in a scholarly work" 
    },
    { word: "colloquial", type: "adjective", definition: "(of language) used in ordinary or familiar conversation; not formal or literary" },
    { word: "constituents", type: "noun", definition: "a component part of something" },
    { word: "curriculum", type: "noun", definition: "the subjects comprising a course of study in a school or college" },
    { word: "dissertation", type: "noun", definition: "a long essay on a particular subject, especially one written for a university degree or diploma" },
    { word: "epidemiology", type: "noun", definition: "the branch of medicine which deals with the incidence, distribution, and possible control of diseases" },
    { word: "extrapolate", type: "verb", definition: "extend the application of (a method or conclusion) to an unknown situation by assuming that existing trends will continue" },
    { word: "hypothesis", type: "noun", definition: "a supposition or proposed explanation made on the basis of limited evidence as a starting point for further investigation" },
    { word: "interim", type: "adjective", definition: "in or for the intervening period; provisional or temporary" },
    { word: "methodology", type: "noun", definition: "a system of methods used in a particular area of study or activity" },
    { word: "plagiarism", type: "noun", definition: "the practice of taking someone else's work or ideas and passing them off as one's own" },
    { word: "questionnaire", type: "noun", definition: "a set of printed or written questions with a choice of answers, devised for the purposes of a survey or statistical study" },
    { word: "sophisticated", type: "adjective", definition: "(of a machine, system, or technique) developed to a high degree of complexity" },
    { word: "sustainability", type: "noun", definition: "the ability to be maintained at a certain rate or level" },
    { word: "synopsis", type: "noun", definition: "a brief summary or general survey of something" },
    { word: "thesis", type: "noun", definition: "a statement or theory that is put forward as a premise to be maintained or proved" },
    { word: "transcript", type: "noun", definition: "a written or printed version of material originally presented in another medium" },
    { word: "tutorial", type: "noun", definition: "a period of instruction given by a university tutor to an individual or very small group" }
  ];

  const collocationList = [
    "Academic Achievement", "Military Force", "Reduce Emissions", "Academic Measurement", "Modified Version", "Reduce Stress",
    "Academic Record", "Municipal Government", "Related Factor", "Academic Skills", "National Interest", "Related Topic",
    "Academic Year", "National Movement", "Relevant Factors", "Actively Involved", "Natural Science", "Reliable Information",
    "Additional Problem", "Negative Attitude", "Report Findings", "Alternative Solution", "Newly Created", "Research Effort",
    "Appropriate Action", "Next Decade", "Ruling Class", "Appropriate Language", "Objective Reality", "Rural Society",
    "Basic Component", "Obvious Point", "Scientific Theory", "Become (The) Focus", "Opinion Leader", "Seek Help",
    "Become Involved", "Organizational Structure", "Set (An) Objective", "Become the Focus", "Overall Level", "Set an Objective",
    "Brief Notes", "Paid Employment", "Sexual Behavior", "Broad Category", "Particularly Sensitive", "Show Evidence",
    "Careful Attention", "Particularly Useful", "Significant Amount",
    "Carry Out Research", "Personal Experience", "Significant Interaction", "Central Role", "Personal Responsibility", "Significant Relationship", 
    "Characteristic Feature", "Physical Symptom", "Similar Situation", "Classic Example", "Place Emphasis", "Single Entity", 
    "Immediate Environment", "Political Culture", "Single Variable", "Imported Goods", "Political Identity", "Social Attitudes", 
    "Increased Production", "Political Science", "Social Construct", "Increasing Emphasis", "Political Stability", "Social Isolation", 
    "Indigenous Population", "Poorly Understood", "Social Phenomenon", "Individual Component", "Positive Impact", "Socioeconomic Status", 
    "Industrialized Country", "Positive View", "Sovereign State", "Information Processing", "Powerful Force", "Specific Function", 
    "Intellectual Property", "Practical Difficulties", "Specific Needs", "Internal Conflict", "Present Evidence", "Statistical Data", 
    "Intimate Relationship", "Previous Decade", "Statistically Significant", "Introductory Text", "Primarily Responsible", "Strong Reaction", 
    "Key Points", "Primary Education", "Strongly Correlated", "Key Source", "Prime Time", "Subsequent Work",
    "Large Percentage", "Principal Source", "Substantially Different", "Learning Objective", "Prior Experience", "Take On (The) Role", 
    "Legal Basis", "Private Sector", "Take On the Role", "Likely Outcome", "Professional Activity", "Take Precedence", 
    "Limited Range", "Prominent Member", "Technological Innovation", "Local Authority", "Promote the Development", "Theoretical Analysis", 
    "Logical Approach", "Proposed Legislation", "Top Management", "Low/Er Frequency", "Prove Successful", "Traditional Form", 
    "Lowe Frequency", "Provide (A) Source", "Undertake Work", "Main Characteristics", "Provide Insight", "Use (A) Method", 
    "Major Cause", "Public Domain", "Use A Method", "Major Decision", "Public Perception", "Use Effectively", 
    "Make (A) Judgement", "Qualitative Approach", "Vary Greatly", "Make a Judgement", "Quantitative Analysis", "Visual Media", 
    "Make Arrangements", "Raise Awareness", "Vital Role", "Make Policy", "Random Variable", "Widely Different", 
    "Maximum Duration", "Receive Information", "Widespread Acceptance", "Metropolitan Area", "Recent Survey", "Written Comment"
  ];

  const confusedList = [
    { pair: "affect / effect", note: "Affect is usually a verb (to influence), Effect is usually a noun (a result)." },
    { pair: "accept / except", note: "Accept means to receive, Except means to exclude." },
    { pair: "advice / advise", note: "Advice is a noun (suggestion), Advise is a verb (to recommend)." },
    { pair: "complement / compliment", note: "Complement completes something, Compliment is praise." },
    { pair: "principle / principal", note: "Principle is a fundamental truth, Principal is a head of a school or main." },
    { pair: "stationary / stationery", note: "Stationary means not moving, Stationery refers to writing materials." },
    { pair: "discreet / discrete", note: "Discreet means careful/secret, Discrete means separate/distinct." },
    { pair: "elicit / illicit", note: "Elicit means to draw out, Illicit means illegal/forbidden." },
    { pair: "their / there", note: "Their is possessive (belonging to them), There refers to a place or position." }
  ];

  const misspelledList = [
    "accommodate", "achieve", "across", "aggressive", "apparently", "appearance", "argument", "assassination", "basically", 
    "beginning", "believe", "bizarre", "business", "calendar", "caribbean", "cemetery", "chauffeur", "colleague", "coming", 
    "committee", "completely", "conscious", "curiosity", "definitely", "dilemma", "disappear", "disappoint", "ecstasy", 
    "embarrass", "environment", "existence", "fascist", "fluorescent", "foreign", "foresee", "forty", "forward", "friend", 
    "further", "gist", "glamorous", "government", "guard", "happened", "harass", "honor", "humorous", "idiosyncrasy", 
    "immediately", "incidentally", "independent", "interrupt", "irresistible", "knowledge", "liaison", "lollipop", "millennium", 
    "mischievous", "misspell", "necessary", "noticeable", "occasion", "occurred", "occurrence", "pavilion", "persistent", 
    "pharaoh", "piece", "politician", "possession", "preferred", "propaganda", "publicly", "really", "receive", "recommend", 
    "religious", "remember", "resistance", "sense", "separate", "siege", "successful", "supersede", "surprise", "tattoo", 
    "tendency", "therefore", "threshold", "tomorrow", "tongue", "truly", "unforeseen", "unfortunately", "until", "weird", 
    "wherever", "which"
  ];

  // Sort lists alphabetically
  vocabList.sort((a, b) => a.word.localeCompare(b.word));
  collocationList.sort();
  confusedList.sort((a, b) => a.pair.localeCompare(b.pair));
  misspelledList.sort();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Vocabulary Building Tool</h1>
            <p className="text-muted-foreground mt-2">
              Master essential PTE Academic collocations and vocabulary words.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search words..." className="pl-9" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="phonemic-chart" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-5xl">
          <TabsTrigger value="phonemic-chart">Phonemic Chart</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary Words</TabsTrigger>
          <TabsTrigger value="collocations">Common Collocations</TabsTrigger>
          <TabsTrigger value="confused">Confused Words</TabsTrigger>
          <TabsTrigger value="misspelled">Misspelled Words</TabsTrigger>
        </TabsList>

        <TabsContent value="vocabulary" className="space-y-6">
          <div className="grid gap-6">
            {vocabList.map((item, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-2xl font-bold text-primary">{index + 1}. {item.word}</h2>
                      <span className="text-sm font-medium italic text-muted-foreground">({item.type})</span>
                      {item.altSpelling && (
                        <span className="text-xs text-muted-foreground">({item.altSpelling})</span>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm font-mono text-muted-foreground bg-background px-3 py-1.5 rounded-md border">
                      {item.phonetics ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-primary/70">UK</span>
                            <span>{item.phonetics.uk}</span>
                          </div>
                          <div className="w-px h-4 bg-border" />
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-primary/70">US</span>
                            <span>{item.phonetics.us}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs italic">Phonetics not available</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Definition</h3>
                      <p className="text-lg leading-relaxed">{item.definition}</p>
                    </div>
                    
                    {item.examples && item.examples.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Examples in Context</h3>
                        <div className="space-y-3">
                          {item.examples.map((example, i) => (
                            <div key={i} className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                              <div className="flex items-start gap-3">
                                <Badge variant="outline" className="mt-0.5 bg-background text-xs font-normal text-muted-foreground shrink-0">
                                  {example.source}
                                </Badge>
                                <p className="text-foreground/90 italic">
                                  "{example.text}"
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collocations">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Common PTE Collocations</CardTitle>
              <CardDescription>
                Memorize these word pairs to improve your Reading and Writing scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collocationList.map((collocation, index) => (
                  <div key={index} className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 hover:bg-secondary/20 transition-colors flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                    <span className="font-medium text-foreground">{collocation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confused">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Commonly Confused Words</CardTitle>
              <CardDescription>
                Words that look or sound similar but have different meanings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {confusedList.map((item, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg border hover:bg-muted/40 transition-colors">
                    <h3 className="text-lg font-bold text-primary mb-1">{item.pair}</h3>
                    <p className="text-muted-foreground text-sm">{item.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="misspelled">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Commonly Misspelled Words</CardTitle>
              <CardDescription>
                Watch out for spelling mistakes with these tricky words.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {misspelledList.map((word, index) => (
                  <div key={index} className="p-2 px-3 bg-red-50 text-red-900 rounded border border-red-100 font-mono text-sm text-center">
                    {word}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phonemic-chart">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Phonemic Chart</CardTitle>
              <CardDescription>
                The 44 phonemes of Received Pronunciation based on the Adrian Underhill layout.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex justify-center bg-white/50">
              <div className="max-w-4xl w-full overflow-hidden rounded-xl border shadow-sm bg-white">
                <img 
                  src={phonemicChart} 
                  alt="Phonemic Chart" 
                  className="w-full h-auto"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
