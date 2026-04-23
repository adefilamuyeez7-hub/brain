-- Brainstorm Flow - Sample Data Seed
-- Fixed: WITH clause BEFORE INSERT statement

-- Get the demo user ID
SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Insert ideas using proper PostgreSQL syntax

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1
)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT 
  demo_user.id,
  'AI-Powered Writing Assistant',
  'Real-time writing suggestions',
  'Browser extension for intelligent writing suggestions, grammar checking, tone adjustment, multi-language support, offline mode',
  'Tech',
  'https://github.com/sparks/ai-writing-assistant',
  12
FROM demo_user;

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1
)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT 
  demo_user.id,
  'Sustainable Fashion Marketplace',
  'Eco-conscious fashion commerce platform',
  'E-commerce connecting sustainable brands with conscious consumers, environmental impact transparency, carbon offset shipping options',
  'Product',
  'https://github.com/sparks/sustainable-fashion',
  8
FROM demo_user;

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1
)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT 
  demo_user.id,
  'Mental Health Check-in Bot',
  'Daily wellness check-ins for teams',
  'Discord or Slack bot for team mental health support with mood tracking, wellness surveys, stress resources, burnout help',
  'Life',
  NULL,
  5
FROM demo_user;

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1
)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT 
  demo_user.id,
  'Code Review Learning Platform',
  'Gamified code review best practices',
  'Learning platform using real open source code snippets, leaderboards, mentorship matching, GitHub integration for challenges',
  'Tech',
  'https://github.com/sparks/code-review-game',
  15
FROM demo_user;

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1
)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT 
  demo_user.id,
  'DIY Garden Design with AR',
  'Visualize and plan gardens using AR',
  'Mobile app with AR visualization, plant database, care requirements, companion planting guides, progress tracking features',
  'Design',
  NULL,
  7
FROM demo_user;

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1
)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT 
  demo_user.id,
  'Community Event Matching',
  'Connect people with local events',
  'Platform aggregating events from Meetup and Eventbrite with smart matching, personalized recommendations, calendar sync features',
  'Product',
  'https://github.com/sparks/event-matching',
  10
FROM demo_user;

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1
)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT 
  demo_user.id,
  'Habit Stacking Tracker',
  'Build habits by linking to existing routines',
  'Mobile app for habit stacking methodology, smart notifications, visual chains, gamification streaks, community accountability',
  'Wellness',
  NULL,
  9
FROM demo_user;

-- Verify all ideas were inserted
SELECT COUNT(*) as total_ideas FROM ideas;
SELECT title, tag, likes_count FROM ideas ORDER BY created_at DESC;
