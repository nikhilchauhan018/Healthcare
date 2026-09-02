from django.db import models
from apps.core.models import BaseModel


class PatientDoctorMapping(BaseModel):
    patient = models.ForeignKey("patients.Patient", on_delete=models.CASCADE, related_name="doctor_mappings")
    doctor = models.ForeignKey("doctors.Doctor", on_delete=models.CASCADE, related_name="patient_mappings")
    assigned_by = models.ForeignKey("authentication.User", on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)

    class Meta(BaseModel.Meta):
        db_table = "patient_doctor_mappings"
        constraints = [
            models.UniqueConstraint(fields=["patient", "doctor"], name="unique_patient_doctor_pair")
        ]
        indexes = [models.Index(fields=["patient", "doctor"])]

    def __str__(self):
        return f"{self.patient.name} -> Dr. {self.doctor.name}"
