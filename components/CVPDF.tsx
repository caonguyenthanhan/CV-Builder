import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '@/types';

// Register fonts to support Vietnamese characters
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfChc9AMP6lbBP.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#4a4a4a',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#4a4a4a',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 12,
  },
  contactItem: {
    marginRight: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 4,
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  experiencePosition: {
    fontSize: 11,
    fontWeight: 700,
  },
  experienceDate: {
    fontSize: 10,
    color: '#4a4a4a',
  },
  experienceCompany: {
    fontSize: 10,
    fontWeight: 700,
    color: '#4a4a4a',
    marginBottom: 4,
  },
  educationItem: {
    marginBottom: 8,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  educationSchool: {
    fontSize: 11,
    fontWeight: 700,
  },
  educationDate: {
    fontSize: 10,
    color: '#4a4a4a',
  },
  educationDegree: {
    fontSize: 10,
    color: '#4a4a4a',
  },
});

export default function CVPDF({ data }: { data: CVData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <Text style={styles.name}>{data.fullName || 'Full Name'}</Text>
          <Text style={styles.position}>{data.position || 'Position'}</Text>
          <View style={styles.contactInfo}>
            {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
            {data.phone && <Text style={styles.contactItem}>• {data.phone}</Text>}
            {data.address && <Text style={styles.contactItem}>• {data.address}</Text>}
          </View>
        </View>

        {data.summary && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{data.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experiencePosition}>{exp.position}</Text>
                  <Text style={styles.experienceDate}>{exp.startDate} - {exp.endDate}</Text>
                </View>
                <Text style={styles.experienceCompany}>{exp.company}</Text>
                <Text style={styles.text}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem} wrap={false}>
                <View style={styles.educationHeader}>
                  <Text style={styles.educationSchool}>{edu.school}</Text>
                  <Text style={styles.educationDate}>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <Text style={styles.educationDegree}>{edu.degree}</Text>
              </View>
            ))}
          </View>
        )}

        {data.skills && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.text}>{data.skills}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
