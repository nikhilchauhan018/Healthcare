# MeridianHealth — Healthcare Staff & Patient Management System

MeridianHealth is a full-stack healthcare staff portal engineered to manage patient records, medical practitioners, and patient-doctor clinical mappings. Built with a React/TypeScript frontend and a Django REST Framework backend, the application focuses on clean data architecture, type safety, responsive performance, and reliable state synchronization.

---

## Architecture & System Design

The application separates concerns between an interactive client-side single page application and a modular RESTful backend API.

```
├── backend/
│   ├── apps/
│   │   ├── authentication/   # Custom user model, token generation, and auth endpoints
│   │   ├── patients/         # Patient directory CRUD, search filters, and record models
│   │   ├── doctors/          # Doctor profiles, specialty tags, and availability tracking
│   │   └── mappings/         # Many-to-many relationship management between patients and doctors
│   ├── config/               # Django project settings, WSGI/ASGI configuration, routing
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/       # Modular UI components (Dashboard, Patients, Doctors, Modals, Forms)
│   │   ├── services/         # Typed API clients, JWT interceptors, and local caching layer
│   │   ├── types/            # TypeScript domain interfaces and data contracts
│   │   ├── App.tsx           # Application state coordinator and view router
│   │   ├── main.tsx          # React application entry point
│   │   └── index.css         # Tailwind CSS baseline and typographic rules
│   ├── index.html
│   └── vite.config.ts
└── package.json
```

---

## Core Features & Implementation Details

### 1. Authentication & Session Security
- Implemented token-based authentication (JWT) with access and refresh tokens.
- Secure HTTP header injection via a unified API client wrapper.
- Multi-tier session persistence: active session data and fallback authentication states persist seamlessly across browser refreshes using local storage synchronization.

### 2. Patient Directory (CRUD)
- Full lifecycle management of patient records: unique patient identifier generation, demographic fields, contact info, and medical history.
- Real-time client-side and server-side search by patient name, phone number, and ID.
- Dynamic status tracking indicating assigned doctors and clinical consultation readiness.

### 3. Practitioner & Doctor Records
- Doctor profile cataloging including medical specialty, years of clinical experience, contact information, and current patient caseload counters.
- Specialty filtering and instant profile updates.

### 4. Patient-Doctor Assignment Engine
- Relational mapping between patients and medical specialists.
- Automatically increments doctor caseload counts and attaches formatted status badges to patient records.
- Prevents redundant assignments and supports assignment removal and clinical notes attachment.

### 5. Operational Dashboard
- Real-time overview metrics: active patient count, registered practitioners, open assignments, and system response latency.
- Recent activity feed displaying latest additions, relative timestamps, and instant record inspection modals.

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS (custom warm-neutral editorial medical theme)
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend
- **Framework**: Python 3 / Django & Django REST Framework (DRF)
- **Database**: SQLite (Development) / PostgreSQL compatible
- **API Standard**: RESTful endpoints with serialized JSON payloads and standard HTTP status codes

---

## API Specification

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a new healthcare staff account |
| POST | `/api/auth/login/` | Authenticate credentials and obtain JWT tokens |
| GET | `/api/auth/me/` | Retrieve current authenticated staff profile |
| GET / POST | `/api/patients/` | List all patient records / Register a new patient |
| GET / PUT / DELETE | `/api/patients/:id/` | Retrieve, update, or remove a specific patient record |
| GET / POST | `/api/doctors/` | List all doctors / Add a new medical practitioner |
| GET / PUT / DELETE | `/api/doctors/:id/` | Retrieve, update, or remove a doctor record |
| GET / POST | `/api/mappings/` | List active assignments / Assign a doctor to a patient |
| DELETE | `/api/mappings/:id/` | Remove a patient-doctor assignment |

---

## Installation & Setup Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- Python 3.10+ and `pip` (for backend execution)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/meridian-health.git
cd meridian-health
```

### 2. Frontend Setup
```bash
# Install node dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will start at `http://localhost:3000`.

### 3. Backend Setup (Optional / Standalone)
```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver 8000
```

---

## Key Technical Decisions

1. **Type Safety Across Domains**: Comprehensive TypeScript interfaces (`Patient`, `Doctor`, `Assignment`, `User`) eliminate runtime prop mismatches and mirror backend serializer schemas.
2. **Offline-First Resilience**: An intelligent API caching layer ensures that even during temporary server downtime, local storage maintains operational state without disrupting staff workflows.
3. **Design System**: Strict adherence to an accessible, high-contrast palette (`#245543` deep clinic green, `#FAF8F3` warm-canvas background, `#182321` high-legibility charcoal typography) tailored specifically for clinical readability.

---

## Author
Developed by Nikhil Kumar Chauhan
