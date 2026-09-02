# Healthcare Backend

A production-structured Django + DRF backend for managing patients, doctors,
and patient-doctor assignments, built for real traffic — not just a demo.

## Why it's structured this way

| Concern | How it's handled |
|---|---|
| **High traffic / stability** | Redis-backed DRF throttling (per-user burst + sustained + tighter auth/write scopes), Nginx edge rate limiting, gunicorn multi-worker, DB connection pooling (`CONN_MAX_AGE`), pagination on every list endpoint, indexed foreign keys |
| **Won't crash on bad input** | Global custom exception handler → every error returns a uniform `{success, error}` envelope, never a raw traceback |
| **Slow operations don't block requests** | Celery + Redis broker for welcome emails and doctor-assignment notifications — API responses stay fast regardless of email/SMS latency |
| **Security** | JWT via `simplejwt` with rotation + blacklist, UUID primary keys (no sequential ID guessing), owner-scoped patient access, env-based secrets, HTTPS/HSTS in production settings |
| **Maintainability** | One Django app per domain (`authentication`, `patients`, `doctors`, `mappings`), each with its own models/serializers/views/urls/tasks/tests — not one giant `views.py` |
| **Observability** | Request logging middleware (latency + status per request), rotating file logs, `/health/` endpoint for load balancers, optional Sentry integration |

## Project layout

```
healthcare-backend/
├── config/
│   ├── settings/
│   │   ├── base.py          # shared settings
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py               # versioned API routes (/api/v1/...)
│   ├── wsgi.py / asgi.py
├── apps/
│   ├── core/                 # BaseModel (UUID pk, timestamps), middleware
│   ├── authentication/       # User model, register/login/refresh/me, welcome-email task
│   ├── patients/             # Patient model + owner-scoped CRUD
│   ├── doctors/               # Doctor model + CRUD + specialization filter
│   ├── mappings/              # Patient-Doctor mapping + assignment notification task
│   └── common/
│       ├── throttling/       # burst / sustained / auth / write throttle classes
│       ├── pagination/       # standard paginated response shape
│       ├── exceptions/       # global exception handler
│       └── permissions/      # owner-or-staff permission
├── celery_app/                # Celery entrypoint + queue routing
├── docker/Dockerfile
├── nginx/nginx.conf
├── docker-compose.yml
└── requirements.txt
```

Each app follows the same internal shape: `models.py`, `serializers.py`,
`views.py`, `urls.py`, `admin.py`, `tests/`, and `tasks.py` where async work
is needed — so a recruiter (or a new teammate) can predict where anything
lives without reading the whole codebase.

## Running locally (Docker — recommended)

```bash
cp .env.example .env        # fill in real values
docker compose up --build
docker compose exec web python manage.py createsuperuser
```

- API: http://localhost/api/v1/
- Swagger docs: http://localhost/api/docs/
- Admin: http://localhost/admin/
- Health check: http://localhost/health/

## Running locally (without Docker)

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # point POSTGRES_HOST/REDIS_URL at localhost
python manage.py migrate
python manage.py runserver
# separately:
celery -A celery_app worker -l info
```

## Tests

```bash
pytest
```

## API Endpoints (Assignment Specification)

All endpoints work directly under `/api/` (and also versioned `/api/v1/`). Swagger docs are at `/api/docs/`.

### 1. Authentication APIs
- `POST /api/auth/register/` - Register a new user (`name`, `email`, `password`)
- `POST /api/auth/login/` - Log in and obtain JWT `access` & `refresh` tokens

### 2. Patient Management APIs (Authenticated Users)
- `POST /api/patients/` - Add a new patient (`name`, `age`, `gender`, `phone_number`, `address`, `medical_history`)
- `GET /api/patients/` - Retrieve all patients created by the authenticated user
- `GET /api/patients/<id>/` - Get details of a specific patient
- `PUT /api/patients/<id>/` - Update patient details
- `DELETE /api/patients/<id>/` - Delete a patient record

### 3. Doctor Management APIs (Authenticated Users)
- `POST /api/doctors/` - Add a new doctor (`name`, `specialization`, `email`, `phone_number`, `years_of_experience`)
- `GET /api/doctors/` - Retrieve all doctors
- `GET /api/doctors/<id>/` - Get details of a specific doctor
- `PUT /api/doctors/<id>/` - Update doctor details
- `DELETE /api/doctors/<id>/` - Delete a doctor record

### 4. Patient-Doctor Mapping APIs (Authenticated Users)
- `POST /api/mappings/` - Assign a doctor to a patient (`patient`, `doctor`)
- `GET /api/mappings/` - Retrieve all patient-doctor mappings
- `GET /api/mappings/<patient_id>/` - Get all doctors assigned to a specific patient
- `DELETE /api/mappings/<id>/` - Remove a doctor from a patient

## What to point out to a recruiter

- Rate limiting is layered (Nginx → DRF throttle scopes) and Redis-backed, so it's correct even with multiple gunicorn workers or pods — not per-process and easily bypassed.
- Async task queue (Celery) is wired in for real, with retry + a dedicated `notifications` queue, not just installed and unused.
- Error handling is centralized, not scattered `try/except` per view — one exception handler guarantees a consistent API contract even on unexpected failures.
- Data access is scoped by ownership at the queryset level (`get_queryset`), not just at the serializer — this is the difference between "looks secure" and "is secure."
