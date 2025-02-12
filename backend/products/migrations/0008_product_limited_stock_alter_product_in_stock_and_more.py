# Generated by Django 4.2.8 on 2024-02-02 04:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0007_alter_categoryoption_default_values"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="limited_stock",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="product",
            name="in_stock",
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name="variation",
            name="related_images",
            field=models.ManyToManyField(
                blank=True,
                null=True,
                related_name="variations",
                to="products.productfile",
            ),
        ),
    ]
