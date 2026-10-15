from django.shortcuts import render
from users.models import CustomUser
from .models import Department
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView,
)
from .serializers import RegisterUserSerializer, UserSerializer, DepartmentSerializer

class CreateUserView(CreateAPIView):
    # Get all data first from DB to make sure we do not create data that already exists.
    queryset = CustomUser.objects.all()
    # Tells View what data we need to accept to create a new user
    serializer_class = RegisterUserSerializer
    # Specify who can call this class, even if not authenticated
    permission_classes = [AllowAny]

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)

class UserListView(ListAPIView):
    """
    GET: List all custom users using the UserSerializer
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class DepartmentListCreateView(ListCreateAPIView):
    """
    GET: List all departments
    POST: Create a new department
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class DepartmentDetailView(RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single department
    PUT/PATCH: Update a department
    DELETE: Delete a department
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]