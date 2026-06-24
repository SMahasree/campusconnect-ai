import React from 'react';

export default function Badge({
  children,
  kind = 'default',
  className = ''
}) {
  return (
    <span className={`badge-pill badge-${kind} ${className}`.trim()}>
      {children}
    </span>
  );
}

