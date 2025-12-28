"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, Users, TrendingUp, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TripleQuoteBar, TripleQuoteInline } from "./TripleQuoteBar"
import type { Event } from "@/types"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: Event
  variant?: "default" | "compact" | "featured"
  showVoteButton?: boolean
}

const statusConfig = {
  live: { label: "LIVE", variant: "live" as const },
  upcoming: { label: "Upcoming", variant: "secondary" as const },
  closed: { label: "Closed", variant: "outline" as const },
  resolved: { label: "Resolved", variant: "success" as const },
}

const categoryColors: Record<string, string> = {
  sports: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  politics: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  crypto: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  entertainment: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  science: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

function formatTimeRemaining(endDate: string): string {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff < 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h left`

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${minutes}m left`
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`
  return `$${volume}`
}

export function EventCard({ event, variant = "default", showVoteButton = true }: EventCardProps) {
  const status = statusConfig[event.status]
  const categoryClass = categoryColors[event.category] || categoryColors.other

  if (variant === "compact") {
    return (
      <Link href={`/events/${event.id}`}>
        <Card className="glass-card hover:border-white/20 transition-all group cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={status.variant} className="text-xs">
                    {status.label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs border", categoryClass)}>
                    {event.category}
                  </Badge>
                </div>
                <h3 className="font-heading font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeRemaining(event.endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.totalVotes.toLocaleString()}
                  </span>
                </div>
              </div>
              <TripleQuoteInline quotes={event.quotes} />
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-primary/30 overflow-hidden group">
          {event.imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </div>
          )}
          <CardHeader className={!event.imageUrl ? "pb-2" : "pt-0 pb-2"}>
            <div className="flex items-center gap-2 mb-2">
              {!event.imageUrl && <Badge variant={status.variant}>{status.label}</Badge>}
              <Badge variant="outline" className={cn("border", categoryClass)}>
                {event.category}
              </Badge>
            </div>
            <Link href={`/events/${event.id}`}>
              <h3 className="font-heading text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
                {event.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <TripleQuoteBar quotes={event.quotes} size="md" />

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatTimeRemaining(event.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {formatVolume(event.totalVolume)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {event.totalVotes.toLocaleString()} votes
                </span>
              </div>
              {showVoteButton && (
                <Link href={`/events/${event.id}`}>
                  <Button size="sm" className="gap-2">
                    Vote Now
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-card hover:border-white/20 transition-all group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={status.variant}>{status.label}</Badge>
              <Badge variant="outline" className={cn("border", categoryClass)}>
                {event.category}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeRemaining(event.endDate)}
            </span>
          </div>
          <Link href={`/events/${event.id}`}>
            <h3 className="font-heading text-lg font-semibold hover:text-primary transition-colors cursor-pointer line-clamp-2">
              {event.title}
            </h3>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          <TripleQuoteBar quotes={event.quotes} size="sm" />

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {formatVolume(event.totalVolume)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {event.totalVotes.toLocaleString()}
              </span>
            </div>
            {showVoteButton && (
              <Link href={`/events/${event.id}`}>
                <Button size="sm" variant="ghost" className="gap-1 text-xs h-8">
                  Vote
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
