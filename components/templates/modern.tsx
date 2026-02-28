"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { Phone, Mail, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { cvTranslations, CVLanguage } from "@/lib/translations";

export function ModernTemplate() {
  const { cvData } = useCVStore();
  const themeColor = cvData.themeColor || "#2563eb";
  const { sectionOrder = [], sections, settings } = cvData;
  const lang = (settings?.language || 'vi') as CVLanguage;
  const t = cvTranslations[lang] || cvTranslations.vi;

  // Helper to check if a section is enabled
  const isEnabled = (section: string) => sections?.[section as keyof typeof sections];

  return (
    <div className="flex min-h-[297mm] bg-white shadow-lg print:shadow-none max-w-[210mm] mx-auto overflow-hidden">
      {/* Sidebar (Left Column) */}
      <div className="w-1/3 text-white p-6 space-y-6" style={{ backgroundColor: themeColor }}>
        {/* Profile Image Placeholder (Optional) */}
        {/* <div className="w-32 h-32 mx-auto bg-white/20 rounded-full mb-6"></div> */}

        {/* Contact Info */}
        <div className="space-y-4 text-sm">
          <h3 className="uppercase font-bold border-b border-white/30 pb-2 mb-3 tracking-wider text-white/90">{t.personalInfo}</h3>
          
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{cvData.personalInfo.phone}</span>
            </div>
          )}
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="break-all">{cvData.personalInfo.email}</span>
            </div>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{cvData.personalInfo.location}</span>
            </div>
          )}
          {cvData.personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 shrink-0" />
              <a href={`https://${cvData.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline break-all">
                LinkedIn
              </a>
            </div>
          )}
          {cvData.personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 shrink-0" />
              <a href={`https://${cvData.personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline break-all">
                GitHub
              </a>
            </div>
          )}
          {cvData.personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 shrink-0" />
              <a href={`https://${cvData.personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline break-all">
                Website
              </a>
            </div>
          )}
        </div>

        {/* Skills (Sidebar) */}
        {isEnabled('skills') && cvData.skills.length > 0 && (
          <div>
            <h3 className="uppercase font-bold border-b border-white/30 pb-2 mb-3 tracking-wider text-white/90">{t.skills}</h3>
            <div className="space-y-3 text-sm">
              {cvData.skills.map((skill, index) => (
                <div key={index}>
                  <div className="font-semibold text-white/90 mb-1">{skill.category}</div>
                  <div className="text-white/80 text-xs leading-relaxed">{skill.items}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages (Sidebar) */}
        {isEnabled('languages') && cvData.languages.length > 0 && (
          <div>
            <h3 className="uppercase font-bold border-b border-white/30 pb-2 mb-3 tracking-wider text-white/90">{t.languages}</h3>
            <ul className="space-y-2 text-sm">
              {cvData.languages.map((lang, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-white/80">{lang.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications (Sidebar) */}
        {isEnabled('certifications') && cvData.certifications.length > 0 && (
          <div>
            <h3 className="uppercase font-bold border-b border-white/30 pb-2 mb-3 tracking-wider text-white/90">{t.certifications}</h3>
            <ul className="space-y-3 text-sm">
              {cvData.certifications.map((cert) => (
                <li key={cert.id}>
                  <div className="font-medium leading-tight">{cert.name}</div>
                  <div className="text-white/70 text-xs mt-0.5">{cert.issuer} • {cert.date}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content (Right Column) */}
      <div className="w-2/3 p-8 text-slate-800">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900 mb-2" style={{ color: themeColor }}>
            {cvData.personalInfo.fullName}
          </h1>
          <h2 className="text-xl font-medium uppercase tracking-widest text-slate-500">
            {cvData.personalInfo.title}
          </h2>
        </div>

        {/* Main Sections */}
        <div className="space-y-8">
          {/* Summary */}
          {isEnabled('summary') && cvData.summary && (
            <section>
              <h3 className="text-lg font-bold uppercase mb-3 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-8 h-1 bg-current rounded-full"></span>
                {t.summary}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">
                {cvData.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {isEnabled('experience') && cvData.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-8 h-1 bg-current rounded-full"></span>
                {t.experience}
              </h3>
              <div className="space-y-6">
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2" style={{ borderColor: themeColor }}></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-base font-bold text-slate-900">{exp.company}</h4>
                      <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.endDate || t.present}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.position}</div>
                    <div className="text-sm text-slate-700">
                      <ul className="list-disc pl-4 space-y-1 marker:text-slate-400">
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
          {isEnabled('projects') && cvData.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-8 h-1 bg-current rounded-full"></span>
                {t.projects}
              </h3>
              <div className="space-y-5">
                {cvData.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-base font-bold text-slate-900">{proj.name}</h4>
                    </div>
                    <div className="text-sm text-slate-600 mb-2 italic">{proj.description}</div>
                    <div className="text-xs text-slate-500 mb-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="font-semibold text-slate-700">{t.technologies}:</span> {proj.technologies}
                    </div>
                    <div className="text-sm text-slate-700">
                      <ul className="list-disc pl-4 space-y-1 marker:text-slate-400">
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
          {isEnabled('education') && cvData.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                <span className="w-8 h-1 bg-current rounded-full"></span>
                {t.education}
              </h3>
              <div className="space-y-4">
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{edu.institution}</h4>
                      <div className="text-sm text-slate-700">{edu.degree}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded inline-block mb-1">
                        {edu.startDate} – {edu.endDate}
                      </div>
                      {edu.gpa && <div className="text-slate-500 text-xs">{t.gpa}: {edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
