# Generated by Django 4.2.8 on 2024-02-14 15:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0020_category_units_of_quantity"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="bulkpurchasepolicy",
            name="lead_time",
        ),
        migrations.RemoveField(
            model_name="variation",
            name="related_images",
        ),
        migrations.AddField(
            model_name="bulkpurchasepolicy",
            name="max_lead_time",
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name="bulkpurchasepolicy",
            name="min_lead_time",
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name="crossvariationquantitytable",
            name="in_stock",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="product",
            name="in_stock",
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name="product",
            name="min_order_quantity",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="product",
            name="unit_of_measuring",
            field=models.CharField(default="Count", max_length=255),
        ),
        migrations.AlterField(
            model_name="productoptions",
            name="category_option",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="options",
                to="products.categoryoption",
            ),
        ),
    ]
