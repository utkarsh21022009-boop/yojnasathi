import React, { useState } from 'react';
import { Phone, ShieldAlert, FileQuestion, HelpCircle, CheckCircle, ExternalLink, Building, AlertCircle } from 'lucide-react';

interface HelpSupportProps {
  language: 'en' | 'hi';
}

export const HelpSupport: React.FC<HelpSupportProps> = ({ language }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const HELPLINES = [
    { name: 'PM-KISAN Samman Nidhi', number: '155261 / 1800-115-526', desc: 'Direct farmer DBT installment queries' },
    { name: 'Ayushman Bharat (PM-JAY)', number: '14555 / 1800-111-565', desc: 'Cashless hospital empanelment & golden card' },
    { name: 'Elder Line (Senior Citizen)', number: '14567', desc: 'Toll-free social security & pension grievance' },
    { name: 'National Scholarship Portal', number: '0120-6619540', desc: 'SC/ST/OBC college student disbursements' },
    { name: 'Ujjwala 2.0 LPG Helpline', number: '1800-266-6696 / 1906', desc: 'LPG connection distribution & safety' },
    { name: 'National Consumer / Civic Helpline', number: '1915', desc: 'Public service delivery and complaint redress' },
  ];

  const FAQS = [
    {
      q: language === 'hi' ? 'डीबीटी (Direct Benefit Transfer) के लिए बैंक खाते को आधार से कैसे जोड़ें?' : 'How do I link and map my bank account for Aadhaar DBT payments?',
      a: language === 'hi' 
        ? 'डीबीटी राशि प्राप्त करने के लिए केवल आधार लिंक होना पर्याप्त नहीं है, बैंक शाखा में NPCI मैपिंग अनिवार्य है। अपने बैंक में "Aadhaar NPCI DBT Consent Form" भरकर जमा करें या बैंक की मोबाइल ऐप में आधार सीडिंग विकल्प चुनें।'
        : 'Having an Aadhaar-linked bank account is not enough; your account must be actively mapped in the NPCI (National Payments Corporation of India) mapper. Visit your bank branch and submit the Aadhaar DBT Seeding Mandate or activate it via NetBanking.',
    },
    {
      q: language === 'hi' ? 'यदि ग्राम पंचायत स्तर पर मेरा आवेदन लंबित है तो क्या करें?' : 'What if my scheme application is pending at Gram Panchayat / Block office?',
      a: language === 'hi'
        ? 'यदि निर्धारित समय-सीमा (सामान्यतः 15-30 दिन) में सत्यापन नहीं होता है, तो संबंधित खंड विकास अधिकारी (BDO) से संपर्क करें या CPGRAMS (pgportal.gov.in) पर ऑनलाइन शिकायत दर्ज करें।'
        : 'If verification exceeds statutory Citizen Charter limits (typically 15-30 days), approach the Block Development Officer (BDO) or register a formal grievance on the central CPGRAMS portal (pgportal.gov.in).',
    },
    {
      q: language === 'hi' ? 'जन सेवा केंद्र (CSC) में जाने से पहले कौन से दस्तावेज़ तैयार रखने चाहिए?' : 'Which documents must I carry to the Common Service Centre (CSC)?',
      a: language === 'hi'
        ? 'मूल आधार कार्ड (ओटीपी के लिए सक्रिय मोबाइल के साथ), बैंक पासबुक (आईएफएससी सहित), राशन कार्ड, और संबंधित प्रमाण पत्र (भूमि खतौनी/जाति/आय प्रमाण पत्र)।'
        : 'Original Aadhaar card with registered mobile phone for biometric/OTP e-KYC, bank passbook showing printed IFSC and account number, family ration card, and specific proofs (Khatauni for farmers, Caste certificate for scholarships).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded bg-[#EFF6FF] text-[#0F2942] border border-[#BFDBFE]">
            <HelpCircle className="w-5 h-5 text-[#0F2942]" />
          </span>
          <h2 className="text-xl font-bold text-[#0F172A]">
            {language === 'hi' ? 'नागरिक सहायता एवं जन सेवा केंद्र' : 'Citizen Assistance & Redressal Desk'}
          </h2>
        </div>
        <p className="text-sm text-[#475569] mt-1">
          {language === 'hi'
            ? 'सरकारी योजनाओं के लिए टोल-फ्री राष्ट्रीय हेल्पलाइन, आधार-डीबीटी मार्गदर्शन, और शिकायत निवारण प्रणाली।'
            : 'National toll-free ministry helplines, Aadhaar-NPCI direct transfer guidelines, and public service grievance redressal.'}
        </p>
      </div>

      {/* Helplines Grid */}
      <div>
        <h3 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-[#B45309]" />
          <span>{language === 'hi' ? 'राष्ट्रीय टोल-फ्री हेल्पलाइन' : 'Official Central Government Helplines'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HELPLINES.map((h, i) => (
            <div key={i} className="bg-white border border-[#CBD5E1] rounded-lg p-4 shadow-xs space-y-1">
              <span className="text-xs font-bold text-[#0F172A] block">{h.name}</span>
              <p className="text-base font-bold text-[#B45309] tracking-wide font-mono tabular-nums">{h.number}</p>
              <p className="text-[11px] text-[#64748B] leading-tight">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aadhaar-DBT Readiness Guide */}
      <div className="bg-[#EFF4FF] border border-[#BFDBFE] rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#1E3A8A]" />
          <h4 className="text-sm font-bold text-[#0F2942]">
            {language === 'hi' ? 'आधार-डीबीटी (DBT) सक्रियता अनिवार्य जांच' : 'Aadhaar-DBT Mandatory Readiness Guide'}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#334155]">
          <div className="bg-white p-3 rounded border border-[#CBD5E1]">
            <span className="font-bold text-[#0F172A] block mb-1">1. Mobile-Aadhaar Link</span>
            <p className="text-[#64748B]">Ensure your mobile number is updated in UIDAI to receive OTPs for instant e-KYC.</p>
          </div>
          <div className="bg-white p-3 rounded border border-[#CBD5E1]">
            <span className="font-bold text-[#0F172A] block mb-1">2. NPCI DBT Seeding</span>
            <p className="text-[#64748B]">Verify that your primary bank account is mapped on the NPCI Aadhaar Payments Bridge (APB).</p>
          </div>
          <div className="bg-white p-3 rounded border border-[#CBD5E1]">
            <span className="font-bold text-[#0F172A] block mb-1">3. Non-Deduction Mandate</span>
            <p className="text-[#64748B]">Ensure your account is active (KYC completed) so welfare payments are not rejected.</p>
          </div>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-2">
          {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Civic Inquiries'}
        </h4>

        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="border border-[#CBD5E1] rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] font-bold text-xs text-[#0F172A] flex justify-between items-center transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#0F2942] text-sm ml-2">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="p-3 bg-white text-xs text-[#475569] leading-relaxed border-t border-[#CBD5E1]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
