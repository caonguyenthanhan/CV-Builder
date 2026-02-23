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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CVData } from "@/types/cv";

export function CVImport() {
  const { setCVData } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setUserApiKey(storedKey);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the Data-URI prefix (e.g. "data:application/pdf;base64,")
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const processImport = async (keyOverride?: string) => {
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
      
      let parts: any[] = [];

      if (file) {
        const base64Data = await fileToBase64(file);
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
        parts.push({
          text: "Extract data from this CV document and format it as JSON.",
        });
      } else if (textInput.trim()) {
        parts.push({
          text: `Extract data from the following CV text and format it as JSON:\n\n${textInput}`,
        });
      } else {
        setError("Vui lòng nhập nội dung hoặc tải lên file CV.");
        setLoading(false);
        return;
      }

      const prompt = `
        You are a data extraction assistant. Extract the CV information and return ONLY a valid JSON object matching the following TypeScript interface. 
        Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
        
        If a field is missing, use an empty string "" or empty array [].
        For 'themeColor', default to "#2563eb".
        
        Interface:
        interface CVData {
          themeColor: string;
          personalInfo: {
            fullName: string;
            title: string;
            email: string;
            phone: string;
            location: string;
            linkedin?: string;
            github?: string;
            website?: string;
          };
          summary: string;
          skills: {
            category: string; // e.g. "Languages", "Frontend", "Soft Skills"
            items: string; // comma separated list
          }[];
          experience: {
            id: string; // generate a random string
            company: string;
            position: string;
            startDate: string;
            endDate: string;
            description: string; // use newlines for bullet points
          }[];
          projects: {
            id: string; // generate a random string
            name: string;
            description: string;
            technologies: string;
            details: string; // use newlines for bullet points
          }[];
          education: {
            id: string; // generate a random string
            institution: string;
            degree: string;
            startDate: string;
            endDate: string;
            gpa?: string;
          }[];
          certifications: {
            id: string; // generate a random string
            name: string;
            issuer: string;
            date: string;
          }[];
          languages: {
            language: string;
            proficiency: string;
          }[];
        }
      `;

      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-latest",
        contents: { parts },
      });

      const responseText = response.text || "";
      // Clean up markdown code blocks if present
      const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedData = JSON.parse(jsonString);
      
      // Basic validation/sanitization could go here
      
      setCVData(parsedData);
      setIsOpen(false);
      // Reset form
      setFile(null);
      setTextInput("");
      
    } catch (err) {
      console.error("Import Error:", err);
      setError("Có lỗi xảy ra khi phân tích CV. Vui lòng kiểm tra lại file/nội dung hoặc API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    if (userApiKey.trim()) {
      localStorage.setItem("gemini_api_key", userApiKey.trim());
      setShowKeyInput(false);
      processImport(userApiKey.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import CV từ AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import CV cũ của bạn</DialogTitle>
          <DialogDescription>
            Sử dụng AI để tự động trích xuất thông tin từ CV cũ (PDF, Ảnh) hoặc văn bản.
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
            <Button onClick={handleSaveKey} className="w-full">Lưu & Tiếp tục</Button>
          </div>
        ) : (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Tải file (PDF/Ảnh)</TabsTrigger>
              <TabsTrigger value="text">Dán văn bản</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="cv-file">File CV</Label>
                <Input id="cv-file" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                <p className="text-xs text-slate-500">Hỗ trợ PDF, PNG, JPG (Max 5MB)</p>
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Đã chọn: {file.name}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cv-text">Nội dung CV</Label>
                <Textarea 
                  id="cv-text" 
                  placeholder="Copy và paste toàn bộ nội dung CV của bạn vào đây..." 
                  className="h-48"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
            </TabsContent>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>
              <Button onClick={() => processImport()} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {loading ? "Đang phân tích..." : "Phân tích & Điền"}
              </Button>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
