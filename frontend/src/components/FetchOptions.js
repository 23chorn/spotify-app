import React from 'react';

const FetchOptions = ({ limit, timeRange, onLimitChange, onTimeRangeChange, onRefresh }) => {
  const handleLimitChange = (newLimit) => {
    const numLimit = Number(newLimit);
    onLimitChange(numLimit);
    // Pass the new limit value directly to refresh
    onRefresh({ limit: numLimit, time_range: timeRange });
  };

  const handleTimeRangeChange = (newTimeRange) => {
    onTimeRangeChange(newTimeRange);
    // Pass the new time range value directly to refresh
    onRefresh({ limit, time_range: newTimeRange });
  };

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
      <div>
        <label style={{ marginRight: '0.5rem' }}>Items to show:</label>
        <select 
          value={limit} 
          onChange={(e) => handleLimitChange(e.target.value)}
          style={{ padding: '0.25rem' }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      
      <div>
        <label style={{ marginRight: '0.5rem' }}>Time range:</label>
        <select 
          value={timeRange} 
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          style={{ padding: '0.25rem' }}
        >
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      </div>
    </div>
  );
};

export default FetchOptions;