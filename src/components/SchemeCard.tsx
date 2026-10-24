import React from 'react';
import { ExternalLink, Calendar, ChevronRight, Bookmark, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Scheme, SchemeEvaluation } from '../types/scheme';
import { StatusBadge } from './StatusBadge';

interface SchemeCardProps {
  scheme: Scheme;
  evaluation?: SchemeEvaluation;
  onOpenDetails: (scheme: Scheme) => void;
  onCheckCriteria: (scheme: Scheme) => void;
  isSaved?: boolean;
  onToggleSave?: (scheme: Scheme) => void;
  language?: 'en' | 'hi';
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  evaluation,
  onOpenDetails,
  onCheckCriteria,
  isSaved = false,
  onToggleSave,
  language = 'en',
}) => {
  return (
    <article 
      className="group bg-white rounded-lg border border-[#CBD5E1] hover:border-[#0F2942] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between overflow-hidden"
      style={{ padding: '1.5rem' }} // space-lg internal padding
    >
      <div>
        {/* Top Row: Ministry Attribution & Status Chip */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider block line-clamp-1">
              {language === 'hi' && scheme.ministryHindi ? scheme.ministryHindi : scheme.ministry}
            </span>
            <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 bg-[#EFF6FF] text-[#1E3A8A] rounded border border-[#BFDBFE]">
              {scheme.category}
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {evaluation ? (
              <StatusBadge status={evaluation.verdict} size="sm" />
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]">
                {scheme.level}
              </span>
            )}

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(scheme)}
                className={`p-1.5 rounded transition-colors ${
                  isSaved
                    ? 'text-[#B45309] bg-[#FFFBEB] hover:bg-amber-100'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Scheme for Later'}
                aria-label={isSaved ? `Remove ${scheme.name} from saved` : `Save ${scheme.name}`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Mid-Tier: Bold Scheme Title & Summary */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#0F2942] transition-colors">
            {language === 'hi' ? scheme.hindiName : scheme.name}
          </h3>
          <p className="text-xs text-[#B45309] font-semibold mt-1 flex items-center gap-1">
            <span>{scheme.benefitAmountFormatted}</span>
            {scheme.isDbtActive && (
              <span className="bg-[#ECFDF5] text-[#047857] text-[10px] px-1.5 py-0.2 rounded font-bold border border-[#A7F3D0]">
                DBT Active
              </span>
            )}
          </p>

          <p className="text-sm text-[#475569] mt-2 line-clamp-2 leading-relaxed">
            {scheme.summary}
          </p>
        </div>

        {/* Evaluation Summary Highlight if present */}
        {evaluation && (
          <div className={`mb-4 p-2.5 rounded text-xs border ${
            evaluation.verdict === 'ELIGIBLE' 
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : evaluation.verdict === 'ACTION_REQUIRED'
              ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
              : 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]'
          }`}>
            <div className="flex items-center justify-between font-semibold mb-0.5">
              <span>{language === 'hi' ? 'पात्रता मिलान स्कोर' : 'Eligibility Match Score'}</span>
              <span className="tabular-nums text-sm font-bold">{evaluation.matchScore}%</span>
            </div>
            <p className="text-[11px] leading-tight opacity-90 line-clamp-1">
              {evaluation.eligibleSummary}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Row: Key Deadline Metadata & Direct Action Button */}
      <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#0F2942]" />
          <span className="line-clamp-1">{scheme.deadlineNotice}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCheckCriteria(scheme)}
            className="px-3 py-1.5 text-xs font-semibold rounded text-[#0F2942] border border-[#0F2942] hover:bg-[#F1F5F9] transition-colors focus:ring-2 focus:ring-[#B45309]"
          >
            {language === 'hi' ? 'मानक जांचें' : 'Requirements'}
          </button>

          <button
            type="button"
            onClick={() => onOpenDetails(scheme)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded bg-[#0F2942] text-white hover:bg-[#1E3A8A] transition-colors inline-flex items-center gap-1 shadow-xs focus:ring-2 focus:ring-[#B45309]"
          >
            <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
