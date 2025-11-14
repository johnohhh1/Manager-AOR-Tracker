// useBrandStandards.js - Supabase operations for Brand Standards Validation
import { supabase } from '../supabase';

export const useBrandStandards = () => {
  // ==========================================
  // Validations
  // ==========================================
  const validations = {
    // Create new validation session
    async create(validationData) {
      try {
        const { data, error } = await supabase
          .from('brand_standards_validations')
          .insert([validationData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating validation:', error);
        return { data: null, error };
      }
    },

    // Get validation by ID
    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('brand_standards_validations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching validation:', error);
        return { data: null, error };
      }
    },

    // Get validations with filters
    async getList(filters = {}) {
      try {
        let query = supabase
          .from('brand_standards_validations')
          .select('*')
          .order('validation_date', { ascending: false });

        if (filters.managerId) {
          query = query.eq('manager_id', filters.managerId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.startDate) {
          query = query.gte('validation_date', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('validation_date', filters.endDate);
        }
        if (filters.limit) {
          query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching validations:', error);
        return { data: null, error };
      }
    },

    // Update validation
    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('brand_standards_validations')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating validation:', error);
        return { data: null, error };
      }
    },

    // Delete validation
    async delete(id) {
      try {
        const { error } = await supabase
          .from('brand_standards_validations')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error deleting validation:', error);
        return { error };
      }
    },

    // Complete validation
    async complete(id) {
      try {
        const { data, error } = await supabase
          .from('brand_standards_validations')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error completing validation:', error);
        return { data: null, error };
      }
    }
  };

  // ==========================================
  // Section Results
  // ==========================================
  const sectionResults = {
    // Create section result
    async create(resultData) {
      try {
        const { data, error } = await supabase
          .from('validation_section_results')
          .insert([resultData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating section result:', error);
        return { data: null, error };
      }
    },

    // Get section results for a validation
    async getByValidationId(validationId) {
      try {
        const { data, error } = await supabase
          .from('validation_section_results')
          .select('*')
          .eq('validation_id', validationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching section results:', error);
        return { data: null, error };
      }
    }
  };

  // ==========================================
  // Action Items
  // ==========================================
  const actionItems = {
    // Create action item
    async create(actionData) {
      try {
        const { data, error } = await supabase
          .from('validation_action_items')
          .insert([actionData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating action item:', error);
        return { data: null, error };
      }
    },

    // Get action items with filters
    async getList(filters = {}) {
      try {
        let query = supabase
          .from('validation_action_items')
          .select('*')
          .order('due_date', { ascending: true });

        if (filters.validationId) {
          query = query.eq('validation_id', filters.validationId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.section) {
          query = query.eq('section_name', filters.section);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching action items:', error);
        return { data: null, error };
      }
    },

    // Update action item
    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('validation_action_items')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating action item:', error);
        return { data: null, error };
      }
    },

    // Complete action item
    async complete(id) {
      try {
        const { data, error } = await supabase
          .from('validation_action_items')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error completing action item:', error);
        return { data: null, error };
      }
    },

    // Delete action item
    async delete(id) {
      try {
        const { error } = await supabase
          .from('validation_action_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error deleting action item:', error);
        return { error };
      }
    }
  };

  // ==========================================
  // Photos
  // ==========================================
  const photos = {
    // Save photo
    async create(photoData) {
      try {
        const { data, error } = await supabase
          .from('validation_photos')
          .insert([photoData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error saving photo:', error);
        return { data: null, error };
      }
    },

    // Get photos for a validation
    async getByValidationId(validationId) {
      try {
        const { data, error } = await supabase
          .from('validation_photos')
          .select('*')
          .eq('validation_id', validationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching photos:', error);
        return { data: null, error };
      }
    },

    // Delete photo
    async delete(id) {
      try {
        const { error } = await supabase
          .from('validation_photos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error deleting photo:', error);
        return { error };
      }
    }
  };

  // ==========================================
  // Analytics/Stats
  // ==========================================
  const stats = {
    // Get stats for date range
    async getStats(managerId, startDate, endDate) {
      try {
        // Get validations count
        const { data: validationsData, error: validationsError } = await supabase
          .from('brand_standards_validations')
          .select('id, status')
          .eq('manager_id', managerId)
          .gte('validation_date', startDate)
          .lte('validation_date', endDate);

        if (validationsError) throw validationsError;

        // Get open action items
        const { data: actionsData, error: actionsError } = await supabase
          .from('validation_action_items')
          .select('id, status')
          .in('validation_id', validationsData?.map(v => v.id) || [])
          .eq('status', 'open');

        if (actionsError) throw actionsError;

        // Calculate compliance rate
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('validation_section_results')
          .select('compliant')
          .in('validation_id', validationsData?.map(v => v.id) || []);

        if (sectionsError) throw sectionsError;

        const totalSections = sectionsData?.length || 0;
        const compliantSections = sectionsData?.filter(s => s.compliant).length || 0;
        const complianceRate = totalSections > 0
          ? Math.round((compliantSections / totalSections) * 100)
          : 0;

        return {
          data: {
            totalValidations: validationsData?.length || 0,
            completedValidations: validationsData?.filter(v => v.status === 'completed').length || 0,
            openActionItems: actionsData?.length || 0,
            complianceRate
          },
          error: null
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        return { data: null, error };
      }
    }
  };

  return {
    validations,
    sectionResults,
    actionItems,
    photos,
    stats
  };
};
