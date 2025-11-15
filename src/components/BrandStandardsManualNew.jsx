import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, X, ChevronDown, ChevronRight, Printer } from 'lucide-react';
import { colors, styles, shadows } from '../styles/design-system';
import { manualData } from '../data/brandStandardsManualData';

const BrandStandardsManualNew = ({ manager, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [activeSection, setActiveSection] = useState(null);

  // Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return manualData.sections;

    const term = searchTerm.toLowerCase();
    return manualData.sections.filter(section => {
      if (section.title.toLowerCase().includes(term)) return true;
      return JSON.stringify(section.content).toLowerCase().includes(term);
    });
  }, [searchTerm]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      if (!expandedSections[sectionId]) {
        toggleSection(sectionId);
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 print:hidden"
        style={{
          ...styles.header,
          marginBottom: '2rem'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex-1 mx-4 text-center">
              <h1 className="text-xl md:text-2xl font-bold">
                {manualData.title}
              </h1>
              <p className="text-sm opacity-90">{manualData.subtitle}</p>
            </div>

            <button
              onClick={handlePrint}
              className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
              title="Print Manual"
            >
              <Printer size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-white bg-opacity-20 rounded-md overflow-hidden">
            <Search size={20} className="ml-3" />
            <input
              type="text"
              placeholder="Search manual..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 bg-transparent text-white placeholder-white placeholder-opacity-70 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-3 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Purpose Statement */}
      <div className="max-w-7xl mx-auto px-6 print:p-2">
        <div
          className="rounded-xl p-6 mb-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.chiliNavy}, ${colors.chiliRed})`,
            color: 'white',
            boxShadow: shadows.xl
          }}
        >
          <h2 className="text-2xl font-bold mb-2">Our Purpose</h2>
          <p className="text-lg opacity-90">{manualData.purpose}</p>
        </div>

        {/* Table of Contents - Side Panel on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* TOC Sidebar */}
          <div className="lg:col-span-1 print:hidden">
            <div style={{
              ...styles.card,
              position: 'sticky',
              top: '150px'
            }}>
              <h3 className="font-bold mb-3 text-lg" style={{ color: colors.textLight }}>
                Table of Contents
              </h3>
              <div className="space-y-2">
                {manualData.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded transition-all cursor-pointer"
                    style={{
                      backgroundColor: activeSection === section.id
                        ? colors.whiteAlpha(0.15)
                        : 'transparent',
                      color: activeSection === section.id
                        ? colors.chiliYellow
                        : colors.textMuted,
                      borderLeft: activeSection === section.id
                        ? `3px solid ${colors.chiliYellow}`
                        : '3px solid transparent'
                    }}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {searchTerm && (
              <div
                className="mb-4 p-3 rounded-lg border-l-4"
                style={{
                  backgroundColor: colors.whiteAlpha(0.1),
                  borderColor: colors.chiliYellow,
                  color: colors.textLight
                }}
              >
                <p>
                  {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} found for "{searchTerm}"
                </p>
              </div>
            )}

            <div className="space-y-4">
              {filteredSections.map((section) => {
                const isExpanded = expandedSections[section.id] || searchTerm || false;

                return (
                  <div
                    key={section.id}
                    id={`section-${section.id}`}
                    style={{
                      ...styles.card,
                      borderLeft: `4px solid ${section.color}`
                    }}
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{section.icon}</span>
                        <h2 className="text-xl font-bold" style={{ color: colors.textLight }}>
                          {section.title}
                        </h2>
                      </div>
                      <div className="print:hidden">
                        {isExpanded ? (
                          <ChevronDown size={24} style={{ color: section.color }} />
                        ) : (
                          <ChevronRight size={24} style={{ color: section.color }} />
                        )}
                      </div>
                    </button>

                    {/* Section Content */}
                    {isExpanded && (
                      <div className="mt-6 space-y-6">
                        {section.content.map((item, idx) => (
                          <div key={idx} className="space-y-3">
                            {item.heading && (
                              <h3 className="text-lg font-bold" style={{ color: colors.chiliYellow }}>
                                {item.heading}
                              </h3>
                            )}

                            {item.text && (
                              <p style={{ color: colors.textMuted }}>
                                {item.text}
                              </p>
                            )}

                            {item.bullets && (
                              <ul className="space-y-2 ml-4">
                                {item.bullets.map((bullet, bulletIdx) => (
                                  <li
                                    key={bulletIdx}
                                    className="flex items-start gap-2"
                                  >
                                    <span style={{ color: section.color }}>•</span>
                                    <span style={{ color: colors.textMuted }}>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {item.roles && (
                              <div className="space-y-4">
                                {item.roles.map((role, roleIdx) => (
                                  <div
                                    key={roleIdx}
                                    className="p-4 rounded-lg"
                                    style={{
                                      backgroundColor: colors.whiteAlpha(0.05),
                                      border: `1px solid ${colors.whiteAlpha(0.1)}`
                                    }}
                                  >
                                    <div className="font-bold mb-1" style={{ color: colors.textLight }}>
                                      {role.position}
                                    </div>
                                    <div className="text-sm mb-2" style={{ color: colors.textMuted }}>
                                      {role.description}
                                    </div>
                                    <ul className="space-y-1 ml-4">
                                      {role.responsibilities.map((resp, respIdx) => (
                                        <li key={respIdx} className="flex items-start gap-2 text-sm">
                                          <span style={{ color: section.color }}>•</span>
                                          <span style={{ color: colors.textMuted }}>{resp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}

                            {item.subsections && (
                              <div className="space-y-4 ml-4">
                                {item.subsections.map((subsection, subIdx) => (
                                  <div key={subIdx} className="space-y-2">
                                    <h4 className="font-bold" style={{ color: colors.textLight }}>
                                      {subsection.subheading}
                                    </h4>
                                    {subsection.text && (
                                      <p style={{ color: colors.textMuted }}>{subsection.text}</p>
                                    )}
                                    {subsection.bullets && (
                                      <ul className="space-y-1 ml-4">
                                        {subsection.bullets.map((bullet, bulletIdx) => (
                                          <li key={bulletIdx} className="flex items-start gap-2">
                                            <span style={{ color: section.color }}>•</span>
                                            <span style={{ color: colors.textMuted }}>{bullet}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredSections.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg mb-4" style={{ color: colors.textMuted }}>
                  No sections found for "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.chiliRed, color: 'white' }}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm" style={{ color: colors.textSubtle }}>
          <p>Brinker International Payroll Company • {manualData.version}</p>
          <p className="mt-1">© {new Date().getFullYear()} Brinker International. All rights reserved.</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default BrandStandardsManualNew;
