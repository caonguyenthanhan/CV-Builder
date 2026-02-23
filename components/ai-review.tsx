"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, ExternalLink, Lock, AlertCircle } from "lucide-react";
// import dynamic from "next/dynamic";

// const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface AIReviewProps {
  cvData: CVData;
}

export function AIReview({ cvData }: AIReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setUserApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (userApiKey.trim()) {
      localStorage.setItem("gemini_api_key", userApiKey.trim());
      setShowKeyInput(false);
      setError(null);
      handleReview(userApiKey.trim());
    }
  };

  const handleChangeKey = () => {
    setShowKeyInput(true);
    setError(null);
    setReview(null);
  };

  const handleReview = async (keyOverride?: string) => {
    setLoading(true);
    setReview(null);
    setError(null);
    setShowKeyInput(false);

    try {
      const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const apiKey = keyOverride || userApiKey || envKey;

      if (!apiKey) {
        setShowKeyInput(true);
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
    } catch (err: any) {
      console.error("AI Review Error:", err);
      let errorMessage = "An error occurred while reviewing the CV.";
      if (err.message) {
        errorMessage += ` (${err.message})`;
      }
      setError(errorMessage);
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
          onClick={() => handleReview()}
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
          ) : showKeyInput ? (
            <div className="h-full flex flex-col justify-center space-y-6 max-w-md mx-auto">
              <div className="text-center space-y-2">
                <div className="bg-amber-100 text-amber-800 p-3 rounded-lg flex items-start gap-3 text-sm text-left">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Cần Gemini API Key</p>
                    <p>Hệ thống chưa tìm thấy API Key mặc định. Vui lòng nhập key của riêng bạn để tiếp tục.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Gemini API Key</Label>
                  <Input 
                    id="apiKey" 
                    type="password" 
                    placeholder="Nhập API Key của bạn..." 
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleSaveKey} className="w-full">
                  Lưu Key & Bắt đầu Review
                </Button>

                <div className="text-xs text-slate-500 space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Lock className="w-3 h-3" />
                    Bảo mật & Riêng tư
                  </div>
                  <p>
                    API Key của bạn chỉ được lưu trên trình duyệt (LocalStorage) của thiết bị này. 
                    Chúng tôi <strong>tuyệt đối không</strong> thu thập hay lưu trữ key của bạn trên server.
                  </p>
                  <p>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1 inline-flex"
                    >
                      Lấy Gemini API Key miễn phí tại Google AI Studio <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-4">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg flex flex-col items-center gap-2 max-w-md">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <p className="font-semibold">Đã xảy ra lỗi</p>
                <p className="text-sm">{error}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleChangeKey}>
                  Nhập lại API Key
                </Button>
                <Button onClick={() => handleReview()}>
                  Thử lại
                </Button>
              </div>
            </div>
          ) : review ? (
            <ScrollArea className="h-full pr-4">
              <div className="prose prose-sm max-w-none prose-indigo whitespace-pre-wrap">
                {review}
                {/* <ReactMarkdown>{review}</ReactMarkdown> */}
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
          {!showKeyInput && !loading && !error && (
            <Button onClick={() => handleReview()} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {review ? "Đánh giá lại" : "Bắt đầu đánh giá"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
