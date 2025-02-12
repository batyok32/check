# Generated by Django 4.2.8 on 2024-04-11 19:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("order", "0026_remove_pickuporder_cancellation_reason_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pickuporder",
            name="orderitem",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="pickup",
                to="order.orderitem",
                verbose_name="Order item",
            ),
        ),
    ]
