-- Brainstorm Flow - Sample Data Seed
-- This version handles existing demo user gracefully

-- OPTION 1: Use the existing demo user (if it already exists)
-- Just run the ideas directly:

-- Idea 1: AI-Powered Writing Assistant
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'AI-Powered Writing Assistant', 'Real-time writing suggestions using AI', 'A browser extension and web app providing intelligent writing suggestions, grammar correction, and tone adjustment. Features: multi-language support, custom writing style preferences, integration with Gmail/Notion/Medium, offline mode for privacy, and community feedback. Helps non-native speakers, professional writers, and students improve writing instantly.', 'Tech', 'https://github.com/sparks/ai-writing-assistant', 12
FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Idea 2: Sustainable Fashion Marketplace
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Sustainable Fashion Marketplace', 'Connect eco-conscious brands with conscious consumers', 'An e-commerce platform for sustainable fashion. Features: verifies sustainability certifications (B-Corp, Fair Trade), shows environmental impact per product, connects local artisans globally, provides carbon offset shipping options, educates on sustainable fabrics, and builds an ethical fashion community. Combines Etsy and Patagonia with environmental responsibility.', 'Product', 'https://github.com/sparks/sustainable-fashion', 8
FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Idea 3: Mental Health Check-in Bot
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Mental Health Check-in Bot', 'Gentle daily check-ins using conversational AI', 'A Discord/Slack bot for team mental health support. Features: daily mood check-ins with contextual follow-ups, anonymous wellness surveys, resources for common struggles (burnout, stress), professional help connection, team health dashboard, meditation app integration, and peer support matching. Designed with privacy and sensitivity as core values for remote team emotional connection.', 'Life', NULL, 5
FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Idea 4: Code Review Game
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Code Review Game - Learn by Playing', 'Gamified platform for learning code review best practices', 'Turn code review into an engaging learning experience. Features: real code snippets from open source, players spot bugs and suggest improvements, leaderboards and achievements, learning paths for different skill levels, mentorship matching, GitHub integration for real-time challenges, and learning milestone badges. Makes it fun to learn what experienced developers look for in code.', 'Tech', 'https://github.com/sparks/code-review-game', 15
FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Idea 5: DIY Garden Design Tool
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'DIY Garden Design with AR', 'Visualize and plan your garden using AR technology', 'A mobile app for garden design and planning. Features: AR visualization to see plants in different locations, plant database with care requirements and companion planting, seasonal planning reminders, water/sunlight calculators, community garden designs for inspiration, shopping list integration, progress tracking with photos, and bug identification camera. Perfect for urban gardeners and green-thumb enthusiasts.', 'Design', NULL, 7
FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Idea 6: Community Event Matching
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Community Event Matching Platform', 'Connect people with local events matching their interests', 'A platform matching people with local events. Features: smart matching based on interests, aggregates events from Meetup/Eventbrite/local venues, personalized recommendations, friend connections through events, attendee reviews and insights, calendar sync and reminders, diversity filtering for inclusive events, and virtual event support. Helps people find community and build connections through shared interests.', 'Product', 'https://github.com/sparks/event-matching', 10
FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Idea 7: Habit Stacking Tracker
INSERT INTO ideas (user_id, title, brief, description, tag, github_url, likes_count)
SELECT id, 'Habit Stacking Tracker', 'Build new habits by anchoring them to existing ones', 'Mobile app based on habit stacking methodology. Features: link new habits to existing daily routines, smart notifications at optimal times, visual habit chains that grow, gamification and streaks for motivation, community challenges and accountability, physics-based animations for satisfying check-ins, reflection prompts at strategic intervals, and habit data export. Makes forming habits easier by connecting to existing routines.', 'Wellness', NULL, 9
FROM users WHERE email = 'demo@sparkboard.app' LIMIT 1;

-- Verify all ideas were inserted
SELECT COUNT(*) as total_ideas FROM ideas;
SELECT title, tag, likes_count FROM ideas ORDER BY created_at DESC;
