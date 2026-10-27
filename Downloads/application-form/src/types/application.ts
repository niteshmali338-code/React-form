export interface PersonalDetails {
  applicantType: 'Student' | 'Employee';
  identifierNumber?: string; // Roll No / Student ID or Employee ID
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
}

export interface ContactDetails {
  email: string;
  mobile: string;
  alternateMobile: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

export interface AddressDetails {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  sameAsPermanent: boolean;
  permStreet: string;
  permCity: string;
  permState: string;
  permPincode: string;
  permCountry: string;
}

export interface EducationRecord {
  id: string;
  degree: string;
  institution: string;
  boardOrUniversity: string;
  passingYear: string;
  scorePercentage: string;
  specialization: string;
}

export interface ExperienceRecord {
  id: string;
  company: string;
  designation: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  keyResponsibilities: string;
}

export interface ApplicationData {
  personal: PersonalDetails;
  contact: ContactDetails;
  address: AddressDetails;
  education: EducationRecord[];
  experience: ExperienceRecord[];
}

export interface SubmittedApplication extends ApplicationData {
  id: string;
  submittedAt: string;
}

export type ValidationErrors = Record<string, string>;
