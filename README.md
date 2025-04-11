# Calenzo

jain 
jain@123


# login
we have to make the post req to the /api/token/ endpoint with the username and password and then we will get the access token and refresh token from the backend and then we will use the access token to access the api and if the access token expires then we will use the refresh token to get a new access token and then we will use that access token to access the api again
# signup
for this we need to make a post req to the /api/auth/signup/ endpoint with the username and password and email and then aapki details will be saved in the database and also get the access and rrefresh token that will be storred in local sttorage


- jo aapka /api/token endpoint hai vo aapka internally he authenticate karega and then aapko access token and refresh token de dega for that user jo bhi aapak database me hai




For generating the token we need to make a post req
```bash
# FOR LOGIN we are generatting the token jwt
POST /api/token/
{
    "username": "your-username",
    "password": "your-password"
}

Token Refresh (Agar Access Token Expire Ho):
POST /api/token/refresh/ pe refresh token bhejo:

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

```

# for accessing the token on the frontend 

- Login page banao jo /api/token/ pe **POST** kare. and send the data of username and pwd
- Access token ko localStorage ya cookies mein store karo.
- Har API request mein Authorization: Bearer <access-token> header bhejo.
- Token expire hone pe /api/token/refresh/ use karo.


- get_queryset() and perform_create() is used to make multi-user apps




# FORR NOW
abhi ke lie i am using the sqliitte db onlhy baki jab prod me jayege tot i will change to supabase ya neon db 



# future scope 
- baad me we can add the public/ private type ion eventts me 


# Challennges i face
- i want the id of the task tot be incremenetted of the each user ot be separaete . halaki i  am saving all the tasks butt i want that ek specific id aur bane of the userr relared 
- SOLN :- i have added a diff field tha tha twill keep the track of all the task specifcally of the user id so mene global task id ko hataya nhi hai it will be there as it is 

- auth connection from the frontend to the backend so i used the jwt token for the same
- SOLN: for the login the user has to send the username and password to the /api/token/ endpoint and then i will get the access token and refresh token from the backend and it will be stored in the local storage of the browser and then i will use the access token to access the api and if the access token expires then i will use the refresh token to get a new access token and then i will use that access token to access the api again

- for the signup page
SOLN:- we already have the token generation for the login so for the sognup we need to make a different app where we tackle the user info and save it to the USER model and we need to pass the username,email and passwd






{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTU5ODM0LCJpYXQiOjE3NDM5Mzg3NTAsImp0aSI6IjBjN2RkNzJhM2RiYTQ1Nzg4ODBlYTJmOTJjYjNkMDVjIiwidXNlcl9pZCI6MX0.0cHKa2r7fJwpGb1nfcsSUZ614j2vmmH_aPbt_VcNqrI",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTQyMzUwLCJpYXQiOjE3NDM5Mzg3NTAsImp0aSI6IjVmMWU4NWY1OWVlZDRjOTBiMmE3MTQ4YTY4NTFiYzIwIiwidXNlcl9pZCI6MX0.1_dS81xk9UIxF7GJ7yJ8XVPQ4m6z3F8rufMpsp3gwm4"
}




for arti

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NDM5MDU5NCwiaWF0IjoxNzQ0MzA0MTk0LCJqdGkiOiJiMmQwMGNkM2RhZWU0ZDBlOTNhMDI5ZmRhYzAyOTFjOSIsInVzZXJfaWQiOjJ9.3D9qzOkTlW0d6Px95aiEDWFBQsha3WN9Grj9i2N9aUU",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0Mzk2Nzk2LCJpYXQiOjE3NDQzMDQxOTQsImp0aSI6Ijc4ZDY2MWU3ZGY5ZDRlYTI5YTg3ZThmYjkxMGI4NTYxIiwidXNlcl9pZCI6Mn0.ZvHPWEg9bPkAKdrXAKv2pMQIjDt3vup_hEc2--um_mw"
}



for testuser  "password": "testpass123"
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NDQ3MjQ4MCwiaWF0IjoxNzQ0Mzg2MDgwLCJqdGkiOiIyNDU2N2M5ZjRiNTk0YmM1YTM1NzQxMGQ4MTU4NmY3OSIsInVzZXJfaWQiOjN9.gju-6ySm5diT1xsX5WaSlS3II4FgIV_z0uKnT7_3uho",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0Mzk2ODgwLCJpYXQiOjE3NDQzODYwODAsImp0aSI6ImVkMGZiYTYzYjgxZDRlZWVhZDkyMzM3N2RiZWNlYTk5IiwidXNlcl9pZCI6M30.DlugHQAmy6kGJ41cRULoIZxOmkZHya3sRUmufF0M9WQ"
}

