"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { Phone, Mail, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CVPreview() {
  const { cvData } = useCVStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none">
        {/* Toolbar - Hidden when printing */}
        <div className="flex justify-between items-center p-4 border-b print:hidden">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Quay lại chỉnh sửa
          </Button>
          <Button onClick={handlePrint}>
            In CV / Lưu PDF
          </Button>
        </div>

        {/* CV Content */}
        <div className="p-12 md:p-16 space-y-8 text-slate-900 font-sans leading-relaxed print:p-0 print:m-0">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900">
              {cvData.personalInfo.fullName}
            </h1>
            <h2 className="text-xl font-semibold uppercase tracking-wider text-slate-700">
              {cvData.personalInfo.title}
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mt-4">
              {cvData.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{cvData.personalInfo.phone}</span>
                </div>
              )}
              {cvData.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{cvData.personalInfo.email}</span>
                </div>
              )}
              {cvData.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{cvData.personalInfo.location}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              {cvData.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <a href={`https://${cvData.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {cvData.personalInfo.linkedin.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {cvData.personalInfo.github && (
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <a href={`https://${cvData.personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {cvData.personalInfo.github.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {cvData.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a href={`https://${cvData.personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {cvData.personalInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-300" />

          {/* Summary */}
          {cvData.summary && (
            <section>
              <h3 className="text-xl font-bold uppercase mb-4 text-slate-900">Tóm tắt chuyên môn</h3>
              <p className="text-slate-700 whitespace-pre-line text-justify">
                {cvData.summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase mb-4 text-slate-900 border-b border-slate-200 pb-2">Kỹ năng chuyên môn</h3>
              <div className="space-y-3">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2">
                    <span className="font-semibold text-slate-800">{skill.category}:</span>
                    <span className="text-slate-700">{skill.items}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {cvData.experience.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase mb-6 text-slate-900 border-b border-slate-200 pb-2">Kinh nghiệm làm việc</h3>
              <div className="space-y-8">
                {cvData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-slate-900 uppercase">{exp.company}</h4>
                      <span className="text-slate-600 font-medium text-sm whitespace-nowrap">
                        {exp.startDate} – {exp.endDate || "Present"}
                      </span>
                    </div>
                    <div className="text-blue-700 font-semibold italic mb-2">{exp.position}</div>
                    <div className="text-slate-700 pl-4">
                      <ul className="list-disc space-y-1">
                        {exp.description.split('\n').map((line, i) => (
                          line.trim() && <li key={i}>{line.replace(/^- /, '').trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {cvData.projects.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase mb-6 text-slate-900 border-b border-slate-200 pb-2">Dự án tiêu biểu</h3>
              <div className="space-y-6">
                {cvData.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="mb-1">
                      <h4 className="text-lg font-bold text-slate-900">{proj.name}</h4>
                    </div>
                    <div className="text-slate-700 mb-1 italic">{proj.description}</div>
                    <div className="text-sm text-slate-600 mb-2">
                      <span className="font-semibold text-slate-800">Tech Stack:</span> {proj.technologies}
                    </div>
                    <div className="text-slate-700 pl-4">
                      <ul className="list-disc space-y-1">
                        {proj.details.split('\n').map((line, i) => (
                          line.trim() && <li key={i}>{line.replace(/^- /, '').trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <section>
              <h3 className="text-xl font-bold uppercase mb-6 text-slate-900 border-b border-slate-200 pb-2">Học vấn</h3>
              <div className="space-y-4">
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 uppercase">{edu.institution}</h4>
                      <div className="text-slate-700">{edu.degree}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-600 font-medium text-sm">
                        {edu.startDate} – {edu.endDate}
                      </div>
                      {edu.gpa && <div className="text-slate-600 text-sm font-medium">GPA: {edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Languages */}
          {(cvData.certifications.length > 0 || cvData.languages.length > 0) && (
            <section>
              <h3 className="text-xl font-bold uppercase mb-4 text-slate-900 border-b border-slate-200 pb-2">Chứng chỉ & Ngoại ngữ</h3>
              
              {cvData.certifications.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-slate-900 mb-2">Chứng chỉ</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {cvData.certifications.map((cert) => (
                      <li key={cert.id}>
                        <span className="font-medium">{cert.name}</span>
                        {cert.issuer && <span> - {cert.issuer}</span>}
                        {cert.date && <span className="text-slate-500 text-sm"> ({cert.date})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cvData.languages.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Ngoại ngữ</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {cvData.languages.map((lang, index) => (
                      <li key={index}>
                        <span className="font-medium">{lang.language}</span>: {lang.proficiency}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
