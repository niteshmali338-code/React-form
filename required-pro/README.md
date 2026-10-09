 Application Form

A professional, responsive React application form for collecting candidate personal, contact, address, education, and experience details.

## Features

- Structured multi-section application form built with reusable React components.
- Add or remove multiple education and experience records.
- Review and edit flow before confirmation.
- Accessible labels, error messaging, keyboard-friendly controls, and ARIA attributes.
- Responsive Bootstrap grid for desktop, tablet, and mobile layouts.
- Loading, validation error, API failure, and successful submission states.
- SQLite-backed application submission service.

## Technologies

- React 19 with functional components and Hooks
- Vite
- JavaScript (ES6+)
- Bootstrap 5
- CSS with responsive media queries
- Node.js built-in SQLite database for submitted applications

## Installation and running

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. Vite mounts the SQLite API automatically, so only one command is needed during development. Confirmed applications are stored in `data/applications.sqlite`; drafts remain saved in the current browser. Use Node.js 22.13 or later for the built-in SQLite module. A production deployment must host `server.js` and route `/api/applications` to that API. Production validation is available with `npm run build` and `npm run lint`.

## Project structure

```text
src/
├── components/
│   ├── AddressInformation.jsx
│   ├── ContactInformation.jsx
│   ├── EducationInformation.jsx
│   ├── ExperienceInformation.jsx
│   ├── FormInput.jsx
│   ├── FormSelect.jsx
│   ├── PersonalInformation.jsx
│   ├── ReviewScreen.jsx
│   └── SectionCard.jsx
├── services/
│   └── applicationService.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
server.js
```

## Validation

Required fields are checked across every section. Email uses a format check, mobile numbers require 10 digits, pincodes require 5 or 6 digits, education scores must be numeric from 0 to 100, passing years must be four-digit years, and experience end dates cannot precede start dates. Errors are shown beside their field and connected with `aria-describedby`.

## Application storage

The API accepts confirmed applications at `POST /api/applications`, stores the complete form data as JSON in SQLite, and returns a generated application reference. The database is created automatically on first server start and is excluded from version control. Drafts continue to be saved in browser local storage.

## Testing checklist

Manually test empty submission, invalid email/mobile/pincode, invalid education score and year, invalid experience date ranges, a complete valid application, keyboard navigation, mobile widths, review editing, loading feedback, and the success state. `npm run dev` starts both the frontend and database API.
