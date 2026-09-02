import uuid
from django.db import models


class BaseModel(models.Model):
    """
    Shared by every domain model: UUID primary keys (don't leak sequential
    record counts / guessable IDs like /patients/1/, /patients/2/...),
    plus created/updated timestamps for auditing.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]
