# Generated by Django 4.2.8 on 2024-02-07 15:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0013_remove_addressbook_address_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="is_free_shipping",
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name="ShippingOptions",
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
                (
                    "countries",
                    models.TextField(verbose_name="Only country codes with ',' split"),
                ),
                (
                    "shipping_type",
                    models.CharField(
                        choices=[
                            ("FREE", "Free"),
                            ("FIXED", "Fixed"),
                            ("BASED_ON_ZIP", "Based on zip"),
                        ],
                        default="FREE",
                        max_length=13,
                    ),
                ),
                ("price", models.IntegerField(blank=True, null=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="shipping_options",
                        to="products.product",
                    ),
                ),
            ],
        ),
    ]
