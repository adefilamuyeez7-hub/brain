-- ============================================================================
-- BRAINSTORM FLOW - SEED DATA
-- Sample ideas for new users to see on arrival
-- ============================================================================

-- STEP 1: Create demo user first
-- If demo user already exists, this will fail - that's OK, just proceed to ideas

INSERT INTO users (email, name, avatar_url, bio)
VALUES (
  'demo@sparkboard.app',
  'Sparkboard Demo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  'Showcasing ideas for the Sparkboard community'
);

-- ============================================================================
-- STEP 2: Get the demo user ID (run this to check)
-- ============================================================================

SELECT id FROM users WHERE email = 'demo@sparkboard.app';

-- ============================================================================
-- STEP 3: Insert 7 sample ideas
-- Note: Replace 'DEMO_USER_ID' below with the result from STEP 2
-- ============================================================================

-- If you got a UUID from step 2, use it below. For example: 
-- '550e8400-e29b-41d4-a716-446655440000'

-- Idea 1: AI Writing Assistant
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count, owner_name)
SELECT id, 'AI-Powered Writing Assistant', 'Real-time writing suggestions', 'Browser extension for intelligent writing suggestions, grammar checking, tone adjustment, multi-language support, offline mode', 'Tech', 'https://github.com/sparks/ai-writing-assistant', 12, 'Sparkboard Demo'
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 2: Sustainable Fashion
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count, owner_name)
SELECT id, 'Sustainable Fashion Marketplace', 'Eco-conscious fashion commerce', 'E-commerce connecting sustainable brands with conscious consumers, environmental impact transparency, carbon offset shipping', 'Product', 'https://github.com/sparks/sustainable-fashion', 8, 'Sparkboard Demo'
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 3: Mental Health Bot
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count, owner_name)
SELECT id, 'Mental Health Check-in Bot', 'Daily wellness for teams', 'Discord or Slack bot for team mental health with mood tracking, wellness surveys, stress resources, burnout support', 'Life', NULL, 5, 'Sparkboard Demo'
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 4: Code Review Game
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count, owner_name)
SELECT id, 'Code Review Learning Game', 'Gamified code review learning', 'Learning platform using real open source code, leaderboards, mentorship matching, GitHub integration for challenges', 'Tech', 'https://github.com/sparks/code-review-game', 15, 'Sparkboard Demo'
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 5: Garden Design AR
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count, owner_name)
SELECT id, 'DIY Garden Design with AR', 'Visualize gardens in AR', 'Mobile app with AR visualization, plant database, care requirements, companion planting guides, progress tracking', 'Design', NULL, 7, 'Sparkboard Demo'
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 6: Event Matching
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count, owner_name)
SELECT id, 'Community Event Matching', 'Connect people to events', 'Platform aggregating events with smart matching, personalized recommendations, calendar sync, community features', 'Product', 'https://github.com/sparks/event-matching', 10, 'Sparkboard Demo'
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 7: Habit Tracker
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count, owner_name)
SELECT id, 'Habit Stacking Tracker', 'Build habits through stacking', 'Mobile app for habit stacking methodology, smart notifications, visual chains, gamification, community accountability', 'Wellness', NULL, 9, 'Sparkboard Demo'
FROM users WHERE email = 'demo@sparkboard.app';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Seed data inserted!' as status;
SELECT COUNT(*) as total_ideas FROM ideas;
SELECT title, tag, likes_count FROM ideas ORDER BY created_at DESC;
