# Generated by Django 4.2.8 on 2024-02-23 03:02

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0007_remove_address_seller_address_user_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="address",
            name="address_type",
        ),
        migrations.RemoveField(
            model_name="sellerprofile",
            name="address_type",
        ),
    ]
