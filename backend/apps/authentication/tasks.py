import logging
import threading
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def _send_email_thread(user_id):
    from .models import User
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            subject="Welcome to the Healthcare Platform",
            message=f"Hi {user.name}, your account has been created successfully.",
            from_email=getattr(settings, "EMAIL_HOST_USER", "") or "no-reply@healthcare.local",
            recipient_list=[user.email],
            fail_silently=True,
        )
        logger.info("Welcome email sent to user %s (%s)", user.name, user.email)
    except Exception as exc:
        logger.warning("Welcome email skipped for %s: %s", user_id, exc)


def send_welcome_email(user_id):
    """Run in background thread without needing Redis or Celery."""
    thread = threading.Thread(target=_send_email_thread, args=(user_id,), daemon=True)
    thread.start()

