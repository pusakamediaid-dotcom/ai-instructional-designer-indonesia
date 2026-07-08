import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  steps: { title: string; subtitle: string; icon?: React.ReactNode }[];
  onStepClick?: (index: number) => void;
}

export default function WizardProgress({ currentStep, steps, onStepClick }: WizardProgressProps) {
  return (
    <div id="wizard-progress-container" className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto">
        {/* Horizontal Workflow Flowchart */}
        <div className="hidden md:flex items-center justify-between overflow-x-auto py-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <React.Fragment key={idx}>
                <button
                  id={`wizard-step-btn-${idx}`}
                  disabled={!isCompleted && !isActive}
                  onClick={() => onStepClick && onStepClick(idx)}
                  className={`flex items-center gap-3 text-left focus:outline-hidden transition-all duration-200 ${
                    isCompleted || isActive ? 'cursor-pointer hover:translate-y-[-1px]' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#10B981] flex items-center justify-center font-bold shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : isActive ? (
                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all duration-300"
                        style={{ backgroundImage: 'linear-gradient(90deg, #2563EB, #4F46E5, #7C3AED)' }}
                      >
                        {idx + 1}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-slate-400 flex items-center justify-center font-semibold text-xs">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-[#2563EB]' : isCompleted ? 'text-[#111827]' : 'text-[#6B7280]'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[130px]">{step.subtitle}</p>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 mx-2 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile View Progress */}
        <div className="flex md:hidden items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-[#EEF2FF] text-[#2563EB] px-2.5 py-1 rounded-full">
              Langkah {currentStep + 1} dari {steps.length}
            </span>
            <span className="font-semibold text-sm text-[#111827] truncate max-w-[200px]">
              {steps[currentStep].title}
            </span>
          </div>
          <div className="w-24 bg-slate-100 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                backgroundImage: 'linear-gradient(90deg, #2563EB, #4F46E5, #7C3AED)'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
