import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userTier = pgEnum("orakel_user_tier", ["free", "pro"]);
export const predictionStatus = pgEnum("orakel_prediction_status", ["open", "resolved"]);
export const marketProvider = pgEnum("orakel_market_provider", ["polymarket", "kalshi"]);
export const signalSourceType = pgEnum("orakel_signal_source_type", [
  "polymarket",
  "kalshi",
  "x",
  "reddit",
  "rss",
]);
export const executionStatus = pgEnum("orakel_execution_status", [
  "queued",
  "submitted",
  "failed",
  "skipped",
]);

export const users = pgTable(
  "orakel_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailUq: uniqueIndex("orakel_users_email_uq").on(t.email),
  }),
);

export const profiles = pgTable(
  "orakel_profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name"),
    tier: userTier("tier").default("free").notNull(),
    referralCode: text("referral_code").notNull(),
    referralDiscountActive: boolean("referral_discount_active").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    referralUq: uniqueIndex("orakel_profiles_referral_code_uq").on(t.referralCode),
  }),
);

export const referrals = pgTable(
  "orakel_referrals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referrerUserId: uuid("referrer_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    referredUserId: uuid("referred_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    referrerIdx: index("orakel_referrals_referrer_idx").on(t.referrerUserId),
    referredIdx: uniqueIndex("orakel_referrals_referred_uq").on(t.referredUserId),
    codeIdx: index("orakel_referrals_code_idx").on(t.code),
  }),
);

export const usageLimits = pgTable(
  "orakel_usage_limits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    month: text("month").notNull(), // YYYY-MM
    executionsCount: integer("executions_count").default(0).notNull(),
    executionsLimit: integer("executions_limit").default(10).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uq: uniqueIndex("orakel_usage_limits_user_month_uq").on(t.userId, t.month),
  }),
);

export const predictions = pgTable(
  "orakel_predictions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    provider: marketProvider("provider").notNull(),
    marketId: text("market_id").notNull(),
    outcome: text("outcome").notNull(), // e.g. YES
    marketOdds: integer("market_odds").notNull(), // basis points, 0-10000
    oracleProb: integer("oracle_prob").notNull(), // basis points, 0-10000
    edge: integer("edge").notNull(), // oracle - market (bps)
    confidence: integer("confidence").notNull(), // 0-10000
    status: predictionStatus("status").default("open").notNull(),
    reasoning: text("reasoning").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    providerMarketIdx: uniqueIndex("orakel_predictions_provider_market_uq").on(t.provider, t.marketId, t.outcome),
    statusIdx: index("orakel_predictions_status_idx").on(t.status),
    confIdx: index("orakel_predictions_confidence_idx").on(t.confidence),
  }),
);

export const predictionSignals = pgTable(
  "orakel_prediction_signals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    predictionId: uuid("prediction_id")
      .notNull()
      .references(() => predictions.id, { onDelete: "cascade" }),
    sourceType: signalSourceType("source_type").notNull(),
    score: integer("score").notNull(), // -100..100 or 0..10000 (your choice, we use -100..100)
    rawSummary: text("raw_summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    predIdx: index("orakel_prediction_signals_prediction_idx").on(t.predictionId),
    typeIdx: index("orakel_prediction_signals_type_idx").on(t.sourceType),
  }),
);

export const predictionResults = pgTable(
  "orakel_prediction_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    predictionId: uuid("prediction_id")
      .notNull()
      .references(() => predictions.id, { onDelete: "cascade" }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }).notNull(),
    outcome: text("outcome").notNull(), // YES/NO
    pnlEstimate: integer("pnl_estimate").default(0).notNull(),
  },
  (t) => ({
    predUq: uniqueIndex("orakel_prediction_results_prediction_uq").on(t.predictionId),
  }),
);

export const apiKeys = pgTable(
  "orakel_api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: marketProvider("provider").notNull(),
    encryptedKey: text("encrypted_key").notNull(),
    encryptedSecret: text("encrypted_secret").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => ({
    userProviderUq: uniqueIndex("orakel_api_keys_user_provider_uq").on(t.userId, t.provider),
  }),
);

export const executions = pgTable(
  "orakel_executions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    predictionId: uuid("prediction_id")
      .notNull()
      .references(() => predictions.id, { onDelete: "cascade" }),
    provider: marketProvider("provider").notNull(),
    side: text("side").notNull(), // YES/NO
    amountCents: integer("amount_cents").default(0).notNull(),
    status: executionStatus("status").default("queued").notNull(),
    requestId: text("request_id"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("orakel_executions_user_idx").on(t.userId),
    predIdx: index("orakel_executions_prediction_idx").on(t.predictionId),
  }),
);

export const logs = pgTable(
  "orakel_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    type: text("type").notNull(),
    message: text("message").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    typeIdx: index("orakel_logs_type_idx").on(t.type),
    userIdx: index("orakel_logs_user_idx").on(t.userId),
  }),
);


