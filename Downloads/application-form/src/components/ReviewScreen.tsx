import React from 'react';
import { ApplicationData } from '../types/application';

interface Props {
  data: ApplicationData;
  onEditSection: (sectionStep: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError?: string | null;
}

export const ReviewScreen: React.FC<Props> = ({
  data,
  onEditSection,
  onSubmit,
  isSubmitting,
  submitError,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="font-semibold">Please review your information carefully before submitting.</p>
          <p className="text-xs text-amber-800 mt-0.5">
            You can edit any section by clicking the "Edit Section" button beside it.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{submitError}</p>
        </div>
      )}

      {/* 1. Personal Info Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-800">1. Personal Information</h3>
          <button
            type="button"
            onClick={() => onEditSection(1)}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Edit Section
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Applicant Type</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
              {data.personal.applicantType} Form
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{data.personal.applicantType === 'Student' ? 'Student ID / Roll No' : 'Employee ID'}</span>
            <span className="font-semibold text-slate-900">{data.personal.identifierNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Full Name</span>
            <span className="font-medium text-slate-900">{data.personal.firstName} {data.personal.lastName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Father's Name</span>
            <span className="font-medium text-slate-900">{data.personal.fatherName || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Mother's Name</span>
            <span className="font-medium text-slate-900">{data.personal.motherName || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Date of Birth</span>
            <span className="font-medium text-slate-900">{data.personal.dob || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Gender</span>
            <span className="font-medium text-slate-900">{data.personal.gender}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Nationality</span>
            <span className="font-medium text-slate-900">{data.personal.nationality}</span>
          </div>
        </div>
      </div>

      {/* 2. Contact Details Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-800">2. Contact Details</h3>
          <button
            type="button"
            onClick={() => onEditSection(2)}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Edit Section
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Email Address</span>
            <span className="font-medium text-slate-900">{data.contact.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Mobile Number</span>
            <span className="font-medium text-slate-900">{data.contact.mobile}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Alternate Mobile</span>
            <span className="font-medium text-slate-900">{data.contact.alternateMobile || 'None'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">LinkedIn Profile</span>
            <span className="font-medium text-indigo-600 truncate block">{data.contact.linkedinUrl || 'None'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Portfolio / Website</span>
            <span className="font-medium text-indigo-600 truncate block">{data.contact.portfolioUrl || 'None'}</span>
          </div>
        </div>
      </div>

      {/* 3. Address Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-800">3. Address Information</h3>
          <button
            type="button"
            onClick={() => onEditSection(3)}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Edit Section
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block font-semibold mb-1">Current Address</span>
            <p className="text-slate-800">
              {data.address.street}, {data.address.city}, {data.address.state} - {data.address.pincode}, {data.address.country}
            </p>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold mb-1">Permanent Address</span>
            <p className="text-slate-800">
              {data.address.sameAsPermanent
                ? 'Same as current address'
                : `${data.address.permStreet}, ${data.address.permCity}, ${data.address.permState} - ${data.address.permPincode}, ${data.address.permCountry}`}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Education Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-800">4. Education Details ({data.education.length})</h3>
          <button
            type="button"
            onClick={() => onEditSection(4)}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Edit Section
          </button>
        </div>
        <div className="space-y-3 text-xs">
          {data.education.map((edu, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{edu.degree} {edu.specialization ? `(${edu.specialization})` : ''}</span>
                <span className="text-indigo-600">Score: {edu.scorePercentage}</span>
              </div>
              <p className="text-slate-600 mt-1">{edu.institution} • {edu.boardOrUniversity}</p>
              <p className="text-slate-400 mt-0.5">Passing Year: {edu.passingYear}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Experience Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-800">5. Experience Details ({data.experience.length})</h3>
          <button
            type="button"
            onClick={() => onEditSection(5)}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Edit Section
          </button>
        </div>
        {data.experience.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No work experience listed (Fresh Graduate).</p>
        ) : (
          <div className="space-y-3 text-xs">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.designation} @ {exp.company}</span>
                  <span className="text-slate-500">{exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.keyResponsibilities && (
                  <p className="text-slate-600 mt-1">{exp.keyResponsibilities}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Final Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <span>Confirm & Submit Application</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
