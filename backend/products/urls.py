from django.urls import path, include, re_path
from . import views
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# books = router.register(r'products',
#                         views.ProductListView, basename='productdocument')

urlpatterns = [
    path('shipping-options/', views.ShippingOptionListView.as_view(), name='shipping_rates'),
    path('shipping/rates/', views.GetShippingRates.as_view(), name='shipping_rates'),
    path('category/<int:category_id>/', views.CategoryProductAPIView.as_view(), name='category_product_api'),
    path("categories/full/", views.CategoryFullList.as_view()),
    path("categories/", views.CategoryList.as_view()),
    # path("global_pickups/", views.GlobalPickupList.as_view()),
    path('category_options/<int:category_id>/', views.CategoryOptionListAPIView.as_view(), name='category_option_list_api'),
    path('category_options/', views.CategoryOptionFullListAPIView.as_view(), name='category_option_list_api'),
    path('product_options/', views.ProductOptionsListCreateAPIView.as_view(), name='product-options-list-create'),
    path('delete-products/', views.DeleteProducts.as_view(), name='delete_products'),
    path("products/update/<int:pk>/", views.ProductUpdateView.as_view(), name="product_update"),
    path("products/create/", views.ProductCreateView.as_view(), name="product_create"),
    path("products/<int:pk>/", views.ProductDetail.as_view(), name="product_detail"),
    path("products/", views.ProductList.as_view()),
    path("reviews/analytics/<int:pk>/", views.ProductReviewAnalyticView.as_view()),
    path("reviews/<int:pk>/", views.ProductReviewListView.as_view()),
    path("reviews/", views.ProductReviewCreateListView.as_view()),
    path("tax-rates/", views.TaxRates.as_view()),
    path("sliders/", views.SliderListView.as_view()),
    
]


