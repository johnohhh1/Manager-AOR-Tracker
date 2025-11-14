import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { colors } from '../../styles/design-system';
import { useBrandStandards } from '../../hooks/useBrandStandards';
import { format } from 'date-fns';

const ActionItemsList = ({ manager, onBack }) => {
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('open'); // 'open', 'in_progress', 'completed', 'all'
  const [expandedItem, setExpandedItem] = useState(null);

  const brandStandards = useBrandStandards();

  useEffect(() => {
    loadActionItems();
  }, [statusFilter]);

  const loadActionItems = async () => {
    setLoading(true);
    try {
      const filters = statusFilter === 'all' ? {} : { status: statusFilter };
      const { data, error } = await brandStandards.actionItems.getList(filters);

      if (data) {
        setActionItems(data);
      }
    } catch (error) {
      console.error('Error loading action items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      if (newStatus === 'completed') {
        await brandStandards.actionItems.complete(itemId);
      } else {
        await brandStandards.actionItems.update(itemId, { status: newStatus });
      }
      loadActionItems(); // Refresh list
    } catch (error) {
      console.error('Error updating action item:', error);
      alert('Error updating action item. Please try again.');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this action item?')) {
      return;
    }

    try {
      await brandStandards.actionItems.delete(itemId);
      loadActionItems(); // Refresh list
    } catch (error) {
      console.error('Error deleting action item:', error);
      alert('Error deleting action item. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.chiliGreen;
      case 'in_progress':
        return colors.chiliYellow;
      case 'open':
      default:
        return colors.chiliRed;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} />;
      case 'in_progress':
        return <Clock size={20} />;
      case 'open':
      default:
        return <AlertCircle size={20} />;
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const filteredItems = actionItems;
  const openCount = actionItems.filter(i => i.status === 'open').length;
  const inProgressCount = actionItems.filter(i => i.status === 'in_progress').length;
  const completedCount = actionItems.filter(i => i.status === 'completed').length;

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
          Action Items
        </h1>
        <p className="text-sm" style={{ color: colors.chiliBrown }}>
          Track and manage validation issues
        </p>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 text-center shadow-md">
          <div className="text-2xl font-bold" style={{ color: colors.chiliRed }}>
            {openCount}
          </div>
          <div className="text-xs" style={{ color: colors.chiliBrown }}>
            Open
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-md">
          <div className="text-2xl font-bold" style={{ color: colors.chiliYellow }}>
            {inProgressCount}
          </div>
          <div className="text-xs" style={{ color: colors.chiliBrown }}>
            In Progress
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-md">
          <div className="text-2xl font-bold" style={{ color: colors.chiliGreen }}>
            {completedCount}
          </div>
          <div className="text-xs" style={{ color: colors.chiliBrown }}>
            Completed
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { value: 'open', label: 'Open' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'all', label: 'All' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer"
              style={
                statusFilter === filter.value
                  ? {
                      backgroundColor: colors.chiliNavy,
                      color: 'white'
                    }
                  : {
                      backgroundColor: 'white',
                      color: colors.chiliBrown
                    }
              }
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-8 text-center" style={{ color: colors.chiliBrown }}>
          Loading action items...
        </div>
      )}

      {/* Action Items List */}
      {!loading && filteredItems.length === 0 && (
        <div className="p-8 text-center">
          <p style={{ color: colors.chiliBrown }}>
            No {statusFilter !== 'all' ? statusFilter : ''} action items found.
          </p>
        </div>
      )}

      {!loading && filteredItems.length > 0 && (
        <div className="p-4 space-y-3 pb-20">
          {filteredItems.map((item) => {
            const overdue = isOverdue(item.due_date, item.status);
            const isExpanded = expandedItem === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border-l-4"
                style={{ borderColor: getStatusColor(item.status) }}
              >
                {/* Main Content */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: getStatusColor(item.status) }}>
                          {getStatusIcon(item.status)}
                        </span>
                        <span className="font-bold text-sm" style={{ color: colors.chiliNavy }}>
                          {item.section_name}
                        </span>
                      </div>
                      <p className="font-medium" style={{ color: colors.chiliNavy }}>
                        {item.issue_description}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm" style={{ color: colors.chiliBrown }}>
                    <strong>Action:</strong> {item.action_required}
                  </div>

                  <div className="flex justify-between items-center mt-2 text-sm">
                    <div style={{ color: colors.chiliBrown }}>
                      <strong>Owner:</strong> {item.owner}
                    </div>
                    <div
                      className="font-medium"
                      style={{ color: overdue ? colors.chiliRed : colors.chiliBrown }}
                    >
                      Due: {format(new Date(item.due_date), 'MMM d, yyyy')}
                      {overdue && ' (OVERDUE)'}
                    </div>
                  </div>

                  {/* Photo if exists */}
                  {item.issue_photo_url && isExpanded && (
                    <div className="mt-3">
                      <img
                        src={item.issue_photo_url}
                        className="rounded border w-full max-h-64 object-cover"
                        style={{ borderColor: colors.chiliGray }}
                        alt="Issue"
                      />
                    </div>
                  )}
                </div>

                {/* Actions (shown when expanded) */}
                {isExpanded && item.status !== 'completed' && (
                  <div className="border-t p-3 bg-gray-50">
                    <div className="flex gap-2">
                      {item.status === 'open' && (
                        <button
                          onClick={() => handleStatusChange(item.id, 'in_progress')}
                          className="flex-1 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
                          style={{
                            backgroundColor: colors.chiliYellow,
                            color: 'white'
                          }}
                        >
                          Start Working
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(item.id, 'completed')}
                        className="flex-1 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
                        style={{
                          backgroundColor: colors.chiliGreen,
                          color: 'white'
                        }}
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
                        style={{
                          backgroundColor: colors.chiliRed,
                          color: 'white'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed badge */}
                {item.status === 'completed' && item.completed_at && (
                  <div className="border-t p-2 bg-green-50 text-center text-sm" style={{ color: colors.chiliGreen }}>
                    ✓ Completed {format(new Date(item.completed_at), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActionItemsList;
