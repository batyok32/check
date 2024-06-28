from .models import HelpItem, HelpCategory, SupportCase
from django_filters import rest_framework as filters, BaseInFilter, CharFilter

class HelpItemFilter(filters.FilterSet):
    
    class Meta:
        model = HelpItem
        fields = [
            "category",
            "user_type"
        ]



class HelpCategoryFilter(filters.FilterSet):
    
    class Meta:
        model = HelpCategory
        fields = [
            "user_type"
        ]



class SupportCaseFilter(filters.FilterSet):
    
    class Meta:
        model = SupportCase
        fields = [
            "status",
            "created_at",
            "resolved_at"
        ]
