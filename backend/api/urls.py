from django.urls import path
from .views import CurrentUserView, DepartmentListCreateView, DepartmentDetailView

urlpatterns = [
    path("user/me/", CurrentUserView.as_view(), name="current-user"),
    path('departments/', DepartmentListCreateView.as_view(), name='department-list-create'),
    path('departments/<int:pk>/', DepartmentDetailView.as_view(), name='department-detail'),
]
