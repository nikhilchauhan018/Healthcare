from django.contrib import admin
from .models import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ["name", "specialization", "email", "years_of_experience"]
    list_filter = ["specialization"]
    search_fields = ["name", "email"]
