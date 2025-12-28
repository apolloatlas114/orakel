-- Seed Data for Global Oracle Platform
-- Run this after 001_initial_schema.sql

-- Insert sample events
INSERT INTO public.events (
  title, description, category, status, end_date,
  market_quote, market_quote_change,
  oracle_quote, oracle_quote_change,
  crowd_quote, crowd_quote_change,
  total_volume, total_votes, yes_votes, no_votes, tags
) VALUES
(
  'Will Bitcoin exceed $150,000 by March 2025?',
  'Bitcoin has been on a strong uptrend throughout 2024, breaking multiple all-time highs. Market analysts are divided on whether it will reach the ambitious $150,000 target by the end of Q1 2025. Factors to consider include institutional adoption, macroeconomic conditions, and the upcoming halving cycle effects.',
  'crypto',
  'live',
  '2025-03-31 23:59:59+00',
  42.50, 2.30,
  38.20, -1.10,
  67.80, 5.20,
  2450000.00, 15234, 10234, 5000,
  ARRAY['bitcoin', 'crypto', 'price', 'prediction']
),
(
  'Will SpaceX successfully land Starship on Mars before 2030?',
  'SpaceX has ambitious plans for Mars colonization. Can they achieve the first successful landing? The Starship program has made significant progress with orbital tests.',
  'science',
  'live',
  '2029-12-31 23:59:59+00',
  28.50, 0.80,
  35.10, 2.40,
  52.30, -0.50,
  890000.00, 8721, 4532, 4189,
  ARRAY['spacex', 'mars', 'space', 'elon-musk']
),
(
  'Will AI pass the Turing Test convincingly by 2026?',
  'With rapid advances in language models like GPT-4 and Claude, will AI achieve human-level conversational ability that can fool judges in a standardized Turing Test?',
  'science',
  'live',
  '2026-12-31 23:59:59+00',
  75.20, 3.10,
  82.40, 1.80,
  71.90, 2.20,
  1230000.00, 11456, 8234, 3222,
  ARRAY['ai', 'turing', 'technology', 'chatgpt']
),
(
  'Will the next US President be a Democrat?',
  'The 2028 presidential election is approaching. Political analysts weigh in on the likely outcome based on current political trends and demographic shifts.',
  'politics',
  'upcoming',
  '2028-11-05 23:59:59+00',
  48.20, -0.50,
  51.30, 1.20,
  45.80, -2.10,
  4500000.00, 25678, 11782, 13896,
  ARRAY['politics', 'usa', 'election', '2028']
),
(
  'Will Manchester City win the Premier League 2024/25?',
  'The reigning champions face stiff competition from Arsenal, Liverpool, and other contenders. Can Pep Guardiola secure another title?',
  'sports',
  'live',
  '2025-05-25 23:59:59+00',
  35.50, -2.30,
  32.10, -1.50,
  41.20, 0.80,
  3200000.00, 19234, 7890, 11344,
  ARRAY['football', 'premier-league', 'manchester-city', 'sports']
),
(
  'Will Taylor Swift announce a new album in 2025?',
  'After the massive success of the Eras Tour, fans speculate about new music. Will Taylor drop another album this year?',
  'entertainment',
  'live',
  '2025-12-31 23:59:59+00',
  88.50, 1.20,
  91.20, 0.80,
  95.30, 0.50,
  1850000.00, 32156, 30548, 1608,
  ARRAY['music', 'taylor-swift', 'entertainment', 'pop']
),
(
  'Will Ethereum 2.0 fully launch all phases before July 2025?',
  'The complete transition to proof-of-stake continues with sharding and other upgrades. Will all planned phases complete on schedule?',
  'crypto',
  'live',
  '2025-06-30 23:59:59+00',
  62.30, 3.50,
  58.70, 2.10,
  71.40, 4.20,
  2100000.00, 14523, 10367, 4156,
  ARRAY['ethereum', 'crypto', 'blockchain', 'eth2']
),
(
  'Will there be a major breakthrough in nuclear fusion by 2027?',
  'Scientists are getting closer to achieving sustained net energy gain. Will we see a breakthrough leading to commercial viability by 2027?',
  'science',
  'upcoming',
  '2027-12-31 23:59:59+00',
  32.10, 5.20,
  28.50, 3.10,
  45.60, 6.80,
  980000.00, 8234, 3752, 4482,
  ARRAY['fusion', 'energy', 'science', 'physics']
),
(
  'Will the Federal Reserve cut interest rates in Q1 2025?',
  'Market expects potential rate adjustments based on inflation data and economic indicators. Will the Fed pivot in early 2025?',
  'politics',
  'live',
  '2025-03-31 23:59:59+00',
  45.20, -3.10,
  68.50, 5.20,
  52.10, 1.80,
  3250000.00, 18234, 9500, 8734,
  ARRAY['fed', 'rates', 'economy', 'finance']
),
(
  'Will Apple release AR glasses before July 2025?',
  'Rumors suggest Apple is working on standalone AR glasses following the Vision Pro. Will they announce or release them by mid-2025?',
  'science',
  'live',
  '2025-06-30 23:59:59+00',
  22.40, -1.20,
  15.80, -2.50,
  42.30, 4.10,
  920000.00, 7821, 3312, 4509,
  ARRAY['apple', 'ar', 'technology', 'glasses']
),
(
  'Will Ethereum flip Bitcoin in market cap in 2025?',
  'The flippening has been debated for years. With Ethereum ecosystem growth, will 2025 finally be the year ETH surpasses BTC?',
  'crypto',
  'live',
  '2025-12-31 23:59:59+00',
  12.80, 0.50,
  8.20, -0.80,
  35.60, 3.20,
  1850000.00, 12456, 4423, 8033,
  ARRAY['ethereum', 'bitcoin', 'flippening', 'crypto']
),
(
  'Will a major streaming service shut down in 2025?',
  'The streaming wars continue with consolidation expected. Will Netflix, Disney+, Max, or another major player exit the market?',
  'entertainment',
  'live',
  '2025-12-31 23:59:59+00',
  35.20, 2.10,
  28.90, 1.50,
  42.10, 3.80,
  750000.00, 9823, 4112, 5711,
  ARRAY['streaming', 'netflix', 'disney', 'entertainment']
);
