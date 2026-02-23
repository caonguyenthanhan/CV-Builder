"use client";

import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { CVData } from "@/types/cv";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AIReviewProps {
  cvData: CVData;
}

export function AIReview({ cvData }: AIReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string | null>(null);

  const handleReview = async () => {
    setLoading(true);
    setReview(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setReview("Error: Gemini API key is missing. Please configure it in your environment.");
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are an expert HR specialist and CV reviewer. Please review the following CV data and provide constructive feedback to make it ATS-friendly, professional, and impactful.
        
        CV Data:
        ${JSON.stringify(cvData, null, 2)}
        
        Please provide the review in the following format (Markdown):
        
        ## 🎯 Overall Score: [Score]/100
        
        ### ✅ Strengths
        - [Strength 1]
        - [Strength 2]
        - [Strength 3]
        
        ### ⚠️ Areas for Improvement
        - [Weakness 1]
        - [Weakness 2]
        - [Weakness 3]
        
        ### 💡 Specific Suggestions
        **Summary:**
        [Critique and suggested rewrite]
        
        **Experience:**
        [Select one key experience and suggest how to make it more result-oriented with metrics]
        
        **Skills:**
        [Suggestions on skill organization or missing key skills for the role]
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-latest",
        contents: prompt,
      });

      setReview(response.text || "No feedback received.");
    } catch (error) {
      console.error("AI Review Error:", error);
      setReview("An error occurred while reviewing the CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full md:w-auto bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200"
          onClick={handleReview}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Review & Đánh giá
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Đánh giá CV bởi AI
          </DialogTitle>
          <DialogDescription>
            AI sẽ phân tích CV của bạn và đưa ra các gợi ý để cải thiện nội dung, cấu trúc và độ chuẩn ATS.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden mt-4 border rounded-md bg-slate-50 p-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p>Đang phân tích CV của bạn...</p>
            </div>
          ) : review ? (
            <ScrollArea className="h-full pr-4">
              <div className="prose prose-sm max-w-none prose-indigo">
                <ReactMarkdown>{review}</ReactMarkdown>
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Nhấn vào nút bên dưới để bắt đầu đánh giá.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Đóng</Button>
          <Button onClick={handleReview} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {review ? "Đánh giá lại" : "Bắt đầu đánh giá"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
