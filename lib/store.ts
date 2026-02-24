import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CVData, initialCVData, emptyCVData } from '@/types/cv';

interface CVStore {
  cvData: CVData;
  setCVData: (data: CVData) => void;
  resetCVData: () => void;
  updatePersonalInfo: (info: Partial<CVData['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  addSkill: () => void;
  removeSkill: (index: number) => void;
  updateSkill: (index: number, skill: CVData['skills'][0]) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, exp: CVData['experience'][0]) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, proj: CVData['projects'][0]) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, edu: CVData['education'][0]) => void;
  addCertification: () => void;
  removeCertification: (id: string) => void;
  updateCertification: (id: string, cert: CVData['certifications'][0]) => void;
  addLanguage: () => void;
  removeLanguage: (index: number) => void;
  updateLanguage: (index: number, lang: CVData['languages'][0]) => void;
  updateThemeColor: (color: string) => void;
  updateSettings: (settings: Partial<CVData['settings']>) => void;
  setSectionOrder: (order: string[]) => void;
  toggleSection: (section: keyof CVData['sections']) => void;
  reset: () => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: initialCVData,
      setCVData: (data) => set({ cvData: data }),
      resetCVData: () => set({ cvData: emptyCVData }),
      updateThemeColor: (color) =>
        set((state) => ({ cvData: { ...state.cvData, themeColor: color } })),
      updateSettings: (settings) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            settings: { ...state.cvData.settings, ...settings },
          },
        })),
      setSectionOrder: (order) =>
        set((state) => ({
          cvData: { ...state.cvData, sectionOrder: order },
        })),
      toggleSection: (section) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            sections: {
              ...state.cvData.sections,
              [section]: !state.cvData.sections[section],
            },
          },
        })),
      updatePersonalInfo: (info) =>
        set((state) => ({
          cvData: { ...state.cvData, personalInfo: { ...state.cvData.personalInfo, ...info } },
        })),
      updateSummary: (summary) =>
        set((state) => ({ cvData: { ...state.cvData, summary } })),
      addSkill: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: [...state.cvData.skills, { category: '', items: '' }],
          },
        })),
      removeSkill: (index) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.filter((_, i) => i !== index),
          },
        })),
      updateSkill: (index, skill) =>
        set((state) => {
          const newSkills = [...state.cvData.skills];
          newSkills[index] = skill;
          return { cvData: { ...state.cvData, skills: newSkills } };
        }),
      addExperience: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experience: [
              {
                id: crypto.randomUUID(),
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
              },
              ...state.cvData.experience,
            ],
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experience: state.cvData.experience.filter((e) => e.id !== id),
          },
        })),
      updateExperience: (id, exp) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experience: state.cvData.experience.map((e) => (e.id === id ? exp : e)),
          },
        })),
      addProject: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: [
              {
                id: crypto.randomUUID(),
                name: '',
                description: '',
                technologies: '',
                details: '',
              },
              ...state.cvData.projects,
            ],
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.filter((p) => p.id !== id),
          },
        })),
      updateProject: (id, proj) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.map((p) => (p.id === id ? proj : p)),
          },
        })),
      addEducation: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: [
              {
                id: crypto.randomUUID(),
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
              },
              ...state.cvData.education,
            ],
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.filter((e) => e.id !== id),
          },
        })),
      updateEducation: (id, edu) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.map((e) => (e.id === id ? edu : e)),
          },
        })),
      addCertification: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: [
              {
                id: crypto.randomUUID(),
                name: '',
                issuer: '',
                date: '',
              },
              ...state.cvData.certifications,
            ],
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.filter((c) => c.id !== id),
          },
        })),
      updateCertification: (id, cert) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.map((c) => (c.id === id ? cert : c)),
          },
        })),
      addLanguage: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: [...state.cvData.languages, { language: '', proficiency: '' }],
          },
        })),
      removeLanguage: (index) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.filter((_, i) => i !== index),
          },
        })),
      updateLanguage: (index, lang) =>
        set((state) => {
          const newLangs = [...state.cvData.languages];
          newLangs[index] = lang;
          return { cvData: { ...state.cvData, languages: newLangs } };
        }),
      reset: () => set({ cvData: initialCVData }),
    }),
    {
      name: 'cv-storage',
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version === 0 || version === 1) {
          return {
            ...persistedState,
            cvData: {
              ...initialCVData,
              ...persistedState.cvData,
              settings: {
                ...initialCVData.settings,
                ...(persistedState.cvData?.settings || {}),
                template: persistedState.cvData?.settings?.template || 'standard',
              },
              sectionOrder: persistedState.cvData?.sectionOrder || initialCVData.sectionOrder,
              sections: persistedState.cvData?.sections || initialCVData.sections,
            },
          };
        }
        return persistedState;
      },
    }
  )
);
