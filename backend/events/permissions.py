# backend/events/permissions.py
from rest_framework import permissions

class IsEventCreatorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
          # SAFE_METHODS are GET, HEAD, OPTIONS (read-only
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user
    
# This permission class checks if the user is the creator of the event. If they are, they can perform any action (read, update, delete). If not, they can only read the event.
