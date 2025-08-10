import React from 'react';

export default function LoadingButton({ onClick, loading, children, ...props }) {
  return (
    <button onClick={onClick} disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  );
}