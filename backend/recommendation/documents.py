from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from products.models import Product, ProductOptions, VariationCategory, Variation
from elasticsearch_dsl import analyzer

# python manage.py search_index --rebuild

html_strip = analyzer(
    'html_strip',
    tokenizer="standard",
    filter=["standard", "lowercase", "stop", "snowball"],
    char_filter=["html_strip"]
)

@registry.register_document
class ProductDocument(Document):
    seller = fields.ObjectField(properties={
        "id": fields.IntegerField(),
        "name": fields.TextField(),
    })
    category = fields.ObjectField(properties={
        "id": fields.IntegerField(),
        "name": fields.TextField(),
    })
    options = fields.NestedField(properties={
        "category_option": fields.ObjectField(properties={
            "id": fields.IntegerField(),
            "name": fields.TextField(),
        }),
        "value": fields.TextField(),
        "name": fields.TextField(),
    })
    variation_categories = fields.NestedField(properties={
        "id": fields.IntegerField(),
        "name": fields.TextField(),
        "variations": fields.NestedField(properties={
            "id": fields.IntegerField(),
            "name": fields.TextField(),
        }),
    })
    category_name = fields.TextField(attr='category__name')
    parent_category_name = fields.TextField(attr='category__parent__name')
    child_categories_names = fields.TextField(attr='get_child_categories_names')

    class Index:
        name = "products"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
           
        }

    class Django:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "unit_of_measuring",
            "country_of_origin",
            "in_stock",
            "limited_stock",
            "min_order_quantity",
            "active",
            "min_price",
            "max_price",
            "quantity_sold",
            "last_sold_at",
            "bulk",
            "status_of_image_processing",
            "item_length",
            "item_height",
            "item_width",
            "item_weight",
            "dimensions_unit",
            "weight_unit",
            "box_length",
            "box_height",
            "box_width",
            "box_weight",
            "created",
            "updated",
            
        ]
        related_models = [ProductOptions, VariationCategory]

    def get_queryset(self):
        return super().get_queryset().select_related(
            'seller',
            'category'
        ).prefetch_related(
            'options',
            'variation_categories',
            'variation_categories__variations'
        )

    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, ProductOptions):
            return related_instance.product
        elif isinstance(related_instance, VariationCategory) or isinstance(related_instance, Variation):
            return related_instance.product

    def get_child_categories_names(self, obj):
        return [child.name for child in obj.category.children.all()]

