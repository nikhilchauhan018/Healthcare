from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Direct routes matching assignment specification (e.g. /api/auth/, /api/patients/, etc.)
    path("api/auth/", include("apps.authentication.urls")),
    path("api/patients/", include("apps.patients.urls")),
    path("api/doctors/", include("apps.doctors.urls")),
    path("api/mappings/", include("apps.mappings.urls")),

    # Versioned API routes (e.g. /api/v1/auth/, /api/v1/patients/, etc.)
    path("api/v1/auth/", include("apps.authentication.urls")),
    path("api/v1/patients/", include("apps.patients.urls")),
    path("api/v1/doctors/", include("apps.doctors.urls")),
    path("api/v1/mappings/", include("apps.mappings.urls")),

    # API docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # Liveness/readiness probes for load balancers & uptime checks
    path("health/", include("health_check.urls")),
]
