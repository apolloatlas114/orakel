CREATE TYPE "public"."execution_status" AS ENUM('queued', 'submitted', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."market_provider" AS ENUM('polymarket', 'kalshi');--> statement-breakpoint
CREATE TYPE "public"."prediction_status" AS ENUM('open', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."signal_source_type" AS ENUM('polymarket', 'kalshi', 'x', 'reddit', 'rss');--> statement-breakpoint
CREATE TYPE "public"."user_tier" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "market_provider" NOT NULL,
	"encrypted_key" text NOT NULL,
	"encrypted_secret" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prediction_id" uuid NOT NULL,
	"provider" "market_provider" NOT NULL,
	"side" text NOT NULL,
	"amount_cents" integer DEFAULT 0 NOT NULL,
	"status" "execution_status" DEFAULT 'queued' NOT NULL,
	"request_id" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prediction_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prediction_id" uuid NOT NULL,
	"resolved_at" timestamp with time zone NOT NULL,
	"outcome" text NOT NULL,
	"pnl_estimate" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prediction_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prediction_id" uuid NOT NULL,
	"source_type" "signal_source_type" NOT NULL,
	"score" integer NOT NULL,
	"raw_summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"provider" "market_provider" NOT NULL,
	"market_id" text NOT NULL,
	"outcome" text NOT NULL,
	"market_odds" integer NOT NULL,
	"oracle_prob" integer NOT NULL,
	"edge" integer NOT NULL,
	"confidence" integer NOT NULL,
	"status" "prediction_status" DEFAULT 'open' NOT NULL,
	"reasoning" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"tier" "user_tier" DEFAULT 'free' NOT NULL,
	"referral_code" text NOT NULL,
	"referral_discount_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_user_id" uuid NOT NULL,
	"referred_user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"month" text NOT NULL,
	"executions_count" integer DEFAULT 0 NOT NULL,
	"executions_limit" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executions" ADD CONSTRAINT "executions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executions" ADD CONSTRAINT "executions_prediction_id_predictions_id_fk" FOREIGN KEY ("prediction_id") REFERENCES "public"."predictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction_results" ADD CONSTRAINT "prediction_results_prediction_id_predictions_id_fk" FOREIGN KEY ("prediction_id") REFERENCES "public"."predictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction_signals" ADD CONSTRAINT "prediction_signals_prediction_id_predictions_id_fk" FOREIGN KEY ("prediction_id") REFERENCES "public"."predictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_user_id_users_id_fk" FOREIGN KEY ("referrer_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_limits" ADD CONSTRAINT "usage_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "api_keys_user_provider_uq" ON "api_keys" USING btree ("user_id","provider");--> statement-breakpoint
CREATE INDEX "executions_user_idx" ON "executions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "executions_prediction_idx" ON "executions" USING btree ("prediction_id");--> statement-breakpoint
CREATE INDEX "logs_type_idx" ON "logs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "logs_user_idx" ON "logs" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prediction_results_prediction_uq" ON "prediction_results" USING btree ("prediction_id");--> statement-breakpoint
CREATE INDEX "prediction_signals_prediction_idx" ON "prediction_signals" USING btree ("prediction_id");--> statement-breakpoint
CREATE INDEX "prediction_signals_type_idx" ON "prediction_signals" USING btree ("source_type");--> statement-breakpoint
CREATE UNIQUE INDEX "predictions_provider_market_uq" ON "predictions" USING btree ("provider","market_id","outcome");--> statement-breakpoint
CREATE INDEX "predictions_status_idx" ON "predictions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "predictions_confidence_idx" ON "predictions" USING btree ("confidence");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_referral_code_uq" ON "profiles" USING btree ("referral_code");--> statement-breakpoint
CREATE INDEX "referrals_referrer_idx" ON "referrals" USING btree ("referrer_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "referrals_referred_uq" ON "referrals" USING btree ("referred_user_id");--> statement-breakpoint
CREATE INDEX "referrals_code_idx" ON "referrals" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_limits_user_month_uq" ON "usage_limits" USING btree ("user_id","month");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq" ON "users" USING btree ("email");