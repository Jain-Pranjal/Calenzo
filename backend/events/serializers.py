# backend/events/serializers.py
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'google_meet_link', 'creator', 'created_at', 'updated_at']
        read_only_fields = ['google_meet_link', 'creator', 'created_at', 'updated_at']