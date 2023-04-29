from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt
from .api import *
from .views import main_page


urlpatterns = [
    path('', main_page, name='home'),
    path('api/tg_post/',csrf_exempt(send_tg_data)),
    path('api/', ApiQuiz.as_view(), name="quiz_api"),
    path('api/post/', ApiQuizUserAnswer.as_view(), name="quiz_post"),
    path('api/quiz_user_owner/', GetQuizUserOwner.as_view(), name="quiz_post_owner"),
    path('api/put/<int:pk>/', ApiQuizUserAnswerUpdate.as_view(), name="update_answer"),
    path('api/auth/', include('djoser.urls'), name='user_auth'),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
]

    