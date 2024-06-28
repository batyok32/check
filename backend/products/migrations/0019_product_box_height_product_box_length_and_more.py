# Generated by Django 4.2.8 on 2024-02-09 01:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0018_category_hs_code_product_dimensions_unit_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="box_height",
            field=models.IntegerField(default=5),
        ),
        migrations.AddField(
            model_name="product",
            name="box_length",
            field=models.IntegerField(default=5),
        ),
        migrations.AddField(
            model_name="product",
            name="box_weight",
            field=models.IntegerField(default=5),
        ),
        migrations.AddField(
            model_name="product",
            name="box_width",
            field=models.IntegerField(default=5),
        ),
    ]
