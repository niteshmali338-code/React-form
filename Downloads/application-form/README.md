# Application Form (required-pro)

A professional, responsive React candidate application form for collecting personal, contact, address, education, and experience details with SQLite persistence.

## Features

- Multi-section application form with step-by-step progress indicator.
- Add or remove multiple education qualifications and work experience records.
- Comprehensive review & edit screen before final confirmation.
- Form field validation (email format, 10-digit phone, 5/6 digit PIN codes, education score, date constraints).
- Auto-save draft to `localStorage` to prevent loss of candidate input.
- SQLite-backed backend storage using Node.js built-in `node:sqlite`.
- Submissions viewer modal to inspect all candidate applications stored in SQLite.
- Accessible ARIA labels and error feedback.

## Project Structure

```text
src/
├── components/
│   ├── AddressInformation.tsx
│   ├── ContactInformation.tsx
│   ├── EducationInformation.tsx
│   ├── ExperienceInformation.tsx
│   ├── FormInput.tsx
│   ├── FormSelect.tsx
│   ├── PersonalInformation.tsx
│   ├── ReviewScreen.tsx
│   ├── SectionCard.tsx
│   └── SubmittedApplicationsView.tsx
├── services/
│   └── applicationService.ts
├── types/
│   └── application.ts
├── App.tsx
├── index.css
└── main.tsx
server.js
vite.config.ts
```

## Running the Application

```bash
npm run dev
```

Vite starts both the React frontend and the SQLite backend handler automatically. Confirmed applications are stored in `data/applications.sqlite`.
