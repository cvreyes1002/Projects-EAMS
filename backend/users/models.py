from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models
from django_resized import ResizedImageField
from django.utils.translation import gettext_lazy as _

from api.models import Department
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

    # department = models.CharField(max_length=100, blank=True, null=True, verbose_name=_('department'))
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,  # Keeps user accounts safe if a department is deleted
        blank=True,
        null=True,
        verbose_name=_("department"),
    )
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('address'))
    tel_no = models.CharField(
        max_length=20, blank=True, null=True, verbose_name=_("telephone number")
    )
    is_admin = models.BooleanField(default=False, verbose_name="admin status")

    # REQUIRED_FIELDS defines a list of the field names that will be prompted
    # when creating a user via the createsuperuser management command.
    # Since email and password are required by default, leave this empty
    # (unless you want to force first_name, last_name, etc.)
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
