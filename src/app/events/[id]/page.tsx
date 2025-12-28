"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Clock,
  Users,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Brain,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TripleQuoteBar } from "@/components/events/TripleQuoteBar"
import { VoteWidget } from "@/components/events/VoteWidget"
import type { Event } from "@/types"

// Mock event data - in production this would come from API/Supabase
const mockEvent: Event = {
  id: "1",
  title: "Will Bitcoin exceed $150,000 by March 2025?",
  description: "Bitcoin has been on a strong uptrend throughout 2024, breaking multiple all-time highs. Market analysts are divided on whether it will reach the ambitious $150,000 target by the end of Q1 2025. Factors to consider include institutional adoption, macroeconomic conditions, and the upcoming halving cycle effects.",
  category: "crypto",
  status: "live",
  endDate: "2025-03-31T23:59:59Z",
  createdAt: "2024-12-01T00:00:00Z",
  quotes: {
    market: { value: 42.5, change: 2.3, source: "market" },
    oracle: { value: 38.2, change: -1.1, source: "oracle" },
    crowd: { value: 67.8, change: 5.2, source: "crowd" },
  },
  totalVolume: 2450000,
  totalVotes: 15234,
  yesVotes: 10234,
  noVotes: 5000,
  tags: ["bitcoin", "crypto", "price", "prediction"],
}

const relatedEvents: Event[] = [
  {
    id: "7",
    title: "Will Ethereum 2.0 fully launch before July 2025?",
    description: "The complete transition to proof-of-stake continues.",
    category: "crypto",
    status: "live",
    endDate: "2025-06-30T23:59:59Z",
    createdAt: "2024-11-20T00:00:00Z",
    quotes: {
      market: { value: 62.3, change: 3.5, source: "market" },
      oracle: { value: 58.7, change: 2.1, source: "oracle" },
      crowd: { value: 71.4, change: 4.2, source: "crowd" },
    },
    totalVolume: 2100000,
    totalVotes: 14523,
    yesVotes: 10367,
    noVotes: 4156,
    tags: ["ethereum", "crypto"],
  },
]

const priceHistory = [
  { date: "Dec 1", market: 38.2, oracle: 35.5, crowd: 58.1 },
  { date: "Dec 7", market: 39.8, oracle: 36.2, crowd: 60.5 },
  { date: "Dec 14", market: 41.2, oracle: 37.1, crowd: 64.2 },
  { date: "Dec 21", market: 40.5, oracle: 37.8, crowd: 66.3 },
  { date: "Dec 28", market: 42.5, oracle: 38.2, crowd: 67.8 },
]

const comments = [
  {
    id: "1",
    user: "CryptoWhale",
    avatar: "CW",
    content: "Based on historical halving cycles, I think this is very likely. The momentum is strong.",
    timestamp: "2 hours ago",
    likes: 24,
  },
  {
    id: "2",
    user: "TradingPro",
    avatar: "TP",
    content: "March seems ambitious. Maybe Q2 2025 is more realistic for $150k.",
    timestamp: "5 hours ago",
    likes: 18,
  },
  {
    id: "3",
    user: "DataAnalyst",
    avatar: "DA",
    content: "Oracle model seems conservative here. Market sentiment is very bullish.",
    timestamp: "1 day ago",
    likes: 42,
  },
]

function formatVolume(volume: number): string {
  if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`
  if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`
  return `$${volume}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getTimeRemaining(endDate: string): string {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff < 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 30) {
    const months = Math.floor(days / 30)
    return `${months} month${months > 1 ? "s" : ""} remaining`
  }
  if (days > 0) return `${days} days, ${hours} hours remaining`
  return `${hours} hours remaining`
}

export default function EventDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const event = mockEvent // In production, fetch based on params

  const handleVote = async (vote: "yes" | "no") => {
    // Handle vote submission to Supabase
    console.log("Voting:", vote)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link href="/events">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Events
              </Button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="live">LIVE</Badge>
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                          {event.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsBookmarked(!isBookmarked)}
                        >
                          <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <h1 className="text-3xl font-heading font-bold mb-4">{event.title}</h1>
                    <p className="text-muted-foreground mb-6">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {getTimeRemaining(event.endDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Ends {formatDate(event.endDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        {formatVolume(event.totalVolume)} volume
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {event.totalVotes.toLocaleString()} votes
                      </span>
                    </div>

                    {event.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs gap-1">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Triple Quote Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Triple-Quote Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TripleQuoteBar quotes={event.quotes} size="lg" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tabs Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="history">Price History</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis">
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                              <Brain className="w-5 h-5 text-primary" />
                              Oracle AI Analysis
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Based on historical price patterns, market sentiment analysis, and on-chain metrics, our Oracle AI model predicts a 38.2% probability of Bitcoin reaching $150,000 by March 2025. Key factors include institutional adoption rates, macroeconomic conditions, and the post-halving supply dynamics.
                            </p>
                          </div>

                          <Separator className="bg-white/5" />

                          <div>
                            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-blue-400" />
                              Market Consensus
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Aggregated data from major prediction markets shows a 42.5% implied probability. The market has been trending upward over the past week, with increased trading volume suggesting growing interest in this outcome.
                            </p>
                          </div>

                          <Separator className="bg-white/5" />

                          <div>
                            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                              <Users className="w-5 h-5 text-success" />
                              Crowd Sentiment
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Community voting shows strong bullish sentiment at 67.8%. This divergence from market and oracle predictions suggests retail optimism may be outpacing institutional sentiment.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history">
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Last 30 days</span>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-blue-400" />
                                Market
                              </span>
                              <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                Oracle
                              </span>
                              <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-success" />
                                Crowd
                              </span>
                            </div>
                          </div>

                          {/* Simple chart representation */}
                          <div className="h-48 flex items-end gap-2">
                            {priceHistory.map((point, i) => (
                              <div key={i} className="flex-1 flex flex-col gap-1">
                                <div className="flex-1 flex items-end gap-0.5">
                                  <div
                                    className="flex-1 bg-blue-400/50 rounded-t"
                                    style={{ height: `${point.market}%` }}
                                  />
                                  <div
                                    className="flex-1 bg-primary/50 rounded-t"
                                    style={{ height: `${point.oracle}%` }}
                                  />
                                  <div
                                    className="flex-1 bg-success/50 rounded-t"
                                    style={{ height: `${point.crowd}%` }}
                                  />
                                </div>
                                <span className="text-xs text-center text-muted-foreground">
                                  {point.date}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="comments">
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-white/5">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                                {comment.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{comment.user}</span>
                                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    Reply
                                  </Button>
                                  <span className="text-xs text-muted-foreground">{comment.likes} likes</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Vote Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="glass-card border-primary/30">
                  <CardHeader>
                    <CardTitle>Cast Your Vote</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VoteWidget
                      eventId={event.id}
                      yesVotes={event.yesVotes}
                      noVotes={event.noVotes}
                      onVote={handleVote}
                      size="lg"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Volume</span>
                      <span className="font-semibold">{formatVolume(event.totalVolume)}</span>
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Votes</span>
                      <span className="font-semibold">{event.totalVotes.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="font-semibold">{formatDate(event.createdAt)}</span>
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Resolution Date</span>
                      <span className="font-semibold">{formatDate(event.endDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Related Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-heading font-semibold mb-4">Related Events</h3>
                <div className="space-y-4">
                  {relatedEvents.map((relatedEvent) => (
                    <Link key={relatedEvent.id} href={`/events/${relatedEvent.id}`}>
                      <Card className="glass-card hover:border-white/20 transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <Badge variant="live" className="mb-2">LIVE</Badge>
                          <h4 className="font-medium text-sm line-clamp-2 mb-2">
                            {relatedEvent.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatVolume(relatedEvent.totalVolume)}</span>
                            <span>•</span>
                            <span>{relatedEvent.totalVotes.toLocaleString()} votes</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* External Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">External Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View on Polymarket
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View on Metaculus
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
