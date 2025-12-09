import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, AlertCircle, FileCheck, Users } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: December 9, 2025</p>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>By accessing and using PTE PrepPH ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
            <p>
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              2. User Conduct
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>You agree to use the Service only for lawful purposes. You are prohibited from posting on or transmitting through the Service any material that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, sexually explicit, profane, hateful, or racially, ethnically, or otherwise objectionable.</li>
              <li>Encourages conduct that would constitute a criminal offense, give rise to civil liability, or otherwise violate any law.</li>
              <li>Contains a virus, trojan horse, or other harmful component.</li>
              <li>Violates the intellectual property rights of others.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              3. Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of PTE PrepPH and its licensors. The Service is protected by copyright, trademark, and other laws of both the United Kingdom and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of PTE PrepPH.</p>
            <p>
              Study materials, model answers, and practice questions provided on the platform are for personal educational use only and may not be 
              redistributed or sold.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              4. Disclaimer of Warranties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, 
              including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </p>
            <p>PTE PrepPH does not guarantee that the results obtained from the use of the service will be effective, accurate or reliable or that the quality of any products, services, or information purchased or obtained by you from the service will meet your expectations or be free from mistakes, errors or defects.</p>
            <p>
              We do not guarantee specific exam results or scores based on the use of our platform.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-8">
          <p>We reserve the right to modify these terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}
