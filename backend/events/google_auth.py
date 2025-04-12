# backend/events/google_auth.py
import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from django.conf import settings  #for loading the environment variables

SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/meetings']
TOKEN_FILE = os.path.join(settings.BASE_DIR, 'token.pickle')
# this file is used to store the user's access and refresh tokens after the OAuth flow is completed. so that we don't have to go through the OAuth flow every time we want to access the Google Calendar API.

def get_google_service(user):
    credentials = None
    # Load credentials if they exist
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            credentials = pickle.load(token)
    
    # If no valid credentials, run OAuth flow
    if not credentials or not credentials.valid:
        client_config = {
          "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": ["http://localhost:8080/api/google-callback/"]
            }
        }
        flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
        flow.redirect_uri = "http://localhost:8080/api/google-callback/"
        credentials = flow.run_local_server(port=8080, open_browser=True)
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(credentials, token)
    
    return build('calendar', 'v3', credentials=credentials)


# for prod: we need to use the  domain :- Domain use karo (e.g., https://calenzo.com/api/google-callback/).


# InstalledAppFlow.run_local_server(port=8080) ek local web server start karta hai OAuth redirect ke liye (e.g., http://localhost:8000/api/google-callback/ thats why we need to use different port for prod).

