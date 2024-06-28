from rest_framework import serializers
from .models import (
    Category, CategoryOption, Product, ProductOptions,
    Variation, VariationCategory, ProductFile, BulkPurchasePolicy, Review,
     CrossVariationQuantityTable, ShippingOption, SliderImage
)
from users.models import SellerProfile
from users.serializers import AddressSerializer

category_fields = ("id", "name", "slug", "parent", "image")

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    total_childrens = serializers.IntegerField()

    class Meta:
        model = Category
        fields = (*category_fields, "total_childrens")

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)

class CategoryMiniSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (*category_fields,)

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)


class CategoryFullSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    total_childrens = serializers.IntegerField()
    childrens = CategoryMiniSerializer(many=True)

    class Meta:
        model = Category
        fields = (*category_fields, "total_childrens", "childrens")

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)


# class GlobalPickupSerializer(serializers.ModelSerializer):
#     image = serializers.SerializerMethodField()

#     class Meta:
#         model = GlobalPickups
#         fields = ("id", 'name', 'image', 'link')

#     def get_image(self, obj):
#         return self.context["request"].build_absolute_uri(obj.image.url)


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = '__all__'

# class AddressBookSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AddressBook
#         fields = '__all__'

class CategoryOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryOption
        fields = '__all__'






class ProductOptionsSerializer(serializers.ModelSerializer):
    category_option = CategoryOptionSerializer()

    class Meta:
        model = ProductOptions
        fields = '__all__'

class ProductOptionsCreateSerializer(serializers.ModelSerializer):
    category_option = serializers.PrimaryKeyRelatedField(
        queryset=CategoryOption.objects.all(),
        required=False,  # This makes the field optional
        allow_null=True  # Allows null value in the field
    )

    class Meta:
        model = ProductOptions
        fields = '__all__'



class CategoryOptionRetrieveSerializer(serializers.ModelSerializer):
    unique_values = serializers.SerializerMethodField()

    class Meta:
        model = CategoryOption
        fields = '__all__'
    
    def get_unique_values(self, obj):
        # Get all unique values from the related ProductOptions
        unique_values = obj.options.values_list('value', flat=True).distinct()
        return list(unique_values)

class ProductFileSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    variations = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = ProductFile
        fields = '__all__'

    def get_file(self, obj):
        return self.context["request"].build_absolute_uri(obj.file.url)

class ProductFileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFile
        fields = '__all__'



class BulkPurchasePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = BulkPurchasePolicy
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class VariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variation
        fields = '__all__'

class CrossVariationQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CrossVariationQuantityTable
        fields = '__all__'

class VariationCategorySerializer(serializers.ModelSerializer):
    variations = VariationSerializer(many=True)

    class Meta:
        model = VariationCategory
        fields = '__all__'


class VariationCategoryCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = VariationCategory
        fields = '__all__'
        

class ShippingOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingOption
        fields = '__all__'


class ProductCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields='__all__'

class ProductSmallSerializer(serializers.ModelSerializer):
    
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields='__all__'

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)

class ProductSerializer(serializers.ModelSerializer):
    # variation_categories = VariationCategorySerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    avg_rating = serializers.DecimalField(max_digits=3, decimal_places=2, read_only=True)
    total_ratings = serializers.IntegerField(read_only=True)
    # shipping_options = ShippingOptionsSerializer(many=True)
    category_hierarchy = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)

    def get_category_hierarchy(self, obj):
        category = obj.category
        hierarchy = []
        while category:
            hierarchy.insert(0, {"id": category.id, "name": category.name, "hs_code":category.hs_code})
            category = category.parent
        return hierarchy


class ProductDetailSerializer(serializers.ModelSerializer):
    seller = SellerSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    # variations = VariationSerializer(many=True)
    # number_of_comments = serializers.IntegerField()
    avg_rating = serializers.IntegerField()
    total_ratings = serializers.IntegerField(read_only=True)
    category_hierarchy = serializers.SerializerMethodField()
    files = ProductFileSerializer(many=True)  # Serializer for many-to-many field
    options = ProductOptionsSerializer(many=True)
    variation_categories = VariationCategorySerializer(many=True)
    bulks = BulkPurchasePolicySerializer(many=True)
    variation_quantities = CrossVariationQuantitySerializer(many=True, read_only=True)
    shipping_address = AddressSerializer()
    
    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)

    def get_category_hierarchy(self, obj):
        category = obj.category
        hierarchy = []
        while category:
            hierarchy.insert(0, {"id": category.id, "name": category.name, "hs_code":category.hs_code})
            category = category.parent
        return hierarchy
    
class CategoryRetrieveSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    childrens = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_childrens(self, obj):
        serializer = CategoryRetrieveSerializer(obj.childrens.all(), many=True, context=self.context)
        return serializer.data

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)


# class AddressBookSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = AddressBook
#         fields = '__all__'
#         read_only_fields = ['user']  
class ReviewFullSerializer(serializers.ModelSerializer):
    product= ProductSmallSerializer()
    class Meta:
        model = Review
        fields = '__all__'



class SliderImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SliderImage
        fields = '__all__'