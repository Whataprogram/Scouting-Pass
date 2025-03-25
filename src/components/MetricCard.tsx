import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, className }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-1 flex items-baseline">
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};