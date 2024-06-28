from .views import CustomTokenObtainPairView, CustomTokenRefreshView, CustomTokenVerifyView, \
      LogoutView, CustomProviderAuthView,SendSMSView, VerifySMSView, CreateSellerProfileView, \
      admin_seller_pdf, CheckStoreNameView, CheckPhoneNumberView, SellerProfileDetailView, \
      AddressListCreateAPIView, AddressDetailAPIView, SellerTransactionListView, SellerListingDetailsView, \
      SellerSellingsDetailsView, ValidateSingleAddress, ClientDashboardDetails, AddCardToCustomer, \
        ListUserCards, CreateWithDrawRequests, DeleteUserCard

from django.urls import path, re_path

urlpatterns = [
    re_path(r"^o/(?P<provider>\S+)/$", CustomProviderAuthView.as_view(), name='provider-auth'),
    path("jwt/create/", CustomTokenObtainPairView.as_view()),
    path("jwt/refresh/", CustomTokenRefreshView.as_view()),
    path("jwt/verify/", CustomTokenVerifyView.as_view()),
    path("logout/", LogoutView.as_view()),
    path('send_sms/', SendSMSView.as_view(), name='send_sms'),
    path('verify_sms/', VerifySMSView.as_view(), name='verify_sms'),
    path('create_seller_profile/', CreateSellerProfileView.as_view(), name='create_seller_profile'),
    path('seller_profiles/me/', SellerProfileDetailView.as_view(), name='my_seller_profile'),
    path(
        "admin/seller/<int:seller_id>/pdf/", admin_seller_pdf, name="admin_seller_pdf"
    ),
    path('check_store_name/', CheckStoreNameView.as_view(), name='check_store_name'),
    path('check_phone_number/', CheckPhoneNumberView.as_view(), name='check_phone_number'),
    path("addresses/validate/", ValidateSingleAddress.as_view()),
    path('addresses/<int:pk>', AddressDetailAPIView.as_view(), name='addressbook-detail'),
    path("addresses/", AddressListCreateAPIView.as_view()),
    path("finance/withdraw/", CreateWithDrawRequests.as_view()),
    path("finance/transactions/", SellerTransactionListView.as_view()),
    path("dashboard/listings-details/", SellerListingDetailsView.as_view()),
    path("dashboard/selling-details/", SellerSellingsDetailsView.as_view()),
    path("dashboard/client-details/", ClientDashboardDetails.as_view()),
    path("add-card/", AddCardToCustomer.as_view()),
    path('delete-card/<int:pk>/', DeleteUserCard.as_view()),
    path("list-cards/", ListUserCards.as_view()),
]  
