import django_filters
from .models import Doctor


class DoctorFilter(django_filters.FilterSet):
    class Meta:
        model = Doctor
        fields = {"specialization": ["exact"], "years_of_experience": ["gte", "lte"]}
