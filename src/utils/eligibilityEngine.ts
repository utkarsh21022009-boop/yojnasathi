/**
 * YojanaSaathi Civic Platform - Pure Eligibility Evaluation Engine
 * Decoupled from UI components for deterministic, testable civic qualification logic.
 */

import { CitizenProfile, Scheme, SchemeEvaluation, VerdictStatus, RequirementMatrixRow } from '../types/scheme';

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

export function evaluateSchemeEligibility(scheme: Scheme, citizen: CitizenProfile): SchemeEvaluation {
  const matrix: RequirementMatrixRow[] = [];
  let hardFails = 0;
  let softWarnings = 0;
  let passedChecks = 0;
  let totalEvaluated = 0;

  const { criteria } = scheme;

  // 1. Age Evaluation
  if (criteria.minAge !== undefined || criteria.maxAge !== undefined) {
    totalEvaluated++;
    const min = criteria.minAge ?? 0;
    const max = criteria.maxAge ?? 120;
    const passed = citizen.age >= min && citizen.age <= max;

    if (passed) {
      passedChecks++;
      matrix.push({
        parameter: 'Applicant Age',
        parameterHindi: 'आवेदक की आयु',
        userValue: `${citizen.age} Years`,
        schemeRequirement: `${min} - ${max} Years`,
        status: 'pass',
        note: `Citizen age meets requirement (${min} to ${max} yrs).`,
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'Applicant Age',
        parameterHindi: 'आवेदक की आयु',
        userValue: `${citizen.age} Years`,
        schemeRequirement: `${min} - ${max} Years`,
        status: 'fail',
        note: citizen.age < min 
          ? `Age is below minimum requirement of ${min} years.` 
          : `Age exceeds maximum age limit of ${max} years.`,
      });
    }
  }

  // 2. Gender Evaluation
  if (criteria.genders && criteria.genders.length > 0) {
    totalEvaluated++;
    const passed = criteria.genders.includes(citizen.gender);
    const requiredStr = criteria.genders.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' / ');
    const userStr = citizen.gender.charAt(0).toUpperCase() + citizen.gender.slice(1);

    if (passed) {
      passedChecks++;
      matrix.push({
        parameter: 'Gender Criteria',
        parameterHindi: 'लिंग पात्रता',
        userValue: userStr,
        schemeRequirement: requiredStr,
        status: 'pass',
        note: 'Gender matches scheme beneficiary guidelines.',
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'Gender Criteria',
        parameterHindi: 'लिंग पात्रता',
        userValue: userStr,
        schemeRequirement: requiredStr,
        status: 'fail',
        note: `Scheme is exclusively earmarked for ${requiredStr} applicants.`,
      });
    }
  }

  // 3. Social Category Evaluation
  if (criteria.socialCategories && !criteria.socialCategories.includes('ALL')) {
    totalEvaluated++;
    const passed = criteria.socialCategories.includes(citizen.socialCategory);
    const allowed = criteria.socialCategories.join(', ');

    if (passed) {
      passedChecks++;
      matrix.push({
        parameter: 'Social Category / Caste',
        parameterHindi: 'सामाजिक वर्ग / जाति',
        userValue: citizen.socialCategory,
        schemeRequirement: allowed,
        status: 'pass',
        note: `Category ${citizen.socialCategory} is eligible.`,
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'Social Category / Caste',
        parameterHindi: 'सामाजिक वर्ग / जाति',
        userValue: citizen.socialCategory,
        schemeRequirement: allowed,
        status: 'fail',
        note: `Targeted exclusively for ${allowed} categories.`,
      });
    }
  } else {
    // Open to all categories
    matrix.push({
      parameter: 'Social Category / Caste',
      parameterHindi: 'सामाजिक वर्ग / जाति',
      userValue: citizen.socialCategory,
      schemeRequirement: 'All Social Categories (General, OBC, SC, ST, EWS)',
      status: 'pass',
      note: 'Universal coverage across all communities.',
    });
    totalEvaluated++;
    passedChecks++;
  }

  // 4. Annual Household Income
  if (criteria.maxAnnualIncome !== undefined) {
    totalEvaluated++;
    const max = criteria.maxAnnualIncome;
    const passed = citizen.annualIncome <= max;

    if (passed) {
      passedChecks++;
      matrix.push({
        parameter: 'Annual Household Income',
        parameterHindi: 'वार्षिक पारिवारिक आय',
        userValue: formatINR(citizen.annualIncome),
        schemeRequirement: `≤ ${formatINR(max)} / year`,
        status: 'pass',
        note: `Citizen income is within ceiling limit of ${formatINR(max)}.`,
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'Annual Household Income',
        parameterHindi: 'वार्षिक पारिवारिक आय',
        userValue: formatINR(citizen.annualIncome),
        schemeRequirement: `≤ ${formatINR(max)} / year`,
        status: 'fail',
        note: `Income of ${formatINR(citizen.annualIncome)} exceeds threshold of ${formatINR(max)}.`,
      });
    }
  }

  // 5. Landholding (for agricultural schemes)
  if (criteria.maxLandholdingAcres !== undefined) {
    totalEvaluated++;
    const maxAcres = criteria.maxLandholdingAcres;
    const passed = citizen.landholdingAcres <= maxAcres;

    if (passed) {
      passedChecks++;
      matrix.push({
        parameter: 'Agricultural Landholding',
        parameterHindi: 'कृषि भूमि सीमा',
        userValue: `${citizen.landholdingAcres} Acres`,
        schemeRequirement: `≤ ${maxAcres} Acres (Marginal/Small Farmer)`,
        status: 'pass',
        note: `Landholding (${citizen.landholdingAcres} acres) satisfies small/marginal definition.`,
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'Agricultural Landholding',
        parameterHindi: 'कृषि भूमि सीमा',
        userValue: `${citizen.landholdingAcres} Acres`,
        schemeRequirement: `≤ ${maxAcres} Acres`,
        status: 'fail',
        note: `Exceeds max allowed land limit of ${maxAcres} acres.`,
      });
    }
  }

  // 6. Occupation Alignment
  if (criteria.occupations && !criteria.occupations.includes('Any')) {
    totalEvaluated++;
    const matched = criteria.occupations.some(
      occ => occ.toLowerCase() === citizen.occupation.toLowerCase()
    );

    if (matched) {
      passedChecks++;
      matrix.push({
        parameter: 'Primary Occupation',
        parameterHindi: 'मुख्य व्यवसाय',
        userValue: citizen.occupation,
        schemeRequirement: criteria.occupations.join(' / '),
        status: 'pass',
        note: `Citizen occupation matches targeted beneficiary group.`,
      });
    } else {
      // Soft check or hard check depending on whether general or targeted
      hardFails++;
      matrix.push({
        parameter: 'Primary Occupation',
        parameterHindi: 'मुख्य व्यवसाय',
        userValue: citizen.occupation,
        schemeRequirement: criteria.occupations.join(' / '),
        status: 'fail',
        note: `Scheme prioritizes ${criteria.occupations.join(', ')}.`,
      });
    }
  }

  // 7. Ration Card / Poverty Line Category
  if (criteria.rationCardRequirements && !criteria.rationCardRequirements.includes('ANY')) {
    totalEvaluated++;
    const userCard = citizen.rationCardType;
    const requiresBplOrAay = criteria.rationCardRequirements.includes('BPL') || criteria.rationCardRequirements.includes('AAY');

    if (userCard === 'AAY' || (userCard === 'BPL' && criteria.rationCardRequirements.includes('BPL'))) {
      passedChecks++;
      matrix.push({
        parameter: 'Food Security / Ration Card',
        parameterHindi: 'राशन कार्ड श्रेणी',
        userValue: `${userCard} Category`,
        schemeRequirement: criteria.rationCardRequirements.join(' or '),
        status: 'pass',
        note: `Possesses qualifying ${userCard} subsidized ration card.`,
      });
    } else if (userCard === 'APL' || userCard === 'NONE') {
      softWarnings++;
      matrix.push({
        parameter: 'Food Security / Ration Card',
        parameterHindi: 'राशन कार्ड श्रेणी',
        userValue: userCard === 'NONE' ? 'No Card' : 'APL (Above Poverty Line)',
        schemeRequirement: criteria.rationCardRequirements.join(' or '),
        status: 'warn',
        note: `Scheme prioritizes BPL/AAY families. May require income/BPL verification certificate.`,
      });
    }
  }

  // 8. Residence Geography (Rural / Urban)
  if (criteria.residenceArea !== 'all') {
    totalEvaluated++;
    const passed = criteria.residenceArea === citizen.residenceArea;
    if (passed) {
      passedChecks++;
      matrix.push({
        parameter: 'Geographic Area',
        parameterHindi: 'भौगोलिक क्षेत्र',
        userValue: citizen.residenceArea === 'rural' ? 'Rural (ग्रामीण)' : 'Urban (शहरी)',
        schemeRequirement: criteria.residenceArea === 'rural' ? 'Rural Only' : 'Urban Only',
        status: 'pass',
        note: `Location matches administrative jurisdiction.`,
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'Geographic Area',
        parameterHindi: 'भौगोलिक क्षेत्र',
        userValue: citizen.residenceArea === 'rural' ? 'Rural' : 'Urban',
        schemeRequirement: criteria.residenceArea === 'rural' ? 'Rural Only' : 'Urban Only',
        status: 'fail',
        note: `Component restricted to ${criteria.residenceArea} municipalities/panchayats.`,
      });
    }
  }

  // 9. Disability Criteria (Divyangjan)
  if (criteria.disabilityRequired) {
    totalEvaluated++;
    if (citizen.isPersonWithDisability) {
      passedChecks++;
      matrix.push({
        parameter: 'Disability Status (Divyangjan)',
        parameterHindi: 'दिव्यांगता स्थिति',
        userValue: 'Eligible (UDID / Certificate holder)',
        schemeRequirement: 'Min 40% Disability Certificate required',
        status: 'pass',
        note: 'Citizen holds requisite disability qualification.',
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'Disability Status (Divyangjan)',
        parameterHindi: 'दिव्यांगता स्थिति',
        userValue: 'Non-disabled / No certificate',
        schemeRequirement: 'Min 40% Disability Certificate required',
        status: 'fail',
        note: 'Scheme specifically reserved for Persons with Disabilities (Divyangjan).',
      });
    }
  }

  // 10. Applicable State / National Scope
  if (criteria.applicableStates && !criteria.applicableStates.includes('ALL')) {
    totalEvaluated++;
    const passed = criteria.applicableStates.includes(citizen.state);
    if (passed) {
      passedChecks++;
      matrix.push({
        parameter: 'State Domicile',
        parameterHindi: 'राज्य अधिवास',
        userValue: citizen.state,
        schemeRequirement: criteria.applicableStates.join(', '),
        status: 'pass',
        note: `Citizen state of ${citizen.state} is in covered territories.`,
      });
    } else {
      hardFails++;
      matrix.push({
        parameter: 'State Domicile',
        parameterHindi: 'राज्य अधिवास',
        userValue: citizen.state,
        schemeRequirement: criteria.applicableStates.join(', '),
        status: 'fail',
        note: `Limited to citizens residing in ${criteria.applicableStates.join(', ')}.`,
      });
    }
  }

  // Final Verdict Calculation
  let verdict: VerdictStatus = 'ELIGIBLE';
  let matchScore = 0;

  if (hardFails > 0) {
    verdict = 'INELIGIBLE';
    matchScore = Math.max(15, Math.round(((passedChecks) / Math.max(1, totalEvaluated)) * 60));
  } else if (softWarnings > 0) {
    verdict = 'ACTION_REQUIRED';
    matchScore = Math.round(70 + ((passedChecks) / Math.max(1, totalEvaluated)) * 20);
  } else {
    verdict = 'ELIGIBLE';
    matchScore = Math.round(90 + ((passedChecks) / Math.max(1, totalEvaluated)) * 10);
    if (matchScore > 100) matchScore = 100;
  }

  let eligibleSummary = '';
  if (verdict === 'ELIGIBLE') {
    eligibleSummary = `Full compliance verified across all ${passedChecks} statutory criteria. Citizen is eligible for direct enrolment.`;
  } else if (verdict === 'ACTION_REQUIRED') {
    eligibleSummary = `Core demographic criteria satisfied. Action required: obtain or verify additional certifications (${softWarnings} pending item).`;
  } else {
    eligibleSummary = `Application does not fulfill ${hardFails} mandatory criteria for this scheme. Review ledger below for specifics.`;
  }

  return {
    scheme,
    verdict,
    matchScore,
    failedCount: hardFails,
    warningCount: softWarnings,
    matrix,
    eligibleSummary,
  };
}

export function sortEvaluations(evaluations: SchemeEvaluation[]): SchemeEvaluation[] {
  return [...evaluations].sort((a, b) => {
    const priority = { ELIGIBLE: 3, ACTION_REQUIRED: 2, INELIGIBLE: 1 };
    if (priority[a.verdict] !== priority[b.verdict]) {
      return priority[b.verdict] - priority[a.verdict];
    }
    return b.matchScore - a.matchScore;
  });
}
