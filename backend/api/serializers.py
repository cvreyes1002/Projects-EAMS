from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department

User = get_user_model()


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ["id", "first_name", "last_name", "email", "password"]
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "tel_no",
            "department",
            "address",
            "password",
        ]
        # Accepts password when creating a new user, but do not return a password when
        # ..giving information about a user.
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "description", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "tel_no",
            "address",
            "department",
            "is_admin",
        )
