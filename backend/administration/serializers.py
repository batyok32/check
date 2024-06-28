from rest_framework import serializers
from .models import RefundRequest, AppReview, SupportCase, SupportCaseMessage
from .models import HelpCategory, HelpItem
from users.serializers import UserDetailSerializer
class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = '__all__'

class AppReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppReview
        fields = '__all__'

class SupportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportCase
        fields = '__all__'

class SupportRequestMessageSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer()
    class Meta:
        model = SupportCaseMessage
        fields = '__all__'

class SupportRequestMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportCaseMessage
        fields = '__all__'



class SupportRequestDetailSerializer(serializers.ModelSerializer):
    messages = SupportRequestMessageSerializer(many=True)
    user = UserDetailSerializer()

    class Meta:
        model = SupportCase
        fields = '__all__'




class HelpCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HelpCategory
        fields = ['id', 'user_type', 'title', 'image']

    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)


class HelpItemListSerializer(serializers.ModelSerializer):
    category = HelpCategorySerializer()
    image = serializers.SerializerMethodField()

    class Meta:
        model = HelpItem
        fields = ['id', 'category', 'user_type', 'subject', 'short_description', 'image']
    
    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)

class HelpItemDetailSerializer(serializers.ModelSerializer):
    category = HelpCategorySerializer()
    image = serializers.SerializerMethodField()

    class Meta:
        model = HelpItem
        fields = ['id', 'category', 'user_type', 'subject', 'content', 'short_description', 'image']
        # extra_kwargs = {
        #     'content': {'write_only': True}
        # }

    
    def get_image(self, obj):
        return self.context["request"].build_absolute_uri(obj.image.url)
