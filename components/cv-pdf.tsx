"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link, PDFDownloadLink } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { cvTranslations, CVLanguage } from '@/lib/translations';

// Register a font that supports Vietnamese characters
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

Font.register({
  family: 'Roboto-Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#111827',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: '#6B7280',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  experienceItem: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontFamily: 'Roboto-Bold',
    fontSize: 11,
  },
  date: {
    color: '#6B7280',
    fontSize: 9,
  },
  position: {
    fontFamily: 'Roboto-Bold',
    fontSize: 10,
    color: '#374151',
    marginBottom: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 5,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletContent: {
    flex: 1,
  },
  skillCategory: {
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
  },
  skillItems: {
    marginBottom: 6,
  },
});

interface CVPDFProps {
  data: CVData;
}

export const CVPDF = ({ data }: CVPDFProps) => {
  const { personalInfo, settings, sections, sectionOrder = [] } = data;
  const lang = (settings?.language || 'vi') as CVLanguage;
  const t = cvTranslations[lang] || cvTranslations.vi;
  
  // Helper to render bullet points
  const renderBulletPoints = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      const cleanLine = line.trim().replace(/^[-•]\s*/, '');
      if (!cleanLine) return null;
      return (
        <View key={index} style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletContent}>{cleanLine}</Text>
        </View>
      );
    });
  };

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'summary':
        if (!sections?.summary || !data.summary) return null;
        return (
          <View style={styles.section} key="summary" wrap={false}>
            <Text style={styles.sectionTitle}>{t.summary}</Text>
            <Text>{data.summary}</Text>
          </View>
        );

      case 'experience':
        if (!sections?.experience || data.experience.length === 0) return null;
        return (
          <View style={styles.section} key="experience">
            <Text style={styles.sectionTitle}>{t.experience}</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.date}>
                    {exp.startDate} - {exp.current ? t.present : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.position}>{exp.position}</Text>
                {renderBulletPoints(exp.description)}
              </View>
            ))}
          </View>
        );

      case 'projects':
        if (!sections?.projects || data.projects.length === 0) return null;
        return (
          <View style={styles.section} key="projects">
            <Text style={styles.sectionTitle}>{t.projects}</Text>
            {data.projects.map((proj) => (
              <View key={proj.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.company}>{proj.name}</Text>
                  {proj.link && (
                    <Link src={proj.link} style={{ color: '#2563EB', fontSize: 9 }}>
                      {t.link}
                    </Link>
                  )}
                </View>
                <Text style={styles.position}>{proj.description}</Text>
                <Text style={{ fontSize: 9, color: '#4B5563', marginBottom: 2 }}>
                  {t.technologies}: {proj.technologies}
                </Text>
                {renderBulletPoints(proj.details)}
              </View>
            ))}
          </View>
        );

      case 'skills':
        if (!sections?.skills || data.skills.length === 0) return null;
        return (
          <View style={styles.section} key="skills" wrap={false}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            {data.skills.map((skill, index) => (
              <View key={index} style={{ marginBottom: 4 }}>
                <Text style={styles.skillCategory}>{skill.category}: <Text style={{ fontFamily: 'Roboto', fontWeight: 'normal' }}>{skill.items}</Text></Text>
              </View>
            ))}
          </View>
        );

      case 'education':
        if (!sections?.education || data.education.length === 0) return null;
        return (
          <View style={styles.section} key="education">
            <Text style={styles.sectionTitle}>{t.education}</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.company}>{edu.institution}</Text>
                  <Text style={styles.date}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.position}>{edu.degree}</Text>
                {edu.gpa && <Text style={{ fontSize: 9 }}>{t.gpa}: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        );

      case 'certifications':
        if (!sections?.certifications || data.certifications.length === 0) return null;
        return (
          <View style={styles.section} key="certifications">
            <Text style={styles.sectionTitle}>{t.certifications}</Text>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.company}>{cert.name}</Text>
                  <Text style={styles.date}>{cert.date}</Text>
                </View>
                <Text style={{ fontSize: 9 }}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        );

      case 'languages':
        if (!sections?.languages || data.languages.length === 0) return null;
        return (
          <View style={styles.section} key="languages" wrap={false}>
            <Text style={styles.sectionTitle}>{t.languages}</Text>
            {data.languages.map((lang, index) => (
              <View key={index} style={styles.row}>
                <Text style={{ fontSize: 10 }}>{lang.language}</Text>
                <Text style={{ fontSize: 10, color: '#4B5563' }}>{lang.proficiency}</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <Text style={styles.title}>{personalInfo.title}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>• {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>• {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>• {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text>• {personalInfo.github}</Text>}
            {personalInfo.website && <Text>• {personalInfo.website}</Text>}
          </View>
        </View>

        {/* Sections based on order */}
        {sectionOrder.map((sectionName) => renderSection(sectionName))}
      </Page>
    </Document>
  );
};

export const PDFDownloadButtonContent = ({ data }: { data: CVData }) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const safeName = data.personalInfo.fullName.replace(/\s+/g, '_') || 'CV';
  const safePosition = data.personalInfo.title.replace(/\s+/g, '_') || 'Position';
  const fileName = `${safeName}_${safePosition}_${timestamp}.pdf`;

  const handleDownload = () => {
    const history = JSON.parse(localStorage.getItem("cv_download_history") || "[]");
    history.push({
      id: crypto.randomUUID(),
      fileName: fileName,
      timestamp: new Date().toISOString(),
      fullName: data.personalInfo.fullName,
      position: data.personalInfo.title,
    });
    localStorage.setItem("cv_download_history", JSON.stringify(history.slice(-50)));
  };

  return (
    <div onClick={handleDownload}>
      <PDFDownloadLink document={<CVPDF data={data} />} fileName={fileName}>
          {({ blob, url, loading, error }) => (
            <Button disabled={loading} variant="outline" size="sm">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Generating...' : 'Download PDF'}
            </Button>
          )}
      </PDFDownloadLink>
    </div>
  );
};
