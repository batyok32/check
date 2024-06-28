# Generated by Django 4.2.8 on 2024-02-15 04:05

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0023_remove_crossvariationquantitytable_variations_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="created",
            field=models.DateTimeField(
                auto_now_add=True,
                default=django.utils.timezone.now,
                verbose_name="Created",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="product",
            name="updated",
            field=models.DateTimeField(auto_now=True, verbose_name="Updated"),
        ),
    ]
