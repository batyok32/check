from django.urls import path
from . import views


urlpatterns = [

    path(
        'seller/<int:order_id>/pdf/', views.SellerOrderPDFView.as_view(), name="seller_order_pdf"
    ),
    path(
        'pickups/<int:pk>/pdf/', views.PickupDetailsPdf.as_view(), name="pickup_detailed_pdf"
    ),
    path(
        'customer/<int:order_id>/pdf/', views.ClientOrderItemPDFView.as_view(), name="client_orderitem_pdf"
    ),
    path('order-item-boxes/', views.OrderItemBoxListView.as_view(), name='order-item-box-list'),
    path('seller/list-pickup/<int:pk>/', views.ListOrderItemPickupHistory.as_view()),
    path('seller/schedule-pickup/', views.SchedulePickupCreateListApiView.as_view()),
    path('seller/<int:pk>/', views.SellerOrderRetrieveUpdateView.as_view()),
    path('shipping-labels/<int:order_item>/', views.ShippingLabelListView.as_view(), name='shipping-labels'),
    path('customer/all/', views.OrderListWithOutPaginationView.as_view()),
    path('customer/<int:pk>/', views.OrderItemRetrieveView.as_view(), name='order-item-detail'),
    path('customer/', views.OrderListView.as_view()),
    path('nearest-wholestore/', views.NearestWholestoreView.as_view(), name='nearest_wholestore'),
    path('seller/', views.SellerOrderListView.as_view()),
    path('finances/', views.SellerFinancesView.as_view()),
    path('', views.OrderListCreateView.as_view()),
]
