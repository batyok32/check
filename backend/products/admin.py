from django.contrib import admin
from .models import (
    Category, CategoryOption, Product, ProductOptions,
    Variation, VariationCategory, ProductFile, BulkPurchasePolicy, Review,
 CrossVariationQuantityTable, ShippingOption, SliderImage
)

from django.utils.translation import gettext_lazy as _

# Inline classes
class CategoryOptionInline(admin.TabularInline):
    model = CategoryOption
    extra = 1

class ProductOptionsInline(admin.TabularInline):
    model = ProductOptions
    extra = 1

class ProductVariationInline(admin.TabularInline):
    model = Variation
    extra = 1


class CrossVariationQuantityInline(admin.TabularInline):
    model = CrossVariationQuantityTable
    extra = 1

class ProductFileInline(admin.TabularInline):
    model = ProductFile
    extra = 1


class BulkPurchasePolicyInline(admin.TabularInline):
    model = BulkPurchasePolicy
    extra = 1

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1

# Admin classes
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'parent__name')
    inlines = [CategoryOptionInline]

# @admin.register(CategoryOption)
# class CategoryOptionAdmin(admin.ModelAdmin):
#     list_display = ('name', 'category')
#     search_fields = ('name', 'category__name')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'seller', 'unit_of_measuring', 'country_of_origin', 'in_stock', 'min_price', 'max_price', 'active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description', 'seller__user__username', 'category__name')
    list_filter = ('active', 'category', 'seller')
    inlines = [ProductOptionsInline,ProductFileInline, BulkPurchasePolicyInline, ReviewInline]

# @admin.register(VariationCategory)
# class VariationCategoryAdmin(admin.ModelAdmin):
#     inlines = [ProductVariationInline]

# admin.site.register(Review)
@admin.register(ShippingOption)
class ShippingOptionsAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_origin_countries', 'display_delivery_countries', 'delivery_time_range', 'price_for_dimension', 'price_for_weight')
    list_filter = ('origin_countries', 'delivery_countries', 'product_categories')
    ordering = ('min_delivery_time', 'max_delivery_time', 'price_for_dimension', 'price_for_weight')

    def delivery_time_range(self, obj):
        return f"{obj.min_delivery_time} - {obj.max_delivery_time} days"
    delivery_time_range.short_description = _("Delivery Time (days)")

    def display_origin_countries(self, obj):
        # You can replace this with actual country name retrieval logic
        return ", ".join([code.strip() for code in obj.origin_countries.split(',')])
    display_origin_countries.short_description = _("Origin Countries")

    def display_delivery_countries(self, obj):
        # You can replace this with actual country name retrieval logic
        return ", ".join([code.strip() for code in obj.delivery_countries.split(',')])
    display_delivery_countries.short_description = _("Delivery Countries")

# @admin.register(ProductVariation)
# class ProductVariationAdmin(admin.ModelAdmin):
#     list_display = ('product', 'name', 'in_stock')
#     search_fields = ('product__name', 'name')
#     inlines = [ProductFileInline]  # Add ProductFileInline here
     
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'subject', 'username', 'country', 'created_at')
    list_filter = ('rating', 'country', 'created_at')
    search_fields = ('product__name', 'user__email', 'subject', 'username', 'country')
    readonly_fields = ('created_at',)


admin.site.register(SliderImage)