from rest_framework import serializers
from .models import SellerProfile, UserAccount, Address, IdentificationDocument, SellerContactPerson, \
     SellerContactPerson, SellerTransaction, UserCard, WithDrawRequest

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('first_name', 'last_name', 'email', 'is_active', 'is_staff', 'is_superuser', 'is_seller', 'is_verified_seller')


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class IdentificationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdentificationDocument
        fields = '__all__'

class SellerContactPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerContactPerson
        fields = '__all__'

# class PaymentInfoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PaymentInfo
#         fields = '__all__'

class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = '__all__'

class SellerTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerTransaction
        fields = '__all__'

class UserCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCard
        fields = '__all__'


class WithDrawRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithDrawRequest
        fields = '__all__'
