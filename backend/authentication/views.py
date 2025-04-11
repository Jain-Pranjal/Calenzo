
"""
# USING API VIEW
As we know that we can use the API view and then it gives the power to create more functionality over the simple CRUD operations. but it makes the code a bit more complex as we need to develop every method for the API view like It allows you to define methods like get(), post(), put(), etc., giving you the flexibility to handle each HTTP method explicitly. 

# USING VIEW SET
ViewSet is designed to handle standard CRUD operations efficiently. It provides predefined methods like list(), create(), retrieve(), update(), and destroy(), which correspond to common actions on a model. When you need to add custom actions that don't fit into these standard methods, you can use the @action decorator
"""



# since we are only registrering the user so we dont need to use the @action decorator as we can simplly override the create method of the viewset

from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class SignUpViewSet(viewsets.ViewSet):
    def create(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)



"""
while using the @action decorator it adds the extra parameter to the url even if we use the '' in the url path so it makes the /signup/<action_name>/ which is also signup 

so instead of using the @action decorator we can simply override the create method of the viewset and it will work as expected as it did not add the extra parameter to the url and it will work as expected
"""