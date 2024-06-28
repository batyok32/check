from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Order, OrderItem, PickupOrder, PickupOrderStateChangeHistory
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.core.mail import send_mass_mail
from django.core.mail import EmailMultiAlternatives
from .easyship import buy_label, buy_label_for_wholestore, get_shipping_status
from django.utils.timezone import now
from datetime import timedelta
from users.models import SellerTransaction
from weasyprint import HTML, CSS
import os

@shared_task
def send_order_details_to_client(order_id):
    order = get_object_or_404(Order.objects.all(), id=order_id)
    total_amount = order.total_shipping_price + order.total_price
    formatted_total_amount = "${:,.2f}".format(total_amount)  # Format as currency
    email_body = render_to_string("order/order_confirmation_email.html", {"order": order, "formatted_total_amount": formatted_total_amount})
    
    # Create and send the email
    email = EmailMessage(
        subject=f'Your Order Confirmation - {order_id}',
        body=email_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[order.customer.email]  # Send to the customer's email
    )
    email.content_subtype = 'html'  # Set the email content type to HTML
    email.send()

@shared_task
def send_order_details_to_seller(order_id):
    orderitem = get_object_or_404(OrderItem.objects.all(), id=order_id)
    email_body = render_to_string("order/order_seller_confirmation_email.html", {"orderitem": orderitem})
    
    # Create and send the email
    email = EmailMessage(
        subject=f'Order placed - {order_id}',
        body=email_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[orderitem.seller.user.email]  # Send to the customer's email
    )
    email.content_subtype = 'html'  # Set the email content type to HTML
    email.send()

@shared_task
def send_orders_details_to_sellers(order_id):
    order_items = OrderItem.objects.filter(order__id=order_id)

    for orderitem in order_items:
        subject = f'Order placed - {orderitem.id}'
        email_body = render_to_string("order/order_seller_confirmation_email.html", {"orderitem": orderitem})
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [orderitem.seller.user.email]
        
        email = EmailMessage(
            subject=subject,
            body=email_body,
            from_email=from_email,
            to=to  # Send to the customer's email
        )
        email.content_subtype = 'html'  # Set the email content type to HTML
        email.send()
    # send_mass_mail(tuple(email_messages), fail_silently=False)
        
@shared_task
def create_label_and_send_to_mail(order_item_id):
    order_item = OrderItem.objects.select_related('seller').get(id=order_item_id)
    order_item.labels_state="PENDING"
    order_item.save()
    
    errors = False

    for _ in range(order_item.quantity):
        if not errors:
            response = buy_label(order_item_id=order_item_id)
            if response == "Error":
                order_item.labels_state = "ERROR"
                order_item.save()
                errors=True
                return
        
    if not errors:
        order_item.labels_state = "GENERATED"
        order_item.labels_is_created=True
        order_item.save()

        subject = f'Labels are ready'
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [order_item.seller.user.email]
        
        email = EmailMessage(
            subject=subject,
            body=f"Hello dear seller, labels for order item #{order_item.id} are ready. Thank you for being with us.",
            from_email=from_email,
            to=to  # Send to the customer's email
        )
        email.send()


@shared_task
def create_labels_for_yuusell_boxes_and_send_to_mail(order_item_id):
    order_item = OrderItem.objects.select_related('seller').prefetch_related('boxes').get(id=order_item_id)
    order_item.labels_state="PENDING"
    order_item.save()
    
    errors = False

    for box in order_item.boxes.all():
        if not errors:
            response = buy_label_for_wholestore(order_item_id=order_item_id, box_id=box.id)
            if response == "Error":
                order_item.labels_state = "ERROR"
                order_item.save()
                errors=True
                return
        
    if not errors:
        order_item.labels_state = "GENERATED"
        order_item.labels_is_created=True
        order_item.save()

        subject = f'Labels are ready'
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [order_item.seller.user.email]
        
        email = EmailMessage(
            subject=subject,
            body=f"Hello dear seller, labels for order item #{order_item.id} are ready. Thank you for being with us.",
            from_email=from_email,
            to=to  # Send to the customer's email
        )
        email.send()


@shared_task
def tracking_shipped_packages():
    order_items = OrderItem.objects.filter(status="SHIPPED").prefetch_related("labels")
    print("SHIPPED ORDER ITEMS", order_items)
    for order_item in order_items:
        print("SHipped ORDER ITEM", order_item)
        not_delivered_exist = False
        for label in order_item.labels.all():
            try:
                delivery_state = get_shipping_status(label.shipment_id)
                if delivery_state:
                    if delivery_state == "delivered":
                        label.label_state = "delivered"
                        label.save()
                    else:
                        not_delivered_exist = True
            except Exception as e:
                print(f"Problem with delivery state check for label {label.id}: {e}")

        if not not_delivered_exist:
            order_item.status = "DELIVERED"
            order_item.save()

        # not_created pending info_received in_transit_to_customer out_for_delivery delivered failed_attempt exception expired lost_by_courier returned_to_shipper
            
@shared_task
def track_delivered_packages_and_unhold_money():
    one_week_ago = now() - timedelta(weeks=1)
    # one_minute_ago = now() - timedelta(minutes=1)

    print("UNHOLD MONEY THAT ARE LESS THAN A WEEK", one_week_ago)
    order_items = OrderItem.objects.filter(
        closed=False,
        status="DELIVERED",
        delivered_time__lte=one_week_ago
    )
    print("ORDER ITEMS TO UNHOLD", order_items)
    for order_item in order_items:
        SellerTransaction.objects.create(
            seller=order_item.seller,
            transaction_type="DR",
            amount=order_item.without_app_fee,
            reference_id=order_item.id,
            description=f"Order money is available: {order_item.id}",
            variation="UNHOLD_MONEY",
            closing_balance=order_item.seller.on_hold_balance + order_item.seller.available_balance
        )
        print("SELLER TRANSCATION CREATED")
        order_item.seller.on_hold_balance -= order_item.without_app_fee
        order_item.seller.available_balance += order_item.without_app_fee
        order_item.seller.save()
        print("SELLER MONEY ARE SET")
        order_item.closed=True
        order_item.save()
        print("ORDER ITEM IS CLOSED TOO")




@shared_task
def send_mails_when_pickup_scheduled(pickup_id):
    from_email = settings.DEFAULT_FROM_EMAIL
    try:
        # Ensure the pickup object exists and is fetched properly
        pickup = PickupOrder.objects.select_related('orderitem__seller__user').get(id=pickup_id)
    except PickupOrder.DoesNotExist:
        # Log an error message or handle the missing pickup order appropriately
        print(f"No pickup order found with ID: {pickup_id}")
        return

    # Preparing the email to the seller
    seller_email = pickup.orderitem.seller.user.email
    subject = 'Pickup is scheduled'
    body = f"This is confirmation that you scheduled pickup on {pickup.date}. For any further changes please contact us."
    
    send_email(subject, body, from_email, [seller_email])

    # Generating the PDF
    pdf_response = generate_pickup_pdf(pickup)
    body = "This is notice that pickup is scheduled."
    # Preparing the email to the admins
    send_email(subject, body, from_email, settings.PICKUP_MESSAGE_ADMINS, attachments=[pdf_response])

def generate_pickup_pdf(pickup):
    html = render_to_string("order/pickup_detail_pdf.html", {"pickup": pickup})
    css_file_path = os.path.join(settings.STATIC_ROOT, 'order/css/global.css')
    
    if not os.path.exists(css_file_path):
        raise FileNotFoundError(f"CSS file for PDF generation not found at {css_file_path}")

    pdf_file = HTML(string=html).write_pdf(stylesheets=[CSS(css_file_path)])
    
    # Returning the PDF file in memory content instead of response object
    return pdf_file

def send_email(subject, body, from_email, recipient_list, attachments=None):
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=recipient_list
    )

    if attachments:
        for attachment in attachments:
            email.attach(f'pickup_details.pdf', attachment, 'application/pdf')

    email.send()