from django.contrib import admin
from .models import RefundRequest, AppReview, LabelCreateFail, HelpCategory, HelpItem
from django_ckeditor_5.widgets import CKEditor5Widget
from django.db import models
from .models import SupportCase, SupportCaseMessage

# @admin.register(RefundRequest)
# class RefundRequestAdmin(admin.ModelAdmin):
#     list_display = ('order_item', 'reason', 'status', 'created_at')
#     list_filter = ('status',)
#     search_fields = ('order_item__id', 'reason')
#     readonly_fields = ('created_at',)

# @admin.register(AppReview)
# class AppReviewAdmin(admin.ModelAdmin):
#     list_display = ('user', 'rating', 'comment', 'created_at')
#     list_filter = ('rating',)
#     search_fields = ('user__username', 'comment')
#     readonly_fields = ('created_at',)


class SupportCaseMessageInline(admin.TabularInline):
    model = SupportCaseMessage
    extra = 1  # Number of empty forms to display


@admin.register(SupportCase)
class SupportCaseAdmin(admin.ModelAdmin):
    list_display = ('subject', 'user', 'status',  'created_at', 'resolved_at')
    list_filter = ('status', 'created_at')
    search_fields = ('subject', 'message', 'user__email')
    inlines = [SupportCaseMessageInline]

# admin.site.register(SupportCaseMessage)

# admin.site.register(LabelCreateFail)

@admin.register(HelpCategory)
class HelpCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_type')
    list_filter = ('user_type',)
    search_fields = ('title',)

@admin.register(HelpItem)
class HelpItemAdmin(admin.ModelAdmin):
    list_display = ('subject', 'user_type', 'category')
    list_filter = ('user_type', 'category')
    search_fields = ('subject',)
    formfield_overrides = {
        models.TextField: {'widget': CKEditor5Widget},
    }