-- Brainstorm Flow - Sample Data Seed (Ultra-Simple Version)
-- This version uses direct INSERTs instead of SELECT subqueries to avoid parsing issues

-- 1. INSERT DEMO USER FIRST
INSERT INTO users (auth_id, email, name, avatar_url, bio)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'demo@sparkboard.app',
  'Sparkboard Demo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  'Showcasing ideas for the Sparkboard community'
);

-- NOTE: Copy the user ID from the demo user above and replace 'DEMO_USER_ID_HERE' in the ideas below
-- Or run this helper query first to get the demo user ID:
-- SELECT id FROM users WHERE email = 'demo@sparkboard.app';

-- After getting the demo user ID, paste it and run the ideas below...
-- For now, here's a template:

-- OPTION A: Run this separately to find the user ID
-- SELECT id AS demo_user_id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- OPTION B: If you know the UUID, replace it in the INSERT statements below
-- Let's assume the demo user got this UUID: '550e8400-e29b-41d4-a716-446655440000'

-- Ideas (adjust the user_id based on the actual demo user ID)
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count) VALUES
((SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1), 'AI-Powered Writing Assistant', 'Real-time writing suggestions using AI', 'A browser extension and web app providing intelligent writing suggestions, grammar correction, and tone adjustment. Features: multi-language support, custom writing style preferences, integration with Gmail/Notion/Medium, offline mode for privacy, and community feedback. Helps non-native speakers, professional writers, and students improve writing instantly.', 'Tech', 'https://github.com/sparks/ai-writing-assistant', 12);

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count) VALUES
((SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1), 'Sustainable Fashion Marketplace', 'Connect eco-conscious brands with conscious consumers', 'An e-commerce platform for sustainable fashion. Features: verifies sustainability certifications (B-Corp, Fair Trade), shows environmental impact per product, connects local artisans globally, provides carbon offset shipping options, educates on sustainable fabrics, and builds an ethical fashion community. Combines Etsy and Patagonia with environmental responsibility.', 'Product', 'https://github.com/sparks/sustainable-fashion', 8);

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count) VALUES
((SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1), 'Mental Health Check-in Bot', 'Gentle daily check-ins using conversational AI', 'A Discord/Slack bot for team mental health support. Features: daily mood check-ins with contextual follow-ups, anonymous wellness surveys, resources for common struggles (burnout, stress), professional help connection, team health dashboard, meditation app integration, and peer support matching. Designed with privacy and sensitivity as core values for remote team emotional connection.', 'Life', NULL, 5);

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count) VALUES
((SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1), 'Code Review Game - Learn by Playing', 'Gamified platform for learning code review best practices', 'Turn code review into an engaging learning experience. Features: real code snippets from open source, players spot bugs and suggest improvements, leaderboards and achievements, learning paths for different skill levels, mentorship matching, GitHub integration for real-time challenges, and learning milestone badges. Makes it fun to learn what experienced developers look for in code.', 'Tech', 'https://github.com/sparks/code-review-game', 15);

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count) VALUES
((SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1), 'DIY Garden Design with AR', 'Visualize and plan your garden using AR technology', 'A mobile app for garden design and planning. Features: AR visualization to see plants in different locations, plant database with care requirements and companion planting, seasonal planning reminders, water/sunlight calculators, community garden designs for inspiration, shopping list integration, progress tracking with photos, and bug identification camera. Perfect for urban gardeners and green-thumb enthusiasts.', 'Design', NULL, 7);

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count) VALUES
((SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1), 'Community Event Matching Platform', 'Connect people with local events matching their interests', 'A platform matching people with local events. Features: smart matching based on interests, aggregates events from Meetup/Eventbrite/local venues, personalized recommendations, friend connections through events, attendee reviews and insights, calendar sync and reminders, diversity filtering for inclusive events, and virtual event support. Helps people find community and build connections through shared interests.', 'Product', 'https://github.com/sparks/event-matching', 10);

INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count) VALUES
((SELECT id FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1), 'Habit Stacking Tracker', 'Build new habits by anchoring them to existing ones', 'Mobile app based on habit stacking methodology. Features: link new habits to existing daily routines, smart notifications at optimal times, visual habit chains that grow, gamification and streaks for motivation, community challenges and accountability, physics-based animations for satisfying check-ins, reflection prompts at strategic intervals, and habit data export. Makes forming habits easier by connecting to existing routines.', 'Wellness', NULL, 9);

-- Verify the data was inserted
SELECT COUNT(*) as total_ideas FROM ideas;
SELECT title, tag, likes_count FROM ideas ORDER BY created_at DESC;
