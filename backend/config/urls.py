from django.contrib import admin
from django.urls import path, include
from users.views import view_seller_details
from django.conf.urls.i18n import i18n_patterns # here
from django.views.i18n import set_language
# Settings
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView




urlpatterns = [
    path('ckeditor5/', include('django_ckeditor_5.urls')),
    path('admin/seller/<int:seller_id>/details/', view_seller_details, name='view_seller_details'),
    path("i18n/",set_language, name='set_language'),
    path("admin/", admin.site.urls),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path("api/recommendations/", include("recommendation.urls")),
    path("api/orders/", include("order.urls")),
    path("api/", include("products.urls")),
    path("api/", include("administration.urls")),
    path("api/", include("djoser.urls")),
    path("api/", include("users.urls")),

]  


# urlpatterns+= i18n_patterns(
#     path('admin/', admin.site.urls),
#     prefix_default_language=False
# )            

if settings.DEBUG and settings.USE_S3 == False:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
