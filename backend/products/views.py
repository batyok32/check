from django.shortcuts import render
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Category, CategoryOption, ProductOptions, Product, \
    ShippingOption, ProductFile, Variation, VariationCategory, CrossVariationQuantityTable, \
    BulkPurchasePolicy, Review, SliderImage
from .serializers import CategorySerializer, CategoryOptionSerializer, ProductOptionsSerializer, \
     ProductSerializer, ProductDetailSerializer, CategoryRetrieveSerializer, \
     ProductCreateSerializer, ProductOptionsCreateSerializer, ProductFileCreateSerializer, \
    VariationSerializer, CrossVariationQuantitySerializer, BulkPurchasePolicySerializer, VariationCategoryCreateSerializer, \
    ShippingOptionsSerializer, CategoryOptionRetrieveSerializer, ReviewSerializer, ReviewFullSerializer, \
    CategoryFullSerializer, SliderImageSerializer
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters import rest_framework as filters
from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from django.db.models import  Count, Avg
from .filters import ProductFilter, ShippingOptionsFilter, CategoryOptionsFilter, ProductReviewFilter, SliderImageFilter

import requests
from .products_data_formatter import formatProductCreateFormData, formatProductUpdateFormData
from users.models import UserAccount, Address
from .permissions import IsSeller, IsOwner
from elasticsearch_dsl import Search
from elasticsearch_dsl.query import MultiMatch
from recommendation.documents import ProductDocument
# from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
# from django_elasticsearch_dsl_drf.constants import LOOKUP_FILTER_TERMS, LOOKUP_QUERY_IN
# from django_elasticsearch_dsl_drf.filter_backends import (
#     FilteringFilterBackend,
#     OrderingFilterBackend,
#     SearchFilterBackend,
# )
# from elasticsearch_dsl.query import Q
# import mimetypes
from order.models import StateTax

class MyOffsetPagination(LimitOffsetPagination):
    default_limit = 20
    max_limit = 1000


class CategoryList(generics.ListAPIView):
    serializer_class = CategorySerializer
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ["name"]

    def get_queryset(self):
        data = None
        parent_id = self.request.query_params.get("parent_id")

        if parent_id:
            category = get_object_or_404(Category, id=parent_id)
            data = category.childrens.annotate(
                total_childrens=Count("childrens")
            )            
        else:
            data = (
                Category.objects.filter(parent__isnull=True)
                .distinct()
                .annotate(total_childrens=Count("childrens"))
            )
        return data

    # @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
class CategoryFullList(generics.ListAPIView):
    serializer_class  = CategoryFullSerializer
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ["name"]
    
    def get_queryset(self):

        data = (
                Category.objects.filter()
                .distinct()
                .annotate(total_childrens=Count("childrens"))
                .prefetch_related("childrens")
            )
        return data

# class GlobalPickupList(generics.ListAPIView):
#     serializer_class = GlobalPickupSerializer
#     filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
#     search_fields = ["name"]
#     queryset = GlobalPickups.objects.all()


class CategoryOptionListAPIView(generics.ListAPIView):
    serializer_class = CategoryOptionSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return CategoryOption.objects.filter(category_id=category_id)
    
class CategoryOptionFullListAPIView(generics.ListAPIView):
    serializer_class = CategoryOptionRetrieveSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = CategoryOptionsFilter
    queryset = CategoryOption.objects.all()


class ProductOptionsListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ProductOptionsSerializer
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ["value"]

    def get_queryset(self):
        queryset = ProductOptions.objects.all()

        # Filter queryset by category_option if provided
        category_option_id = self.request.query_params.get('category_option')
        if category_option_id:
            queryset = queryset.filter(category_option_id=category_option_id)

        # Aggregate counts of each unique value and order by count in descending order
        queryset = queryset.values('value').annotate(count=Count('value')).order_by('-count')

        # Get top 10 most frequent values
        top_10_values = [option['value'] for option in queryset[:10]]

        # Filter the queryset based on the top 10 values
        queryset = ProductOptions.objects.filter(value__in=top_10_values)

        return queryset

# Create your views here.
class ProductCreateView(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [IsAuthenticated, IsSeller]

    # @transaction.atomic
    def post(self, request, *args, **kwargs):
        # print("CAME DATA", request.data)

        # Preprocess data
        errors = {}
        # data = request.data.copy()
        # for key, value in data.items():
        #     if isinstance(value, list) and len(value) == 1:
        #         data[key] = value[0]
        print("GELEN DATA", request.data)
        data = {}
        for key, value in request.data.items():
            if isinstance(value, list) and len(value) == 1:
                data[key] = value[0]
            else:
                data[key] = value
        print("COPY DATA", data)
        parsed_data = {}
        parsed_data = formatProductCreateFormData(data=data, parsed_data=parsed_data)
        print("PARSED DATA", parsed_data)
        data['seller']= request.user.seller_profile.id
        # data['image'] = data.pop('image') if 'image' in data else None
        

        serializer = ProductCreateSerializer(data=data)
        print("SERIA:IZER", serializer)
        if serializer.is_valid():
            serializer.save()
            product_id = serializer.instance.id
            print("PRODUCT ID", product_id)
            
        else:
            print("SERIALIZER ERRPS", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        options = parsed_data.get("options", [])
        for option in options:
            if option['category_option'] == 'null':
                option['category_option'] = None
            optionserializer = ProductOptionsCreateSerializer(data={**option, 'product':product_id},  context={'request': request})
            if not optionserializer.is_valid():
                # print("Option seriazlier is not valid", optionserializer.errors)
                errors['options'] = optionserializer.errors
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                optionserializer.save()
                # print("Saved seller product option")
    
        # files
        files = parsed_data.get("files", [])
        file_types = parsed_data.get("file_types", [])
        print("FILES ", files)
        index = 0
        for file in files:

            fileserializer = ProductFileCreateSerializer(data={'product':product_id, 'file':file, "file_type":file_types[index]},  context={'request': request})
            if not fileserializer.is_valid():
                # print("File serializer is not valid", fileserializer.errors)
                errors['files'] = fileserializer.errors
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                fileserializer.save()
                print("Saved product file")

            index+=1
        
        variations = parsed_data.get("variations", [])
        for variation_category in variations:
            variation_category_serializer = VariationCategoryCreateSerializer(data={**variation_category, 'product':product_id},  context={'request': request})
            if not variation_category_serializer.is_valid():
                
                # print("Variation category serializer is not valid", variation_category_serializer.errors)
                errors['variations'] = variation_category_serializer.errors
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                variation_category_serializer.save()
                # print("Saved variation")

                for variation in variation_category['variations']:
                    variation_serializer = VariationSerializer(data={**variation, 'variation_category':variation_category_serializer.instance.id})
                    if not variation_serializer.is_valid():
                        # print("Variation category serializer is not valid", variation_serializer.errors)
                        errors['variations'] = variation_serializer.errors
                        return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        variation_serializer.save()
                        # print("SAVED VARIATION INSTANCE")
        

        
        cross_variation_data = parsed_data.get("cross_variation_data", [])
        # print("CROSS VARIATION DATA", cross_variation_data)

        for cross_variation in cross_variation_data:
            variation_names = cross_variation.get('variations', '').split('-')
           

            # Update the cross_variation_data with the variation IDs
            cross_variation['variations'] = ", ".join(variation_names)

            nested_serializer = CrossVariationQuantitySerializer(data={**cross_variation, 'product':product_id},  context={'request': request})
            if not nested_serializer.is_valid():
                # print("Variation category serializer is not valid", nested_serializer.errors)
                errors['cross_variation_data'] = nested_serializer.errors
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                nested_serializer.save()
                # print("Saved cross_variation_data")

        bulk_purchace_policies = parsed_data.get("bulks", [])
        for bulk_purchace_policy in bulk_purchace_policies:
            nested_serializer = BulkPurchasePolicySerializer(data={**bulk_purchace_policy, 'product':product_id},  context={'request': request})
            if not nested_serializer.is_valid():
                # print("Variation category serializer is not valid", nested_serializer.errors)
                errors['bulk_purchace_policies'] = nested_serializer.errors
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                nested_serializer.save()
                # print("Saved bulk_purchace_policies")
    
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class ProductUpdateView(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [IsAuthenticated, IsSeller]

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        product_id = kwargs.get('pk')
        try:
            product = Product.objects.get(id=product_id, seller=request.user.seller_profile)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        data = {}
        for key, value in request.data.items():
            if isinstance(value, list) and len(value) == 1:
                data[key] = value[0]
            else:
                data[key] = value

        print("COPY DATA", data)        
        data['seller'] = request.user.seller_profile.id
        # data['image'] = data.pop('image')[0] if 'image' in data else None
       
        if 'image' in data:
            image_value = data.pop('image')
            # print("IMAGE VALUE", image_value)
            # Check if the value is a URL
            if image_value.startswith(('http://', 'https://')):
                # print("IMAGE IS URL", product.image)
                data['image'] = product.image
            else:
                # print("IMAGE IS FILE")
                # Assume it's an image file path or binary data
                data['image'] = image_value
        else:
            # print("ELSE IMAGE")
            data['image'] = product.image

        # print("CAME DATA TO UPDATE", data)
        
        serializer = ProductCreateSerializer(product, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        parsed_data = formatProductUpdateFormData(data=data, parsed_data={})

        self.update_nested(new_items=parsed_data.get('options', []), Product_model=ProductOptions, filter_kwargs={'product':product})
        
        self.update_nested(new_items=parsed_data.get('files', []), Product_model=ProductFile, filter_kwargs={'product':product})
        self.update_nested(new_items=parsed_data.get('only_variation_categories', []), Product_model=VariationCategory, filter_kwargs={'product':product}, partial=True)
        
        for variation_category in parsed_data.get('variations', []):
            # print("FINDING VAR CAT", variation_category)
            # print("ALL VAR CATS", VariationCategory.objects.filter(product=product))
            try:
                if 'id' in variation_category:
                    var_cat = VariationCategory.objects.get(name=variation_category['name'], product=product, id=variation_category['id'])
                else:
                    var_cat = VariationCategory.objects.get(name=variation_category['name'], product=product)
                self.update_nested(new_items=variation_category['variations'], Product_model=Variation,  filter_kwargs={'variation_category':var_cat}, add_kwargs={})
            except:
                print("NO THERE")

        self.update_nested(new_items=parsed_data.get('cross_variation_data', []), Product_model=CrossVariationQuantityTable, filter_kwargs={'product':product})
        self.update_nested(new_items=parsed_data.get('bulks', []), Product_model=BulkPurchasePolicy, filter_kwargs={'product':product})

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update_nested(self, new_items, Product_model, filter_kwargs, add_kwargs=None, partial=False):
        if not add_kwargs:
            add_kwargs = filter_kwargs
        # print("STARTED ", Product_model )
        # filter_kwargs = {f'{foreign_field_name}': product}
        current_related_items = Product_model.objects.filter(**filter_kwargs)
        # print("CURRENT RELATED ITEMS", current_related_items)
        current_related_ids = set(item.id for item in current_related_items)
        # print("CURRENT RELATED IDS", current_related_ids)
        new_related_ids = set(item['id'] for item in new_items if 'id' in item)
        # print("NEW RELATEDIDS", new_related_ids)
        for item in new_items:
            if 'id' in item and item['id'] in current_related_ids and 'not_update' not in item:
                # print("THERE IS ID AND WE UPDATE ITEM", item)
                Product_model.objects.get(id=item['id']).update(**item, partial=partial)

        # Add new related items
        for item in new_items:
            if 'id' not in item:
                # print("THERE IS NO ID AND WE CREATE ITEM", item)
                Product_model.objects.create(**add_kwargs, **item)

        # Delete old related items that are not in the new list
        new_related_ids = set(map(int, new_related_ids))
        old_related_ids_to_delete = current_related_ids - new_related_ids
        # print("WE DELETE DIFFERENCE OF IDS", old_related_ids_to_delete)
        if old_related_ids_to_delete:
            Product_model.objects.filter(id__in=old_related_ids_to_delete).delete()

            # print("DELETED")
 


class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter, SearchFilter)
    ordering_fields = ["created", "min_price", "quantity_sold", "avg_rating"]
    search_fields = ["name", "category__name", "options__name", "options__value", ]
    filterset_class = ProductFilter
    pagination_class = MyOffsetPagination

    def get_queryset(self):
        
        queryset = Product.objects.all().annotate(
            avg_rating=Avg('reviews__rating'),
            total_ratings=Count('reviews')
        ).order_by('-id')

        return queryset
    
    def filter_queryset(self, queryset):
        # search_query = self.request.query_params.get('search', None)


        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        # if search_query:
        #     search = Search(using=ProductDocument._get_connection(), index=ProductDocument.Index.name)
        #     # similarity_fields = ['category_name', 'parent_category_name', 'options.name', 'options.value']

        #     search = search.query(MultiMatch(query=search_query, fuzziness="auto", fields=['name', 'description', 'category_name', 'parent_category_name', 'child_categories_names', 'options.name', 'options.value']))
        #     print("IN SEARCH", search)
           
        #     response = search.execute()
                
        #     pks = [hit.meta.id for hit in response]
        #     queryset = queryset.filter(pk__in=pks)

        not_only_active = self.request.query_params.get('not_only_active', None)
        if not not_only_active:
            queryset = queryset.filter(active=True)

        return queryset
    



# ODNA HUYNYA
# class ProductListView(DocumentViewSet):
#     document = ProductDocument
#     serializer_class = ProductSerializer
#     lookup_field = 'id'
#     filter_backends = [
#         FilteringFilterBackend,
#         OrderingFilterBackend,
#         SearchFilterBackend,
#     ]
#     pagination_class= MyOffsetPagination
#     search_fields = (
#         'name',
#         'description',
#         'category_name',
#         'parent_category_name',
#         'child_categories_names',
#         'options.name',
#         'options.value',
#     )   
#     filter_fields = {
#         'id': 'id',
#         'category': 'category',
#         'seller': 'seller',
#         'bulk': 'bulk',
#         'min_price': 'min_price',
#         'max_price': 'max_price',
#         # 'country_of_origin': 'country_of_origin',
#         'limited_stock': 'limited_stock',
#         'options__category_option_id': 'options.category_option_id',
#         'options__value': 'options.value',
#     }
#     ordering_fields = {
#         'id': 'id',
#         'name': 'name.raw',
#         'min_price': 'min_price',
#         'quantity_sold': 'quantity_sold',
#     }
#     ordering = ('id',)
    
#     def list(self, request, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())

#         # Process Elasticsearch results
#         results = []
#         pks = []
#         # print("QUERYSET", queryset)
#         for hit in queryset:
#             document_id = hit.meta.id
#             data = {
#                 'id': document_id,
#                 'name': hit.name,
#                 'description': hit.description,
#                 # **hit
#             }
#             results.append(data)
#             pks.append(document_id)
#             # print("HIT", hit)
#         # Product.objects.filter()
#         # Pass the processed data to the serializer
#         # print("RESULTS", results)
#         queryset = Product.objects.filter(id__in=pks)
#         # print("QUERYSET 2", queryset)
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)

#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)
    

class ProductDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProductDetailSerializer

    def get_queryset(self):
        queryset = Product.objects.all().prefetch_related("seller", "files", "options", "variation_categories", "bulks").annotate(
            avg_rating=Avg('reviews__rating'),
            total_ratings=Count('reviews')
        )
        return queryset
    
   
class CategoryProductAPIView(APIView):
    pagination_class = MyOffsetPagination

    def get(self, request, category_id):
        category = Category.objects.select_related('parent').prefetch_related('childrens__childrens').get(pk=category_id)
        
        parents = self._get_parents(category)

        category_serializer = CategoryRetrieveSerializer(category, context={'request': request})
        parents_serializer = CategoryRetrieveSerializer(parents, many=True, context={'request': request})

        return Response({
            'category': category_serializer.data,
            'parents': parents_serializer.data,
        })

    def _get_children(self, categories, children):
        for child in children:
            categories.append(child)
            self._get_children(categories, child.childrens.all())
    
    def _get_parents(self, category):
        parents = []
        parent = category.parent
        while parent is not None:
            parents = [parent]
            parent = parent.parent
        return parents
    

class GetShippingRates(APIView):
    def post(self, request, *args, **kwargs):
        url = "https://api.easyship.com/2023-01/rates"
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer prod_5XanSn1gHVKPW8e5eL5AyTrqVWwD9q3b15E8rb7fFME="
        }
        
        # Debugging: Print incoming request data
        print("CAME REQUEST FOR RATES", request.data)
        
        # Forward the request to EasyShip API
        response = requests.post(url, json=request.data, headers=headers)
        
        if response.status_code == 200:
            print(response.json())
            # Wrap EasyShip's response in a DRF Response object
            return Response(response.json(), status=response.status_code)
        else:
            # Handle errors: Log them, and optionally, customize the error response
            print("ERROR", response.text)
            # Return a DRF Response object with the error status and message
            return Response({"error": "Failed to retrieve shipping rates.", "details": response.text}, status=response.status_code)




class ShippingOptionListView(generics.ListAPIView):
    serializer_class = ShippingOptionsSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    # ordering_fields = ["created"]
    # search_fields = ["name"]
    filterset_class = ShippingOptionsFilter
    # pagination_class = MyOffsetPagination
    queryset = ShippingOption.objects.all()

 


class DeleteProducts(APIView):
    permission_classes = [IsSeller]

    def post(self, request):
        try:
            product_ids = request.data.get('product_ids', [])
            products = Product.objects.filter(id__in=product_ids, seller=request.user.seller_profile)
            # print("PRODUCTS", products)
            if products.exists():
                # print("EXIST")
                products.delete()
                # print("DELETED")
                return Response({'message': 'Products deleted successfully'}, status=status.HTTP_200_OK)
            else:
                # print("NOT FOUND")
                return Response({'error': 'No matching products found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # print("SOMETHING ELSE",  e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class ProductReviewCreateListView(generics.ListCreateAPIView):
    serializer_class = ReviewFullSerializer
    permission_classes = [IsAuthenticated]
    pagination_class= MyOffsetPagination

    def create(self, request, *args, **kwargs):
        request.data['user'] = self.request.user.id
        request.data['username'] = self.request.user.first_name
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        reviews = Review.objects.filter(user=self.request.user)
        print("REVIEWS", reviews)
        return reviews
    

class ProductReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    pagination_class= MyOffsetPagination
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    ordering_fields = ["created_at", "rating"]
    filterset_class = ProductReviewFilter

    def get_queryset(self):
        product_pk = self.kwargs.get('pk')
        reviews = Review.objects.filter(product__id=product_pk)
        return reviews

class ProductReviewAnalyticView(APIView):
    def get(self, request, pk):
        reviews = Review.objects.filter(product__id=pk)

        rating_counts = {"1.00":0, "2.00":0, "3.00":0, "4.00":0, "5.00":0}
        
        # Get actual counts from the database
        actual_counts = reviews.values('rating').annotate(
            count=Count('rating')
        ).order_by('rating')
        
        # Update the default counts with actual counts
        for item in actual_counts:
            rating_counts[str(item['rating'])] = item['count']
        total_count = reviews.count()


        return Response({
            "rating_counts": rating_counts,
            "total_count": total_count
        })


class TaxRates(APIView):

    def post(self, request):
        try:
            cart_items = request.data.get('items', [])
            result_items = []
            print("RESULT CART", request.data)
            for cart_item in cart_items:
                print("CART ITEM", cart_item)
                state_tax = StateTax.objects.get(from_state_name__contains=cart_item['from_state'], to_state_name__contains=cart_item['to_state'])
                if state_tax:
                    result_items.append({
                        "product_id":cart_item['product_id'],
                        "tax_rate":state_tax.tax_percent
                    })
                else:
                    result_items.append({
                        "product_id":cart_item['product_id'],
                        "tax_rate":0
                    })
            print("RESULT ITEMS", result_items)
            return Response({'items': result_items}, status=status.HTTP_200_OK)
            
        except Exception as e:
            # print("SOMETHING ELSE",  e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SliderListView(generics.ListAPIView):
    serializer_class = SliderImageSerializer
    pagination_class= MyOffsetPagination
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    filterset_class = SliderImageFilter

    def get_queryset(self):
        items = SliderImage.objects.all()
        return items
