/**
 * News RSS Feed Client
 * 
 * Fetches news articles from RSS feeds for sentiment analysis
 */

import type { SignalData } from "./types";

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

/**
 * Parse RSS feed XML
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
        items.push({
          title: titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
          description: descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "",
          link: linkMatch ? linkMatch[1].trim() : "",
          pubDate: dateMatch ? dateMatch[1].trim() : new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error("[News RSS] Parse error:", error);
  }
  
  return items;
}

/**
 * Simple sentiment analysis for news headlines
 */
function analyzeNewsSentiment(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  
  // Bullish indicators
  const bullishWords = ["surge", "rally", "gain", "rise", "up", "breakthrough", "success", "growth", "positive", "optimistic", "bullish", "win", "victory", "record", "high"];
  const bullishCount = bullishWords.filter(w => text.includes(w)).length;
  
  // Bearish indicators
  const bearishWords = ["crash", "fall", "drop", "decline", "down", "loss", "failure", "negative", "pessimistic", "bearish", "risk", "warning", "concern", "crisis", "low"];
  const bearishCount = bearishWords.filter(w => text.includes(w)).length;
  
  // Calculate sentiment
  const totalWords = bullishCount + bearishCount;
  if (totalWords === 0) return 0;
  
  return (bullishCount - bearishCount) / Math.max(totalWords, 1);
}

/**
 * Extract keywords from market question for news search
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
  
  return words.slice(0, 5);
}

/**
 * Fetch news from RSS feeds
 * Uses Google News RSS (public, no auth)
 */
export async function fetchNewsSignal(marketQuestion: string): Promise<SignalData> {
  try {
    const keywords = extractKeywords(marketQuestion);
    const query = keywords.join("+");
    
    // Use Google News RSS (public, no auth needed)
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Orakel-Edge-Engine/1.0",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`News RSS error: ${response.status}`);
    }
    
    const xmlText = await response.text();
    const items = parseRSS(xmlText).slice(0, 20); // Top 20 articles
    
    if (items.length === 0) {
      return {
        source: "news",
        sentiment: 0,
        confidence: 0.1,
        velocity: 0.5,
        sampleSize: 0,
        keywords: [],
        summary: "No news articles found",
        updatedAt: new Date(),
      };
    }
    
    // Analyze sentiment from articles
    const sentiments = items.map(item => analyzeNewsSentiment(item.title, item.description));
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const confidence = Math.min(items.length / 15, 1); // More articles = higher confidence
    
    // Calculate velocity (recent articles weighted more)
    const now = Date.now();
    const recentItems = items.filter(item => {
      const pubDate = new Date(item.pubDate).getTime();
      return now - pubDate < 24 * 60 * 60 * 1000; // Last 24 hours
    });
    const velocity = 0.5 + (recentItems.length / items.length) * 2; // 0.5 to 2.5
    
    // Extract keywords from top articles
    const topKeywords = items
      .slice(0, 5)
      .flatMap(item => extractKeywords(`${item.title} ${item.description}`))
      .slice(0, 5);
    
    // Generate summary
    const recentCount = recentItems.length;
    let summary = `Found ${items.length} news articles`;
    if (recentCount > 0) {
      summary += ` (${recentCount} in last 24h)`;
    }
    if (avgSentiment > 0.2) {
      summary += " with favorable headlines";
    } else if (avgSentiment < -0.2) {
      summary += " with negative headlines";
    } else {
      summary += " with mixed headlines";
    }
    
    return {
      source: "news",
      sentiment: avgSentiment,
      confidence,
      velocity: Math.min(velocity, 2.5),
      sampleSize: items.length,
      keywords: topKeywords,
      summary,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[News Signal] Error:", error);
    return {
      source: "news",
      sentiment: 0,
      confidence: 0.1,
      velocity: 0.5,
      sampleSize: 0,
      keywords: [],
      summary: `Error fetching news data: ${error instanceof Error ? error.message : "Unknown error"}`,
      updatedAt: new Date(),
    };
  }
}

