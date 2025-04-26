from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = {}
        token = super().get_token(user)
        
        # These are claims, you can add custom claims
        token['username'] = user.username
        token['is_admin'] = user.is_admin
        # ...
        
        return token
    
class CreateUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('__all__')
        
    def validate_phone_number(self, value):
        if not value.isnumeric():
            raise serializers.ValidationError("Phone number must be numeric")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number must be 10 digits")
        return value
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','phone_number','email_id']