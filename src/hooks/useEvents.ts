"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { transformDbEventToEvent } from "@/lib/transforms"
import type { Event, EventCategory, EventStatus } from "@/types"
import type { DbEvent } from "@/types/database"

interface UseEventsOptions {
  category?: EventCategory | "all"
  status?: EventStatus | "all"
  limit?: number
  search?: string
}

interface UseEventsReturn {
  events: Event[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  hasMore: boolean
  loadMore: () => Promise<void>
}

export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const { category = "all", status = "all", limit = 20, search = "" } = options
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const supabase = createClient()

  const fetchEvents = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    setIsLoading(true)
    setError(null)

    try {
      let query = supabase
        .from("events")
        .select("*")
        .neq("status", "draft")
        .order("created_at", { ascending: false })
        .range(pageNum * limit, (pageNum + 1) * limit - 1)

      if (category !== "all") {
        query = query.eq("category", category)
      }

      if (status !== "all") {
        query = query.eq("status", status)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      const transformedEvents = (data as DbEvent[]).map(transformDbEventToEvent)

      if (append) {
        setEvents((prev) => [...prev, ...transformedEvents])
      } else {
        setEvents(transformedEvents)
      }

      setHasMore(transformedEvents.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch events"))
    } finally {
      setIsLoading(false)
    }
  }, [supabase, category, status, limit, search])

  const refetch = useCallback(async () => {
    setPage(0)
    await fetchEvents(0, false)
  }, [fetchEvents])

  const loadMore = useCallback(async () => {
    const nextPage = page + 1
    setPage(nextPage)
    await fetchEvents(nextPage, true)
  }, [page, fetchEvents])

  useEffect(() => {
    fetchEvents(0, false)
  }, [fetchEvents])

  return {
    events,
    isLoading,
    error,
    refetch,
    hasMore,
    loadMore,
  }
}

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchEvent = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setEvent(transformDbEventToEvent(data as DbEvent))
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch event"))
    } finally {
      setIsLoading(false)
    }
  }, [supabase, eventId])

  useEffect(() => {
    if (eventId) {
      fetchEvent()
    }
  }, [eventId, fetchEvent])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!eventId) return

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "events",
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          setEvent(transformDbEventToEvent(payload.new as DbEvent))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, eventId])

  return { event, isLoading, error, refetch: fetchEvent }
}
