import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ShieldCheck, UserCheck, AlertCircle, LogOut } from "lucide-react";

export default function ExamPolicies() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 space-y-4 text-center">
        <h1 className="text-4xl font-serif font-bold text-primary">On Test Day</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about test center policies and procedures.
        </p>
      </div>

      <div className="grid gap-6">
        <Accordion type="single" collapsible className="w-full space-y-4">
          
          {/* Before the Test */}
          <AccordionItem value="before-test" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold">Arriving at the Test Center</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-muted-foreground space-y-4">
              <p>
                <strong>Arrival Time:</strong> You must arrive at least 30 minutes before your scheduled test time. This allows sufficient time for check-in procedures and security checks.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>If you arrive more than 15 minutes late, you may not be allowed to take the test and will lose your test fee.</p>
              </div>
              <p>
                <strong>ID Requirements:</strong> You must present a valid, non-expired, government-issued ID (usually a passport). The name on your ID must exactly match the name on your registration.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* During the Test */}
          <AccordionItem value="during-test" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold">Security & Conduct</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-muted-foreground space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Items:</strong> No personal items (phones, watches, bags, notes) are allowed in the testing room. Lockers are provided.</li>
                <li><strong>Note Taking:</strong> You will be provided with an erasable booklet and pen. Do not bring your own stationery.</li>
                <li><strong>Security Checks:</strong> Expect palm vein scanning, digital photos, and signature verification.</li>
                <li><strong>Test Environment:</strong> The test is taken on a computer in a secure room. You will wear a headset for the speaking and listening sections.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Breaks */}
          <AccordionItem value="breaks" className="border rounded-lg bg-card px-4">
             <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <UserCheck className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold">Breaks</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-muted-foreground space-y-4">
              <p>
                There are no scheduled breaks during the standard 2-hour PTE Academic test.
              </p>
              <p>
                <strong>Unscheduled Breaks:</strong> You may take an unscheduled break to use the restroom, but the <strong>test timer will not stop</strong>. You must raise your hand and wait for the administrator.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* After the Test */}
          <AccordionItem value="after-test" className="border rounded-lg bg-card px-4">
             <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <LogOut className="h-5 w-5 text-orange-600" />
                <span className="text-lg font-semibold">After the Test</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-muted-foreground space-y-4">
              <p>
                Once you finish the test, raise your hand. The administrator will ensure your test has ended properly and escort you out.
              </p>
              <p>
                <strong>Scores:</strong> Results are typically available within 48 hours (often much sooner - sometimes within 2 hours). You will receive an email notification when your score report is ready.
              </p>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}
