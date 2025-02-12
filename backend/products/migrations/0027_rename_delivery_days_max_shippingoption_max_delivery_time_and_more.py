# Generated by Django 4.2.8 on 2024-02-15 23:17

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0026_shippingoption_delete_shippingoptions"),
    ]

    operations = [
        migrations.RenameField(
            model_name="shippingoption",
            old_name="delivery_days_max",
            new_name="max_delivery_time",
        ),
        migrations.RenameField(
            model_name="shippingoption",
            old_name="delivery_days_min",
            new_name="min_delivery_time",
        ),
        migrations.AlterField(
            model_name="shippingoption",
            name="max_dimension",
            field=models.IntegerField(verbose_name="Max meter cube"),
        ),
        migrations.AlterField(
            model_name="shippingoption",
            name="max_weight",
            field=models.IntegerField(verbose_name="Max kilogram"),
        ),
    ]
