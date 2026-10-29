from django.utils import timezone
from datetime import date
from django.shortcuts import render
from users.models import CustomUser
from .models import Department, Attendance
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateAPIView,
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


# class CurrentUserView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         serializer = UserSerializer(request.user, context={"request": request})
#         return Response(serializer.data)

class CurrentUserView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    POST: Change password for the authenticated user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"error": "Both current and new passwords are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(current_password):
            return Response(
                {"error": "Incorrect current password."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {"message": "Password changed successfully!"}, 
            status=status.HTTP_200_OK
        )
    
    
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


class CheckTodayAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        # Filter attendance for the logged-in user and today's date
        # check_in__date extracts the date part from the DateTimeField
        has_checked_in = Attendance.objects.filter(
            employee=request.user, check_in__date=today
        ).exists()

        # Optional: return the attendance details if they have checked in
        attendance = Attendance.objects.filter(
            employee=request.user, check_in__date=today
        ).first()

        return Response(
            {
                "has_checked_in": has_checked_in,
                "check_in_time": attendance.check_in if attendance else None,
                "check_out_time": attendance.check_out if attendance else None,
            }
        )


class CheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = date.today()

        # Check if user already checked in today to prevent duplicates
        already_checked_in = Attendance.objects.filter(
            employee=request.user, check_in__date=today
        ).exists()

        if already_checked_in:
            return Response({"error": "You have already checked in today."}, status=400)

        # Create the attendance record with the current time
        attendance = Attendance.objects.create(
            employee=request.user, check_in=timezone.now(), status="Present"
        )

        return Response(
            {
                "message": "Checked in successfully!",
                "check_in_time": attendance.check_in,
            },
            status=201,
        )


class CheckOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = date.today()

        # Find today's active attendance record that hasn't been checked out yet
        attendance = Attendance.objects.filter(
            employee=request.user, check_in__date=today, check_out__isnull=True
        ).first()

        if not attendance:
            existing = Attendance.objects.filter(
                employee=request.user, check_in__date=today
            ).first()

            if not existing:
                return Response({"error": "You have not checked in today."}, status=400)
            if existing.check_out:
                return Response(
                    {"error": "You have already checked out today."}, status=400
                )
            return Response(
                {"error": "Active attendance record not found."}, status=400
            )

        attendance.check_out = timezone.now()
        attendance.save()

        return Response(
            {
                "message": "Checked out successfully!",
                "check_out_time": attendance.check_out,
            },
            status=200,
        )


class CurrentMonthAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        attendances = Attendance.objects.filter(
            employee=request.user, check_in__year=now.year, check_in__month=now.month
        ).order_by("-check_in")

        data = [
            {
                "date": att.check_in.date().isoformat(),
                "checkIn": att.check_in.strftime("%Y-%m-%d %H:%M:%S"),
                "checkOut": (
                    att.check_out.strftime("%Y-%m-%d %H:%M:%S") if att.check_out else ""
                ),
                "status": att.status or "Present",
                "notes": att.notes or "",
            }
            for att in attendances
        ]
        return Response(data)
