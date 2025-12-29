"use client";

import { useState } from "react";
import type { UserState, EnergyLevel, MentalClarity, EmotionalPressure, UrgeToAct } from "@/app/dashboard/page";

interface StateCheckModalProps {
  onSubmit: (state: UserState) => void;
}

interface QuestionOption<T> {
  value: T;
  label: string;
}

const energyOptions: QuestionOption<EnergyLevel>[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const clarityOptions: QuestionOption<MentalClarity>[] = [
  { value: "distracted", label: "Distracted" },
  { value: "focused", label: "Focused" },
];

const pressureOptions: QuestionOption<EmotionalPressure>[] = [
  { value: "calm", label: "Calm" },
  { value: "impulsive", label: "Impulsive" },
];

const urgeOptions: QuestionOption<UrgeToAct>[] = [
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
    {
      title: "Energy Level",
      subtitle: "How is your physical and mental energy right now?",
      options: energyOptions,
      value: energy,
      setValue: setEnergy,
    },
    {
      title: "Mental Clarity",
      subtitle: "How clear is your thinking at this moment?",
      options: clarityOptions,
      value: clarity,
      setValue: setClarity,
    },
    {
      title: "Emotional Pressure",
      subtitle: "Are you feeling emotionally neutral or reactive?",
      options: pressureOptions,
      value: pressure,
      setValue: setPressure,
    },
    {
      title: "Urge to Act",
      subtitle: "How strong is your desire to make a decision right now?",
      options: urgeOptions,
      value: urge,
      setValue: setUrge,
    },
  ];

  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;
  const canProceed = currentQuestion?.value !== null;

  const handleNext = () => {
    if (isLastStep && energy && clarity && pressure && urge) {
      onSubmit({
        energy,
        clarity,
        pressure,
        urge,
        timestamp: new Date(),
      });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-violet-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-2">
              Current State Check
            </p>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentQuestion?.title}
            </h2>
            <p className="text-white/50">
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
                    ? "bg-violet-500/20 border-violet-500 text-white"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                }`}
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
              className="px-4 py-2 text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-white/10 disabled:text-white/30 rounded-lg font-medium transition-colors"
            >
              {isLastStep ? "Start Session" : "Continue"}
            </button>
          </div>

          {/* Timer hint */}
          <p className="text-center text-xs text-white/30 mt-6">
            Quick check • Takes about 8 seconds
          </p>
        </div>
      </div>
    </div>
  );
}

