import { create } from "zustand";

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

interface IdeasState {
  users: MockUser[];
  currentUserId: string;
  ideas: Idea[];
  contributions: Contribution[];
  setCurrentUser: (id: string) => void;
  addIdea: (input: {
    title: string;
    brief: string;
    description: string;
    tag: string;
    githubUrl?: string;
  }) => string;
  proposeContribution: (input: { ideaId: string; content: string }) => void;
  setContributionStatus: (id: string, status: ContributionStatus) => void;
  toggleLike: (ideaId: string) => void;
}

const seedIdeas: Idea[] = [
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

const seedContributions: Contribution[] = [
  {
    id: "c_1",
    ideaId: "i_notes",
    authorId: "u_theo",
    authorName: "Theo Park",
    content:
      "Add a 'mood tag' to each note (calm, spark, todo) that subtly tints the card.",
    status: "approved",
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: "c_2",
    ideaId: "i_notes",
    authorId: "u_sandra",
    authorName: "Sandra Lee",
    content:
      "What about a weekly 'sketchbook recap' that stitches notes into a story?",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 30,
  },
];

export const useIdeasStore = create<IdeasState>((set, get) => ({
  users: MOCK_USERS,
  currentUserId: "u_sandra",
  ideas: seedIdeas,
  contributions: seedContributions,

  setCurrentUser: (id) => set({ currentUserId: id }),

  addIdea: ({ title, brief, description, tag, githubUrl }) => {
    const { currentUserId, users } = get();
    const owner = users.find((u) => u.id === currentUserId)!;
    const id = `i_${Math.random().toString(36).slice(2, 9)}`;
    const idea: Idea = {
      id,
      title,
      brief,
      description,
      tag,
      githubUrl: githubUrl?.trim() ? githubUrl.trim() : undefined,
      ownerId: owner.id,
      ownerName: owner.name,
      likes: 0,
      createdAt: Date.now(),
    };
    set((s) => ({ ideas: [idea, ...s.ideas] }));
    return id;
  },

  proposeContribution: ({ ideaId, content }) => {
    const { currentUserId, users } = get();
    const author = users.find((u) => u.id === currentUserId)!;
    const contribution: Contribution = {
      id: `c_${Math.random().toString(36).slice(2, 9)}`,
      ideaId,
      authorId: author.id,
      authorName: author.name,
      content,
      status: "pending",
      createdAt: Date.now(),
    };
    set((s) => ({ contributions: [contribution, ...s.contributions] }));
  },

  setContributionStatus: (id, status) =>
    set((s) => ({
      contributions: s.contributions.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    })),

  toggleLike: (ideaId) =>
    set((s) => ({
      ideas: s.ideas.map((i) =>
        i.id === ideaId ? { ...i, likes: i.likes + 1 } : i
      ),
    })),
}));
