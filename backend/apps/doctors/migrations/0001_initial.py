import uuid
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Doctor",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=150)),
                (
                    "specialization",
                    models.CharField(
                        choices=[
                            ("general", "General Physician"),
                            ("cardiology", "Cardiology"),
                            ("dermatology", "Dermatology"),
                            ("neurology", "Neurology"),
                            ("pediatrics", "Pediatrics"),
                            ("orthopedics", "Orthopedics"),
                            ("other", "Other"),
                        ],
                        db_index=True,
                        max_length=30,
                    ),
                ),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("phone_number", models.CharField(max_length=20)),
                (
                    "years_of_experience",
                    models.PositiveSmallIntegerField(default=0),
                ),
                (
                    "added_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="doctors_added",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "doctors",
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(
                        fields=["specialization"], name="doctors_special_e30561_idx"
                    )
                ],
            },
        ),
    ]
