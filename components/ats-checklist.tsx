"use client";

import React from "react";
import { CVData } from "@/types/cv";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, ListChecks } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { initialCVData } from "@/types/cv";

interface ATSChecklistProps {
  cvData: CVData;
}

export function ATSChecklist({ cvData }: ATSChecklistProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if data is sample data
  const isSampleData = cvData.personalInfo.email === initialCVData.personalInfo.email && 
                       cvData.personalInfo.fullName === initialCVData.personalInfo.fullName;

  // Analysis Logic
  const checks = [
    {
      id: "contact_email",
      label: "Email Address",
      passed: !!cvData.personalInfo.email && cvData.personalInfo.email.includes("@"),
      message: "Ensure you have a professional email address.",
    },
    {
      id: "contact_phone",
      label: "Phone Number",
      passed: !!cvData.personalInfo.phone,
      message: "Include a phone number for recruiters to contact you.",
    },
    {
      id: "contact_location",
      label: "Location",
      passed: !!cvData.personalInfo.location,
      message: "City and State/Country is usually sufficient.",
    },
    {
      id: "summary",
      label: "Professional Summary",
      passed: !!cvData.summary && cvData.summary.length > 50,
      message: "A summary should be at least 50 characters long to provide value.",
    },
    {
      id: "experience",
      label: "Work Experience",
      passed: cvData.experience.length > 0,
      message: "List your relevant work history.",
    },
    {
      id: "skills",
      label: "Skills Section",
      passed: cvData.skills.length > 0,
      message: "Include technical and soft skills relevant to the job.",
    },
    {
      id: "education",
      label: "Education",
      passed: cvData.education.length > 0,
      message: "List your educational background.",
    },
  ];

  const passedChecks = checks.filter((c) => c.passed).length;
  const totalChecks = checks.length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListChecks className="w-4 h-4" />
          ATS Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ATS Optimization Checklist</DialogTitle>
          <DialogDescription>
            Ensure your CV meets common Applicant Tracking System requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isSampleData && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800">Sample Data Detected</h4>
                <p className="text-xs text-amber-700 mt-1">
                  You are currently analyzing the sample CV data. Clear the data or import your own CV to get an accurate score.
                </p>
              </div>
            </div>
          )}

          {/* Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Optimization Score</span>
              <span>{score}%</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            {checks.map((check) => (
              <div
                key={check.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  check.passed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                }`}
              >
                {check.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      check.passed ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {check.label}
                  </h4>
                  <p
                    className={`text-xs mt-1 ${
                      check.passed ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {check.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* General Advice */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-900">
              <AlertCircle className="w-4 h-4" />
              General ATS Tips
            </h4>
            <ul className="list-disc list-inside text-xs text-blue-800 space-y-1">
              <li>Use standard section headings (Experience, Education, Skills).</li>
              <li>Avoid graphics, columns, and tables in the main text (our templates handle this).</li>
              <li>Use standard fonts (Arial, Calibri, Helvetica).</li>
              <li>Tailor keywords to the specific job description.</li>
              <li>Save as PDF unless Word is specifically requested.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
