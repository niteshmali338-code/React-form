import React, { useEffect, useState } from 'react';
import { AddressInformation } from './components/AddressInformation';
import { ContactInformation } from './components/ContactInformation';
import { EducationInformation } from './components/EducationInformation';
import { ExperienceInformation } from './components/ExperienceInformation';
import { PersonalInformation } from './components/PersonalInformation';
import { ReviewScreen } from './components/ReviewScreen';
import { SectionCard } from './components/SectionCard';
import { SubmittedApplicationsView } from './components/SubmittedApplicationsView';
import {
  clearDraft,
  initialApplicationData,
  loadDraft,
  saveDraft,
  submitApplication,
} from './services/applicationService';
import {
  ApplicationData,
  EducationRecord,
  ExperienceRecord,
  ValidationErrors,
} from './types/application';

const STEPS = [
  { id: 1, title: 'Personal Info', short: 'Personal' },
  { id: 2, title: 'Contact Details', short: 'Contact' },
  { id: 3, title: 'Address Info', short: 'Address' },
  { id: 4, title: 'Education', short: 'Education' },
  { id: 5, title: 'Experience', short: 'Experience' },
  { id: 6, title: 'Review & Submit', short: 'Review' },
];

export default function App() {
  const [formData, setFormData] = useState<ApplicationData>(initialApplicationData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    applicationId: string;
    submittedAt: string;
  } | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [autoSaveNotification, setAutoSaveNotification] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    setFormData(draft);
  }, []);

  // Auto-save draft on form change
  useEffect(() => {
    if (!submittedResult) {
      saveDraft(formData);
      setAutoSaveNotification(true);
      const timer = setTimeout(() => setAutoSaveNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [formData, submittedResult]);

  // Section level updates
  const handlePersonalChange = (field: keyof ApplicationData['personal'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
    if (errors[`personal.${field}`]) {
      setErrors((prev) => ({ ...prev, [`personal.${field}`]: '' }));
    }
  };

  const handleContactChange = (field: keyof ApplicationData['contact'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
    if (errors[`contact.${field}`]) {
      setErrors((prev) => ({ ...prev, [`contact.${field}`]: '' }));
    }
  };

  const handleAddressChange = (field: keyof ApplicationData['address'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
    if (errors[`address.${field}`]) {
      setErrors((prev) => ({ ...prev, [`address.${field}`]: '' }));
    }
  };

  const handleEducationChange = (index: number, field: keyof EducationRecord, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
    if (errors[`education.${index}.${field}`]) {
      setErrors((prev) => ({ ...prev, [`education.${index}.${field}`]: '' }));
    }
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: '',
          institution: '',
          boardOrUniversity: '',
          passingYear: '',
          scorePercentage: '',
          specialization: '',
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData((prev) => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      }));
    }
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceRecord, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
    if (errors[`experience.${index}.${field}`]) {
      setErrors((prev) => ({ ...prev, [`experience.${index}.${field}`]: '' }));
    }
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          company: '',
          designation: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          keyResponsibilities: '',
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (step === 1) {
      if (!formData.personal.firstName.trim()) newErrors['personal.firstName'] = 'First name is required.';
      if (!formData.personal.lastName.trim()) newErrors['personal.lastName'] = 'Last name is required.';
      if (!formData.personal.fatherName.trim()) newErrors['personal.fatherName'] = "Father's name is required.";
      if (!formData.personal.motherName.trim()) newErrors['personal.motherName'] = "Mother's name is required.";
      if (!formData.personal.dob) newErrors['personal.dob'] = 'Date of birth is required.';
      if (!formData.personal.nationality.trim()) newErrors['personal.nationality'] = 'Nationality is required.';
    }

    if (step === 2) {
      if (!formData.contact.email.trim()) {
        newErrors['contact.email'] = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
        newErrors['contact.email'] = 'Enter a valid email address.';
      }

      if (!formData.contact.mobile.trim()) {
        newErrors['contact.mobile'] = 'Mobile number is required.';
      } else if (!/^\d{10}$/.test(formData.contact.mobile.replace(/\D/g, ''))) {
        newErrors['contact.mobile'] = 'Mobile number must be exactly 10 digits.';
      }

      if (formData.contact.alternateMobile && !/^\d{10}$/.test(formData.contact.alternateMobile.replace(/\D/g, ''))) {
        newErrors['contact.alternateMobile'] = 'Alternate mobile must be 10 digits.';
      }
    }

    if (step === 3) {
      if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required.';
      if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required.';
      if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required.';
      if (!formData.address.pincode.trim()) {
        newErrors['address.pincode'] = 'PIN / Postal code is required.';
      } else if (!/^\d{5,6}$/.test(formData.address.pincode)) {
        newErrors['address.pincode'] = 'PIN code must be 5 or 6 digits.';
      }
      if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required.';

      if (!formData.address.sameAsPermanent) {
        if (!formData.address.permStreet.trim()) newErrors['address.permStreet'] = 'Permanent street is required.';
        if (!formData.address.permCity.trim()) newErrors['address.permCity'] = 'Permanent city is required.';
        if (!formData.address.permState.trim()) newErrors['address.permState'] = 'Permanent state is required.';
        if (!formData.address.permPincode.trim()) {
          newErrors['address.permPincode'] = 'Permanent PIN code is required.';
        } else if (!/^\d{5,6}$/.test(formData.address.permPincode)) {
          newErrors['address.permPincode'] = 'PIN code must be 5 or 6 digits.';
        }
        if (!formData.address.permCountry.trim()) newErrors['address.permCountry'] = 'Permanent country is required.';
      }
    }

    if (step === 4) {
      if (formData.education.length === 0) {
        newErrors['education'] = 'At least one education record is required.';
      }
      formData.education.forEach((edu, idx) => {
        if (!edu.degree.trim()) newErrors[`education.${idx}.degree`] = 'Degree is required.';
        if (!edu.institution.trim()) newErrors[`education.${idx}.institution`] = 'Institution name is required.';
        if (!edu.boardOrUniversity.trim()) newErrors[`education.${idx}.boardOrUniversity`] = 'Board or university is required.';
        if (!edu.passingYear) {
          newErrors[`education.${idx}.passingYear`] = 'Passing year is required.';
        } else {
          const yr = Number(edu.passingYear);
          if (isNaN(yr) || yr < 1970 || yr > 2030) {
            newErrors[`education.${idx}.passingYear`] = 'Enter a valid year (1970 - 2030).';
          }
        }
        if (!edu.scorePercentage.trim()) newErrors[`education.${idx}.scorePercentage`] = 'Score or percentage is required.';
      });
    }

    if (step === 5) {
      formData.experience.forEach((exp, idx) => {
        if (!exp.company.trim()) newErrors[`experience.${idx}.company`] = 'Company name is required.';
        if (!exp.designation.trim()) newErrors[`experience.${idx}.designation`] = 'Job title is required.';
        if (!exp.startDate) newErrors[`experience.${idx}.startDate`] = 'Start date is required.';
        if (!exp.isCurrent && !exp.endDate) {
          newErrors[`experience.${idx}.endDate`] = 'End date is required if not currently working.';
        }
        if (exp.startDate && exp.endDate && !exp.isCurrent && new Date(exp.endDate) < new Date(exp.startDate)) {
          newErrors[`experience.${idx}.endDate`] = 'End date cannot be earlier than start date.';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    // Validate all steps before submitting
    let allValid = true;
    for (let s = 1; s <= 5; s++) {
      if (!validateStep(s)) {
        allValid = false;
        setCurrentStep(s);
        break;
      }
    }

    if (!allValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitApplication(formData);
      setSubmittedResult({
        applicationId: res.applicationId,
        submittedAt: res.submittedAt,
      });
      clearDraft();
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewApplication = () => {
    setFormData(initialApplicationData);
    setSubmittedResult(null);
    setCurrentStep(1);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 text-slate-900 shadow-xs sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="font-black text-2xl text-slate-900 tracking-tight leading-none flex items-center">
              Application Form<span className="text-amber-500 font-black"></span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {autoSaveNotification && !submittedResult && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Draft Auto-Saved
              </span>
            )}
            <button
              onClick={() => setShowAdminModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-800 border border-slate-300 transition-colors"
            >
              <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>View Submissions</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="grow max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {submittedResult ? (
          /* Confirmation Success View */
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Successfully Submitted
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-4">Thank You, {formData.personal.firstName}!</h2>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Your application has been received and safely stored in the database.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Application Reference ID</span>
                <span className="font-mono font-bold text-emerald-800">{submittedResult.applicationId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Submitted On</span>
                <span className="font-semibold text-slate-800">
                  {new Date(submittedResult.submittedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Confirmation Sent To</span>
                <span className="font-semibold text-slate-800">{formData.contact.email}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowAdminModal(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
              >
                View Submitted Applications List
              </button>
              <button
                onClick={startNewApplication}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Form Stepper View */
          <>
            {/* Step Progress Bar */}
            <nav className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[550px]">
                {STEPS.map((s, idx) => {
                  const isDone = currentStep > s.id;
                  const isCurrent = currentStep === s.id;
                  return (
                    <React.Fragment key={s.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (s.id < currentStep || validateStep(currentStep)) {
                            setCurrentStep(s.id);
                          }
                        }}
                        className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                          isCurrent
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                            : 'text-slate-500 hover:text-emerald-800 hover:bg-emerald-50/50'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent
                              ? 'bg-white text-emerald-800'
                              : isDone
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isDone ? '✓' : s.id}
                        </span>
                        <span className="whitespace-nowrap">{s.short}</span>
                      </button>
                      {idx < STEPS.length - 1 && (
                        <div
                          className={`h-0.5 grow mx-1 rounded-full transition-colors ${
                            currentStep > s.id ? 'bg-emerald-600' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </nav>

            {/* Current Active Form Section */}
            <div>
              {currentStep === 1 && (
                <SectionCard
                  title="1. Personal Information"
                  subtitle="Provide your primary biographical details as per official ID documents."
                  stepNumber={1}
                >
                  <PersonalInformation
                    data={formData.personal}
                    errors={errors}
                    onChange={handlePersonalChange}
                  />
                </SectionCard>
              )}

              {currentStep === 2 && (
                <SectionCard
                  title="2. Contact Information"
                  subtitle="Provide valid contact methods for communications."
                  stepNumber={2}
                >
                  <ContactInformation
                    data={formData.contact}
                    errors={errors}
                    onChange={handleContactChange}
                  />
                </SectionCard>
              )}

              {currentStep === 3 && (
                <SectionCard
                  title="3. Address Details"
                  subtitle="Provide your current residential address and permanent address."
                  stepNumber={3}
                >
                  <AddressInformation
                    data={formData.address}
                    errors={errors}
                    onChange={handleAddressChange}
                  />
                </SectionCard>
              )}

              {currentStep === 4 && (
                <SectionCard
                  title="4. Educational Qualification"
                  subtitle="Add all completed degrees, diplomas, or school qualifications."
                  stepNumber={4}
                >
                  <EducationInformation
                    records={formData.education}
                    errors={errors}
                    onChangeRecord={handleEducationChange}
                    onAddRecord={addEducation}
                    onRemoveRecord={removeEducation}
                  />
                </SectionCard>
              )}

              {currentStep === 5 && (
                <SectionCard
                  title="5. Work Experience"
                  subtitle="Add relevant jobs or internships. Freshers may skip this step."
                  stepNumber={5}
                >
                  <ExperienceInformation
                    records={formData.experience}
                    errors={errors}
                    onChangeRecord={handleExperienceChange}
                    onAddRecord={addExperience}
                    onRemoveRecord={removeExperience}
                  />
                </SectionCard>
              )}

              {currentStep === 6 && (
                <SectionCard
                  title="6. Review & Submission"
                  subtitle="Double check all sections prior to final confirmation."
                  stepNumber={6}
                >
                  <ReviewScreen
                    data={formData}
                    onEditSection={(step) => setCurrentStep(step)}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                  />
                </SectionCard>
              )}
            </div>

            {/* Stepper Footer Buttons */}
            {currentStep < 6 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs disabled:opacity-40 transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Continue to {STEPS[currentStep]?.short || 'Next'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Admin / Saved Submissions Modal */}
      {showAdminModal && (
        <SubmittedApplicationsView onClose={() => setShowAdminModal(false)} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Application Form.</p>
      </footer>
    </div>
  );
}
