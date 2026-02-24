"use client";

import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Check, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AIWriterProps {
  currentText: string;
  onApply: (text: string) => void;
  context: string; // e.g., "Professional Summary", "Job Description"
}

export function AIWriter({ currentText, onApply, context }: AIWriterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tone, setTone] = useState("professional");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRewrite = async () => {
    if (!currentText) return;

    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        alert("Please provide a Gemini API Key in the settings or .env file.");
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      let prompt = `Rewrite the following ${context} for a CV. Tone: ${tone}. Keep the same meaning but improve clarity, impact, and grammar. Do not add any conversational filler. Just output the rewritten text.\n\nOriginal Text:\n${currentText}`;

      if (context === "Job Description") {
        prompt += "\n\nUse bullet points (starts with - ) and strong action verbs.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        setGeneratedText(text.trim());
      }
    } catch (error) {
      console.error("AI Rewrite Error:", error);
      alert("Failed to rewrite text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    onApply(generatedText);
    setIsOpen(false);
    setGeneratedText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50" title="Rewrite with AI">
          <Sparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>AI Writer</DialogTitle>
          <DialogDescription>
            Improve your {context.toLowerCase()} with AI assistance.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional (Standard)</SelectItem>
                <SelectItem value="concise">Concise (Short & Direct)</SelectItem>
                <SelectItem value="executive">Executive (High Impact)</SelectItem>
                <SelectItem value="creative">Creative (Unique)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Original</Label>
            <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md max-h-32 overflow-y-auto">
              {currentText || "No text to rewrite."}
            </div>
          </div>

          {generatedText && (
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> AI Suggestion
              </Label>
              <Textarea 
                value={generatedText} 
                onChange={(e) => setGeneratedText(e.target.value)}
                className="min-h-[120px] border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {!generatedText ? (
            <Button onClick={handleRewrite} disabled={isLoading || !currentText} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Rewrite
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={handleRewrite} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleApply} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Apply
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
