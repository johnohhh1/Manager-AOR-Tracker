import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { colors } from '../../styles/design-system';
import SectionChecklist from './SectionChecklist';

const ValidationWalkthrough = ({ validation, manager, onComplete, onBack }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState({});

  // Define all validation sections
  const sections = [
    { id: 'food-safety', name: 'Food Safety', icon: '🛡️', critical: true, aor: 'all' },
    { id: 'host-stand', name: 'Host Stand', icon: '🚪', critical: false, aor: 'hospitality' },
    { id: 'dining-room', name: 'Dining Room', icon: '🍽️', critical: false, aor: 'hospitality' },
    { id: 'bar', name: 'Bar', icon: '🍹', critical: false, aor: 'togoBar' },
    { id: 'restroom', name: 'Restroom', icon: '🚻', critical: false, aor: 'hospitality' },
    { id: 'dish-area', name: 'Dish Area', icon: '🧼', critical: false, aor: 'culinary' },
    { id: 'office', name: 'Office', icon: '💼', critical: false, aor: 'all' },
    { id: 'back-dock', name: 'Back Dock', icon: '🚚', critical: false, aor: 'culinary' },
    { id: 'pest-control', name: 'Pest Control', icon: '🐛', critical: false, aor: 'culinary' },
    { id: 'mop-sink', name: 'Mop Sink/Chemicals', icon: '🧹', critical: false, aor: 'culinary' }
  ];

  const currentSection = sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;
  const isFirst = currentSectionIndex === 0;
  const isLast = currentSectionIndex === sections.length - 1;

  const handleSectionComplete = (sectionData) => {
    // Mark section as completed
    setCompletedSections(prev => ({
      ...prev,
      [currentSection.id]: sectionData
    }));

    // Move to next section or complete
    if (isLast) {
      onComplete();
    } else {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center mb-3">
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
          >
            <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
              Brand Standards Validation
            </h1>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>
              {validation.shift} Shift • {new Date(validation.validation_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2" style={{ color: colors.chiliBrown }}>
            <span className="font-medium">
              {currentSection.icon} {currentSection.name}
              {currentSection.critical && <span className="ml-2 text-xs" style={{ color: colors.chiliRed }}>CRITICAL</span>}
            </span>
            <span className="font-bold">
              {currentSectionIndex + 1} of {sections.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: colors.chiliGreen
              }}
            />
          </div>
        </div>
      </div>

      {/* Section Content */}
      <SectionChecklist
        section={currentSection}
        validation={validation}
        onNext={handleSectionComplete}
        onPrevious={handlePrevious}
        isFirst={isFirst}
        isLast={isLast}
        existingData={completedSections[currentSection.id]}
      />

      {/* Section Navigation Indicators */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3">
        <div className="flex justify-center gap-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: index <= currentSectionIndex
                  ? colors.chiliGreen
                  : colors.chiliGray,
                opacity: index <= currentSectionIndex ? 1 : 0.3
              }}
              title={section.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidationWalkthrough;
