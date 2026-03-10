import { describe, it, expect } from 'vitest';
import { cvTranslations } from './lib/translations';

describe('cvTranslations', () => {
  it('should have translations for supported languages', () => {
    const supportedLanguages = ['vi', 'en', 'ja', 'ko', 'zh', 'fr', 'de'];
    
    supportedLanguages.forEach(lang => {
      expect(cvTranslations).toHaveProperty(lang);
    });
  });

  it('should have all required keys in each translation', () => {
    const requiredKeys = [
      'personalInfo', 'summary', 'experience', 'projects', 
      'skills', 'education', 'certifications', 'languages', 
      'present', 'link', 'technologies', 'gpa'
    ];

    Object.values(cvTranslations).forEach(translation => {
      requiredKeys.forEach(key => {
        expect(translation).toHaveProperty(key);
      });
    });
  });
});
