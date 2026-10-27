import React from 'react';
import { ContactDetails, ValidationErrors } from '../types/application';
import { FormInput } from './FormInput';

interface Props {
  data: ContactDetails;
  errors: ValidationErrors;
  onChange: (field: keyof ContactDetails, value: string) => void;
}

export const ContactInformation: React.FC<Props> = ({ data, errors, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormInput
        label="Email Address"
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors['contact.email']}
        required
        placeholder="rahul.sharma@example.com"
        helpText="We will send confirmation updates to this address."
      />
      <FormInput
        label="Mobile Number"
        id="mobile"
        type="tel"
        value={data.mobile}
        onChange={(e) => onChange('mobile', e.target.value)}
        error={errors['contact.mobile']}
        required
        placeholder="10-digit mobile number"
        maxLength={10}
      />
      <FormInput
        label="Alternate Mobile Number"
        id="alternateMobile"
        type="tel"
        value={data.alternateMobile}
        onChange={(e) => onChange('alternateMobile', e.target.value)}
        error={errors['contact.alternateMobile']}
        placeholder="Optional 10-digit number"
        maxLength={10}
      />
      <FormInput
        label="LinkedIn Profile URL"
        id="linkedinUrl"
        type="url"
        value={data.linkedinUrl}
        onChange={(e) => onChange('linkedinUrl', e.target.value)}
        error={errors['contact.linkedinUrl']}
        placeholder="https://linkedin.com/in/username"
      />
      <div className="md:col-span-2">
        <FormInput
          label="Portfolio / GitHub / Website URL"
          id="portfolioUrl"
          type="url"
          value={data.portfolioUrl}
          onChange={(e) => onChange('portfolioUrl', e.target.value)}
          error={errors['contact.portfolioUrl']}
          placeholder="https://github.com/username or https://portfolio.com"
        />
      </div>
    </div>
  );
};
