from django.shortcuts import render
from .recommender import RecommenderByCart

from rest_framework import views
from rest_framework.response import Response
from products.models import Product
from products.serializers import ProductSerializer
from products.views import MyOffsetPagination

from django.shortcuts import get_object_or_404
# from elasticsearch_dsl.query import MoreLikeThis
# from elasticsearch_dsl import Search

from rest_framework import generics
# from .documents import ProductDocument

class ProductRecommendationView(views.APIView):
    # /recommendations/?product_ids=1&product_ids=2
    def get(self, request):
        product_ids = request.query_params.getlist('product_ids', [])
        if not product_ids:
            return Response({'error': 'No product_ids provided'}, status=400)
        products = Product.objects.filter(id__in=product_ids)
        recommender = RecommenderByCart()
        recommendations = recommender.suggest_products_for(products, 10)
        serializer = ProductSerializer(recommendations, many=True)
        return Response(serializer.data)
    
class SimilarProductsList(generics.ListAPIView):
    serializer_class = ProductSerializer
    # pagination_class = MyOffsetPagination

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        print("PRODUCT ID", product_id)
        product = get_object_or_404(Product, pk=product_id)
        print("PRODUCT", product)

        category_ids = [product.category.id]  # Include the original product's category
        if product.category.parent:
            category_ids.append(product.category.parent.id)
        category_ids.extend(product.category.childrens.values_list('id', flat=True))

        # Fetch additional products from these categories
        additional_products = Product.objects.filter(category_id__in=category_ids).exclude(pk__in=[product_id]).order_by('?').distinct()[:10]

        return additional_products
        # search = Search(using=ProductDocument._get_connection(), index=ProductDocument.Index.name)
        # search = search.query(MoreLikeThis(
        #     fields=['name', 'description', 'category_name', 'parent_category_name', 'child_categories_names', 'options.name', 'options.value'],
        #     like={'_id': product_id},
        #     min_term_freq=1,
        #     min_doc_freq=1
        # )).extra(size=10)

        # response = search.execute()
        # pks = [hit.meta.id for hit in response]
        # similar_products = Product.objects.filter(pk__in=pks).exclude(pk=product_id)
        
        # if similar_products.count() < 10:
        #     category_ids = [product.category.id]  # Include the original product's category
        #     if product.category.parent:
        #         category_ids.append(product.category.parent.id)
        #     category_ids.extend(product.category.childrens.values_list('id', flat=True))

        #     # Fetch additional products from these categories
        #     additional_products = Product.objects.filter(category_id__in=category_ids).exclude(pk__in=[product_id] + pks).distinct()[:10 - similar_products.count()]

        #     return (similar_products | additional_products).distinct()

        #     # print("COUNT LESS THAN 10", similar_products)
        #     # # Search for additional products based on category similarity
        #     # additional_search = Search(using=ProductDocument._get_connection(), index=ProductDocument.Index.name)
        #     # additional_search = additional_search.query('match', category_name=product.category.name).exclude('term', _id=product_id).extra(size=10 - similar_products.count())

        #     # additional_response = additional_search.execute()
        #     # additional_pks = [hit.meta.id for hit in additional_response]
        #     # additional_products = Product.objects.filter(pk__in=additional_pks)
        #     # print("ADDITIONAL PRODUCTS", additional_products)
        #     # return (similar_products | additional_products).distinct()
        
        # return similar_products