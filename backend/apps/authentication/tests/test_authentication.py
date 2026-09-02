import pytest
from rest_framework.test import APIClient
from apps.authentication.models import User

pytestmark = pytest.mark.django_db


def test_register_creates_user():
    client = APIClient()
    resp = client.post("/api/v1/auth/register/", {
        "name": "Dr. Asha Rao", "email": "asha@example.com", "password": "StrongPass123",
    })
    assert resp.status_code == 201
    assert User.objects.filter(email="asha@example.com").exists()


def test_login_returns_jwt():
    User.objects.create_user(email="asha@example.com", name="Asha", password="StrongPass123")
    client = APIClient()
    resp = client.post("/api/v1/auth/login/", {"email": "asha@example.com", "password": "StrongPass123"})
    assert resp.status_code == 200
    assert "access" in resp.data["data"]
