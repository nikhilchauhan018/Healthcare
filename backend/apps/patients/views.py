from rest_framework import viewsets, permissions
from rest_framework.throttling import ScopedRateThrottle

from apps.common.permissions.permissions import IsOwnerOrReadOnlyForStaff
from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    /api/v1/patients/        GET (only records created by the caller), POST
    /api/v1/patients/<id>/   GET, PUT, PATCH, DELETE (owner only)
    """
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnlyForStaff]

    def get_throttles(self):
        if self.request.method not in permissions.SAFE_METHODS:
            self.throttle_scope = "write"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_queryset(self):
        user = self.request.user
        qs = Patient.objects.select_related("created_by")
        # Staff can audit all records; regular users only ever see their own.
        return qs if user.is_staff else qs.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
