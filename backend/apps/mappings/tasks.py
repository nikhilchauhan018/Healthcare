import logging

logger = logging.getLogger(__name__)


def notify_doctor_assigned(mapping_id):
    """
    Log or trigger notification for doctor assignment without needing Celery/Redis.
    """
    from .models import PatientDoctorMapping
    try:
        mapping = PatientDoctorMapping.objects.select_related("patient", "doctor").get(id=mapping_id)
        logger.info("Notify Dr. %s: new patient %s assigned", mapping.doctor.name, mapping.patient.name)
    except PatientDoctorMapping.DoesNotExist:
        logger.warning("Mapping %s no longer exists, skipping notification", mapping_id)
    except Exception as exc:
        logger.warning("Notification error: %s", exc)

