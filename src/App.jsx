import { useEffect, useState } from 'react'
import './App.css'
import PersonalInformation from './components/PersonalInformation'
import ContactInformation from './components/ContactInformation'
import AddressInformation from './components/AddressInformation'
import EducationInformation from './components/EducationInformation'
import ExperienceInformation from './components/ExperienceInformation'
import ReviewScreen from './components/ReviewScreen'
import { submitApplication } from './services/applicationService'

const emptyEducation = { qualification: '', institution: '', board: '', passingYear: '', score: '' }
const emptyExperience = { company: '', role: '', startDate: '', endDate: '', responsibilities: '' }

const initialFormData = {
  personal: { fullName: '', dateOfBirth: '', gender: '', profilePhoto: '' },
  contact: { email: '', mobile: '', alternateMobile: '' },
  address: { addressLine: '', city: '', state: '', country: '', pincode: '' },
  education: [{ ...emptyEducation }],
  experience: [{ ...emptyExperience }],
}

const updateSection = (section, field, value, formData) => ({ ...formData, [section]: { ...formData[section], [field]: value } })

function validateForm(formData) {
  const errors = { personal: {}, contact: {}, address: {}, education: [], experience: [] }
  const required = (section, fields) => fields.forEach((field) => { if (!formData[section][field]) errors[section][field] = 'This field is required.' })
  required('personal', ['fullName', 'dateOfBirth', 'gender'])
  required('contact', ['email', 'mobile'])
  required('address', ['addressLine', 'city', 'state', 'country', 'pincode'])
  if (formData.contact.email && !/^\S+@\S+\.\S+$/.test(formData.contact.email)) errors.contact.email = 'Enter a valid email address.'
  if (formData.contact.mobile && !/^\d{10}$/.test(formData.contact.mobile)) errors.contact.mobile = 'Enter a 10-digit mobile number.'
  if (formData.contact.alternateMobile && !/^\d{10}$/.test(formData.contact.alternateMobile)) errors.contact.alternateMobile = 'Enter a 10-digit mobile number.'
  if (formData.address.pincode && !/^\d{5,6}$/.test(formData.address.pincode)) errors.address.pincode = 'Enter a valid 5 or 6-digit pincode.'
  formData.education.forEach((record) => { const recordErrors = {}; Object.entries(record).forEach(([field, value]) => { if (!value) recordErrors[field] = 'This field is required.' }); if (record.score && (Number.isNaN(Number(record.score)) || Number(record.score) < 0 || Number(record.score) > 100)) recordErrors.score = 'Enter a number between 0 and 100.'; if (record.passingYear && (!/^\d{4}$/.test(record.passingYear) || Number(record.passingYear) > new Date().getFullYear())) recordErrors.passingYear = 'Enter a valid passing year.'; errors.education.push(recordErrors) })
  formData.experience.forEach((record) => { const recordErrors = {}; Object.entries(record).forEach(([field, value]) => { if (!value) recordErrors[field] = 'This field is required.' }); if (record.startDate && record.endDate && record.startDate > record.endDate) recordErrors.endDate = 'End date must be on or after the start date.'; errors.experience.push(recordErrors) })
  return errors
}

const hasErrors = (errors) => Object.values(errors).some((section) => Array.isArray(section) ? section.some((record) => Object.keys(record).length > 0) : Object.keys(section).length > 0)

function App() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({ personal: {}, contact: {}, address: {}, education: [], experience: [] })
  const [view, setView] = useState('form')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => { document.title = view === 'review' ? 'Review Application | Northstar' : 'Application Form | Northstar' }, [view])
  const updateField = (section, field, value) => setFormData((current) => updateSection(section, field, value, current))
  const validate = () => { const nextErrors = validateForm(formData); setErrors(nextErrors); return !hasErrors(nextErrors) }
  const handleReview = (event) => { event.preventDefault(); setStatus({ type: '', message: '' }); if (validate()) setView('review'); else setStatus({ type: 'error', message: 'Please correct the highlighted fields before continuing.' }) }
  const handleSubmit = async () => { setIsSubmitting(true); setStatus({ type: '', message: '' }); try { await submitApplication(formData); setStatus({ type: 'success', message: 'Your application has been submitted successfully.' }); setView('success') } catch (error) { setStatus({ type: 'error', message: error.message }) } finally { setIsSubmitting(false) } }

  return (
    <main className="app-shell"><header className="site-header"><div className="container app-container d-flex justify-content-between align-items-center"><span className="header-sections">Personal & Contact information</span><span className="header-note">Talent application portal</span></div></header><div className="container app-container py-4 py-lg-5">{view === 'success' ? <SuccessScreen message={status.message} /> : view === 'review' ? <ReviewScreen formData={formData} onEdit={() => setView('form')} onSubmit={handleSubmit} isSubmitting={isSubmitting} error={status.type === 'error' ? status.message : ''} /> : <><section className="intro mb-4"><p className="eyebrow">Start your next chapter</p><h1>Application form</h1><p className="intro-copy">Tell us a little about yourself. Your application takes about 5 minutes to complete.</p></section>{status.message && <div className="alert alert-danger" role="alert">{status.message}</div>}<form onSubmit={handleReview} noValidate><PersonalInformation data={formData.personal} errors={errors.personal} onChange={(field, value) => updateField('personal', field, value)} /><ContactInformation data={formData.contact} errors={errors.contact} onChange={(field, value) => updateField('contact', field, value)} /><AddressInformation data={formData.address} errors={errors.address} onChange={(field, value) => updateField('address', field, value)} /><EducationInformation records={formData.education} errors={errors.education} onChange={(index, field, value) => setFormData((current) => ({ ...current, education: current.education.map((record, i) => i === index ? { ...record, [field]: value } : record) }))} onAdd={() => setFormData((current) => ({ ...current, education: [...current.education, { ...emptyEducation }] }))} onRemove={(index) => setFormData((current) => ({ ...current, education: current.education.filter((_, i) => i !== index) }))} /><ExperienceInformation records={formData.experience} errors={errors.experience} onChange={(index, field, value) => setFormData((current) => ({ ...current, experience: current.experience.map((record, i) => i === index ? { ...record, [field]: value } : record) }))} onAdd={() => setFormData((current) => ({ ...current, experience: [...current.experience, { ...emptyExperience }] }))} onRemove={(index) => setFormData((current) => ({ ...current, experience: current.experience.filter((_, i) => i !== index) }))} /><div className="form-actions d-flex justify-content-end"><button className="btn btn-primary btn-lg" type="submit">Review application <span aria-hidden="true">→</span></button></div></form></>}</div></main>
  )
}

function SuccessScreen({ message }) { return <section className="success-state text-center" role="status"><div className="success-icon" aria-hidden="true">✓</div><p className="eyebrow">Application received</p><h1>You’re on your way.</h1><p>{message}</p><a className="btn btn-outline-primary mt-3" href="/">Return home</a></section> }

export default App
