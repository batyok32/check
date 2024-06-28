from typing import Iterable
from django.db import models
from order.models import OrderItem
from users.models import UserAccount, SellerProfile
from django.utils import timezone
from django_ckeditor_5.fields import CKEditor5Field
from django.utils.translation import gettext_lazy as _

# Create your models here.
class RefundRequest(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='refund_requests', verbose_name=_("Order item"))
    reason = models.TextField(verbose_name=_("Reason"))
    status = models.CharField(max_length=20, verbose_name=_("Status"), choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return _('Refund request for %(order_item)s - Status: %(status)s') % {
            'order_item': self.order_item,
            'status': self.status
        }
    
    class Meta:
        verbose_name=_("Refund request")
        verbose_name_plural=_("Refund requests")

class AppReview(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='app_reviews', verbose_name=_("User"))
    rating = models.IntegerField(verbose_name=_("Rating"))
    comment = models.TextField(verbose_name=_("Comment"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))

    def __str__(self):
        return _('Review by %(user)s - Rating: %(rating)s') % {
            'user': self.user,
            'rating': self.rating
        }    
    class Meta:
        verbose_name=_("App review")
        verbose_name_plural=_("App reviews")

class LabelCreateFail(models.Model):
    error = models.TextField(verbose_name=_("Error"))
    order_item = models.ForeignKey(OrderItem, on_delete=models.SET_NULL, verbose_name=_("Order item"), related_name='label_create_fail', null=True, blank=True)
    notes= models.TextField(verbose_name=_("Notes"))

    def save(self, *args, **kwargs):
        super(LabelCreateFail, self).save(*args, **kwargs)
        from .tasks import send_label_fail_to_support
        send_label_fail_to_support.delay(self.id)

    class Meta:
        verbose_name=_("Label create fail")
        verbose_name_plural=_("Label create fails")

class SupportCase(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    user = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_("User"))
    email = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Email"))
    subject = models.CharField(max_length=255, verbose_name=_("Subject"))
    message = models.TextField(verbose_name=_("Message"))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, verbose_name=_("Status"), default='pending')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))
    resolved_at = models.DateTimeField(auto_now=True, verbose_name=_("Resolved"))

    class Meta:
        verbose_name = _('Support case')
        verbose_name_plural = _('Support cases')
    

    def save(self, *args, **kwargs):
        if not self.email and self.user:
            self.email = self.user.email
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subject} - {self.email}"
    
class SupportCaseMessage(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_("User"))
    email = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Email"))
    case = models.ForeignKey(SupportCase, on_delete=models.CASCADE, related_name='messages', verbose_name=_("Case"))
    message = models.TextField(verbose_name=_("Message"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))
    
    def __str__(self):
        user_role = _("Admin") if self.user and self.user.is_staff else _("Client")
        return f"{user_role}: {self.message[:50]}"

    @property
    def user_role(self):
        return "Admin" if self.user and self.user.is_staff else "Client"

    def save(self, *args, **kwargs):
        """
        Override the save method to update the status and resolved_at field of the associated SupportCase.
        """
        if not self.email and self.user:
            self.email = self.user.email
        
        super().save(*args, **kwargs)
        support_case = self.case

        if self.user.is_staff:
            support_case.status = 'resolved'
            support_case.resolved_at = timezone.now()
        else:
            support_case.status = 'pending'
            support_case.resolved_at = None  # Clear resolved_at if set by a previous admin message

        support_case.save() 

    class Meta:
        verbose_name=_('Support case message')
        verbose_name_plural=_('Support case messages')

CATEGORY_CHOICES = (
    ('client', 'Client'),
    ('seller', 'Seller'),
)

class HelpCategory(models.Model):
    user_type = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='client', verbose_name=_("User type"))
    title = models.CharField(max_length=255, verbose_name=_("Title"))
    image = models.ImageField(
        upload_to="help-categories/",
        blank=True,
        default="product_default.png",
        verbose_name=_("Image")
    )    

    def __str__(self):
        return self.title
    

    def delete_old_image(self):
        if self.pk:
            try:
                old_image = HelpCategory.objects.get(pk=self.pk).image
                if old_image and old_image != self.image and old_image.name != "product_default.png":
                    old_image.delete(save=False)
            except HelpCategory.DoesNotExist:
                pass

    def save(self, *args, **kwargs):
        self.delete_old_image()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name=_("Help category")
        verbose_name_plural=_("Help categories")


class HelpItem(models.Model):
    category = models.ForeignKey(HelpCategory, on_delete=models.CASCADE, related_name='helpitems', verbose_name=_("Category"))
    user_type = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='client',verbose_name=_("User type") )
    subject = models.CharField(max_length=255, verbose_name=_("Subject"))
    content = CKEditor5Field(verbose_name=_("Text"), config_name='extends', )
    short_description = models.CharField(max_length=255, verbose_name=_("Short description"))
    image = models.ImageField(
        upload_to="help-items/",
        blank=True,
        default="product_default.png",
        verbose_name=_("Image")
    ) 
    def __str__(self):
        return self.subject
    
    def delete_old_image(self):
        if self.pk:
            try:
                old_image = HelpItem.objects.get(pk=self.pk).image
                if old_image and old_image != self.image and old_image.name != "product_default.png":
                    old_image.delete(save=False)
            except HelpItem.DoesNotExist:
                pass

    def save(self, *args, **kwargs):
        self.delete_old_image()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name=_("Help")
        verbose_name_plural=_("Helps")