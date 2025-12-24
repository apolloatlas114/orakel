Product Specification – Prediction & Content Intelligence Platform
1. Product Overview
Short Description

The platform is a data-driven web application that aggregates, analyzes, and enriches prediction and betting events from external markets such as Polymarket and Kalshi. It combines market probabilities, proprietary AI-based probability estimates, crowd sentiment, and automated content generation to identify high-impact events and convert them into scalable traffic and user engagement.

Target Audience

Prediction market participants

Traders and information arbitrageurs

Content-driven publishers

SEO- and traffic-focused platform operators

Core Problem

High-impact betting and prediction events emerge across fragmented markets and information sources, making it difficult to systematically identify, evaluate, contextualize, and leverage them for insight, engagement, and traffic generation.

Primary Value Proposition

A single platform that automatically detects relevant prediction events, enriches them with proprietary intelligence, enables crowd participation, and converts high-signal events into content and distribution at scale.

2. Core Features (Prioritized)
MVP Features (Phase 1)

Aggregation of betting and prediction events from Polymarket

Public event feed (no account required)

Event cards displaying:

Event title

Market outcomes

Market-implied probability

Proprietary “Oracle” probability

Crowd voting (Yes / No) without user accounts

Fully automated system-generated events

UI-first dashboard using mock data

Automatic posting of newly created events to X and Telegram (short-form posts)

Extended Features (Phase 2)

Kalshi market integration

Automated blog article generation per event

AI-based decision engine to determine whether an article should be created (traffic and relevance scoring)

Dynamic, event-specific CTA generation

Event detail pages

Source attribution (X, Reddit, News, RSS feeds)

Scaling Features (Phase 3)

User accounts and profiles

Reputation-weighted crowd voting

Historical performance tracking of the Oracle

Partner and public APIs

Multi-language support

Monetization (ads, affiliates, premium insights)

3. User Roles
Visitor (Unauthenticated)

Permissions:

View events and articles

Participate in crowd voting

Limitations:

Cannot create or edit events

System (Automated)

Permissions:

Create and update events

Generate articles

Trigger social media distribution

Limitations:

No manual intervention

Administrator (Future)

Permissions:

Moderate events and sources

Limitations:

No direct trading or financial actions

4. User Flows
Onboarding Flow

Landing Page → Event Feed → Event Detail → Voting / Article

Authentication Flow

No authentication required in MVP

Primary Use-Case Flow

External market publishes a new event
→ System ingests event
→ Oracle calculates probability
→ Event card is published
→ Crowd voting begins
→ Optional article generation and social distribution

Edge Cases

Insufficient external data → event not created

Low traffic score → no article generated

Unreliable sources → event marked as low confidence

5. UI / UX Structure
Page Overview

Landing Page

Event Feed

Event Detail Page

Blog / Article Pages

Methodology / Oracle Explanation Page

Layout Principles

High information density without visual overload

Clear separation between market data and Oracle estimates

Trust-focused, neutral visual design

Reusable UI Components

Event Card

Probability Bar

Crowd Voting Widget

Source Badge

CTA Block

Article Preview Card

Mobile / Desktop Behavior

Vertical card layout on mobile

Grid-based layout on desktop

One-tap / one-click voting interactions

6. Technical Architecture
Frontend Stack

Next.js (App Router)

TypeScript

Tailwind CSS

shadcn/ui

Backend Approach

Server Actions for:

Event creation

Oracle probability computation

Content and distribution triggers

API Routes introduced in later phases for external integrations

State Management

Local UI state via React state

Server-prepared event and voting state

Error Handling Strategy

Graceful degradation for external data failures

Confidence and reliability indicators for events

Fallback UI and messaging

7. Data Model (No Persistent Database in MVP)
Entities

Event

Market

OraclePrediction

CrowdVote

Article

Source

Key Fields (Representative)

Event: id, title, category, status, createdAt

Market: platform, outcome, probability

OraclePrediction: probability, confidence, reasoning

CrowdVote: yesCount, noCount

Article: title, summary, ctaText

Source: type, url, relevanceScore

Relationships

Event → many Markets

Event → one OraclePrediction

Event → many CrowdVotes

Event → optional Article

Mock Data (Phase 1)

All events

Oracle probabilities

Crowd voting results

8. Non-Goals (MVP)

No real-money betting or trading

No user authentication or accounts

No withdrawals or financial custody

No personalized recommendations

No legal, financial, or investment advice

9. Security & Quality Requirements
Authentication Principles

Public read-only access

Write actions restricted to system processes

Input Validation

Sanitization of all external data

Rate limiting for crowd voting

Role Enforcement

Strict separation between system actions and user interactions

Performance Principles

Server-side preparation of event feeds

Static rendering where feasible

Fast initial load times

10. Scaling Strategy
~1,000 Users

Persistent database integration

Event feed caching

~10,000 Users

Optimized aggregation and voting queries

Asynchronous article generation

~100,000 Users

Event streaming pipelines

Dedicated Oracle computation services

CDN-backed delivery for feeds and articles