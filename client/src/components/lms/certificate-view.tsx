import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/lib/lms-data";

interface CertificateViewProps {
  course: Course;
  studentName: string;
  completionDate: string;
  onDownload?: () => void;
}

export function CertificateView({ course, studentName, completionDate, onDownload }: CertificateViewProps) {
  return (
    <div className="bg-white p-8 md:p-12 border-4 border-double border-slate-200 shadow-xl max-w-4xl mx-auto relative overflow-hidden text-center">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-orange-500 rounded-tl-lg opacity-20"></div>
      <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-orange-500 rounded-tr-lg opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-orange-500 rounded-bl-lg opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-orange-500 rounded-br-lg opacity-20"></div>

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Award className="w-[500px] h-[500px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div className="flex justify-center mb-8">
           <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-200">
              <Award className="h-10 w-10 text-orange-600" />
           </div>
        </div>

        <div>
           <h4 className="text-xl font-serif text-slate-500 italic mb-2">Certificate of Completion</h4>
           <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Cirrus Training Academy</h1>
        </div>

        <div className="py-8">
           <p className="text-slate-500 text-lg">This certifies that</p>
           <h2 className="text-4xl font-bold text-slate-800 my-4 font-serif border-b-2 border-slate-100 pb-2 inline-block px-12">
             {studentName}
           </h2>
           <p className="text-slate-500 text-lg mt-2">has successfully completed the course</p>
           <h3 className="text-2xl font-bold text-indigo-700 mt-2">{course.title}</h3>
           <p className="text-slate-500 mt-1">({course.totalModules} Modules • {course.level || course.silo} Level)</p>
        </div>

        <div className="grid grid-cols-2 max-w-lg mx-auto gap-12 mt-12 pt-8 border-t border-slate-100">
           <div className="text-center">
              <div className="h-16 flex items-end justify-center pb-2">
                 <span className="font-signature text-2xl text-slate-600 font-serif italic">John Doe</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-300 pt-2">Training Director</p>
           </div>
           <div className="text-center">
              <div className="h-16 flex items-end justify-center pb-2">
                 <p className="text-lg text-slate-800">{completionDate}</p>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-300 pt-2">Date Issued</p>
           </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 print:hidden">
           <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2" onClick={onDownload}>
              <Download className="h-4 w-4" /> Download PDF
           </Button>
           <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
           </Button>
        </div>
      </div>
    </div>
  );
}
