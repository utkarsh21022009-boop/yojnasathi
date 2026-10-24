import React from 'react';
import { Check, X, AlertTriangle, HelpCircle } from 'lucide-react';
import { RequirementMatrixRow } from '../types/scheme';

interface RequirementMatrixProps {
  matrix: RequirementMatrixRow[];
  compact?: boolean;
  language?: 'en' | 'hi';
}

export const RequirementMatrix: React.FC<RequirementMatrixProps> = ({
  matrix,
  compact = false,
  language = 'en',
}) => {
  return (
    <div className="w-full overflow-hidden border border-[#CBD5E1] rounded-lg bg-white shadow-xs">
      {/* Ledger Header */}
      <div className="bg-[#EFF4FF] border-b border-[#CBD5E1] px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-[#0F2942] uppercase tracking-wider">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <span>{language === 'hi' ? 'पात्रता मानक एवं नागरिक विवरण' : 'Civic Criterion & Profile Data'}</span>
          <span className="hidden md:inline">{language === 'hi' ? 'योजना नियम / शर्त' : 'Official Scheme Benchmark'}</span>
        </div>
        <span className="w-24 text-right">{language === 'hi' ? 'जांच स्थिति' : 'Compliance'}</span>
      </div>

      {/* Ledger Rows */}
      <div className="divide-y divide-[#E2E8F0] font-sans">
        {matrix.map((row, idx) => {
          const isStripe = idx % 2 === 1;
          const bgClass = isStripe ? 'bg-[#F8FAFC]' : 'bg-white';

          return (
            <div
              key={`${row.parameter}-${idx}`}
              className={`px-4 ${compact ? 'py-2.5' : 'py-3.5'} flex items-start justify-between gap-4 transition-colors hover:bg-[#F1F5F9] ${bgClass}`}
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {language === 'hi' && row.parameterHindi ? row.parameterHindi : row.parameter}
                    </span>
                  </div>
                  <div className="text-xs text-[#334155] mt-0.5 font-medium flex items-center gap-1">
                    <span className="text-[#64748B]">{language === 'hi' ? 'नागरिक मान:' : 'Citizen Value:'}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#E2E8F0] text-[#0F172A] font-semibold tabular-nums">
                      {row.userValue}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#334155]">
                  <span className="text-[#64748B] md:hidden font-medium mr-1">{language === 'hi' ? 'मानक:' : 'Rule:'}</span>
                  <span className="font-semibold text-[#0F2942]">{row.schemeRequirement}</span>
                  {!compact && row.note && (
                    <p className="text-[11px] text-[#475569] mt-0.5 leading-snug">
                      {row.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Glyph */}
              <div className="w-24 shrink-0 flex items-center justify-end">
                {row.status === 'pass' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'सफल' : 'Pass'}</span>
                  </span>
                )}
                {row.status === 'fail' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'अपात्र' : 'Fail'}</span>
                  </span>
                )}
                {row.status === 'warn' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'संदेह' : 'Action'}</span>
                  </span>
                )}
                {row.status === 'info' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'तथ्य' : 'Info'}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
