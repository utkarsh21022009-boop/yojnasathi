import React, { useState } from 'react';
import { Landmark, Search, Volume2, Globe, BookmarkCheck, SlidersHorizontal, HelpCircle, ShieldCheck } from 'lucide-react';

interface CivicHeaderProps {
  activeTab: 'directory' | 'checker' | 'tracker' | 'help';
  setActiveTab: (tab: 'directory' | 'checker' | 'tracker' | 'help') => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  onSpeakSummary: () => void;
  isSpeaking: boolean;
  savedCount: number;
}

export const CivicHeader: React.FC<CivicHeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  searchQuery,
  setSearchQuery,
  fontSize,
  setFontSize,
  onSpeakSummary,
  isSpeaking,
  savedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#0F2942] text-white shadow-md border-b-4 border-[#B45309] sticky top-0 z-40">
      {/* Topmost Institutional & Accessibility Bar */}
      <div className="bg-[#001428] text-slate-300 text-xs border-b border-slate-700/60 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government / Civic Identity Banner */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="font-medium tracking-wide">
              {language === 'hi' 
                ? 'भारत सरकार नागरिक लोक कल्याण मंच | डिजिटल सेवा' 
                : 'Government of India Public Welfare Navigation | Digital Civic Portal'}
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Verified Scheme Norms
            </span>
          </div>

          {/* Accessibility Controls & Language */}
          <div className="flex items-center gap-3">
            {/* Audio Reader */}
            <button
              onClick={onSpeakSummary}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-colors font-medium ${
                isSpeaking ? 'bg-[#B45309] text-white animate-pulse' : 'hover:bg-slate-800 text-slate-200'
              }`}
              title="Screen Reader & Voice Assistant"
              aria-label="Listen to screen summary"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isSpeaking ? (language === 'hi' ? 'बोल रहा है...' : 'Speaking...') : (language === 'hi' ? 'सुनें' : 'Listen')}</span>
            </button>

            {/* Font Size Adjusters */}
            <div className="flex items-center border border-slate-700 rounded overflow-hidden text-[11px]">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 ${fontSize === 'normal' ? 'bg-[#B45309] text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                title="Default Font"
                aria-label="Standard Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 border-l border-slate-700 ${fontSize === 'large' ? 'bg-[#B45309] text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                title="Larger Font"
                aria-label="Larger Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 border-l border-slate-700 ${fontSize === 'xlarge' ? 'bg-[#B45309] text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                title="Extra Large Font"
                aria-label="Extra Large Font Size"
              >
                A++
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs border border-slate-700"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'en' ? 'हिंदी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Civic Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded bg-gradient-to-br from-[#0F2942] to-[#001428] border border-[#B45309] flex items-center justify-center shadow-inner">
            <Landmark className="w-6 h-6 text-[#FD8A42]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>{language === 'hi' ? 'योजनासाथी' : 'YojanaSaathi'}</span>
                <span className="text-xs uppercase bg-[#B45309] text-white px-2 py-0.5 rounded font-mono font-medium tracking-normal">
                  Civic Portal
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {language === 'hi' 
                ? 'अखिल भारतीय कल्याणकारी योजनाएं एवं नागरिक पात्रता इंजन'
                : 'National Public Welfare & Citizen Scheme Navigation Platform'}
            </p>
          </div>
        </div>

        {/* Global Quick Search Bar */}
        <div className="w-full md:w-80 lg:w-96">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'योजना, मंत्रालय, या लाभ खोजें...' : 'Search scheme, ministry, or benefit...'}
              className="w-full h-10 pl-9 pr-4 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#0D1C2F] placeholder-slate-300 focus:placeholder-slate-400 rounded text-sm transition-all border border-slate-600 focus:border-[#B45309]"
              aria-label="Search schemes"
            />
            <Search className="w-4 h-4 text-slate-300 absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-[#00170E] border-t border-slate-700/80 px-4 overflow-x-auto" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex space-x-1 sm:space-x-2 py-1.5">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-2 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-[#0F2942] text-white border-b-2 border-[#B45309] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Landmark className="w-4 h-4 text-[#FD8A42]" />
              <span>{language === 'hi' ? 'योजना निर्देशिका' : 'Schemes Directory'}</span>
            </button>

            <button
              onClick={() => setActiveTab('checker')}
              className={`px-3.5 py-2 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'checker'
                  ? 'bg-[#0F2942] text-white border-b-2 border-[#B45309] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'पात्रता जांच' : 'Check Eligibility'}</span>
              <span className="px-1.5 py-0.2 rounded bg-[#047857] text-white text-[10px] font-bold">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3.5 py-2 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'tracker'
                  ? 'bg-[#0F2942] text-white border-b-2 border-[#B45309] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? 'मेरा कार्यालय' : 'My Applications'}</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#B45309] text-white text-[10px] font-bold tabular-nums">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`px-3.5 py-2 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'help'
                  ? 'bg-[#0F2942] text-white border-b-2 border-[#B45309] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>{language === 'hi' ? 'सहायता एवं CSC केंद्र' : 'Help & CSC Centers'}</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center text-xs text-slate-300 font-mono">
            <span>Toll-Free: </span>
            <span className="text-amber-400 font-bold ml-1">1800-11-2026</span>
          </div>
        </div>
      </nav>
    </header>
  );
};
