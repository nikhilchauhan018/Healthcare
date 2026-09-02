import React from 'react';
import { PatientStatus } from '../types';

interface StatusTagProps {
  status: PatientStatus | string;
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, className = '' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-tealTint text-tealDeep';
  if (normalized === 'critical' || normalized === 'warning' || normalized === 'urgent') {
    colorClasses = 'bg-clayTint text-clay';
  } else if (normalized === 'high risk' || normalized === 'danger') {
    colorClasses = 'bg-dangerTint text-danger';
  } else if (normalized === 'recovering' || normalized === 'stable') {
    colorClasses = 'bg-tealTint text-tealDeep';
  } else if (normalized === 'admin') {
    colorClasses = 'bg-clayTint text-clay';
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-sm uppercase tracking-wider font-mono ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
};
