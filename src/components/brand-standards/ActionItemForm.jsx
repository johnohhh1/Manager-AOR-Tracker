import React, { useState } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';
import { colors } from '../../styles/design-system';
import { useBrandStandards } from '../../hooks/useBrandStandards';
import CameraCapture from './CameraCapture';

const ActionItemForm = ({ item, validation, section, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    issue: item.text,
    action: '',
    owner: '',
    dueDate: '',
    photo: null
  });
  const [showCamera, setShowCamera] = useState(false);
  const [saving, setSaving] = useState(false);

  const brandStandards = useBrandStandards();

  const handlePhotoCapture = (photoDataUrl) => {
    setFormData(prev => ({ ...prev, photo: photoDataUrl }));
    setShowCamera(false);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.action || !formData.owner || !formData.dueDate) {
      alert('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await brandStandards.actionItems.create({
        validation_id: validation.id,
        section_name: section.name,
        issue_description: formData.issue,
        action_required: formData.action,
        owner: formData.owner,
        due_date: formData.dueDate,
        issue_photo_url: formData.photo,
        status: 'open'
      });

      if (error) {
        throw error;
      }

      onSave(data);
    } catch (error) {
      console.error('Error saving action item:', error);
      alert('Error saving action item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Calculate minimum due date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
              Create Action Item
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Issue Description */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                Issue Description *
              </label>
              <textarea
                value={formData.issue}
                onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                style={{ borderColor: colors.chiliGray }}
                required
              />
            </div>

            {/* Action Required */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                Action Required *
              </label>
              <input
                type="text"
                value={formData.action}
                onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: colors.chiliGray }}
                placeholder="e.g., Replace chair glides, clean ceiling vents"
                required
              />
            </div>

            {/* Owner */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                Owner (Responsible Person) *
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: colors.chiliGray }}
                placeholder="Team member name"
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: colors.chiliGray }}
                min={today}
                required
              />
            </div>

            {/* Photo Section */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliBrown }}>
                Issue Photo (Optional)
              </label>

              {formData.photo ? (
                <div className="relative">
                  <img
                    src={formData.photo}
                    className="rounded border w-full h-48 object-cover"
                    style={{ borderColor: colors.chiliGray }}
                    alt="Issue"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="w-full py-3 rounded-md font-medium border-2 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  style={{
                    borderColor: colors.chiliNavy,
                    color: colors.chiliNavy
                  }}
                >
                  <Camera size={20} />
                  Take Photo
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                style={{
                  backgroundColor: colors.chiliGray,
                  color: 'white'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: colors.chiliRed,
                  color: 'white'
                }}
              >
                {saving ? 'Saving...' : 'Save Action Item'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
};

export default ActionItemForm;
