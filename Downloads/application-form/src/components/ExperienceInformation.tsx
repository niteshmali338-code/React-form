import React from 'react';
import { ExperienceRecord, ValidationErrors } from '../types/application';
import { FormInput } from './FormInput';

interface Props {
  records: ExperienceRecord[];
  errors: ValidationErrors;
  onChangeRecord: (index: number, field: keyof ExperienceRecord, value: any) => void;
  onAddRecord: () => void;
  onRemoveRecord: (index: number) => void;
}

export const ExperienceInformation: React.FC<Props> = ({
  records,
  errors,
  onChangeRecord,
  onAddRecord,
  onRemoveRecord,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          List your previous jobs, internships, or current employment. Leave empty if fresh graduate.
        </p>
        <button
          type="button"
          onClick={onAddRecord}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {records.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-sm text-slate-500">No work experience added yet.</p>
          <button
            type="button"
            onClick={onAddRecord}
            className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            + Click here to add your first work experience / internship
          </button>
        </div>
      ) : (
        records.map((record, index) => (
          <div
            key={record.id || index}
            className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                Experience #{index + 1}
              </h4>
              <button
                type="button"
                onClick={() => onRemoveRecord(index)}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Company / Organization Name"
                id={`exp-comp-${index}`}
                value={record.company}
                onChange={(e) => onChangeRecord(index, 'company', e.target.value)}
                error={errors[`experience.${index}.company`]}
                required
                placeholder="e.g. Acme Corp"
              />
              <FormInput
                label="Job Title / Designation"
                id={`exp-title-${index}`}
                value={record.designation}
                onChange={(e) => onChangeRecord(index, 'designation', e.target.value)}
                error={errors[`experience.${index}.designation`]}
                required
                placeholder="e.g. Software Engineer"
              />
              <FormInput
                label="Start Date"
                id={`exp-start-${index}`}
                type="date"
                value={record.startDate}
                onChange={(e) => onChangeRecord(index, 'startDate', e.target.value)}
                error={errors[`experience.${index}.startDate`]}
                required
              />
              {!record.isCurrent && (
                <FormInput
                  label="End Date"
                  id={`exp-end-${index}`}
                  type="date"
                  value={record.endDate}
                  onChange={(e) => onChangeRecord(index, 'endDate', e.target.value)}
                  error={errors[`experience.${index}.endDate`]}
                  required={!record.isCurrent}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`exp-curr-${index}`}
                checked={record.isCurrent}
                onChange={(e) => onChangeRecord(index, 'isCurrent', e.target.checked)}
                className="w-4 h-4 text-emerald-700 border-slate-300 rounded focus:ring-emerald-700"
              />
              <label htmlFor={`exp-curr-${index}`} className="text-xs font-medium text-slate-700 cursor-pointer">
                I currently work here
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`exp-resp-${index}`} className="text-xs font-medium text-slate-700">
                Key Responsibilities & Achievements
              </label>
              <textarea
                id={`exp-resp-${index}`}
                rows={2}
                value={record.keyResponsibilities}
                onChange={(e) => onChangeRecord(index, 'keyResponsibilities', e.target.value)}
                placeholder="Brief summary of your primary duties..."
                className="w-full px-3 py-2 rounded-lg text-sm border border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};
