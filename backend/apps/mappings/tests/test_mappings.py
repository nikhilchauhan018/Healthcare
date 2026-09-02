import pytest
from rest_framework.test import APIClient
from apps.authentication.models import User
from apps.patients.models import Patient
from apps.doctors.models import Doctor

pytestmark = pytest.mark.django_db


def test_duplicate_mapping_rejected():
    user = User.objects.create_user(email="a@x.com", name="A", password="StrongPass123")
    patient = Patient.objects.create(name="John", age=30, gender="male", phone_number="1", created_by=user)
    doctor = Doctor.objects.create(name="Mehta", specialization="cardiology", email="d@x.com", phone_number="1")

    client = APIClient()
    client.force_authenticate(user)
    payload = {"patient": str(patient.id), "doctor": str(doctor.id)}
    assert client.post("/api/v1/mappings/", payload).status_code == 201
    assert client.post("/api/v1/mappings/", payload).status_code == 400
