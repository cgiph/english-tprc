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
          question: "What is PTE Academic?",
          answer: "PTE Academic is accepted by over 3,900 universities and colleges globally for study, by Australia and New Zealand for work and migration visas, and for professional registration. The test of English is computer-based that assesses your academic-level speaking, writing, reading and listening skills. You take the test in a small, friendly test center environment in just two hours."
        },
        {
          question: "How is it different from PTE UKVI?",
          answer: "PTE Academic is designed for general academic purposes, while PTE UKVI is specifically for UK visa and immigration requirements."
        },
        {
          question: "Where can I take the test?",
          answer: "You can take the PTE Academic test at various test centers worldwide. PTE has over 500 test centers globally, including locations in Australia (Sydney, Melbourne, Perth, Brisbane).  Philippines: There are authorized test centers in Manila, Cebu, and Davao.   You can book your test online through the official Pearson PTE website, where you can select your preferred test center and date.  For specific locations and availability, it's best to check the official Pearson PTE website or contact the test centers directly."
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
          answer: "The PTE Academic test is scored on a scale from 10 to 90, reflecting your overall ability to communicate in English. The scoring evaluates four main areas: Speaking, Writing, Reading, and Listening. Each section is scored individually, and the overall score is calculated using a complex algorithm that considers your performance across all question types. For example, tasks that involve reading and speaking will contribute to both scores, while tasks that focus on writing and listening will contribute to those respective scores. The scoring system aims to provide a comprehensive assessment of your English proficiency, helping you identify strengths and areas for improvement."
        },
        {
          question: "When will I get my results?",
          answer: "You can expect to receive your PTE Academic test results within 2 days after taking the test. However, in some cases, it may take up to 5 working days for the scores to be finalized and sent to you via email. To ensure you receive your results promptly, make sure to check your email regularly, including your spam or junk folders, and log into your 'my PTE' account to view your scores."
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
