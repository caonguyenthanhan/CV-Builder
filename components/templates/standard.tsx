"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { Phone, Mail, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { cvTranslations, CVLanguage } from "@/lib/translations";

export function StandardTemplate() {
  const { cvData } = useCVStore();
  const themeColor = cvData.themeColor || "#2563eb";
  const { sectionOrder, sections, settings } = cvData;
  const lang = (settings.language || 'vi') as CVLanguage;
  const t = cvTranslations[lang] || cvTranslations.vi;

  const renderSection = (section: string) => {
    if (!sections[section as keyof typeof sections]) return null;

    switch (section) {
      case 'summary':
        return cvData.summary && (
          <section key="summary" className="mb-6">
            <h3 className="text-lg font-bold uppercase mb-2 border-b pb-1" style={{ color: themeColor, borderColor: themeColor }}>{t.summary}</h3>
            <p className="text-sm text-slate-700 whitespace-pre-line text-justify leading-relaxed">
              {cvData.summary}
            </p>
          </section>
        );
      case 'skills':
        return cvData.skills.length > 0 && (
          <section key="skills" className="mb-6">
            <h3 className="text-lg font-bold uppercase mb-3 border-b pb-1" style={{ color: themeColor, borderColor: themeColor }}>{t.skills}</h3>
            <div className="space-y-2 text-sm">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="grid grid-cols-[140px_1fr] gap-2">
                  <span className="font-semibold text-slate-800">{skill.category}:</span>
                  <span className="text-slate-700">{skill.items}</span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'experience':
        return cvData.experience.length > 0 && (
          <section key="experience" className="mb-6">
            <h3 className="text-lg font-bold uppercase mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor }}>{t.experience}</h3>
            <div className="space-y-6">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-base font-bold uppercase" style={{ color: themeColor }}>{exp.company}</h4>
                    <span className="text-slate-600 font-medium text-xs whitespace-nowrap">
                      {exp.startDate} – {exp.endDate || t.present}
                    </span>
                  </div>
                  <div className="font-semibold italic text-sm mb-1" style={{ color: themeColor, opacity: 0.9 }}>{exp.position}</div>
                  <div className="text-sm text-slate-700 pl-4">
                    <ul className="list-disc space-y-1 marker:text-slate-400">
                      {exp.description.split('\n').map((line, i) => (
                        line.trim() && <li key={i}>{line.replace(/^- /, '').trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'projects':
        return cvData.projects.length > 0 && (
          <section key="projects" className="mb-6">
            <h3 className="text-lg font-bold uppercase mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor }}>{t.projects}</h3>
            <div className="space-y-4">
              {cvData.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="mb-1">
                    <h4 className="text-base font-bold" style={{ color: themeColor }}>{proj.name}</h4>
                  </div>
                  <div className="text-sm text-slate-700 mb-1 italic">{proj.description}</div>
                  <div className="text-xs text-slate-600 mb-1">
                    <span className="font-semibold text-slate-800">{t.technologies}:</span> {proj.technologies}
                  </div>
                  <div className="text-sm text-slate-700 pl-4">
                    <ul className="list-disc space-y-1 marker:text-slate-400">
                      {proj.details.split('\n').map((line, i) => (
                        line.trim() && <li key={i}>{line.replace(/^- /, '').trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return cvData.education.length > 0 && (
          <section key="education" className="mb-6">
            <h3 className="text-lg font-bold uppercase mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor }}>{t.education}</h3>
            <div className="space-y-3">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start break-inside-avoid">
                  <div>
                    <h4 className="text-base font-bold uppercase" style={{ color: themeColor }}>{edu.institution}</h4>
                    <div className="text-sm text-slate-700">{edu.degree}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-600 font-medium text-xs">
                      {edu.startDate} – {edu.endDate}
                    </div>
                    {edu.gpa && <div className="text-slate-600 text-xs font-medium">{t.gpa}: {edu.gpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'certifications':
        return cvData.certifications.length > 0 && (
          <section key="certifications" className="mb-6 break-inside-avoid">
            <h3 className="text-lg font-bold uppercase mb-3 border-b pb-1" style={{ color: themeColor, borderColor: themeColor }}>{t.certifications}</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 marker:text-slate-400">
              {cvData.certifications.map((cert) => (
                <li key={cert.id}>
                  <span className="font-medium">{cert.name}</span>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.date && <span className="text-slate-500 text-xs"> ({cert.date})</span>}
                </li>
              ))}
            </ul>
          </section>
        );
      case 'languages':
        return cvData.languages.length > 0 && (
          <section key="languages" className="mb-6 break-inside-avoid">
            <h3 className="text-lg font-bold uppercase mb-3 border-b pb-1" style={{ color: themeColor, borderColor: themeColor }}>{t.languages}</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 marker:text-slate-400">
              {cvData.languages.map((lang, index) => (
                <li key={index}>
                  <span className="font-medium">{lang.language}</span>: {lang.proficiency}
                </li>
              ))}
            </ul>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-12 print:p-8 space-y-6 text-slate-900 font-sans leading-relaxed bg-white shadow-lg print:shadow-none max-w-[210mm] mx-auto min-h-[297mm]">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wide" style={{ color: themeColor }}>
          {cvData.personalInfo.fullName}
        </h1>
        <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-700">
          {cvData.personalInfo.title}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{cvData.personalInfo.phone}</span>
            </div>
          )}
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{cvData.personalInfo.email}</span>
            </div>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{cvData.personalInfo.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-slate-600">
          {cvData.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <a href={`https://${cvData.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                {cvData.personalInfo.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {cvData.personalInfo.github && (
            <div className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <a href={`https://${cvData.personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                {cvData.personalInfo.github.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {cvData.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <a href={`https://${cvData.personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                {cvData.personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-300 my-4" style={{ borderColor: themeColor, opacity: 0.3 }} />

      {/* Dynamic Sections */}
      {sectionOrder.map(section => renderSection(section))}
    </div>
  );
}
