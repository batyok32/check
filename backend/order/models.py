from typing import Iterable
from django.db import models
from products.models import Product
from django.conf import settings
from users.models import SellerProfile, SellerTransaction, ShippingTransaction
from django.utils import timezone
import uuid

from django.utils.translation import gettext_lazy as _


# Create your models here.
class Order(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False, verbose_name=_("UUID"))
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name=_("Customer"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated"))
   
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_("Total price"))
    total_shipping_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_("Total shipping"))
    total_tax_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_("Total tax"))
    total_item_amount = models.IntegerField(verbose_name=_("Total items"))
    
    card_id = models.CharField(max_length=255, null=True, verbose_name=_("Card id"))
    card_type = models.CharField(max_length=255, null=True, verbose_name=_("Card type"))
    card_brand = models.CharField(max_length=255, null=True, default="VISA", verbose_name=_("Card brand"))
    card_last_4 =  models.CharField(max_length=255, null=True, verbose_name=_("Card last 4 digits"))
    square_payment_id = models.CharField(max_length=255, null=True, verbose_name=_("Square payment id"))

    destination_full_name = models.CharField(max_length=255, verbose_name=_("Destination - full name"))
    destination_address_line1 = models.CharField(max_length=255, verbose_name=_("Destination - address line"))
    destination_address_line2 = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Destination - address line 2"))
    destination_city = models.CharField(max_length=100, verbose_name=_("Destination - city"))
    destination_state = models.CharField(max_length=100, verbose_name=_("Destination - state"))
    destination_zip_code = models.CharField(max_length=20, verbose_name=_("Destination - zip code"))
    destination_country = models.CharField(max_length=100, verbose_name=_("Destination - country"))
    destination_phone_number = models.CharField(max_length=20, verbose_name=_("Destination - phone number"))

    def __str__(self):
        return str(self.id)
    
    class Meta:
        verbose_name=_("Order")
        verbose_name_plural=_("Orders")

class OrderStatusChoices(models.TextChoices):
    BUYER_PAID = 'BUYER_PAID', 'Buyer Paid'
    SHIPPED = 'SHIPPED', 'Shipped'
    IN_WHOLESTORE = 'IN_WHOLESTORE', 'In wholestore'  
    DELIVERED = 'DELIVERED', 'Delivered'
    CANCEL_REQUESTED = "CANCEL_REQUESTED", "Cancel requested"
    CANCELLED = 'CANCELLED', 'Cancelled'
    RETURNED_BACK = 'RETURNED_BACK', 'Returned back'
    FAILED_ATTEMPT = "FAILED_ATTEMPT", "Failed attempt"
        
class OrderItem(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False, verbose_name=_("UUID"))

    class ShippingChoices(models.TextChoices):
        EASYSHIP = 'EASYSHIP', 'Easyship'
        YUUSELL = 'YUUSELL', 'YuuSell'
        
    class LabelsState(models.TextChoices):
        NOT_STARTED = 'NOT_STARTED', 'Not started'
        PENDING = 'PENDING', 'Pending'
        ERROR = 'ERROR', 'Error'
        GENERATED = 'GENERATED', 'Generated'
        PRINTED = 'PRINTED', 'Printed'
        
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name=_("Order"))
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, verbose_name=_("Product"))
    seller = models.ForeignKey(SellerProfile, on_delete=models.SET_NULL, verbose_name=_("Seller"), related_name='orderitems', null=True)
    
    quantity = models.PositiveIntegerField(default=1, verbose_name=_("Quantity"))
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Price"))
    total_price = models.DecimalField(
        _("Total price"), max_digits=10, decimal_places=2, blank=True
    )
    status = models.CharField(max_length=50, verbose_name=_("Status"), default=OrderStatusChoices.BUYER_PAID, choices=OrderStatusChoices.choices,)  # e.g., 'pending', 'shipped', 'delivered'

    shipping_courier_id = models.CharField(max_length=255, verbose_name=_("Courier id"))
    shipping_courier_name = models.CharField(max_length=255, verbose_name=_("Courier name"))
    shipping_courier_type = models.CharField(max_length=50, verbose_name=_("Courier type"), default=ShippingChoices.EASYSHIP, choices=ShippingChoices.choices,)
    shipping_price = models.DecimalField(
        _("Shipping total"), max_digits=10, decimal_places=2, blank=True
    )

    tax_rate = models.DecimalField(
        _("Tax rate"), max_digits=10, decimal_places=2, blank=True
    )
    total_tax_price = models.DecimalField(
        _("Total of taxes"), max_digits=10, decimal_places=2, blank=True
    )

    app_fee = models.DecimalField(
        _("App Fee (10%)"), max_digits=10, decimal_places=2, blank=True
    )
    without_app_fee = models.DecimalField(
        _("Without app fee"), max_digits=10, decimal_places=2, blank=True
    )
    variations=models.TextField(blank=True, null=True, verbose_name=_("Variations"))
    product_name = models.CharField(max_length=255, verbose_name=_("Product name"))

    bulk = models.BooleanField(default=True, verbose_name=_("Is bulk"))

    bought_in_containers = models.BooleanField(default=False, verbose_name=_("Bought in containers"))
    items_inside_container = models.PositiveIntegerField(default=1, verbose_name=_("Quantity inside container"))
    container_name = models.CharField(max_length=255, blank=True, null=True)
    container_length = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container length"), blank=True, null=True) 
    container_height = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container height"), blank=True, null=True) 
    container_width = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container width"), blank=True, null=True) 
    container_weight = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container weight"), blank=True, null=True) 
    
    origin_address_line1 = models.CharField(max_length=255, verbose_name=_("Origin - address 1"))
    origin_address_line2 = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Origin - address 2"))
    origin_city = models.CharField(max_length=100, verbose_name=_("Origin - city"))
    origin_state = models.CharField(max_length=100, verbose_name=_("Origin - state"))
    origin_zip_code = models.CharField(max_length=20, verbose_name=_("Origin - zip code"))
    origin_country = models.CharField(max_length=100, verbose_name=_("Origin - country"))
    
    order_notes = models.TextField(null=True, blank=True, verbose_name=_("Order notes"))

    released_time = models.DateTimeField(null=True, blank=True, verbose_name=_("Released time"))
    delivered_time = models.DateTimeField(null=True, blank=True, verbose_name=_("Delivered time"))

    labels_is_created = models.BooleanField(default=False, verbose_name=_("Is label created"))
    labels_state= models.CharField(max_length=50, default=LabelsState.NOT_STARTED, verbose_name=_("Label state"), choices=LabelsState.choices,)  # e.g., 'pending', 'shipped', 'delivered'

    closed = models.BooleanField(default=False, verbose_name=_("Is closed"))
    def __str__(self):
        return str(self.id)
    
    class Meta:
        verbose_name=_("Order item")
        verbose_name_plural=_("Order items")

    def save(self, *args, **kwargs):
        super(OrderItem, self).save(*args, **kwargs)


class OrderItemStatusChangeHistory(models.Model):
    order_item = models.ForeignKey(OrderItem, verbose_name=_("Order item"), on_delete=models.CASCADE, related_name='statushistories')
    before_state= models.CharField(max_length=50, verbose_name=_("Before state"), default=OrderStatusChoices.BUYER_PAID, choices=OrderStatusChoices.choices,) 
    finished_state = models.CharField(max_length=50, verbose_name=_("Finished state"), default=OrderStatusChoices.BUYER_PAID, choices=OrderStatusChoices.choices,) 
    change_time = models.DateTimeField(auto_now_add=True, verbose_name=_("Changed time"))

    class Meta:
        verbose_name=_("Order item status change history")
        verbose_name_plural=_("Order item status change histories")


class OrderItemBox(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='boxes', verbose_name=_("Is label created"))
    length = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Length")) 
    width = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Width")) 
    weight = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Weight")) 
    height = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Height")) 
    dimension_unit = models.CharField(max_length=255, verbose_name=_("Dimension unit"))
    weight_unit = models.CharField(max_length=255, verbose_name=_("Weight unit"))
    items_amount = models.IntegerField(default=1, verbose_name=_("Total items"))

    class Meta:
        verbose_name=_("Box")
        verbose_name_plural=_("Boxes")

class ShippingLabel(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='labels', verbose_name=_("Order item"))
    shipment_id = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Shipment id"))
    courier_id = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Courier id"))
    courier_name = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Courier name"))
    label_state = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Label state"))
    shipping_document = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Shipping document"))
    shipping_document_format = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Document format"))
    shipping_document_size = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Document size"))
    tracking_page_url = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Tracking page url"))
    tracking = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Tracking"))
    box = models.OneToOneField(OrderItemBox, null=True, blank=True, on_delete=models.SET_NULL, related_name='label', verbose_name=_("Box"))

    class Meta:
        verbose_name=_("Label")
        verbose_name_plural=_("Labels")

class ShippingLabelStateHistory(models.Model):
    label = models.ForeignKey(ShippingLabel, on_delete=models.CASCADE, related_name='statushistories', verbose_name=_("Label"))
    before_state= models.CharField(max_length=50, verbose_name=_("Before state")) 
    finished_state = models.CharField(max_length=50, verbose_name=_("End state")) 
    change_time = models.DateTimeField(auto_now_add=True, verbose_name=_("Change time"))

    class Meta:
        verbose_name=_("Label history")
        verbose_name_plural=_("Label histories")
   
class Wholestore(models.Model):
    name = models.CharField(max_length=100, verbose_name=_("Name"))
    address = models.CharField(max_length=255, verbose_name=_("Address"))
    city = models.CharField(max_length=100, verbose_name=_("City"))
    state = models.CharField(max_length=100, verbose_name=_("State"))
    country = models.CharField(max_length=100, verbose_name=_("Country"))
    zip_code = models.CharField(max_length=20, verbose_name=_("Zip code"))
    phone_number = models.CharField(max_length=20, verbose_name=_("Phone number"))
    latitude = models.FloatField(verbose_name=_("Latitude"))
    longitude = models.FloatField(verbose_name=_("Longtitude"))
    person_name = models.CharField(max_length=255, verbose_name=_("Person name"))

    def __str__(self):
        return self.name


    class Meta:
        verbose_name=_("Wholestore")
        verbose_name_plural=_("Wholestores")



class StateTax(models.Model):
    from_state_name = models.TextField(_("Origin states: (only state codes with ',' split)"))
    to_state_name = models.TextField(_("Delivery states: (only state codes with ',' split)"))
    tax_percent = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Tax %"))
    
    def __str__(self) :
        return f"{self.from_state_name} - {self.to_state_name}"
    
    class Meta:
        verbose_name=_('Tax')
        verbose_name_plural = _("US States Taxes")
    
class AppFeeClaims(models.Model):
    orderitem = models.ForeignKey(OrderItem, verbose_name=_("Order item"), on_delete=models.SET_NULL, related_name='app_fees', null=True)
    seller = models.ForeignKey(SellerProfile, verbose_name=_("Seller"), on_delete=models.SET_NULL, related_name='app_fees', null=True)
    amount=  models.DecimalField(
        _("Amount"), max_digits=10, decimal_places=2, blank=True
    )

    def __str__(self) :
        return f"{self.amount}"
    
    class Meta:
        verbose_name=_('App Fee Claim')
        verbose_name_plural = _("App Fee Claims")



class PickupStates(models.TextChoices):
    SCHEDULED = 'SCHEDULED', _('Scheduled')
    FAILED = 'FAILED', _('Failed')
    # CANCELLED = 'CANCELLED', _('Cancelled')
    SUCCESS = 'SUCCESS', _('Success')
        

class PickupOrder(models.Model):
    # seller = models.ForeignKey(SellerProfile, on_delete=models.SET_NULL, verbose_name=_("Seller"), related_name='orderitems', null=True)
    orderitem = models.OneToOneField(OrderItem, verbose_name=_("Order item"), on_delete=models.CASCADE, related_name='pickup')
    date = models.DateField(null=True, blank=True, verbose_name=_("Date of pickup"))
    state = models.CharField(max_length=50, default=PickupStates.SCHEDULED, verbose_name=_("Pickup state"), choices=PickupStates.choices,)  # e.g., 'pending', 'shipped', 'delivered'
    # notes = models.TextField(null=True, blank=True, verbose_name=_("Cancellation Reason or Notes"))

    wholestore_id = models.CharField(max_length=255, verbose_name=_("ID"), blank=True, null=True)
    wholestore_name = models.CharField(max_length=255, verbose_name=_("Name"), blank=True, null=True)
    wholestore_address = models.CharField(max_length=255, verbose_name=_("Address"), blank=True, null=True)
    wholestore_city = models.CharField(max_length=100, verbose_name=_("City"), blank=True, null=True)
    wholestore_state = models.CharField(max_length=100, verbose_name=_("State"), blank=True, null=True)
    wholestore_country = models.CharField(max_length=100, verbose_name=_("Country"), blank=True, null=True)
    wholestore_zip_code = models.CharField(max_length=20, verbose_name=_("Zip code"), blank=True, null=True)
    
    class Meta:
        verbose_name=_("Order pickup")
        verbose_name_plural=_("Order pickups")
   
    def __str__(self):
        return f"{self.orderitem} / {self.id}"

    

class PickupOrderStateChangeHistory(models.Model):
    pickup = models.ForeignKey(PickupOrder, on_delete=models.CASCADE, related_name='statushistories', verbose_name=_("Pickup"))
    before_state= models.CharField(max_length=50, verbose_name=_("Before state")) 
    finished_state = models.CharField(max_length=50, verbose_name=_("End state")) 
    change_time = models.DateTimeField(auto_now_add=True, verbose_name=_("Change time"))
    # notes = models.TextField(null=True, blank=True, verbose_name=_("Order state change note"))

    class Meta:
        verbose_name=_("Pickup history")
        verbose_name_plural=_("Pickup histories")
        ordering=['-change_time']
   
    def __str__(self):
        return f"{self.finished_state}"