from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import RefundRequest, AppReview, SupportCase, HelpCategory, HelpItem, SupportCaseMessage
from .serializers import RefundRequestSerializer, AppReviewSerializer, SupportRequestSerializer, \
    HelpCategorySerializer, HelpItemDetailSerializer, HelpItemListSerializer, SupportRequestDetailSerializer, \
    SupportRequestMessageSerializer, SupportRequestMessageCreateSerializer
from rest_framework.permissions import IsAuthenticated
from .tasks import send_support_case_open
from django_filters import rest_framework as filters
from products.views import MyOffsetPagination
from .filters import HelpItemFilter, HelpCategoryFilter, SupportCaseFilter
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter


class RefundRequestListCreateAPIView(generics.ListCreateAPIView):
    queryset = RefundRequest.objects.all()
    serializer_class = RefundRequestSerializer
    permission_classes = [IsAuthenticated]

class RefundRequestUpdateAPIView(generics.UpdateAPIView):
    queryset = RefundRequest.objects.all()
    serializer_class = RefundRequestSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]

class AppReviewListCreateAPIView(generics.ListCreateAPIView):
    queryset = AppReview.objects.all()
    serializer_class = AppReviewSerializer
    permission_classes = [IsAuthenticated]

class AppReviewUpdateAPIView(generics.UpdateAPIView):
    queryset = AppReview.objects.all()
    serializer_class = AppReviewSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]


class SupportRequestCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SupportRequestSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MyOffsetPagination
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = SupportCaseFilter

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        send_support_case_open.delay(instance.id)
        return instance

    def get_queryset(self):
        return SupportCase.objects.filter(user=self.request.user)
    

class SupportRequestRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = SupportRequestDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SupportCase.objects.filter(user=self.request.user)
    
class SupportCaseMessageCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SupportRequestMessageSerializer()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter messages by the case ID provided in the GET request.
        """
        case_id = self.kwargs.get('case_id')
        return SupportCaseMessage.objects.filter(case=case_id, case__user=self.request.user)

    def create(self, request, *args, **kwargs):
        case_id = self.request.data['case']
        support_case = SupportCase.objects.filter(id=case_id, user=request.user).first()

        if support_case is None:
            return Response({'detail': 'Support case not found.'}, status=status.HTTP_404_NOT_FOUND)

        if support_case.status == 'closed':
            return Response({'detail': 'Cannot add messages to a closed support case.'}, status=status.HTTP_400_BAD_REQUEST)

        request.data['user'] = self.request.user.id
        serializer = SupportRequestMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)




class HelpCategoryListCreate(generics.ListAPIView):
    queryset = HelpCategory.objects.all()
    serializer_class = HelpCategorySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = HelpCategoryFilter


class HelpItemListCreate(generics.ListCreateAPIView):
    queryset = HelpItem.objects.all()
    serializer_class = HelpItemListSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    pagination_class = MyOffsetPagination
    filterset_class = HelpItemFilter

class HelpItemDetail(generics.RetrieveAPIView):
    queryset = HelpItem.objects.all()
    serializer_class = HelpItemDetailSerializer
