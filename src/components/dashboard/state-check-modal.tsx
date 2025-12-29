"use client";

import { useState } from "react";
import type { UserState, EnergyLevel, MentalClarity, EmotionalPressure, UrgeToAct } from "@/app/dashboard/page";

interface StateCheckModalProps {
  onSubmit: (state: UserState) => void;
}

const energyOptions: { value: EnergyLevel; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const clarityOptions: { value: MentalClarity; label: string }[] = [
  { value: "distracted", label: "Distracted" },
  { value: "focused", label: "Focused" },
];

const pressureOptions: { value: EmotionalPressure; label: string }[] = [
  { value: "calm", label: "Calm" },
  { value: "impulsive", label: "Impulsive" },
];

const urgeOptions: { value: UrgeToAct; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
];

export function StateCheckModal({ onSubmit }: StateCheckModalProps) {
  const [step, setStep] = useState(0);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [clarity, setClarity] = useState<MentalClarity | null>(null);
  const [pressure, setPressure] = useState<EmotionalPressure | null>(null);
  const [urge, setUrge] = useState<UrgeToAct | null>(null);

  const questions = [
    { title: "Energy Level", subtitle: "How is your physical and mental energy right now?", options: energyOptions, value: energy, setValue: setEnergy },
    { title: "Mental Clarity", subtitle: "How clear is your thinking at this moment?", options: clarityOptions, value: clarity, setValue: setClarity },
    { title: "Emotional Pressure", subtitle: "Are you feeling emotionally neutral or reactive?", options: pressureOptions, value: pressure, setValue: setPressure },
    { title: "Urge to Act", subtitle: "How strong is your desire to make a decision right now?", options: urgeOptions, value: urge, setValue: setUrge },
  ];

  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;
  const canProceed = currentQuestion?.value !== null;

  const handleNext = () => {
    if (isLastStep && energy && clarity && pressure && urge) {
      onSubmit({ energy, clarity, pressure, urge, timestamp: new Date() });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--bg)]/95 backdrop-blur-xl" />
      
      {/* Grid Background */}
      <div className="pointer-events-none absolute inset-0 orakel-grid opacity-30" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-[var(--accent)]" : "bg-[var(--border)]"
              }`}
              style={{ boxShadow: i <= step ? "0 0 10px var(--glow)" : "none" }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="orakel-glow rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.25em] text-[var(--accent)] mb-3">
              STATE CHECK • {step + 1}/{questions.length}
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">
              {currentQuestion?.title}
            </h2>
            <p className="text-sm text-[var(--muted)]">
              {currentQuestion?.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion?.options.map((option) => (
              <button
                key={option.value}
                onClick={() => currentQuestion.setValue(option.value as never)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  currentQuestion.value === option.value
                    ? "bg-[var(--accent)]/10 border-[var(--accent)] text-white"
                    : "bg-[var(--panel-2)] border-[var(--border)] text-[var(--muted)] hover:bg-white/[0.04] hover:border-white/20"
                }`}
                style={{
                  boxShadow: currentQuestion.value === option.value ? "0 0 20px var(--glow-2)" : "none"
                }}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-2.5 bg-[var(--accent)] text-black rounded-xl font-semibold hover:brightness-110 disabled:bg-[var(--panel-2)] disabled:text-[var(--muted)] transition"
            >
              {isLastStep ? "Start Session" : "Continue"}
            </button>
          </div>

          {/* Timer */}
          <p className="text-center text-xs text-[var(--muted)] mt-6">
            Quick check • ~8 seconds
          </p>
        </div>

        {/* Branding */}
        <div className="text-center mt-6">
          <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">ORAKEL</div>
          <div className="text-sm font-semibold">
            <span className="text-white">EDGE</span>{" "}
            <span className="text-[var(--accent)]">ENGINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
