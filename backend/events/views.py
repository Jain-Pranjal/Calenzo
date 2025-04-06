# backend/events/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException
from .models import Event
from .serializers import EventSerializer
from .permissions import IsEventCreatorOrReadOnly
from .google_auth import get_google_service

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsEventCreatorOrReadOnly]
    
    def get_queryset(self):
        return Event.objects.all()
    

    # these methods are used to create, update, and delete events in Google Calendar and sync them with the local database.
    def perform_create(self, serializer):
        try:
            service = get_google_service(self.request.user)
            event_data = {
                'summary': self.request.data.get('title'),
                'description': self.request.data.get('description'),
                'start': {'dateTime': self.request.data.get('start_time'), 'timeZone': 'UTC'},
                'end': {'dateTime': self.request.data.get('end_time'), 'timeZone': 'UTC'},
                'conferenceData': {
                    'createRequest': {
                        'requestId': f"{self.request.user.id}-{int(self.request.data['start_time'].timestamp())}",
                        'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                    }
                },
            }
            google_event = service.events().insert(
                calendarId='primary',
                body=event_data,
                conferenceDataVersion=1
            ).execute()
            
            meet_link = google_event.get('hangoutLink')
            google_event_id = google_event.get('id')
            if not meet_link or not google_event_id:
                raise APIException("Failed to create Google Meet event")
            
            # Save the event in the local database
            serializer.save(
                creator=self.request.user,
                google_meet_link=meet_link,
                google_event_id=google_event_id
            )
        except Exception as e:
            raise APIException(f"Error creating event: {str(e)}")
    
    def perform_update(self, serializer):
        try:
            service = get_google_service(self.request.user)
            event = self.get_object()
            event_data = {
                'summary': self.request.data.get('title', event.title),
                'description': self.request.data.get('description', event.description),
                'start': {'dateTime': self.request.data.get('start_time', event.start_time.isoformat()), 'timeZone': 'UTC'},
                'end': {'dateTime': self.request.data.get('end_time', event.end_time.isoformat()), 'timeZone': 'UTC'},
            }
            service.events().update(
                calendarId='primary',
                eventId=event.google_event_id,
                body=event_data
            ).execute()
            serializer.save()
        except Exception as e:
            raise APIException(f"Error updating event: {str(e)}")

    def perform_destroy(self, instance):
        try:
            service = get_google_service(self.request.user)
            service.events().delete(
                calendarId='primary',
                eventId=instance.google_event_id
            ).execute()
            instance.delete()
        except Exception as e:
            raise APIException(f"Error deleting event: {str(e)}")