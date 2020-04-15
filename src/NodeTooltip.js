import React from 'react';
import './NodeTooltip.css';

export const NodeTooltip = ({ text, top, left}) => {
  return (
    <div className="node-tooltip" style={{top, left}} >
      <p>{text}</p>
    </div>
  );
};