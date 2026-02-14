import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-slate-200">
        <CardContent className="pt-12 pb-12 px-8 flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-xl font-medium text-slate-700 mb-4">Page Not Found</h2>
          
          <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <Link href="/">
              <Button className="w-full gap-2 bg-slate-900 hover:bg-slate-800">
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </Link>
            <Link href="/lms">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
