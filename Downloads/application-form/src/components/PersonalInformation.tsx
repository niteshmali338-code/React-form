import React from 'react';
import { PersonalDetails, ValidationErrors } from '../types/application';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

interface Props {
  data: PersonalDetails;
  errors: ValidationErrors;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

export const PersonalInformation: React.FC<Props> = ({ data, errors, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormInput
        label="First Name"
        id="firstName"
        value={data.firstName}
        onChange={(e) => onChange('firstName', e.target.value)}
        error={errors['personal.firstName']}
        required
        placeholder="e.g. Rahul"
      />

      <FormInput
        label="Last Name"
        id="lastName"
        value={data.lastName}
        onChange={(e) => onChange('lastName', e.target.value)}
        error={errors['personal.lastName']}
        required
        placeholder="e.g. Sharma"
      />

      <FormInput
        label="Father's Full Name"
        id="fatherName"
        value={data.fatherName}
        onChange={(e) => onChange('fatherName', e.target.value)}
        error={errors['personal.fatherName']}
        required
        placeholder="e.g. Suresh Sharma"
      />

      <FormInput
        label="Mother's Full Name"
        id="motherName"
        value={data.motherName}
        onChange={(e) => onChange('motherName', e.target.value)}
        error={errors['personal.motherName']}
        required
        placeholder="e.g. Sunita Sharma"
      />

      <FormInput
        label="Date of Birth"
        id="dob"
        type="date"
        value={data.dob}
        onChange={(e) => onChange('dob', e.target.value)}
        error={errors['personal.dob']}
        required
      />

      <FormSelect
        label="Gender"
        id="gender"
        value={data.gender}
        onChange={(e) => onChange('gender', e.target.value)}
        error={errors['personal.gender']}
        required
        options={[
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
          { label: 'Prefer not to say', value: 'Prefer not to say' },
        ]}
      />

      <FormSelect
        label="Marital Status"
        id="maritalStatus"
        value={data.maritalStatus}
        onChange={(e) => onChange('maritalStatus', e.target.value)}
        error={errors['personal.maritalStatus']}
        required
        options={[
          { label: 'Single', value: 'Single' },
          { label: 'Married', value: 'Married' },
          { label: 'Divorced', value: 'Divorced' },
          { label: 'Widowed', value: 'Widowed' },
        ]}
      />

      <FormInput
        label="Nationality"
        id="nationality"
        value={data.nationality}
        onChange={(e) => onChange('nationality', e.target.value)}
        error={errors['personal.nationality']}
        required
        placeholder="e.g. Indian"
      />
    </div>
  );
};
