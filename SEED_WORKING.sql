-- Brainstorm Flow - Sample Data Seed
-- Using proper SQL escaping and avoiding problematic strings

-- Get demo user ID first (verify it exists)
SELECT id AS demo_user_id FROM users WHERE email = 'demo@sparkboard.app';

-- Now insert ideas one by one with properly escaped strings

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app'
)
SELECT 
  demo_user.id,
  'AI-Powered Writing Assistant',
  'Real-time writing suggestions',
  'Browser extension for intelligent writing suggestions, grammar checking, tone adjustment, multi-language support, privacy-safe offline mode',
  'Tech',
  'https://github.com/sparks/ai-writing-assistant',
  12
FROM demo_user;

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app'
)
SELECT 
  demo_user.id,
  'Sustainable Fashion Marketplace',
  'Eco-conscious fashion commerce platform',
  'E-commerce connecting sustainable brands with conscious consumers, showing environmental impact, carbon offsets, ethical fashion community',
  'Product',
  'https://github.com/sparks/sustainable-fashion',
  8
FROM demo_user;

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app'
)
SELECT 
  demo_user.id,
  'Mental Health Check-in Bot',
  'Daily wellness check-ins for teams',
  'Discord/Slack bot for team mental health, mood tracking, wellness surveys, stress resources, burnout support, meditation app integration',
  'Life',
  NULL,
  5
FROM demo_user;

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app'
)
SELECT 
  demo_user.id,
  'Code Review Game',
  'Gamified code review learning platform',
  'Turn code review into games with real open source code, leaderboards, mentorship matching, GitHub integration, real-time challenges',
  'Tech',
  'https://github.com/sparks/code-review-game',
  15
FROM demo_user;

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app'
)
SELECT 
  demo_user.id,
  'DIY Garden Design with AR',
  'Visualize and plan gardens using AR',
  'Mobile app with AR visualization, plant database, care requirements, companion planting guides, progress tracking for urban gardeners',
  'Design',
  NULL,
  7
FROM demo_user;

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app'
)
SELECT 
  demo_user.id,
  'Community Event Matching',
  'Connect people with local events',
  'Platform aggregating events from Meetup and Eventbrite with smart matching, personalized recommendations, calendar sync, community building',
  'Product',
  'https://github.com/sparks/event-matching',
  10
FROM demo_user;

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app'
)
SELECT 
  demo_user.id,
  'Habit Stacking Tracker',
  'Build habits by linking to existing routines',
  'Mobile app for habit stacking methodology, smart notifications, visual chains, gamification, community challenges, progress tracking',
  'Wellness',
  NULL,
  9
FROM demo_user;

-- Verify all ideas were inserted
SELECT COUNT(*) as total_ideas FROM ideas;
SELECT title, tag, likes_count FROM ideas ORDER BY created_at DESC;
