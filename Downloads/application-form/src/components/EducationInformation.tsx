import React from 'react';
import { EducationRecord, ValidationErrors } from '../types/application';
import { FormInput } from './FormInput';

interface Props {
  records: EducationRecord[];
  errors: ValidationErrors;
  onChangeRecord: (index: number, field: keyof EducationRecord, value: string) => void;
  onAddRecord: () => void;
  onRemoveRecord: (index: number) => void;
}

export const EducationInformation: React.FC<Props> = ({
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
          Please add your high school, diploma, undergraduate, or postgraduate qualifications.
        </p>
        <button
          type="button"
          onClick={onAddRecord}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </button>
      </div>

      {records.map((record, index) => (
        <div
          key={record.id || index}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 relative"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center">
                {index + 1}
              </span>
              Qualification #{index + 1}
            </h4>
            {records.length > 1 && (
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Degree / Qualification"
              id={`edu-degree-${index}`}
              value={record.degree}
              onChange={(e) => onChangeRecord(index, 'degree', e.target.value)}
              error={errors[`education.${index}.degree`]}
              required
              placeholder="e.g. B.Tech / B.Sc / High School"
            />
            <FormInput
              label="Specialization / Field of Study"
              id={`edu-spec-${index}`}
              value={record.specialization}
              onChange={(e) => onChangeRecord(index, 'specialization', e.target.value)}
              error={errors[`education.${index}.specialization`]}
              placeholder="e.g. Computer Science & Engineering"
            />
            <FormInput
              label="School / College / Institute"
              id={`edu-inst-${index}`}
              value={record.institution}
              onChange={(e) => onChangeRecord(index, 'institution', e.target.value)}
              error={errors[`education.${index}.institution`]}
              required
              placeholder="e.g. National Institute of Technology"
            />
            <FormInput
              label="Board / University"
              id={`edu-board-${index}`}
              value={record.boardOrUniversity}
              onChange={(e) => onChangeRecord(index, 'boardOrUniversity', e.target.value)}
              error={errors[`education.${index}.boardOrUniversity`]}
              required
              placeholder="e.g. VTU / CBSE / State Board"
            />
            <FormInput
              label="Year of Passing"
              id={`edu-year-${index}`}
              type="number"
              value={record.passingYear}
              onChange={(e) => onChangeRecord(index, 'passingYear', e.target.value)}
              error={errors[`education.${index}.passingYear`]}
              required
              placeholder="e.g. 2024"
              min="1970"
              max="2030"
            />
            <FormInput
              label="Score (% or CGPA)"
              id={`edu-score-${index}`}
              value={record.scorePercentage}
              onChange={(e) => onChangeRecord(index, 'scorePercentage', e.target.value)}
              error={errors[`education.${index}.scorePercentage`]}
              required
              placeholder="e.g. 85.5 or 8.8 CGPA"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
