"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Zap,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Filter,
  Search,
  ArrowUpRight,
  Activity,
  Target,
  Sparkles,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/events/EventCard"
import { TripleQuoteBar } from "@/components/events/TripleQuoteBar"
import type { Event } from "@/types"

// Mock data for bot insights
const botStats = {
  accuracy: 89.2,
  accuracyChange: 2.1,
  totalPredictions: 1247,
  activePredictions: 42,
  successRate: 78.5,
  avgConfidence: 72.3,
}

const topOpportunities: Event[] = [
  {
    id: "opp-1",
    title: "Will the Federal Reserve cut rates in Q1 2025?",
    description: "Market expects potential rate adjustments based on inflation data.",
    category: "politics",
    status: "live",
    endDate: "2025-03-31T23:59:59Z",
    createdAt: "2024-12-20T00:00:00Z",
    quotes: {
      market: { value: 45.2, change: -3.1, source: "market" },
      oracle: { value: 68.5, change: 5.2, source: "oracle" },
      crowd: { value: 52.1, change: 1.8, source: "crowd" },
    },
    totalVolume: 3250000,
    totalVotes: 18234,
    yesVotes: 9500,
    noVotes: 8734,
    tags: ["fed", "rates", "economy"],
  },
  {
    id: "opp-2",
    title: "Will Ethereum flip Bitcoin market cap in 2025?",
    description: "The flippening has been debated for years. Will 2025 be the year?",
    category: "crypto",
    status: "live",
    endDate: "2025-12-31T23:59:59Z",
    createdAt: "2024-12-15T00:00:00Z",
    quotes: {
      market: { value: 12.8, change: 0.5, source: "market" },
      oracle: { value: 8.2, change: -0.8, source: "oracle" },
      crowd: { value: 35.6, change: 3.2, source: "crowd" },
    },
    totalVolume: 1850000,
    totalVotes: 12456,
    yesVotes: 4423,
    noVotes: 8033,
    tags: ["ethereum", "bitcoin", "flippening"],
  },
  {
    id: "opp-3",
    title: "Will Apple release AR glasses before July 2025?",
    description: "Rumors suggest Apple is working on standalone AR glasses.",
    category: "science",
    status: "live",
    endDate: "2025-06-30T23:59:59Z",
    createdAt: "2024-12-18T00:00:00Z",
    quotes: {
      market: { value: 22.4, change: -1.2, source: "market" },
      oracle: { value: 15.8, change: -2.5, source: "oracle" },
      crowd: { value: 42.3, change: 4.1, source: "crowd" },
    },
    totalVolume: 920000,
    totalVotes: 7821,
    yesVotes: 3312,
    noVotes: 4509,
    tags: ["apple", "ar", "technology"],
  },
]

const recentAlerts = [
  {
    id: "alert-1",
    type: "opportunity",
    title: "High divergence detected",
    message: "Oracle predicts 68.5% vs Market 45.2% on Fed rate cut",
    timestamp: "2 mins ago",
  },
  {
    id: "alert-2",
    type: "success",
    title: "Prediction resolved",
    message: "Your prediction on BTC $100K was correct!",
    timestamp: "1 hour ago",
  },
  {
    id: "alert-3",
    type: "warning",
    title: "Market shift detected",
    message: "Significant movement on Ethereum flippening odds",
    timestamp: "3 hours ago",
  },
]

export default function BotDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

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
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-heading font-bold">Oracle Bot Dashboard</h1>
                  <p className="text-muted-foreground">AI-powered prediction insights and opportunities</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button className="gap-2">
                <Zap className="w-4 h-4" />
                Enable Auto-Trade
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <Badge variant={botStats.accuracyChange > 0 ? "success" : "destructive"} className="text-xs">
                    {botStats.accuracyChange > 0 ? "+" : ""}{botStats.accuracyChange}%
                  </Badge>
                </div>
                <div className="text-3xl font-heading font-bold text-primary">
                  {botStats.accuracy}%
                </div>
                <p className="text-sm text-muted-foreground">Oracle Accuracy</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-success" />
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                </div>
                <div className="text-3xl font-heading font-bold">
                  {botStats.activePredictions}
                </div>
                <p className="text-sm text-muted-foreground">Active Predictions</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-heading font-bold">
                  {botStats.successRate}%
                </div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-heading font-bold">
                  {botStats.avgConfidence}%
                </div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Opportunities */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-warning" />
                          Top Opportunities
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Events with highest Oracle divergence from market
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Filter className="w-4 h-4" />
                          Filter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="divergence" className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="divergence">High Divergence</TabsTrigger>
                        <TabsTrigger value="confidence">High Confidence</TabsTrigger>
                        <TabsTrigger value="volume">High Volume</TabsTrigger>
                      </TabsList>

                      <TabsContent value="divergence" className="space-y-4">
                        {topOpportunities.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="glass-card border-white/5 hover:border-primary/30 transition-all">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="live" className="text-xs">LIVE</Badge>
                                      <Badge variant="outline" className="text-xs border-warning/30 text-warning">
                                        {Math.abs(event.quotes.oracle.value - event.quotes.market.value).toFixed(1)}% divergence
                                      </Badge>
                                    </div>
                                    <h3 className="font-heading font-semibold mb-3">{event.title}</h3>
                                    <TripleQuoteBar quotes={event.quotes} size="sm" showLabels={false} />
                                  </div>
                                  <Button size="sm" className="gap-1">
                                    Trade
                                    <ArrowUpRight className="w-3 h-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </TabsContent>

                      <TabsContent value="confidence">
                        <div className="text-center py-8 text-muted-foreground">
                          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Analyzing high confidence predictions...</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="volume">
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Loading high volume events...</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Featured Event */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-xl font-heading font-bold mb-4">Featured Opportunity</h2>
                <EventCard event={topOpportunities[0]} variant="featured" />
              </motion.div>
            </div>

            {/* Right Column - Alerts & Activity */}
            <div className="space-y-6">
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              {/* Recent Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.type === "opportunity" ? "bg-warning" :
                          alert.type === "success" ? "bg-success" :
                          "bg-blue-400"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {alert.timestamp}
                        </span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Oracle Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      Oracle Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Last 7 Days</span>
                        <span className="text-sm font-medium text-success">+5.2%</span>
                      </div>
                      <div className="h-24 flex items-end gap-1">
                        {[65, 78, 82, 75, 88, 92, 89].map((value, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors rounded-t"
                            style={{ height: `${value}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="glass-card border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Zap className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Predictions</p>
                        <p className="text-2xl font-heading font-bold">{botStats.totalPredictions.toLocaleString()}</p>
                      </div>
                    </div>
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
