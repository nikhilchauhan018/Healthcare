import pytest
from rest_framework.test import APIClient
from apps.authentication.models import User

pytestmark = pytest.mark.django_db


def _auth_client():
    user = User.objects.create_user(email="doc@example.com", name="Staff", password="StrongPass123")
    client = APIClient()
    client.force_authenticate(user)
    return client


def test_create_and_list_doctor():
    client = _auth_client()
    resp = client.post("/api/doctors/", {
        "name": "Dr. Mehta", "specialization": "cardiology",
        "email": "mehta@clinic.com", "phone_number": "9999999999", "years_of_experience": 12,
    })
    assert resp.status_code == 201
    resp = client.get("/api/doctors/")
    assert resp.status_code == 200
    assert resp.data["count"] == 1


def test_doctor_put_update_and_delete():
    client = _auth_client()

    # 1. Create Doctor (POST /api/doctors/)
    create_resp = client.post("/api/doctors/", {
        "name": "Dr. Sarah Connor",
        "specialization": "neurology",
        "email": "sarah@hospital.org",
        "phone_number": "5551234567",
        "years_of_experience": 8,
    })
    assert create_resp.status_code == 201
    doctor_id = create_resp.data["id"]

    # 2. Retrieve Specific Doctor (GET /api/doctors/<id>/)
    get_resp = client.get(f"/api/doctors/{doctor_id}/")
    assert get_resp.status_code == 200
    assert get_resp.data["name"] == "Dr. Sarah Connor"
    assert get_resp.data["specialization"] == "neurology"

    # 3. Update Doctor Details (PUT /api/doctors/<id>/)
    put_resp = client.put(f"/api/doctors/{doctor_id}/", {
        "name": "Dr. Sarah Connor-Smith",
        "specialization": "pediatrics",
        "email": "sarah.smith@hospital.org",
        "phone_number": "5559876543",
        "years_of_experience": 9,
    })
    assert put_resp.status_code == 200
    assert put_resp.data["name"] == "Dr. Sarah Connor-Smith"
    assert put_resp.data["specialization"] == "pediatrics"
    assert put_resp.data["years_of_experience"] == 9

    # 4. Delete Doctor Record (DELETE /api/doctors/<id>/)
    del_resp = client.delete(f"/api/doctors/{doctor_id}/")
    assert del_resp.status_code == 204

    # 5. Confirm Deleted (GET /api/doctors/<id>/ -> 404)
    get_deleted = client.get(f"/api/doctors/{doctor_id}/")
    assert get_deleted.status_code == 404
