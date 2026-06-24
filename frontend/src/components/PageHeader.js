import React from 'react';

export default function PageHeader({
  title,
  description,
  right
}) {
  return (
    <div className="page-header">
      <div>
        {title ? <h1 className="page-title">{title}</h1> : null}
        {description ? <p className="page-subtitle">{description}</p> : null}
      </div>
      {right ? <div className="page-header-right">{right}</div> : null}
    </div>
  );
}

