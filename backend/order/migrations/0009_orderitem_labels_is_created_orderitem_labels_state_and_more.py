# Generated by Django 4.2.8 on 2024-03-05 03:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("order", "0008_remove_orderitem_process_status_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderitem",
            name="labels_is_created",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="labels_state",
            field=models.CharField(
                choices=[
                    ("NOT_STARTED", "Not started"),
                    ("PENDING", "Pending"),
                    ("ERROR", "Error"),
                    ("GENERATED", "Generated"),
                    ("PRINTED", "Printed"),
                ],
                default="NOT_STARTED",
                max_length=50,
            ),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="shipping_courier_type",
            field=models.CharField(
                choices=[("EASYSHIP", "Easyship"), ("YUUSELL", "YuuSell")],
                default="EASYSHIP",
                max_length=50,
            ),
        ),
        migrations.CreateModel(
            name="ShippingLabel",
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
                ("shipment_id", models.CharField(max_length=255)),
                ("courier_id", models.CharField(max_length=255)),
                ("courier_name", models.CharField(max_length=255)),
                ("label_state", models.CharField(max_length=255)),
                ("shipping_document", models.CharField(max_length=255)),
                ("shipping_document_format", models.CharField(max_length=255)),
                ("shipping_document_size", models.CharField(max_length=255)),
                ("tracking_page_url", models.CharField(max_length=255)),
                ("tracking", models.CharField(max_length=255)),
                (
                    "order_item",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="labels",
                        to="order.orderitem",
                    ),
                ),
            ],
        ),
    ]
