# Rest framework
from rest_framework import serializers

# Models
from .models import Order, OrderItem, Wholestore, ShippingLabel, OrderItemBox, PickupOrder, PickupOrderStateChangeHistory
from products.serializers import ProductSmallSerializer, ReviewSerializer



class PickupOrderStateChangeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupOrderStateChangeHistory
        fields = '__all__'

class PickupOrderListSerializer(serializers.ModelSerializer):
    statushistories = PickupOrderStateChangeHistorySerializer(many=True)
    
    class Meta:
        model = PickupOrder
        fields = '__all__'

class PickupOrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupOrder
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    # total_products = serializers.IntegerField(
    #     source="get_total_products", required=False
    # )

    class Meta:
        model = Order
        fields = (
            "__all__"
        )
        # read_only_fields = [
        #     "user",
        #     "created",
        #     "city_display",
        #     "id",
        #     "total_shop",
        #     "total_products",
        # ]


class OrderItemSerializer(serializers.ModelSerializer):
    order = OrderSerializer()
    product = ProductSmallSerializer()
    review = ReviewSerializer()
    pickup = PickupOrderCreateSerializer()

    class Meta:
        model = OrderItem
        fields = (
            "__all__"
        )
        # read_only_fields = ["id", "order", "product"]



class OrderItemCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = (
            "__all__"
        )
        # read_only_fields = ["id", "order", "product"]

class WholestoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wholestore
        fields = '__all__'

class ShippingLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingLabel
        fields = '__all__'


class OrderItemBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemBox
        fields = '__all__'

class OrderItemFullSerializer(serializers.ModelSerializer):
    order = OrderSerializer()
    product = ProductSmallSerializer()
    review = ReviewSerializer()
    pickups = PickupOrderCreateSerializer()
    # statushistories = 
    # boxes = OrderItemBoxSerializer()
    # labels = ShippingLabelSerializer()
    class Meta:
        model = OrderItem
        fields = (
            "__all__"
        )
        # read_only_fields = ["id", "order", "product"]

