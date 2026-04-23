// Mock store - use React Query hooks from @/hooks/useApi for backend data
// This file provides fallback data for components during transition to React Query

export type ContributionStatus = "pending" | "approved" | "rejected";

export interface Contribution {
  id: string;
  ideaId: string;
  authorId: string;
  authorName: string;
  content: string;
  status: ContributionStatus;
  createdAt: number;
}

export interface Idea {
  id: string;
  title: string;
  brief: string;
  description: string;
  tag: string;
  githubUrl?: string;
  ownerId: string;
  ownerName: string;
  likes: number;
  createdAt: number;
}

export interface MockUser {
  id: string;
  name: string;
}

const MOCK_USERS: MockUser[] = [
  { id: "u_sandra", name: "Sandra Lee" },
  { id: "u_mira", name: "Mira Chen" },
  { id: "u_theo", name: "Theo Park" },
];

const MOCK_IDEAS: Idea[] = [
  {
    id: "i_notes",
    title: "Soft UI for note apps",
    brief: "A calmer, pastel-first notes experience.",
    description:
      "Most note apps look like spreadsheets. What if a notes app felt like a sketchbook — soft pastels, rounded cards, gentle motion — designed to lower the cost of capturing a thought?",
    tag: "Design",
    githubUrl: "https://github.com/sparkboard/soft-notes",
    ownerId: "u_mira",
    ownerName: "Mira Chen",
    likes: 128,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "i_standup",
    title: "Async standups via voice memo",
    brief: "60-second daily voice memos instead of meetings.",
    description:
      "Replace the daily standup with a 60-second voice memo per teammate, auto-transcribed and grouped by project. Async, searchable, and respectful of focus time.",
    tag: "Product",
    githubUrl: undefined,
    ownerId: "u_theo",
    ownerName: "Theo Park",
    likes: 86,
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
];

const MOCK_CONTRIBUTIONS: Contribution[] = [
  {
    id: "c_1",
    ideaId: "i_notes",
    authorId: "u_theo",
    authorName: "Theo Park",
    content: "Add a 'mood tag' to each note (calm, spark, todo) that subtly tints the card.",
    status: "approved",
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: "c_2",
    ideaId: "i_notes",
    authorId: "u_sandra",
    authorName: "Sandra Lee",
    content: "What about a weekly 'sketchbook recap' that stitches notes into a story?",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 30,
  },
];

// Mock store state (for backward compatibility during migration to React Query)
let mockState = {
  users: MOCK_USERS,
  currentUserId: "u_sandra",
  ideas: MOCK_IDEAS,
  contributions: MOCK_CONTRIBUTIONS,
};

// Export as a mock hook for backward compatibility
// Components should migrate to useApi hooks from @/hooks/useApi
export const useIdeasStore = ((selector: any) => {
  return selector(mockState);
}) as any;

// Static methods for compatibility
useIdeasStore.getState = () => mockState;
useIdeasStore.setState = (state: any) => {
  mockState = { ...mockState, ...state };
};
