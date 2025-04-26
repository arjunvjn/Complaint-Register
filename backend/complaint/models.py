from django.db import models
from user.models import CustomUser

# Create your models here.
class Complaint(models.Model):

    class ComplaintStatus(models.TextChoices):
        Assigned = 'Assigned'
        Processing = 'Processing'
        Completed = 'Completed'

    class ComplaintLevel(models.TextChoices):
        Low = 'Low'
        Medium = 'Medium'
        High = 'High'


    assigned_user = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL)
    date = models.DateField()
    username = models.CharField(max_length=50, null=True)
    user_phone = models.CharField(max_length=10, null=True)
    complaint_note = models.TextField(max_length=200)
    level = models.CharField(max_length=50, choices=ComplaintLevel.choices, default=ComplaintLevel.Low)
    status = models.CharField(max_length=50, choices=ComplaintStatus.choices, default=ComplaintStatus.Assigned)

    def __str__(self):
        return self.status

class Review(models.Model):
    review_note = models.TextField(max_length=200, null=True)
    complaint = models.OneToOneField(Complaint, on_delete=models.CASCADE)

    def __str__(self):
        return self.complaint.status