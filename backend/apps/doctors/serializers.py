from rest_framework import serializers
from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = [
            "id", "name", "specialization", "email", "phone_number",
            "years_of_experience", "added_by", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "added_by", "created_at", "updated_at"]
