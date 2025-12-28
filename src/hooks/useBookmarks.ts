"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface UseBookmarkReturn {
  isBookmarked: boolean
  isLoading: boolean
  toggleBookmark: () => Promise<void>
}

export function useBookmark(eventId: string): UseBookmarkReturn {
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  // Check if event is bookmarked on mount
  useEffect(() => {
    if (!user) {
      setIsBookmarked(false)
      return
    }

    const checkBookmark = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .single()

      setIsBookmarked(!!data)
    }

    checkBookmark()
  }, [supabase, eventId, user])

  const toggleBookmark = useCallback(async () => {
    if (!user) return

    setIsLoading(true)

    try {
      if (isBookmarked) {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", eventId)

        setIsBookmarked(false)
      } else {
        await supabase
          .from("bookmarks")
          .insert({
            user_id: user.id,
            event_id: eventId,
          })

        setIsBookmarked(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, eventId, user, isBookmarked])

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  }
}

export function useUserBookmarks() {
  const { user } = useAuth()
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setBookmarkedEventIds([])
      setIsLoading(false)
      return
    }

    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("event_id")
        .eq("user_id", user.id)

      if (data) {
        setBookmarkedEventIds(data.map((b) => b.event_id))
      }

      setIsLoading(false)
    }

    fetchBookmarks()
  }, [supabase, user])

  return { bookmarkedEventIds, isLoading }
}
