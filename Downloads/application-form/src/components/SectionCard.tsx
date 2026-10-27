import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  stepNumber: number;
  isActive?: boolean;
  isCompleted?: boolean;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  stepNumber,
  isActive = true,
  isCompleted = false,
  children,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-xs border transition-all duration-200 overflow-hidden ${
        isActive
          ? 'border-emerald-700 ring-1 ring-emerald-700/20 shadow-md'
          : isCompleted
          ? 'border-emerald-200 bg-emerald-50/10'
          : 'border-slate-200 opacity-90'
      }`}
    >
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              isCompleted
                ? 'bg-emerald-700 text-white'
                : isActive
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {isCompleted ? '✓' : stepNumber}
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {isCompleted && (
          <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
            Completed
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};
