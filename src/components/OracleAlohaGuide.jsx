import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, X } from 'lucide-react';
import { colors, styles, radius, spacing, shadows } from '../styles/design-system';

const proceduresData = {
  oracle: [
    { 
      id: 'pl',
      title: 'Access the P&L',
      steps: [
        'On Homepage select Restaurant P&L tab',
        'Select desired Report',
        'Select Period name',
        'Select Report tab to run',
        'Click Apply'
      ]
    },
    { 
      id: 'labor',
      title: 'Access Labor Report',
      steps: [
        'While on Homepage select Tools tab',
        'Select Reports and Analytics tile',
        'Select Browse Catalog',
        'Click on Shared Folder then Custom',
        'Click the P&L Restaurant folder',
        'Select needed report'
      ]
    },
    { 
      id: 'timecard',
      title: 'Add/Edit TM Timecard',
      steps: [
        'Homepage → My Team tab',
        'Quick Action Menu → Show More',
        'Under Time → Team Time Cards',
        'Change date range',
        'Search for TM',
        'Click date hyperlink to open timecard',
        'Edit time punch (increase/decrease hours)',
        'Scroll to top → Actions → Submit',
        'Select reason for change',
        'Click Submit Time Card'
      ],
      note: 'If Hours >13, separate window appears for reason'
    },
    { 
      id: 'timeaway',
      title: 'Enter TM Time Away',
      steps: [
        'Homepage → My Team',
        'Quick Action Menu → Show More',
        'Under Absences → Add Absence',
        'Search for TM box',
        'Click TM Name',
        'Type dropdown → select Time Away type',
        'Hourly: date range | Salaried: each day',
        'Click Submit'
      ]
    },
    { 
      id: 'timeaway-approve',
      title: 'TM Time Away Approval',
      steps: [
        'Homepage → Bell icon',
        'Click time away notification',
        'Scroll to "things to finish" section',
        'Click hyperlink to see details',
        'After validating → scroll up → Approve',
        'Enter comments in popup',
        'Click Submit button'
      ]
    },
    { 
      id: 'approve-rates',
      title: 'Approve Rates',
      steps: [
        'Homepage → My Team',
        'Click My Team Maintenance Page',
        'Log into portal',
        'Click Employee Maintenance',
        'Validate Restaurant location',
        'Select TM with approved rate change',
        'Click +Lookup button',
        'Validate all fields',
        'Enter Job Code Rate and Merit Increase',
        'Click Save and Refresh'
      ]
    },
    { 
      id: 'transfer',
      title: 'Transfer a TM',
      steps: [
        'Homepage → My Team',
        'Quick Action Menu → Show More',
        'Click Transfer in Employment section',
        'Search and select TM',
        'Click Continue',
        'Enter start date and Transfer Reason',
        'Select Transfer Location details',
        'Click Submit',
        'Validate transferred TM progress'
      ]
    },
    { 
      id: 'termination',
      title: 'TM Termination',
      steps: [
        'Homepage → My Team',
        'Quick Action Menu → Show More',
        'Under Employment → Termination',
        'Search TM name/ID',
        'Select termination details',
        'Click Continue',
        'Select User Access and Rehire settings',
        'Add comments → Submit'
      ]
    },
    { 
      id: 'order',
      title: 'Placing an Order',
      steps: [
        'Homepage → Procurement tab',
        'Click Purchase Requisition tile',
        'Click Punchout Catalogs',
        'Select Supplier',
        'Select and add items',
        'Verify order → Submit',
        'Receive confirmation PDF'
      ]
    },
    { 
      id: 'expense',
      title: 'Creating Expense Report',
      steps: [
        'Homepage → Me tab → Expenses',
        'Create Expense Report',
        'Attach receipts for each item',
        'Complete all required details',
        'Accept corporate policies → Submit'
      ]
    },
    { 
      id: 'bonus',
      title: 'TM Bonus Management',
      steps: [
        'Homepage → My Team tab',
        'Click on My Team tile',
        'Under Compensation → Individual Compensation',
        'Search TM\'s name or ID',
        'Select start date → Continue',
        'Click +Add under Additional Compensation',
        'Select Plan, Option, Net amount',
        'Click OK button',
        'Review details → Continue',
        'Add attachments/comments',
        'Click Submit'
      ]
    },
    { 
      id: 'giftcard',
      title: 'Gift Cards: TM Compensation',
      steps: [
        'Homepage → My Team tab',
        'Click on My Team tile',
        'Under Compensation → Individual Compensation',
        'Search TM\'s name or ID',
        'Select start date → Continue',
        'Click +Add under Additional Compensation',
        'Select: Gift Card for Hrly',
        'Enter amount → OK',
        'Review details → Continue',
        'Add attachments/comments',
        'Click Submit'
      ]
    }
  ],
  aloha: [
    {
      id: 'paid-io',
      title: 'Paid Out/Paid In',
      steps: [
        'Touch Functions',
        'Touch Financials',
        'Touch Cash Functions',
        'Touch Server Paid Out/In',
        'Highlight TM',
        'Enter amount',
        'Touch OK to confirm',
        'Touch Exit'
      ]
    },
    {
      id: 'server-co',
      title: 'Server Checkouts',
      steps: [
        'Validate ATO checks are closed',
        'Swipe card to allow checkout',
        'Compare CC receipts',
        'Verify CC tips entered correctly',
        'Collect cash owed and tip out'
      ]
    },
    {
      id: 'check-pos',
      title: 'Checking FOH POS',
      steps: [
        'Touch floating logo on each POS',
        'Fix any errors indicated',
        'Validate system and business dates match',
        'Open IT ticket if problem persists'
      ]
    },
    {
      id: 'void',
      title: 'Voiding an Item',
      steps: [
        'Touch Functions',
        'Touch Financials',
        'Touch Void Items',
        'Highlight TM',
        'Select Table/Check',
        'Highlight items to void',
        'Touch OK',
        'Touch Exit'
      ]
    }
  ],
  menulink: [
    {
      id: 'forecast',
      title: 'Input Forecasted Sales',
      steps: [
        'Click Sales',
        'Click Forecasting',
        'Select Period & Week',
        'Click New Forecast',
        'Enter forecasted sales',
        'Click Save'
      ]
    },
    {
      id: 'inv-count',
      title: 'Inventory Count & Enter',
      steps: [
        'Update Count Sheets',
        'Print Worksheets',
        'Count Inventory',
        'Enter/Post Inventory',
        'Enter quantities',
        'Click Save',
        'Print Exception Report'
      ]
    },
    {
      id: 'spoil',
      title: 'Spoil & Loss',
      steps: [
        'Inventory & Prep',
        'Click Waste',
        'Select Prep or Raw',
        'Select Item Name',
        'Enter details',
        'Click Add Item',
        'Click Save'
      ]
    },
    {
      id: 'place-po',
      title: 'Placing Order/PO',
      steps: [
        'Print PO Worksheets',
        'Review Suggested Order',
        'Place order with vendor',
        'Click Orders',
        'Adjust as needed',
        'Click Save'
      ]
    }
  ]
};

const OracleAlohaGuide = ({ onBack }) => {
  const [selectedSystem, setSelectedSystem] = useState('oracle');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProcedures = useMemo(() => {
    const procs = proceduresData[selectedSystem];
    if (!searchTerm) return procs;
    
    const term = searchTerm.toLowerCase();
    return procs.filter(proc => 
      proc.title.toLowerCase().includes(term) ||
      proc.steps.some(step => step.toLowerCase().includes(term))
    );
  }, [selectedSystem, searchTerm]);

  const systemConfig = {
    oracle: {
      bg: '#E81B23', // Chili's red
      name: 'Oracle',
      count: proceduresData.oracle.length
    },
    aloha: {
      bg: '#FFC60B', // Chili's yellow
      name: 'Aloha',
      count: proceduresData.aloha.length
    },
    menulink: {
      bg: colors.chiliGreen,
      name: 'MenuLink',
      count: proceduresData.menulink.length
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header - Match Dashboard */}
      <div style={{ ...styles.header }}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="bg-white bg-opacity-20 p-2 rounded-md mr-3 hover:bg-opacity-30 transition-all cursor-pointer"
              title="Back to Home">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold mb-1">📖 Quick Reference Cards</h1>
              <p className="text-yellow-100">Oracle • Aloha • MenuLink Procedures</p>
            </div>
          </div>
        </div>
        <p className="text-center text-yellow-100 text-lg font-medium">Step-by-step procedures at your fingertips</p>
      </div>

      {/* System Selector Pills */}
      <div className="px-6 mb-4 flex gap-3 flex-wrap">
        {Object.keys(systemConfig).map(sys => {
          const config = systemConfig[sys];
          const isActive = selectedSystem === sys;
          return (
            <button
              key={sys}
              onClick={() => { setSelectedSystem(sys); setSearchTerm(''); }}
              className="px-6 py-2 rounded-full font-bold text-sm transition-all"
              style={{
                backgroundColor: isActive ? colors.chiliRed : 'transparent',
                color: 'white',
                border: isActive ? 'none' : `2px solid ${colors.whiteAlpha(0.3)}`
              }}>
              {config.name} ({config.count})
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search ${systemConfig[selectedSystem].name} procedures...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 text-lg rounded-lg border-2 focus:outline-none transition-all shadow-lg font-medium"
            style={{
              borderColor: searchTerm ? systemConfig[selectedSystem].bg : 'white',
              background: 'white'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 mb-4">
        <p className="text-lg font-bold text-white">
          {filteredProcedures.length} procedure{filteredProcedures.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Procedure Cards - With cool hover animation */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProcedures.map(proc => (
          <div
            key={proc.id}
            className="bg-white rounded-lg p-6 shadow-md border-l-4 transition-all relative overflow-hidden"
            style={{
              borderColor: systemConfig[selectedSystem].bg,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              const gradient = e.currentTarget.querySelector('.gradient-bar');
              if (gradient) gradient.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const gradient = e.currentTarget.querySelector('.gradient-bar');
              if (gradient) gradient.style.opacity = '0';
            }}>
            {/* Cool gradient bar on left that appears on hover */}
            <div
              className="gradient-bar"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: `linear-gradient(180deg, ${colors.chiliRed}, ${colors.chiliYellow}, ${colors.chiliGreen})`,
                opacity: 0,
                transition: 'opacity 0.3s',
                boxShadow: '0 0 20px currentColor'
              }}
            />

            <h3 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
              {proc.title}
            </h3>
            <ol className="space-y-2">
              {proc.steps.map((step, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <span className="font-bold mr-2 flex-shrink-0" style={{ color: systemConfig[selectedSystem].bg }}>
                    {idx + 1}.
                  </span>
                  <span className="flex-1" style={{ color: colors.chiliBrown }}>{step}</span>
                </li>
              ))}
            </ol>
            {proc.note && (
              <div className="mt-4 p-3 rounded-lg" style={{
                backgroundColor: `${colors.chiliYellow}40`,
                borderLeft: `3px solid ${colors.chiliYellow}`
              }}>
                <p className="text-xs font-bold" style={{ color: '#92400e' }}>
                  ⚠️ {proc.note}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProcedures.length === 0 && (
        <div className="px-6">
          <div className="text-center py-20 bg-white rounded-xl shadow-2xl">
            <Search size={80} className="mx-auto mb-6" style={{ color: colors.chiliGray }} />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.chiliNavy }}>No procedures found</p>
            <p className="text-lg" style={{ color: colors.chiliGray }}>Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OracleAlohaGuide;
