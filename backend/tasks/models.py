from django.db import models
from django.contrib.auth.models import User

PRIORITY_CHOICES = [
    (0, "Low"),
    (1, "Medium"),
    (2, "High"),
]

STATUS_CHOICES = [
    ("todo", "To Do"),
    ("inprogress", "In Progress"),
    ("done", "Done"),
]

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=1000, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=20, default="todo")
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
