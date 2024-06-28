from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings
from .models import LabelCreateFail, SupportCase, SupportCaseMessage
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.core.mail import send_mass_mail
from django.core.mail import EmailMultiAlternatives

@shared_task
def send_label_fail_to_support(id):
    label = get_object_or_404(LabelCreateFail.objects.all(), id=id)    
    # Create and send the email
    email = EmailMessage(
        subject=f'Label create fail - {label.notes}',
        body=label.error,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.DEFAULT_FROM_EMAIL]  # Send to the customer's email
    )
    email.send()


@shared_task
def send_support_case_open(id):
    support_request = SupportCase.objects.get(id=id)
    # Create and send the email
    email = EmailMessage(
        subject=f'Support Request Confirmation',
        body=f"Your support request with subject '{support_request.subject}' has been received.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[support_request.user.email]  # Send to the customer's email
    )
    email.send()

    email = EmailMessage(
        subject=f'{support_request.subject}',
        body=f"New support request with subject '{support_request.subject}' has been recieved. Please answer on it.\n\n\n{support_request.message}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=settings.CASE_MESSAGE_ADMINS  # Send to the customer's email
    )
    email.send()


@shared_task
def send_main_on_support_message(id):
    support_request = SupportCaseMessage.objects.get(id=id)

    if support_request.user_role == "Admin":
        email = EmailMessage(
            subject=f'Message for case {support_request.case.id}',
            body=f"{support_request.message} \n\nLink to case: yuusell.com/account/cases/{support_request.case.id}/",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[support_request.case.user.email]  # Send to the customer's email
        )
    else:
        # Send message to admin
        email = EmailMessage(
            subject=f'Question from user: {support_request.email}',
            body=f"{support_request.message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=settings.CASE_MESSAGE_ADMINS  # Send to the customer's email
        )
    email.send()
   

   

