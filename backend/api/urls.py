from django.urls import path
from .views import (
    CheckInView,
    CheckOutView,
    CheckTodayAttendanceView,
    CurrentMonthAttendanceView,
    CurrentUserView,
    DepartmentListCreateView,
    DepartmentDetailView,
    UserListView,
)

urlpatterns = [
    path("user/me/", CurrentUserView.as_view(), name="current-user"),
    path("users/", UserListView.as_view(), name="user-list"),
    path(
        "departments/",
        DepartmentListCreateView.as_view(),
        name="department-list-create",
    ),
    path(
        "departments/<int:pk>/",
        DepartmentDetailView.as_view(),
        name="department-detail",
    ),
    path(
        "attendance/check-today/",
        CheckTodayAttendanceView.as_view(),
        name="check-today-attendance",
    ),
    path("attendance/check-in/", CheckInView.as_view(), name="check-in"),
    path("attendance/check-out/", CheckOutView.as_view(), name="check-out"),
    path(
        "attendance/current-month/",
        CurrentMonthAttendanceView.as_view(),
        name="current-month-attendance",
    ),
]
