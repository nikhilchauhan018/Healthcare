from django.db import models
from apps.core.models import BaseModel


class Doctor(BaseModel):
    class Specialization(models.TextChoices):
        GENERAL = "general", "General Physician"
        CARDIOLOGY = "cardiology", "Cardiology"
        DERMATOLOGY = "dermatology", "Dermatology"
        NEUROLOGY = "neurology", "Neurology"
        PEDIATRICS = "pediatrics", "Pediatrics"
        ORTHOPEDICS = "orthopedics", "Orthopedics"
        OTHER = "other", "Other"

    name = models.CharField(max_length=150)
    specialization = models.CharField(max_length=30, choices=Specialization.choices, db_index=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    years_of_experience = models.PositiveSmallIntegerField(default=0)
    added_by = models.ForeignKey(
        "authentication.User", on_delete=models.SET_NULL, null=True, related_name="doctors_added"
    )

    class Meta(BaseModel.Meta):
        db_table = "doctors"
        indexes = [models.Index(fields=["specialization"])]

    def __str__(self):
        return f"Dr. {self.name} ({self.specialization})"
