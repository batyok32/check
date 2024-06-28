from django_filters import rest_framework as filters, BaseInFilter, CharFilter
from .models import  Product, Category, ShippingOption, CategoryOption, Review, SliderImage
from django.db.models import Q


class ListCharFilter(BaseInFilter, CharFilter):
    pass


class ProductFilter(filters.FilterSet):
    category = filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(), to_field_name='id', field_name='category__id'
    )
    option_values = ListCharFilter(method='filter_option_values_partial')
    min_price = filters.NumberFilter(field_name='min_price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='max_price', lookup_expr='lte')
    origin_countries = ListCharFilter(method='filter_by_origin_countries')
    # not_only_active = filters.BooleanFilter(method='filter_not_available_in_stock', initial=False)

    class Meta:
        model = Product
        fields = [
            "category",
            "seller",
            'bulk',
            "option_values",
            "min_price",
            "max_price",
            "origin_countries",
            "limited_stock",
            # "not_only_active"
        ]

    # def filter_not_available_in_stock(self, queryset, name, value):
    #     if value:
    #         return queryset
    #     return queryset.filter(active=True)
    # def filter_option_values_partial(self, queryset, name, value_list):
    #     q_objects = Q()
    #     for value in value_list:
    #         q_objects |= Q(options__value__icontains=value)
    #     return queryset.filter(q_objects).distinct()
    
    def filter_option_values_partial(self, queryset, name, value_list):
        # Group option values by their category_option_id
        grouped_values = {}
        for value in value_list:
            category_option_id, option_value = value.split(':')
            grouped_values.setdefault(category_option_id, []).append(option_value)

        # Build the query
        for category_option_id, option_values in grouped_values.items():
            # Create a Q object for the "OR" condition between values within the same category option
            value_q_objects = Q()
            for option_value in option_values:
                value_q_objects |= Q(options__value__icontains=option_value)

            # Apply the "AND" condition between different category options
            queryset = queryset.filter(
                value_q_objects,
                options__category_option_id=category_option_id,
            ).distinct()
            # print("Q OBJECTS", category_q_objects)
        return queryset

    def filter_by_origin_countries(self, queryset, name, value_list):
        q_objects = Q()
        for value in value_list:
            q_objects |= Q(country_of_origin__icontains=value)
        return queryset.filter(q_objects).distinct()
      

class ShippingOptionsFilter(filters.FilterSet):
    origin_countries = filters.CharFilter(lookup_expr='icontains')
    delivery_countries = filters.CharFilter(lookup_expr='icontains')
    max_dimension = filters.NumberFilter(field_name='max_dimension', lookup_expr='gte')
    max_weight = filters.NumberFilter(field_name='max_weight', lookup_expr='gte')
    product_categories = filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(),
        field_name='product_categories',
        to_field_name='id',
        lookup_expr='in'
    )
    class Meta:
        model = ShippingOption
        fields = [
            'origin_countries',
            'delivery_countries',
            'max_dimension',
            'max_weight',
            'product_categories',
        ]


class CategoryOptionsFilter(filters.FilterSet):
    category = filters.ModelMultipleChoiceFilter(
        queryset=Category.objects.all(), to_field_name='id', field_name='category__id'
    )

    class Meta:
        model = CategoryOption
        fields = [
            "category",
        ]
class ProductReviewFilter(filters.FilterSet):
   

    class Meta:
        model = Review
        fields = [
            "user",
            "rating",
            "comment",
            "created_at"
        ]


class SliderImageFilter(filters.FilterSet):
   

    class Meta:
        model = SliderImage
        fields = [
            "is_mobile"
        ]
