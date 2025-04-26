from rest_framework import serializers
from .models import Complaint, Review
from user.serializers import UserSerializer


class CreateComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ('__all__')

class ComplaintSerializer(serializers.ModelSerializer):
    assigned_user = UserSerializer()
    class Meta:
        model = Complaint
        fields = ('__all__')

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('__all__')