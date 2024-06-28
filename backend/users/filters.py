from .models import SellerTransaction
from django_filters import rest_framework as filters

class SellerTransactionFilters(filters.FilterSet):
   
    timestamp_after = filters.DateTimeFilter(field_name="timestamp", lookup_expr='gte')
    timestamp_before = filters.DateTimeFilter(field_name="timestamp", lookup_expr='lte')

    class Meta:
        model = SellerTransaction
        fields = [
            'timestamp_after',
            'timestamp_before'
        ]