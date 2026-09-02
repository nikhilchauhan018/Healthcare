import uuid
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("doctors", "0001_initial"),
        ("patients", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PatientDoctorMapping",
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
                ("notes", models.TextField(blank=True)),
                (
                    "assigned_by",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "doctor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="patient_mappings",
                        to="doctors.doctor",
                    ),
                ),
                (
                    "patient",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="doctor_mappings",
                        to="patients.patient",
                    ),
                ),
            ],
            options={
                "db_table": "patient_doctor_mappings",
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(
                        fields=["patient", "doctor"],
                        name="patient_doc_patient_1361c7_idx",
                    )
                ],
            },
        ),
        migrations.AddConstraint(
            model_name="patientdoctormapping",
            constraint=models.UniqueConstraint(
                fields=("patient", "doctor"), name="unique_patient_doctor_pair"
            ),
        ),
    ]
