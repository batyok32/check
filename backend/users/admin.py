from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserAccount, SellerProfile, Address, IdentificationDocument, UserCard, SellerContactPerson, ShippingTransaction, SellerTransaction, \
WithDrawRequest
from django.utils.html import format_html
from django.urls import reverse


class UserCardsInline(admin.StackedInline):
    model = UserCard
    extra = 0



class UserAccountAdmin(BaseUserAdmin):

    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_superuser', 'is_seller', 'is_verified_seller')
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'is_seller', 'is_seller', 'is_verified_seller')
    # fields=
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_seller', 'is_verified_seller', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
    inlines=[UserCardsInline]

# Register your models here


# class AddressInline(admin.StackedInline):
#     model = Address
#     fieldsets = (
#         (None, {
#             'fields': ('address_type', ('address_line1', 'address_line2'), 'city', 'state', 'zip_code', 'country')
#         }),
#     )
#     extra = 0


class IdentificationDocumentInline(admin.StackedInline):
    model = IdentificationDocument
    extra = 0

class SellerContactPersonInline(admin.StackedInline):
    model = SellerContactPerson
    extra = 0

# class PaymentInfoInline(admin.StackedInline):
#     model = PaymentInfo
#     extra = 1
#     max_num = 1  # Assuming one payment info per seller profile

class IsVerifiedSellerListFilter(admin.SimpleListFilter):
    title = 'is verified seller'
    parameter_name = 'is_verified_seller'

    def lookups(self, request, model_admin):
        return (
            ('Yes', 'Yes'),
            ('No', 'No'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'Yes':
            return queryset.filter(user__is_verified_seller=True)
        if self.value() == 'No':
            return queryset.filter(user__is_verified_seller=False)



def order_pdf(obj):
    url = reverse("admin_seller_pdf", args=[obj.id])
    return format_html(f'<a href="{url}" target="_blank">PDF</a>')
order_pdf.short_description = "PDF"


class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'store_name', 'is_verified_seller_display', 'is_verified_seller_editable_link', order_pdf]
    search_fields = ['store_name', 'business_name', 'user__email']
    list_filter = ['is_phone_verified', 'is_agreement_accepted', IsVerifiedSellerListFilter]
    inlines = [IdentificationDocumentInline, SellerContactPersonInline]
    readonly_fields = ('is_phone_verified',)
    # list_editable = ['user__is_verified_seller']

    def is_verified_seller_display(self, obj):
        if obj.user.is_verified_seller:
            return format_html('<span style="color:green;">&#10004;</span>')  # Checkmark icon
        return format_html('<span style="color:red;">&#10008;</span>')  # 'X' icon
    is_verified_seller_display.short_description = 'Is Verified Seller'
    is_verified_seller_display.admin_order_field = 'user__is_verified_seller'
    
    def is_verified_seller_editable_link(self, obj):
        url = reverse('admin:%s_%s_change' %(obj.user._meta.app_label,  obj.user._meta.model_name),  args=[obj.user.id] )
        return format_html('<a href="{}">Change</a>', url)
    is_verified_seller_editable_link.short_description = 'Change Verified Status'

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # If you want to save related user instance when saving a SellerProfile instance:
        if 'user__is_verified_seller' in form.changed_data:
            user = obj.user
            user.is_verified_seller = form.cleaned_data['user__is_verified_seller']
            user.save()
    # def view_details_link(self, obj):
    #     url = reverse('admin:view_seller_details', args=[obj.id])
    #     return format_html('<a href="{}">View</a>', url)

    # view_details_link.short_description = 'Details'  # Column header name

admin.site.register(SellerProfile, SellerProfileAdmin)
admin.site.register(UserAccount, UserAccountAdmin)
# admin.site.register(Address)

try:
    from social_django.models import UserSocialAuth, Nonce, Association, Code

    admin.site.unregister(UserSocialAuth)
    admin.site.unregister(Nonce)
    admin.site.unregister(Association)
    admin.site.unregister(Code)
except:
    pass  # or handle the error as you see fit


admin.site.site_header = "YuuSell"
admin.site.site_title = "YuuSell Admin Portal"
admin.site.index_title = "Welcome to YuuSell Admin"


# admin.site.register(WithDrawRequest)

class SellerTransactionAdmin(admin.ModelAdmin):
    list_display = ('seller_name', 'variation', 'beautiful_transaction_type', 'timestamp', 'amount')
    list_filter = ('timestamp', 'transaction_type')
    search_fields = ('seller__store_name', "timestamp", 'variation',)

    def seller_name(self, obj):
        return obj.seller.store_name

    def beautiful_transaction_type(self, obj):
        return obj.get_transaction_type_display()

    # seller_name.short_description = 'Seller Name'
    beautiful_transaction_type.short_description = 'Transaction Type'

admin.site.register(SellerTransaction, SellerTransactionAdmin)


class ShippingTransactionAdmin(admin.ModelAdmin):
    list_display = ('seller_name', 'beautiful_transaction_type', 'order_id', 'amount', 'timestamp', 'courier_name')
    list_filter = ('timestamp', 'transaction_type', 'courier_name')
    search_fields = ('seller__store_name', 'order_id', 'courier_name', 'timestamp')

    def seller_name(self, obj):
        return obj.seller.store_name

    def beautiful_transaction_type(self, obj):
        return obj.get_transaction_type_display()

    seller_name.short_description = 'Seller Name'
    beautiful_transaction_type.short_description = 'Transaction Type'

admin.site.register(ShippingTransaction, ShippingTransactionAdmin)


class WithDrawRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'seller_name', 'amount', 'timestamp', 'state', 'fee_amount', 'card_brand', 'card_type', 'last_4')
    list_filter = ('timestamp', 'state', 'card_brand', 'card_type')
    search_fields = ('seller__store_name', 'reference_id', 'bin_number', 'cardholder_name', 'last_4')

    def seller_name(self, obj):
        return obj.seller.store_name

    seller_name.short_description = 'Seller Name'

admin.site.register(WithDrawRequest, WithDrawRequestAdmin)


class AddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_mail', 'address_line1', 'city',  'state', 'country')
    list_filter = ('country', )
    search_fields = ('user__email', 'country', 'city', 'address_line1', 'state',)

    def user_mail(self, obj):
        return obj.user.email

    user_mail.short_description = 'User mail'

admin.site.register(Address, AddressAdmin)
