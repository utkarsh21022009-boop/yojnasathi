/**
 * YojanaSaathi Civic Platform - Type Definitions
 */

export type SchemeCategory = 
  | 'All'
  | 'Agriculture & Farmers'
  | 'Healthcare & Wellness'
  | 'Housing & Shelter'
  | 'Women & Child Development'
  | 'Education & Youth'
  | 'Small Business & MSME'
  | 'Social Security & Pension';

export type SchemeLevel = 'Central' | 'Centrally Sponsored' | 'State Specific';

export type BenefitType = 
  | 'Direct Benefit Transfer (DBT)'
  | 'Cashless Health Cover'
  | 'Collateral-Free Loan / Subsidy'
  | 'Monthly Pension'
  | 'Education Scholarship'
  | 'Asset / Free Infrastructure';

export type SocialCategory = 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS';

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  genders: ('male' | 'female' | 'other')[];
  socialCategories: ('ALL' | SocialCategory)[];
  maxAnnualIncome?: number; // In INR
  minAnnualIncome?: number;
  maxLandholdingAcres?: number; // In acres
  occupations: string[]; // ['Farmer', 'Artisan', 'Student', 'Unorganized Worker', 'Any', ...]
  rationCardRequirements: ('ANY' | 'BPL' | 'AAY' | 'APL')[];
  residenceArea: 'all' | 'rural' | 'urban';
  disabilityRequired?: boolean;
  applicableStates: string[]; // ['ALL'] or specific states
}

export interface SchemeDocument {
  id: string;
  name: string;
  nameHindi?: string;
  mandatory: boolean;
  description: string;
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  instruction: string;
  channel: 'Online Portal' | 'Common Service Centre (CSC)' | 'Gram Panchayat' | 'Bank Branch';
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  ministry: string;
  ministryHindi?: string;
  tagline: string;
  summary: string;
  category: SchemeCategory;
  level: SchemeLevel;
  benefitAmountFormatted: string;
  benefitType: BenefitType;
  isDbtActive: boolean;
  applicationMode: 'Online & CSC' | 'Online Only' | 'Offline / Branch';
  deadlineNotice: string;
  officialUrl: string;
  helpline: string;
  criteria: EligibilityCriteria;
  documents: SchemeDocument[];
  applicationSteps: ApplicationStep[];
  faq: { question: string; answer: string }[];
}

export interface CitizenProfile {
  name?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  socialCategory: SocialCategory;
  annualIncome: number;
  occupation: string;
  landholdingAcres: number;
  state: string;
  residenceArea: 'rural' | 'urban';
  rationCardType: 'AAY' | 'BPL' | 'APL' | 'NONE';
  isPersonWithDisability: boolean;
}

export type VerdictStatus = 'ELIGIBLE' | 'ACTION_REQUIRED' | 'INELIGIBLE';

export interface RequirementMatrixRow {
  parameter: string;
  parameterHindi?: string;
  userValue: string;
  schemeRequirement: string;
  status: 'pass' | 'fail' | 'warn' | 'info';
  note: string;
}

export interface SchemeEvaluation {
  scheme: Scheme;
  verdict: VerdictStatus;
  matchScore: number; // 0 to 100
  failedCount: number;
  warningCount: number;
  matrix: RequirementMatrixRow[];
  eligibleSummary: string;
}

export interface TrackedApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  appliedDate: string;
  applicationNumber: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_VERIFICATION' | 'APPROVED' | 'DISBURSED';
  stageDescription: string;
  updatedAt: string;
  notes: string;
}
