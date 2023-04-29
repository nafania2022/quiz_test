from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings


# This code is triggered whenever a new user has been created and saved to the database
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# Create your models here.


class QuizModel(models.Model):
    name = models.CharField(max_length=50)
    question = models.CharField(max_length=255)
    answer = ArrayField(models.JSONField())


class QuizUserAnswerModel(models.Model):
    name = models.CharField(max_length=50)
    question = models.CharField(max_length=255)
    answer = ArrayField(models.JSONField())
    user_answer = models.IntegerField()
    is_posted = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # def get_absolute_url(self):
    #     return reverse("update_answer",
    #                    kwargs={"pk": self.user})
