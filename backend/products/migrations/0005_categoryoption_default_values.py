# Generated by Django 4.2.8 on 2024-01-31 11:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0004_categoryoption_field_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="categoryoption",
            name="default_values",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
