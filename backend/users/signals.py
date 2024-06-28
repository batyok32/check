from django.db.models.signals import post_save
from django.dispatch import receiver
from .tasks import send_email_with_pdf, send_email_to_support_about_withdraw, send_email_to_seller_about_withdraw
from .models import WithDrawRequest, SellerTransaction


# @receiver(post_save, sender=SellerProfile)
# def send_seller_profile_pdf(sender, instance, created, **kwargs):
#     if created:
#         send_email_with_pdf.delay(instance.id)

# Delete card detail in square whenever card deletes
@receiver(post_save, sender=WithDrawRequest)
def handle_withdraw_request(sender, instance, created, **kwargs):
    if created:
        SellerTransaction.objects.create(
            seller=instance.seller,
            transaction_type="CR",
            amount=instance.amount+instance.fee_amount,
            reference_id=instance.id,
            description=f"Withdraw requested",
            variation="WITHDRAW",
            closing_balance=instance.seller.on_hold_balance + instance.seller.available_balance -(instance.amount+instance.fee_amount)
        )
        instance.seller.available_balance -= instance.amount+instance.fee_amount
        instance.seller.save()
        send_email_to_seller_about_withdraw.delay(instance.id)
        send_email_to_support_about_withdraw.delay(instance.id)

