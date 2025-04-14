# backend/profiles/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()  # we will be directly using the user model from django so we will not be creating a new model for user 
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return the logged-in user's data
        return User.objects.filter(id=self.request.user.id)

    def get_object(self):
        # Return the logged-in user for retrieve/update/delete
        return self.request.user
    

    # get_queryset means all the data of all the users as queryset is the collection of all the data
    # get_object means only the logged in user data as we are using the request object to get the user


    # here we have overide both the get_queryset and get_object methods to ensure that only the logged in user can see their own data and also update their own data


    """
    get_queryset: User.objects.filter(id=self.request.user.id) ensures ki queryset mein sirf logged-in user ka data hai. Yani GET /api/profiles/ list mein bhi sirf current user ka data aayega.

    get_object: return self.request.user ensures ki /api/profiles/<id>/ call ke liye bhi sirf logged-in user ka object return ho, chahe URL mein koi bhi <id> ho.

    """
