-- Brainstorm Flow - Sample Data Seed (Simplified)
-- Using simple descriptions to avoid SQL parsing issues

-- Check demo user exists
SELECT id FROM users WHERE email = 'demo@sparkboard.app';

-- If demo user exists, run these 7 INSERT statements:

-- Idea 1
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'AI-Powered Writing Assistant', 'Real-time writing suggestions', 'Browser extension for intelligent writing suggestions, grammar checking, and tone adjustment with multi-language support and privacy-first offline mode.', 'Tech', 'https://github.com/sparks/ai-writing-assistant', 12
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 2
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Sustainable Fashion Marketplace', 'Eco-conscious fashion platform', 'E-commerce connecting sustainable brands with conscious consumers, showing environmental impact, carbon offsets, and ethical fashion community.', 'Product', 'https://github.com/sparks/sustainable-fashion', 8
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 3
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Mental Health Check-in Bot', 'Daily wellness check-ins for teams', 'Discord/Slack bot for team mental health with mood tracking, wellness surveys, resources for stress and burnout, plus meditation app integration.', 'Life', NULL, 5
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 4
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Code Review Game', 'Gamified code review learning', 'Turn code review into a game with real open source snippets, leaderboards, mentorship matching, and GitHub integration for real-time challenges.', 'Tech', 'https://github.com/sparks/code-review-game', 15
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 5
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'DIY Garden Design with AR', 'Visualize and plan gardens using AR', 'Mobile app with AR visualization, plant database, care requirements, companion planting guides, and progress tracking for urban gardeners.', 'Design', NULL, 7
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 6
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Community Event Matching', 'Connect people with local events', 'Platform aggregating events from Meetup and Eventbrite with smart matching, personalized recommendations, calendar sync, and community building.', 'Product', 'https://github.com/sparks/event-matching', 10
FROM users WHERE email = 'demo@sparkboard.app';

-- Idea 7
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Habit Stacking Tracker', 'Build habits by linking to existing routines', 'Mobile app for habit stacking methodology with smart notifications, visual chains, gamification, community challenges, and progress tracking.', 'Wellness', NULL, 9
FROM users WHERE email = 'demo@sparkboard.app';

-- Verify inserted ideas
SELECT COUNT(*) as total_ideas FROM ideas;
SELECT title, tag, likes_count FROM ideas ORDER BY created_at DESC LIMIT 10;
