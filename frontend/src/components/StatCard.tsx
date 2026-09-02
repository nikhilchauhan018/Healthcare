import React from 'react';

interface StatCardProps {
  id?: string;
  label: string;
  value: string | number;
  subtext: string;
  highlight?: 'teal' | 'clay' | 'default';
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  label,
  value,
  subtext,
  highlight = 'default',
}) => {
  const valueColor =
    highlight === 'clay'
      ? 'text-clay'
      : highlight === 'teal'
      ? 'text-teal'
      : 'text-ink';

  const subtextColor =
    highlight === 'clay'
      ? 'text-clay'
      : highlight === 'teal'
      ? 'text-teal'
      : 'text-inkFaint';

  return (
    <div
      id={id}
      className="p-5 bg-surface border border-line rounded-none flex flex-col justify-between"
    >
      <div>
        <p className="text-[10px] text-inkFaint uppercase tracking-wider mb-1 font-mono">
          {label}
        </p>
        <p className={`text-3xl font-medium font-mono ${valueColor}`}>
          {value}
        </p>
      </div>
      <p className={`text-[10px] font-sans mt-2 ${subtextColor}`}>
        {subtext}
      </p>
    </div>
  );
};
