import { ApplicationData, SubmittedApplication } from '../types/application';
import { supabase } from './supabaseClient';

const DRAFT_STORAGE_KEY = 'required_pro_application_draft_v1';

export const initialApplicationData: ApplicationData = {
  personal: {
    applicantType: 'Student',
    identifierNumber: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Indian',
  },
  contact: {
    email: '',
    mobile: '',
    alternateMobile: '',
    linkedinUrl: '',
    portfolioUrl: '',
  },
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    sameAsPermanent: true,
    permStreet: '',
    permCity: '',
    permState: '',
    permPincode: '',
    permCountry: 'India',
  },
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Technology',
      institution: '',
      boardOrUniversity: '',
      passingYear: '',
      scorePercentage: '',
      specialization: 'Computer Science',
    },
  ],
  experience: [],
};

export function loadDraft(): ApplicationData {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...initialApplicationData,
        ...parsed,
        personal: {
          ...initialApplicationData.personal,
          ...parsed.personal,
          applicantType: parsed.personal?.applicantType || 'Student',
        },
        contact: { ...initialApplicationData.contact, ...parsed.contact },
        address: { ...initialApplicationData.address, ...parsed.address },
        education: Array.isArray(parsed.education) && parsed.education.length > 0 ? parsed.education : initialApplicationData.education,
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      };
    }
  } catch (err) {
    console.error('Failed to load application draft from localStorage', err);
  }
  return initialApplicationData;
}

export function saveDraft(data: ApplicationData): void {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save draft to localStorage', err);
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear draft', err);
  }
}

/**
 * Submits application form data to Supabase table `employee_applications`
 * and keeps local SQLite backend backup.
 */
export async function submitApplication(data: ApplicationData): Promise<{ success: boolean; applicationId: string; submittedAt: string }> {
  const submittedAt = new Date().toISOString();

  // 1. Primary insert into Supabase employee_applications table
  let supabaseResult: { id?: string } | null = null;
  if (supabase) {
    const { data: insertedRows, error: sbError } = await supabase
      .from('employee_applications')
      .insert([{ application: data }])
      .select('id, submitted_at');

    if (sbError) {
      console.error('Supabase submission notice:', sbError.message);
      // Fallback try inserting into applications table
      const { data: fallbackRows, error: fallbackError } = await supabase
        .from('applications')
        .insert([{
          data_json: data,
          submitted_at: submittedAt,
          first_name: data.personal.firstName,
          last_name: data.personal.lastName,
          email: data.contact.email,
        }])
        .select('id');

      if (fallbackError) {
        console.warn('Supabase fallback notice:', fallbackError.message);
      } else if (fallbackRows && fallbackRows.length > 0) {
        supabaseResult = fallbackRows[0];
      }
    } else if (insertedRows && insertedRows.length > 0) {
      supabaseResult = insertedRows[0];
    }
  }

  // 2. Also submit to local server endpoint
  let localAppId = `APP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const body = await response.json();
      if (body.applicationId) localAppId = body.applicationId;
    }
  } catch (err) {
    console.warn('Local API backup notification:', err);
  }

  const applicationId = supabaseResult?.id ? `APP-${supabaseResult.id.slice(0, 8).toUpperCase()}` : localAppId;

  return {
    success: true,
    applicationId,
    submittedAt,
  };
}

export async function fetchApplications(): Promise<SubmittedApplication[]> {
  // Try fetching from Supabase table employee_applications
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('employee_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: `APP-${item.id ? item.id.slice(0, 8).toUpperCase() : 'REC'}`,
          submittedAt: item.submitted_at || new Date().toISOString(),
          ...(item.application || {}),
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
    }
  }

  // Fallback to local SQLite endpoint
  try {
    const response = await fetch('/api/applications');
    const body = await response.json();
    if (response.ok && body.success && Array.isArray(body.applications)) {
      return body.applications;
    }
  } catch (err) {
    console.warn('Local SQLite fetch notice:', err);
  }

  return [];
}
