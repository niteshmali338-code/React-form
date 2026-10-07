import FormInput from './FormInput'
import SectionCard from './SectionCard'
function AddressInformation({ data, errors, onChange }) { return <SectionCard id="address-information" number="03" title="Address information" description="Your current residential address.">
    <div className="row">
    <div className="col-12">
    <FormInput label="Address line" name="addressLine" value={data.addressLine} onChange={(value) => onChange('addressLine', value)} error={errors.addressLine} placeholder="House number, street, area" />
    </div><div className="col-md-4">
    <FormInput label="City" name="city" value={data.city} onChange={(value) => onChange('city', value)} error={errors.city} /></div>
    <div className="col-md-4">
    <FormInput label="State" name="state" value={data.state} onChange={(value) => onChange('state', value)} error={errors.state} /></div>
    <div className="col-md-4">
    <FormInput label="Country" name="country" value={data.country} onChange={(value) => onChange('country', value)} error={errors.country} /></div>
    <div className="col-md-4"><FormInput label="Pincode" name="pincode" value={data.pincode} onChange={(value) => onChange('pincode', value)} error={errors.pincode} placeholder="e.g. 560001" /></div></div></SectionCard> }
export default AddressInformation