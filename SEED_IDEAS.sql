-- Brainstorm Flow - Sample Data Seed
-- Insert demo ideas so new users see content on arrival
-- You can paste this into your Supabase SQL Editor

-- Note: First, create a demo/system user (optional, or use your own user_id)
-- Then insert sample ideas that showcase the app

-- 1. INSERT DEMO USER (if you want a "System" user for seed data)
INSERT INTO users (auth_id, email, name, avatar_url, bio)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'demo@sparkboard.app',
  'Sparkboard Demo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  $$Showcasing ideas for the Sparkboard community$$
)
ON CONFLICT (email) DO NOTHING;

-- 2. INSERT SAMPLE IDEAS
-- Idea 1: AI-Powered Writing Assistant
INSERT INTO ideas (
  user_id,
  title,
  brief,
  description,
  tag,
  github_url,
  likes_count
)
SELECT 
  id,
  'AI-Powered Writing Assistant',
  'Real-time writing suggestions using AI',
  $$A browser extension and web app that provides intelligent writing suggestions, grammar correction, and tone adjustment in real-time. Features include: Multi-language support, custom writing style preferences, integration with popular platforms (Gmail, Notion, Medium), offline mode for privacy, and community feedback on suggestions. This would help non-native speakers, professional writers, and students improve their writing quality instantly.$$,
  'Tech',
  'https://github.com/sparks/ai-writing-assistant',
  12
FROM users u
WHERE u.email = 'demo@sparkboard.app';

-- Idea 2: Sustainable Fashion Marketplace
INSERT INTO ideas (
  user_id,
  title,
  brief,
  description,
  tag,
  github_url,
  likes_count
)
SELECT 
  id,
  'Sustainable Fashion Marketplace',
  'Connect eco-conscious fashion brands with conscious consumers',
  $$An e-commerce platform dedicated to sustainable fashion that:

- Verifies sustainability certifications (B-Corp, Fair Trade, etc.)
- Shows the environmental impact of each product
- Connects local artisans with global audiences
- Provides carbon offset options for shipping
- Educates users about sustainable fabrics
- Creates a community around ethical fashion

It's like Etsy meets Patagonia - combining marketplace dynamics with environmental responsibility.$$,
  'Product',
  'https://github.com/sparks/sustainable-fashion',
  8
FROM users u
WHERE u.email = 'demo@sparkboard.app'
ON CONFLICT DO NOTHING;

-- Idea 3: Mental Health Check-in Bot
INSERT INTO ideas (
  user_id,
  title,
  brief,
  description,
  tag,
  github_url,
  likes_count
)
SELECT 
  id,
  'Mental Health Check-in Bot',
  'Gentle daily check-ins using conversational AI',
  $$A Discord/Slack bot that helps teams support mental health through:

- Daily mood check-ins with contextual follow-ups
- Anonymous wellness surveys and insights
- Resources for common struggles (burnout, stress, etc.)
- Connection to professional help when needed
- Team health dashboard (aggregate, anonymized data)
- Integration with meditation/wellness apps
- Peer support matching

Designed with privacy and sensitivity as core values. Would help remote teams stay connected emotionally.$$,
  'Life',
  null,
  5
FROM users u
WHERE u.email = 'demo@sparkboard.app'
ON CONFLICT DO NOTHING;

-- Idea 4: Code Review Game
INSERT INTO ideas (
  user_id,
  title,
  brief,
  description,
  tag,
  github_url,
  likes_count
)
SELECT 
  id,
  'Code Review Game - Learn by Playing',
  'Gamified platform for learning code review best practices',
  $$Turn code review into an engaging learning experience:

- Real code snippets from open source projects
- Players spot bugs, suggest improvements, and discuss tradeoffs
- Leaderboards and achievements
- Learning paths for different skill levels
- Mentorship matching between experienced and junior devs
- Integration with GitHub for real-time challenges
- Badges for learning milestones

Makes it fun to learn what experienced developers look for in code reviews.$$,
  'Tech',
  'https://github.com/sparks/code-review-game',
  15
FROM users u
WHERE u.email = 'demo@sparkboard.app'
ON CONFLICT DO NOTHING;

-- Idea 5: DIY Garden Design Tool
INSERT INTO ideas (
  user_id,
  title,
  brief,
  description,
  tag,
  github_url,
  likes_count
)
SELECT 
  id,
  'DIY Garden Design with AR',
  'Visualize and plan your garden using AR technology',
  $$A mobile app that helps people design and plan their gardens:

- AR visualization to see plants in different locations
- Plant database with care requirements and companion planting
- Seasonal planning reminders
- Water/sunlight requirement calculator
- Community garden designs to inspire
- Shopping list integration for supplies
- Progress tracking with photos
- Bug identification camera feature

Combines beautiful design with practical gardening knowledge. Perfect for urban gardeners and green-thumb enthusiasts.$$,
  'Design',
  null,
  7
FROM users u
WHERE u.email = 'demo@sparkboard.app'
ON CONFLICT DO NOTHING;

-- Idea 6: Community Event Matching
INSERT INTO ideas (
  user_id,
  title,
  brief,
  description,
  tag,
  github_url,
  likes_count
)
SELECT 
  id,
  'Community Event Matching Platform',
  'Connect people with local events matching their interests',
  $$A platform that matches people with local events:

- Smart matching algorithm based on interests
- Aggregates events from Meetup, EventBrite, local venues
- Personalized recommendations
- Easy friend connections through events
- Reviews and insights from attendees
- Calendar sync and reminders
- Diversity filtering to find inclusive events
- Virtual event support

Helps people find their community and build connections based on shared interests.$$,
  'Product',
  'https://github.com/sparks/event-matching',
  10
FROM users u
WHERE u.email = 'demo@sparkboard.app'
ON CONFLICT DO NOTHING;

-- Idea 7: Habit Stacking Tracker
INSERT INTO ideas (
  user_id,
  title,
  brief,
  description,
  tag,
  github_url,
  likes_count
)
SELECT 
  id,
  'Habit Stacking Tracker',
  'Build new habits by anchoring them to existing ones',
  $$A mobile app based on the habit stacking methodology:

- Link new habits to existing daily routines
- Smart notifications at the right time
- Visual habit chains that grow over time
- Motivation through gamification and streaks
- Community challenges and accountability groups
- Physics-based animations for satisfying check-ins
- Reflection prompts at strategic intervals
- Export habit data for analysis

Makes forming habits easier by connecting them to things you already do.$$,
  'Wellness',
  null,
  9
FROM users u
WHERE u.email = 'demo@sparkboard.app'
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT COUNT(*) as total_ideas FROM ideas;
SELECT title, tag, likes_count FROM ideas ORDER BY created_at DESC;
