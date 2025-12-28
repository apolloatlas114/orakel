export type EventStatus = "live" | "upcoming" | "closed" | "resolved"
export type EventCategory = "sports" | "politics" | "crypto" | "entertainment" | "science" | "other"
export type VoteType = "yes" | "no"

export interface Quote {
  value: number // Probability 0-100
  change?: number // Change from previous period
  source: "market" | "oracle" | "crowd"
}

export interface TripleQuote {
  market: Quote
  oracle: Quote
  crowd: Quote
}

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  status: EventStatus
  imageUrl?: string
  endDate: string
  createdAt: string
  quotes: TripleQuote
  totalVolume: number
  totalVotes: number
  yesVotes: number
  noVotes: number
  tags?: string[]
}

export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  createdAt: string
  stats: {
    totalPredictions: number
    accuracy: number
    reputation: number
  }
}

export interface Vote {
  id: string
  userId: string
  eventId: string
  type: VoteType
  confidence: number // 1-100
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "prediction" | "event" | "system"
  read: boolean
  createdAt: string
}
