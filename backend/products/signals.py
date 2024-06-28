from .models import (
    Category, Product, ProductFile
)
from django.db import models
from django.dispatch import receiver
from django.core.files.storage import default_storage


@receiver(models.signals.post_delete, sender=Category)
def category_image_delete_on_delete(sender, instance, **kwargs):
   
    if instance.image:
        try:
            image_path = instance.image.path
            if default_storage.exists(image_path):
                default_storage.delete(image_path)
        except NotImplementedError:
            # If path method is not supported, delete the file using the storage backend's delete method
            instance.image.delete(save=False)

@receiver(models.signals.post_delete, sender=Product)
def product_image_delete_on_delete(sender, instance, **kwargs):
   
    if instance.image:
        try:
            image_path = instance.image.path
            if default_storage.exists(image_path):
                default_storage.delete(image_path)
        except NotImplementedError:
            # If path method is not supported, delete the file using the storage backend's delete method
            instance.image.delete(save=False)


@receiver(models.signals.post_delete, sender=ProductFile)
def product_files_image_delete_on_delete(sender, instance, **kwargs):
   
    if instance.file:
        try:
            image_path = instance.file.path
            if default_storage.exists(image_path):
                default_storage.delete(image_path)
        except NotImplementedError:
            # If path method is not supported, delete the file using the storage backend's delete method
            instance.file.delete(save=False)

# @receiver(models.signals.pre_save, sender=Category)
# def category_image_delete_on_change(sender, instance, **kwargs):
#     print("PRE SAVE")

#     if not instance.pk:
#         return False

#     try:
#         category = sender.objects.get(pk=instance.pk)
#         old_file = category.image
#     except sender.DoesNotExist:
#         print("DOESNOT EXIST")
#         return False

#     new_file = instance.image
#     if  old_file != new_file:
#         print("NOT SAME OLD AND NEW")
#         if default_storage.exists(old_file.name):
#             print("DELETE OLD ONE")
#             default_storage.delete(old_file.name)

