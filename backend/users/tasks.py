from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings
from .models import SellerProfile, WithDrawRequest
from django.template.loader import render_to_string
from weasyprint import HTML, CSS

def createPDF(seller):
    html = render_to_string("users/seller/pdf.html", {"seller": seller})
    return HTML(string=html, base_url="").write_pdf(
        stylesheets=[CSS("users/static/users/css/pdf.css")],
    )

@shared_task
def send_email_with_pdf(seller_id):
    seller = SellerProfile.objects.get(id=seller_id)
    
    # Get the current site domain
    domain = settings.SITE_DOMAIN

    admin_link = f'https://{domain}/admin/users/useraccount/{seller.user.id}/change/'  # Replace `your_app` with the actual app name

    email_content = f'''
    A new seller has been created. 
    Please find the attached profile.
    
    You can view and edit the seller's profile using the following link:
    {admin_link}
    '''

    email = EmailMessage(
        'New Seller Created',
        email_content,
        settings.DEFAULT_FROM_EMAIL,
        settings.ADMIN_EMAILS,  # List of admin emails
    )
    pdf = createPDF(seller)
    email.attach(f'seller_{seller.id}.pdf', pdf, 'application/pdf')  # Attach generated PDF
    email.send()


@shared_task
def send_email_to_seller_about_withdraw(withdraw_id):
    # seller = SellerProfile.objects.get(id=seller_id)
    withdraw_request = WithDrawRequest.objects.get(id=withdraw_id)
    email = EmailMessage(
        f'Withdraw requested: {withdraw_request.amount+withdraw_request.fee_amount}',
        'Hello dear seller, this is confirmation email, that you have requested withdraw for your available balance.',
        settings.DEFAULT_FROM_EMAIL,
        [withdraw_request.seller.user.email],  # List of admin emails
    )
    email.send()


@shared_task
def send_email_to_support_about_withdraw(withdraw_id):
    withdraw_request = WithDrawRequest.objects.get(id=withdraw_id)
    email = EmailMessage(
        f'Withdraw requested: {withdraw_request.amount+withdraw_request.fee_amount}',
        f'New withdraw requested: #{withdraw_request.id}\nAmount:{withdraw_request.amount}\nApp Fee: {withdraw_request.fee_amount}',
        settings.DEFAULT_FROM_EMAIL,
        settings.ADMIN_EMAILS,  # List of admin emails
    )
    email.send()
