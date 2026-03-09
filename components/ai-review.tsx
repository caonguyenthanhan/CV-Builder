"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from "@/types/cv";
import { useCVStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Sparkles, Loader2, ExternalLink, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
// import dynamic from "next/dynamic";

// const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AIReviewProps {
  cvData: CVData;
}

const PROMPT_MODES = [
  {
    id: "diagnosis",
    title: "1. Chẩn đoán CV & 'Diệt gọn' lỗi sơ đẳng",
    description: "Đánh giá ATS, chỉ ra 'điểm đen', từ khóa thiếu và viết lại CV chuẩn 2025-2026.",
    needsInput: false,
  },
  {
    id: "keywords",
    title: "2. 'Cỗ máy' tối ưu từ khóa theo JD",
    description: "Lọc từ khóa từ JD, so sánh với CV và viết lại bullet points để lồng ghép từ khóa.",
    needsInput: true,
    inputPlaceholder: "Nhập 3-5 chức danh mục tiêu hoặc dán Job Description (JD) vào đây...",
  },
  {
    id: "achievements",
    title: "3. Phù phép câu chữ & Định lượng hóa thành tựu",
    description: "Viết lại các kinh nghiệm làm việc theo công thức: Động từ mạnh + Con số + Tác động.",
    needsInput: false,
  },
  {
    id: "linkedin",
    title: "4. 'F5' Profile LinkedIn & Xây dựng thương hiệu",
    description: "Tạo Headline, About, gợi ý Skills, ý tưởng bài đăng và Personal Branding Statement.",
    needsInput: false,
  },
  {
    id: "cover_letter",
    title: "5. Trình tạo Thư xin việc (Cover Letter) chuẩn ATS",
    description: "Viết Cover Letter súc tích, tác động mạnh dựa trên CV và JD.",
    needsInput: true,
    inputPlaceholder: "Dán Link tuyển dụng hoặc nội dung JD vào đây...",
  },
  {
    id: "interview",
    title: "6. Dự đoán câu hỏi & Khung trả lời phỏng vấn",
    description: "Liệt kê câu hỏi phỏng vấn (STAR), gợi ý trả lời và cách xử lý 'điểm yếu'.",
    needsInput: true,
    inputPlaceholder: "Nhập Vị trí mục tiêu / Công ty hoặc dán JD vào đây...",
  },
  {
    id: "tracking",
    title: "7. Hệ thống quản lý & Theo dõi ứng tuyển",
    description: "Tạo bảng theo dõi, cú pháp tìm việc, mẫu tin nhắn DM và Follow-up.",
    needsInput: false,
  }
];

export function AIReview({ cvData }: AIReviewProps) {
  const { setCVData, revertCVData } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [mode, setMode] = useState<string>("diagnosis");
  const [additionalInput, setAdditionalInput] = useState("");

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
    setApplySuccess(false);
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
      
      let prompt = "";
      const cvDataString = JSON.stringify(cvData, null, 2);

      switch (mode) {
        case "diagnosis":
          prompt = `
            Hãy đóng vai một Chuyên gia Tuyển dụng cao cấp (Senior Recruiter) cực kỳ khó tính, người đã từng "soi" hơn 10.000 CV trong các lĩnh vực Tech, Marketing, Tài chính, Sales và Product.
            Dữ liệu đầu vào: Đây là toàn bộ CV của ứng viên:
            ${cvDataString}
            
            Yêu cầu:
            1. Đánh giá thẳng tay:
            - Chấm điểm độ thân thiện với hệ thống lọc CV (ATS) trên thang điểm 10 và chỉ rõ lý do.
            - Chỉ ra 3–5 "điểm đen" (red flags) khiến nhà tuyển dụng loại thẳng tay từ vòng gửi xe.
            - Các phần/cách dùng từ/định dạng đang bị yếu hoặc lỗi thời.
            - Những từ khóa (keywords) hoặc thành tựu còn thiếu cho vị trí mục tiêu.
            - Tóm tắt đúng 1 câu: Nhà tuyển dụng đang nhìn nhận ứng viên này như thế nào qua bản CV hiện tại?
            
            2. Viết lại toàn bộ CV:
            Sau khi đã sửa hết các lỗi trên.
            - Yêu cầu: Tối ưu ATS, chèn từ khóa chuyên ngành, tập trung vào thành tựu (achievement-focused) và trình bày sạch đẹp.
            - Áp dụng tiêu chuẩn 2025–2026: Thứ tự thời gian ngược, dùng động từ mạnh, định lượng kết quả bằng con số, bỏ phần "Mục tiêu nghề nghiệp" rườm rà (trừ khi là cấp quản lý Senior).
            
            Trả lời bằng định dạng Markdown rõ ràng.
          `;
          break;
        case "keywords":
          prompt = `
            Vị trí mục tiêu / Job Description: ${additionalInput}
            
            Dựa trên bản CV sau:
            ${cvDataString}
            
            Yêu cầu:
            - Lọc ra top 20–30 từ khóa (Hard skills & Soft skills) xuất hiện nhiều nhất trong các tin tuyển dụng gần đây cho vị trí này.
            - Chỉ rõ từ khóa nào đã có, từ khóa nào còn thiếu trong CV.
            - Viết lại 4–6 gạch đầu dòng (bullet points) cho mỗi kinh nghiệm làm việc để lồng ghép các từ khóa thiếu một cách tự nhiên nhất (không nhồi nhét vô tội vạ).
            - Gợi ý 2–3 thành tựu mới mà ứng viên nên bổ sung (nếu thực sự đã làm qua).
            - Kết quả: Xuất ra một bản "CV tổng" (Master CV) đã tối ưu cho mọi vị trí và một bản "may đo" riêng cho JD cụ thể này.
            
            Trả lời bằng định dạng Markdown rõ ràng.
          `;
          break;
        case "achievements":
          const experiences = cvData.experience.map(exp => `- ${exp.company} (${exp.position}):\n${exp.description}`).join('\n\n');
          prompt = `
            Lấy toàn bộ các gạch đầu dòng trong phần Kinh nghiệm làm việc sau:
            ${experiences}
            
            Với mỗi ý, hãy viết lại theo công thức:
            - Bắt đầu bằng một động từ hành động mạnh mẽ (Ví dụ: Đột phá, Tái cấu trúc, Dẫn dắt...).
            - Thêm con số cụ thể: %, $, số giờ tiết kiệm được, quy mô dự án... (nếu không nhớ chính xác, hãy đưa ra giả định hợp lý và ghi chú lại).
            - Làm nổi bật Tác động (Impact): Ai là người hưởng lợi? Kết quả quan trọng thế nào?
            - Giữ mỗi ý tối đa 2 dòng. Mục tiêu: Mỗi câu viết ra phải khiến nhà tuyển dụng muốn "chốt đơn" ngay lập tức thay vì chỉ liệt kê nhiệm vụ nhàm chán.
            
            Trả lời bằng định dạng Markdown rõ ràng.
          `;
          break;
        case "linkedin":
          prompt = `
            Dựa trên CV sau:
            ${cvDataString}
            
            Yêu cầu:
            - Viết một Headline (Tiêu đề) cực hút (tối đa 220 ký tự) gồm: Vị trí + Giá trị cốt lõi + Bộ từ khóa chuyên môn.
            - Viết phần About (Giới thiệu) từ 3–5 dòng: Phải gây ấn tượng trong 3 giây đầu, kể một câu chuyện ngắn về kết quả công việc và kết thúc bằng một lời kêu gọi rõ ràng.
            - Đề xuất 5–7 kỹ năng (Skills) cần ghim lên đầu.
            - Gợi ý 3–5 ý tưởng bài đăng gần đây để tăng tương tác và độ nhận diện (kèm tiêu đề & chủ đề).
            - Viết một câu định vị bản thân (Personal Branding Statement) có thể dùng ở mọi nơi. Phong cách: Nam châm thu hút Headhunter — tự tin, cụ thể, ưu tiên kết quả.
            
            Trả lời bằng định dạng Markdown rõ ràng.
          `;
          break;
        case "cover_letter":
          prompt = `
            Link tuyển dụng hoặc nội dung JD: ${additionalInput}
            
            Sử dụng CV sau để viết Cover Letter:
            ${cvDataString}
            
            Yêu cầu viết một Cover Letter súc tích, tác động mạnh (tối đa 300–400 chữ):
            - Mở đầu: Phải có điểm chạm cá nhân hóa với công ty hoặc tin tuyển dụng đó.
            - Thân bài: 2–3 đoạn chứng minh "tôi đã làm được việc này rồi" thông qua các con số thực tế.
            - Tại sao là công ty này? (Khát khao phù hợp văn hóa).
            - Kết bài: Lời chào mạnh mẽ và đề nghị một buổi phỏng vấn.
            - Tone giọng: Chuyên nghiệp nhưng ấm áp, tự tin, tuyệt đối không có cảm giác "đang cần việc gấp".
            
            Trả lời bằng định dạng Markdown rõ ràng.
          `;
          break;
        case "interview":
          prompt = `
            Vị trí mục tiêu / JD: ${additionalInput}
            
            Dựa trên CV sau và JD trên:
            ${cvDataString}
            
            Yêu cầu:
            - Liệt kê 12 câu hỏi tình huống và kỹ thuật có khả năng cao sẽ bị hỏi (theo mô hình STAR + đặc thù ngành).
            - Với mỗi câu: Viết câu trả lời mẫu theo khung STAR (Situation - Task - Action - Result) dựa trên kinh nghiệm thật của ứng viên trong CV.
            - Thêm một "câu nói quyền năng" hoặc một chỉ số (metric) giúp câu trả lời trở nên khó quên.
            - Gợi ý một câu hỏi ngược lại cho nhà tuyển dụng.
            - Chỉ ra những "điểm yếu" trong hồ sơ mà người phỏng vấn có thể xoáy vào và cách xử lý khôn ngoan.
            
            Trả lời bằng định dạng Markdown rõ ràng.
          `;
          break;
        case "tracking":
          prompt = `
            Hãy đóng vai người điều phối hành trình tìm việc cá nhân (Job-hunt Coordinator).
            
            Yêu cầu:
            - Tạo một bảng theo dõi (Tracking Table) đơn giản (định dạng Markdown table) để copy vào Notion hoặc Google Sheets gồm các cột: Công ty | Vị trí | Link | Ngày ứng tuyển | Trạng thái | Hành động tiếp theo | Ghi chú.
            - Trả cho tôi:
              + 10 cú pháp tìm kiếm việc làm chất lượng cao trên LinkedIn/Google.
              + 1 mẫu tin nhắn (DM) gửi trực tiếp cho Nhà tuyển dụng.
              + 1 mẫu tin nhắn Follow-up sau 7–10 ngày ứng tuyển.
              + 1 câu mô tả lộ trình hằng ngày để có 5–10 lượt ứng tuyển chất lượng mà không tốn quá nhiều thời gian.
            
            Trả lời bằng định dạng Markdown rõ ràng.
          `;
          break;
        default:
          prompt = "Invalid mode selected.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional CV reviewer. Be concise, direct, and do not repeat yourself.",
        }
      });

      setReview(response.text || "No feedback received.");
    } catch (err: any) {
      console.error("AI Review Error:", err);
      let errorMessage = "An error occurred while generating the response.";
      if (err.message) {
        errorMessage += ` (${err.message})`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToCV = async () => {
    setIsApplying(true);
    setApplySuccess(false);
    setError(null);

    try {
      const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const apiKey = userApiKey || envKey;

      if (!apiKey) {
        setShowKeyInput(true);
        setIsApplying(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Bạn là một hệ thống tự động cập nhật CV.
        Nhiệm vụ của bạn là lấy "CV hiện tại" và áp dụng các thay đổi được đề xuất trong "Đánh giá/Góp ý từ AI" để tạo ra một bản CV mới.
        
        QUY TẮC QUAN TRỌNG:
        1. KHÔNG ĐƯỢC gom toàn bộ nội dung góp ý vào trường "summary" (Tóm tắt chuyên môn).
        2. Phân tích kỹ góp ý và cập nhật ĐÚNG vị trí:
           - Nếu góp ý sửa kinh nghiệm làm việc -> Cập nhật vào trường "description" của từng mục tương ứng trong mảng "experience".
           - Nếu góp ý thêm/sửa kỹ năng -> Cập nhật vào mảng "skills".
           - Nếu góp ý sửa tóm tắt/mục tiêu -> Cập nhật vào trường "summary".
           - Nếu góp ý sửa thông tin cá nhân -> Cập nhật vào "personalInfo".
        3. Giữ nguyên các thông tin không được nhắc đến trong góp ý.
        4. Trả về kết quả là một đối tượng JSON hoàn chỉnh, tuân thủ đúng cấu trúc của CV hiện tại.
        
        CV hiện tại:
        ${JSON.stringify(cvData)}
        
        Đánh giá/Góp ý từ AI:
        ${review}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a strict data transformation assistant. Your job is to update a JSON CV object based on review notes. You MUST map changes to their correct fields (e.g., job bullet points go into experience.description, skills go into skills array). NEVER dump the entire review text into the summary field. Return ONLY valid JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              personalInfo: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  title: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  github: { type: Type.STRING },
                  website: { type: Type.STRING },
                }
              },
              summary: { type: Type.STRING },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    items: { type: Type.STRING }
                  }
                }
              },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    company: { type: Type.STRING },
                    position: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    current: { type: Type.BOOLEAN },
                    description: { type: Type.STRING }
                  }
                }
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    technologies: { type: Type.STRING },
                    link: { type: Type.STRING },
                    details: { type: Type.STRING }
                  }
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    gpa: { type: Type.STRING }
                  }
                }
              },
              certifications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    date: { type: Type.STRING }
                  }
                }
              },
              languages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    language: { type: Type.STRING },
                    proficiency: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      let updatedCV = {};
      try {
        let jsonStr = response.text || "{}";
        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        jsonStr = jsonStr.trim();
        
        try {
          updatedCV = JSON.parse(jsonStr);
        } catch (e) {
          console.warn("Initial JSON parse failed, attempting to repair...", e);
          const { jsonrepair } = await import('jsonrepair');
          updatedCV = JSON.parse(jsonrepair(jsonStr));
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error("AI returned invalid or incomplete data. Please try again.");
      }
      
      const finalCV = {
        ...cvData,
        ...updatedCV,
        settings: cvData.settings,
        sections: cvData.sections,
        themeColor: cvData.themeColor,
        sectionOrder: cvData.sectionOrder,
      };
      
      setCVData(finalCV);
      setApplySuccess(true);
      toast.success("Đã áp dụng thành công vào CV!", {
        action: {
          label: 'Hoàn tác',
          onClick: () => {
            revertCVData();
            toast.success('Đã hoàn tác áp dụng CV.');
            setApplySuccess(false);
          }
        }
      });
      setTimeout(() => setApplySuccess(false), 3000);
    } catch (err: any) {
      console.error("Apply to CV Error:", err);
      setError("Có lỗi xảy ra khi áp dụng vào CV. Vui lòng thử lại.");
      toast.error("Có lỗi xảy ra khi áp dụng vào CV.");
    } finally {
      setIsApplying(false);
    }
  };

  const selectedModeObj = PROMPT_MODES.find(m => m.id === mode);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full md:w-auto bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200"
          onClick={() => {
            if (!review) {
              // Reset state when opening if no review exists
              setMode("diagnosis");
              setAdditionalInput("");
            }
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Review & Đánh giá
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Trợ lý AI Tuyển dụng
          </DialogTitle>
          <DialogDescription>
            Chọn một trong các công cụ AI dưới đây để tối ưu hóa hành trình tìm việc của bạn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden mt-4 border rounded-md bg-slate-50 p-4 flex flex-col md:flex-row gap-4">
          
          {/* Left Sidebar - Controls */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
            <div className="space-y-2">
              <Label>Công cụ AI</Label>
              <Select value={mode} onValueChange={setMode} disabled={loading}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Chọn công cụ..." />
                </SelectTrigger>
                <SelectContent>
                  {PROMPT_MODES.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-sm">
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">
                {selectedModeObj?.description}
              </p>
            </div>

            {selectedModeObj?.needsInput && (
              <div className="space-y-2 flex-1 flex flex-col">
                <Label>Thông tin bổ sung</Label>
                <Textarea 
                  placeholder={selectedModeObj.inputPlaceholder}
                  value={additionalInput}
                  onChange={(e) => setAdditionalInput(e.target.value)}
                  className="flex-1 min-h-[120px] resize-none bg-white"
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="mt-auto pt-4">
              {!showKeyInput && !error && (
                <Button onClick={() => handleReview()} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {loading ? "Đang xử lý..." : "Thực hiện"}
                </Button>
              )}
            </div>
          </div>

          {/* Right Content - Results */}
          <div className="w-full md:w-2/3 flex-1 overflow-hidden flex flex-col">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p>AI đang phân tích và tạo nội dung...</p>
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
                    Lưu Key & Bắt đầu
                  </Button>

                  <div className="text-xs text-slate-500 space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <Lock className="w-3 h-3" />
                      Bảo mật & Riêng tư
                    </div>
                    <p>
                      API Key của bạn chỉ được lưu trên trình duyệt (LocalStorage) của thiết bị này. 
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
              <div className="h-full flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 bg-white p-4 rounded-md border mb-4">
                  <div className="prose prose-sm max-w-none prose-indigo whitespace-pre-wrap">
                    {review}
                  </div>
                </ScrollArea>
                
                {mode !== "tracking" && mode !== "interview" && (
                  <div className="flex justify-end items-center gap-3">
                    {applySuccess && (
                      <span className="text-sm text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Đã áp dụng thành công!
                      </span>
                    )}
                    <Button 
                      onClick={handleApplyToCV} 
                      disabled={isApplying || applySuccess}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Đang áp dụng...
                        </>
                      ) : applySuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Đã áp dụng
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Áp dụng nhanh vào CV
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 p-6 text-slate-400">
                <Sparkles className="w-12 h-12 opacity-20" />
                <p className="text-center max-w-sm">
                  Chọn một công cụ ở cột bên trái, nhập thông tin bổ sung (nếu cần) và nhấn &quot;Thực hiện&quot; để AI bắt đầu làm việc.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
