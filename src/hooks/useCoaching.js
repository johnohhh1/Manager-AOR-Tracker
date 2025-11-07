// useCoaching.js - Supabase operations for coaching features
import { supabase } from '../supabase';

export const useCoaching = () => {
  // ==========================================
  // Floor Observations
  // ==========================================
  const floorObservations = {
    // Create new floor observation
    async create(observationData) {
      try {
        const { data, error } = await supabase
          .from('floor_observations')
          .insert([observationData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating floor observation:', error);
        return { data: null, error };
      }
    },

    // Get floor observations with filters
    async getList(filters = {}) {
      try {
        let query = supabase
          .from('floor_observations')
          .select('*')
          .order('shift_date', { ascending: false });

        if (filters.managerId) {
          query = query.eq('manager_id', filters.managerId);
        }
        if (filters.startDate) {
          query = query.gte('shift_date', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('shift_date', filters.endDate);
        }
        if (filters.shiftType) {
          query = query.eq('shift_type', filters.shiftType);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching floor observations:', error);
        return { data: null, error };
      }
    },

    // Get single observation
    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('floor_observations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching observation:', error);
        return { data: null, error };
      }
    },

    // Update observation
    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('floor_observations')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating observation:', error);
        return { data: null, error };
      }
    },

    // Delete observation
    async delete(id) {
      try {
        const { error } = await supabase
          .from('floor_observations')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { success: true, error: null };
      } catch (error) {
        console.error('Error deleting observation:', error);
        return { success: false, error };
      }
    }
  };

  // ==========================================
  // Team Members Management
  // ==========================================
  const teamMembers = {
    // Create new team member
    async create(memberData) {
      try {
        const { data, error } = await supabase
          .from('coaching_team_members')
          .insert([memberData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating team member:', error);
        return { data: null, error };
      }
    },

    // Get team members for a manager
    async getByManagerId(managerId) {
      try {
        const { data, error } = await supabase
          .from('coaching_team_members')
          .select('*')
          .eq('manager_id', managerId)
          .eq('active', true)
          .order('name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching team members:', error);
        return { data: null, error };
      }
    },

    // Get all team members (for GM view)
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('coaching_team_members')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching all team members:', error);
        return { data: null, error };
      }
    },

    // Update team member
    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('coaching_team_members')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating team member:', error);
        return { data: null, error };
      }
    },

    // Soft delete (deactivate) team member
    async deactivate(id) {
      try {
        const { error } = await supabase
          .from('coaching_team_members')
          .update({ active: false })
          .eq('id', id);

        if (error) throw error;
        return { success: true, error: null };
      } catch (error) {
        console.error('Error deactivating team member:', error);
        return { success: false, error };
      }
    }
  };

  // ==========================================
  // Weekly 1:1s
  // ==========================================
  const oneOnOnes = {
    // Create new 1:1
    async create(oneOnOneData) {
      try {
        const { data, error } = await supabase
          .from('one_on_ones')
          .insert([oneOnOneData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating 1:1:', error);
        return { data: null, error };
      }
    },

    // Get 1:1s for a manager (including shared ones)
    async getForManager(managerId) {
      try {
        const { data, error } = await supabase
          .rpc('get_visible_one_on_ones', { manager_id_param: managerId });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching 1:1s:', error);
        return { data: null, error };
      }
    },

    // Get 1:1s by team member
    async getByTeamMember(teamMemberId) {
      try {
        const { data, error } = await supabase
          .from('one_on_ones')
          .select(`
            *,
            team_member:team_member_id (
              name,
              position
            )
          `)
          .eq('team_member_id', teamMemberId)
          .order('meeting_date', { ascending: false });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching team member 1:1s:', error);
        return { data: null, error };
      }
    },

    // Get single 1:1
    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('one_on_ones')
          .select(`
            *,
            team_member:team_member_id (
              name,
              position,
              hire_date,
              cross_training
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching 1:1:', error);
        return { data: null, error };
      }
    },

    // Update 1:1
    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('one_on_ones')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating 1:1:', error);
        return { data: null, error };
      }
    },

    // Delete 1:1
    async delete(id) {
      try {
        const { error } = await supabase
          .from('one_on_ones')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { success: true, error: null };
      } catch (error) {
        console.error('Error deleting 1:1:', error);
        return { success: false, error };
      }
    }
  };

  // ==========================================
  // Scenario Practice
  // ==========================================
  const scenarioPractice = {
    // Record scenario practice
    async create(practiceData) {
      try {
        const { data, error } = await supabase
          .from('scenario_practice')
          .insert([practiceData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error recording scenario practice:', error);
        return { data: null, error };
      }
    },

    // Get practice history for manager
    async getByManager(managerId) {
      try {
        const { data, error } = await supabase
          .from('scenario_practice')
          .select('*')
          .eq('manager_id', managerId)
          .order('practiced_date', { ascending: false });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching practice history:', error);
        return { data: null, error };
      }
    }
  };

  // ==========================================
  // Coaching Activity & Analytics
  // ==========================================
  const activity = {
    // Record coaching activity
    async record(activityData) {
      try {
        const { data, error } = await supabase
          .from('coaching_activity')
          .insert([activityData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error recording activity:', error);
        return { data: null, error };
      }
    },

    // Get coaching metrics for a manager
    async getMetrics(managerId, startDate, endDate) {
      try {
        const { data, error } = await supabase
          .rpc('get_coaching_metrics', {
            manager_id_param: managerId,
            start_date: startDate,
            end_date: endDate
          });

        if (error) throw error;
        return { data: data?.[0] || {}, error: null };
      } catch (error) {
        console.error('Error fetching coaching metrics:', error);
        return { data: null, error };
      }
    },

    // Get recent activity for dashboard
    async getRecent(managerId, limit = 10) {
      try {
        const { data, error } = await supabase
          .from('coaching_activity')
          .select(`
            *,
            team_member:team_member_id (
              name,
              position
            )
          `)
          .eq('manager_id', managerId)
          .order('activity_date', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        return { data: null, error };
      }
    }
  };

  return {
    floorObservations,
    teamMembers,
    oneOnOnes,
    scenarioPractice,
    activity
  };
};