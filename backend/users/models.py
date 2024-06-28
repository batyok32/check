from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

from django.utils.translation import gettext_lazy as _

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        email=self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email=email,
            password=password,
            **kwargs
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255, verbose_name=_("First name"))
    last_name = models.CharField(max_length=255, verbose_name=_("Last name"))
    email = models.EmailField(
        unique=True,
        max_length=255,
         verbose_name=_("Email")
    )

    is_active = models.BooleanField(default=True, verbose_name=_("Is active"))
    is_staff = models.BooleanField(default=False, verbose_name=_("Is staff"))
    is_superuser = models.BooleanField(default=False, verbose_name=_("Is superuser"))
    is_seller = models.BooleanField(default=False, verbose_name=_("Is seller"))
    is_verified_seller = models.BooleanField(default=False, verbose_name=_("Is verified seller"))

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))
    updated_at = models.DateTimeField(_("Updated"), auto_now=True)

    square_customer_id = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Square customer id"))

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name=_('User')
        verbose_name_plural=_('Users')



class SellerProfile(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name='seller_profile', verbose_name=_("User"))
    store_name = models.CharField(max_length=255, verbose_name=_("Store name"))
    business_name = models.CharField(max_length=255, verbose_name=_("Business name"))
    business_type = models.CharField(max_length=100, verbose_name=_("Business type"))
    custom_business_type = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("Custom business type"))
    phone_number = models.CharField(max_length=20, unique=True, verbose_name=_("Phone number"))
    is_phone_verified = models.BooleanField(default=False, verbose_name=_("Is phone verified"))
    is_agreement_accepted = models.BooleanField(default=False, verbose_name=_("Is agreement accepted"))
    created = models.DateTimeField(_("Created"), auto_now_add=True)
    updated = models.DateTimeField(_("Updated"), auto_now=True)
    
    address_line1 = models.CharField(max_length=255, verbose_name=_("Address line 1"))
    address_line2 = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Address line 2"))
    city = models.CharField(max_length=100, verbose_name=_("City"))
    state = models.CharField(max_length=100, verbose_name=_("State"))
    zip_code = models.CharField(max_length=20, verbose_name=_("Zip code"))
    country = models.CharField(max_length=100, verbose_name=_("Country"))

    available_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_("Available balance"))
    on_hold_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name=_("On hold balance"))


    def __str__(self):
        return self.store_name

    def withdraw_balance(self, amount):
        if amount <= self.available_balance:
            SellerTransaction.objects.create(
                seller=self,
                transaction_type="CREDIT",
                amount=amount,
                description="Balance withdrawal"
            )
            self.available_balance -= amount
            self.save()
        else:
            raise ValueError("Insufficient balance")

    class Meta:
        verbose_name=_('Seller')
        verbose_name_plural = _("Sellers")


class SellerContactPerson(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='contact_people', verbose_name=_("Seller"))
    first_name = models.CharField(max_length=100, verbose_name=_("First name"))
    last_name = models.CharField(max_length=100, verbose_name=_("Last name"))
    citizenship_country = models.CharField(max_length=100, verbose_name=_("Citizenship"))
    birth_country = models.CharField(max_length=100, verbose_name=_("Birth country"))
    birth_date = models.DateField(verbose_name=_("Birth date"))  # Combining birthDay, birthMonth, birthYear
    residential_country = models.CharField(max_length=100, verbose_name=_("Residential country"))
    contact_person_role = models.CharField(max_length=50, verbose_name=_("Contact person role")) 
    address_line1 = models.CharField(max_length=255, verbose_name=_("Address line 1"))
    address_line2 = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Address line 2"))
    city = models.CharField(max_length=100, verbose_name=_("City"))
    state = models.CharField(max_length=100, verbose_name=_("State"))
    zip_code = models.CharField(max_length=20, verbose_name=_("Zip code"))

    def __str__(self) :
        return self.first_name+" "+self.last_name
    
    class Meta:
        verbose_name=_("Contact person")
        verbose_name_plural=_("Contact people")


class Address(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='addresses', verbose_name=_("User"))
    address_line1 = models.CharField(max_length=255, verbose_name=_("Address line 1"))
    address_line2 = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Address line 2"))
    city = models.CharField(max_length=100, verbose_name=_("City"))
    state = models.CharField(max_length=100, verbose_name=_("State"))
    zip_code = models.CharField(max_length=20, verbose_name=_("Zip code"))
    country = models.CharField(max_length=100, verbose_name=_("Country"))

    class Meta:
        verbose_name=_('Address')
        verbose_name_plural = _("Addresses")

    def __str__(self):
        return f'{self.user.email} / {self.country} / {self.city} / {self.address_line1}'

class IdentificationDocument(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='documents', verbose_name=_("Seller"))
    document_type = models.CharField(max_length=50, default="tax_id", blank=True, verbose_name=_("Document type"))  # e.g., 'tax_id', 'national_id', 'proof_of_address'
    file = models.FileField(upload_to='documents/', verbose_name=_("Document"))  # Adjust the upload path as needed
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name=_("Upload date"))

    class Meta:
        verbose_name=_("Document")
        verbose_name_plural=_("Documents")


class UserCard(models.Model):
    user = models.ForeignKey(UserAccount, related_name="cards", on_delete=models.CASCADE, verbose_name=_("User"))
    reference_id = models.CharField(max_length=255, verbose_name=_("Square id"))
    bin_number = models.CharField(max_length=255, verbose_name=_("Bin number"))
    card_brand = models.CharField(max_length=255, verbose_name=_("Card brand"))
    card_type = models.CharField(max_length=255, verbose_name=_("Card type"))
    cardholder_name = models.CharField(max_length=255, verbose_name=_("Cardholder name"))
    last_4 = models.CharField(max_length=255, verbose_name=_("Last 4 digits"))

    class Meta:
        verbose_name=_("Card")
        verbose_name_plural=_("Cards")

    def __str__(self) :
        return str(self.id)

CREDIT = 'CR'
DEBIT = 'DR'
TRANSACTION_CHOICES = [
    (CREDIT, 'Credit'),
    (DEBIT, 'Debit'),
]

class SellerTransactionStateTypes(models.TextChoices):
    ITEM_BOUGHT = 'ITEM_BOUGHT', 'Item bought'
    WITHDRAW = 'WITHDRAW', 'Withdraw'
    UNHOLD_MONEY= "UNHOLD_MONEY", "Money available"
    
class SellerTransaction(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='transactions', verbose_name=_("Seller"))
    transaction_type = models.CharField(max_length=2, choices=TRANSACTION_CHOICES, verbose_name=_("Transaction type"))
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Amount"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Timestamp"))
    reference_id = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("Reference ID"))
    description = models.TextField(verbose_name=_("Description"))
    closing_balance = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Closing balance"))
    variation = models.CharField(max_length=50, default=SellerTransactionStateTypes.ITEM_BOUGHT, choices=SellerTransactionStateTypes.choices, verbose_name=_("Variation"))   
    
    def __str__(self):
        return f'{self.seller.store_name} / {self.variation} - {self.amount}$ - {self.timestamp.date()}'

    class Meta:
        verbose_name=_("Seller transaction")
        verbose_name_plural=_("Seller transactions")

class ShippingTransaction(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='shipping_transactions', verbose_name=_("Seller"))    
    order_id = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("Order ID"))
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Amount ($)"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Timestamp"))
    transaction_type = models.CharField(max_length=2, choices=TRANSACTION_CHOICES, verbose_name=_("Transaction type"))
    courier_id = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("Courier ID"))
    courier_name = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("Courier name"))
    description = models.TextField(verbose_name=_("Description"))
    
    def __str__(self):
        return f'{self.seller.store_name} - {self.get_transaction_type_display()} - {self.amount} - {self.timestamp.date()}'

    class Meta:
        verbose_name=_("Shipping transaction")
        verbose_name_plural=_("Shipping transactions")

class WithdrawRequestStateTypes(models.TextChoices):
    SUCCESS = 'SUCCESS', _('Success')
    PROCESSING = 'PROCESSING', _('Processing')
    FAILED= "FAILED", _("Failed")
    

class WithDrawRequest(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='withdraw_requests', verbose_name=_("Seller"))
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Amount ($)"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Timestamp"))
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Fee amount ($)"))

    reference_id = models.CharField(max_length=255, verbose_name=_("Reference ID"))
    bin_number = models.CharField(max_length=255, verbose_name=_("Bin number"))
    card_brand = models.CharField(max_length=255, verbose_name=_("Card brand"))
    card_type = models.CharField(max_length=255, verbose_name=_("Card type"))
    cardholder_name = models.CharField(max_length=255, verbose_name=_("Cardholder name"))
    last_4 = models.CharField(max_length=255, verbose_name=_("Last 4 digits"))

    state = models.CharField(max_length=50, default=WithdrawRequestStateTypes.PROCESSING, choices=WithdrawRequestStateTypes.choices, verbose_name=_("State of process"))   

    class Meta:
        verbose_name=_('Withdraw request')
        verbose_name_plural=_('Withdraw requests')

    def __str__(self):
        return f'{self.id} / {self.amount}$ / {self.state}'
    
    # def save(self, *args, **kwargs):
    #     if self.state and not self.paid_time:
    #         self.paid_time = timezone.now()
    #     super(AppFeeClaims, self).save(*args, **kwargs)