from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models
from django_resized import ResizedImageField
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"

    # Add a field for the user avatar
    avatar = ResizedImageField(
        size=(120, 120),
        quality=75,
        upload_to="avatars/",
        force_format="WEBP",
        blank=True,
        null=True,
        default="avatars/fallback-avatar.webp",
    )

    # REQUIRED_FIELDS defines a list of the field names that will be prompted
    # when creating a user via the createsuperuser management command.
    # Since email and password are required by default, leave this empty
    # (unless you want to force first_name, last_name, etc.)
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
