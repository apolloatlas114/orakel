"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Clock,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/events/EventCard"
import type { Event, EventCategory, EventStatus } from "@/types"

// Mock data for events
const allEvents: Event[] = [
  {
    id: "1",
    title: "Will Bitcoin exceed $150,000 by March 2025?",
    description: "Bitcoin has been on a strong uptrend. Market analysts are divided on whether it will reach new all-time highs.",
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
    tags: ["bitcoin", "crypto", "price"],
  },
  {
    id: "2",
    title: "Will SpaceX successfully land Starship on Mars before 2030?",
    description: "SpaceX has ambitious plans for Mars colonization. Can they achieve the first successful landing?",
    category: "science",
    status: "live",
    endDate: "2029-12-31T23:59:59Z",
    createdAt: "2024-11-15T00:00:00Z",
    quotes: {
      market: { value: 28.5, change: 0.8, source: "market" },
      oracle: { value: 35.1, change: 2.4, source: "oracle" },
      crowd: { value: 52.3, change: -0.5, source: "crowd" },
    },
    totalVolume: 890000,
    totalVotes: 8721,
    yesVotes: 4532,
    noVotes: 4189,
    tags: ["spacex", "mars", "space"],
  },
  {
    id: "3",
    title: "Will AI pass the Turing Test convincingly by 2026?",
    description: "With rapid advances in language models, will AI achieve human-level conversational ability?",
    category: "science",
    status: "upcoming",
    endDate: "2026-12-31T23:59:59Z",
    createdAt: "2024-12-15T00:00:00Z",
    quotes: {
      market: { value: 75.2, change: 3.1, source: "market" },
      oracle: { value: 82.4, change: 1.8, source: "oracle" },
      crowd: { value: 71.9, change: 2.2, source: "crowd" },
    },
    totalVolume: 1230000,
    totalVotes: 11456,
    yesVotes: 8234,
    noVotes: 3222,
    tags: ["ai", "turing", "technology"],
  },
  {
    id: "4",
    title: "Will the next US President be a Democrat?",
    description: "The 2028 presidential election is approaching. Political analysts weigh in on the likely outcome.",
    category: "politics",
    status: "upcoming",
    endDate: "2028-11-05T23:59:59Z",
    createdAt: "2024-12-10T00:00:00Z",
    quotes: {
      market: { value: 48.2, change: -0.5, source: "market" },
      oracle: { value: 51.3, change: 1.2, source: "oracle" },
      crowd: { value: 45.8, change: -2.1, source: "crowd" },
    },
    totalVolume: 4500000,
    totalVotes: 25678,
    yesVotes: 11782,
    noVotes: 13896,
    tags: ["politics", "usa", "election"],
  },
  {
    id: "5",
    title: "Will Manchester City win the Premier League 2024/25?",
    description: "The reigning champions face stiff competition. Can they secure another title?",
    category: "sports",
    status: "live",
    endDate: "2025-05-25T23:59:59Z",
    createdAt: "2024-08-01T00:00:00Z",
    quotes: {
      market: { value: 35.5, change: -2.3, source: "market" },
      oracle: { value: 32.1, change: -1.5, source: "oracle" },
      crowd: { value: 41.2, change: 0.8, source: "crowd" },
    },
    totalVolume: 3200000,
    totalVotes: 19234,
    yesVotes: 7890,
    noVotes: 11344,
    tags: ["football", "premier-league", "mancity"],
  },
  {
    id: "6",
    title: "Will Taylor Swift announce a new album in 2025?",
    description: "After the Eras Tour success, fans speculate about new music.",
    category: "entertainment",
    status: "live",
    endDate: "2025-12-31T23:59:59Z",
    createdAt: "2024-12-05T00:00:00Z",
    quotes: {
      market: { value: 88.5, change: 1.2, source: "market" },
      oracle: { value: 91.2, change: 0.8, source: "oracle" },
      crowd: { value: 95.3, change: 0.5, source: "crowd" },
    },
    totalVolume: 1850000,
    totalVotes: 32156,
    yesVotes: 30548,
    noVotes: 1608,
    tags: ["music", "taylor-swift", "entertainment"],
  },
  {
    id: "7",
    title: "Will Ethereum 2.0 fully launch before July 2025?",
    description: "The complete transition to proof-of-stake continues. Will all phases complete on time?",
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
    tags: ["ethereum", "crypto", "blockchain"],
  },
  {
    id: "8",
    title: "Will there be a major breakthrough in nuclear fusion by 2027?",
    description: "Scientists are getting closer to achieving net energy gain. Will we see commercial viability soon?",
    category: "science",
    status: "upcoming",
    endDate: "2027-12-31T23:59:59Z",
    createdAt: "2024-12-12T00:00:00Z",
    quotes: {
      market: { value: 32.1, change: 5.2, source: "market" },
      oracle: { value: 28.5, change: 3.1, source: "oracle" },
      crowd: { value: 45.6, change: 6.8, source: "crowd" },
    },
    totalVolume: 980000,
    totalVotes: 8234,
    yesVotes: 3752,
    noVotes: 4482,
    tags: ["fusion", "energy", "science"],
  },
]

const categories: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "crypto", label: "Crypto" },
  { value: "politics", label: "Politics" },
  { value: "sports", label: "Sports" },
  { value: "science", label: "Science" },
  { value: "entertainment", label: "Entertainment" },
]

const sortOptions = [
  { value: "trending", label: "Trending", icon: TrendingUp },
  { value: "newest", label: "Newest", icon: Clock },
  { value: "volume", label: "Highest Volume", icon: TrendingUp },
  { value: "votes", label: "Most Votes", icon: Users },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | "all">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("trending")
  const [showFilters, setShowFilters] = useState(false)

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const activeFilters = [
    selectedCategory !== "all" && selectedCategory,
    selectedStatus !== "all" && selectedStatus,
  ].filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-heading font-bold mb-2">Event Feed</h1>
            <p className="text-muted-foreground">
              Explore and vote on predictions across all categories
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <Badge
                              key={cat.value}
                              variant={selectedCategory === cat.value ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setSelectedCategory(cat.value)}
                            >
                              {cat.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <div className="flex flex-wrap gap-2">
                          {["all", "live", "upcoming", "closed", "resolved"].map((status) => (
                            <Badge
                              key={status}
                              variant={selectedStatus === status ? "default" : "outline"}
                              className="cursor-pointer capitalize"
                              onClick={() => setSelectedStatus(status as EventStatus | "all")}
                            >
                              {status === "all" ? "All Status" : status}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Sort By</label>
                        <div className="flex flex-wrap gap-2">
                          {sortOptions.map((option) => (
                            <Badge
                              key={option.value}
                              variant={sortBy === option.value ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setSortBy(option.value)}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSelectedCategory("all")}
                    />
                  </Badge>
                )}
                {selectedStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    {selectedStatus}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSelectedStatus("all")}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedStatus("all")
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-transparent p-0">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <p className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {allEvents.length} events
            </p>
          </motion.div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <EventCard
                    event={event}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Filter className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-heading font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedStatus("all")
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Load More */}
          {filteredEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg">
                Load More Events
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
