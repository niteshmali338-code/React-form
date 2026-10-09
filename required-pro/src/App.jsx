import { useEffect, useState } from 'react'
import './App.css'
import PersonalInformation from './components/PersonalInformation'
import ContactInformation from './components/ContactInformation'
import AddressInformation from './components/AddressInformation'
import EducationInformation from './components/EducationInformation'
import ExperienceInformation from './components/ExperienceInformation'
import ReviewScreen from './components/ReviewScreen'
import { getDraft, saveDraft, submitApplication } from './services/applicationService'

const emptyEducation = { qualification: '', institution: '', board: '', passingYear: '', score: '' }
const emptyExperience = { company: '', role: '', startDate: '', endDate: '', responsibilities: '' }
const emptyProfilePhoto = { name: '', dataUrl: '', optimized: false }

const initialFormData = {
  personal: { fullName: '', dateOfBirth: '', gender: '', profilePhoto: { ...emptyProfilePhoto } },
  contact: { email: '', mobile: '', alternateMobile: '' },
  address: { addressLine: '', city: '', state: '', country: '', pincode: '' },
  education: [{ ...emptyEducation }],
  experience: [{ ...emptyExperience }],
}

const normalizeProfilePhoto = (value) => {
  if (!value || typeof value !== 'object') {
    return { ...emptyProfilePhoto, name: typeof value === 'string' ? value : '' }
  }

  return {
    name: value.name || '',
    dataUrl: value.dataUrl || '',
    optimized: Boolean(value.optimized),
  }
}

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Unable to read the selected photo.'))
  reader.readAsDataURL(file)
})

const compressImage = (file, options = {}) => new Promise((resolve, reject) => {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.72 } = options
  if (!file || !file.type.startsWith('image/')) {
    resolve({ name: file?.name || '', dataUrl: '', optimized: false, originalSize: 0 })
    return
  }

  readFileAsDataUrl(file)
    .then((dataUrl) => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height)
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        const compressedDataUrl = canvas.toDataURL(file.type, quality)
        resolve({
          name: file.name,
          dataUrl: compressedDataUrl,
          optimized: compressedDataUrl.length < dataUrl.length || scale < 1,
          originalSize: dataUrl.length,
        })
      }
      image.onerror = () => reject(new Error('Unable to process the selected photo.'))
      image.src = dataUrl
    })
    .catch(reject)
})

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
  const [isHydrated, setIsHydrated] = useState(false)
  const [optimizePhoto, setOptimizePhoto] = useState(true)

  useEffect(() => { document.title = view === 'review' ? 'Review Application | Northstar' : 'Application Form | Northstar' }, [view])

  useEffect(() => {
    let isMounted = true

    async function loadDraft() {
      try {
        const draft = await getDraft()
        if (!draft || !isMounted) return

        const restoredData = draft.data || initialFormData
        setFormData({
          ...restoredData,
          personal: {
            ...restoredData.personal,
            profilePhoto: normalizeProfilePhoto(restoredData.personal?.profilePhoto),
          },
        })
      } catch (error) {
        console.error('Unable to load saved draft', error)
      } finally {
        if (isMounted) setIsHydrated(true)
      }
    }

    loadDraft()

    return () => { isMounted = false }
  }, [])

  const persistDraftState = (nextData) => {
    saveDraft(nextData).catch((error) => console.error('Unable to save draft', error))
  }

  const handleProfilePhotoChange = async (file) => {
    if (!file) {
      updateField('personal', 'profilePhoto', { ...emptyProfilePhoto })
      return
    }

    try {
      const nextPhoto = optimizePhoto
        ? await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.72 })
        : { name: file.name, dataUrl: await readFileAsDataUrl(file), optimized: false, originalSize: file.size }

      updateField('personal', 'profilePhoto', {
        name: nextPhoto.name,
        dataUrl: nextPhoto.dataUrl,
        optimized: nextPhoto.optimized,
      })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const updateField = (section, field, value) => setFormData((current) => {
    const nextData = updateSection(section, field, value, current)
    persistDraftState(nextData)
    return nextData
  })
  const validate = () => { const nextErrors = validateForm(formData); setErrors(nextErrors); return !hasErrors(nextErrors) }
  const handleReview = (event) => { event.preventDefault(); setStatus({ type: '', message: '' }); if (validate()) setView('review'); else setStatus({ type: 'error', message: 'Please correct the highlighted fields before continuing.' }) }
  const handleSubmit = async () => { setIsSubmitting(true); setStatus({ type: '', message: '' }); try { const result = await submitApplication(formData); setStatus({ type: 'success', message: `Your application has been saved successfully. Reference: ${result.applicationId}` }); setView('success') } catch (error) { setStatus({ type: 'error', message: error.message }) } finally { setIsSubmitting(false) } }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="container app-container d-flex align-items-center justify-content-between gap-3 h-100">
        </div>
      </header>
      {view === 'form' && (
        <nav className="section-nav" aria-label="Application sections">
          <div className="container app-container">
            <div className="section-nav-links">
              <a href="#home">Home</a>
              <a href="#personal-information">Personal information</a>
              <a href="#address-information">Address information</a>
              <a href="#education-information">Education information</a>
              <a href="#experience-information">Experience</a>
            </div>
          </div>
        </nav>
      )}
      <div className="container app-container py-4 py-lg-5">
        {view === 'success' ? <SuccessScreen message={status.message} /> : view === 'review' ? (
          <ReviewScreen formData={formData} onEdit={() => setView('form')} onSubmit={handleSubmit} isSubmitting={isSubmitting} error={status.type === 'error' ? status.message : ''} />
        ) : (
          <>
            <section className="intro mb-4" id="home">
              <p className="eyebrow">Start your next chapter</p>
              <h1>Personal & contact information</h1>
              <p className="intro-copy">Tell us a little about yourself. Your application takes about 5 minutes to complete.</p>
            </section>
            {status.message && <div className="alert alert-danger" role="alert">{status.message}</div>}
            {isHydrated && <div className="alert alert-light border" role="status">Drafts are saved on this device. Submitted applications are saved to the database.</div>}
            <form onSubmit={handleReview} noValidate>
              <PersonalInformation
                data={formData.personal}
                errors={errors.personal}
                onChange={(field, value) => updateField('personal', field, value)}
                optimizePhoto={optimizePhoto}
                onOptimizePhotoChange={setOptimizePhoto}
                onPhotoSelect={handleProfilePhotoChange}
              />
              <ContactInformation data={formData.contact} errors={errors.contact} onChange={(field, value) => updateField('contact', field, value)} />
              <AddressInformation data={formData.address} errors={errors.address} onChange={(field, value) => updateField('address', field, value)} />
              <EducationInformation records={formData.education} errors={errors.education} onChange={(index, field, value) => setFormData((current) => {
                const nextData = { ...current, education: current.education.map((record, i) => i === index ? { ...record, [field]: value } : record) }
                persistDraftState(nextData)
                return nextData
              })} onAdd={() => setFormData((current) => {
                const nextData = { ...current, education: [...current.education, { ...emptyEducation }] }
                persistDraftState(nextData)
                return nextData
              })} onRemove={(index) => setFormData((current) => {
                const nextData = { ...current, education: current.education.filter((_, i) => i !== index) }
                persistDraftState(nextData)
                return nextData
              })} />
              <ExperienceInformation records={formData.experience} errors={errors.experience} onChange={(index, field, value) => setFormData((current) => {
                const nextData = { ...current, experience: current.experience.map((record, i) => i === index ? { ...record, [field]: value } : record) }
                persistDraftState(nextData)
                return nextData
              })} onAdd={() => setFormData((current) => {
                const nextData = { ...current, experience: [...current.experience, { ...emptyExperience }] }
                persistDraftState(nextData)
                return nextData
              })} onRemove={(index) => setFormData((current) => {
                const nextData = { ...current, experience: current.experience.filter((_, i) => i !== index) }
                persistDraftState(nextData)
                return nextData
              })} />
              <div className="form-actions d-flex justify-content-end">
                <button className="btn btn-primary btn-lg" type="submit">Review application <span aria-hidden="true">→</span></button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

function SuccessScreen({ message }) { return <section className="success-state text-center" role="status"><div className="success-icon" aria-hidden="true">✓</div><p className="eyebrow">Application received</p><h1>You’re on your way.</h1><p>{message}</p><a className="btn btn-outline-primary mt-3" href="/">Return home</a></section> }

export default App
