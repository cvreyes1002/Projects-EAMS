from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments'

    def __str__(self):
        return self.name


class Attendance(models.Model):
    employee = models.ForeignKey(
        'users.CustomUser',
        # on_type=models.CASCADE, # wait, standard Django keyword is on_delete
        on_delete=models.CASCADE,
        related_name='attendances',
        db_column='employee_id'
    )
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendances'

    def __str__(self):
        return f"{self.employee.email} - {self.check_in}"
    