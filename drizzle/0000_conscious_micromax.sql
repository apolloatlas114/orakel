CREATE TYPE "public"."orakel_execution_status" AS ENUM('queued', 'submitted', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."orakel_market_provider" AS ENUM('polymarket', 'kalshi');--> statement-breakpoint
CREATE TYPE "public"."orakel_prediction_status" AS ENUM('open', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."orakel_signal_source_type" AS ENUM('polymarket', 'kalshi', 'x', 'reddit', 'rss');--> statement-breakpoint
CREATE TYPE "public"."orakel_user_tier" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "orakel_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "orakel_market_provider" NOT NULL,
	"encrypted_key" text NOT NULL,
	"encrypted_secret" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "orakel_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prediction_id" uuid NOT NULL,
	"provider" "orakel_market_provider" NOT NULL,
	"side" text NOT NULL,
	"amount_cents" integer DEFAULT 0 NOT NULL,
	"status" "orakel_execution_status" DEFAULT 'queued' NOT NULL,
	"request_id" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_prediction_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prediction_id" uuid NOT NULL,
	"resolved_at" timestamp with time zone NOT NULL,
	"outcome" text NOT NULL,
	"pnl_estimate" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_prediction_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prediction_id" uuid NOT NULL,
	"source_type" "orakel_signal_source_type" NOT NULL,
	"score" integer NOT NULL,
	"raw_summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"provider" "orakel_market_provider" NOT NULL,
	"market_id" text NOT NULL,
	"outcome" text NOT NULL,
	"market_odds" integer NOT NULL,
	"oracle_prob" integer NOT NULL,
	"edge" integer NOT NULL,
	"confidence" integer NOT NULL,
	"status" "orakel_prediction_status" DEFAULT 'open' NOT NULL,
	"reasoning" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"tier" "orakel_user_tier" DEFAULT 'free' NOT NULL,
	"referral_code" text NOT NULL,
	"referral_discount_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_user_id" uuid NOT NULL,
	"referred_user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_usage_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"month" text NOT NULL,
	"executions_count" integer DEFAULT 0 NOT NULL,
	"executions_limit" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orakel_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orakel_api_keys" ADD CONSTRAINT "orakel_api_keys_user_id_orakel_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."orakel_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_executions" ADD CONSTRAINT "orakel_executions_user_id_orakel_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."orakel_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_executions" ADD CONSTRAINT "orakel_executions_prediction_id_orakel_predictions_id_fk" FOREIGN KEY ("prediction_id") REFERENCES "public"."orakel_predictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_logs" ADD CONSTRAINT "orakel_logs_user_id_orakel_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."orakel_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_prediction_results" ADD CONSTRAINT "orakel_prediction_results_prediction_id_orakel_predictions_id_fk" FOREIGN KEY ("prediction_id") REFERENCES "public"."orakel_predictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_prediction_signals" ADD CONSTRAINT "orakel_prediction_signals_prediction_id_orakel_predictions_id_fk" FOREIGN KEY ("prediction_id") REFERENCES "public"."orakel_predictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_profiles" ADD CONSTRAINT "orakel_profiles_user_id_orakel_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."orakel_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_referrals" ADD CONSTRAINT "orakel_referrals_referrer_user_id_orakel_users_id_fk" FOREIGN KEY ("referrer_user_id") REFERENCES "public"."orakel_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_referrals" ADD CONSTRAINT "orakel_referrals_referred_user_id_orakel_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."orakel_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orakel_usage_limits" ADD CONSTRAINT "orakel_usage_limits_user_id_orakel_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."orakel_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "orakel_api_keys_user_provider_uq" ON "orakel_api_keys" USING btree ("user_id","provider");--> statement-breakpoint
CREATE INDEX "orakel_executions_user_idx" ON "orakel_executions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orakel_executions_prediction_idx" ON "orakel_executions" USING btree ("prediction_id");--> statement-breakpoint
CREATE INDEX "orakel_logs_type_idx" ON "orakel_logs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "orakel_logs_user_idx" ON "orakel_logs" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orakel_prediction_results_prediction_uq" ON "orakel_prediction_results" USING btree ("prediction_id");--> statement-breakpoint
CREATE INDEX "orakel_prediction_signals_prediction_idx" ON "orakel_prediction_signals" USING btree ("prediction_id");--> statement-breakpoint
CREATE INDEX "orakel_prediction_signals_type_idx" ON "orakel_prediction_signals" USING btree ("source_type");--> statement-breakpoint
CREATE UNIQUE INDEX "orakel_predictions_provider_market_uq" ON "orakel_predictions" USING btree ("provider","market_id","outcome");--> statement-breakpoint
CREATE INDEX "orakel_predictions_status_idx" ON "orakel_predictions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orakel_predictions_confidence_idx" ON "orakel_predictions" USING btree ("confidence");--> statement-breakpoint
CREATE UNIQUE INDEX "orakel_profiles_referral_code_uq" ON "orakel_profiles" USING btree ("referral_code");--> statement-breakpoint
CREATE INDEX "orakel_referrals_referrer_idx" ON "orakel_referrals" USING btree ("referrer_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orakel_referrals_referred_uq" ON "orakel_referrals" USING btree ("referred_user_id");--> statement-breakpoint
CREATE INDEX "orakel_referrals_code_idx" ON "orakel_referrals" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "orakel_usage_limits_user_month_uq" ON "orakel_usage_limits" USING btree ("user_id","month");--> statement-breakpoint
CREATE UNIQUE INDEX "orakel_users_email_uq" ON "orakel_users" USING btree ("email");