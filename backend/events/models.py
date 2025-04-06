from django.db import models
from django.contrib.auth.models import User


STATUS_CHOICES = (
    ('scheduled', 'Scheduled'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
)
class Event(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_events")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    google_meet_link = models.URLField(max_length=255, blank=True, unique=True)
    google_event_id = models.CharField(max_length=255, blank=True)  # Google Calendar event ID
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')


    def __str__(self):
        return f"{self.title} by {self.creator.username}"



# google_event_id: Google Calendar event ka ID store karega taaki update/delete sync ho sake.

