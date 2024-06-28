# urls.py
from django.urls import path
from .views import ProductRecommendationView, SimilarProductsList

urlpatterns = [
    path('similar-products/<int:product_id>/', SimilarProductsList.as_view(), name='similar-products'),
    path('bought-together/', ProductRecommendationView.as_view(), name='product_recommendations'),
]
