from rest_framework import generics, permissions, status
from products.views import MyOffsetPagination
from .serializers import OrderSerializer, OrderItemSerializer, OrderItemCreateSerializer, WholestoreSerializer, \
    ShippingLabelSerializer, OrderItemBoxSerializer, PickupOrderCreateSerializer, PickupOrderListSerializer 
from .models import Order, OrderItem, Wholestore, ShippingLabel, OrderItemBox, PickupOrder, PickupOrderStateChangeHistory
from users.models import SellerTransaction
from rest_framework.response import Response
from products.models import Product, CrossVariationQuantityTable
from products.permissions import IsOwner, IsCustomer, IsSellerOrAdmin, IsCustomerOrAdmin
from django.shortcuts import get_object_or_404
from rest_framework.filters import SearchFilter, OrderingFilter
from users.models import UserAccount, SellerProfile
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
import os
from django.utils import timezone
from datetime import timedelta
from django.db import transaction
from rest_framework.views import APIView
from .tasks import send_order_details_to_client, send_orders_details_to_sellers, create_label_and_send_to_mail, create_labels_for_yuusell_boxes_and_send_to_mail
from django_filters import rest_framework as filters
from .filters import OrderItemFilters
from .utils import find_nearest_wholestore
from users.models import SellerTransaction, UserCard
import requests
from datetime import datetime
from recommendation.recommender import RecommenderByCart
from square.client import Client
from square.http.auth.o_auth_2 import BearerAuthCredentials
import os
import uuid
from users.serializers import UserCardSerializer
from django.conf import settings
from django.db import IntegrityError



bearer_auth_credential = BearerAuthCredentials(
    access_token=settings.SQUARE_ACCESS_TOKEN
)

client = Client(
    bearer_auth_credentials=bearer_auth_credential,
    environment=settings.SQUARE_ENVIRONMENT
)


class OrderListCreateView(generics.ListCreateAPIView):
    pagination_class = MyOffsetPagination
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer
    # queryset = Order.objects.all()
    # filter_backends = (OrderingFilter,)
    # ordering_fields = ["id", "created", "total_shop", "city"]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user, is_active=True)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        order = None
        if not request.data["items"] or len(request.data["items"]) < 1:
            return Response("No Cart Items", status.HTTP_404_NOT_FOUND)
        cart_items = request.data["items"]
        print("ORDERING URAA", request.data)

        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            print("ORDER SERIALIZER IS VALID", serializer)
            # for item in cart_items:
            #     product = Product.objects.get(id=item['product'])
            #     if product.limited_stock:
            #         if not product.in_stock >= item['quantity']:
            #             print("ITEMS NOT VALID",item )
            #             return Response({'errors': {"quantity":"Product not in stock", "product_id":product.id, "product_name":product.name}}, status=status.HTTP_400_BAD_REQUEST)
            print("ITEMS ALSO VALID", cart_items)
            print("PAID AND NOW SAVING ORDER")
            order = serializer.save(customer=request.user)
            
            for item in cart_items:
                print("total price", item['total_price'])
                app_fee =float( item['total_price'])/10
                print("App fee", app_fee)
                without_app_fee = float(item['total_price'])-app_fee
                without_app_fee = round(without_app_fee, 2)
                print("Without app fee", without_app_fee)
                # Without app fee 0.09000000000000001

                orderItem = OrderItemCreateSerializer(
                    data={**item, "order":order.id,"app_fee":app_fee, "without_app_fee":without_app_fee}
                )
                if not orderItem.is_valid():
                    return Response({'errors': orderItem.errors}, status=status.HTTP_400_BAD_REQUEST)
                print("CAME ORDER ITEM DATA", item)
                product = Product.objects.get(id=item['product'])
                print("")
                if product.sell_in_containers:
                    product.quantity_sold += item['quantity'] * item['items_inside_container']
                else:
                    product.quantity_sold += item['quantity']

            
                if product.limited_stock:
                    # Calculate the base quantity for the product
                    base_quantity = item['quantity'] * (item['items_inside_container'] if product.sell_in_containers else 1)
                    
                    # Check if the product has enough stock
                    if product.in_stock >= base_quantity:
                        product.in_stock -= base_quantity
                    else:
                        return Response({'errors': {"quantity":"Product not in stock", "product_id":product.id, "product_name":product.name}}, status=status.HTTP_400_BAD_REQUEST)

                    # Handle variations if available
                    if item['variations']:
                        variation_key = ", ".join([variation.strip() for variation in item['variations'].split('/')])
                        variation_quantity_entry = CrossVariationQuantityTable.objects.filter(
                            product=product,
                            variations=variation_key
                        ).first()

                        if variation_quantity_entry:
                            # Check if the variation has enough stock
                            if variation_quantity_entry.in_stock >= base_quantity:
                                variation_quantity_entry.in_stock -= base_quantity
                                variation_quantity_entry.save()
                            else:
                                return Response({'errors': {"quantity":"Variation not in stock", "product_id":product.id, "product_name":product.name, "variation_key":variation_key}}, status=status.HTTP_400_BAD_REQUEST)

                product.save()
                if item['shipping_courier_type'] == "EASYSHIP":
                    orderItem.labels_state = "PENDING"

                orderItem.save(order=order)

                if item['shipping_courier_type'] == "EASYSHIP":
                    create_label_and_send_to_mail.delay(orderItem.instance.id)
                # buy_label_for_order_item(orderItem)
                # Create shipment with buying label for this order item if US-US and retail



            payment_info = self.create_payment(data=request.data) 
            print("PAID AND NOW SAVING ORDER")
            for key, value in payment_info.items():
                setattr(order, key, value)
            order.save()
            # order = order.update(**payment_info)

            # RECOMMENDATION
            r = RecommenderByCart()
            product_ids = [p["product"] for p in cart_items]
            r.products_bought(product_ids=product_ids)

            # Response
            send_order_details_to_client.delay(order.id)
            send_orders_details_to_sellers.delay(order.id)
            
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(
                serializer.errors,
                status.HTTP_400_BAD_REQUEST,
            )

    def create_payment(self, data):
        user = self.request.user
        card = UserCard.objects.get(id=data['card_id'], user=user)
        print("CREATING PAYMENT STARTED", card)
        cents = int(float(data['total_price']) * 100)

        result = client.payments.create_payment(
        body = {
            "source_id": card.reference_id,
            "idempotency_key": str(uuid.uuid4()),
            "amount_money": {
            "amount": cents,
            "currency": "USD"
            },
            "autocomplete": True,
            "customer_id": user.square_customer_id,
            # "location_id": location_id,
            # "reference_id": order_id
        }
        )

        if result.is_success():
            print("RESULT IS SUCCESS")
            print(result.body)
            payment_id = result.body['payment']['id']
            
            payment_info = {
                "card_id":card.id,
                "card_type":card.card_type,
                "card_last_4":card.last_4,
                "card_brand":card.card_brand,
                "square_payment_id":payment_id
            }
            return payment_info
        elif result.is_error():
            print("RESUTL FAILED")
            print(result.errors)
            return Response({"error": "Failed to make a payment.", "details": result.errors}, status=400)

# {'payment': {'id': 'fVRrwPdpKJBNaZCe59V757ogr7eZY', 'created_at': '2024-03-23T21:14:50.319Z', 'updated_at': '2024-03-23T21:14:50.666Z', 'amount_money': {'amount': 4832000, 'currency': 'USD'}, 'status': 'COMPLETED', 'delay_duration': 'PT168H', 'source_type': 'CARD', 'card_details': {'status': 'CAPTURED', 'card': {'card_brand': 'VISA', 'last_4': '1111', 'exp_month': 11, 'exp_year': 2024, 'fingerprint': 'sq-1-Fq01g30-KP45lYOc_SWoOVV3_Pz4EXAu3Grg-bj1VF59mWnVMci3kquy_zXHSzEHNw', 'card_type': 'CREDIT', 'prepaid_type': 'NOT_PREPAID', 'bin': '411111'}, 'entry_method': 'ON_FILE', 'cvv_status': 'CVV_NOT_CHECKED', 'avs_status': 'AVS_ACCEPTED', 'statement_description': 'SQ *DEFAULT TEST ACCOUNT', 'card_payment_timeline': {'authorized_at': '2024-03-23T21:14:50.495Z', 'captured_at': '2024-03-23T21:14:50.666Z'}}, 'location_id': 'LY4DBY8STAX8W', 'order_id': 'Jm3QLMPdwsi087FAQSzyJvRr1e8YY', 'risk_evaluation': {'created_at': '2024-03-23T21:14:50.495Z', 'risk_level': 'NORMAL'}, 'customer_id': 'D5J54RBVA0SYBA3XYH5GYK3HSR', 'total_money': {'amount': 4832000, 'currency': 'USD'}, 'approved_money': {'amount': 4832000, 'currency': 'USD'}, 'receipt_number': 'fVRr', 'receipt_url': 'https://squareupsandbox.com/receipt/preview/fVRrwPdpKJBNaZCe59V757ogr7eZY', 'delay_action': 'CANCEL', 'delayed_until': '2024-03-30T21:14:50.319Z', 'application_details': {'square_product': 'ECOMMERCE_API', 'application_id': 'sandbox-sq0idb-48KjDNhtaGa8A1bc6Wk4ZA'}, 'version_token': '7QqSg9Pr39YiGwv2zYdNwxFEHnBU8gr3vBej9ju3S2Z6o'}}



class SellerOrderListView(generics.ListAPIView):
    pagination_class = MyOffsetPagination
    permission_classes = [IsSellerOrAdmin]
    serializer_class = OrderItemSerializer
    # pagination_class = LargeResultsSetPagination
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ["id", "product_name"]
    filterset_class = OrderItemFilters

    def get_queryset(self):
        return OrderItem.objects.all().order_by("-order__created_at").filter(seller=SellerProfile.objects.get(user=self.request.user))

class SellerOrderRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderItemCreateSerializer
    queryset = OrderItem.objects.all()
    lookup_field = 'pk'  
    permission_classes = [IsOwner, IsSellerOrAdmin]
    
    def get_queryset(self):
        return OrderItem.objects.filter(seller__user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = OrderItemSerializer(instance, context={'request': request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        labels_state = request.data.get('labels_state')

        if labels_state and labels_state == 'PRINTED':
            instance.released_time = datetime.now()  # Assuming you imported datetime
            instance.save()

        return super().update(request, *args, **kwargs)
    

class OrderListView(generics.ListAPIView):
    pagination_class = MyOffsetPagination
    permission_classes = [IsCustomer]
    serializer_class = OrderItemSerializer
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ["id", "product_name"]
    ordering_fields = ["id", "order__created_at", "total_price"]
    filterset_class = OrderItemFilters

    def get_queryset(self):
        return OrderItem.objects.all().order_by("-order__created_at").filter(order__customer=self.request.user)

class OrderItemRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsCustomer]
    serializer_class = OrderItemSerializer
    # queryset = OrderItem.objects.all()

    def get_queryset(self):
        return OrderItem.objects.filter(order__customer=self.request.user)

class OrderListWithOutPaginationView(generics.ListAPIView):
    permission_classes = [IsCustomer]
    serializer_class = OrderItemSerializer
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ["id", "product_name"]
    filterset_class = OrderItemFilters

    def get_queryset(self):
        return OrderItem.objects.all().order_by("-order__created_at").filter(order__customer=self.request.user)


class OrderItemBoxListView(generics.ListCreateAPIView):
    serializer_class = OrderItemBoxSerializer
    permission_classes = [IsSellerOrAdmin]

    def get_queryset(self):
        return OrderItemBox.objects.filter(order_item__seller=self.request.user.seller_profile)

    def create(self, request, *args, **kwargs):
        boxes_data = request.data.pop('boxes', [])
        user = self.request.user.id
        order_item = request.data.pop("order_item")
        saved_boxes_data = []

        for box_data in boxes_data:
            box_data["order_item"] = order_item
            box_data["user"] = user
            box_serializer = OrderItemBoxSerializer(data=box_data)
            box_serializer.is_valid(raise_exception=True)
            box_serializer.save()
            saved_boxes_data.append(box_serializer.data)

        create_labels_for_yuusell_boxes_and_send_to_mail.delay(order_item)
        headers = self.get_success_headers(saved_boxes_data)
        return Response(saved_boxes_data, status=201, headers=headers)

class SellerOrderPDFView(APIView):
    permission_classes = [IsSellerOrAdmin]

    def dispatch(self, request, *args, **kwargs):
        # Bypass permissions if the request comes from the admin site
        if '/admin/' in request.META.get('HTTP_REFERER', ''):
            self.permission_classes = []

        return super().dispatch(request, *args, **kwargs)

    def get(self, request, order_id):
        try:
            orderitem = get_object_or_404(OrderItem.objects.select_related('product', 'order', 'seller'), id=order_id)
            html = render_to_string("users/seller/orderitem.html", {"orderitem": orderitem})
            response = HttpResponse(content_type="application/pdf")
            response["Content-Disposition"] = f"inline; filename=orderitem_{order_id}.pdf"
            css_file_path = os.path.join('order/static/order/css/orderitem.css')

            if not os.path.exists(css_file_path):
                raise FileNotFoundError(f"CSS file for PDF generation not found at {css_file_path}")

            HTML(string=html).write_pdf(response, stylesheets=[CSS(css_file_path)])
            return response
        except Exception as e:
            print(f"Error generating PDF for OrderItem {order_id}: {e}")
            return HttpResponse("An error occurred while generating the PDF.", status=500)


class ClientOrderItemPDFView(APIView):
    permission_classes = [IsCustomerOrAdmin]

    def dispatch(self, request, *args, **kwargs):
        # Bypass permissions if the request comes from the admin site
        if '/admin/' in request.META.get('HTTP_REFERER', ''):
            self.permission_classes = []

        return super().dispatch(request, *args, **kwargs)

    def get(self, request, order_id):
        try:
            orderitem = get_object_or_404(OrderItem.objects.select_related('product', 'order', 'seller'), id=order_id)
            html = render_to_string("order/customer_orderitem.html", {"orderitem": orderitem})
            response = HttpResponse(content_type="application/pdf")
            response["Content-Disposition"] = f"inline; filename=orderitem_{order_id}.pdf"
            css_file_path = os.path.join('order/static/order/css/orderitem.css')

            if not os.path.exists(css_file_path):
                raise FileNotFoundError(f"CSS file for PDF generation not found at {css_file_path}")

            HTML(string=html).write_pdf(response, stylesheets=[CSS(css_file_path)])
            return response
        except Exception as e:
            print(f"Error generating PDF for OrderItem {order_id}: {e}")
            return HttpResponse("An error occurred while generating the PDF.", status=500)


class NearestWholestoreView(APIView):
    def get(self, request, *args, **kwargs):
        seller_latitude = request.query_params.get('lat', None)
        seller_longitude = request.query_params.get('lon', None)
        
        if seller_latitude is None or seller_longitude is None:
            return Response({"error": "Latitude and longitude are required."}, status=400)

        nearest_wholestore = None
        nearest_wholestore = find_nearest_wholestore(seller_latitude=seller_latitude, seller_longitude=seller_longitude)
        if nearest_wholestore:
            serializer = WholestoreSerializer(nearest_wholestore)
            return Response(serializer.data)
        else:
            return Response({"error": "No wholestores found."}, status=404)

class SellerFinancesView(APIView):
    permission_classes = [IsSellerOrAdmin]

    def get(self, request, *args, **kwargs):
        # Get the seller profile
        seller = SellerProfile.objects.get(user=request.user)

        # Get the seller's credit card info
        credit_cards = UserCard.objects.filter(user=request.user)
        serializer = UserCardSerializer(credit_cards, many=True)
        # Get the seller's on hold and available balance
        on_hold = seller.on_hold_balance
        available_balance = seller.available_balance

        # Get all orders for the sellere
        orders = SellerTransaction.objects.filter(seller=seller, timestamp__gte=timezone.now()- timedelta(days=90), variation="ITEM_BOUGHT")
        total_selling = 0

        for order in orders:
            total_selling += order.amount        

        
        return Response({
            "total_selling": total_selling,
            "available_balance": available_balance,
            "on_hold_balance": on_hold,
            "cards": serializer.data
        })

     
    

class ShippingLabelListView(generics.ListAPIView):
    serializer_class = ShippingLabelSerializer
    permission_classes = [IsSellerOrAdmin]

    def get_queryset(self):
        order_item_id = self.kwargs['order_item']
        return ShippingLabel.objects.filter(order_item_id=order_item_id)



class SchedulePickupCreateListApiView(generics.CreateAPIView):
    serializer_class = PickupOrderListSerializer
    permission_classes = [IsSellerOrAdmin]

    def create(self, request, *args, **kwargs):
        print("SCHEDULING PICKUP", request.data)
        orderitem_id = request.data['orderitem']
        datetime_str = request.data['date']
        datetime_obj = datetime.fromisoformat(datetime_str.rstrip('Z'))
        date_str = datetime_obj.strftime('%Y-%m-%d')
        request.data['date'] = date_str
        print("CHECKING order item", orderitem_id)

        orderitem = get_object_or_404(OrderItem, id=orderitem_id, seller=self.request.user.seller_profile)
        print("Found order item", orderitem)

        try:
            pickup_order, created = PickupOrder.objects.update_or_create(
                orderitem=orderitem,
                defaults={'date': date_str, 'state': request.data.get('state', 'SCHEDULED')}
            )
            if created:
                print("CREATED NEW PICKUP ORDER")
            else:
                print("UPDATED EXISTING PICKUP ORDER")
            return Response(PickupOrderCreateSerializer(pickup_order).data, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ListOrderItemPickupHistory(generics.RetrieveAPIView):
    permission_classes = [IsSellerOrAdmin]
    serializer_class = PickupOrderListSerializer

    def get_object(self):
        # Retrieve the OrderItem instance
        order_item = get_object_or_404(OrderItem, id=self.kwargs['pk'], seller=self.request.user.seller_profile)

        # Retrieve the PickupOrder instance associated with the OrderItem
        pickup_order = get_object_or_404(PickupOrder, orderitem=order_item)

        # Check permissions for the PickupOrder
        self.check_object_permissions(self.request, pickup_order)

        return pickup_order
    
class PickupDetailsPdf(APIView):
    permission_classes = [IsSellerOrAdmin]

    def dispatch(self, request, *args, **kwargs):
        # Bypass permissions if the request comes from the admin site
        if '/admin/' in request.META.get('HTTP_REFERER', ''):
            self.permission_classes = []

        return super().dispatch(request, *args, **kwargs)

    def get(self, request, pk):
        try:
            pickup = get_object_or_404(PickupOrder.objects.select_related('orderitem').prefetch_related("statushistories"), id=pk)
            html = render_to_string("order/pickup_detail_pdf.html", {"pickup": pickup})
            response = HttpResponse(content_type="application/pdf")
            response["Content-Disposition"] = f"inline; filename=pickup_{pk}.pdf"
            css_file_path = os.path.join('order/static/order/css/global.css')

            if not os.path.exists(css_file_path):
                raise FileNotFoundError(f"CSS file for PDF generation not found at {css_file_path}")

            HTML(string=html).write_pdf(response, stylesheets=[CSS(css_file_path)])
            return response
        except Exception as e:
            print(f"Error generating PDF for OrderItem {pk}: {e}")
            return HttpResponse("An error occurred while generating the PDF.", status=500)
