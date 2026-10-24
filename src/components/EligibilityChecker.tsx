import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, UserCheck, ShieldAlert, Sparkles, Filter, 
  RotateCcw, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, 
  Info, IndianRupee, MapPin, Briefcase, Users, FileText
} from 'lucide-react';
import { CitizenProfile, Scheme, SchemeEvaluation } from '../types/scheme';
import { SCHEMES_DATABASE, DEMO_PROFILES, INDIAN_STATES, OCCUPATIONS_LIST } from '../data/schemes';
import { evaluateSchemeEligibility, formatINR, sortEvaluations } from '../utils/eligibilityEngine';
import { RequirementMatrix } from './RequirementMatrix';
import { StatusBadge } from './StatusBadge';

interface EligibilityCheckerProps {
  onOpenSchemeDetails: (scheme: Scheme) => void;
  language: 'en' | 'hi';
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  onOpenSchemeDetails,
  language,
}) => {
  // Default citizen profile: Small marginal rural farmer
  const [profile, setProfile] = useState<CitizenProfile>({
    name: 'Ramesh Patel',
    age: 44,
    gender: 'male',
    socialCategory: 'OBC',
    annualIncome: 140000,
    occupation: 'Farmer',
    landholdingAcres: 1.8,
    state: 'Uttar Pradesh',
    residenceArea: 'rural',
    rationCardType: 'BPL',
    isPersonWithDisability: false,
  });

  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('pm-kisan');
  const [filterVerdict, setFilterVerdict] = useState<'ALL' | 'ELIGIBLE' | 'ACTION_REQUIRED' | 'INELIGIBLE'>('ALL');

  // Compute live evaluations whenever profile changes
  const evaluations: SchemeEvaluation[] = useMemo(() => {
    const raw = SCHEMES_DATABASE.map(scheme => evaluateSchemeEligibility(scheme, profile));
    return sortEvaluations(raw);
  }, [profile]);

  const filteredEvaluations = useMemo(() => {
    if (filterVerdict === 'ALL') return evaluations;
    return evaluations.filter(e => e.verdict === filterVerdict);
  }, [evaluations, filterVerdict]);

  const stats = useMemo(() => {
    const eligible = evaluations.filter(e => e.verdict === 'ELIGIBLE').length;
    const actionRequired = evaluations.filter(e => e.verdict === 'ACTION_REQUIRED').length;
    const ineligible = evaluations.filter(e => e.verdict === 'INELIGIBLE').length;
    return { eligible, actionRequired, ineligible, total: evaluations.length };
  }, [evaluations]);

  const handleSelectPreset = (presetId: string) => {
    const found = DEMO_PROFILES.find(p => p.id === presetId);
    if (found) {
      setProfile(found.profile);
      setExpandedSchemeId(null);
    }
  };

  const handleReset = () => {
    setProfile({
      name: '',
      age: 30,
      gender: 'male',
      socialCategory: 'GENERAL',
      annualIncome: 200000,
      occupation: 'Self Employed',
      landholdingAcres: 0,
      state: 'Uttar Pradesh',
      residenceArea: 'rural',
      rationCardType: 'APL',
      isPersonWithDisability: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro & Preset Switcher Banner */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-[#EFF6FF] text-[#0F2942] border border-[#BFDBFE]">
                <SlidersHorizontal className="w-5 h-5 text-[#0F2942]" />
              </span>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {language === 'hi' ? 'नागरिक पात्रता मूल्यांकन इंजन' : 'Citizen Welfare Eligibility Simulator'}
              </h2>
            </div>
            <p className="text-sm text-[#475569] mt-1">
              {language === 'hi' 
                ? 'अपनी पारिवारिक, आय, और सामाजिक जानकारी दर्ज करें। इंजन वास्तविक समय में प्रत्येक योजना के नियमों के अनुसार पात्रता की गणना करता है।'
                : 'Enter your demographic and economic profile. The engine instantaneously checks official government gazette criteria across 12+ statutory schemes.'}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="self-start lg:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-[#0F2942] border border-[#CBD5E1] hover:bg-[#F1F5F9] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'रीसेट करें' : 'Reset Form'}</span>
          </button>
        </div>

        {/* 1-Click Demo Personas */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-[#0F2942] block mb-2 uppercase tracking-wide">
            {language === 'hi' ? 'त्वरित परीक्षण के लिए नागरिक प्रोफाइल चुनें (Demo Profiles):' : 'Select a Test Citizen Profile (Instant Demo):'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {DEMO_PROFILES.map((demo) => {
              const isSelected = profile.name === demo.profile.name;
              return (
                <button
                  key={demo.id}
                  onClick={() => handleSelectPreset(demo.id)}
                  className={`text-left p-2.5 rounded border text-xs transition-all ${
                    isSelected
                      ? 'bg-[#0F2942] text-white border-[#0F2942] shadow-xs'
                      : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <span className="font-bold block truncate">{demo.profile.name}</span>
                  <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-[#64748B]'}`}>
                    {demo.profile.occupation} • {demo.profile.state}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Form on Left, Live Evaluation Ledger on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <h3 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#B45309]" />
              <span>{language === 'hi' ? 'नागरिक मानदंड इनपुट' : 'Applicant Credentials'}</span>
            </h3>
            <span className="text-[11px] text-[#64748B]">Real-time Calculation</span>
          </div>

          {/* Citizen Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'नागरिक का नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Citizen Name"
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'आयु (वर्ष)' : 'Age (Years)'}
              </label>
              <input
                type="number"
                min="0"
                max="110"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] font-semibold tabular-nums focus:ring-2 focus:ring-[#0F2942]"
              />
            </div>
          </div>

          {/* Gender & Social Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'लिंग' : 'Gender'}
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
              >
                <option value="male">Male (पुरुष)</option>
                <option value="female">Female (महिला)</option>
                <option value="other">Transgender / Other (अन्य)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'सामाजिक वर्ग / जाति' : 'Social Category'}
              </label>
              <select
                value={profile.socialCategory}
                onChange={(e) => setProfile({ ...profile, socialCategory: e.target.value as any })}
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
              >
                <option value="GENERAL">General (सामान्य)</option>
                <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                <option value="SC">SC (अनुसूचित जाति)</option>
                <option value="ST">ST (अनुसूचित जनजाति)</option>
                <option value="EWS">EWS (आर्थिक रूप से कमजोर)</option>
              </select>
            </div>
          </div>

          {/* Annual Income */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#0F172A]">
                {language === 'hi' ? 'वार्षिक पारिवारिक आय' : 'Annual Household Income'}
              </label>
              <span className="text-xs font-bold text-[#0F2942] bg-[#EFF4FF] px-2 py-0.5 rounded border border-[#BFDBFE] tabular-nums">
                {formatINR(profile.annualIncome)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1200000"
              step="10000"
              value={profile.annualIncome}
              onChange={(e) => setProfile({ ...profile, annualIncome: Number(e.target.value) })}
              className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0F2942]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] mt-1 tabular-nums">
              <span>₹0 (BPL)</span>
              <span>₹2.5 Lakh</span>
              <span>₹5 Lakh</span>
              <span>₹12 Lakh+</span>
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              {language === 'hi' ? 'प्राथमिक व्यवसाय' : 'Primary Occupation'}
            </label>
            <select
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
            >
              {OCCUPATIONS_LIST.map(occ => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* Agricultural Landholding */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#0F172A]">
                {language === 'hi' ? 'कृषि भूमि (एकड़ में)' : 'Agricultural Landholding (Acres)'}
              </label>
              <span className="text-xs font-bold text-[#0F2942] bg-[#EFF4FF] px-2 py-0.5 rounded border border-[#BFDBFE] tabular-nums">
                {profile.landholdingAcres} Acres {profile.landholdingAcres === 0 ? '(Landless)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={profile.landholdingAcres}
              onChange={(e) => setProfile({ ...profile, landholdingAcres: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0F2942]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] mt-1">
              <span>0 (Landless)</span>
              <span>2.5 (Marginal)</span>
              <span>5.0 (Small)</span>
              <span>10+ Acres</span>
            </div>
          </div>

          {/* State & Area */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'राज्य / केंद्र शासित प्रदेश' : 'State / UT'}
              </label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-xs sm:text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
              >
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'निवास क्षेत्र' : 'Area'}
              </label>
              <select
                value={profile.residenceArea}
                onChange={(e) => setProfile({ ...profile, residenceArea: e.target.value as any })}
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
              >
                <option value="rural">Rural (ग्रामीण)</option>
                <option value="urban">Urban (शहरी)</option>
              </select>
            </div>
          </div>

          {/* Ration Card & Disability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'राशन कार्ड प्रकार' : 'Ration Card'}
              </label>
              <select
                value={profile.rationCardType}
                onChange={(e) => setProfile({ ...profile, rationCardType: e.target.value as any })}
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
              >
                <option value="AAY">AAY (Antyodaya Anna)</option>
                <option value="BPL">BPL (Priority Household)</option>
                <option value="APL">APL (Above Poverty Line)</option>
                <option value="NONE">No Card (बिना कार्ड)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                {language === 'hi' ? 'दिव्यांगता स्थिति' : 'Divyangjan / Disability'}
              </label>
              <select
                value={profile.isPersonWithDisability ? 'yes' : 'no'}
                onChange={(e) => setProfile({ ...profile, isPersonWithDisability: e.target.value === 'yes' })}
                className="w-full h-10 px-3 rounded border border-[#94A3B8] bg-white text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0F2942]"
              >
                <option value="no">No (सामान्य)</option>
                <option value="yes">Yes (40%+ Disability UDID)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Evaluation Results (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-[#A7F3D0] rounded-lg p-3 text-center bg-gradient-to-b from-[#ECFDF5]/50 to-white shadow-xs">
              <span className="text-[11px] font-semibold text-[#065F46] uppercase block">
                {language === 'hi' ? 'पात्र योजनाएं' : 'Eligible Schemes'}
              </span>
              <span className="text-2xl font-bold text-[#047857] tabular-nums block mt-0.5">
                {stats.eligible}
              </span>
              <span className="text-[10px] text-[#065F46]/80 font-medium">Ready for Enrollment</span>
            </div>

            <div className="bg-white border border-[#FDE68A] rounded-lg p-3 text-center bg-gradient-to-b from-[#FFFBEB]/50 to-white shadow-xs">
              <span className="text-[11px] font-semibold text-[#92400E] uppercase block">
                {language === 'hi' ? 'दस्तावेज़ आवश्यक' : 'Action Needed'}
              </span>
              <span className="text-2xl font-bold text-[#B45309] tabular-nums block mt-0.5">
                {stats.actionRequired}
              </span>
              <span className="text-[10px] text-[#92400E]/80 font-medium">Pending Proofs</span>
            </div>

            <div className="bg-white border border-[#FECDD3] rounded-lg p-3 text-center bg-gradient-to-b from-[#FFF1F2]/50 to-white shadow-xs">
              <span className="text-[11px] font-semibold text-[#9F1239] uppercase block">
                {language === 'hi' ? 'अपात्र' : 'Ineligible'}
              </span>
              <span className="text-2xl font-bold text-[#BE123C] tabular-nums block mt-0.5">
                {stats.ineligible}
              </span>
              <span className="text-[10px] text-[#9F1239]/80 font-medium">Criteria Mismatch</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="bg-white border border-[#CBD5E1] rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-xs">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider hidden sm:inline">
              Filter Verdict:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setFilterVerdict('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  filterVerdict === 'ALL'
                    ? 'bg-[#0F2942] text-white'
                    : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilterVerdict('ELIGIBLE')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  filterVerdict === 'ELIGIBLE'
                    ? 'bg-[#047857] text-white'
                    : 'bg-[#ECFDF5] text-[#065F46] hover:bg-emerald-100'
                }`}
              >
                Eligible ({stats.eligible})
              </button>
              <button
                onClick={() => setFilterVerdict('ACTION_REQUIRED')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  filterVerdict === 'ACTION_REQUIRED'
                    ? 'bg-[#B45309] text-white'
                    : 'bg-[#FFFBEB] text-[#92400E] hover:bg-amber-100'
                }`}
              >
                Action Needed ({stats.actionRequired})
              </button>
              <button
                onClick={() => setFilterVerdict('INELIGIBLE')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  filterVerdict === 'INELIGIBLE'
                    ? 'bg-[#BE123C] text-white'
                    : 'bg-[#FFF1F2] text-[#9F1239] hover:bg-rose-100'
                }`}
              >
                Ineligible ({stats.ineligible})
              </button>
            </div>
          </div>

          {/* Evaluated Scheme List with Expandable Requirement Matrix */}
          <div className="space-y-3">
            {filteredEvaluations.map((evalItem) => {
              const { scheme, verdict, matchScore, matrix, eligibleSummary } = evalItem;
              const isExpanded = expandedSchemeId === scheme.id;

              return (
                <div
                  key={scheme.id}
                  className={`bg-white border rounded-lg overflow-hidden transition-all shadow-xs ${
                    isExpanded ? 'border-[#0F2942] ring-1 ring-[#0F2942]' : 'border-[#CBD5E1] hover:border-slate-400'
                  }`}
                >
                  {/* Scheme Summary Header */}
                  <div
                    onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                    className="p-3.5 sm:p-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedSchemeId(isExpanded ? null : scheme.id);
                      }
                    }}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={verdict} size="sm" />
                        <span className="text-[11px] text-[#64748B] font-semibold">
                          Match: {matchScore}%
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-[#F1F5F9] text-[#334155] rounded border border-[#CBD5E1]">
                          {scheme.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F172A] leading-snug">
                        {language === 'hi' ? scheme.hindiName : scheme.name}
                      </h4>
                      <p className="text-xs text-[#B45309] font-semibold mt-0.5">
                        {scheme.benefitAmountFormatted}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSchemeDetails(scheme);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-[#0F2942] text-white hover:bg-[#1E3A8A]"
                      >
                        {language === 'hi' ? 'पूर्ण विवरण' : 'Full Guide'}
                      </button>
                      <span className="p-1 text-slate-400 hover:text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Custom Scheme Requirement Matrix Section */}
                  {isExpanded && (
                    <div className="p-4 border-t border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                          {language === 'hi' ? 'योजना आवश्यकता मैट्रिक्स (Scheme Requirement Matrix)' : 'Scheme Requirement Matrix Ledger'}
                        </h5>
                        <span className="text-[11px] text-[#475569]">
                          {matrix.length} Parameter Checks
                        </span>
                      </div>

                      {/* Embed the custom Civic Component */}
                      <RequirementMatrix matrix={matrix} language={language} />

                      {/* Action advice */}
                      <div className="p-3 bg-white border border-[#CBD5E1] rounded text-xs text-[#334155] flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#0F172A]">
                            {language === 'hi' ? 'नागरिक सलाह' : 'Official Advisory:'}
                          </p>
                          <p className="text-[#475569] mt-0.5 leading-relaxed">
                            {eligibleSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
