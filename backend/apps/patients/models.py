from django.db import models
from apps.core.models import BaseModel


class Patient(BaseModel):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    name = models.CharField(max_length=150)
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)
    created_by = models.ForeignKey(
        "authentication.User", on_delete=models.CASCADE, related_name="patients"
    )

    class Meta(BaseModel.Meta):
        db_table = "patients"
        indexes = [models.Index(fields=["created_by"])]

    def __str__(self):
        return self.name
