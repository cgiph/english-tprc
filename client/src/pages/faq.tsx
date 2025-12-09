import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, BookOpen, Clock, Award, CreditCard, Laptop } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      category: "General Information",
      icon: HelpCircle,
      items: [
        {
          question: "What is PTE Academic UKVI?",
          answer: "PTE Academic UKVI is a secure English language test accepted by the UK Home Office for all UK visas that require a 4-skills language test. It is fast, fair, and convenient."
        },
        {
          question: "How is it different from standard PTE Academic?",
          answer: "The content and format of the test are identical. The only difference is the registration process and the report form, which includes a SELT Unique Reference Number (URN) required for your visa application."
        },
        {
          question: "Where can I take the test?",
          answer: "PTE Academic UKVI can be taken at approved Pearson test centers worldwide. You can find your nearest center on the official Pearson website."
        }
      ]
    },
    {
      category: "Exam Format & Scoring",
      icon: Clock,
      items: [
        {
          question: "How long is the exam?",
          answer: "The exam takes approximately 2 hours to complete. It is divided into three parts: Speaking & Writing, Reading, and Listening."
        },
        {
          question: "How is the test scored?",
          answer: "The test is scored by AI technology, ensuring unbiased and accurate results. Scores range from 10 to 90 on the Global Scale of English."
        },
        {
          question: "When will I get my results?",
          answer: "Most candidates receive their scores within 48 hours (2 business days). However, it can take up to 5 business days in some cases."
        }
      ]
    },
    {
      category: "Preparation",
      icon: BookOpen,
      items: [
        {
          question: "How should I prepare for the Speaking section?",
          answer: "Focus on oral fluency and pronunciation. Practice reading aloud, describing images, and retelling lectures. Use our platform's recording tools to self-assess your performance."
        },
        {
          question: "Are the mock tests scored?",
          answer: "Yes, our full mock tests provide an estimated score based on standard PTE criteria, giving you a realistic idea of your current level."
        }
      ]
    },
    {
      category: "Technical Requirements",
      icon: Laptop,
      items: [
        {
          question: "Do I need special equipment to use this site?",
          answer: "You need a computer or tablet with a reliable internet connection. For speaking practice, a working microphone is essential. We recommend using a headset for better audio quality."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about the PTE Academic UKVI exam and how our platform helps you prepare.
        </p>
      </div>

      <div className="grid gap-8">
        {faqs.map((section, idx) => (
          <div key={idx} className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 bg-muted/30 border-b flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <section.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{section.category}</h2>
            </div>
            <div className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, itemIdx) => (
                  <AccordionItem key={itemIdx} value={`item-${idx}-${itemIdx}`}>
                    <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-primary/5 rounded-xl p-8 border border-primary/10">
        <h3 className="text-lg font-bold text-foreground mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-6">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
