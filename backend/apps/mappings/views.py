from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from apps.patients.models import Patient
from .models import PatientDoctorMapping
from .serializers import MappingSerializer
from .tasks import notify_doctor_assigned


class MappingViewSet(viewsets.ModelViewSet):
    """
    /api/mappings/          GET (list all), POST (assign doctor to patient)
    /api/mappings/<id>/     GET (by mapping id or patient id), DELETE (unassign)
    """
    serializer_class = MappingSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_throttles(self):
        if self.request.method not in permissions.SAFE_METHODS:
            self.throttle_scope = "write"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_queryset(self):
        user = self.request.user
        qs = PatientDoctorMapping.objects.select_related("patient", "doctor")
        return qs if user.is_staff else qs.filter(patient__created_by=user)

    def retrieve(self, request, *args, **kwargs):
        lookup_val = self.kwargs.get(self.lookup_field)
        # Check if the lookup value matches a patient ID
        patient_mappings = self.get_queryset().filter(patient_id=lookup_val)
        if patient_mappings.exists() or Patient.objects.filter(id=lookup_val).exists():
            serializer = self.get_serializer(patient_mappings, many=True)
            return Response(serializer.data)
        return super().retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        mapping = serializer.save(assigned_by=self.request.user)
        notify_doctor_assigned(str(mapping.id))


class PatientDoctorsListView(generics.ListAPIView):
    """GET /api/v1/mappings/patient/<patient_id>/ — all doctors for one patient."""
    serializer_class = MappingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PatientDoctorMapping.objects.filter(
            patient_id=self.kwargs["patient_id"]
        ).select_related("patient", "doctor")
