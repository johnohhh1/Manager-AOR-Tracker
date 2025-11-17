import React from 'react';
import { ChevronLeft } from 'lucide-react';

const BrandStandardsViewer = ({ onBack }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Simple back button */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#CD202C',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      {/* Iframe that displays the HTML exactly as-is */}
      <iframe
        src="/brandstan.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0
        }}
        title="Brand Standards Manual"
      />
    </div>
  );
};

export default BrandStandardsViewer;