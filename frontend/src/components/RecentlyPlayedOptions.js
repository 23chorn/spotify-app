import React from 'react';

const RecentlyPlayedOptions = ({ limit, onLimitChange, onRefresh }) => {
  const handleLimitChange = (newLimit) => {
    const numLimit = Number(newLimit);
    onLimitChange(numLimit);
    // Pass the new limit value directly to refresh
    onRefresh({ limit: numLimit });
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
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
  );
};

export default RecentlyPlayedOptions;