# Generated by Django 4.2.8 on 2024-03-03 20:38

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("order", "0006_orderitem_process_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="orderitem",
            name="process_status",
            field=models.CharField(
                choices=[
                    ("BUYER_PAID", "Buyer paid"),
                    ("SHIPPED", "Shipped"),
                    ("DELIVERED", "Delivered"),
                    ("CANCELLED", "Cancelled"),
                    ("CANCEL_REQUESTED", "Cancel requested"),
                    ("RETURNED", "Returned"),
                ],
                default="BUYER_PAID",
                max_length=50,
            ),
        ),
    ]
