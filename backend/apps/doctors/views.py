from rest_framework import viewsets, permissions
from rest_framework.throttling import ScopedRateThrottle
from django_filters.rest_framework import DjangoFilterBackend

from .models import Doctor
from .serializers import DoctorSerializer
from .filters import DoctorFilter


class DoctorViewSet(viewsets.ModelViewSet):
    """
    /api/v1/doctors/         GET (list, any authenticated user), POST
    /api/v1/doctors/<id>/    GET, PUT, PATCH, DELETE
    select_related avoided (no FK needed on read) — queryset stays a single
    indexed lookup even as the doctor table grows.
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DoctorFilter

    def get_throttles(self):
        if self.request.method not in permissions.SAFE_METHODS:
            self.throttle_scope = "write"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)
