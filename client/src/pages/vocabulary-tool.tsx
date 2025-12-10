import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Volume2, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    }
  ];

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
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-primary/70">UK</span>
                    <span>{item.phonetics.uk}</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-primary/70">US</span>
                    <span>{item.phonetics.us}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Definition</h3>
                  <p className="text-lg leading-relaxed">{item.definition}</p>
                </div>
                
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
