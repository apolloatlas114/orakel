"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Zap,
  Brain,
  Users,
  BarChart3,
  Shield,
  Globe,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EventCard } from "@/components/events/EventCard"
import type { Event } from "@/types"

// Mock data for featured events
const featuredEvents: Event[] = [
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
]

const features = [
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description: "Real-time aggregated odds from leading prediction markets worldwide.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "Oracle AI",
    description: "Advanced machine learning models trained on historical prediction data.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Crowd Wisdom",
    description: "Harness the collective intelligence of our global community.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Shield,
    title: "Verified Sources",
    description: "All outcomes verified by decentralized oracle networks.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Globe,
    title: "Global Events",
    description: "From politics to sports, crypto to science - predict anything.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Award,
    title: "Reputation System",
    description: "Build your prediction track record and climb the leaderboard.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
]

const stats = [
  { value: "$12.5M+", label: "Total Volume" },
  { value: "50K+", label: "Active Predictors" },
  { value: "2,500+", label: "Events Resolved" },
  { value: "89%", label: "Oracle Accuracy" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-6 py-2 px-4 border-primary/30 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                The Future of Prediction Markets
              </Badge>

              <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                Predict the Future with{" "}
                <span className="text-gradient">Triple-Quote</span>{" "}
                Intelligence
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Combine market odds, AI oracle predictions, and crowd wisdom to make
                smarter forecasts on global events. Join the most advanced prediction
                platform in the world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="xl" className="gap-2 group">
                    Start Predicting
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/events">
                  <Button size="xl" variant="outline" className="gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Explore Events
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-2xl glass-card"
                >
                  <div className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Triple Quote Explainer */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">How It Works</Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Three Sources. One Truth.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our unique triple-quote system combines three independent probability
                sources to give you the most accurate prediction insights.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BarChart3,
                  title: "Market Quote",
                  value: "42.5%",
                  description: "Real-time odds aggregated from leading prediction markets and betting exchanges worldwide.",
                  colorClass: "text-blue-400",
                  bgClass: "bg-blue-500/10",
                },
                {
                  icon: Brain,
                  title: "Oracle Quote",
                  value: "38.2%",
                  description: "AI-powered predictions using advanced machine learning models trained on historical outcomes.",
                  colorClass: "text-primary",
                  bgClass: "bg-primary/10",
                },
                {
                  icon: Users,
                  title: "Crowd Quote",
                  value: "67.8%",
                  description: "Community-driven consensus from our global network of predictors and analysts.",
                  colorClass: "text-success",
                  bgClass: "bg-success/10",
                },
              ].map((source, index) => (
                <motion.div
                  key={source.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card h-full hover:border-white/20 transition-all group">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl ${source.bgClass} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                        <source.icon className={`w-8 h-8 ${source.colorClass}`} />
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-2">
                        {source.title}
                      </h3>
                      <div className={`text-4xl font-heading font-bold mb-4 ${source.colorClass}`}>
                        {source.value}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {source.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <Badge variant="secondary" className="mb-4">Featured Events</Badge>
                <h2 className="text-4xl font-heading font-bold">
                  Trending Predictions
                </h2>
              </div>
              <Link href="/events">
                <Button variant="ghost" className="gap-2">
                  View All Events
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} variant="default" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">Platform Features</Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Everything You Need to Predict
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools and insights to help you make better predictions
                and track your performance.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature) => (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="glass-card h-full hover:border-white/20 transition-all group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-lg font-heading font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card border-primary/30 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <CardContent className="relative z-10 p-12 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    Ready to Start Predicting?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                    Join thousands of predictors using our triple-quote system
                    to forecast the future. Sign up now and get started in seconds.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/register">
                      <Button size="xl" className="gap-2 group">
                        Create Free Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/bot">
                      <Button size="xl" variant="outline" className="gap-2">
                        <Brain className="w-5 h-5" />
                        Explore Bot Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
