import React, { useState } from 'react';
import { ChevronLeft, BookOpen, Search, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { colors } from '../styles/design-system';

const BrandStandardsManual = ({ manager, onBack }) => {
  const [zoom, setZoom] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/brand-standards-manual.html';
    link.download = 'Chilis_Brand_Standards_F26_Q2.html';
    link.click();
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const iframe = document.getElementById('manual-iframe');
    if (iframe && iframe.contentWindow) {
      // Use iframe's find functionality
      iframe.contentWindow.find(searchTerm, false, false, true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.chiliCream }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.chiliNavy}, ${colors.chiliRed})`,
        color: 'white',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex-1 mx-4">
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <BookOpen size={28} />
                Brand Standards Manual
              </h1>
              <p className="text-sm opacity-90">F26 Q2 Official Reference Guide</p>
            </div>

            <button
              onClick={handleDownload}
              className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer flex items-center gap-2"
              title="Download Manual"
            >
              <Download size={20} />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>

          {/* Search and Zoom Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search Bar */}
            <div className="flex-1 min-w-[200px] flex items-center bg-white bg-opacity-20 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search manual..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-transparent text-white placeholder-white placeholder-opacity-70 outline-none"
                style={{ minWidth: '150px' }}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
                title="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-md p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>

              <span className="px-3 font-medium text-sm whitespace-nowrap">
                {zoom}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 150}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Content */}
      <div className="flex-1 p-4 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <iframe
            id="manual-iframe"
            src="/brand-standards-manual.html"
            className="w-full h-full border-0"
            title="Brand Standards Manual"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${10000 / zoom}%`,
              height: `${10000 / zoom}%`
            }}
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="p-4 max-w-7xl mx-auto w-full">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderColor: colors.chiliNavy }}>
          <h4 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>
            💡 Tip: Using the Manual
          </h4>
          <ul className="text-sm space-y-1" style={{ color: colors.chiliBrown }}>
            <li>• Use the search bar to find specific topics</li>
            <li>• Adjust zoom level for comfortable reading</li>
            <li>• Download a copy for offline reference</li>
            <li>• Scroll within the manual to browse all sections</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrandStandardsManual;
