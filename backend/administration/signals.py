from .models import (
    HelpCategory, HelpItem, SupportCaseMessage
)
from django.db import models
from django.dispatch import receiver
from django.core.files.storage import default_storage
from .tasks import send_main_on_support_message

@receiver(models.signals.post_delete, sender=HelpCategory)
def category_image_delete_on_delete(sender, instance, **kwargs):
   
    if instance.image:
        image_path = instance.image.path
        if default_storage.exists(image_path):
            default_storage.delete(image_path)

@receiver(models.signals.post_delete, sender=HelpItem)
def product_image_delete_on_delete(sender, instance, **kwargs):
   
    if instance.image:
        image_path = instance.image.path
        if default_storage.exists(image_path):
            default_storage.delete(image_path)



@receiver(models.signals.post_save, sender=SupportCaseMessage)
def handle_pickup_order_post_save(sender, instance, created, **kwargs):
    if created:
        send_main_on_support_message.delay(instance.id)
        

