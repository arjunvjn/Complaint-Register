from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .manager import CustomManager

# Create your models here.
class CustomUser(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=10, null=True)
    email_id = models.CharField(max_length=50, null=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

    objects = CustomManager()

    def __str__(self):
        return self.username