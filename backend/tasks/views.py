from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from rest_framework.response import Response





class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]    #this will make sure that only authenticated users can access the API
    
    # neeed to make sure that only the authenticated user can see their own tasks
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Task.objects.filter(user=user)
        return Task.objects.none()
    
    # need to make sure that only the authenticated user can create their own tasks
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# get_queryset aur perform_create sirf internal logic ko control karte hain, URL path mein dikhte nahi.

