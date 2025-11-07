import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  TrendingUp,
  Users,
  Award,
  ChevronLeft
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { useCoaching } from '../../../hooks/useCoaching';

// Chili's Brand Colors
const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliBrown: 'rgb(60, 58, 53)',
  chiliGray: 'rgb(161, 159, 154)'
};

const ObservationList = ({ manager }) => {
  const navigate = useNavigate();
  const coaching = useCoaching();
  const [observations, setObservations] = useState([]);
  const [filteredObservations, setFilteredObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('week');
  const [stats, setStats] = useState({
    totalObservations: 0,
    coachingOpportunities: 0,
    recognitionsGiven: 0,
    positionsCovered: new Set()
  });

  useEffect(() => {
    loadObservations();
  }, [manager, filterDateRange]);

  useEffect(() => {
    filterAndSearchObservations();
  }, [observations, searchTerm, filterShift]);

  const loadObservations = async () => {
    if (!manager) return;

    setLoading(true);
    try {
      let startDate = null;
      let endDate = new Date();

      // Calculate date range based on filter
      switch (filterDateRange) {
        case 'today':
          startDate = new Date();
          break;
        case 'week':
          startDate = startOfWeek(new Date());
          endDate = endOfWeek(new Date());
          break;
        case 'month':
          startDate = new Date();
          startDate.setDate(1);
          break;
        case 'period':
          // Current fiscal period (would need actual period calculation)
          startDate = subDays(new Date(), 28);
          break;
        default:
          startDate = subDays(new Date(), 7);
      }

      const { data } = await coaching.floorObservations.getList({
        managerId: manager.isGM ? null : manager.name,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      });

      if (data) {
        setObservations(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading observations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchObservations = () => {
    let filtered = [...observations];

    // Apply shift filter
    if (filterShift !== 'all') {
      filtered = filtered.filter(obs => obs.shift_type === filterShift);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(obs =>
        obs.manager_notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.top_performer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.coaching_priorities?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredObservations(filtered);
  };

  const calculateStats = (data) => {
    const positions = new Set();
    let coachingCount = 0;
    let recognitionCount = 0;

    data.forEach(obs => {
      // Count positions observed
      if (obs.observations) {
        Object.keys(obs.observations).forEach(pos => positions.add(pos));

        // Count coaching opportunities
        Object.values(obs.observations).forEach(posObs => {
          if (typeof posObs === 'object') {
            Object.values(posObs).forEach(behavior => {
              if (typeof behavior === 'object' && behavior.met === false) {
                coachingCount++;
              }
            });
          }
        });
      }

      // Count recognitions
      if (obs.top_performer?.name) {
        recognitionCount++;
      }
    });

    setStats({
      totalObservations: data.length,
      coachingOpportunities: coachingCount,
      recognitionsGiven: recognitionCount,
      positionsCovered: positions
    });
  };

  const getShiftBadgeColor = (shiftType) => {
    switch (shiftType) {
      case 'AM': return colors.chiliYellow;
      case 'PM': return colors.chiliNavy;
      case 'Close': return colors.chiliBrown;
      default: return colors.chiliGray;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliNavy }}>
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/coaching')}
              className="mr-4 hover:opacity-70 transition-opacity"
            >
              <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
            </button>
            <div>
              <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                Floor Observations
              </h1>
              <p className="text-sm" style={{ color: colors.chiliBrown }}>
                Track coaching and team performance
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/coaching/observations/new')}
            className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            style={{ backgroundColor: colors.chiliGreen }}
          >
            <Plus size={20} className="mr-2" />
            New Observation
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {!loading && (
        <div className="bg-white border-b p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
                {stats.totalObservations}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                Total Observations
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliRed }}>
                {stats.coachingOpportunities}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                Coaching Given
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliGreen }}>
                {stats.recognitionsGiven}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                Recognitions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliYellow }}>
                {stats.positionsCovered.size}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                Positions Covered
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 bg-white border-b">
        <div className="flex flex-wrap gap-4">
          {/* Date Range Filter */}
          <div className="flex gap-2">
            {['today', 'week', 'month', 'period'].map(range => (
              <button
                key={range}
                onClick={() => setFilterDateRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  filterDateRange === range
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={filterDateRange === range ? { backgroundColor: colors.chiliNavy } : {}}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          {/* Shift Filter */}
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Shifts</option>
            <option value="AM">AM Only</option>
            <option value="PM">PM Only</option>
            <option value="Close">Close Only</option>
          </select>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.chiliGray }} />
            <input
              type="text"
              placeholder="Search observations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-1 border rounded-md text-sm"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={() => alert('Export feature coming soon!')}
            className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center"
          >
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Observations List */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg" style={{ color: colors.chiliBrown }}>
              Loading observations...
            </div>
          </div>
        ) : filteredObservations.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Eye size={48} className="mx-auto mb-4" style={{ color: colors.chiliGray }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.chiliNavy }}>
              No Observations Found
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.chiliBrown }}>
              {observations.length === 0
                ? 'Start by creating your first floor observation'
                : 'Try adjusting your filters or search terms'}
            </p>
            {observations.length === 0 && (
              <button
                onClick={() => navigate('/coaching/observations/new')}
                className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.chiliGreen }}
              >
                Create First Observation
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredObservations.map(observation => (
              <div
                key={observation.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/coaching/observations/${observation.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold" style={{ color: colors.chiliNavy }}>
                          {format(new Date(observation.shift_date), 'EEEE, MMM d')}
                        </h3>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getShiftBadgeColor(observation.shift_type) }}
                        >
                          {observation.shift_type} Shift
                        </span>
                      </div>
                      {manager.isGM && (
                        <p className="text-sm" style={{ color: colors.chiliBrown }}>
                          By: {observation.manager_name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm">
                      {observation.top_performer?.name && (
                        <div className="flex items-center">
                          <Award size={16} className="mr-1" style={{ color: colors.chiliYellow }} />
                          <span style={{ color: colors.chiliBrown }}>
                            {observation.top_performer.name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" style={{ color: colors.chiliNavy }} />
                        <span style={{ color: colors.chiliBrown }}>
                          {Object.keys(observation.observations || {}).length} Positions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coaching Priorities Preview */}
                  {observation.coaching_priorities?.length > 0 && (
                    <div className="p-3 rounded-md" style={{ backgroundColor: colors.chiliNavy }}>
                      <p className="text-xs font-medium mb-1" style={{ color: colors.chiliNavy }}>
                        Next Shift Priorities:
                      </p>
                      <ul className="text-xs" style={{ color: colors.chiliBrown }}>
                        {observation.coaching_priorities.slice(0, 2).map((priority, idx) => (
                          <li key={idx}>• {priority}</li>
                        ))}
                        {observation.coaching_priorities.length > 2 && (
                          <li>...and {observation.coaching_priorities.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Metrics Preview */}
                  {observation.metrics && (
                    <div className="mt-3 flex gap-4 text-xs" style={{ color: colors.chiliBrown }}>
                      {observation.metrics.sales && (
                        <span>Sales: ${observation.metrics.sales}</span>
                      )}
                      {observation.metrics.labor && (
                        <span>Labor: {observation.metrics.labor}%</span>
                      )}
                      {observation.metrics.guest_count && (
                        <span>Guests: {observation.metrics.guest_count}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Button */}
      {observations.length > 0 && (
        <div className="p-4">
          <button
            onClick={() => navigate('/coaching/observations/analytics')}
            className="w-full py-3 rounded-md border-2 font-medium hover:bg-white transition-all flex items-center justify-center"
            style={{ borderColor: colors.chiliNavy, color: colors.chiliNavy }}
          >
            <TrendingUp size={20} className="mr-2" />
            View Analytics & Trends
          </button>
        </div>
      )}
    </div>
  );
};

export default ObservationList;