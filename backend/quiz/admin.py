from django.contrib import admin
from .models import QuizModel, QuizUserAnswerModel

# Register your models here.
admin.site.register(QuizModel)
admin.site.register(QuizUserAnswerModel)