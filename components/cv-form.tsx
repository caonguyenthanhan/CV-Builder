"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import { AIReview } from "@/components/ai-review";

export function CVForm() {
  const store = useCVStore();
  const { cvData } = store;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt chuyên môn</CardTitle>
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
                <Label>Mô tả (Mỗi dòng là một gạch đầu dòng)</Label>
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
                <Label>Chi tiết (Mỗi dòng là một gạch đầu dòng)</Label>
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
    </div>
  );
}
