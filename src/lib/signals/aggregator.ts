/**
 * Signal Aggregator
 * 
 * Combines signals from X, Reddit, and News into aggregated signal
 */

import type { SignalData, AggregatedSignal } from "./types";
import { scoreToSentiment } from "./types";
import { fetchTwitterSignal } from "./twitter";
import { fetchRedditSignal } from "./reddit";
import { fetchNewsSignal } from "./news";

/**
 * Aggregate signals from all sources
 */
export async function aggregateSignals(marketQuestion: string): Promise<AggregatedSignal> {
  // Fetch signals from all sources in parallel
  const [xSignal, redditSignal, newsSignal] = await Promise.all([
    fetchTwitterSignal(marketQuestion),
    fetchRedditSignal(marketQuestion),
    fetchNewsSignal(marketQuestion),
  ]);
  
  const signals: SignalData[] = [xSignal, redditSignal, newsSignal];
  
  // Calculate overall score (weighted average)
  // News is most reliable (45%), then X (30%), then Reddit (25%)
  const weights = { x: 0.3, reddit: 0.25, news: 0.45 };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  
  const overallScore = signals.reduce((sum, s) => {
    const w = weights[s.source];
    // Weight by confidence: higher confidence = more weight
    return sum + s.sentiment * s.confidence * w;
  }, 0) / totalWeight;
  
  // Determine overall confidence
  const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
  const confidence = avgConfidence > 0.7 ? "high" : avgConfidence > 0.4 ? "moderate" : "low";
  
  // Generate reasons from signals
  const reasons = generateReasons(signals);
  
  return {
    overall: scoreToSentiment(overallScore),
    score: Math.round(overallScore * 100),
    confidence,
    signals,
    reasons,
  };
}

/**
 * Generate human-readable reasons from signals
 */
function generateReasons(signals: SignalData[]): string[] {
  const reasons: string[] = [];
  
  const x = signals.find(s => s.source === "x");
  const reddit = signals.find(s => s.source === "reddit");
  const news = signals.find(s => s.source === "news");
  
  // X/Twitter reasons
  if (x && x.sampleSize > 0) {
    if (x.sentiment > 0.2) {
      reasons.push("Positive momentum detected on X in the last 4 hours");
    } else if (x.sentiment < -0.2) {
      reasons.push("Negative sentiment trending on X recently");
    }
  }
  
  // Reddit reasons
  if (reddit && reddit.sampleSize > 0) {
    if (reddit.sentiment > 0.2) {
      reasons.push("Reddit discussions show optimism and interest");
    } else if (reddit.sentiment < -0.2) {
      reasons.push("Reddit discussions show uncertainty and concern");
    }
  }
  
  // News reasons
  if (news && news.sampleSize > 0) {
    if (news.sentiment > 0.2) {
      reasons.push("Recent news headlines are favorable");
    } else if (news.sentiment < -0.2) {
      reasons.push("Recent news headlines emphasize risks");
    }
  }
  
  // Fallback if no strong signals
  if (reasons.length === 0) {
    reasons.push("Sentiment is neutral across sources");
  }
  
  return reasons;
}

