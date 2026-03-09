"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { cvTranslations, CVLanguage } from "@/lib/translations";

export function MinimalistTemplate() {
  const { cvData } = useCVStore();
  const { sectionOrder = [], sections, settings } = cvData;
  const lang = (settings?.language || 'vi') as CVLanguage;
  const t = cvTranslations[lang] || cvTranslations.vi;

  const renderSection = (section: string) => {
    if (!sections?.[section as keyof typeof sections]) return null;

    switch (section) {
      case 'summary':
        return cvData.summary && (
          <section key="summary" className="mb-8 break-inside-avoid">
            <h3 className="break-after-avoid text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-black pb-1">{t.summary}</h3>
            <p className="text-sm text-gray-800 leading-relaxed text-justify">
              {cvData.summary}
            </p>
          </section>
        );
      case 'skills':
        return cvData.skills.length > 0 && (
          <section key="skills" className="mb-8 break-inside-avoid">
            <h3 className="break-after-avoid text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-black pb-1">{t.skills}</h3>
            <div className="grid grid-cols-1 gap-y-2 text-sm">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:gap-4">
                  <span className="font-semibold text-black min-w-[120px]">{skill.category}</span>
                  <span className="text-gray-700">{skill.items}</span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'experience':
        return cvData.experience.length > 0 && (
          <section key="experience" className="mb-8">
            <h3 className="break-after-avoid text-sm font-bold uppercase tracking-widest mb-4 text-black border-b border-black pb-1">{t.experience}</h3>
            <div className="space-y-6">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-base font-bold text-black">{exp.company}</h4>
                    <span className="text-gray-600 text-xs font-mono">
                      {exp.startDate} – {exp.endDate || t.present}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-800 mb-2">{exp.position}</div>
                  <div className="text-sm text-gray-700">
                    <ul className="list-disc pl-4 space-y-1">
                      {exp.description.split('\n').map((line, i) => (
                        line.trim() && <li key={i}>{line.replace(/^[-•*]\s*/, '').trim()}</li>
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
          <section key="projects" className="mb-8">
            <h3 className="break-after-avoid text-sm font-bold uppercase tracking-widest mb-4 text-black border-b border-black pb-1">{t.projects}</h3>
            <div className="space-y-5">
              {cvData.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-base font-bold text-black">{proj.name}</h4>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">{proj.description}</div>
                  <div className="text-xs text-gray-500 mb-2 font-mono">
                    [{proj.technologies}]
                  </div>
                  <div className="text-sm text-gray-700">
                    <ul className="list-disc pl-4 space-y-1">
                      {proj.details.split('\n').map((line, i) => (
                        line.trim() && <li key={i}>{line.replace(/^[-•*]\s*/, '').trim()}</li>
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
          <section key="education" className="mb-8">
            <h3 className="break-after-avoid text-sm font-bold uppercase tracking-widest mb-4 text-black border-b border-black pb-1">{t.education}</h3>
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-black">{edu.institution}</h4>
                    <div className="text-sm text-gray-800">{edu.degree}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600 text-xs font-mono">
                      {edu.startDate} – {edu.endDate}
                    </div>
                    {edu.gpa && <div className="text-gray-600 text-xs mt-1">{t.gpa}: {edu.gpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'certifications':
        return cvData.certifications.length > 0 && (
          <section key="certifications" className="mb-8 break-inside-avoid">
            <h3 className="break-after-avoid text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-black pb-1">{t.certifications}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {cvData.certifications.map((cert) => (
                <li key={cert.id} className="flex justify-between">
                  <span className="font-medium">{cert.name}</span>
                  <span className="text-gray-500 text-xs font-mono">{cert.issuer} • {cert.date}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      case 'languages':
        return cvData.languages.length > 0 && (
          <section key="languages" className="mb-8 break-inside-avoid">
            <h3 className="break-after-avoid text-sm font-bold uppercase tracking-widest mb-3 text-black border-b border-black pb-1">{t.languages}</h3>
            <ul className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              {cvData.languages.map((lang, index) => (
                <li key={index}>
                  <span className="font-semibold text-black">{lang.language}</span>: {lang.proficiency}
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
    <div className="p-8 md:p-16 print:p-12 space-y-8 text-black font-serif leading-relaxed bg-white shadow-lg print:shadow-none max-w-[210mm] mx-auto min-h-[297mm]">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-2 text-black">
          {cvData.personalInfo.fullName}
        </h1>
        <h2 className="text-xl italic text-gray-600 mb-6">
          {cvData.personalInfo.title}
        </h2>
        
        <div className="text-sm text-gray-600 font-sans flex flex-wrap gap-x-6 gap-y-2 border-t border-black pt-4">
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
          {cvData.personalInfo.linkedin && (
            <a href={`https://${cvData.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline text-black">
              LinkedIn
            </a>
          )}
          {cvData.personalInfo.github && (
            <a href={`https://${cvData.personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline text-black">
              GitHub
            </a>
          )}
          {cvData.personalInfo.website && (
            <a href={`https://${cvData.personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline text-black">
              Website
            </a>
          )}
        </div>
      </div>

      {/* Dynamic Sections */}
      {sectionOrder.map(section => renderSection(section))}
    </div>
  );
}
