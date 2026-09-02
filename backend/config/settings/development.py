from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True

# --- Local Development: In-memory Cache (No Redis required) ---
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "healthcare-dev-cache",
        "TIMEOUT": 300,
    }
}

# --- Session stored in DB for development ---
SESSION_ENGINE = "django.contrib.sessions.backends.db"

# --- Development Email backend: log to console without SMTP server ---
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

