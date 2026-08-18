import React, { useState } from 'react';
import AgreementProgress from './AgreementProgress';
import SignaturePad from './SignaturePad';
import SelfieCapture from './SelfieCapture';
import FinalCeremony from './FinalCeremony';
import {
  generateAgreementId,
  generateSealColor,
  type AgreementData,
} from '../services/agreement';
import { upsertMember } from '../services/storage';
import { Shield, Sparkles, User, Briefcase, CheckCircle2 } from 'lucide-react';

interface SigningSectionProps {
  onMemberSealed: (member: AgreementData) => void;
}

export default function SigningSection({ onMemberSealed }: SigningSectionProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [photoData, setPhotoData] = useState('');
  const [agreedToOath, setAgreedToOath] = useState(false);
  const [sealedMember, setSealedMember] = useState<AgreementData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSeal = () => {
    if (!name.trim() || !agreedToOath) return;

    setIsSubmitting(true);
    const newAgreementId = generateAgreementId();
    const newMember: AgreementData = {
      memberId: `mem_${Date.now()}`,
      memberName: name.trim(),
      role: role.trim() || 'Team Member',
      agreementId: newAgreementId,
      timestamp: new Date().toISOString(),
      status: 'sealed',
      signatureDataUrl: signatureData || undefined,
      photoDataUrl: photoData || undefined,
      sealColor: generateSealColor(name.trim()),
    };

    // Save to local storage
    upsertMember(newMember);
    onMemberSealed(newMember);

    setTimeout(() => {
      setSealedMember(newMember);
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setRole('');
    setSignatureData('');
    setPhotoData('');
    setAgreedToOath(false);
    setSealedMember(null);
    setStep(1);
  };

  // If already sealed, render the celebratory ceremony card
  if (sealedMember) {
    return (
      <section id="sign" className="w-full py-16">
        <FinalCeremony member={sealedMember} onResetToNew={handleReset} />
      </section>
    );
  }

  return (
    <section
      id="sign"
      className="relative w-full max-w-3xl mx-auto px-4 py-16 sm:py-24"
      aria-label="Signing Ceremony"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-10 bg-imperial-gold/40" />
          <span className="font-cinzel text-xs tracking-[0.3em] text-imperial-gold uppercase">
            Ceremonial Inscription
          </span>
          <div className="h-px w-10 bg-imperial-gold/40" />
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-ivory tracking-wide mb-2">
          SEAL YOUR AGREEMENT
        </h2>
        <p className="font-noto text-xs sm:text-sm text-aged-paper/70 max-w-md mx-auto italic">
          "Bind your name, mark, and honour to the fellowship through the five ritual steps."
        </p>
      </div>

      {/* 5-Step Progress Bar */}
      <AgreementProgress currentStep={step} />

      {/* Step Form Container */}
      <div className="glass-dark imperial-border p-6 sm:p-10 rounded-sm mt-8 shadow-2xl relative">
        {/* STEP 1: Enter Name and Role */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center mb-6">
              <span className="font-cinzel text-xs text-imperial-gold tracking-widest uppercase font-bold">
                STEP 01 OF 05
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory mt-1">
                Enter Your Identity
              </h3>
              <p className="text-xs text-aged-paper/70 font-noto mt-1">
                Provide your full name and assigned project responsibility.
              </p>
            </div>

            <div>
              <label
                htmlFor="member-name-input"
                className="block text-xs font-cinzel text-imperial-gold uppercase tracking-wider mb-2 font-semibold"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-imperial-gold/50">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="member-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="parchment-input w-full pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-imperial-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="member-role-input"
                className="block text-xs font-cinzel text-imperial-gold uppercase tracking-wider mb-2 font-semibold"
              >
                Project Role (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-imperial-gold/50">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  id="member-role-input"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Engineer, UI/UX Designer, Architect"
                  className="parchment-input w-full pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-imperial-gold"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!name.trim()}
                className="btn-imperial px-8 py-3 rounded text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                NEXT: CREATE SIGNATURE →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Signature */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center mb-6">
              <span className="font-cinzel text-xs text-imperial-gold tracking-widest uppercase font-bold">
                STEP 02 OF 05
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory mt-1">
                Affix Your Indelible Signature
              </h3>
              <p className="text-xs text-aged-paper/70 font-noto mt-1">
                Inscribe your signature using your finger, stylus, or cursor on the parchment canvas.
              </p>
            </div>

            <SignaturePad
              onSave={setSignatureData}
              initialData={signatureData}
            />

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 rounded bg-black/40 text-aged-paper hover:text-ivory border border-imperial-gold/20 text-xs font-cinzel tracking-wider cursor-pointer"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-imperial px-8 py-3 rounded text-xs font-bold cursor-pointer"
              >
                NEXT: IDENTITY PHOTO →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Selfie Capture */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center mb-6">
              <span className="font-cinzel text-xs text-imperial-gold tracking-widest uppercase font-bold">
                STEP 03 OF 05
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory mt-1">
                Capture Identity Portrait
              </h3>
              <p className="text-xs text-aged-paper/70 font-noto mt-1">
                Take a portrait or upload a photo to embed into your permanent covenant seal.
              </p>
            </div>

            <SelfieCapture
              onCapture={setPhotoData}
              initialPhoto={photoData}
            />

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 rounded bg-black/40 text-aged-paper hover:text-ivory border border-imperial-gold/20 text-xs font-cinzel tracking-wider cursor-pointer"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-imperial px-8 py-3 rounded text-xs font-bold cursor-pointer"
              >
                NEXT: CONFIRM OATH →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirm Agreement */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-up">
            <div className="text-center mb-6">
              <span className="font-cinzel text-xs text-imperial-gold tracking-widest uppercase font-bold">
                STEP 04 OF 05
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory mt-1">
                The Final Declaration
              </h3>
              <p className="text-xs text-aged-paper/70 font-noto mt-1">
                Review your commitment before stamping the royal seal.
              </p>
            </div>

            {/* Summary Review Box */}
            <div className="p-4 rounded bg-black/40 border border-imperial-gold/20 space-y-2 text-xs font-cinzel">
              <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
                <span className="text-imperial-gold/70">MEMBER NAME</span>
                <span className="text-ivory font-bold">{name}</span>
              </div>
              <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
                <span className="text-imperial-gold/70">ROLE</span>
                <span className="text-ivory">{role || 'Team Member'}</span>
              </div>
              <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
                <span className="text-imperial-gold/70">SIGNATURE STATUS</span>
                <span className={signatureData ? 'text-jade' : 'text-aged-paper/50'}>
                  {signatureData ? '✓ Inscribed' : 'Optional (skipped)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-imperial-gold/70">PORTRAIT SEAL</span>
                <span className={photoData ? 'text-jade' : 'text-aged-paper/50'}>
                  {photoData ? '✓ Captured' : 'Optional (skipped)'}
                </span>
              </div>
            </div>

            {/* Checkbox */}
            <div className="p-4 rounded bg-imperial-gold/5 border border-imperial-gold/30 flex items-start gap-3">
              <input
                id="oath-agreement-checkbox"
                type="checkbox"
                checked={agreedToOath}
                onChange={(e) => setAgreedToOath(e.target.checked)}
                className="mt-1 w-4 h-4 text-vermilion rounded border-imperial-gold bg-black/60 focus:ring-imperial-gold cursor-pointer"
              />
              <label
                htmlFor="oath-agreement-checkbox"
                className="text-xs font-noto leading-relaxed text-ivory cursor-pointer select-none"
              >
                <strong>I have read and understood this Covenant</strong> and voluntarily agree to follow its working principles for the duration of the project.
              </label>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 rounded bg-black/40 text-aged-paper hover:text-ivory border border-imperial-gold/20 text-xs font-cinzel tracking-wider cursor-pointer"
              >
                ← BACK
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!agreedToOath}
                className="btn-imperial px-8 py-3 rounded text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                NEXT: SEAL COVENANT →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Final Stamp Execution */}
        {step === 5 && (
          <div className="space-y-6 text-center animate-fade-up">
            <div className="mb-6">
              <span className="font-cinzel text-xs text-imperial-gold tracking-widest uppercase font-bold">
                STEP 05 OF 05
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-bright-gold mt-1">
                AFFIX THE IMPERIAL SEAL
              </h3>
              <p className="text-xs text-aged-paper/80 font-noto mt-2 max-w-md mx-auto">
                Ready to commit your oath into the official ledger. Click below to execute the ceremony.
              </p>
            </div>

            <div className="my-8 flex justify-center">
              <div className="p-4 rounded-full bg-imperial-gold/10 border-2 border-imperial-gold/30 animate-pulse">
                <Shield className="w-16 h-16 text-bright-gold" />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-full sm:w-auto px-6 py-3 rounded bg-black/40 text-aged-paper hover:text-ivory border border-imperial-gold/20 text-xs font-cinzel tracking-wider cursor-pointer"
              >
                ← BACK
              </button>
              <button
                id="seal-covenant-btn"
                type="button"
                onClick={handleFinalSeal}
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-vermilion px-10 py-4 rounded text-sm font-extrabold tracking-widest shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isSubmitting ? 'SEALING RECORD...' : 'SEAL THE COVENANT'}</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
