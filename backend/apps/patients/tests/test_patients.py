import pytest
from rest_framework.test import APIClient
from apps.authentication.models import User
from apps.patients.models import Patient

pytestmark = pytest.mark.django_db


def test_patient_created_by_scoping():
    owner = User.objects.create_user(email="a@x.com", name="A", password="StrongPass123")
    other = User.objects.create_user(email="b@x.com", name="B", password="StrongPass123")

    client = APIClient()
    client.force_authenticate(owner)
    client.post("/api/patients/", {"name": "John Doe", "age": 40, "gender": "male", "phone_number": "1"})

    client.force_authenticate(other)
    resp = client.get("/api/patients/")
    assert resp.data["count"] == 0  # other user cannot see owner's patient


def test_patient_put_update_and_delete():
    owner = User.objects.create_user(email="owner@x.com", name="Owner", password="StrongPass123")
    client = APIClient()
    client.force_authenticate(owner)

    # 1. Create Patient (POST /api/patients/)
    create_resp = client.post("/api/patients/", {
        "name": "Jane Doe",
        "age": 30,
        "gender": "female",
        "phone_number": "1234567890",
        "address": "123 Main St",
        "medical_history": "None"
    })
    assert create_resp.status_code == 201
    patient_id = create_resp.data["id"]

    # 2. Retrieve Specific Patient (GET /api/patients/<id>/)
    get_resp = client.get(f"/api/patients/{patient_id}/")
    assert get_resp.status_code == 200
    assert get_resp.data["name"] == "Jane Doe"

    # 3. Update Patient Details (PUT /api/patients/<id>/)
    put_resp = client.put(f"/api/patients/{patient_id}/", {
        "name": "Jane Smith",
        "age": 31,
        "gender": "female",
        "phone_number": "9876543210",
        "address": "456 Oak Ave",
        "medical_history": "Mild allergies"
    })
    assert put_resp.status_code == 200
    assert put_resp.data["name"] == "Jane Smith"
    assert put_resp.data["age"] == 31
    assert put_resp.data["address"] == "456 Oak Ave"

    # 4. Delete Patient Record (DELETE /api/patients/<id>/)
    del_resp = client.delete(f"/api/patients/{patient_id}/")
    assert del_resp.status_code == 204

    # 5. Confirm Deleted (GET /api/patients/<id>/ -> 404)
    get_deleted = client.get(f"/api/patients/{patient_id}/")
    assert get_deleted.status_code == 404
