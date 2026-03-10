import { describe, it, expect, beforeEach } from 'vitest';
import { useCVStore } from './lib/store';
import { emptyCVData, initialCVData } from './types/cv';

describe('useCVStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCVStore.getState().reset();
  });

  it('should initialize with initialCVData', () => {
    const state = useCVStore.getState();
    expect(state.cvData.personalInfo.fullName).toBe(initialCVData.personalInfo.fullName);
  });

  it('should update personal info', () => {
    const store = useCVStore.getState();
    store.updatePersonalInfo({ fullName: 'John Doe', title: 'Software Engineer' });
    
    const updatedState = useCVStore.getState();
    expect(updatedState.cvData.personalInfo.fullName).toBe('John Doe');
    expect(updatedState.cvData.personalInfo.title).toBe('Software Engineer');
  });

  it('should update summary', () => {
    const store = useCVStore.getState();
    store.updateSummary('A highly motivated developer.');
    
    const updatedState = useCVStore.getState();
    expect(updatedState.cvData.summary).toBe('A highly motivated developer.');
  });

  it('should add and remove skills', () => {
    const store = useCVStore.getState();
    const initialSkillsCount = store.cvData.skills.length;
    
    store.addSkill();
    let updatedState = useCVStore.getState();
    expect(updatedState.cvData.skills.length).toBe(initialSkillsCount + 1);
    
    store.removeSkill(0);
    updatedState = useCVStore.getState();
    expect(updatedState.cvData.skills.length).toBe(initialSkillsCount);
  });

  it('should update theme color', () => {
    const store = useCVStore.getState();
    store.updateThemeColor('#ff0000');
    
    const updatedState = useCVStore.getState();
    expect(updatedState.cvData.themeColor).toBe('#ff0000');
  });

  it('should revert CV data', () => {
    const store = useCVStore.getState();
    const originalData = store.cvData;
    
    store.setCVData(emptyCVData);
    let updatedState = useCVStore.getState();
    expect(updatedState.cvData.personalInfo.fullName).toBe('');
    
    updatedState.revertCVData();
    updatedState = useCVStore.getState();
    expect(updatedState.cvData.personalInfo.fullName).toBe(originalData.personalInfo.fullName);
  });
});
