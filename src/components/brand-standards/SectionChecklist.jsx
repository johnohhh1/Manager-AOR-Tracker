import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { colors } from '../../styles/design-system';
import { useBrandStandards } from '../../hooks/useBrandStandards';
import { getBrandStandardsSection, getBrandStandardsItems } from '../../data/brandStandardsData';
import CameraCapture from './CameraCapture';
import ActionItemForm from './ActionItemForm';

const SectionChecklist = ({ section, validation, onNext, onPrevious, isFirst, isLast, existingData }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [issues, setIssues] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const brandStandards = useBrandStandards();

  // Get section data from brandStandardsData.js
  const sectionData = getBrandStandardsSection(section.id);
  const checklistItems = getBrandStandardsItems(section.id);

  // Load existing data if returning to this section
  useEffect(() => {
    if (existingData) {
      setCheckedItems(existingData.checkedItems || {});
      setIssues(existingData.issues || []);
    }
  }, [existingData]);

  const handleItemCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleFlagIssue = (item) => {
    setSelectedItem(item);
    setShowActionForm(true);
  };

  const handleActionItemSaved = (actionItem) => {
    setIssues(prev => [...prev, actionItem]);
    setShowActionForm(false);
    setSelectedItem(null);
  };

  const handleSaveAndContinue = async () => {
    setSaving(true);
    try {
      const issuesCount = issues.length;
      const itemsChecked = Object.keys(checkedItems).filter(k => checkedItems[k]).length;
      const itemsTotal = checklistItems.length;

      // Save section results to database
      await brandStandards.sectionResults.create({
        validation_id: validation.id,
        section_name: section.name,
        items_checked: itemsChecked,
        items_total: itemsTotal,
        issues_found: issuesCount,
        compliant: issuesCount === 0
      });

      // If this is the last section, complete the validation
      if (isLast) {
        await brandStandards.validations.complete(validation.id);
      }

      // Pass data to parent
      onNext({
        checkedItems,
        issues,
        stats: { itemsChecked, itemsTotal, issuesCount }
      });
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error saving section. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const checkedCount = Object.keys(checkedItems).filter(k => checkedItems[k]).length;
  const totalCount = checklistItems.length;
  const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="pb-20"> {/* Padding for fixed navigation dots */}
      {/* Reference Photos Section */}
      {sectionData?.referencePhotos && sectionData.referencePhotos.length > 0 && (
        <div className="bg-white rounded-lg p-4 m-4 shadow-md">
          <h3 className="font-bold mb-3 flex items-center" style={{ color: colors.chiliNavy }}>
            📸 Reference Standards
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {sectionData.referencePhotos.map((photo, idx) => (
              <div key={idx} className="text-center">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="rounded border w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ borderColor: colors.chiliGray }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                  }}
                />
                <p className="text-xs mt-1" style={{ color: colors.chiliBrown }}>
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Section */}
      <div className="bg-white rounded-lg p-4 m-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold" style={{ color: colors.chiliNavy }}>
            Section Progress
          </h3>
          <span className="text-lg font-bold" style={{ color: colors.chiliGreen }}>
            {checkedCount}/{totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: colors.chiliGreen
            }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-lg p-4 m-4 shadow-md">
        <h3 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
          ✓ Validation Checklist
        </h3>

        <div className="space-y-2">
          {checklistItems.map((item) => {
            const isCompleted = checkedItems[item.id] || false;

            return (
              <div
                key={item.id}
                className="p-3 rounded border-2 transition-all"
                style={{
                  backgroundColor: isCompleted ? '#f0fdf4' : 'white',
                  borderColor: isCompleted ? colors.chiliGreen : colors.chiliGray
                }}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleItemCheck(item.id)}
                    className="mt-1 w-5 h-5 rounded cursor-pointer"
                    style={{ accentColor: colors.chiliGreen }}
                  />

                  <div className="flex-1">
                    {item.category && (
                      <div className="text-xs font-bold mb-1" style={{ color: colors.chiliYellow }}>
                        {item.category}
                      </div>
                    )}
                    <p
                      className={isCompleted ? 'line-through' : ''}
                      style={{ color: isCompleted ? colors.chiliGray : colors.chiliNavy }}
                    >
                      {item.text}
                    </p>
                    {item.details && (
                      <p className="text-sm mt-1" style={{ color: colors.chiliGray }}>
                        {item.details}
                      </p>
                    )}
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => handleFlagIssue(item)}
                      className="px-3 py-1 rounded text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
                      style={{
                        backgroundColor: colors.chiliRed,
                        color: 'white'
                      }}
                    >
                      Flag Issue
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issues Found */}
      {issues.length > 0 && (
        <div className="bg-white rounded-lg p-4 m-4 shadow-md">
          <h3 className="font-bold mb-3 flex items-center" style={{ color: colors.chiliRed }}>
            <AlertCircle size={20} className="mr-2" />
            Issues Found ({issues.length})
          </h3>
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className="p-3 mb-2 rounded border-l-4"
              style={{
                backgroundColor: colors.chiliCream,
                borderColor: colors.chiliRed
              }}
            >
              <div className="font-bold" style={{ color: colors.chiliNavy }}>
                {issue.issue_description}
              </div>
              <div className="text-sm mt-1" style={{ color: colors.chiliBrown }}>
                <strong>Action:</strong> {issue.action_required}
              </div>
              <div className="text-sm" style={{ color: colors.chiliBrown }}>
                <strong>Owner:</strong> {issue.owner} • <strong>Due:</strong> {new Date(issue.due_date).toLocaleDateString()}
              </div>
              {issue.issue_photo_url && (
                <img
                  src={issue.issue_photo_url}
                  className="mt-2 rounded max-w-xs h-32 object-cover"
                  alt="Issue photo"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="fixed bottom-12 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          {!isFirst && (
            <button
              onClick={onPrevious}
              className="flex-1 py-3 rounded font-bold hover:opacity-90 transition-opacity cursor-pointer"
              style={{
                backgroundColor: colors.chiliGray,
                color: 'white'
              }}
            >
              ← Previous
            </button>
          )}

          <button
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="flex-1 py-3 rounded font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: colors.chiliGreen,
              color: 'white'
            }}
          >
            {saving ? 'Saving...' : isLast ? 'Complete Validation ✓' : 'Next Section →'}
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={(photo) => {
            // Camera capture handled in ActionItemForm
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Action Item Form */}
      {showActionForm && selectedItem && (
        <ActionItemForm
          item={selectedItem}
          validation={validation}
          section={section}
          onSave={handleActionItemSaved}
          onClose={() => {
            setShowActionForm(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default SectionChecklist;
