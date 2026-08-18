import React from 'react';
import { Check } from 'lucide-react';

interface AgreementProgressProps {
  currentStep: number;
  totalSteps?: number;
  stepTitles?: string[];
}

export default function AgreementProgress({
  currentStep,
  totalSteps = 5,
  stepTitles = [
    'Enter Name',
    'Signature',
    'Identity Seal',
    'Confirm Oath',
    'Seal Covenant',
  ],
}: AgreementProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10 px-2" aria-label="Ceremony progress steps">
      <div className="step-indicator">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Node */}
              <div className="flex flex-col items-center relative group">
                <div
                  className={`step-dot ${isCompleted ? 'completed' : ''} ${
                    isActive ? 'active ring-4 ring-imperial-gold/20' : ''
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-jade" />
                  ) : (
                    <span>{stepNumber.toString().padStart(2, '0')}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`absolute -bottom-6 font-cinzel text-[10px] sm:text-[11px] whitespace-nowrap tracking-wider font-semibold transition-colors duration-300 ${
                    isActive
                      ? 'text-bright-gold'
                      : isCompleted
                      ? 'text-jade'
                      : 'text-aged-paper/40'
                  }`}
                >
                  {stepTitles[index]}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {index < totalSteps - 1 && (
                <div
                  className={`step-line ${
                    stepNumber < currentStep ? 'completed' : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
