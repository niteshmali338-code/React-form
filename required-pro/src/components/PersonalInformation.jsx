import FormInput from './FormInput'
import FormSelect from './FormSelect'
import SectionCard from './SectionCard'

function PersonalInformation({ data, errors, onChange, optimizePhoto, onOptimizePhotoChange, onPhotoSelect }) {
  const photoName = data?.profilePhoto?.name || ''
  const photoPreview = data?.profilePhoto?.dataUrl

  return (
    <SectionCard id="personal-information" number="01" title="Personal information" description="The basics help us get to know you.">
      <div className="row">
        <div className="col-md-6">
          <FormInput label="Full name" name="fullName" value={data.fullName} onChange={(value) => onChange('fullName', value)} error={errors.fullName} placeholder="Enter Your Full Name" />
        </div>
        <div className="col-md-3">
          <FormInput label="Date of birth" name="dateOfBirth" type="date" value={data.dateOfBirth} onChange={(value) => onChange('dateOfBirth', value)} error={errors.dateOfBirth} />
        </div>
        <div className="col-md-3">
          <FormSelect label="Gender" name="gender" value={data.gender} onChange={(value) => onChange('gender', value)} error={errors.gender} options={['Female', 'Male', 'Prefer not to say']} />
        </div>
      </div>

      <div className="photo-field">
        <label className="form-label" htmlFor="profilePhoto">Profile photo <span className="optional-mark">(optional)</span></label>
        <input
          className="form-control"
          id="profilePhoto"
          type="file"
          accept="image/*"
          onChange={(event) => onPhotoSelect(event.target.files?.[0] || null)}
        />
        <div className="form-text">JPG or PNG. Auto-optimised for smaller uploads when enabled.</div>

        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="optimizePhoto"
            checked={optimizePhoto}
            onChange={(event) => onOptimizePhotoChange(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="optimizePhoto">Optimize photo for upload</label>
        </div>

        {photoPreview && (
          <div className="mt-3 d-flex align-items-center gap-3">
            <img src={photoPreview} alt="Profile preview" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 12 }} />
            <div className="small text-muted">
              {photoName}
              <div>{data?.profilePhoto?.optimized ? 'Optimized version saved' : 'Original version saved'}</div>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

export default PersonalInformation