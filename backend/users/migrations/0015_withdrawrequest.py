# Generated by Django 4.2.8 on 2024-03-24 15:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0014_alter_sellertransaction_variation"),
    ]

    operations = [
        migrations.CreateModel(
            name="WithDrawRequest",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                ("fee_amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("reference_id", models.CharField(max_length=255)),
                ("bin_number", models.CharField(max_length=255)),
                ("card_brand", models.CharField(max_length=255)),
                ("card_type", models.CharField(max_length=255)),
                ("cardholder_name", models.CharField(max_length=255)),
                ("last_4", models.CharField(max_length=255)),
                (
                    "state",
                    models.CharField(
                        choices=[
                            ("SUCCESS", "Success"),
                            ("PROCESSING", "Processing"),
                            ("FAILED", "Failed"),
                        ],
                        default="PROCESSING",
                        max_length=50,
                    ),
                ),
                (
                    "seller",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="withdraw_requests",
                        to="users.sellerprofile",
                    ),
                ),
            ],
            options={
                "verbose_name": "Withdraw request",
                "verbose_name_plural": "Withdraw requests",
            },
        ),
    ]
