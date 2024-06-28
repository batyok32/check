# Generated by Django 4.2.8 on 2024-01-29 19:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("users", "0006_useraccount_created_at_useraccount_updated_at"),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
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
                ("name", models.CharField(max_length=255)),
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        default="product_default.png",
                        upload_to="categories/%Y/%m/%d",
                    ),
                ),
                ("slug", models.SlugField(blank=True, max_length=255, unique=True)),
                (
                    "status_of_image_processing",
                    models.CharField(
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
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="childrens",
                        to="products.category",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Categories",
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="CategoryOption",
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
                ("name", models.CharField(max_length=255)),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="options",
                        to="products.category",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Category Options",
            },
        ),
        migrations.CreateModel(
            name="GlobalPickups",
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
                ("name", models.CharField(max_length=255)),
                ("image", models.ImageField(upload_to="globalpickups/%Y/%m/%d")),
                ("link", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Product",
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
                ("name", models.CharField(max_length=255)),
                ("slug", models.SlugField(blank=True, max_length=255, unique=True)),
                ("description", models.TextField()),
                ("unit_of_measuring", models.CharField(max_length=255)),
                ("country_of_origin", models.CharField(max_length=255)),
                ("in_stock", models.IntegerField()),
                ("min_order_quantity", models.IntegerField()),
                ("active", models.BooleanField(default=True)),
                (
                    "image",
                    models.ImageField(
                        blank=True, null=True, upload_to="products/%Y/%m/%d"
                    ),
                ),
                ("min_price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("max_price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("quantity_sold", models.IntegerField(default=0)),
                ("last_sold_at", models.DateTimeField(blank=True, null=True)),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="categories",
                        to="products.category",
                    ),
                ),
                (
                    "seller",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="products",
                        to="users.sellerprofile",
                    ),
                ),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="VariationCategory",
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
                ("name", models.CharField(max_length=255)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="variation_categories",
                        to="products.product",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Variation",
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
                ("name", models.CharField(max_length=255)),
                ("in_stock", models.IntegerField(blank=True, null=True)),
                (
                    "variation_category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="variations",
                        to="products.variationcategory",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Product Variations",
            },
        ),
        migrations.CreateModel(
            name="Review",
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
                ("rating", models.DecimalField(decimal_places=2, max_digits=3)),
                ("comment", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to="products.product",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="ProductOptions",
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
                ("value", models.CharField(max_length=255)),
                (
                    "category_option",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="options",
                        to="products.categoryoption",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="options",
                        to="products.product",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Product Options",
            },
        ),
        migrations.CreateModel(
            name="ProductFile",
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
                    "file_type",
                    models.CharField(
                        choices=[("IMAGE", "Image"), ("VIDEO", "Video")], max_length=255
                    ),
                ),
                ("file", models.FileField(upload_to="product_files/")),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="files",
                        to="products.variation",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Product Files",
            },
        ),
        migrations.CreateModel(
            name="BulkPurchasePolicy",
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
                ("minimum_quantity", models.IntegerField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("lead_time", models.IntegerField()),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="bulks",
                        to="products.product",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Bulk Purchase Policies",
            },
        ),
    ]
