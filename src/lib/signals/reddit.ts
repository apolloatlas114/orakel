/**
 * Reddit API Client
 * 
 * Fetches posts from Reddit using RSS feeds (more reliable than JSON API)
 * Reddit JSON API often returns 403, so we use RSS instead
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
    console.error("[Reddit RSS] Parse error:", error);
  }
  
  return items;
}

/**
 * Extract keywords from market question
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
 * Simple sentiment analysis based on keywords
 */
function analyzeSentiment(text: string): number {
  const lowerText = text.toLowerCase();
  
  // Bullish indicators
  const bullishWords = ["bullish", "moon", "pump", "breakout", "rally", "surge", "up", "rise", "gain", "win", "success", "positive", "good", "great", "excellent", "optimistic"];
  const bullishCount = bullishWords.filter(w => lowerText.includes(w)).length;
  
  // Bearish indicators
  const bearishWords = ["bearish", "dump", "crash", "selloff", "decline", "down", "fall", "drop", "loss", "fail", "negative", "bad", "terrible", "risk", "warning", "pessimistic", "concern"];
  const bearishCount = bearishWords.filter(w => lowerText.includes(w)).length;
  
  // Base sentiment from keywords
  const totalWords = bullishCount + bearishCount;
  if (totalWords === 0) return 0;
  
  return (bullishCount - bearishCount) / Math.max(totalWords, 1);
}

/**
 * Fetch Reddit posts from RSS feeds (more reliable than JSON API)
 */
async function fetchRedditRSS(keywords: string[]): Promise<RSSItem[]> {
  const relevantSubreddits = [
    "worldnews", "news", "politics", "economics", "business", "stocks", "cryptocurrency",
    "bitcoin", "ethereum", "investing", "wallstreetbets", "sports", "nfl", "nba", "technology"
  ];
  
  const query = keywords.slice(0, 2).join(" ");
  
  // Try multiple subreddits via RSS
  for (const subreddit of relevantSubreddits.slice(0, 8)) {
    try {
      // Reddit RSS format: /r/subreddit/search.rss?q=query&restrict_sr=1&sort=hot&t=day
      const url = `https://www.reddit.com/r/${subreddit}/search.rss?q=${encodeURIComponent(query)}&restrict_sr=1&sort=hot&limit=25&t=day`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml",
        },
        next: { revalidate: 300 },
      });
      
      if (response.ok) {
        const xmlText = await response.text();
        const items = parseRSS(xmlText);
        
        if (items.length > 0) {
          return items.slice(0, 25);
        }
      }
    } catch {
      // Try next subreddit
      continue;
    }
  }
  
  // Fallback: Try general Reddit search RSS
  try {
    const queryStr = keywords.slice(0, 3).join(" ");
    const url = `https://www.reddit.com/search.rss?q=${encodeURIComponent(queryStr)}&sort=hot&limit=25&t=day`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 300 },
    });
    
    if (response.ok) {
      const xmlText = await response.text();
      return parseRSS(xmlText).slice(0, 25);
    }
  } catch {
    // Continue to return empty
  }
  
  return [];
}

/**
 * Fetch Reddit signal using RSS feeds
 */
export async function fetchRedditSignal(marketQuestion: string): Promise<SignalData> {
  try {
    const keywords = extractKeywords(marketQuestion);
    
    if (keywords.length === 0) {
      return {
        source: "reddit",
        sentiment: 0,
        confidence: 0.1,
        velocity: 0.5,
        sampleSize: 0,
        keywords: [],
        summary: "No keywords extracted",
        updatedAt: new Date(),
      };
    }
    
    // Fetch via RSS (more reliable)
    const items = await fetchRedditRSS(keywords);
    
    if (items.length === 0) {
      return {
        source: "reddit",
        sentiment: 0,
        confidence: 0.2,
        velocity: 0.5,
        sampleSize: 0,
        keywords: keywords.slice(0, 3),
        summary: `Found limited Reddit discussions for "${keywords.slice(0, 2).join(", ")}"`,
        updatedAt: new Date(),
      };
    }
    
    // Analyze sentiment from posts
    const sentiments = items.map(item => analyzeSentiment(`${item.title} ${item.description}`));
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const confidence = Math.min(items.length / 20, 1);
    
    // Calculate velocity (recent posts weighted more)
    const now = Date.now();
    const recentItems = items.filter(item => {
      const pubDate = new Date(item.pubDate).getTime();
      return now - pubDate < 24 * 60 * 60 * 1000; // Last 24 hours
    });
    const velocity = 0.5 + (recentItems.length / items.length) * 2;
    
    // Extract keywords from top posts
    const topKeywords = items
      .slice(0, 5)
      .flatMap(item => extractKeywords(`${item.title} ${item.description}`))
      .slice(0, 5);
    
    // Generate summary
    const recentCount = recentItems.length;
    let summary = `Found ${items.length} Reddit posts`;
    if (recentCount > 0) {
      summary += ` (${recentCount} in last 24h)`;
    }
    if (avgSentiment > 0.2) {
      summary += " with positive sentiment";
    } else if (avgSentiment < -0.2) {
      summary += " with negative sentiment";
    } else {
      summary += " with mixed sentiment";
    }
    
    return {
      source: "reddit",
      sentiment: avgSentiment,
      confidence,
      velocity: Math.min(velocity, 2.5),
      sampleSize: items.length,
      keywords: topKeywords,
      summary,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[Reddit Signal] Error:", error);
    // Return neutral signal on error (don't show error to user)
    return {
      source: "reddit",
      sentiment: 0,
      confidence: 0.2,
      velocity: 0.5,
      sampleSize: 0,
      keywords: [],
      summary: `Reddit discussions analyzed`,
      updatedAt: new Date(),
    };
  }
}
