from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('signup', views.create_account),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('update_user/<id>', views.update_user),
    path('delete_user/<id>', views.delete_user),
    path('get_user/<id>', views.get_user),
    path('', views.get_user_list, name='get_users')
]