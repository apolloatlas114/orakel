/**
 * Reddit API Client
 * 
 * Fetches posts and comments from Reddit for sentiment analysis
 * Uses public Reddit JSON API (no auth required)
 */

import type { SignalData } from "./types";

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    score: number;
    num_comments: number;
    created_utc: number;
    subreddit: string;
    url: string;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

/**
 * Extract keywords from market question for Reddit search
 */
function extractKeywords(question: string): string[] {
  // Remove common words and extract key terms
  const stopWords = new Set([
    "will", "be", "by", "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "from"
  ]);
  
  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  return words.slice(0, 5); // Top 5 keywords
}

/**
 * Simple sentiment analysis based on keywords and score
 */
function analyzeSentiment(text: string, score: number, numComments: number): number {
  const lowerText = text.toLowerCase();
  
  // Bullish indicators
  const bullishWords = ["bullish", "moon", "pump", "breakout", "rally", "surge", "up", "rise", "gain", "win", "success", "positive", "good", "great", "excellent"];
  const bullishCount = bullishWords.filter(w => lowerText.includes(w)).length;
  
  // Bearish indicators
  const bearishWords = ["bearish", "dump", "crash", "selloff", "decline", "down", "fall", "drop", "loss", "fail", "negative", "bad", "terrible", "risk", "warning"];
  const bearishCount = bearishWords.filter(w => lowerText.includes(w)).length;
  
  // Base sentiment from keywords
  let sentiment = (bullishCount - bearishCount) * 0.15;
  
  // Adjust based on upvotes (normalized)
  const normalizedScore = Math.min(score / 100, 1); // Cap at 100 upvotes
  sentiment += normalizedScore * 0.2;
  
  // Adjust based on engagement (comments)
  const normalizedComments = Math.min(numComments / 50, 1); // Cap at 50 comments
  sentiment += normalizedComments * 0.1;
  
  // Clamp to -1 to 1
  return Math.max(-1, Math.min(1, sentiment));
}

/**
 * Fetch Reddit posts from specific subreddits (more reliable than search)
 */
async function fetchFromSubreddits(keywords: string[]): Promise<RedditPost["data"][]> {
  const relevantSubreddits = [
    "worldnews", "news", "politics", "economics", "business", "stocks", "cryptocurrency",
    "bitcoin", "ethereum", "investing", "wallstreetbets", "sports", "nfl", "nba"
  ];
  
  const query = keywords.slice(0, 2).join(" "); // Use top 2 keywords
  
  // Try multiple subreddits
  for (const subreddit of relevantSubreddits.slice(0, 5)) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=hot&limit=10&t=day`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
        next: { revalidate: 300 },
      });
      
      if (response.ok) {
        const data: RedditResponse = await response.json();
        const posts = data.data.children.map(p => p.data);
        if (posts.length > 0) {
          return posts;
        }
      }
    } catch {
      // Try next subreddit
      continue;
    }
  }
  
  return [];
}

/**
 * Fetch Reddit posts related to market question
 */
export async function fetchRedditSignal(marketQuestion: string): Promise<SignalData> {
  try {
    const keywords = extractKeywords(marketQuestion);
    
    // Strategy 1: Try subreddit search (more reliable)
    let posts = await fetchFromSubreddits(keywords);
    
    // Strategy 2: Fallback to general search if subreddit search fails
    if (posts.length === 0) {
      const query = keywords.slice(0, 3).join(" OR ");
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=hot&limit=25&t=day`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
        next: { revalidate: 300 },
      });
      
      if (response.ok) {
        const data: RedditResponse = await response.json();
        posts = data.data.children.map(p => p.data);
      } else {
        throw new Error(`Reddit API error: ${response.status}`);
      }
    }
    
    if (posts.length === 0) {
      // Fallback: try broader search
      return {
        source: "reddit",
        sentiment: 0,
        confidence: 0.1,
        velocity: 0.5,
        sampleSize: 0,
        keywords: [],
        summary: "No Reddit discussions found",
        updatedAt: new Date(),
      };
    }
    
    // Analyze sentiment from posts
    const sentiments = posts.map(p => analyzeSentiment(
      `${p.title} ${p.selftext}`,
      p.score,
      p.num_comments
    ));
    
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const confidence = Math.min(posts.length / 20, 1); // More posts = higher confidence
    const velocity = posts.reduce((sum, p) => sum + p.score + p.num_comments, 0) / posts.length / 10;
    
    // Extract keywords from top posts
    const topKeywords = posts
      .slice(0, 5)
      .flatMap(p => extractKeywords(`${p.title} ${p.selftext}`))
      .slice(0, 5);
    
    // Generate summary
    const avgScore = posts.reduce((sum, p) => sum + p.score, 0) / posts.length;
    const avgComments = posts.reduce((sum, p) => sum + p.num_comments, 0) / posts.length;
    
    let summary = `Found ${posts.length} Reddit posts`;
    if (avgSentiment > 0.2) {
      summary += " with positive sentiment";
    } else if (avgSentiment < -0.2) {
      summary += " with negative sentiment";
    } else {
      summary += " with mixed sentiment";
    }
    summary += ` (avg ${Math.round(avgScore)} upvotes, ${Math.round(avgComments)} comments)`;
    
    return {
      source: "reddit",
      sentiment: avgSentiment,
      confidence,
      velocity: Math.min(velocity, 2.5),
      sampleSize: posts.length,
      keywords: topKeywords,
      summary,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[Reddit Signal] Error:", error);
    // Return neutral signal on error
    return {
      source: "reddit",
      sentiment: 0,
      confidence: 0.1,
      velocity: 0.5,
      sampleSize: 0,
      keywords: [],
      summary: `Error fetching Reddit data: ${error instanceof Error ? error.message : "Unknown error"}`,
      updatedAt: new Date(),
    };
  }
}

