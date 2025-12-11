import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Check, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function GrammarTool() {
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

      <Tabs defaultValue="sva" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="sva" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Subject-Verb Agreement</TabsTrigger>
          <TabsTrigger value="pos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Parts of Speech</TabsTrigger>
          <TabsTrigger value="sentence" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Sentence Structures</TabsTrigger>
          <TabsTrigger value="punctuation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Punctuation</TabsTrigger>
          <TabsTrigger value="reported" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background">Reported Speech</TabsTrigger>
        </TabsList>

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
