"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { StateCheckModal } from "@/components/dashboard/state-check-modal";
import { AIContextSignal } from "@/components/dashboard/ai-context-signal";
import { EdgeEngineCore } from "@/components/dashboard/edge-engine-core";
import { DecisionInput } from "@/components/dashboard/decision-input";
import { EdgeZones } from "@/components/dashboard/edge-zones";
import { DecisionHistory } from "@/components/dashboard/decision-history";
import { ConfidenceCalibration } from "@/components/dashboard/confidence-calibration";

export type EdgeStatus = "EDGE_FOUND" | "NO_EDGE" | "EDGE_NEGATIVE";
export type Mode = "markets" | "sports" | "politics";
export type EnergyLevel = "low" | "normal" | "high";
export type MentalClarity = "distracted" | "focused";
export type EmotionalPressure = "calm" | "impulsive";
export type UrgeToAct = "low" | "high";

export interface UserState {
  energy: EnergyLevel;
  clarity: MentalClarity;
  pressure: EmotionalPressure;
  urge: UrgeToAct;
  timestamp: Date;
}

export interface AISignal {
  signal: "BULLISH" | "SLIGHTLY_BULLISH" | "NEUTRAL" | "SLIGHTLY_BEARISH" | "BEARISH";
  confidence: "low" | "moderate" | "high";
  reasons: string[];
  sources: {
    x: { sentiment: number; velocity: number };
    reddit: { sentiment: number; topics: string[] };
    news: { sentiment: number; headlines: string[] };
  };
}

export interface EdgeZone {
  condition: string;
  impact: number; // positive or negative percentage
  description: string;
}

export interface Decision {
  id: string;
  context: string;
  expectedOutcome: string;
  confidence: number;
  state: UserState;
  edgeStatus: EdgeStatus;
  timestamp: Date;
  outcome?: "correct" | "incorrect";
  qualityScore?: number;
}

// Mock data for initial development
const mockAISignal: AISignal = {
  signal: "SLIGHTLY_BEARISH",
  confidence: "moderate",
  reasons: [
    "Increased negative sentiment detected on X within the last 4 hours",
    "Reddit discussions show rising uncertainty",
    "Recent news headlines emphasize downside risks",
  ],
  sources: {
    x: { sentiment: -0.23, velocity: 1.4 },
    reddit: { sentiment: -0.18, topics: ["volatility", "uncertainty", "correction"] },
    news: { sentiment: -0.31, headlines: ["Markets face headwinds", "Analysts warn of pullback"] },
  },
};

const mockPositiveZones: EdgeZone[] = [
  { condition: "Confidence 62–74%", impact: 18, description: "Sweet spot for your decision accuracy" },
  { condition: "Focused state", impact: 11, description: "Mental clarity improves outcomes" },
  { condition: "Low urge to act", impact: 8, description: "Patience correlates with better decisions" },
];

const mockNegativeZones: EdgeZone[] = [
  { condition: "Confidence above 85%", impact: -23, description: "Overconfidence reduces accuracy" },
  { condition: "Impulsive state", impact: -19, description: "Emotional pressure hurts decisions" },
  { condition: "High urge to act", impact: -14, description: "FOMO correlates with poor outcomes" },
];

const mockDecisions: Decision[] = [
  {
    id: "1",
    context: "Tech sector momentum",
    expectedOutcome: "Continued uptrend",
    confidence: 78,
    state: { energy: "normal", clarity: "focused", pressure: "calm", urge: "low", timestamp: new Date(Date.now() - 86400000) },
    edgeStatus: "EDGE_FOUND",
    timestamp: new Date(Date.now() - 86400000),
    outcome: "correct",
    qualityScore: 82,
  },
  {
    id: "2",
    context: "Earnings play",
    expectedOutcome: "Beat expectations",
    confidence: 91,
    state: { energy: "high", clarity: "distracted", pressure: "impulsive", urge: "high", timestamp: new Date(Date.now() - 172800000) },
    edgeStatus: "EDGE_NEGATIVE",
    timestamp: new Date(Date.now() - 172800000),
    outcome: "incorrect",
    qualityScore: 34,
  },
];

export default function DashboardPage() {
  const [mode, setMode] = useState<Mode>("markets");
  const [showStateCheck, setShowStateCheck] = useState(true);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [edgeStatus, setEdgeStatus] = useState<EdgeStatus>("NO_EDGE");
  const [stateImpact, setStateImpact] = useState<string | null>(null);

  // Calculate edge status based on user state
  useEffect(() => {
    if (!userState) return;

    let score = 0;
    
    // Energy impact
    if (userState.energy === "normal") score += 1;
    if (userState.energy === "low") score -= 1;
    
    // Clarity impact
    if (userState.clarity === "focused") score += 2;
    if (userState.clarity === "distracted") score -= 2;
    
    // Pressure impact
    if (userState.pressure === "calm") score += 1;
    if (userState.pressure === "impulsive") score -= 2;
    
    // Urge impact
    if (userState.urge === "low") score += 1;
    if (userState.urge === "high") score -= 2;

    if (score >= 3) {
      setEdgeStatus("EDGE_FOUND");
      setStateImpact("No negative state impact detected.");
    } else if (score <= -2) {
      setEdgeStatus("EDGE_NEGATIVE");
      setStateImpact("In this state, your historical accuracy decreases by 21%.");
    } else {
      setEdgeStatus("NO_EDGE");
      setStateImpact("No statistically meaningful edge detected for you at this time.");
    }
  }, [userState]);

  const handleStateSubmit = (state: UserState) => {
    setUserState(state);
    setShowStateCheck(false);
  };

  const handleLogDecision = (decision: Omit<Decision, "id" | "state" | "edgeStatus" | "timestamp">) => {
    // In real app, this would save to DB
    console.log("Decision logged:", decision);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* State Check Modal - mandatory on login */}
      {showStateCheck && (
        <StateCheckModal onSubmit={handleStateSubmit} />
      )}

      {/* Main Dashboard */}
      <div className={showStateCheck ? "blur-sm pointer-events-none" : ""}>
        {/* Global Header */}
        <DashboardHeader
          edgeStatus={edgeStatus}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Top Row: AI Signal + Edge Core */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIContextSignal signal={mockAISignal} />
            <EdgeEngineCore
              edgeStatus={edgeStatus}
              userState={userState}
              stateImpact={stateImpact}
            />
          </div>

          {/* Middle Row: Decision Input + Confidence Calibration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DecisionInput
              onSubmit={handleLogDecision}
              userState={userState}
              edgeStatus={edgeStatus}
            />
            <ConfidenceCalibration
              userConfidence={78}
              historicalAccuracy={57}
            />
          </div>

          {/* Edge Zones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EdgeZones
              title="Positive Edge Zones"
              zones={mockPositiveZones}
              type="positive"
            />
            <EdgeZones
              title="Negative Edge Zones"
              zones={mockNegativeZones}
              type="negative"
            />
          </div>

          {/* Decision History */}
          <DecisionHistory decisions={mockDecisions} />
        </main>
      </div>
    </div>
  );
}

