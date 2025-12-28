"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import type { VoteType } from "@/types"

interface UseVoteReturn {
  userVote: VoteType | null
  isLoading: boolean
  error: Error | null
  vote: (voteType: VoteType, confidence?: number) => Promise<void>
  removeVote: () => Promise<void>
}

export function useVote(eventId: string): UseVoteReturn {
  const { user } = useAuth()
  const [userVote, setUserVote] = useState<VoteType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  // Fetch user's existing vote on mount
  const fetchUserVote = useCallback(async () => {
    if (!user) return

    try {
      const { data, error: fetchError } = await supabase
        .from("votes")
        .select("vote")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = no rows returned
        throw new Error(fetchError.message)
      }

      if (data) {
        setUserVote(data.vote as VoteType)
      }
    } catch (err) {
      console.error("Error fetching user vote:", err)
    }
  }, [supabase, eventId, user])

  // Call fetchUserVote when user changes
  useState(() => {
    fetchUserVote()
  })

  const vote = useCallback(async (voteType: VoteType, confidence: number = 50) => {
    if (!user) {
      setError(new Error("You must be logged in to vote"))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: voteError } = await supabase
        .from("votes")
        .upsert({
          user_id: user.id,
          event_id: eventId,
          vote: voteType,
          confidence,
        }, {
          onConflict: "user_id,event_id",
        })

      if (voteError) {
        throw new Error(voteError.message)
      }

      setUserVote(voteType)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to submit vote"))
    } finally {
      setIsLoading(false)
    }
  }, [supabase, eventId, user])

  const removeVote = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      setUserVote(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to remove vote"))
    } finally {
      setIsLoading(false)
    }
  }, [supabase, eventId, user])

  return {
    userVote,
    isLoading,
    error,
    vote,
    removeVote,
  }
}
