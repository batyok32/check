# Generated by Django 4.2.8 on 2024-04-09 17:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("order", "0022_alter_order_options_alter_orderitem_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderitem",
            name="bought_in_containers",
            field=models.BooleanField(
                default=False, verbose_name="Bought in containers"
            ),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="container_height",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=5,
                null=True,
                verbose_name="Container height",
            ),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="container_length",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=5,
                null=True,
                verbose_name="Container length",
            ),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="container_name",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="container_weight",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=5,
                null=True,
                verbose_name="Container weight",
            ),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="container_width",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=5,
                null=True,
                verbose_name="Container width",
            ),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="items_inside_container",
            field=models.PositiveIntegerField(
                default=1, verbose_name="Quantity inside container"
            ),
        ),
    ]
