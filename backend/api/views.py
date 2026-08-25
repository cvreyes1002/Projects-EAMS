from django.shortcuts import render
from users.models import CustomUser
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    # Get all data first from DB to make sure we do not create data that already exists.
    queryset = CustomUser.objects.all()
    # Tells View what data we need to accept to create a new user
    serializer_class = UserSerializer
    # Specify who can call this class, even if not authenticated
    permission_classes = [AllowAny]
