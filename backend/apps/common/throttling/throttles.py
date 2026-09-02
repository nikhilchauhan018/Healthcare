"""
Custom throttle classes layered on top of DRF's built-in rate limiting.
Rates are Redis-backed (see CACHES in settings) so limits hold correctly
across multiple gunicorn workers / pods, not just one process.
"""
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle, ScopedRateThrottle


class BurstRateThrottle(UserRateThrottle):
    """Stops short bursts (e.g. a broken frontend loop) — scope: 'burst'."""
    scope = "burst"


class SustainedRateThrottle(UserRateThrottle):
    """Caps total daily volume per user — scope: 'sustained'."""
    scope = "sustained"


class AuthRateThrottle(AnonRateThrottle):
    """
    Applied only to /auth/register and /auth/login.
    Anonymous + tight, since these endpoints are the prime brute-force target.
    """
    scope = "auth"


class WriteRateThrottle(ScopedRateThrottle):
    """Applied to POST/PUT/DELETE viewsets to protect the DB from write storms."""
    scope = "write"
