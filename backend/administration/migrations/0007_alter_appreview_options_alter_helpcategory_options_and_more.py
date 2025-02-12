# Generated by Django 4.2.8 on 2024-03-30 20:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("order", "0021_orderitem_closed_alter_orderitem_status_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("administration", "0006_supportcasemessage_user"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="appreview",
            options={
                "verbose_name": "App review",
                "verbose_name_plural": "App reviews",
            },
        ),
        migrations.AlterModelOptions(
            name="helpcategory",
            options={
                "verbose_name": "Help category",
                "verbose_name_plural": "Help categories",
            },
        ),
        migrations.AlterModelOptions(
            name="helpitem",
            options={"verbose_name": "Help", "verbose_name_plural": "Helps"},
        ),
        migrations.AlterModelOptions(
            name="labelcreatefail",
            options={
                "verbose_name": "Label create fail",
                "verbose_name_plural": "Label create fails",
            },
        ),
        migrations.AlterModelOptions(
            name="refundrequest",
            options={
                "verbose_name": "Refund request",
                "verbose_name_plural": "Refund requests",
            },
        ),
        migrations.AlterModelOptions(
            name="supportcase",
            options={
                "verbose_name": "Support case",
                "verbose_name_plural": "Support cases",
            },
        ),
        migrations.AlterModelOptions(
            name="supportcasemessage",
            options={
                "verbose_name": "Support case message",
                "verbose_name_plural": "Support case messages",
            },
        ),
        migrations.AddField(
            model_name="supportcase",
            name="email",
            field=models.CharField(
                blank=True, max_length=255, null=True, verbose_name="Email"
            ),
        ),
        migrations.AddField(
            model_name="supportcasemessage",
            name="email",
            field=models.CharField(
                blank=True, max_length=255, null=True, verbose_name="Email"
            ),
        ),
        migrations.AlterField(
            model_name="appreview",
            name="comment",
            field=models.TextField(verbose_name="Comment"),
        ),
        migrations.AlterField(
            model_name="appreview",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, verbose_name="Created"),
        ),
        migrations.AlterField(
            model_name="appreview",
            name="rating",
            field=models.IntegerField(verbose_name="Rating"),
        ),
        migrations.AlterField(
            model_name="appreview",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="app_reviews",
                to=settings.AUTH_USER_MODEL,
                verbose_name="User",
            ),
        ),
        migrations.AlterField(
            model_name="helpcategory",
            name="image",
            field=models.ImageField(
                blank=True,
                default="product_default.png",
                upload_to="help-categories/",
                verbose_name="Image",
            ),
        ),
        migrations.AlterField(
            model_name="helpcategory",
            name="title",
            field=models.CharField(max_length=255, verbose_name="Title"),
        ),
        migrations.AlterField(
            model_name="helpcategory",
            name="user_type",
            field=models.CharField(
                choices=[("client", "Client"), ("seller", "Seller")],
                default="client",
                max_length=20,
                verbose_name="User type",
            ),
        ),
        migrations.AlterField(
            model_name="helpitem",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="helpitems",
                to="administration.helpcategory",
                verbose_name="Category",
            ),
        ),
        migrations.AlterField(
            model_name="helpitem",
            name="image",
            field=models.ImageField(
                blank=True,
                default="product_default.png",
                upload_to="help-items/",
                verbose_name="Image",
            ),
        ),
        migrations.AlterField(
            model_name="helpitem",
            name="short_description",
            field=models.CharField(max_length=255, verbose_name="Short description"),
        ),
        migrations.AlterField(
            model_name="helpitem",
            name="subject",
            field=models.CharField(max_length=255, verbose_name="Subject"),
        ),
        migrations.AlterField(
            model_name="helpitem",
            name="user_type",
            field=models.CharField(
                choices=[("client", "Client"), ("seller", "Seller")],
                default="client",
                max_length=20,
                verbose_name="User type",
            ),
        ),
        migrations.AlterField(
            model_name="labelcreatefail",
            name="error",
            field=models.TextField(verbose_name="Error"),
        ),
        migrations.AlterField(
            model_name="labelcreatefail",
            name="notes",
            field=models.TextField(verbose_name="Notes"),
        ),
        migrations.AlterField(
            model_name="labelcreatefail",
            name="order_item",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="label_create_fail",
                to="order.orderitem",
                verbose_name="Order item",
            ),
        ),
        migrations.AlterField(
            model_name="refundrequest",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, verbose_name="Created"),
        ),
        migrations.AlterField(
            model_name="refundrequest",
            name="order_item",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="refund_requests",
                to="order.orderitem",
                verbose_name="Order item",
            ),
        ),
        migrations.AlterField(
            model_name="refundrequest",
            name="reason",
            field=models.TextField(verbose_name="Reason"),
        ),
        migrations.AlterField(
            model_name="refundrequest",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("approved", "Approved"),
                    ("rejected", "Rejected"),
                ],
                default="pending",
                max_length=20,
                verbose_name="Status",
            ),
        ),
        migrations.AlterField(
            model_name="supportcase",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, verbose_name="Created"),
        ),
        migrations.AlterField(
            model_name="supportcase",
            name="message",
            field=models.TextField(verbose_name="Message"),
        ),
        migrations.AlterField(
            model_name="supportcase",
            name="resolved_at",
            field=models.DateTimeField(auto_now=True, verbose_name="Resolved"),
        ),
        migrations.AlterField(
            model_name="supportcase",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("resolved", "Resolved"),
                    ("closed", "Closed"),
                ],
                default="pending",
                max_length=20,
                verbose_name="Status",
            ),
        ),
        migrations.AlterField(
            model_name="supportcase",
            name="subject",
            field=models.CharField(max_length=255, verbose_name="Subject"),
        ),
        migrations.AlterField(
            model_name="supportcase",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
                verbose_name="User",
            ),
        ),
        migrations.AlterField(
            model_name="supportcasemessage",
            name="case",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="messages",
                to="administration.supportcase",
                verbose_name="Case",
            ),
        ),
        migrations.AlterField(
            model_name="supportcasemessage",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, verbose_name="Created"),
        ),
        migrations.AlterField(
            model_name="supportcasemessage",
            name="message",
            field=models.TextField(verbose_name="Message"),
        ),
        migrations.AlterField(
            model_name="supportcasemessage",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
                verbose_name="User",
            ),
        ),
    ]
