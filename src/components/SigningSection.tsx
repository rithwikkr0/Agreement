import React, { useState, useEffect } from 'react';
import AgreementProgress from './AgreementProgress';
import SignaturePad from './SignaturePad';
import SelfieCapture from './SelfieCapture';
import FinalCeremony from './FinalCeremony';
import {
  generateAgreementId,
  generateSealColor,
  type AgreementData,
} from '../services/agreement';
import {
  upsertMember,
  saveCurrentSession,
  loadCurrentSession,
  clearCurrentSession,
  loadMembers,
} from '../services/storage';
import { teamConfig } from '../config/team';
import {
  Shield,
  Sparkles,
  User,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
} from 'lucide-react';

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
  const [photoSkipped, setPhotoSkipped] = useState(false);
  const [sealedMember, setSealedMember] = useState<AgreementData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Restore saved session on mount
  useEffect(() => {
    const saved = loadCurrentSession();
    if (saved) {
      if (saved.name) setName(saved.name);
      if (saved.role) setRole(saved.role);
      if (saved.signatureDataUrl) setSignatureData(saved.signatureDataUrl);
      if (saved.photoDataUrl) setPhotoData(saved.photoDataUrl);
      if (saved.agreedToOath !== undefined) setAgreedToOath(saved.agreedToOath);
      if (saved.step && saved.step >= 1 && saved.step <= 5) setStep(saved.step);
    }
  }, []);

  // Save session state to localStorage on changes
  useEffect(() => {
    if (!sealedMember) {
      saveCurrentSession({
        step,
        name,
        role,
        signatureDataUrl: signatureData || undefined,
        photoDataUrl: photoData || undefined,
        agreedToOath,
      });
    }
  }, [step, name, role, signatureData, photoData, agreedToOath, sealedMember]);

  const maxMembers = teamConfig.maximumMembers || 10;
  const currentMemberCount = loadMembers().filter((m) => m.status === 'sealed').length;
  const isRegistryFull = currentMemberCount >= maxMembers;

  const handleNextStep = () => {
    setValidationError(null);

    if (step === 1) {
      if (!name.trim() || name.trim().length < 2) {
        setValidationError('Please enter your full name (at least 2 characters) before proceeding.');
        return;
      }
    } else if (step === 2) {
      if (!signatureData) {
        setValidationError('Please inscribe your signature on the parchment canvas before proceeding.');
        return;
      }
    } else if (step === 3) {
      if (!photoData && !photoSkipped) {
        setValidationError('Please capture a photo, upload an image, or explicitly choose to skip photo capture.');
        return;
      }
    } else if (step === 4) {
      if (!agreedToOath) {
        setValidationError('You must confirm the covenant oath checkbox to proceed to the final seal.');
        return;
      }
    }

    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSeal = () => {
    setValidationError(null);

    // Strict validation
    if (!name.trim()) {
      setValidationError('Member name is required.');
      setStep(1);
      return;
    }
    if (!signatureData) {
      setValidationError('Indelible signature is required.');
      setStep(2);
      return;
    }
    if (!photoData && !photoSkipped) {
      setValidationError('Identity portrait or skip confirmation is required.');
      setStep(3);
      return;
    }
    if (!agreedToOath) {
      setValidationError('Agreement to the Covenant Oath is required.');
      setStep(4);
      return;
    }
    if (isRegistryFull) {
      setValidationError(`The Covenant Registry is full (${maxMembers} / ${maxMembers} members sealed).`);
      return;
    }

    setIsSubmitting(true);
    const newAgreementId = generateAgreementId();
    const newMember: AgreementData = {
      memberId: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      memberName: name.trim(),
      role: role.trim() || 'Fellow Member',
      agreementId: newAgreementId,
      timestamp: new Date().toISOString(),
      status: 'sealed',
      signatureDataUrl: signatureData || undefined,
      photoDataUrl: photoData || undefined,
      sealColor: generateSealColor(name.trim()),
    };

    // Save to local storage
    const success = upsertMember(newMember);
    if (!success) {
      setValidationError('Could not seal covenant. Registry may be full or storage unavailable.');
      setIsSubmitting(false);
      return;
    }

    // Clear temporary session and notify parent
    clearCurrentSession();
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
    setPhotoSkipped(false);
    setSealedMember(null);
    setValidationError(null);
    clearCurrentSession();
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

        {isRegistryFull && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-ancient-red/30 border border-vermilion text-xs font-cinzel text-ivory font-bold">
            <Lock className="w-4 h-4 text-bright-gold" />
            <span>COVENANT REGISTRY FULL ({currentMemberCount} / {maxMembers} SEALED)</span>
          </div>
        )}
      </div>

      {/* 5-Step Progress Indicator */}
      <AgreementProgress currentStep={step} />

      {/* Step Form Box */}
      <div className="glass-dark imperial-border p-6 sm:p-10 rounded-sm mt-8 shadow-2xl relative">
        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6 p-3.5 rounded bg-ancient-red/25 border border-vermilion text-xs text-ivory flex items-start gap-2.5 animate-fade-up">
            <AlertTriangle className="w-4 h-4 text-bright-gold shrink-0 mt-0.5" />
            <span className="font-noto leading-relaxed">{validationError}</span>
          </div>
        )}

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
                Full Name * <span className="text-vermilion">(Required)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-imperial-gold/60">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="member-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Enter your full name"
                  className="parchment-input w-full pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-imperial-gold"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="member-role-input"
                className="block text-xs font-cinzel text-imperial-gold uppercase tracking-wider mb-2 font-semibold"
              >
                Project Role <span className="text-aged-paper/40">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-imperial-gold/60">
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
                disabled={!name.trim() || name.trim().length < 2}
                className="btn-imperial px-8 py-3 rounded text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-lg"
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
              onSave={(data) => {
                setSignatureData(data);
                if (validationError) setValidationError(null);
              }}
              initialData={signatureData}
            />

            <div className="pt-4 flex justify-between items-center">
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
                disabled={!signatureData}
                className="btn-imperial px-8 py-3 rounded text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
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
                Capture Identity Portrait Seal
              </h3>
              <p className="text-xs text-aged-paper/70 font-noto mt-1">
                Take a portrait or upload a photo to bind your seal with the covenant.
              </p>
            </div>

            <SelfieCapture
              onCapture={(data) => {
                setPhotoData(data);
                if (data) setPhotoSkipped(false);
                if (validationError) setValidationError(null);
              }}
              initialPhoto={photoData}
            />

            {/* Skip Option if Camera is Unavailable */}
            {!photoData && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoSkipped(true);
                    setPhotoData('');
                    setStep(4);
                  }}
                  className="text-xs text-aged-paper/60 hover:text-bright-gold underline font-noto transition-colors cursor-pointer"
                >
                  No camera available? Continue without photo
                </button>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center">
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
                disabled={!photoData && !photoSkipped}
                className="btn-imperial px-8 py-3 rounded text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
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
                Review your commitment and affix your confirmation.
              </p>
            </div>

            {/* Summary Review Box */}
            <div className="p-5 rounded bg-black/50 border border-imperial-gold/20 space-y-3 text-xs font-cinzel">
              <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
                <span className="text-imperial-gold/70">MEMBER NAME</span>
                <span className="text-ivory font-bold text-sm">{name}</span>
              </div>
              <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
                <span className="text-imperial-gold/70">ROLE</span>
                <span className="text-ivory">{role || 'Fellow Member'}</span>
              </div>
              <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
                <span className="text-imperial-gold/70">SIGNATURE</span>
                <span className="text-jade font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Inscribed & Verified
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-imperial-gold/70">PORTRAIT SEAL</span>
                <span className={photoData ? 'text-jade font-bold flex items-center gap-1' : 'text-aged-paper/50'}>
                  {photoData ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Captured
                    </>
                  ) : (
                    'Omitted (No camera)'
                  )}
                </span>
              </div>
            </div>

            {/* Checkbox */}
            <div className="p-4 rounded bg-imperial-gold/10 border border-imperial-gold/30 flex items-start gap-3">
              <input
                id="oath-agreement-checkbox"
                type="checkbox"
                checked={agreedToOath}
                onChange={(e) => {
                  setAgreedToOath(e.target.checked);
                  if (validationError) setValidationError(null);
                }}
                className="mt-1 w-4 h-4 text-vermilion rounded border-imperial-gold bg-black/60 focus:ring-imperial-gold cursor-pointer"
              />
              <label
                htmlFor="oath-agreement-checkbox"
                className="text-xs font-noto leading-relaxed text-ivory cursor-pointer select-none"
              >
                <strong className="text-bright-gold">I have read and understood this Covenant</strong> and voluntarily agree to follow its twelve articles and working principles for the duration of the project.
              </label>
            </div>

            <div className="pt-4 flex justify-between items-center">
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
                className="btn-imperial px-8 py-3 rounded text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-lg"
              >
                NEXT: SEAL COVENANT →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Final Stamp Execution */}
        {step === 5 && (
          <div className="space-y-6 text-center animate-fade-up">
            <div className="mb-4">
              <span className="font-cinzel text-xs text-imperial-gold tracking-widest uppercase font-bold">
                STEP 05 OF 05
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-bright-gold mt-1">
                AFFIX THE IMPERIAL SEAL
              </h3>
              <p className="text-xs text-aged-paper/80 font-noto mt-2 max-w-md mx-auto">
                Ready to commit your oath into the official ledger. Verify all checklist requirements below.
              </p>
            </div>

            {/* Checklist Box */}
            <div className="max-w-md mx-auto p-4 rounded bg-black/50 border border-imperial-gold/20 text-left text-xs font-cinzel space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-aged-paper/80">1. Member Name:</span>
                <span className="text-jade font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-aged-paper/80">2. Indelible Signature:</span>
                <span className={signatureData ? 'text-jade font-bold flex items-center gap-1' : 'text-vermilion font-bold flex items-center gap-1'}>
                  {signatureData ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {signatureData ? 'Inscribed' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-aged-paper/80">3. Identity Portrait:</span>
                <span className="text-jade font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {photoData ? 'Captured' : 'Omitted'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-aged-paper/80">4. Covenant Oath:</span>
                <span className={agreedToOath ? 'text-jade font-bold flex items-center gap-1' : 'text-vermilion font-bold flex items-center gap-1'}>
                  {agreedToOath ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {agreedToOath ? 'Confirmed' : 'Unchecked'}
                </span>
              </div>
            </div>

            <div className="my-6 flex justify-center">
              <div className="p-4 rounded-full bg-imperial-gold/10 border-2 border-imperial-gold/30 animate-pulse shadow-2xl">
                <Shield className="w-14 h-14 text-bright-gold" />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
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
                disabled={isSubmitting || isRegistryFull || !signatureData || !agreedToOath || !name.trim()}
                className="w-full sm:w-auto btn-vermilion px-10 py-4 rounded text-sm font-extrabold tracking-widest shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isSubmitting ? 'STAMPING RECORD...' : 'SEAL THE COVENANT'}</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
