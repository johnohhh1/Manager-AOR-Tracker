// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

// Get from environment variables (set in .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey &&
  !supabaseUrl.includes('your_supabase_project_url_here') &&
  !supabaseAnonKey.includes('your_supabase_anon_key_here');

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured - app will work in local-only mode');
  console.log('To enable cloud sync, add your Supabase credentials to .env file');
}

// Create a mock client if Supabase is not configured
const createMockClient = () => ({
  from: () => ({
    insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
      })
    }),
    upsert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) })
  }),
  rpc: async () => ({ data: null, error: { message: 'Supabase not configured' } })
});

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Database helper functions
export const db = {
  // Manager functions
  managers: {
    async create(managerData) {
      const { data, error } = await supabase
        .from('managers')
        .insert([managerData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getByName(name) {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .eq('name', name)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async getTeamMembers(gmId) {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          member:member_id(*)
        `)
        .eq('gm_id', gmId);
      
      if (error) throw error;
      return data?.map(tm => tm.member) || [];
    }
  },

  // Task completion functions
  tasks: {
    async saveCompletion(managerId, taskName, frequency, completed, completionDate, fiscalPeriod, fiscalWeek) {
      const { data, error } = await supabase
        .from('task_completions')
        .upsert({
          manager_id: managerId,
          task_name: taskName,
          frequency: frequency,
          completion_date: completionDate,
          fiscal_period: fiscalPeriod,
          fiscal_week: fiscalWeek,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'manager_id,task_name,frequency,completion_date'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getCompletions(managerId, completionDate) {
      const { data, error } = await supabase
        .from('task_completions')
        .select('*')
        .eq('manager_id', managerId)
        .eq('completion_date', completionDate);
      
      if (error) throw error;
      return data || [];
    },

    async getCompletionsByDateRange(managerId, startDate, endDate) {
      const { data, error } = await supabase
        .from('task_completions')
        .select('*')
        .eq('manager_id', managerId)
        .gte('completion_date', startDate)
        .lte('completion_date', endDate);
      
      if (error) throw error;
      return data || [];
    },

    async getPeriodCompletions(managerId, fiscalPeriod, fiscalYear = 26) {
      const { data, error } = await supabase
        .from('task_completions')
        .select('*')
        .eq('manager_id', managerId)
        .eq('fiscal_period', fiscalPeriod);
      
      if (error) throw error;
      return data || [];
    }
  },

  // Period metrics functions
  metrics: {
    async savePeriodMetrics(managerId, period, year, metrics) {
      const { data, error } = await supabase
        .from('period_metrics')
        .upsert({
          manager_id: managerId,
          fiscal_period: period,
          fiscal_year: year,
          daily_completion_rate: metrics.daily,
          weekly_completion_rate: metrics.weekly,
          monthly_completion_rate: metrics.monthly,
          quarterly_completion_rate: metrics.quarterly,
          calculated_at: new Date().toISOString()
        }, {
          onConflict: 'manager_id,fiscal_period,fiscal_year'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getPeriodMetrics(managerId, period, year = 26) {
      const { data, error } = await supabase
        .from('period_metrics')
        .select('*')
        .eq('manager_id', managerId)
        .eq('fiscal_period', period)
        .eq('fiscal_year', year)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  },

  // Team functions
  team: {
    async addTeamMember(gmId, memberId) {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          gm_id: gmId,
          member_id: memberId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async removeTeamMember(gmId, memberId) {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('gm_id', gmId)
        .eq('member_id', memberId);
      
      if (error) throw error;
      return true;
    }
  }
};
