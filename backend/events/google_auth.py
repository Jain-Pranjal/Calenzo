
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import os
from django.conf import settings

# Google OAuth 2.0 credentials file
CLIENT_SECRETS_FILE = os.path.join(settings.BASE_DIR, 'client_secret.json')
SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/meetings']

def get_google_service(user):
    # Yeh abhi simple hai—real app mein user-specific token store karna hoga
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_local_server(port=0)  # Local testing ke liye
    return build('calendar', 'v3', credentials=credentials)

