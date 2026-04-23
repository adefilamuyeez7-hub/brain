import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Idea, type Contribution } from '@/lib/supabase';
import { getErrorMessage } from '@/lib/apiErrors';

// Error handler wrapper
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  const message = error?.message || 'Failed to fetch data';
  const apiError = new Error(message);
  (apiError as any).originalError = error;
  throw apiError;
};

// ============ QUERY HOOKS ============

/**
 * Fetch all ideas with pagination and optimizations
 * Limits to 50 per page, selects only needed fields
 */
export const useIdeas = (page: number = 1, limit: number = 50) => {
  const offset = (page - 1) * limit;
  
  return useQuery({
    queryKey: ['ideas', page, limit],
    queryFn: async () => {
      try {
        const { data, error, count } = await supabase
          .from('ideas')
          .select('id, title, brief, tag, owner_name, likes_count, user_id, created_at', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (error) handleApiError(error);
        return { data: data as Idea[], total: count || 0 };
      } catch (error) {
        handleApiError(error);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};

/**
 * Fetch single idea with all details
 */
export const useIdea = (ideaId: string) => {
  return useQuery({
    queryKey: ['idea', ideaId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .eq('id', ideaId)
          .single();
        
        if (error) handleApiError(error);
        return data as Idea;
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!ideaId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};

/**
 * Fetch contributions for an idea (paginated)
 */
export const useContributions = (ideaId: string, page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  
  return useQuery({
    queryKey: ['contributions', ideaId, page],
    queryFn: async () => {
      try {
        const { data, error, count } = await supabase
          .from('contributions')
          .select('id, idea_id, user_id, title, description, status, created_at', { count: 'exact' })
          .eq('idea_id', ideaId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (error) handleApiError(error);
        return { data: data as Contribution[], total: count || 0 };
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!ideaId,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};

/**
 * Fetch user's ideas (paginated)
 */
export const useUserIdeas = (userId: string, page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  
  return useQuery({
    queryKey: ['user-ideas', userId, page],
    queryFn: async () => {
      try {
        const { data, error, count } = await supabase
          .from('ideas')
          .select('id, title, brief, tag, likes_count, created_at', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (error) handleApiError(error);
        return { data: data as Idea[], total: count || 0 };
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};

/**
 * Get approved contributions count for an idea (cached separately)
 */
export const useApprovedContributionsCount = (ideaId: string) => {
  return useQuery({
    queryKey: ['approved-count', ideaId],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('contributions')
          .select('id', { count: 'exact', head: true })
          .eq('idea_id', ideaId)
          .eq('status', 'approved');
        
        if (error) handleApiError(error);
        return count || 0;
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!ideaId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};

// ============ MUTATION HOOKS ============

export const useCreateIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: {
      title: string;
      brief: string;
      description: string;
      tag: string;
      github_url?: string;
      user_id: string;
    }) => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .insert([input])
          .select()
          .single();
        
        if (error) handleApiError(error);
        return data as Idea;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      // Invalidate all ideas queries
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
    retry: 1,
  });
};

export const useUpdateIdea = (ideaId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Idea>) => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .update(updates)
          .eq('id', ideaId)
          .select()
          .single();
        
        if (error) handleApiError(error);
        return data as Idea;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea', ideaId] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
    retry: 1,
  });
};

export const useDeleteIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ideaId: string) => {
      try {
        const { error } = await supabase
          .from('ideas')
          .delete()
          .eq('id', ideaId);
        
        if (error) handleApiError(error);
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
    retry: 1,
  });
};

/**
 * Like/unlike idea (toggle)
 */
export const useLikeIdea = (ideaId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        // Check if already liked
        const { data: likes, error: checkError } = await supabase
          .from('likes')
          .select('id', { head: true })
          .eq('user_id', userId)
          .eq('idea_id', ideaId);
        
        if (checkError) handleApiError(checkError);

        if (likes && likes.length > 0) {
          // Unlike
          const { error } = await supabase
            .from('likes')
            .delete()
            .eq('user_id', userId)
            .eq('idea_id', ideaId);
          
          if (error) handleApiError(error);
        } else {
          // Like
          const { error } = await supabase
            .from('likes')
            .insert([{ user_id: userId, idea_id: ideaId }]);
          
          if (error) handleApiError(error);
        }
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea', ideaId] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
    retry: 1,
  });
};

export const useProposeContribution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: {
      idea_id: string;
      user_id: string;
      title: string;
      description: string;
    }) => {
      try {
        const { data, error } = await supabase
          .from('contributions')
          .insert([input])
          .select()
          .single();
        
        if (error) handleApiError(error);
        return data as Contribution;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contributions', data.idea_id] });
    },
    retry: 1,
  });
};

export const useSetContributionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      contributionId,
      status,
    }: {
      contributionId: string;
      status: 'approved' | 'rejected';
    }) => {
      try {
        const { data, error } = await supabase
          .from('contributions')
          .update({ status })
          .eq('id', contributionId)
          .select()
          .single();
        
        if (error) handleApiError(error);
        return data as Contribution;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
    retry: 1,
  });
};
