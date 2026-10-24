import React, { useState } from 'react';
import { 
  X, CheckSquare, Square, ExternalLink, Phone, ShieldCheck, 
  FileText, Landmark, Clock, CheckCircle2, Bookmark, Printer, Download 
} from 'lucide-react';
import { Scheme, CitizenProfile, SchemeEvaluation } from '../types/scheme';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { RequirementMatrix } from './RequirementMatrix';
import { StatusBadge } from './StatusBadge';

interface SchemeModalProps {
  scheme: Scheme | null;
  citizenProfile?: CitizenProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveApplication?: (scheme: Scheme) => void;
  isSaved?: boolean;
  language?: 'en' | 'hi';
}

export const SchemeModal: React.FC<SchemeModalProps> = ({
  scheme,
  citizenProfile,
  isOpen,
  onClose,
  onSaveApplication,
  isSaved = false,
  language = 'en',
}) => {
  if (!isOpen || !scheme) return null;

  const [activeTab, setActiveTab] = useState<'matrix' | 'documents' | 'steps' | 'faqs'>('matrix');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // Compute evaluation if citizen profile provided, or fallback to default
  const defaultProfile: CitizenProfile = citizenProfile || {
    age: 35,
    gender: 'male',
    socialCategory: 'OBC',
    annualIncome: 140000,
    occupation: 'Farmer',
    landholdingAcres: 1.5,
    state: 'Uttar Pradesh',
    residenceArea: 'rural',
    rationCardType: 'BPL',
    isPersonWithDisability: false,
  };

  const evaluation: SchemeEvaluation = evaluateSchemeEligibility(scheme, defaultProfile);

  const toggleDoc = (docId: string) => {
    setCheckedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F172A]/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-scheme-title"
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-lg border border-[#94A3B8] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-[#0F2942] text-white p-4 sm:p-6 border-b-2 border-[#B45309] flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-[#FD8A42] uppercase tracking-wider">
                {scheme.ministry}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[11px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                Code: {scheme.code}
              </span>
              <StatusBadge status={evaluation.verdict} size="sm" />
            </div>

            <h2 id="modal-scheme-title" className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {language === 'hi' ? scheme.hindiName : scheme.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
              {scheme.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Financial Benefit Banner */}
        <div className="bg-[#EFF4FF] border-b border-[#CBD5E1] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0F2942]">{language === 'hi' ? 'वित्तीय लाभ:' : 'Statutory Benefit:'}</span>
            <span className="font-bold text-sm text-[#B45309] bg-white px-2.5 py-1 rounded border border-[#BFDBFE]">
              {scheme.benefitAmountFormatted}
            </span>
            {scheme.isDbtActive && (
              <span className="bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded font-bold border border-[#A7F3D0]">
                Direct Benefit Transfer (DBT)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[#475569]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0F2942]" />
              {scheme.deadlineNotice}
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="border-b border-[#CBD5E1] bg-[#F8FAFC] px-4 sm:px-6 flex gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-[#0F2942] text-[#0F2942] font-bold bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {language === 'hi' ? 'आवश्यकता मैट्रिक्स (Requirement Matrix)' : '1. Requirement Matrix'}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-[#0F2942] text-[#0F2942] font-bold bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : '2. Required Documents Checklist'}
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-[#0F2942] text-[#0F2942] font-bold bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {language === 'hi' ? 'आवेदन प्रक्रिया (Application Steps)' : '3. How to Apply'}
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'border-[#0F2942] text-[#0F2942] font-bold bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {language === 'hi' ? 'प्रश्नोत्तरी (FAQs)' : '4. FAQs & Guidelines'}
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {language === 'hi' ? 'नागरिक योग्यता तुलना बहीखाता' : 'Applicant Qualification vs Statutory Benchmarks'}
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Evaluation score: <span className="font-bold text-[#0F2942]">{evaluation.matchScore}%</span> based on active demographic profile.
                  </p>
                </div>
              </div>

              {/* Requirement Matrix Component */}
              <RequirementMatrix matrix={evaluation.matrix} language={language} />

              <div className="p-3 bg-[#F1F5F9] rounded border border-[#CBD5E1] text-xs text-[#334155]">
                <span className="font-bold text-[#0F2942] block mb-0.5">Summary Verdict:</span>
                <p>{evaluation.eligibleSummary}</p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {language === 'hi' ? 'अनिवार्य प्रमाण-पत्र एवं दस्तावेज़' : 'Mandatory Verification Documents'}
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Mark the documents you already possess to verify submission readiness.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#EFF4FF] text-[#1E3A8A] rounded border border-[#BFDBFE]">
                  {Object.values(checkedDocs).filter(Boolean).length} / {scheme.documents.length} Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {scheme.documents.map((doc) => {
                  const isChecked = !!checkedDocs[doc.id];
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`p-3.5 rounded border flex items-start gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                          : 'bg-white border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-[#0F2942] focus:outline-none"
                        aria-label={`Toggle document ${doc.name}`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-[#047857]" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isChecked ? 'text-[#065F46]' : 'text-[#0F172A]'}`}>
                            {doc.name}
                          </span>
                          {doc.mandatory && (
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-[#FFF1F2] text-[#BE123C] rounded border border-[#FECDD3]">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A]">
                {language === 'hi' ? 'चरण-दर-चरण आवेदन रोडमैप' : 'Step-by-Step Citizen Enrollment Workflow'}
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#CBD5E1]">
                {scheme.applicationSteps.map((step) => (
                  <div key={step.stepNumber} className="relative">
                    <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#0F2942] text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-white">
                      {step.stepNumber}
                    </div>
                    <div className="bg-[#F8FAFC] p-3.5 rounded border border-[#CBD5E1]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-bold text-[#0F172A]">{step.title}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-white text-[#0F2942] font-semibold border border-[#CBD5E1]">
                          Channel: {step.channel}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#0F172A]">
                {language === 'hi' ? 'महत्वपूर्ण दिशानिर्देश एवं अक्सर पूछे जाने वाले प्रश्न' : 'Official Guidelines & Common Queries'}
              </h4>

              {scheme.faq.map((item, idx) => (
                <div key={idx} className="bg-[#F8FAFC] p-3.5 rounded border border-[#CBD5E1]">
                  <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <span className="text-[#B45309]">Q:</span> {item.question}
                  </p>
                  <p className="text-xs text-[#475569] mt-1.5 pl-4 leading-relaxed border-l-2 border-[#B45309]/40">
                    {item.answer}
                  </p>
                </div>
              ))}

              <div className="mt-4 p-3 bg-[#EFF6FF] rounded border border-[#BFDBFE] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1E3A8A] flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  National Citizen Helpline: {scheme.helpline}
                </span>
                <span className="text-[11px] text-[#475569]">Available Mon-Sat 9AM-6PM</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#F1F5F9] border-t border-[#CBD5E1] p-4 px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onSaveApplication && (
              <button
                type="button"
                onClick={() => onSaveApplication(scheme)}
                className={`px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  isSaved
                    ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                    : 'bg-white text-[#0F2942] border-[#CBD5E1] hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved in Desk' : 'Save to My Applications'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded text-xs font-semibold bg-white text-[#334155] border border-[#CBD5E1] hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-semibold text-[#475569] hover:bg-slate-200 transition-colors"
            >
              Close
            </button>

            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded text-xs font-semibold bg-[#0F2942] text-white hover:bg-[#1E3A8A] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
