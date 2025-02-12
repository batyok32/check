# Generated by Django 4.2.8 on 2024-02-01 11:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0005_categoryoption_default_values"),
    ]

    operations = [
        migrations.AddField(
            model_name="productfile",
            name="status_of_image_processing",
            field=models.CharField(
                choices=[
                    ("Pending", "Pending"),
                    ("Processing", "Processing..."),
                    ("Success", "Success"),
                    ("Error", "Error"),
                ],
                default="Pending",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="variation",
            name="related_images",
            field=models.ManyToManyField(
                related_name="variations", to="products.productfile"
            ),
        ),
        migrations.AlterField(
            model_name="categoryoption",
            name="field_type",
            field=models.CharField(
                choices=[
                    ("SELECT", "Select"),
                    ("MULTIPLE_SELECT", "Multiple select"),
                    ("BOOLEAN", "Boolean"),
                ],
                default="SELECT",
                max_length=15,
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="image",
            field=models.ImageField(
                blank=True,
                default="product_default.png",
                upload_to="categories/%Y/%m/%d",
            ),
        ),
        migrations.AlterField(
            model_name="productfile",
            name="file_type",
            field=models.CharField(
                choices=[("IMAGE", "Image"), ("VIDEO", "Video")],
                default="IMAGE",
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name="productfile",
            name="product",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="files",
                to="products.product",
            ),
        ),
    ]
