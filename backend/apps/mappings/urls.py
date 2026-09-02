from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import MappingViewSet, PatientDoctorsListView

router = DefaultRouter()
router.register("", MappingViewSet, basename="mapping")

urlpatterns = [
    path("patient/<uuid:patient_id>/", PatientDoctorsListView.as_view(), name="patient-doctors"),
    path("", include(router.urls)),
]
