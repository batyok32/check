from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import OrderItem, OrderItemStatusChangeHistory, AppFeeClaims, ShippingLabel, ShippingLabelStateHistory, Order, PickupOrder, \
PickupOrderStateChangeHistory, Wholestore
from users.models import SellerTransaction, ShippingTransaction
from django.utils import timezone

from django.core.mail import EmailMessage
from django.conf import settings
from .easyship import get_nearest_wholestore, get_country_code

@receiver(pre_save, sender=OrderItem)
def handle_order_item_pre_save(sender, instance, **kwargs):
    if instance.pk:
        old_instance = OrderItem.objects.get(pk=instance.pk)
        if old_instance.status != instance.status:
            OrderItemStatusChangeHistory.objects.create(
                order_item=instance,
                before_state=old_instance.status,
                finished_state=instance.status,
            )
        if old_instance.status != "DELIVERED" and instance.status == "DELIVERED":
            instance.delivered_time = timezone.now()
            # try:
            #     # order = Order.objects.prefetch_related('customer').get(items__id=instance.order_item)
            #     email = EmailMessage(
            #         subject=f'Order item arrived: {old_instance.product_name}',
            #         body=f"Hello dear client, your order has been arrived. \n\nProduct Name:{old_instance.product_name}\nOrder id: {old_instance.order.uuid}",
            #         from_email=settings.DEFAULT_FROM_EMAIL,
            #         to=[old_instance.order.customer.email]  # Send to the customer's email
            #     )
            #     email.send()
            # except (Order.DoesNotExist, Exception) as e:
            #     # Handle email sending errors or order fetching errors
            #     print(f"Error sending email or fetching order: {e}")


@receiver(post_save, sender=OrderItem)
def handle_order_item_post_save(sender, instance, created, **kwargs):
    print("CREATED ORDER item",created)
    if created:
        print("SELLER TRANSACTION CREATE", instance)
        SellerTransaction.objects.create(
            seller=instance.seller,
            transaction_type="DR",
            amount=instance.without_app_fee,
            reference_id=instance.id,
            description=f"Item purchased",
            variation="ITEM_BOUGHT",
            closing_balance=instance.seller.on_hold_balance + instance.seller.available_balance + instance.without_app_fee
        )
        instance.seller.on_hold_balance += instance.without_app_fee
        instance.seller.save()

        AppFeeClaims.objects.create(
            seller = instance.seller,
            orderitem=instance,
            amount=instance.app_fee
        )
        
        print("SELLER IS SAVED")
        ShippingTransaction.objects.create(
            seller=instance.seller,
            order_id=instance.id,
            amount=instance.shipping_price,
            transaction_type="DR",
            courier_id=instance.shipping_courier_id,
            courier_name=instance.shipping_courier_name,
            description=f"Shipping transaction for order item #{instance.id}"
        )
        print("SHIPPING TRANSACTION CREATE")

# pre_save.connect(handle_order_item_pre_save, sender=OrderItem)
# post_save.connect(handle_order_item_post_save, sender=OrderItem)
        
@receiver(pre_save, sender=ShippingLabel)
def handle_order_label_pre_save(sender, instance, **kwargs):
    if instance.pk:
        old_instance = ShippingLabel.objects.get(pk=instance.pk)
        if old_instance.label_state != instance.label_state:
            ShippingLabelStateHistory.objects.create(
                label=instance,
                before_state=old_instance.label_state,
                finished_state=instance.label_state,
            )

            if instance.label_state=="delivered":
                try:
                    # print("DELIVERED LABEL")
                    order_item = OrderItem.objects.prefetch_related('order', "order__customer").get(id=instance.order_item.id)
                    # print("Order item for label delivered", order_item)
                    # order = Order.objects.prefetch_related('customer').get(items__id=instance.order_item)
                    email = EmailMessage(
                        subject=f'Package arrived: {order_item.product_name}',
                        body=f"Hello dear client, your package has been arrived. \n\nProduct Name:{order_item.product_name}\nOrder id: {order_item.order.uuid}",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=[order_item.order.customer.email]  # Send to the customer's email
                    )
                    # print("EMAIL SEND")
                    email.send()
                except (Order.DoesNotExist, Exception) as e:
                    # Handle email sending errors or order fetching errors
                    print(f"Error sending email or fetching order: {e}")

@receiver(pre_save, sender=PickupOrder)
def handle_pickup_order_pre_save(sender, instance, **kwargs):
    if instance.pk:
        old_instance = PickupOrder.objects.get(pk=instance.pk)
        if old_instance.state != instance.state or old_instance.date != instance.date:
            # notes = None
            # if instance.notes:
            #     notes = instance.notes 
            #     instance.notes = None
            
            PickupOrderStateChangeHistory.objects.create(
                pickup=instance,
                before_state=old_instance.state,
                finished_state=instance.state,
                # notes=notes
            )
            if instance.state == "SUCCESS":
                instance.orderitem.status = "SHIPPED"
                instance.orderitem.save()
    if not instance.wholestore_id:
        # Set nearest wholestore
        wholestore = get_nearest_wholestore(zip_code=instance.orderitem.origin_zip_code, country=get_country_code(instance.orderitem.origin_country))
        setwholestore = wholestore
        if not wholestore:
            setwholestore = Wholestore.objects.all()[0]

        instance.wholestore_id = setwholestore.id
        instance.wholestore_name = setwholestore.name
        instance.wholestore_address = setwholestore.address
        instance.wholestore_city = setwholestore.city
        instance.wholestore_state = setwholestore.state
        instance.wholestore_country = setwholestore.country
        instance.wholestore_zip_code = setwholestore.zip_code

@receiver(post_save, sender=PickupOrder)
def handle_pickup_order_post_save(sender, instance, created, **kwargs):
    if created:
        # notes = None
        # if instance.notes:
        #     notes = instance.notes 
        #     instance.notes = None

        PickupOrderStateChangeHistory.objects.create(
            pickup=instance,
            before_state=instance.state,
            finished_state=instance.state,
            # notes=notes
        )


