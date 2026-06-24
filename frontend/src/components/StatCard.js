import React from 'react';

export default function StatCard({
  icon,
  label,
  value,
  trend = null
}) {
  return (
    <div className="stat-card-2">
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div className="stat-value">{value ?? 0}</div>
      {trend ? (
        <div className={`stat-trend ${trend.kind || 'neutral'}`}> {trend.text} </div>
      ) : (
        <div className="stat-trend neutral">—</div>
      )}
    </div>
  );
}

