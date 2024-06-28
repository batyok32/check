from django.contrib import admin
from .models import Order, OrderItem, Wholestore, OrderItemStatusChangeHistory, ShippingLabel, OrderItemBox, \
StateTax, AppFeeClaims, ShippingLabelStateHistory, PickupOrder, PickupOrderStateChangeHistory
from django.utils.html import format_html
from django.urls import reverse

def order_pdf(obj):
    url = reverse("seller_order_pdf", args=[obj.id])
    return format_html(f'<a href="{url}" target="_blank">Seller PDF</a>')
order_pdf.short_description = "Seller PDF"


def client_orderitem_pdf(obj):
    url = reverse("client_orderitem_pdf", args=[obj.id])
    return format_html(f'<a href="{url}" target="_blank">Client PDF</a>')
client_orderitem_pdf.short_description = "Client PDF"

class OrderItemStatusChangeHistoryInline(admin.TabularInline):
    model = OrderItemStatusChangeHistory
    extra = 0  # Number of empty forms to display
    readonly_fields = ['change_time']
    
class ShippingLabelInline(admin.TabularInline):
    model = ShippingLabel
    extra = 0

class OrderItemBoxInline(admin.TabularInline):
    model = OrderItemBox
    extra = 0

class ShippingLabelStateHistoryInline(admin.TabularInline):
    model = ShippingLabelStateHistory
    extra = 0


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'uuid',   'order', 'status', 'total_price', 'price', 'quantity', 'product_name', order_pdf, client_orderitem_pdf]
    inlines = [OrderItemStatusChangeHistoryInline, ShippingLabelInline, OrderItemBoxInline]
    # list_display = ( 'product', 'seller', 'quantity', 'price', 'total_price', 'status', 'shipping_courier_name')
    search_fields = ('uuid', 'order__uuid', 'product__name', 'seller__user__username')


class ShippingLabelAdmin(admin.ModelAdmin):
    list_display = ['id', 'label_state', 'order_item']
    inlines = [ShippingLabelStateHistoryInline]
    search_fields = ('order_item__uuid', 'shipment_id', 'courier_id')


class OrderItemInline(admin.TabularInline):
    model=OrderItem
    extra=0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'uuid', 'customer', 'created_at', 'updated_at', 'total_price', 'total_shipping_price', 'total_tax_price', 'total_item_amount')
    search_fields = ('id', 'uuid', 'customer__username', 'created_at')
    inlines = [OrderItemInline]

admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingLabel, ShippingLabelAdmin)

@admin.register(Wholestore)
class WholestoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'city', 'state', 'country', 'zip_code', 'phone_number', 'latitude', 'longitude', 'person_name')
    search_fields = ('name', 'city', 'state')

@admin.register(StateTax)
class StateTaxAdmin(admin.ModelAdmin):
    list_display = ('from_state_name', 'to_state_name', 'tax_percent')
    search_fields = ('from_state_name', 'to_state_name')

@admin.register(AppFeeClaims)
class AppFeeClaimsAdmin(admin.ModelAdmin):
    list_display = ( 'id', 'orderitem', 'seller', 'amount',)
    search_fields = ('orderitem__uuid', 'seller__user__username')
    # readonly_fields = ('paid_time',)
    # list_filter = ('paid',)

    # def is_paid(self, obj):
    #     return obj.paid
    
    # is_paid.boolean = True
    # is_paid.short_description = "Paid"



def pickup_detailed_pdf(obj):
    url = reverse("pickup_detailed_pdf", args=[obj.id])
    return format_html(f'<a href="{url}" target="_blank">PDF</a>')
pickup_detailed_pdf.short_description = "PDF"

class PickupOrderStateChangeHistoryInline(admin.TabularInline):
    model = PickupOrderStateChangeHistory
    extra = 0
    fields = ('before_state', 'finished_state', 'change_time', )
    readonly_fields = ('change_time',)

@admin.register(PickupOrder)
class PickupOrderAdmin(admin.ModelAdmin):
    list_display = ('orderitem', 'date', 'state', pickup_detailed_pdf)
    list_filter = ('state',)
    search_fields = ('orderitem__id',)
    inlines = [PickupOrderStateChangeHistoryInline]