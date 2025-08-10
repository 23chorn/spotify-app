import React from 'react';

export default function Profile({ profile }) {
  if (!profile) return null;

  return (
    <div
      style={{
        textAlign: 'left',
        backgroundColor: '#eee',
        padding: '10px',
        borderRadius: '5px',
        maxHeight: '400px',
        overflowY: 'auto',
        wordBreak: 'break-word',
        marginTop: '20px',
      }}
    >
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {Object.entries(profile).map(([key, value]) => {
          const displayValue =
            typeof value === 'object' && value !== null
              ? JSON.stringify(value, null, 2)
              : String(value);
          return (
            <li key={key} style={{ marginBottom: '8px' }}>
              <strong>{key}:</strong>
              <pre
                style={{
                  display: 'inline',
                  margin: 0,
                  paddingLeft: '8px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {displayValue}
              </pre>
            </li>
          );
        })}
      </ul>
    </div>
  );
}