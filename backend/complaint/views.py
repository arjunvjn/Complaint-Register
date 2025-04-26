from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ComplaintSerializer, ReviewSerializer, CreateComplaintSerializer
from .models import Complaint, Review
from datetime import datetime
from user.models import CustomUser

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_complaint(request):
    try:
        request.data['date'] = datetime.strptime(request.data['date'], "%d-%m-%Y").date()
        serializer = CreateComplaintSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            Complaint.objects.create(**serializer.validated_data)
            return Response({"status":"Success", "data":serializer.data})
    except Exception as e:
        return Response({"status":"Error", "data":str(e)})
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_complaint(request, id):
    try:
        complaint = Complaint.objects.get(id=id)
        serializer = CreateComplaintSerializer(instance=complaint, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status":"Success"})
    except Exception as e:
        return Response({"status":"Error", "data":str(e)})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    try:
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            Review.objects.create(**serializer.validated_data)
            return Response({"status":"Success", "data":serializer.data})
    except Exception as e:
        return Response({"status":"Error", "data":str(e)})
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_status(request, id):
    try:
        complaint = Complaint.objects.get(id=id)
        sam_obj = {'Assigned': 'Processing', 'Processing': 'Completed'}
        complaint.status = sam_obj.get(complaint.status)
        complaint.save()
        return Response({"status":"Success"})
    except Exception as e:
        return Response({"status":"Error", "data":str(e)})
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def  get_count(request):
    user = CustomUser.objects.get(id=request.user.id)
    if user.is_admin:
        assigned = Complaint.objects.filter(status='Assigned').count()
        pending = Complaint.objects.filter(status='Processing').count()
        completed = Complaint.objects.filter(status='Completed').count()
    else:
        assigned = Complaint.objects.filter(status='Assigned', assigned_user=request.user.id).count()
        pending = Complaint.objects.filter(status='Processing', assigned_user=request.user.id).count()
        completed = Complaint.objects.filter(status='Completed', assigned_user=request.user.id).count()
    return Response({"status": "Success", "assigned":assigned, "pending":pending, "completed":completed})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_complaints(request):
    user = CustomUser.objects.get(id=request.user.id)
    if user.is_admin:
        complaint = Complaint.objects.select_related('assigned_user').all()
    else:
        complaint = Complaint.objects.select_related('assigned_user').filter(assigned_user__id=user.id)
    serializer = ComplaintSerializer(complaint, many=True)
    return Response({"status":"Success", "data":serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_complaint(request, id):
    complaint = Complaint.objects.select_related('assigned_user').get(id=id)
    serializer = ComplaintSerializer(complaint)
    return Response({"status":"Success", "data":serializer.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reviews(request):
    reviews = Review.objects.select_related('complaint').all()
    complaint_ids = [r.complaint.id for r in reviews]
    review_obj = {r.complaint.id: r.review_note for r in reviews}
    return Response({"status":"Success", "complaint_ids":complaint_ids, "review_obj":review_obj})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_review(request, id):
    try:
        review = Review.objects.get(complaint__id=id)
        serializer = ReviewSerializer(instance=review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status":"Success"})
    except Exception as e:
        return Response({"status":"Error", "data":str(e)})