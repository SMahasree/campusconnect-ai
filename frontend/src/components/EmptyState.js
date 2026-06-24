import React from 'react';

export default function EmptyState({
  icon = '✨',
  title,
  description,
  actionLabel,
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-content">
        <div className="empty-title">{title}</div>
        {description ? <div className="empty-description">{description}</div> : null}
        {actionLabel && onAction ? (
          <button className="primary" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

