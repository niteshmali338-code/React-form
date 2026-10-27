import React from 'react';
import { AddressDetails, ValidationErrors } from '../types/application';
import { FormInput } from './FormInput';

interface Props {
  data: AddressDetails;
  errors: ValidationErrors;
  onChange: (field: keyof AddressDetails, value: any) => void;
}

export const AddressInformation: React.FC<Props> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-semibold text-slate-800 border-b pb-2 mb-4">
          Current Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <FormInput
              label="Street / House No. / Area"
              id="street"
              value={data.street}
              onChange={(e) => onChange('street', e.target.value)}
              error={errors['address.street']}
              required
              placeholder="Flat 301, Sunshine Apartments, MG Road"
            />
          </div>
          <FormInput
            label="City"
            id="city"
            value={data.city}
            onChange={(e) => onChange('city', e.target.value)}
            error={errors['address.city']}
            required
            placeholder="Bengaluru"
          />
          <FormInput
            label="State / Province"
            id="state"
            value={data.state}
            onChange={(e) => onChange('state', e.target.value)}
            error={errors['address.state']}
            required
            placeholder="Karnataka"
          />
          <FormInput
            label="PIN / Postal Code"
            id="pincode"
            value={data.pincode}
            onChange={(e) => onChange('pincode', e.target.value)}
            error={errors['address.pincode']}
            required
            placeholder="560001"
            maxLength={6}
          />
          <FormInput
            label="Country"
            id="country"
            value={data.country}
            onChange={(e) => onChange('country', e.target.value)}
            error={errors['address.country']}
            required
            placeholder="India"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={data.sameAsPermanent}
            onChange={(e) => onChange('sameAsPermanent', e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <span>Permanent address is the same as current address</span>
        </label>
      </div>

      {!data.sameAsPermanent && (
        <div className="pt-2 border-t">
          <h3 className="text-md font-semibold text-slate-800 border-b pb-2 mb-4">
            Permanent Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <FormInput
                label="Street / House No. / Area"
                id="permStreet"
                value={data.permStreet}
                onChange={(e) => onChange('permStreet', e.target.value)}
                error={errors['address.permStreet']}
                required
                placeholder="Permanent Street / House No."
              />
            </div>
            <FormInput
              label="City"
              id="permCity"
              value={data.permCity}
              onChange={(e) => onChange('permCity', e.target.value)}
              error={errors['address.permCity']}
              required
              placeholder="City"
            />
            <FormInput
              label="State / Province"
              id="permState"
              value={data.permState}
              onChange={(e) => onChange('permState', e.target.value)}
              error={errors['address.permState']}
              required
              placeholder="State"
            />
            <FormInput
              label="PIN / Postal Code"
              id="permPincode"
              value={data.permPincode}
              onChange={(e) => onChange('permPincode', e.target.value)}
              error={errors['address.permPincode']}
              required
              placeholder="Postal Code"
              maxLength={6}
            />
            <FormInput
              label="Country"
              id="permCountry"
              value={data.permCountry}
              onChange={(e) => onChange('permCountry', e.target.value)}
              error={errors['address.permCountry']}
              required
              placeholder="Country"
            />
          </div>
        </div>
      )}
    </div>
  );
};
