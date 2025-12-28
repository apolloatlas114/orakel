"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoteWidgetProps {
  eventId: string
  yesVotes: number
  noVotes: number
  userVote?: "yes" | "no" | null
  onVote?: (vote: "yes" | "no") => Promise<void>
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

export function VoteWidget({
  eventId,
  yesVotes,
  noVotes,
  userVote,
  onVote,
  disabled = false,
  size = "md",
}: VoteWidgetProps) {
  const [isLoading, setIsLoading] = useState<"yes" | "no" | null>(null)
  const [currentVote, setCurrentVote] = useState(userVote)

  const totalVotes = yesVotes + noVotes
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 50
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 50

  const handleVote = async (vote: "yes" | "no") => {
    if (disabled || isLoading) return

    setIsLoading(vote)
    try {
      await onVote?.(vote)
      setCurrentVote(vote)
    } catch (error) {
      console.error("Vote failed:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const sizeClasses = {
    sm: { button: "h-9 px-3 text-xs", progress: "h-1.5", text: "text-xs" },
    md: { button: "h-11 px-4 text-sm", progress: "h-2", text: "text-sm" },
    lg: { button: "h-14 px-6 text-base", progress: "h-3", text: "text-base" },
  }

  return (
    <div className="space-y-4">
      {/* Vote Buttons */}
      <div className="flex gap-3">
        <Button
          variant={currentVote === "yes" ? "success" : "outline"}
          className={cn(
            "flex-1 gap-2 relative overflow-hidden",
            sizeClasses[size].button,
            currentVote === "yes" && "ring-2 ring-success ring-offset-2 ring-offset-background"
          )}
          onClick={() => handleVote("yes")}
          disabled={disabled || isLoading !== null}
        >
          {isLoading === "yes" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ThumbsUp className="w-4 h-4" />
          )}
          <span className="font-semibold">Yes</span>
          {currentVote === "yes" && (
            <motion.div
              layoutId={`vote-indicator-${eventId}`}
              className="absolute inset-0 bg-success/20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </Button>

        <Button
          variant={currentVote === "no" ? "destructive" : "outline"}
          className={cn(
            "flex-1 gap-2 relative overflow-hidden",
            sizeClasses[size].button,
            currentVote === "no" && "ring-2 ring-destructive ring-offset-2 ring-offset-background"
          )}
          onClick={() => handleVote("no")}
          disabled={disabled || isLoading !== null}
        >
          {isLoading === "no" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ThumbsDown className="w-4 h-4" />
          )}
          <span className="font-semibold">No</span>
          {currentVote === "no" && (
            <motion.div
              layoutId={`vote-indicator-${eventId}`}
              className="absolute inset-0 bg-destructive/20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </Button>
      </div>

      {/* Vote Distribution */}
      <div className="space-y-2">
        <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-success"
            initial={{ width: 0 }}
            animate={{ width: `${yesPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.div
            className="h-full bg-destructive"
            initial={{ width: 0 }}
            animate={{ width: `${noPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className={cn("text-muted-foreground", sizeClasses[size].text)}>
              Yes: <span className="text-success font-semibold">{yesPercentage.toFixed(1)}%</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-muted-foreground", sizeClasses[size].text)}>
              No: <span className="text-destructive font-semibold">{noPercentage.toFixed(1)}%</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-destructive" />
          </div>
        </div>

        <p className={cn("text-center text-muted-foreground", sizeClasses[size].text)}>
          {totalVotes.toLocaleString()} total votes
        </p>
      </div>
    </div>
  )
}
