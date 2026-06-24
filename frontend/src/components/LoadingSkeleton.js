import React from 'react';

export default function LoadingSkeleton({ lines = 3 }) {
  return (
    <div className="skeleton" aria-busy="true" aria-live="polite">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-line" />
      ))}
    </div>
  );
}

