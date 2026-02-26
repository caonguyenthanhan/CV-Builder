"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AIReview } from "@/components/ai-review";
import { CVImport } from "@/components/cv-import";
import { ATSChecklist } from "@/components/ats-checklist";
import { DataManager } from "@/components/data-manager";
import { MobilePreview } from "@/components/mobile-preview";
import { AITranslator } from "@/components/ai-translator";
import { SectionSorter } from "@/components/section-sorter";
import { AIWriter } from "@/components/ai-writer";
import { emptyCVData } from "@/types/cv";

export function CVForm() {
  const store = useCVStore();
  const { cvData, resetCVData, updateSettings, toggleSection } = store;
  const [isMounted, setIsMounted] = React.useState(false);
  const [isSorterOpen, setIsSorterOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleClearData = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu CV không? Hành động này không thể hoàn tác.")) {
      resetCVData();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CV Builder</h2>
        <div className="flex gap-2">
          <CVImport />
          <AITranslator />
          <DataManager />
        </div>
      </div>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình Giao diện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Mẫu CV</Label>
              <Select
                value={cvData.settings.template || 'standard'}
                onValueChange={(value) => updateSettings({ template: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mẫu CV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Cơ bản (Standard)</SelectItem>
                  <SelectItem value="modern">Hiện đại (Modern)</SelectItem>
                  <SelectItem value="minimalist">Tối giản (Minimalist)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Màu sắc chủ đạo</Label>
              <div className="flex gap-2 items-center h-10">
                {(['blue', 'emerald', 'neutral'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSettings({ accentColor: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      cvData.settings.accentColor === color ? 'border-black ring-2 ring-offset-2 ring-black scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color === 'blue' ? '#2563eb' : color === 'emerald' ? '#059669' : '#4b5563' }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font chữ</Label>
              <Select
                value={cvData.settings.fontFamily}
                onValueChange={(value) => updateSettings({ fontFamily: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn font chữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Sans-serif (Inter)</SelectItem>
                  <SelectItem value="serif">Serif (Georgia)</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ngôn ngữ CV</Label>
              <Select
                value={cvData.settings.language || 'vi'}
                onValueChange={(value) => updateSettings({ language: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">Tiếng Anh</SelectItem>
                  <SelectItem value="ja">Tiếng Nhật</SelectItem>
                  <SelectItem value="ko">Tiếng Hàn</SelectItem>
                  <SelectItem value="zh">Tiếng Trung</SelectItem>
                  <SelectItem value="fr">Tiếng Pháp</SelectItem>
                  <SelectItem value="de">Tiếng Đức</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mật độ</Label>
              <Select
                value={cvData.settings.density}
                onValueChange={(value) => updateSettings({ density: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mật độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Gọn (Compact)</SelectItem>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="relaxed">Thoáng (Relaxed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Sorter Card */}
      <Card>
        <CardHeader 
          className="flex flex-row items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors rounded-t-lg"
          onClick={() => setIsSorterOpen(!isSorterOpen)}
        >
          <CardTitle>Sắp xếp bố cục</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isSorterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {isSorterOpen && (
          <CardContent className="pt-0">
            <div className="pt-6 border-t">
              <SectionSorter />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thông tin cá nhân & Giao diện</CardTitle>
          <div className="flex gap-2">
            <Button variant="destructive" size="icon" onClick={handleClearData} title="Xóa toàn bộ dữ liệu">
              <Trash2 className="w-4 h-4" />
            </Button>
            <ATSChecklist cvData={cvData} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="themeColor">Màu chủ đạo</Label>
            <div className="flex gap-2">
              <Input
                id="themeColor"
                type="color"
                className="w-12 h-10 p-1 cursor-pointer"
                value={cvData.themeColor || "#2563eb"}
                onChange={(e) => store.updateThemeColor(e.target.value)}
              />
              <Input
                value={cvData.themeColor || "#2563eb"}
                onChange={(e) => store.updateThemeColor(e.target.value)}
                className="w-32"
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={cvData.personalInfo.fullName}
                onChange={(e) => store.updatePersonalInfo({ fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Chức danh</Label>
              <Input
                id="title"
                value={cvData.personalInfo.title}
                onChange={(e) => store.updatePersonalInfo({ title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={cvData.personalInfo.email}
                onChange={(e) => store.updatePersonalInfo({ email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={cvData.personalInfo.phone}
                onChange={(e) => store.updatePersonalInfo({ phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Địa chỉ</Label>
              <Input
                id="location"
                value={cvData.personalInfo.location}
                onChange={(e) => store.updatePersonalInfo({ location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={cvData.personalInfo.linkedin || ""}
                onChange={(e) => store.updatePersonalInfo({ linkedin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={cvData.personalInfo.github || ""}
                onChange={(e) => store.updatePersonalInfo({ github: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={cvData.personalInfo.website || ""}
                onChange={(e) => store.updatePersonalInfo({ website: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Tóm tắt chuyên môn</CardTitle>
            <AIWriter 
              currentText={cvData.summary} 
              onApply={(text) => store.updateSummary(text)} 
              context="Professional Summary" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-summary" className="text-sm font-normal text-slate-500">Hiển thị</Label>
            <Switch 
              id="show-summary"
              checked={cvData.sections.summary}
              onCheckedChange={() => toggleSection('summary')}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            className="h-32"
            value={cvData.summary}
            onChange={(e) => store.updateSummary(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kỹ năng chuyên môn</CardTitle>
          <Button variant="outline" size="sm" onClick={store.addSkill}>
            <Plus className="h-4 w-4 mr-2" /> Thêm kỹ năng
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {cvData.skills.map((skill, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Category (e.g. Languages)"
                  value={skill.category}
                  onChange={(e) => store.updateSkill(index, { ...skill, category: e.target.value })}
                />
                <Input
                  className="md:col-span-2"
                  placeholder="Items (e.g. Java, Python)"
                  value={skill.items}
                  onChange={(e) => store.updateSkill(index, { ...skill, items: e.target.value })}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.removeSkill(index)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kinh nghiệm làm việc</CardTitle>
          <Button variant="outline" size="sm" onClick={store.addExperience}>
            <Plus className="h-4 w-4 mr-2" /> Thêm kinh nghiệm
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="border p-4 rounded-lg space-y-4 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.removeExperience(exp.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="space-y-2">
                  <Label>Công ty</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => store.updateExperience(exp.id, { ...exp, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vị trí</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => store.updateExperience(exp.id, { ...exp, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => store.updateExperience(exp.id, { ...exp, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) => store.updateExperience(exp.id, { ...exp, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Mô tả (Mỗi dòng là một gạch đầu dòng)</Label>
                  <AIWriter 
                    currentText={exp.description} 
                    onApply={(text) => store.updateExperience(exp.id, { ...exp, description: text })} 
                    context="Job Description" 
                  />
                </div>
                <Textarea
                  className="h-32"
                  value={exp.description}
                  onChange={(e) => store.updateExperience(exp.id, { ...exp, description: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dự án tiêu biểu</CardTitle>
          <Button variant="outline" size="sm" onClick={store.addProject}>
            <Plus className="h-4 w-4 mr-2" /> Thêm dự án
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {cvData.projects.map((proj) => (
            <div key={proj.id} className="border p-4 rounded-lg space-y-4 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.removeProject(proj.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="space-y-2">
                  <Label>Tên dự án</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => store.updateProject(proj.id, { ...proj, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Công nghệ sử dụng</Label>
                  <Input
                    value={proj.technologies}
                    onChange={(e) => store.updateProject(proj.id, { ...proj, technologies: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mô tả ngắn</Label>
                <Input
                  value={proj.description}
                  onChange={(e) => store.updateProject(proj.id, { ...proj, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Chi tiết (Mỗi dòng là một gạch đầu dòng)</Label>
                  <AIWriter 
                    currentText={proj.details} 
                    onApply={(text) => store.updateProject(proj.id, { ...proj, details: text })} 
                    context="Project Details" 
                  />
                </div>
                <Textarea
                  className="h-24"
                  value={proj.details}
                  onChange={(e) => store.updateProject(proj.id, { ...proj, details: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Học vấn</CardTitle>
          <Button variant="outline" size="sm" onClick={store.addEducation}>
            <Plus className="h-4 w-4 mr-2" /> Thêm học vấn
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {cvData.education.map((edu) => (
            <div key={edu.id} className="border p-4 rounded-lg space-y-4 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.removeEducation(edu.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="space-y-2">
                  <Label>Trường</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => store.updateEducation(edu.id, { ...edu, institution: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bằng cấp / Ngành học</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => store.updateEducation(edu.id, { ...edu, degree: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Năm bắt đầu</Label>
                  <Input
                    value={edu.startDate}
                    onChange={(e) => store.updateEducation(edu.id, { ...edu, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Năm kết thúc</Label>
                  <Input
                    value={edu.endDate}
                    onChange={(e) => store.updateEducation(edu.id, { ...edu, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GPA (Tùy chọn)</Label>
                  <Input
                    value={edu.gpa || ""}
                    onChange={(e) => store.updateEducation(edu.id, { ...edu, gpa: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chứng chỉ</CardTitle>
          <Button variant="outline" size="sm" onClick={store.addCertification}>
            <Plus className="h-4 w-4 mr-2" /> Thêm chứng chỉ
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {cvData.certifications.map((cert) => (
            <div key={cert.id} className="flex gap-4 items-start relative">
               <Button
                variant="ghost"
                size="icon"
                onClick={() => store.removeCertification(cert.id)}
                className="absolute top-0 right-0 text-red-500 md:static md:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Tên chứng chỉ"
                  value={cert.name}
                  onChange={(e) => store.updateCertification(cert.id, { ...cert, name: e.target.value })}
                />
                <Input
                  placeholder="Tổ chức cấp"
                  value={cert.issuer}
                  onChange={(e) => store.updateCertification(cert.id, { ...cert, issuer: e.target.value })}
                />
                <Input
                  placeholder="Năm cấp"
                  value={cert.date}
                  onChange={(e) => store.updateCertification(cert.id, { ...cert, date: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ngoại ngữ</CardTitle>
          <Button variant="outline" size="sm" onClick={store.addLanguage}>
            <Plus className="h-4 w-4 mr-2" /> Thêm ngoại ngữ
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {cvData.languages.map((lang, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Ngôn ngữ (e.g. Tiếng Anh)"
                  value={lang.language}
                  onChange={(e) => store.updateLanguage(index, { ...lang, language: e.target.value })}
                />
                <Input
                  placeholder="Trình độ (e.g. IELTS 7.0)"
                  value={lang.proficiency}
                  onChange={(e) => store.updateLanguage(index, { ...lang, proficiency: e.target.value })}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.removeLanguage(index)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 pt-8">
        <AIReview cvData={cvData} />
        <Button size="lg" className="w-full md:w-auto" onClick={() => window.location.href = '/preview'}>
          Xem trước & In CV
        </Button>
      </div>
      
      <MobilePreview />
    </div>
  );
}
