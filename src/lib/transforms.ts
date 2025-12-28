// Transform database types to UI types
import type { DbEvent, Profile, DbVote, Comment } from "@/types/database"
import type { Event, User, Vote, TripleQuote } from "@/types"

/**
 * Transform database event to UI event format
 */
export function transformDbEventToEvent(dbEvent: DbEvent): Event {
  const quotes: TripleQuote = {
    market: {
      value: Number(dbEvent.market_quote),
      change: Number(dbEvent.market_quote_change),
      source: "market",
    },
    oracle: {
      value: Number(dbEvent.oracle_quote),
      change: Number(dbEvent.oracle_quote_change),
      source: "oracle",
    },
    crowd: {
      value: Number(dbEvent.crowd_quote),
      change: Number(dbEvent.crowd_quote_change),
      source: "crowd",
    },
  }

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    category: dbEvent.category,
    status: dbEvent.status === "draft" ? "upcoming" : dbEvent.status,
    imageUrl: dbEvent.image_url ?? undefined,
    endDate: dbEvent.end_date,
    createdAt: dbEvent.created_at,
    quotes,
    totalVolume: Number(dbEvent.total_volume),
    totalVotes: dbEvent.total_votes,
    yesVotes: dbEvent.yes_votes,
    noVotes: dbEvent.no_votes,
    tags: dbEvent.tags,
  }
}

/**
 * Transform database profile to UI user format
 */
export function transformProfileToUser(profile: Profile, email?: string): User {
  return {
    id: profile.id,
    email: email ?? "",
    username: profile.username,
    avatarUrl: profile.avatar_url ?? undefined,
    createdAt: profile.created_at,
    stats: {
      totalPredictions: profile.total_predictions,
      accuracy: Number(profile.accuracy_percentage),
      reputation: profile.reputation_score,
    },
  }
}

/**
 * Transform database vote to UI vote format
 */
export function transformDbVoteToVote(dbVote: DbVote): Vote {
  return {
    id: dbVote.id,
    userId: dbVote.user_id,
    eventId: dbVote.event_id,
    type: dbVote.vote,
    confidence: dbVote.confidence,
    createdAt: dbVote.created_at,
  }
}

/**
 * Format comment with user profile data
 */
export interface CommentWithProfile extends Comment {
  profile: Profile
}

export function formatCommentWithProfile(
  comment: Comment,
  profile: Profile
): CommentWithProfile {
  return {
    ...comment,
    profile,
  }
}
