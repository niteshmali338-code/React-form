import FormInput from './FormInput'
import FormSelect from './FormSelect'
import SectionCard from './SectionCard'
function PersonalInformation({ data, errors, onChange }) 
{ return <SectionCard number="01" title="Personal information" description="The basics help us get to know you.">
    <div className="row">
        <div className="col-md-6">
            <FormInput label="Full name" name="fullName" value={data.fullName} onChange={(value) => onChange('fullName', value)} error={errors.fullName} placeholder="Enter Your Full Name" />
                </div>
                <div className="col-md-3">
                    <FormInput label="Date of birth" name="dateOfBirth" type="date" value={data.dateOfBirth} onChange={(value) => onChange('dateOfBirth', value)} error={errors.dateOfBirth} /></div>
                    <div className="col-md-3">
                        <FormSelect label="Gender" name="gender" value={data.gender} onChange={(value) => onChange('gender', value)} error={errors.gender} options={['Female', 'Male', 'Prefer not to say']} />
                            </div></div>
                            <div className="photo-field"><label className="form-label" htmlFor="profilePhoto">Profile photo <span className="optional-mark">(optional)</span></label><input className="form-control" id="profilePhoto" type="file" accept="image/*" onChange={(event) => onChange('profilePhoto', event.target.files?.[0]?.name || '')} />
                            <div className="form-text">JPG or PNG, up to 5 MB.</div>
                            </div>
                            </SectionCard>
                             }
export default PersonalInformation