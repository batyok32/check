from django_filters import rest_framework as filters, BaseInFilter, CharFilter
from .models import  OrderItem
from django.db.models import Q

class ListCharFilter(BaseInFilter, CharFilter):
    pass

class OrderItemFilters(filters.FilterSet):
    status = ListCharFilter(field_name='status', lookup_expr='in')

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "status",
            "order",
            "closed"
        ]
