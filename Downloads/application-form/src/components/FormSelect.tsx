import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: Option[];
  error?: string;
  required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  options,
  error,
  required,
  className = '',
  ...props
}) => {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500 font-bold">*</span>}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-3.5 py-2.5 rounded-lg text-sm border bg-white transition-all duration-150 outline-none ${
          error
            ? 'border-rose-500 ring-2 ring-rose-500/20 text-rose-900 bg-rose-50/20'
            : 'border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 hover:border-slate-400'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};
