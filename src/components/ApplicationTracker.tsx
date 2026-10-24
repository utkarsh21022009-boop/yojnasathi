import React, { useState } from 'react';
import { 
  BookmarkCheck, Plus, CheckCircle2, Clock, AlertCircle, 
  MapPin, Phone, Building2, Search, ArrowRight, Trash2, Edit3 
} from 'lucide-react';
import { Scheme, TrackedApplication } from '../types/scheme';
import { SCHEMES_DATABASE } from '../data/schemes';

interface ApplicationTrackerProps {
  trackedApps: TrackedApplication[];
  onUpdateApp: (updated: TrackedApplication) => void;
  onRemoveApp: (id: string) => void;
  onAddApp: (app: TrackedApplication) => void;
  onOpenSchemeDetails: (scheme: Scheme) => void;
  language: 'en' | 'hi';
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  trackedApps,
  onUpdateApp,
  onRemoveApp,
  onAddApp,
  onOpenSchemeDetails,
  language,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState(SCHEMES_DATABASE[0].id);
  const [appNumber, setAppNumber] = useState('');
  const [notes, setNotes] = useState('');

  // CSC locator simulator
  const [cscPin, setCscPin] = useState('226001'); // Lucknow default or general PIN
  const [searchedPin, setSearchedPin] = useState('226001');

  const STAGES: { key: TrackedApplication['status']; label: string; labelHi: string }[] = [
    { key: 'DRAFT', label: '1. Draft Form', labelHi: '१. प्रारूप' },
    { key: 'SUBMITTED', label: '2. Submitted', labelHi: '२. जमा किया' },
    { key: 'UNDER_VERIFICATION', label: '3. Field Verification', labelHi: '३. भौतिक सत्यापन' },
    { key: 'APPROVED', label: '4. Sanctioned', labelHi: '४. स्वीकृत' },
    { key: 'DISBURSED', label: '5. DBT Disbursed', labelHi: '५. डीबीटी जारी' },
  ];

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const scheme = SCHEMES_DATABASE.find(s => s.id === selectedSchemeId);
    if (!scheme) return;

    const newApp: TrackedApplication = {
      id: `app-${Date.now()}`,
      schemeId: scheme.id,
      schemeName: scheme.name,
      appliedDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      applicationNumber: appNumber || `YS/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'SUBMITTED',
      stageDescription: 'Application received at District Level Clearing House. Field survey pending.',
      updatedAt: 'Just now',
      notes: notes || 'Awaiting revenue inspector verification.',
    };

    onAddApp(newApp);
    setShowAddModal(false);
    setAppNumber('');
    setNotes('');
  };

  const advanceStage = (app: TrackedApplication) => {
    const stageKeys: TrackedApplication['status'][] = ['DRAFT', 'SUBMITTED', 'UNDER_VERIFICATION', 'APPROVED', 'DISBURSED'];
    const currentIndex = stageKeys.indexOf(app.status);
    if (currentIndex < stageKeys.length - 1) {
      const nextStatus = stageKeys[currentIndex + 1];
      let desc = 'Updated status';
      if (nextStatus === 'UNDER_VERIFICATION') desc = 'Gram Panchayat & Revenue Officer conducting physical land/income verification.';
      if (nextStatus === 'APPROVED') desc = 'Eligibility verified. Sanction Order (PPO/Sanction ID) issued.';
      if (nextStatus === 'DISBURSED') desc = 'Funds credited via Aadhaar PFMS DBT into bank account.';

      onUpdateApp({
        ...app,
        status: nextStatus,
        stageDescription: desc,
        updatedAt: 'Updated today',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#EFF6FF] text-[#0F2942] border border-[#BFDBFE]">
              <BookmarkCheck className="w-5 h-5 text-[#0F2942]" />
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {language === 'hi' ? 'मेरा कार्यालय: आवेदन ट्रैकर एवं लॉकर' : 'Citizen Desk: Application Tracker & Audit'}
            </h2>
          </div>
          <p className="text-sm text-[#475569] mt-1">
            {language === 'hi'
              ? 'अपने सक्रिय सरकारी आवेदनों की स्थिति ट्रैक करें, डीबीटी किस्तें देखें, और निकटतम जन सेवा केंद्र खोजें।'
              : 'Monitor active government scheme dossiers, milestone disbursements, and find nearest village Common Service Centers.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs sm:text-sm font-semibold bg-[#0F2942] text-white hover:bg-[#1E3A8A] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? 'नया आवेदन जोड़ें' : 'Track New Application'}</span>
        </button>
      </div>

      {/* Tracked Applications List */}
      {trackedApps.length === 0 ? (
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-8 text-center space-y-3">
          <BookmarkCheck className="w-12 h-12 text-[#94A3B8] mx-auto stroke-1" />
          <h3 className="text-base font-bold text-[#0F172A]">
            {language === 'hi' ? 'कोई सक्रिय आवेदन ट्रैक नहीं किया जा रहा है' : 'No Applications Currently Tracked'}
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            You can bookmark schemes from the directory or manually record an application acknowledgment number to follow its sanction trajectory.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded bg-[#0F2942] text-white hover:bg-[#1E3A8A]"
          >
            Track Existing Application Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trackedApps.map((app) => {
            const currentStageIndex = STAGES.findIndex(s => s.key === app.status);
            const scheme = SCHEMES_DATABASE.find(s => s.id === app.schemeId);

            return (
              <div
                key={app.id}
                className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs space-y-4 hover:border-slate-400 transition-colors"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE]">
                        Ref: {app.applicationNumber}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        Applied on {app.appliedDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] mt-1">
                      {app.schemeName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {scheme && (
                      <button
                        onClick={() => onOpenSchemeDetails(scheme)}
                        className="px-2.5 py-1 text-xs font-semibold rounded text-[#0F2942] border border-[#CBD5E1] hover:bg-[#F1F5F9]"
                      >
                        Scheme Details
                      </button>
                    )}

                    <button
                      onClick={() => onRemoveApp(app.id)}
                      className="p-1 text-slate-400 hover:text-[#BE123C] transition-colors"
                      title="Remove from Tracker"
                      aria-label="Remove application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 5-Stage Stepper Progress Bar */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    {STAGES.map((stage, idx) => {
                      const isComplete = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div key={stage.key} className="text-center">
                          <div
                            className={`h-2 rounded-full mb-1.5 transition-all ${
                              isComplete
                                ? 'bg-[#047857]'
                                : 'bg-[#E2E8F0]'
                            }`}
                          />
                          <span
                            className={`block text-[10px] sm:text-xs font-semibold truncate ${
                              isCurrent
                                ? 'text-[#0F2942] font-bold'
                                : isComplete
                                ? 'text-[#047857]'
                                : 'text-[#94A3B8]'
                            }`}
                          >
                            {language === 'hi' ? stage.labelHi : stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Notice & Advancement */}
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0F172A] block">Current Stage Audit:</span>
                      <p className="text-[#475569]">{app.stageDescription}</p>
                      {app.notes && (
                        <p className="text-[11px] text-[#64748B] mt-0.5 italic">Note: {app.notes}</p>
                      )}
                    </div>
                  </div>

                  {currentStageIndex < STAGES.length - 1 && (
                    <button
                      onClick={() => advanceStage(app)}
                      className="shrink-0 px-3 py-1.5 rounded text-xs font-semibold bg-[#B45309] text-white hover:bg-[#9B4500] transition-colors flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>Advance Demo Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {currentStageIndex === STAGES.length - 1 && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-1 rounded border border-[#A7F3D0]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Disbursed to Bank
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Common Service Centre (Jan Seva Kendra) Finder Simulator */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F2942]" />
            <h3 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider">
              {language === 'hi' ? 'निकटतम जन सेवा केंद्र (CSC Locator)' : 'Nearest Common Service Centre (CSC) Locator'}
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">
            Assisted biometric e-KYC & offline submission center
          </span>
        </div>

        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              value={cscPin}
              onChange={(e) => setCscPin(e.target.value)}
              placeholder="Enter 6-digit PIN code..."
              maxLength={6}
              className="w-full h-9 pl-8 pr-3 rounded border border-[#94A3B8] text-xs font-medium focus:ring-2 focus:ring-[#0F2942]"
            />
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            onClick={() => setSearchedPin(cscPin)}
            className="px-3.5 py-2 rounded text-xs font-semibold bg-[#0F2942] text-white hover:bg-[#1E3A8A]"
          >
            Locate Centers
          </button>
        </div>

        {/* Demo Verified Local CSC Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded border border-[#CBD5E1] bg-[#F8FAFC] text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#0F172A]">
              <span>Gram Panchayat Jan Seva Kendra #{searchedPin}-01</span>
              <span className="text-[10px] text-[#047857] bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                Open Now
              </span>
            </div>
            <p className="text-[#475569]">VLE Officer: Manoj Sharma • CSC ID: 884192001</p>
            <p className="text-[#64748B]">Panchayat Bhavan, Near Sub-Post Office, PIN: {searchedPin}</p>
            <p className="text-[#0F2942] font-semibold pt-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#B45309]" />
              Helpline: +91 94150 12026
            </p>
          </div>

          <div className="p-3 rounded border border-[#CBD5E1] bg-[#F8FAFC] text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#0F172A]">
              <span>Digital Seva Kendra (Tehsil Complex) #{searchedPin}-02</span>
              <span className="text-[10px] text-[#047857] bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                Open Now
              </span>
            </div>
            <p className="text-[#475569]">VLE Officer: Priya Kumari • CSC ID: 884192089</p>
            <p className="text-[#64748B]">SDM Office Road, Block Development Office, PIN: {searchedPin}</p>
            <p className="text-[#0F2942] font-semibold pt-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#B45309]" />
              Helpline: +91 98390 44102
            </p>
          </div>
        </div>
      </div>

      {/* Manual Track Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg border border-[#CBD5E1] p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#0F172A]">
              Track a Scheme Application
            </h3>
            <form onSubmit={handleCreateApplication} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Select Scheme
                </label>
                <select
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-[#94A3B8] text-xs text-[#0F172A]"
                >
                  {SCHEMES_DATABASE.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Application Acknowledgment Number (Optional)
                </label>
                <input
                  type="text"
                  value={appNumber}
                  onChange={(e) => setAppNumber(e.target.value)}
                  placeholder="e.g. KISAN/2026/89201"
                  className="w-full h-9 px-3 rounded border border-[#94A3B8] text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Personal Reminder / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Khatauni submitted at Block office"
                  className="w-full h-9 px-3 rounded border border-[#94A3B8] text-xs text-[#0F172A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#475569] hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#0F2942] text-white hover:bg-[#1E3A8A] rounded"
                >
                  Save & Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
