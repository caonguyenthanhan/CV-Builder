"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { useCVStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Languages, Loader2, AlertCircle, Lock, ExternalLink } from "lucide-react";

export function AITranslator() {
  const { cvData, setCVData } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("English");
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
      handleTranslate(userApiKey.trim());
    }
  };

  const handleChangeKey = () => {
    setShowKeyInput(true);
    setError(null);
  };

  const handleTranslate = async (keyOverride?: string) => {
    setLoading(true);
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
        You are a professional translator. Translate the following CV data JSON to ${targetLang}.
        Maintain the exact same JSON structure. Only translate the values of the fields, do not translate keys.
        
        For 'personalInfo', 'summary', 'skills' (items), 'experience' (company, position, description), 'projects' (name, description, details), 'education' (institution, degree), 'certifications' (name, issuer).
        
        Do NOT translate proper names if they shouldn't be translated (e.g. company names usually stay the same, but job titles can be translated).
        
        Return ONLY the raw JSON string, no markdown formatting.
        
        CV Data:
        ${JSON.stringify(cvData, null, 2)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const responseText = response.text || "";
      const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const translatedData = JSON.parse(jsonString);
      
      // Preserve settings and sections which might not be in the LLM output or to ensure safety
      const langMap: Record<string, string> = {
        'Vietnamese': 'vi',
        'English': 'en',
        'Japanese': 'ja',
        'Korean': 'ko',
        'Chinese': 'zh',
        'French': 'fr',
        'German': 'de'
      };

      const finalData = {
        ...translatedData,
        settings: {
          ...cvData.settings,
          language: langMap[targetLang] || 'en'
        },
        sections: cvData.sections,
        themeColor: cvData.themeColor
      };

      setCVData(finalData);
      setIsOpen(false);
      alert(`Đã dịch sang ${targetLang} thành công!`);

    } catch (err: any) {
      console.error("Translation Error:", err);
      let errorMessage = "Có lỗi xảy ra khi dịch CV.";
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
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="w-4 h-4" />
          Dịch CV (AI)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dịch CV đa ngôn ngữ</DialogTitle>
          <DialogDescription>
            Sử dụng AI để dịch toàn bộ nội dung CV sang ngôn ngữ khác.
          </DialogDescription>
        </DialogHeader>

        {showKeyInput ? (
          <div className="space-y-4 py-4">
             <div className="bg-amber-50 text-amber-800 p-3 rounded-md flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Yêu cầu API Key</p>
                <p>Vui lòng nhập Gemini API Key để sử dụng tính năng này.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gemini API Key</Label>
              <Input 
                type="password" 
                value={userApiKey} 
                onChange={(e) => setUserApiKey(e.target.value)} 
                placeholder="Nhập API Key..."
              />
            </div>
            <div className="text-xs text-slate-500 space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <Lock className="w-3 h-3" />
                Bảo mật & Riêng tư
              </div>
              <p>
                API Key của bạn chỉ được lưu trên trình duyệt (LocalStorage).
              </p>
              <p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-1 inline-flex"
                >
                  Lấy Gemini API Key miễn phí <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
            <Button onClick={handleSaveKey} className="w-full">Lưu & Dịch</Button>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center text-center space-y-4 p-4">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg flex flex-col items-center gap-2 w-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <p className="font-semibold">Lỗi</p>
                <p className="text-sm">{error}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={handleChangeKey} className="flex-1">
                  Nhập lại Key
                </Button>
                <Button onClick={() => handleTranslate()} className="flex-1">
                  Thử lại
                </Button>
              </div>
            </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Chọn ngôn ngữ đích</Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English (Tiếng Anh)</SelectItem>
                  <SelectItem value="Vietnamese">Vietnamese (Tiếng Việt)</SelectItem>
                  <SelectItem value="Japanese">Japanese (Tiếng Nhật)</SelectItem>
                  <SelectItem value="Korean">Korean (Tiếng Hàn)</SelectItem>
                  <SelectItem value="Chinese">Chinese (Tiếng Trung)</SelectItem>
                  <SelectItem value="French">French (Tiếng Pháp)</SelectItem>
                  <SelectItem value="German">German (Tiếng Đức)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleTranslate()} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Languages className="w-4 h-4 mr-2" />}
              {loading ? "Đang dịch..." : "Bắt đầu dịch"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
