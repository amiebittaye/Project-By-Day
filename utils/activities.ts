import { createClient } from './supabase/client';

type TaskActivity = any;

type User = {
  id: string;
  name: string;
  avatar?: string | null;
};

type ActivityResponse = {
  id: string;
  content: TaskActivity;
  created_at: string;
  updated_at: string;
  task_id: string;
  user_id?: string;
  user?: User | null;
};

const supabase = createClient();

export const activities = {
  // Get all activities for a task
  getTaskActivities: async (taskId: string) => {
    const { data, error } = await supabase
      .from('activities')
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        task_id,
        user:user_id (
          id,
          name,
          avatar
        )
      `
      )
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const normalized = (data || []).map((row: any) => {
      const { user, ...rest } = row;
      return {
        ...rest,
        user: Array.isArray(user) ? (user.length ? user[0] : null) : user ?? null,
      };
    });

    return normalized as ActivityResponse[];
  },

  // Create a new activity
  create: async (activity: {
    task_id: string;
    user_id: string;
    content: TaskActivity;
  }) => {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        ...activity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        task_id,
        user_id,
        user:user_id (
          id,
          name,
          avatar
        )
      `
      )
      .single();

    if (error) throw error;
    return data as unknown as ActivityResponse;
  },

  // Create multiple activities at once
  createMany: async (
    activities: {
      task_id: string;
      user_id: string;
      content: TaskActivity;
    }[]
  ) => {
    const { data, error } = await supabase
      .from('activities')
      .insert(
        activities.map((activity) => ({
          ...activity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      )
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        task_id,
        user_id,
        user:user_id (
          id,
          name,
          avatar
        )
      `
      );

    if (error) throw error;
    return data as unknown as ActivityResponse[];
  },

  // Delete an activity
  delete: async (activityId: string) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId);

    if (error) throw error;
  },

  // Update an activity
  update: async (
    activityId: string,
    updates: Partial<Pick<ActivityResponse, 'content'>>
  ) => {
    const { data, error } = await supabase
      .from('activities')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activityId)
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        task_id,
        user_id,
        user:user_id (
          id,
          name,
          avatar
        )
      `
      )
      .single();

    if (error) throw error;
    return data as unknown as ActivityResponse;
  },
};
