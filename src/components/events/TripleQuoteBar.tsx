"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, Brain, Users, BarChart3 } from "lucide-react"
import type { TripleQuote } from "@/types"
import { cn } from "@/lib/utils"

interface TripleQuoteBarProps {
  quotes: TripleQuote
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

const sourceConfig = {
  market: {
    label: "Market",
    icon: BarChart3,
    color: "bg-blue-500",
    textColor: "text-blue-400",
    description: "Aggregated market odds",
  },
  oracle: {
    label: "Oracle",
    icon: Brain,
    color: "bg-primary",
    textColor: "text-primary",
    description: "AI prediction model",
  },
  crowd: {
    label: "Crowd",
    icon: Users,
    color: "bg-success",
    textColor: "text-success",
    description: "Community consensus",
  },
}

function TrendIndicator({ change }: { change?: number }) {
  if (!change || change === 0) {
    return <Minus className="w-3 h-3 text-muted-foreground" />
  }
  if (change > 0) {
    return (
      <div className="flex items-center gap-0.5 text-success">
        <TrendingUp className="w-3 h-3" />
        <span className="text-xs">+{change.toFixed(1)}%</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-0.5 text-destructive">
      <TrendingDown className="w-3 h-3" />
      <span className="text-xs">{change.toFixed(1)}%</span>
    </div>
  )
}

export function TripleQuoteBar({
  quotes,
  showLabels = true,
  size = "md",
  animated = true,
}: TripleQuoteBarProps) {
  const sizeClasses = {
    sm: { bar: "h-2", text: "text-xs", gap: "gap-2" },
    md: { bar: "h-3", text: "text-sm", gap: "gap-3" },
    lg: { bar: "h-4", text: "text-base", gap: "gap-4" },
  }

  const sources = ["market", "oracle", "crowd"] as const

  return (
    <div className={cn("space-y-3", sizeClasses[size].gap)}>
      {sources.map((source) => {
        const config = sourceConfig[source]
        const quote = quotes[source]
        const Icon = config.icon

        return (
          <div key={source} className="space-y-1.5">
            {showLabels && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", config.textColor)} />
                  <span className={cn("font-medium", sizeClasses[size].text)}>
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("font-bold font-heading", config.textColor, sizeClasses[size].text)}>
                    {quote.value.toFixed(1)}%
                  </span>
                  <TrendIndicator change={quote.change} />
                </div>
              </div>
            )}
            <div className={cn("w-full bg-secondary/50 rounded-full overflow-hidden", sizeClasses[size].bar)}>
              <motion.div
                className={cn("h-full rounded-full", config.color)}
                initial={animated ? { width: 0 } : { width: `${quote.value}%` }}
                animate={{ width: `${quote.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Compact inline version for cards
export function TripleQuoteInline({ quotes }: { quotes: TripleQuote }) {
  const sources = ["market", "oracle", "crowd"] as const

  return (
    <div className="flex items-center gap-4">
      {sources.map((source) => {
        const config = sourceConfig[source]
        const quote = quotes[source]
        const Icon = config.icon

        return (
          <div key={source} className="flex items-center gap-1.5">
            <Icon className={cn("w-3.5 h-3.5", config.textColor)} />
            <span className={cn("text-sm font-semibold", config.textColor)}>
              {quote.value.toFixed(0)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}
