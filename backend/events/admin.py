from django.contrib import admin
from .models import Event

    

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'start_time', 'google_meet_link')
    list_filter = ('creator', 'start_time')
    search_fields = ('title', 'description')
    ordering = ('-start_time',)


