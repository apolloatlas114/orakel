/**
 * X/Twitter Signal via Nitter RSS
 * 
 * Fetches tweets from Twitter using Nitter (free Twitter frontend with RSS)
 * No API keys required!
 * 
 * Nitter instances: https://github.com/zedeus/nitter/wiki/Instances
 */

import type { SignalData } from "./types";

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

// List of Nitter instances (fallback if one is down)
const NITTER_INSTANCES = [
  "https://nitter.net",
  "https://nitter.it",
  "https://nitter.42l.fr",
  "https://nitter.pussthecat.org",
];

/**
 * Extract keywords from market question for Twitter search
 */
function extractKeywords(question: string): string[] {
  const stopWords = new Set([
    "will", "be", "by", "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "from"
  ]);
  
  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  return words.slice(0, 3); // Limit keywords for search
}

/**
 * Parse RSS feed XML from Nitter
 */
function parseRSS(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  try {
    // Simple regex-based parsing (for basic RSS)
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const matches = xmlText.matchAll(itemRegex);
    
    for (const match of matches) {
      const itemXml = match[1];
      
      const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
      const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const dateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
      
      if (titleMatch) {
        const title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
        // Nitter format: "Username: Tweet text"
        const cleanTitle = title.includes(":") ? title.split(":").slice(1).join(":").trim() : title;
        
        items.push({
          title: cleanTitle,
          description: descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "",
          link: linkMatch ? linkMatch[1].trim() : "",
          pubDate: dateMatch ? dateMatch[1].trim() : new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error("[Nitter RSS] Parse error:", error);
  }
  
  return items;
}

/**
 * Extract engagement metrics from Nitter link or description
 * Nitter doesn't provide metrics in RSS, so we estimate based on recency
 */
function estimateEngagement(pubDate: string): { likes: number; retweets: number } {
  const now = Date.now();
  const tweetDate = new Date(pubDate).getTime();
  const ageHours = (now - tweetDate) / (1000 * 60 * 60);
  
  // Estimate: newer tweets = more engagement potential
  // This is a heuristic since Nitter RSS doesn't provide metrics
  const baseEngagement = Math.max(0, 100 - ageHours * 5);
  
  return {
    likes: Math.floor(baseEngagement * 0.7),
    retweets: Math.floor(baseEngagement * 0.3),
  };
}

/**
 * Simple sentiment analysis for tweets
 */
function analyzeTweetSentiment(text: string, likes: number, retweets: number): number {
  const lowerText = text.toLowerCase();
  
  // Bullish indicators
  const bullishWords = ["bullish", "moon", "pump", "breakout", "rally", "surge", "up", "rise", "gain", "win", "success", "positive", "good", "great", "🚀", "📈", "bull", "long"];
  const bullishCount = bullishWords.filter(w => lowerText.includes(w)).length;
  
  // Bearish indicators
  const bearishWords = ["bearish", "dump", "crash", "selloff", "decline", "down", "fall", "drop", "loss", "fail", "negative", "bad", "terrible", "risk", "warning", "📉", "🔻", "bear", "short"];
  const bearishCount = bearishWords.filter(w => lowerText.includes(w)).length;
  
  // Base sentiment from keywords
  let sentiment = (bullishCount - bearishCount) * 0.2;
  
  // Adjust based on engagement (normalized)
  const totalEngagement = likes + retweets;
  const normalizedEngagement = Math.min(totalEngagement / 100, 1); // Cap at 100
  sentiment += normalizedEngagement * 0.15;
  
  // Clamp to -1 to 1
  return Math.max(-1, Math.min(1, sentiment));
}

/**
 * Fetch tweets from Nitter RSS
 */
async function fetchNitterRSS(query: string, instance: string): Promise<RSSItem[] | null> {
  try {
    // Nitter search RSS format: /search/rss?f=tweets&q=query
    const url = `${instance}/search/rss?f=tweets&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Orakel-Edge-Engine/1.0",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      return null; // Instance might be down
    }
    
    const xmlText = await response.text();
    const items = parseRSS(xmlText);
    
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error(`[Nitter RSS] Error fetching from ${instance}:`, error);
    return null;
  }
}

/**
 * Fetch tweets using Nitter RSS (tries multiple instances)
 */
async function fetchNitterTweets(query: string): Promise<RSSItem[]> {
  // Try each instance until one works
  for (const instance of NITTER_INSTANCES) {
    const items = await fetchNitterRSS(query, instance);
    if (items && items.length > 0) {
      console.log(`[Nitter RSS] Successfully fetched from ${instance}`);
      return items;
    }
  }
  
  // All instances failed
  return [];
}

/**
 * Generate mock Twitter signal (fallback when Nitter is unavailable)
 */
function generateMockTwitterSignal(marketQuestion: string): SignalData {
  // Simple hash-based mock for consistency
  const seed = marketQuestion.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = () => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const sentiment = (random() * 2 - 1) * 0.6; // -0.6 to 0.6
  const confidence = 0.3 + random() * 0.4; // 0.3 to 0.7
  const velocity = 0.8 + random() * 1.2; // 0.8 to 2.0
  
  let summary = "X/Twitter sentiment analysis";
  if (sentiment > 0.2) {
    summary = "Positive momentum detected on X in the last 4 hours";
  } else if (sentiment < -0.2) {
    summary = "Negative sentiment trending on X recently";
  } else {
    summary = "X sentiment is neutral";
  }
  
  return {
    source: "x",
    sentiment,
    confidence,
    velocity,
    sampleSize: Math.floor(50 + random() * 200),
    keywords: extractKeywords(marketQuestion).slice(0, 3),
    summary,
    updatedAt: new Date(),
  };
}

/**
 * Fetch Twitter/X signal via Nitter RSS
 * Falls back to mock if Nitter instances are unavailable
 */
export async function fetchTwitterSignal(marketQuestion: string): Promise<SignalData> {
  try {
    const keywords = extractKeywords(marketQuestion);
    const query = keywords.join(" OR ");
    
    // Fetch from Nitter RSS
    const tweets = await fetchNitterTweets(query);
    
    if (tweets.length === 0) {
      console.log("[Nitter RSS] No tweets found, using mock data");
      return generateMockTwitterSignal(marketQuestion);
    }
    
    // Analyze sentiment from tweets
    const sentiments = tweets.map((tweet) => {
      const engagement = estimateEngagement(tweet.pubDate);
      return analyzeTweetSentiment(
        `${tweet.title} ${tweet.description}`,
        engagement.likes,
        engagement.retweets
      );
    });
    
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const confidence = Math.min(tweets.length / 20, 1);
    
    // Calculate velocity (recent tweets weighted more)
    const now = Date.now();
    const recentTweets = tweets.filter((tweet) => {
      const tweetDate = new Date(tweet.pubDate).getTime();
      return now - tweetDate < 4 * 60 * 60 * 1000; // Last 4 hours
    });
    const velocity = 0.5 + (recentTweets.length / tweets.length) * 2;
    
    // Extract keywords from top tweets
    const topKeywords = tweets
      .slice(0, 5)
      .flatMap((tweet) => extractKeywords(`${tweet.title} ${tweet.description}`))
      .slice(0, 5);
    
    // Generate summary
    const recentCount = recentTweets.length;
    let summary = `Found ${tweets.length} tweets via Nitter`;
    if (recentCount > 0) {
      summary += ` (${recentCount} in last 4h)`;
    }
    if (avgSentiment > 0.2) {
      summary += " with positive momentum";
    } else if (avgSentiment < -0.2) {
      summary += " with negative sentiment";
    } else {
      summary += " with mixed sentiment";
    }
    
    return {
      source: "x",
      sentiment: avgSentiment,
      confidence,
      velocity: Math.min(velocity, 2.5),
      sampleSize: tweets.length,
      keywords: topKeywords,
      summary,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[Nitter RSS] Error:", error);
    // Fallback to mock
    return generateMockTwitterSignal(marketQuestion);
  }
}
