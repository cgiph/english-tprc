import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface DisclaimerModalProps {
  onStart: () => void;
  children: React.ReactNode;
}

export default function DisclaimerModal({ onStart, children }: DisclaimerModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Important Disclaimer</DialogTitle>
          <DialogDescription>
            Please read the following information carefully before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>This full mock test is a practice simulation designed to help PTE Academic test-takers become familiar with the task types, timing, and test flow of the PTE Academic exam.</p>
            <p>This is not an official PTE Academic test and is not endorsed by Pearson. While the test structure is designed to reflect the PTE format, scores generated in this mock test are indicative only and do not guarantee or predict official PTE Academic scores.</p>
            <p>PTE Academic is a registered trademark of Pearson PLC. For visa, migration, or academic purposes, candidates must take the official test at an authorized PTE test centre.</p>
        </div>
        <DialogFooter>
          <Button onClick={onStart} className="w-full sm:w-auto">Start Full Mock Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
