export type Prediction = {
  id: string;
  title: string;
  category: string;
  provider: "polymarket" | "kalshi";
  marketOddsBps: number; // 0..10000
  oracleProbBps: number; // 0..10000
  edgeBps: number;
  confidenceBps: number; // 0..10000
  status: "open" | "resolved";
  updatedAt: string;
  reasoning: string;
  signals: Array<{
    source: "polymarket" | "kalshi" | "x" | "reddit" | "rss";
    score: number; // -100..100
    summary: string;
  }>;
};

export const mockPredictions: Prediction[] = [
  {
    id: "demo-1",
    title: "Will the Fed cut rates before June 2026?",
    category: "Macro",
    provider: "kalshi",
    marketOddsBps: 4200,
    oracleProbBps: 5100,
    edgeBps: 900,
    confidenceBps: 7700,
    status: "open",
    updatedAt: new Date().toISOString(),
    reasoning:
      "Cooling inflation prints + weakening labor momentum raise the probability of a policy pivot. Orakel Core weights macro news momentum and market-volatility signals above baseline odds.",
    signals: [
      {
        source: "rss",
        score: 34,
        summary: "News momentum shifted dovish over the last 10 days.",
      },
      {
        source: "reddit",
        score: 18,
        summary: "Crowd narrative: higher recession risk, softer forward guidance.",
      },
      {
        source: "kalshi",
        score: 22,
        summary: "Order book drift favors YES; volatility elevated.",
      },
    ],
  },
  {
    id: "demo-2",
    title: "Will BTC close above $120k by 2026-01-01?",
    category: "Crypto",
    provider: "polymarket",
    marketOddsBps: 5800,
    oracleProbBps: 6350,
    edgeBps: 550,
    confidenceBps: 7100,
    status: "open",
    updatedAt: new Date().toISOString(),
    reasoning:
      "Orakel detects expanding risk-on cycles + strong ETF flow proxy + bullish social sentiment. The edge is modest but persistent across signal families.",
    signals: [
      { source: "x", score: 41, summary: "Sentiment uptrend; influencer cluster bullish." },
      { source: "rss", score: 27, summary: "Headline momentum positive; fewer risk-off spikes." },
      { source: "polymarket", score: 12, summary: "Odds stable; liquidity improving." },
    ],
  },
  {
    id: "demo-3",
    title: "Will SpaceX land Starship on Mars before 2030?",
    category: "Tech",
    provider: "polymarket",
    marketOddsBps: 2700,
    oracleProbBps: 1900,
    edgeBps: -800,
    confidenceBps: 8200,
    status: "open",
    updatedAt: new Date().toISOString(),
    reasoning:
      "Timeline risk remains high. Orakel penalizes schedule slippage signals and historical analogs. Recommendation: avoid or consider NO exposure if available.",
    signals: [
      { source: "rss", score: -22, summary: "Engineering schedule risk flagged in coverage." },
      { source: "reddit", score: -15, summary: "Community sentiment mixed; skepticism rising." },
      { source: "polymarket", score: 8, summary: "Market odds optimistic relative to model." },
    ],
  },
];


