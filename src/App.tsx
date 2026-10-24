import React, { useState, useMemo, useEffect } from 'react';
import { 
  Landmark, Search, SlidersHorizontal, Filter, ShieldCheck, 
  ArrowRight, Sparkles, HelpCircle, CheckCircle2, BookmarkCheck, 
  ExternalLink, Layers, RefreshCw 
} from 'lucide-react';
import { CivicHeader } from './components/CivicHeader';
import { SchemeCard } from './components/SchemeCard';
import { EligibilityChecker } from './components/EligibilityChecker';
import { SchemeModal } from './components/SchemeModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { HelpSupport } from './components/HelpSupport';
import { SCHEMES_DATABASE } from './data/schemes';
import { Scheme, SchemeCategory, SchemeLevel, TrackedApplication, CitizenProfile } from './types/scheme';
import { evaluateSchemeEligibility } from './utils/eligibilityEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'directory' | 'checker' | 'tracker' | 'help'>('directory');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Active scheme for deep-dive modal
  const [activeModalScheme, setActiveModalScheme] = useState<Scheme | null>(null);

  // Default citizen profile for quick evaluation overlay
  const [citizenProfile] = useState<CitizenProfile>({
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

  // Tracked Applications state (pre-seeded with 2 demo records)
  const [trackedApps, setTrackedApps] = useState<TrackedApplication[]>([
    {
      id: 'app-seed-1',
      schemeId: 'pm-kisan',
      schemeName: 'Pradhan Mantri Kisan Samman Nidhi',
      appliedDate: '12 Sep 2026',
      applicationNumber: 'UP/2026/KISAN/98214',
      status: 'UNDER_VERIFICATION',
      stageDescription: 'Aadhaar e-KYC completed. Village Panchayat Landholding verification in progress.',
      updatedAt: '2 days ago',
      notes: 'Submitted Khatauni 1432 at Block Office.',
    },
    {
      id: 'app-seed-2',
      schemeId: 'ab-pmjay',
      schemeName: 'Ayushman Bharat - PM Jan Arogya Yojana',
      appliedDate: '04 Oct 2026',
      applicationNumber: 'AB/NHA/2026/41029',
      status: 'APPROVED',
      stageDescription: 'Family SECC record matched. Ayushman Golden PVC Card issued.',
      updatedAt: 'Yesterday',
      notes: 'Card collected from Community Health Centre (CHC).',
    },
  ]);

  // Support ?autostart=1 or tab parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'checker' || tabParam === 'tracker' || tabParam === 'help' || tabParam === 'directory') {
      setActiveTab(tabParam);
    }
  }, []);

  const CATEGORIES: SchemeCategory[] = [
    'All',
    'Agriculture & Farmers',
    'Healthcare & Wellness',
    'Housing & Shelter',
    'Women & Child Development',
    'Education & Youth',
    'Small Business & MSME',
    'Social Security & Pension',
  ];

  // Filter schemes based on search, category, and level
  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATABASE.filter(scheme => {
      // Category filter
      if (selectedCategory !== 'All' && scheme.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'All' && scheme.level !== selectedLevel) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = scheme.name.toLowerCase().includes(q);
        const matchHindi = scheme.hindiName.toLowerCase().includes(q);
        const matchMinistry = scheme.ministry.toLowerCase().includes(q);
        const matchSummary = scheme.summary.toLowerCase().includes(q);
        const matchTag = scheme.tagline.toLowerCase().includes(q);
        const matchCode = scheme.code.toLowerCase().includes(q);
        if (!matchName && !matchHindi && !matchMinistry && !matchSummary && !matchTag && !matchCode) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  const handleToggleSave = (scheme: Scheme) => {
    const exists = trackedApps.some(a => a.schemeId === scheme.id);
    if (exists) {
      setTrackedApps(prev => prev.filter(a => a.schemeId !== scheme.id));
    } else {
      const newRecord: TrackedApplication = {
        id: `app-${Date.now()}`,
        schemeId: scheme.id,
        schemeName: scheme.name,
        appliedDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        applicationNumber: `YS/SAVE/${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'DRAFT',
        stageDescription: 'Scheme saved to your citizen dossier. Ready for submission.',
        updatedAt: 'Just now',
        notes: 'Bookmarked for document gathering.',
      };
      setTrackedApps(prev => [newRecord, ...prev]);
    }
  };

  const handleSpeakSummary = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToSpeak = '';
    if (language === 'hi') {
      textToSpeak = `योजना साथी मंच पर आपका स्वागत है। यहां ${filteredSchemes.length} प्रमुख सरकारी योजनाएं उपलब्ध हैं। आप पात्रता जांच टैब पर जाकर अपनी पात्रता का तुरंत परीक्षण कर सकते हैं।`;
    } else {
      textToSpeak = `Welcome to YojanaSaathi Civic Platform. There are currently ${filteredSchemes.length} active welfare schemes displayed in the portal. You can test your eligibility directly under the Check Eligibility tab.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Font size multiplier class
  const fontSizeClass = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[fontSize];

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#0D1C2F] flex flex-col ${fontSizeClass}`}>
      {/* Header */}
      <CivicHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onSpeakSummary={handleSpeakSummary}
        isSpeaking={isSpeaking}
        savedCount={trackedApps.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* TAB 1: Schemes Directory ("Yojana Khoj") */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Hero / Quick Action Banner */}
            <div className="bg-[#0F2942] text-white rounded-lg p-5 sm:p-6 border border-slate-800 shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#B45309] text-white uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Direct Citizen Benefits
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                  {language === 'hi' 
                    ? 'अपनी पात्रता के अनुसार सही सरकारी योजना खोजें' 
                    : 'Discover Direct Public Welfare Schemes Tailored to You'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'hi'
                    ? 'कृषि, स्वास्थ्य, आवास, शिक्षा एवं सूक्ष्म उद्यम के लिए केंद्र और राज्य सरकार की प्रमाणित जनकल्याणकारी योजनाओं का आधिकारिक निर्देशिका।'
                    : 'Comprehensive statutory guide covering Direct Benefit Transfers (DBT), Ayushman healthcare cover, MSME Mudra credit, and student grants.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => setActiveTab('checker')}
                    className="px-4 py-2 rounded text-xs sm:text-sm font-semibold bg-[#B45309] text-white hover:bg-[#9B4500] transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{language === 'hi' ? 'अपनी पात्रता जांचें' : 'Check My Eligibility Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('tracker')}
                    className="px-3.5 py-2 rounded text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-slate-600 flex items-center gap-1.5"
                  >
                    <BookmarkCheck className="w-4 h-4 text-amber-300" />
                    <span>{language === 'hi' ? 'मेरा आवेदन ट्रैकर' : 'View Tracked Applications'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0F2942] uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{language === 'hi' ? 'श्रेणी अनुसार फिल्टर करें:' : 'Filter by Welfare Sector:'}</span>
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#64748B] hidden sm:inline">Level:</span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-2.5 py-1 rounded border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F2942] focus:ring-2 focus:ring-[#0F2942]"
                  >
                    <option value="All">All Levels (समस्त)</option>
                    <option value="Central">Central (केंद्रीय)</option>
                    <option value="Centrally Sponsored">Centrally Sponsored</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all whitespace-nowrap border ${
                        isSelected
                          ? 'bg-[#0F2942] text-white border-[#0F2942] shadow-xs'
                          : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Count & Search Reset */}
            <div className="flex items-center justify-between text-xs text-[#64748B] border-b border-[#E2E8F0] pb-2">
              <div>
                <span>Showing </span>
                <strong className="text-[#0F172A]">{filteredSchemes.length}</strong>
                <span> verified government schemes</span>
                {selectedCategory !== 'All' && (
                  <span> in <strong className="text-[#0F2942]">{selectedCategory}</strong></span>
                )}
              </div>

              {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedLevel('All');
                  }}
                  className="text-xs font-semibold text-[#B45309] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset all filters
                </button>
              )}
            </div>

            {/* Scheme Cards Grid */}
            {filteredSchemes.length === 0 ? (
              <div className="bg-white border border-[#CBD5E1] rounded-lg p-12 text-center space-y-3">
                <Search className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-[#0F172A]">
                  No schemes match your criteria
                </h3>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Try adjusting your search terms or clearing category filters to view other public welfare offerings.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedLevel('All');
                  }}
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-[#0F2942] text-white hover:bg-[#1E3A8A]"
                >
                  View All Schemes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onOpenDetails={(s) => setActiveModalScheme(s)}
                    onCheckCriteria={(s) => {
                      setActiveModalScheme(s);
                    }}
                    isSaved={trackedApps.some(a => a.schemeId === scheme.id)}
                    onToggleSave={handleToggleSave}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Interactive Eligibility Checker ("Yogyata Jaanch") */}
        {activeTab === 'checker' && (
          <EligibilityChecker
            onOpenSchemeDetails={(scheme) => setActiveModalScheme(scheme)}
            language={language}
          />
        )}

        {/* TAB 3: My Applications & CSC Locator ("Mera Karyalay") */}
        {activeTab === 'tracker' && (
          <ApplicationTracker
            trackedApps={trackedApps}
            onUpdateApp={(updated) => {
              setTrackedApps(prev => prev.map(a => a.id === updated.id ? updated : a));
            }}
            onRemoveApp={(id) => {
              setTrackedApps(prev => prev.filter(a => a.id !== id));
            }}
            onAddApp={(newApp) => {
              setTrackedApps(prev => [newApp, ...prev]);
            }}
            onOpenSchemeDetails={(scheme) => setActiveModalScheme(scheme)}
            language={language}
          />
        )}

        {/* TAB 4: Help, FAQs & CSC Centers ("Sahayata") */}
        {activeTab === 'help' && (
          <HelpSupport language={language} />
        )}
      </main>

      {/* Scheme Deep Dive Dialog / Drawer */}
      <SchemeModal
        scheme={activeModalScheme}
        citizenProfile={citizenProfile}
        isOpen={!!activeModalScheme}
        onClose={() => setActiveModalScheme(null)}
        isSaved={activeModalScheme ? trackedApps.some(a => a.schemeId === activeModalScheme.id) : false}
        onSaveApplication={(s) => handleToggleSave(s)}
        language={language}
      />

      {/* Civic Institutional Footer */}
      <footer className="mt-12 bg-[#001428] text-slate-300 border-t border-slate-700 py-8 px-4 text-xs font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#0F2942] border border-[#B45309] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-[#FD8A42]" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {language === 'hi' ? 'योजनासाथी लोक कल्याण मंच' : 'YojanaSaathi Civic Platform'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  National Civic Technology Initiative for Seamless Public Welfare Navigation
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Data Protection & Privacy Act Compliant
              </span>
              <span>•</span>
              <span>WCAG 2.1 AAA Standard</span>
              <span>•</span>
              <span>NPCI / PFMS Direct Banking</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>
              © {new Date().getFullYear()} YojanaSaathi Civic Platform. Content published for citizen welfare empowerment. All statutory scheme guidelines adhere to Government of India gazettes.
            </p>
            <div className="flex items-center gap-3 font-semibold text-slate-300">
              <button onClick={() => setActiveTab('directory')} className="hover:text-white">Directory</button>
              <button onClick={() => setActiveTab('checker')} className="hover:text-white">Eligibility</button>
              <button onClick={() => setActiveTab('tracker')} className="hover:text-white">Desk</button>
              <button onClick={() => setActiveTab('help')} className="hover:text-white">Helplines</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
