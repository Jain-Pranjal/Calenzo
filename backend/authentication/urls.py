from rest_framework.routers import DefaultRouter
from .views import SignUpViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'signup', SignUpViewSet, basename='signup')

urlpatterns = [
    path('', include(router.urls)),
]

# /api/auth/signup/ is the endpoint for the signup view