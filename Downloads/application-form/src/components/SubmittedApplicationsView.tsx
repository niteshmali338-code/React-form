import React, { useEffect, useState } from 'react';
import { fetchApplications } from '../services/applicationService';
import { SubmittedApplication } from '../types/application';

interface Props {
  onClose: () => void;
}

export const SubmittedApplicationsView: React.FC<Props> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [applications, setApplications] = useState<SubmittedApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<SubmittedApplication | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      setAuthError(null);
      loadApps();
    } else {
      setAuthError('Incorrect admin password. Please try again.');
    }
  };

  const loadApps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (err: any) {
      setError(err.message || 'Could not load applications.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold">Submitted Applications Portal</h2>
            <p className="text-xs text-slate-300">
              {isAuthenticated ? 'Administrator View' : 'Restricted Admin Authorization'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Admin Password Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center space-y-6 max-w-md mx-auto my-auto w-full">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Admin Authentication Required</h3>
              <p className="text-xs text-slate-500 mt-1">
                Please enter the recruiter admin password to access submitted candidate records.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label htmlFor="adminPassword" className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Password
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Unlock & View Submissions</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Candidate Submissions List */
          <div className="p-6 overflow-y-auto grow space-y-6">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-emerald-700" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Loading submitted application records...</span>
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-50 text-rose-800 rounded-lg text-sm border border-rose-200">
                {error}
              </div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">No applications submitted yet.</p>
                <p className="text-xs">Fill out and submit the application form to see records here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar list */}
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 md:border-r md:pr-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Total Applications ({applications.length})
                  </p>
                  {applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                        selectedApp?.id === app.id
                          ? 'border-emerald-700 bg-emerald-50/70 font-medium ring-1 ring-emerald-700/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900">{app.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-800 font-semibold truncate">
                        {app.personal?.firstName} {app.personal?.lastName}
                      </p>
                      <p className="text-slate-500 truncate">{app.contact?.email}</p>
                    </button>
                  ))}
                </div>

                {/* Detail View */}
                <div className="md:col-span-2 space-y-4 text-xs">
                  {selectedApp ? (
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                      <div className="flex justify-between items-start border-b pb-3">
                        <div>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                            {selectedApp.id}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-2">
                            {selectedApp.personal.firstName} {selectedApp.personal.lastName}
                          </h3>
                          <p className="text-slate-500">Submitted at: {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs border-b pb-1">Personal & Contact</h4>
                          <p className="mt-1">
                            <strong>Email:</strong> {selectedApp.contact.email} | <strong>Mobile:</strong> {selectedApp.contact.mobile}
                          </p>
                          <p className="mt-0.5">
                            <strong>Parents:</strong> {selectedApp.personal.fatherName} (Father), {selectedApp.personal.motherName} (Mother)
                          </p>
                          <p className="mt-0.5">
                            <strong>DOB:</strong> {selectedApp.personal.dob} | <strong>Gender:</strong> {selectedApp.personal.gender} | <strong>Nationality:</strong> {selectedApp.personal.nationality}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-xs border-b pb-1">Address</h4>
                          <p className="mt-1">
                            {selectedApp.address.street}, {selectedApp.address.city}, {selectedApp.address.state} - {selectedApp.address.pincode}, {selectedApp.address.country}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-xs border-b pb-1">Education</h4>
                          {selectedApp.education.map((edu, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 mt-1.5">
                              <p className="font-semibold text-slate-900">{edu.degree} - {edu.specialization}</p>
                              <p className="text-slate-600">{edu.institution} ({edu.passingYear}) • Score: {edu.scorePercentage}</p>
                            </div>
                          ))}
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-xs border-b pb-1">Work Experience</h4>
                          {selectedApp.experience.length === 0 ? (
                            <p className="text-slate-500 mt-1 italic">Fresh Graduate / No work experience listed</p>
                          ) : (
                            selectedApp.experience.map((exp, idx) => (
                              <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 mt-1.5">
                                <p className="font-semibold text-slate-900">{exp.designation} at {exp.company}</p>
                                <p className="text-slate-500">{exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <p>Select an application on the left to view full candidate details.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center shrink-0">
          {isAuthenticated ? (
            <button
              onClick={loadApps}
              className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Submissions
            </button>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium">Restricted Admin Access</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
