import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Idea, type Contribution } from '@/lib/supabase';

// ============ QUERY HOOKS ============

export const useIdeas = () => {
  return useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Idea[];
    },
  });
};

export const useIdea = (ideaId: string) => {
  return useQuery({
    queryKey: ['idea', ideaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .single();
      
      if (error) throw error;
      return data as Idea;
    },
    enabled: !!ideaId,
  });
};

export const useContributions = (ideaId: string) => {
  return useQuery({
    queryKey: ['contributions', ideaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Contribution[];
    },
    enabled: !!ideaId,
  });
};

export const useUserIdeas = (userId: string) => {
  return useQuery({
    queryKey: ['user-ideas', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Idea[];
    },
    enabled: !!userId,
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
      owner_id: string;
    }) => {
      const { data, error } = await supabase
        .from('ideas')
        .insert([input])
        .select()
        .single();
      
      if (error) throw error;
      return data as Idea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useUpdateIdea = (ideaId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Idea>) => {
      const { data, error } = await supabase
        .from('ideas')
        .update(updates)
        .eq('id', ideaId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Idea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea', ideaId] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useDeleteIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ideaId: string) => {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useLikeIdea = (ideaId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      // Check if already liked
      const { data: likes } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('idea_id', ideaId);
      
      if (likes && likes.length > 0) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('idea_id', ideaId);
        
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert([{ user_id: userId, idea_id: ideaId }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea', ideaId] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useProposeContribution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: {
      idea_id: string;
      author_id: string;
      content: string;
    }) => {
      const { data, error } = await supabase
        .from('contributions')
        .insert([input])
        .select()
        .single();
      
      if (error) throw error;
      return data as Contribution;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contributions', data.idea_id] });
    },
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
      const { data, error } = await supabase
        .from('contributions')
        .update({ status })
        .eq('id', contributionId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Contribution;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
  });
};
