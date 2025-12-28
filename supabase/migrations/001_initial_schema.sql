-- Global Oracle Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  reputation_score INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TYPE event_status AS ENUM ('draft', 'live', 'upcoming', 'closed', 'resolved');
CREATE TYPE event_category AS ENUM ('sports', 'politics', 'crypto', 'entertainment', 'science', 'other');

CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category event_category NOT NULL DEFAULT 'other',
  status event_status NOT NULL DEFAULT 'draft',
  image_url TEXT,

  -- Resolution
  end_date TIMESTAMPTZ NOT NULL,
  resolution_date TIMESTAMPTZ,
  resolved_outcome BOOLEAN, -- true = YES won, false = NO won, null = not resolved
  resolution_source TEXT,

  -- Quotes (stored as JSONB for flexibility)
  market_quote DECIMAL(5,2) DEFAULT 50.00,
  market_quote_change DECIMAL(5,2) DEFAULT 0.00,
  oracle_quote DECIMAL(5,2) DEFAULT 50.00,
  oracle_quote_change DECIMAL(5,2) DEFAULT 0.00,
  crowd_quote DECIMAL(5,2) DEFAULT 50.00,
  crowd_quote_change DECIMAL(5,2) DEFAULT 0.00,

  -- Stats
  total_volume DECIMAL(15,2) DEFAULT 0.00,
  total_votes INTEGER DEFAULT 0,
  yes_votes INTEGER DEFAULT 0,
  no_votes INTEGER DEFAULT 0,

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  external_links JSONB DEFAULT '[]',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status != 'draft' OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Event creators can update their events"
  ON public.events FOR UPDATE
  USING (created_by = auth.uid());

-- ============================================
-- VOTES TABLE
-- ============================================
CREATE TYPE vote_type AS ENUM ('yes', 'no');

CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  vote vote_type NOT NULL,
  confidence INTEGER DEFAULT 50 CHECK (confidence >= 1 AND confidence <= 100),
  amount DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can only vote once per event
  UNIQUE(user_id, event_id)
);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON public.votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENT LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, comment_id)
);

-- Enable RLS
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Comment likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON public.comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
  ON public.comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- BOOKMARKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, event_id)
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TYPE notification_type AS ENUM ('prediction', 'event', 'system', 'social');

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update event vote counts
CREATE OR REPLACE FUNCTION public.update_event_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events
    SET
      total_votes = total_votes + 1,
      yes_votes = yes_votes + CASE WHEN NEW.vote = 'yes' THEN 1 ELSE 0 END,
      no_votes = no_votes + CASE WHEN NEW.vote = 'no' THEN 1 ELSE 0 END,
      crowd_quote = (
        SELECT ROUND((COUNT(*) FILTER (WHERE vote = 'yes')::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0)) * 100, 2)
        FROM public.votes WHERE event_id = NEW.event_id
      ),
      updated_at = NOW()
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events
    SET
      total_votes = total_votes - 1,
      yes_votes = yes_votes - CASE WHEN OLD.vote = 'yes' THEN 1 ELSE 0 END,
      no_votes = no_votes - CASE WHEN OLD.vote = 'no' THEN 1 ELSE 0 END,
      crowd_quote = (
        SELECT COALESCE(ROUND((COUNT(*) FILTER (WHERE vote = 'yes')::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0)) * 100, 2), 50)
        FROM public.votes WHERE event_id = OLD.event_id
      ),
      updated_at = NOW()
    WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote != NEW.vote THEN
      UPDATE public.events
      SET
        yes_votes = yes_votes + CASE WHEN NEW.vote = 'yes' THEN 1 ELSE -1 END,
        no_votes = no_votes + CASE WHEN NEW.vote = 'no' THEN 1 ELSE -1 END,
        crowd_quote = (
          SELECT ROUND((COUNT(*) FILTER (WHERE vote = 'yes')::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0)) * 100, 2)
          FROM public.votes WHERE event_id = NEW.event_id
        ),
        updated_at = NOW()
      WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for vote changes
DROP TRIGGER IF EXISTS on_vote_change ON public.votes;
CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_event_votes();

-- Function to update comment like count
CREATE OR REPLACE FUNCTION public.update_comment_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET likes = likes + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET likes = likes - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comment likes
DROP TRIGGER IF EXISTS on_comment_like_change ON public.comment_likes;
CREATE TRIGGER on_comment_like_change
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_likes();

-- Function to update user stats when prediction resolves
CREATE OR REPLACE FUNCTION public.update_user_prediction_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.resolved_outcome IS NOT NULL AND OLD.resolved_outcome IS NULL THEN
    -- Update all users who voted on this event
    UPDATE public.profiles p
    SET
      total_predictions = total_predictions + 1,
      correct_predictions = correct_predictions +
        CASE
          WHEN (v.vote = 'yes' AND NEW.resolved_outcome = true) OR
               (v.vote = 'no' AND NEW.resolved_outcome = false)
          THEN 1 ELSE 0
        END,
      accuracy_percentage = ROUND(
        ((correct_predictions +
          CASE
            WHEN (v.vote = 'yes' AND NEW.resolved_outcome = true) OR
                 (v.vote = 'no' AND NEW.resolved_outcome = false)
            THEN 1 ELSE 0
          END)::DECIMAL /
         NULLIF((total_predictions + 1)::DECIMAL, 0)) * 100, 2
      ),
      updated_at = NOW()
    FROM public.votes v
    WHERE v.event_id = NEW.id AND v.user_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for event resolution
DROP TRIGGER IF EXISTS on_event_resolved ON public.events;
CREATE TRIGGER on_event_resolved
  AFTER UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_user_prediction_stats();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON public.events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_event_id ON public.votes(event_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_event_id ON public.comments(event_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
