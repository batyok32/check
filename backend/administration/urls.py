from django.urls import path
from . import views

urlpatterns = [
    path('support-requests/<int:pk>/', views.SupportRequestRetrieveUpdateAPIView.as_view(), name='support-request-detail'),    path('refund_requests/', views.RefundRequestListCreateAPIView.as_view(), name='api_refund_requests'),
    path('support-requests/messages/', views.SupportCaseMessageCreateAPIView.as_view(), name='support-request-create'),
    path('support-requests/', views.SupportRequestCreateAPIView.as_view(), name='support-request-create'),
    path('refund_requests/<int:id>/', views.RefundRequestUpdateAPIView.as_view(), name='api_update_refund_request'),
    path('app_reviews/', views.AppReviewListCreateAPIView.as_view(), name='api_app_reviews'),
    path('app_reviews/<int:id>/', views.AppReviewUpdateAPIView.as_view(), name='api_update_app_review'),
    path('help-categories/', views.HelpCategoryListCreate.as_view(), name='help-category-list'),
    path('help-items/<int:pk>/', views.HelpItemDetail.as_view(), name='help-item-detail'),
    path('help-items/', views.HelpItemListCreate.as_view(), name='help-item-list'),
]
