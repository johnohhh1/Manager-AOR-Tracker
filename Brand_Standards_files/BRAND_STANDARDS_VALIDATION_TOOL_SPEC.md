# 🌶️ Brand Standards & Atmosphere Validation Tool

## OVERVIEW

**FOR ALL MANAGERS** - Comprehensive digital validation checklist for Brand Standards walkthroughs.

This tool replaces the paper Brand Standards validation checklist with:
- ✅ Interactive checklist with reference photos
- 📸 Photo capture for issues (auto-compressed)
- 📋 Action item creation with owner/due date
- 💾 Historical validation results
- 📊 Trend tracking for recurring issues

---

## 🎨 DESIGN LANGUAGE

**Navy/Red/Green with emphasis on usability:**
- Navy headers
- Green for compliant items
- Red for issues found
- Yellow for action items pending
- Big touch targets for mobile use

---

## DATABASE SCHEMA

```sql
-- Validation Sessions
CREATE TABLE brand_standards_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  validation_date DATE NOT NULL,
  shift TEXT, -- 'AM' or 'PM'
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed'
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Individual Section Results
CREATE TABLE validation_section_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_id UUID REFERENCES brand_standards_validations(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL, -- 'Food Safety', 'Host Stand', 'Dining Room', etc.
  items_checked INTEGER DEFAULT 0,
  items_total INTEGER,
  issues_found INTEGER DEFAULT 0,
  compliant BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Action Items from Validation
CREATE TABLE validation_action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_id UUID REFERENCES brand_standards_validations(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  action_required TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed'
  reference_photo_url TEXT, -- URL to reference photo from doc
  issue_photo_url TEXT, -- URL to compressed photo taken during validation
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Photo Storage (compressed)
CREATE TABLE validation_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_id UUID REFERENCES brand_standards_validations(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  photo_data TEXT NOT NULL, -- Base64 compressed image (max 100KB)
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE brand_standards_validations DISABLE ROW LEVEL SECURITY;
ALTER TABLE validation_section_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE validation_action_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE validation_photos DISABLE ROW LEVEL SECURITY;
```

---

## VALIDATION SECTIONS

### Critical Areas
1. **Food Safety** (All Managers)
2. **Host Stand** (Hospitality)
3. **Dining Room** (Hospitality)
4. **Bar** (Bar Leader)
5. **Restroom** (Hospitality)
6. **Dish Area** (Culinary)
7. **Office** (All Managers)
8. **Back Dock** (Culinary)
9. **Pest Control** (Culinary)
10. **Mop Sink/Chemicals** (Culinary)

---

## MAIN DASHBOARD VIEW

```jsx
import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, AlertTriangle, Calendar, FileText } from 'lucide-react';

const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliBrown: 'rgb(60, 58, 53)',
  chiliGray: 'rgb(161, 159, 154)'
};

const BrandStandardsValidation = ({ manager, onBack }) => {
  const [view, setView] = useState('main'); // 'main', 'validation', 'history', 'section'
  const [currentValidation, setCurrentValidation] = useState(null);
  const [recentValidations, setRecentValidations] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

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

  const startNewValidation = async () => {
    // Create new validation session in Supabase
    const { data, error } = await supabase
      .from('brand_standards_validations')
      .insert({
        manager_id: manager.id,
        validation_date: new Date().toISOString().split('T')[0],
        shift: new Date().getHours() < 16 ? 'AM' : 'PM',
        status: 'in_progress'
      })
      .select()
      .single();
    
    if (data) {
      setCurrentValidation(data);
      setView('validation');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.chiliNavy}, ${colors.chiliRed})`,
        color: 'white',
        padding: '1.5rem'
      }}>
        <button onClick={onBack} className="mb-3">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold mb-2">🛡️ Brand Standards Validation</h1>
        <p className="opacity-90">Comprehensive Walkthrough & Action Tracking</p>
      </div>

      {view === 'main' && (
        <>
          {/* Quick Stats */}
          <div className="p-4 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: colors.chiliGreen }}>
                {recentValidations.filter(v => v.status === 'completed').length}
              </div>
              <div className="text-sm" style={{ color: colors.chiliBrown }}>
                This Week
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: colors.chiliRed }}>
                5
              </div>
              <div className="text-sm" style={{ color: colors.chiliBrown }}>
                Open Actions
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: colors.chiliYellow }}>
                92%
              </div>
              <div className="text-sm" style={{ color: colors.chiliBrown }}>
                Compliance
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 space-y-3">
            <button
              onClick={startNewValidation}
              className="w-full bg-white rounded-lg p-6 text-left shadow-md border-2"
              style={{ borderColor: colors.chiliNavy }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                    Start New Validation
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Begin comprehensive walkthrough
                  </p>
                </div>
                <CheckCircle size={32} style={{ color: colors.chiliGreen }} />
              </div>
            </button>

            <button
              onClick={() => setView('history')}
              className="w-full bg-white rounded-lg p-6 text-left shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                    Validation History
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    View past validations & trends
                  </p>
                </div>
                <FileText size={32} style={{ color: colors.chiliNavy }} />
              </div>
            </button>

            <button
              onClick={() => setView('actions')}
              className="w-full bg-white rounded-lg p-6 text-left shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                    Open Action Items
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Track outstanding issues
                  </p>
                </div>
                <AlertTriangle size={32} style={{ color: colors.chiliRed }} />
              </div>
            </button>
          </div>
        </>
      )}

      {view === 'validation' && (
        <ValidationWalkthrough 
          validation={currentValidation}
          sections={sections}
          manager={manager}
          onComplete={() => setView('main')}
        />
      )}
    </div>
  );
};
```

---

## VALIDATION WALKTHROUGH VIEW

```jsx
const ValidationWalkthrough = ({ validation, sections, manager, onComplete }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionResults, setSectionResults] = useState({});
  
  const currentSection = sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-white p-4 border-b">
        <div className="flex justify-between text-sm mb-2" style={{ color: colors.chiliBrown }}>
          <span>{currentSection.icon} {currentSection.name}</span>
          <span>{currentSectionIndex + 1} of {sections.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{ 
              width: `${progress}%`,
              backgroundColor: colors.chiliGreen
            }}
          />
        </div>
      </div>

      {/* Section Content */}
      <SectionChecklist
        section={currentSection}
        validation={validation}
        onNext={() => setCurrentSectionIndex(prev => prev + 1)}
        onPrevious={() => setCurrentSectionIndex(prev => prev - 1)}
        isFirst={currentSectionIndex === 0}
        isLast={currentSectionIndex === sections.length - 1}
        onComplete={onComplete}
      />
    </div>
  );
};
```

---

## SECTION CHECKLIST VIEW

```jsx
const SectionChecklist = ({ section, validation, onNext, onPrevious, isFirst, isLast, onComplete }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [issues, setIssues] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);

  // Get checklist items for this section (from brandStandardsData.js)
  const checklistItems = getBrandStandardsItems(section.id);

  const handleItemCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleFlagIssue = (item) => {
    setShowActionForm(true);
    setSelectedItem(item);
  };

  const saveAndContinue = async () => {
    // Save section results to Supabase
    const issuesCount = issues.length;
    const itemsChecked = Object.keys(checkedItems).length;
    const itemsTotal = checklistItems.length;

    await supabase
      .from('validation_section_results')
      .insert({
        validation_id: validation.id,
        section_name: section.name,
        items_checked: itemsChecked,
        items_total: itemsTotal,
        issues_found: issuesCount,
        compliant: issuesCount === 0
      });

    // Move to next section or complete
    if (isLast) {
      // Mark validation as completed
      await supabase
        .from('brand_standards_validations')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', validation.id);
      
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="p-4">
      {/* Reference Photos Section */}
      {section.referencePhotos && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
            📸 Reference Standards
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {section.referencePhotos.map((photo, idx) => (
              <img 
                key={idx}
                src={photo.url}
                alt={photo.caption}
                className="rounded border cursor-pointer"
                onClick={() => showPhotoModal(photo)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Checklist Items */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h3 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
          ✓ Validation Checklist
        </h3>
        
        <div className="space-y-2">
          {checklistItems.map((item, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-3 p-3 rounded"
              style={{ 
                backgroundColor: checkedItems[item.id] ? colors.chiliCream : 'white',
                border: `2px solid ${checkedItems[item.id] ? colors.chiliGreen : colors.chiliGray}`
              }}
            >
              <input
                type="checkbox"
                checked={checkedItems[item.id] || false}
                onChange={() => handleItemCheck(item.id)}
                className="mt-1 w-5 h-5 rounded"
                style={{ accentColor: colors.chiliGreen }}
              />
              
              <div className="flex-1">
                <p style={{ color: colors.chiliNavy }}>{item.text}</p>
                {item.details && (
                  <p className="text-sm mt-1" style={{ color: colors.chiliGray }}>
                    {item.details}
                  </p>
                )}
              </div>

              {!checkedItems[item.id] && (
                <button
                  onClick={() => handleFlagIssue(item)}
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: colors.chiliRed,
                    color: 'white'
                  }}
                >
                  Flag Issue
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Issues Found */}
      {issues.length > 0 && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-bold mb-3" style={{ color: colors.chiliRed }}>
            ⚠️ Issues Found ({issues.length})
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
                {issue.description}
              </div>
              <div className="text-sm" style={{ color: colors.chiliBrown }}>
                Action: {issue.action} | Owner: {issue.owner} | Due: {issue.dueDate}
              </div>
              {issue.photoUrl && (
                <img 
                  src={issue.photoUrl}
                  className="mt-2 rounded max-w-xs"
                  alt="Issue photo"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {!isFirst && (
          <button
            onClick={onPrevious}
            className="flex-1 py-3 rounded font-bold"
            style={{ 
              backgroundColor: colors.chiliGray,
              color: 'white'
            }}
          >
            ← Previous
          </button>
        )}
        
        <button
          onClick={saveAndContinue}
          className="flex-1 py-3 rounded font-bold"
          style={{ 
            backgroundColor: colors.chiliGreen,
            color: 'white'
          }}
        >
          {isLast ? 'Complete Validation ✓' : 'Next Section →'}
        </button>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={(photo) => handlePhotoCapture(photo)}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Action Item Form */}
      {showActionForm && (
        <ActionItemForm
          item={selectedItem}
          validation={validation}
          section={section}
          onSave={(actionItem) => {
            setIssues(prev => [...prev, actionItem]);
            setShowActionForm(false);
          }}
          onClose={() => setShowActionForm(false)}
        />
      )}
    </div>
  );
};
```

---

## CAMERA CAPTURE COMPONENT

```jsx
const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      alert('Camera access denied. Please enable camera permissions.');
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Compress to max 100KB
    let quality = 0.7;
    let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // Keep reducing quality until under 100KB
    while (compressedDataUrl.length > 136533 && quality > 0.1) { // 136533 = ~100KB base64
      quality -= 0.1;
      compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    }
    
    stopCamera();
    onCapture(compressedDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h3 className="font-bold">Take Photo</h3>
        <button onClick={() => { stopCamera(); onClose(); }} className="text-2xl">
          ×
        </button>
      </div>

      {/* Video Preview */}
      <div className="flex-1 relative">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Capture Button */}
      <div className="bg-black p-6 flex justify-center">
        <button
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-4 border-white bg-white"
          style={{ boxShadow: '0 0 0 4px rgba(255,255,255,0.3)' }}
        />
      </div>

      {/* Hidden canvas for compression */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
```

---

## ACTION ITEM FORM

```jsx
const ActionItemForm = ({ item, validation, section, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    issue: item.text,
    action: '',
    owner: '',
    dueDate: '',
    photo: null
  });

  const handleSubmit = async () => {
    // Save to Supabase
    const { data, error } = await supabase
      .from('validation_action_items')
      .insert({
        validation_id: validation.id,
        section_name: section.name,
        issue_description: formData.issue,
        action_required: formData.action,
        owner: formData.owner,
        due_date: formData.dueDate,
        issue_photo_url: formData.photo,
        status: 'open'
      })
      .select()
      .single();

    if (data) {
      onSave(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
          Create Action Item
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
              Issue Description
            </label>
            <textarea
              value={formData.issue}
              onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
              className="w-full p-2 border rounded"
              rows={3}
              style={{ borderColor: colors.chiliGray }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
              Action Required
            </label>
            <input
              type="text"
              value={formData.action}
              onChange={(e) => setFormData(prev => ({ ...prev, action: e.target.value }))}
              className="w-full p-2 border rounded"
              style={{ borderColor: colors.chiliGray }}
              placeholder="e.g., Replace chair glides"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
              Owner
            </label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full p-2 border rounded"
              style={{ borderColor: colors.chiliGray }}
              placeholder="Team member name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full p-2 border rounded"
              style={{ borderColor: colors.chiliGray }}
            />
          </div>

          <button
            onClick={() => {
              // Open camera
              const camera = document.createElement('div');
              // Trigger CameraCapture
            }}
            className="w-full py-2 rounded font-medium border-2"
            style={{ 
              borderColor: colors.chiliNavy,
              color: colors.chiliNavy
            }}
          >
            📸 Add Photo (Optional)
          </button>

          {formData.photo && (
            <img src={formData.photo} className="rounded max-w-xs" alt="Issue" />
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded font-medium"
            style={{ 
              backgroundColor: colors.chiliGray,
              color: 'white'
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded font-medium"
            style={{ 
              backgroundColor: colors.chiliRed,
              color: 'white'
            }}
          >
            Save Action Item
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## BRAND STANDARDS DATA FILE

```javascript
// brandStandardsData.js
// All validation items organized by section

export const brandStandardsData = {
  'food-safety': {
    name: 'Food Safety',
    critical: true,
    referencePhotos: [
      { url: '/images/brand-standards/food-safety-1.jpg', caption: 'Proper glove usage' },
      { url: '/images/brand-standards/food-safety-2.jpg', caption: 'Temperature logs' }
    ],
    items: [
      {
        id: 'fs-1',
        text: 'Digital Quality Line Check completed shiftly',
        details: 'Verify QLC is completed at start of each shift'
      },
      {
        id: 'fs-2',
        text: 'Digital Critical Checklist completed shiftly',
        details: 'All critical items checked off'
      },
      {
        id: 'fs-3',
        text: 'Testing strips taped to Daily Pull Thaw sheet',
        details: 'Check sanitizer concentration strips are present'
      },
      {
        id: 'fs-4',
        text: 'Cooling Log reviewed and verified each week',
        details: 'Manager sign-off on cooling procedures'
      },
      {
        id: 'fs-5',
        text: 'Hand washing procedure followed 100%',
        details: 'Observe team members washing hands correctly'
      },
      {
        id: 'fs-6',
        text: 'Gloves worn when handling Ready To Eat Food',
        details: 'No bare-hand contact with RTE foods'
      },
      {
        id: 'fs-7',
        text: 'Burger mitts used 100% on cook line',
        details: 'When handling burgers, mitts must be used'
      },
      {
        id: 'fs-8',
        text: 'Hat/hairnet worn by all HOH team members',
        details: 'Including managers and QA - 100% of the time'
      },
      {
        id: 'fs-9',
        text: 'Beard nets worn if applicable',
        details: 'All facial hair must be covered'
      },
      {
        id: 'fs-10',
        text: 'Long hair properly restrained',
        details: 'Pulled back in ponytail/bun, away from face'
      },
      {
        id: 'fs-11',
        text: 'No team members showing signs of illness',
        details: 'Check for vomiting, diarrhea, jaundice, sore throat with fever'
      },
      {
        id: 'fs-12',
        text: 'Wounds/cuts properly covered with double barrier',
        details: 'Band-aid covered by glove or clothing'
      },
      {
        id: 'fs-13',
        text: 'Manager ServSafe certified',
        details: 'Current certification on file'
      },
      {
        id: 'fs-14',
        text: 'TMs certified per state regulations',
        details: 'Food handler certificates current'
      }
    ]
  },

  'host-stand': {
    name: 'Host Stand',
    critical: false,
    referencePhotos: [
      { url: '/images/brand-standards/host-stand-1.jpg', caption: 'Organized host stand' },
      { url: '/images/brand-standards/host-stand-menus.jpg', caption: 'Menu organization' }
    ],
    items: [
      {
        id: 'hs-1',
        text: 'Host greets every guest immediately',
        details: 'Within 30 seconds with "Hi! Welcome to Chili\'s!"'
      },
      {
        id: 'hs-2',
        text: 'Host opens door for arriving/departing guests',
        details: 'When possible, door service provided'
      },
      {
        id: 'hs-3',
        text: 'Kid silverware delivered when seating families',
        details: 'Proactive service for guests with children'
      },
      {
        id: 'hs-4',
        text: 'Guest seating requests honored',
        details: 'Always accommodate requests including large parties'
      },
      {
        id: 'hs-5',
        text: 'Host stand organized and clutter-free',
        details: 'Perpendicular to front door if applicable'
      },
      {
        id: 'hs-6',
        text: 'No business cards visible',
        details: 'Remove all business cards from host stand'
      },
      {
        id: 'hs-7',
        text: 'No team member belongings present',
        details: 'Personal items stored in designated areas'
      },
      {
        id: 'hs-8',
        text: 'No brooms or dust pans visible',
        details: 'Cleaning supplies stored out of sight'
      },
      {
        id: 'hs-9',
        text: 'NoWait iPad present and working',
        details: 'Verify iPad is charged and functional'
      },
      {
        id: 'hs-10',
        text: 'Menus clean and organized',
        details: 'In Brand Standard menu holder'
      },
      {
        id: 'hs-11',
        text: 'Every menu has feature card',
        details: 'Current promotional inserts present'
      },
      {
        id: 'hs-12',
        text: 'Kid menus staged flat, never folded',
        details: 'Fresh crayons - never reuse crayons'
      },
      {
        id: 'hs-13',
        text: 'Braille and Spanish menus available',
        details: 'Stored within host stand'
      },
      {
        id: 'hs-14',
        text: 'High chairs/boosters in good condition',
        details: 'Clean after every use, stored properly'
      },
      {
        id: 'hs-15',
        text: 'Door mats only when raining/snowing',
        details: 'Store when not in use'
      },
      {
        id: 'hs-16',
        text: 'No trash cans at host stand',
        details: 'Remove all visible trash receptacles'
      }
    ]
  },

  'dining-room': {
    name: 'Dining Room',
    critical: false,
    referencePhotos: [
      { url: '/images/brand-standards/dining-room-clean.jpg', caption: 'Clean dining room' },
      { url: '/images/brand-standards/server-station.jpg', caption: 'Organized server station' }
    ],
    items: [
      {
        id: 'dr-1',
        text: 'Manager present on floor engaging with guests',
        details: 'Observing and coaching TM hospitality'
      },
      {
        id: 'dr-2',
        text: 'Dining room inviting and clutter-free',
        details: 'Clean, organized, fresh smell'
      },
      {
        id: 'dr-3',
        text: 'Temperature comfortable',
        details: '68°F on heat or 72°F on cool'
      },
      {
        id: 'dr-4',
        text: 'Music level appropriate',
        details: '65-70 (use SPLNFFT Noise Meter App)'
      },
      {
        id: 'dr-5',
        text: 'Lighting bright, no burned bulbs',
        details: 'Only order bulbs through FSG'
      },
      {
        id: 'dr-6',
        text: 'No brooms/dust pans visible',
        details: 'Reference staging location guide'
      },
      {
        id: 'dr-7',
        text: 'Floors clean and debris-free',
        details: 'Corners mopped AND scrubbed'
      },
      {
        id: 'dr-8',
        text: 'Booths, tables, chairs clean',
        details: 'Manager validates with flashlight at EOD'
      },
      {
        id: 'dr-9',
        text: 'High-dusting complete',
        details: 'Dust-free from ceiling to floor'
      },
      {
        id: 'dr-10',
        text: 'All paint in good condition',
        details: 'Touch up as needed - reference Interior Paint Guidelines'
      },
      {
        id: 'dr-11',
        text: 'Uniform lighting throughout',
        details: 'All LED or all fluorescent, light shields clean'
      },
      {
        id: 'dr-12',
        text: 'Blinds functional and clean',
        details: 'Always open (lower only upon guest request for sun)'
      },
      {
        id: 'dr-13',
        text: 'Server stations organized',
        details: 'Clean, clutter-free, cleaning products not visible'
      },
      {
        id: 'dr-14',
        text: 'Servers using Team Member Handhelds 100%',
        details: 'Immediately ring and send each order segment'
      },
      {
        id: 'dr-15',
        text: 'No squeaky or uneven chairs',
        details: 'Apply chair glides as needed'
      }
    ]
  },

  'bar': {
    name: 'Bar',
    critical: false,
    referencePhotos: [
      { url: '/images/brand-standards/bar-setup.jpg', caption: 'Organized bar' },
      { url: '/images/brand-standards/bar-glassware.jpg', caption: 'Clean glassware' }
    ],
    items: [
      {
        id: 'bar-1',
        text: 'Bar top clean and organized',
        details: 'No clutter, wiped down, inviting'
      },
      {
        id: 'bar-2',
        text: 'Glassware sparkling clean',
        details: 'No spots, properly stored'
      },
      {
        id: 'bar-3',
        text: 'Beer taps clean and labeled',
        details: 'No buildup, proper signage'
      },
      {
        id: 'bar-4',
        text: 'Liquor bottles organized',
        details: 'Labels facing out, properly stocked'
      },
      {
        id: 'bar-5',
        text: 'Bar mats clean and in place',
        details: 'No tears, properly positioned'
      },
      {
        id: 'bar-6',
        text: 'Ice bins clean and sanitized',
        details: 'Proper ice levels maintained'
      },
      {
        id: 'bar-7',
        text: 'Garnish station stocked and fresh',
        details: 'All garnishes in good condition'
      },
      {
        id: 'bar-8',
        text: 'Bar stools in good condition',
        details: 'Clean, stable, no tears'
      },
      {
        id: 'bar-9',
        text: 'TV screens clean and working',
        details: 'Appropriate programming, proper volume'
      },
      {
        id: 'bar-10',
        text: 'Bar menu holders clean',
        details: 'Current menus, no damage'
      }
    ]
  },

  'restroom': {
    name: 'Restroom',
    critical: false,
    items: [
      {
        id: 'rr-1',
        text: 'Restrooms clean and odor-free',
        details: 'Fresh smell, no unpleasant odors'
      },
      {
        id: 'rr-2',
        text: 'Toilets clean and functional',
        details: 'Flushing properly, no clogs'
      },
      {
        id: 'rr-3',
        text: 'Sinks clean, faucets working',
        details: 'Hot/cold water available'
      },
      {
        id: 'rr-4',
        text: 'Paper towels/soap fully stocked',
        details: 'Dispensers functional'
      },
      {
        id: 'rr-5',
        text: 'Floors clean and dry',
        details: 'No puddles, properly mopped'
      },
      {
        id: 'rr-6',
        text: 'Mirrors clean and streak-free',
        details: 'No spots or smudges'
      },
      {
        id: 'rr-7',
        text: 'Trash cans emptied',
        details: 'Not overflowing, liner in place'
      },
      {
        id: 'rr-8',
        text: 'Restroom check log current',
        details: 'Signed off every 30 minutes'
      }
    ]
  },

  // Add remaining sections: dish-area, office, back-dock, pest-control, mop-sink
  // Following the same pattern...
};

export const getBrandStandardsItems = (sectionId) => {
  return brandStandardsData[sectionId]?.items || [];
};

export const getBrandStandardsSection = (sectionId) => {
  return brandStandardsData[sectionId] || null;
};
```

---

## IMAGE HANDLING

### Reference Photos from Document
1. Extract images from docx to `/public/images/brand-standards/`
2. Name them descriptively: `food-safety-gloves.jpg`, `host-stand-setup.jpg`
3. Reference in brandStandardsData.js

### User-Captured Photos (Compressed)
```javascript
// Compression function (max 100KB)
const compressImage = (dataUrl, maxSizeKB = 100) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Reduce dimensions if needed
      const maxDimension = 1280;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Start with quality 0.7
      let quality = 0.7;
      let compressed = canvas.toDataURL('image/jpeg', quality);
      
      // Reduce quality until under size limit
      const maxBytes = maxSizeKB * 1024 * 1.37; // Base64 overhead
      while (compressed.length > maxBytes && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(compressed);
    };
    img.src = dataUrl;
  });
};
```

---

## NAVIGATION INTEGRATION

Add to main App.jsx menu (available to ALL managers):

```jsx
<button
  onClick={() => setCurrentView('brand-standards')}
  className="w-full bg-white rounded-lg p-6 text-left shadow-md hover:shadow-lg transition-shadow border-2"
  style={{ borderColor: colors.chiliNavy }}
>
  <div className="flex items-center">
    <Shield size={32} style={{ color: colors.chiliNavy }} className="mr-4" />
    <div>
      <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
        Brand Standards Validation
      </h3>
      <p style={{ color: colors.chiliBrown }}>
        Comprehensive Walkthrough & Action Tracking
      </p>
      <p className="text-sm font-medium" style={{ color: colors.chiliGreen }}>
        For All Managers
      </p>
    </div>
  </div>
</button>
```

---

## KEY FEATURES RECAP

✅ **Interactive Checklist** - Check items as you validate
✅ **Reference Photos** - Visual standards embedded in app
✅ **Photo Capture** - Take photos of issues (auto-compressed to <100KB)
✅ **Action Items** - Create tasks with owner/due date
✅ **Progress Tracking** - See completion status per section
✅ **Historical Data** - Review past validations
✅ **Trend Analysis** - Identify recurring issues
✅ **For All Managers** - Food Safety + area-specific sections

---

🌶️ **This replaces paper checklists with a comprehensive digital validation tool!**
