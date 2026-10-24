import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSchemeEligibility, formatINR } from './eligibilityEngine';
import { Scheme, CitizenProfile } from '../types/scheme';

const mockKisanScheme: Scheme = {
  id: 'pm-kisan',
  code: 'PM-KISAN',
  name: 'Pradhan Mantri Kisan Samman Nidhi',
  hindiName: 'प्रधानमंत्री किसान सम्मान निधि',
  ministry: 'Ministry of Agriculture & Farmers Welfare',
  tagline: 'Direct annual income support of ₹6,000 in 3 installments',
  summary: 'Financial assistance for small and marginal landholder farmer families.',
  category: 'Agriculture & Farmers',
  level: 'Central',
  benefitAmountFormatted: '₹6,000 / year (Direct DBT)',
  benefitType: 'Direct Benefit Transfer (DBT)',
  isDbtActive: true,
  applicationMode: 'Online & CSC',
  deadlineNotice: 'Open Year-Round (Next Installment: December)',
  officialUrl: 'https://pmkisan.gov.in',
  helpline: '155261 / 011-24300606',
  criteria: {
    minAge: 18,
    genders: ['male', 'female', 'other'],
    socialCategories: ['ALL'],
    maxLandholdingAcres: 5.0,
    occupations: ['Farmer', 'Cultivator', 'Agricultural Worker'],
    rationCardRequirements: ['ANY'],
    residenceArea: 'rural',
    applicableStates: ['ALL'],
  },
  documents: [],
  applicationSteps: [],
  faq: [],
};

const mockAyushmanScheme: Scheme = {
  id: 'ayushman-bharat',
  code: 'AB-PMJAY',
  name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana',
  hindiName: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
  ministry: 'Ministry of Health and Family Welfare / NHA',
  tagline: '₹5,00,000 free secondary & tertiary cashless hospital care per family per year',
  summary: 'Worlds largest government-funded healthcare assurance scheme.',
  category: 'Healthcare & Wellness',
  level: 'Central',
  benefitAmountFormatted: '₹5,00,000 Cashless Cover',
  benefitType: 'Cashless Health Cover',
  isDbtActive: true,
  applicationMode: 'Online & CSC',
  deadlineNotice: 'Open Continuous Enrollment',
  officialUrl: 'https://pmjay.gov.in',
  helpline: '14555',
  criteria: {
    minAge: 0,
    genders: ['male', 'female', 'other'],
    socialCategories: ['ALL'],
    maxAnnualIncome: 250000,
    occupations: ['Any'],
    rationCardRequirements: ['BPL', 'AAY'],
    residenceArea: 'all',
    applicableStates: ['ALL'],
  },
  documents: [],
  applicationSteps: [],
  faq: [],
};

test('formatINR correctly formats currency', () => {
  const formatted = formatINR(140000);
  assert.match(formatted, /1,40,000/);
});

test('farmer with small landholding is ELIGIBLE for PM-KISAN', () => {
  const farmerCitizen: CitizenProfile = {
    name: 'Ramesh Patel',
    age: 42,
    gender: 'male',
    socialCategory: 'OBC',
    annualIncome: 120000,
    occupation: 'Farmer',
    landholdingAcres: 2.1,
    state: 'Uttar Pradesh',
    residenceArea: 'rural',
    rationCardType: 'BPL',
    isPersonWithDisability: false,
  };

  const result = evaluateSchemeEligibility(mockKisanScheme, farmerCitizen);
  assert.equal(result.verdict, 'ELIGIBLE');
  assert.equal(result.failedCount, 0);
  assert.ok(result.matchScore >= 90);
});

test('urban citizen is INELIGIBLE for rural PM-KISAN scheme', () => {
  const urbanCitizen: CitizenProfile = {
    name: 'Suresh Rao',
    age: 35,
    gender: 'male',
    socialCategory: 'GENERAL',
    annualIncome: 450000,
    occupation: 'Salaried Employee',
    landholdingAcres: 0,
    state: 'Maharashtra',
    residenceArea: 'urban',
    rationCardType: 'APL',
    isPersonWithDisability: false,
  };

  const result = evaluateSchemeEligibility(mockKisanScheme, urbanCitizen);
  assert.equal(result.verdict, 'INELIGIBLE');
  assert.ok(result.failedCount > 0);
  assert.ok(result.matchScore < 60);
});

test('citizen needing BPL documentation gets ACTION_REQUIRED', () => {
  const lowIncomeCitizenWithoutBPL: CitizenProfile = {
    name: 'Anjali Verma',
    age: 29,
    gender: 'female',
    socialCategory: 'SC',
    annualIncome: 180000,
    occupation: 'Daily Wage Worker',
    landholdingAcres: 0,
    state: 'Bihar',
    residenceArea: 'rural',
    rationCardType: 'APL', // Non-BPL
    isPersonWithDisability: false,
  };

  const result = evaluateSchemeEligibility(mockAyushmanScheme, lowIncomeCitizenWithoutBPL);
  assert.equal(result.verdict, 'ACTION_REQUIRED');
  assert.equal(result.failedCount, 0);
  assert.ok(result.warningCount >= 1);
});

test('high income citizen is INELIGIBLE for Ayushman Bharat threshold', () => {
  const affluentCitizen: CitizenProfile = {
    name: 'Vikram Mehta',
    age: 38,
    gender: 'male',
    socialCategory: 'GENERAL',
    annualIncome: 800000,
    occupation: 'Business Owner',
    landholdingAcres: 0,
    state: 'Delhi',
    residenceArea: 'urban',
    rationCardType: 'APL',
    isPersonWithDisability: false,
  };

  const result = evaluateSchemeEligibility(mockAyushmanScheme, affluentCitizen);
  assert.equal(result.verdict, 'INELIGIBLE');
  assert.ok(result.failedCount >= 1);
});
