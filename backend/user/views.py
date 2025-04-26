from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import MyTokenObtainPairSerializer, CreateUserSerializer, UserSerializer
from .models import CustomUser

# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def create_account(request):
    try:
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            CustomUser.objects.create_user(**serializer.validated_data)
            return Response({"status":"Success", "data":serializer.data})
        return Response({"status":"Error", "data":serializer.errors})
    except Exception as e:
        return Response({"status":"Error", "data":str(e)})
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, id):
    try:
        user = CustomUser.objects.get(id=id)
        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status":"Success"})
    except Exception as e:
        return Response({"status":"Error", "data":str(e)})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_list(request):
    user_list = CustomUser.objects.filter(is_admin=False)
    serializer = CreateUserSerializer(user_list, many=True)
    return Response({"status":"Success", "data":serializer.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, id):
    user = CustomUser.objects.get(id=id)
    serializer = UserSerializer(user)
    return Response({"status":"Success", "data":serializer.data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    CustomUser.objects.get(id=id).delete()
    return Response({"status":"Success"})