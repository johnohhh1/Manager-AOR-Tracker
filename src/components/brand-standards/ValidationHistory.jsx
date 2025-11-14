import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { colors } from '../../styles/design-system';
import { useBrandStandards } from '../../hooks/useBrandStandards';
import { format } from 'date-fns';

const ValidationHistory = ({ manager, onBack }) => {
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValidation, setSelectedValidation] = useState(null);

  const brandStandards = useBrandStandards();

  useEffect(() => {
    loadValidations();
  }, [manager]);

  const loadValidations = async () => {
    setLoading(true);
    try {
      const { data, error } = await brandStandards.validations.getList({
        managerId: manager.name,
        limit: 50
      });

      if (data) {
        setValidations(data);
      }
    } catch (error) {
      console.error('Error loading validations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadValidationDetails = async (validation) => {
    try {
      // Get section results
      const { data: sections } = await brandStandards.sectionResults.getByValidationId(validation.id);

      // Get action items
      const { data: actions } = await brandStandards.actionItems.getList({
        validationId: validation.id
      });

      setSelectedValidation({
        ...validation,
        sections: sections || [],
        actions: actions || []
      });
    } catch (error) {
      console.error('Error loading validation details:', error);
    }
  };

  if (selectedValidation) {
    const totalSections = selectedValidation.sections.length;
    const compliantSections = selectedValidation.sections.filter(s => s.compliant).length;
    const complianceRate = totalSections > 0
      ? Math.round((compliantSections / totalSections) * 100)
      : 0;

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
        {/* Header */}
        <div className="bg-white shadow-sm p-4">
          <button
            onClick={() => setSelectedValidation(null)}
            className="mb-3 flex items-center text-sm hover:opacity-70 transition-opacity cursor-pointer"
            style={{ color: colors.chiliNavy }}
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to History
          </button>
          <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
            Validation Details
          </h1>
          <p className="text-sm" style={{ color: colors.chiliBrown }}>
            {format(new Date(selectedValidation.validation_date), 'MMMM d, yyyy')} • {selectedValidation.shift} Shift
          </p>
        </div>

        {/* Summary Stats */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold" style={{ color: colors.chiliGreen }}>
              {complianceRate}%
            </div>
            <div className="text-sm" style={{ color: colors.chiliBrown }}>
              Compliance
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold" style={{ color: colors.chiliRed }}>
              {selectedValidation.actions.length}
            </div>
            <div className="text-sm" style={{ color: colors.chiliBrown }}>
              Action Items
            </div>
          </div>
        </div>

        {/* Section Results */}
        <div className="p-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
              Section Results
            </h3>
            <div className="space-y-2">
              {selectedValidation.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border-l-4"
                  style={{
                    backgroundColor: section.compliant ? '#f0fdf4' : '#fef2f2',
                    borderColor: section.compliant ? colors.chiliGreen : colors.chiliRed
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold" style={{ color: colors.chiliNavy }}>
                        {section.section_name}
                      </div>
                      <div className="text-sm" style={{ color: colors.chiliBrown }}>
                        {section.items_checked}/{section.items_total} items checked
                      </div>
                    </div>
                    <div className="text-right">
                      {section.compliant ? (
                        <CheckCircle size={20} style={{ color: colors.chiliGreen }} />
                      ) : (
                        <AlertTriangle size={20} style={{ color: colors.chiliRed }} />
                      )}
                      {section.issues_found > 0 && (
                        <div className="text-sm mt-1" style={{ color: colors.chiliRed }}>
                          {section.issues_found} issue{section.issues_found > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Items */}
        {selectedValidation.actions.length > 0 && (
          <div className="p-4">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
                Action Items Created
              </h3>
              <div className="space-y-2">
                {selectedValidation.actions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded border-l-4"
                    style={{
                      backgroundColor: colors.chiliCream,
                      borderColor: action.status === 'completed' ? colors.chiliGreen : colors.chiliRed
                    }}
                  >
                    <div className="font-bold" style={{ color: colors.chiliNavy }}>
                      {action.issue_description}
                    </div>
                    <div className="text-sm mt-1" style={{ color: colors.chiliBrown }}>
                      <strong>Action:</strong> {action.action_required}
                    </div>
                    <div className="text-sm" style={{ color: colors.chiliBrown }}>
                      <strong>Owner:</strong> {action.owner} • <strong>Due:</strong> {format(new Date(action.due_date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs mt-1 font-medium" style={{
                      color: action.status === 'completed' ? colors.chiliGreen : colors.chiliYellow
                    }}>
                      Status: {action.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {selectedValidation.notes && (
          <div className="p-4">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>
                Notes
              </h3>
              <p className="text-sm" style={{ color: colors.chiliBrown }}>
                {selectedValidation.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <button
          onClick={onBack}
          className="mb-3 flex items-center text-sm hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color: colors.chiliNavy }}
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
          Validation History
        </h1>
        <p className="text-sm" style={{ color: colors.chiliBrown }}>
          {manager.name}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-8 text-center" style={{ color: colors.chiliBrown }}>
          Loading validations...
        </div>
      )}

      {/* Validations List */}
      {!loading && validations.length === 0 && (
        <div className="p-8 text-center">
          <p style={{ color: colors.chiliBrown }}>
            No validations found. Start your first validation to see it here!
          </p>
        </div>
      )}

      {!loading && validations.length > 0 && (
        <div className="p-4 space-y-3">
          {validations.map((validation) => (
            <button
              key={validation.id}
              onClick={() => loadValidationDetails(validation)}
              className="w-full bg-white rounded-lg p-4 text-left shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} style={{ color: colors.chiliNavy }} />
                    <span className="font-bold" style={{ color: colors.chiliNavy }}>
                      {format(new Date(validation.validation_date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: colors.chiliBrown }}>
                    {validation.shift} Shift
                  </div>
                  {validation.completed_at && (
                    <div className="text-xs mt-1" style={{ color: colors.chiliGreen }}>
                      Completed {format(new Date(validation.completed_at), 'h:mm a')}
                    </div>
                  )}
                </div>
                <div>
                  {validation.status === 'completed' ? (
                    <CheckCircle size={24} style={{ color: colors.chiliGreen }} />
                  ) : (
                    <Clock size={24} style={{ color: colors.chiliYellow }} />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ValidationHistory;
