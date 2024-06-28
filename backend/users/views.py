from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from djoser.social.views import ProviderAuthView

from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from django.shortcuts import render, get_object_or_404
from .models import SellerProfile, UserAccount, Address, SellerTransaction, SellerTransactionStateTypes, UserCard
from .serializers import (
    SellerProfileSerializer, 
    AddressSerializer, 
    IdentificationDocumentSerializer, 
    # PaymentInfoSerializer, 
    SellerContactPersonSerializer,
    AddressSerializer,
    SellerTransactionSerializer,
    UserCardSerializer,
    WithDrawRequestSerializer
)
from django.db import transaction
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
import json
from rest_framework import parsers
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from .authentication import CustomJWTAuthentication
from django.contrib.admin.views.decorators import staff_member_required
from django.template.loader import render_to_string
from django.http import HttpResponse
from weasyprint import HTML, CSS
import os
from .tasks import send_email_with_pdf
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from products.permissions import IsOwner
from products.models import Product
from products.views import MyOffsetPagination
from products.permissions import IsSellerOrAdmin
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters import rest_framework as filters
from order.models import OrderItem
from django.db.models import Q
from products.serializers import ProductSerializer
from .filters import SellerTransactionFilters
import requests
from order.serializers import OrderItemSerializer
from django.db.models import Sum, Count
from django.db.models.functions import TruncDay
from datetime import datetime, timedelta
from django.utils import timezone



from square.client import Client as SquareClient
from square.http.auth.o_auth_2 import BearerAuthCredentials
import os
import uuid
from django.conf import settings

bearer_auth_credential = BearerAuthCredentials(
    access_token=settings.SQUARE_ACCESS_TOKEN
)

square_client = SquareClient(
    bearer_auth_credentials=bearer_auth_credential,
    environment=settings.SQUARE_ENVIRONMENT
)


class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                "access",
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
            )

            response.set_cookie(
                "refresh",
                refresh_token,
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
            )

        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                "access",
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
            )

            response.set_cookie(
                "refresh",
                refresh_token,
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
            )

        return response 
    
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie(
                "access",
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
            )
        return response
    

class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get("access")

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response
    

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
verify = client.verify.services(settings.TWILIO_VERIFIED_SID)


class SendSMSView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        verify.verifications.create(to=phone_number, channel='sms')
        return Response({'message': 'SMS sent successfully'}, status=status.HTTP_200_OK)

class VerifySMSView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        verification_code = request.data.get('verification_code')
        
        try:
            result = verify.verification_checks.create(to=phone_number, code=verification_code)
            if not result.valid:  # Assuming 'valid' is a field in the response. Adjust according to the actual response structure.
                return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        except TwilioRestException:
            return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Verification failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'message': 'Phone number verified successfully'}, status=status.HTTP_200_OK)



def view_seller_details(request, seller_id):
    seller = get_object_or_404(SellerProfile, pk=seller_id)
    return render(request, 'admin/seller_details.html', {'seller': seller})


def shorten_filename(filename, max_length=100):
    if len(filename) <= max_length:
        return filename

    # Split the filename into its name and extension
    name, ext = os.path.splitext(filename)

    # Calculate the maximum length for the name part
    max_name_length = max_length - len(ext) - 1

    # Shorten the name part of the filename
    short_name = name[:max_name_length]

    # Combine the shortened name and the extension
    return f"{short_name}{ext}"


class CreateSellerProfileView(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [IsAuthenticated]  

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # print("IN CREATESELLERPROFILE")
        # print("Request COntenct type", request.content_type)
        if request.user.is_authenticated:
            # print("USER", request.user)
            user = get_object_or_404(UserAccount, id=request.user.id)
            errors = {}  
            try:
                form_data = request.data 
                # print("REQUEST DATA:", form_data)
                json_data = form_data.get("json_data")
                file_types = form_data.get('file_types')

                # print("\n\nJSON DATA:", json_data)
                if json_data:
                    try:
                        json_data = json.loads(json_data)  # Parse the JSON string
                        file_types = json.loads(file_types)
                    except json.JSONDecodeError:
                        errors['json_data'] = 'Invalid JSON format'
                        return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    errors['json_data'] = 'Missing JSON data'
                    return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
                
            except Exception as e:
                # print("Error during processing request data:", e)
                return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate SellerProfile
            seller_profile_data = json_data.get('seller_profile')
            addresses_data = json_data.get('addresses', {})
            if seller_profile_data:
                seller_profile_serializer = SellerProfileSerializer(data={**seller_profile_data, 'user': request.user.id, **addresses_data}, context={'request': request})
                if seller_profile_serializer.is_valid():
                    # Save seller_profile if valid
                    seller_profile = seller_profile_serializer.save()
                    # print("Saved seller profile")
                else:
                    # print("SELLER PROFILE IS NOT VALID", seller_profile_serializer.errors)
                    errors['seller_profile'] = seller_profile_serializer.errors
                    return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                errors['seller_profile'] = 'Missing seller profile data'
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)


            # addresses_data = json_data.get('addresses', {})
            # address_serializer = AddressSerializer(data={**addresses_data, 'seller':seller_profile.id},  context={'request': request})
            # if not address_serializer.is_valid():
            #     # print("ADDRESS IS NOT VALID", address_serializer.errors)
            #     errors['addresses'] = address_serializer.errors
            #     return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            # else:
            #     address = address_serializer.save()
            #     print("Saved seller address")


            count = 0
            documents_data = request.FILES.getlist('documents')  # Use getlist to support multiple file uploads
            for doc in documents_data:
                print("DOCUMENT CAME,", doc)
                # shortened_filename = filename[:10]  # Example: shorten to first 10 characters
                # doc.name = shorten_filename(doc.name)
                doc_serializer = IdentificationDocumentSerializer(data={'file':doc, 'seller':seller_profile.id, "document_type":file_types[count]},  context={'request': request})
                if not doc_serializer.is_valid():
                    # print("Doc IS NOT VALID", doc_serializer.errors)
                    errors['documents'] = doc_serializer.errors
                    return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    document = doc_serializer.save()
                    # print("Saved seller doc")
                count+=1

         
            contact_data = json_data.get('contact_people', {})
            contact_serializer = SellerContactPersonSerializer(data={**contact_data, 'seller':seller_profile.id},  context={'request': request})
            if not contact_serializer.is_valid():
                # print("contact_serializer IS NOT VALID", contact_serializer.errors)
                errors['contacts'] = contact_serializer.errors
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                contact = contact_serializer.save()
                # print("Saved seller contact peple")



            # # Validate PaymentInfo
            # payment_info_data = json_data.get('payment_info', {})
            # payment_serializer = PaymentInfoSerializer(data={**payment_info_data, 'seller':seller_profile.id},  context={'request': request})
            # if not payment_serializer.is_valid():
            #     # print("Payment IS NOT VALID", payment_serializer.errors)
            #     errors['payment'] = payment_serializer.errors
            #     return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            # else:
            #     payment = payment_serializer.save()
            #     # print("Saved seller paymemnt")

            user.is_seller = True
            user.save()
            # print("Saved user")
            send_email_with_pdf.delay(seller_profile.id)
            return Response(seller_profile_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return a response indicating that the user is not authenticated
            return Response({'error': 'Authentication credentials were not provided or are invalid.'}, status=status.HTTP_401_UNAUTHORIZED)
        

@staff_member_required
def admin_seller_pdf(request, seller_id):
    try:
        # Fetch the seller profile or return 404 if not found
        seller = get_object_or_404(SellerProfile.objects
                                    .select_related('user')
                                    .prefetch_related('contact_people',  # One-to-Many relationship with SellerContactPerson
                                                     'documents'  # One-to-Many relationship with IdentificationDocument
                                                     )  # One-to-One relationship with PaymentInfo
                                    , id=seller_id)
       
       
        print("SELLER", seller.contact_people.all())
        # Render the HTML template with the seller data
        html = render_to_string("users/seller/pdf.html", {"seller": seller})

        # Prepare the HTTP response with the correct content type
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = f"inline; filename=seller_{seller_id}.pdf"

        # Get the absolute file path for the CSS file
        css_file_path = os.path.join('users/static/users/css/pdf.css')
        if not os.path.exists(css_file_path):
            raise FileNotFoundError(f"CSS file for PDF generation not found at {css_file_path}")

        # Generate and write the PDF to the response
        HTML(string=html).write_pdf(response, stylesheets=[CSS(css_file_path)])

        return response
    except Exception as e:
        # Log the error for debugging
        print(f"Error generating PDF for SellerProfile {seller_id}: {e}")
        # Return a generic error message or render an error page
        return HttpResponse("An error occurred while generating the PDF.", status=500)
    

class CheckStoreNameView(APIView):
    def get(self, request, *args, **kwargs):
        store_name = request.query_params.get('store_name', None)
        if store_name is None:
            return Response({"error": "store_name parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        if SellerProfile.objects.filter(store_name=store_name).exists():
            return Response({"exists": True, "message": "This store name already exists."}, status=status.HTTP_200_OK)
        else:
            return Response({"exists": False, "message": "This store name is available."}, status=status.HTTP_200_OK)


class CheckPhoneNumberView(APIView):
    def get(self, request, *args, **kwargs):
        phone_number = request.query_params.get('phone_number', None)
        if phone_number is None:
            return Response({"error": "phone_number parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        phone = f"+{phone_number.strip()}"

        if SellerProfile.objects.filter(phone_number=phone).exists():
            print("EXIST")
            return Response({"exists": True, "message": "This phone number already exists."}, status=status.HTTP_200_OK)
        else:
            return Response({"exists": False, "message": "This phone number is available."}, status=status.HTTP_200_OK)


class SellerProfileDetailView(generics.RetrieveAPIView):
    serializer_class = SellerProfileSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        queryset = SellerProfile.objects.all()
        return queryset
    
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, user=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj
    

class AddressListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Address.objects.filter(user=self.request.user)
        return queryset
    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={**request.data, "user":self.request.user.id})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AddressDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only access their own address book entries
        return Address.objects.filter(user=self.request.user)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        new_address_id = request.query_params.get('new_address_id')

        # Check if there are any products related to this address
        if instance.products.exists() and not new_address_id:
            return Response({"error": "This address has related products and cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)

        if instance.products.exists() and new_address_id == instance.id:
            return Response({"error": "Address for replacing and deleting can not be same."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if an alternative address ID is provided
        if new_address_id:
            try:
                new_address = Address.objects.get(id=new_address_id, user=self.request.user)
                # Update the address for related products
                Product.objects.filter(shipping_address=instance).update(shipping_address=new_address)
            except Address.DoesNotExist:
                return Response({"error": "The provided new address ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Delete the address
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class SellerTransactionListView(generics.ListAPIView):
    pagination_class = MyOffsetPagination
    permission_classes = [IsSellerOrAdmin]
    serializer_class = SellerTransactionSerializer
    filter_backends = (filters.DjangoFilterBackend, SearchFilter)
    search_fields = ["id", "reference_id"]
    filterset_class = SellerTransactionFilters

    def get_queryset(self):
        return SellerTransaction.objects.all().order_by("-timestamp").filter(seller=SellerProfile.objects.get(user=self.request.user))

class SellerListingDetailsView(APIView):
    permission_classes = [IsSellerOrAdmin]
  
    def get(self, request):
        # Get listing details
        user = self.request.user
        seller = user.seller_profile
        active_listing_count = Product.objects.filter(seller=seller).count()
        waiting_for_shipping = OrderItem.objects.filter(seller=seller, status="BUYER_PAID").count()
        in_the_way = OrderItem.objects.filter(
            Q(seller=seller) & (Q(status="SHIPPED") | Q(status="N_WHOLESTORE"))
        ).count()   
        top_10_selling_items = Product.objects.filter(seller=seller, quantity_sold__gte=1).order_by('-quantity_sold')[:10]
        serializer = ProductSerializer(top_10_selling_items, many=True, context={"request":request})
        return Response({
            "active_listing_count":active_listing_count,
            "waiting_for_shipping":waiting_for_shipping,
            "in_the_way":in_the_way,
            "top_10_selling_items":serializer.data,
        })
    

class SellerSellingsDetailsView(APIView):
    permission_classes = [IsSellerOrAdmin]
  
    def get(self, request):
        before = request.GET.get('timestamp_before')
        after = request.GET.get('timestamp_after')
        # print("BEFORE AND AFTER", before, after)
        # Convert string dates to datetime objects
        # before_date = datetime.strptime(before, '%Y-%m-%d').date() if before else None
        # after_date = datetime.strptime(after, '%Y-%m-%d').date() if after else None
        
        try:
            before_date = timezone.make_aware(datetime.strptime(before, '%Y-%m-%d')) if before else None
            after_date = timezone.make_aware(datetime.strptime(after, '%Y-%m-%d')) if after else None
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        
        # print("BEFORE DATE AND AFTER DATE", before_date, after_date)
        filtered_transactions = SellerTransactionFilters(request.GET, queryset=SellerTransaction.objects.filter(seller=self.request.user.seller_profile)).qs
        # print("FILTERED TRANSACTIONS", filtered_transactions)
        item_bought_transactions = filtered_transactions.filter(variation=SellerTransactionStateTypes.ITEM_BOUGHT)
        # print("ITEM BOUGHT TRANSACTIONS", item_bought_transactions)
        # Aggregate data by day
        daily_data = (
            item_bought_transactions
            .annotate(date=TruncDay('timestamp'))
            .values('date')
            .annotate(
                total_earning=Sum('amount'),
                total_amount=Count('id')
            )
            .order_by('date')
        )
        # print("DAILY DATA", daily_data)

        # Format the response
        response_data = {}
        total_earning = 0
        total_amount = 0
        if after_date and before_date:
            current_date = after_date
            while current_date <= before_date:
                response_data[current_date.strftime('%Y-%m-%d')] = {'total_earning': 0, 'total_amount': 0}
                current_date += timedelta(days=1)

        # Update response data with actual values and calculate totals
        for data in daily_data:
            date = data['date'].date()
            date = str(date)
            # response_data[date] = {
            #     'total_earning': data['total_earning'],
            #     'total_amount': data['total_amount']
            # }
            # print("SUKA DAILY DATAN BIRININ DATY", date)
            # print("SUKA DAILY DATAN BIRI", data)
            # print("SUKA RESPONSE DATA", response_data)
            if date in response_data:
                # print("SUKA EXISTOW", date)
                # If the date already exists in response_data, update the totals
                response_data[date]['total_earning'] += data['total_earning']
                response_data[date]['total_amount'] += data['total_amount']
            else:
                # print("EXIST DAL EKENI", date)
                # If the date does not exist in response_data, create a new entry
                response_data[date] = {
                    'total_earning': data['total_earning'],
                    'total_amount': data['total_amount']
                }
            total_earning += data['total_earning']
            total_amount += data['total_amount']

        # for data in daily_data:
        #     date = data['date'].date()  # Convert datetime to date
        #     if date not in response_data:
        #         response_data[date] = {'total_earning': 0, 'total_amount': 0}
        #     response_data[date]['total_earning'] += data['total_earning']
        #     response_data[date]['total_amount'] += data['total_amount']
        #     total_earning += data['total_earning']
        #     total_amount += data['total_amount']

        # Convert the dictionary to a list of dictionaries
        formatted_response_data = [
            {
                'label': date,
                'total_earning': data['total_earning'],
                'total_amount': data['total_amount']
            }
            for date, data in response_data.items()
        ]

        # Add the totals to the response
        return Response({
            'daily_data': formatted_response_data,
            'total_earning': total_earning,
            'total_amount': total_amount
        })
    

class ValidateSingleAddress(APIView):
    def post(self, request, *args, **kwargs):
        url = "https://api.easyship.com/2023-01/addresses/validations"
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer prod_5XanSn1gHVKPW8e5eL5AyTrqVWwD9q3b15E8rb7fFME="
        }
        
        # Debugging: Print incoming request data
        print("CAME REQUEST FOR ADDRESS VALIDATION", request.data)
        
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




class ClientDashboardDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        order_items = OrderItem.objects.filter(order__customer=user)
        order_item_count = order_items.count()
        last_order_items = OrderItemSerializer(order_items[:5], many=True, context={"request":request})
        review_count = user.reviews.count()

        return Response({
            "order_item_count": order_item_count,
            "last_order_items": last_order_items.data,
            "review_count": review_count,
        })
    


class AddCardToCustomer(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        square_id = user.square_customer_id
        if not square_id:
            
            result = square_client.customers.create_customer(
                body = {
                    "given_name": user.first_name,
                    "family_name": user.last_name,
                    "email_address": user.email,
                    "reference_id": f"{user.id}",
                }
            )
            if result.is_success():
                square_id = result.body['customer']['id']
                user.square_customer_id = square_id
                user.save()
                print("USER IS CREATED", result.body)
            elif result.is_error():
                print("USER IS NOT CREATED", result.errors)
                return Response({"error": "Failed to create user.", "details": result.errors}, status=400)

        card_data = request.data.get("card_data")
        print("REQUESTDAT", request.data)
        result = square_client.cards.create_card(
            body = {
                "idempotency_key": str(uuid.uuid4()),
                "source_id": card_data['source_id'],
                "card": {
                "cardholder_name": card_data['cardholder_name'],
                "billing_address": {
                    "address_line_1": card_data['address_line_1'],
                    "address_line_2": card_data['address_line_2'],
                    "locality": card_data['city'],
                    "administrative_district_level_1": card_data['state'],
                    "postal_code": card_data['postal_code'],
                    "country": card_data['country']
                },
                "customer_id": square_id,
                "reference_id": str(user.id)
                }
            }
            )
        if result.is_success():
            print("Card is added", result.body)
            user_card = UserCard.objects.create(user=user, reference_id=result.body['card']['id'], 
                bin_number=result.body['card']['bin'], 
                card_brand=result.body['card']['card_brand'], 
                card_type=result.body['card']['card_type'],
                cardholder_name=result.body['card']['cardholder_name'],
                last_4=result.body['card']['last_4']
            )
            serializer = UserCardSerializer(user_card)
            print("CARD IS CREATED", serializer.data)
            return Response(serializer.data, status=201)
        elif result.is_error():
            print("Card not added", result.errors)
            return Response({"error": "Failed to add card.", "details": result.errors}, status=400)

    
class ListUserCards(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCardSerializer

    def get_queryset(self):
        return UserCard.objects.filter(user=self.request.user)
    
class CreateWithDrawRequests(generics.CreateAPIView):
    permission_classes = [IsSellerOrAdmin]
    serializer_class = WithDrawRequestSerializer

    def create(self, request, *args, **kwargs):
        request.data['seller'] = request.user.seller_profile.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class DeleteUserCard(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCardSerializer

    def get_queryset(self):
        query = UserCard.objects.filter(user=self.request.user)
        return query
    