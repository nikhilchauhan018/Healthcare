from rest_framework import serializers
from .models import PatientDoctorMapping
from apps.patients.models import Patient
from apps.doctors.models import Doctor


class MappingSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)

    class Meta:
        model = PatientDoctorMapping
        fields = [
            "id", "patient", "doctor", "patient_name", "doctor_name",
            "notes", "assigned_by", "created_at",
        ]
        read_only_fields = ["id", "assigned_by", "created_at"]
        validators = []  # uniqueness handled explicitly below for a clean error message

    def validate(self, attrs):
        patient, doctor = attrs["patient"], attrs["doctor"]
        if PatientDoctorMapping.objects.filter(patient=patient, doctor=doctor).exists():
            raise serializers.ValidationError("This doctor is already assigned to this patient.")
        return attrs
