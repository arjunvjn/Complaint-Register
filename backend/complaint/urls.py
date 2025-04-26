from django.urls import path
from . import views

urlpatterns = [
    
    path('create_complaint', views.create_complaint),
    path('update_status/<id>', views.update_status),
    path('update_complaint/<id>', views.update_complaint),
    path('create_review', views.create_review),
    path('get_count', views.get_count),
    path('get_complaints', views.get_complaints),
    path('get_reviews', views.get_reviews),
    path('get_complaint/<id>', views.get_complaint),
    path('update_review/<id>', views.update_review)
]