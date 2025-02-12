# Generated by Django 4.2.8 on 2024-03-15 16:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("order", "0014_alter_orderitemstatuschangehistory_change_time"),
        ("products", "0033_alter_category_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="review",
            name="order_item",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="reviews",
                to="order.orderitem",
            ),
        ),
    ]
