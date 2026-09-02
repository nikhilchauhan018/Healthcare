import logging
import time
import uuid

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    """Logs method, path, status, and latency for every request — the first
    thing you need when diagnosing 'the API is slow' under real traffic."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.request_id = str(uuid.uuid4())
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = (time.monotonic() - start) * 1000
        response["X-Request-ID"] = request.request_id
        logger.info(
            "%s %s -> %s (%.1fms) [%s]",
            request.method, request.path, response.status_code,
            duration_ms, request.request_id,
        )
        return response


class ExceptionLoggingMiddleware:
    """Belt-and-braces catch-all so a bug in a non-DRF view (e.g. admin,
    health check) never returns a raw traceback to the client."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        logger.exception("Unhandled view exception on %s", request.path, exc_info=exception)
        return None  # let Django's normal 500 handling continue
