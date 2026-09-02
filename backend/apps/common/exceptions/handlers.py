"""
Uniform error envelope for every API error, so the frontend never has to
special-case DRF's default shape vs. an unhandled Python exception.
"""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.db import DatabaseError

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "success": False,
            "error": {
                "code": response.status_code,
                "message": _first_message(response.data),
                "details": response.data,
            },
        }
        return response

    # Unhandled exception (bug, DB hiccup, etc.) -> log full trace, return generic 500.
    # Never leak stack traces or DB errors to the client.
    logger.exception("Unhandled exception", exc_info=exc)
    if isinstance(exc, DatabaseError):
        message = "A database error occurred. Please try again shortly."
    else:
        message = "An unexpected error occurred. Our team has been notified."

    return Response(
        {"success": False, "error": {"code": 500, "message": message, "details": None}},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


def _first_message(data):
    if isinstance(data, dict):
        for value in data.values():
            if isinstance(value, list) and value:
                return str(value[0])
            return str(value)
    if isinstance(data, list) and data:
        return str(data[0])
    return "Request failed validation."
