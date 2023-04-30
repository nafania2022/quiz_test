import json
from django.http import JsonResponse
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import QuizModel, QuizUserAnswerModel
from .serializers import QuizSerializers, QuizUserAnswerSerializers, QuizUserOwnerSerializer
from rest_framework.response import Response
from .tele_bot import *
from .sms import *
from .validator import RegExpValidator
from .decorator import *


class ApiQuiz(ListAPIView):
    queryset = QuizModel.objects.all()
    serializer_class = QuizSerializers


class ApiQuizUserAnswer(ListCreateAPIView):
    queryset = QuizUserAnswerModel.objects.all()
    serializer_class = QuizUserAnswerSerializers
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiQuizUserAnswerUpdate(RetrieveUpdateAPIView):
    queryset = QuizUserAnswerModel.objects.all()
    serializer_class = QuizUserAnswerSerializers
    permission_classes = (IsAuthenticated,)


class GetQuizUserOwner(ListAPIView):
    queryset = QuizUserAnswerModel.objects.all()
    serializer_class = QuizUserOwnerSerializer
    permission_classes = (AllowAny,)


@phone("BY")
def send_tg_data(request):
    send_sms(request)
    bot.send_message(admin_chat_id, f'{request["name_quiz"]}\n\n'
                                    f'<b>Правильных ответов:</b> {request["count_correct_answer"]["count"]} из {request["count_correct_answer"]["data_len"]} \n'
                                    f'<b>Имя пользователя:</b> {RegExpValidator.validate_name(request["name"])} \n'
                                    f'<b>E-mail:</b> {RegExpValidator.validate_email(request["email"])} \n'
                                    f'<b>Номер телефона:</b> {request["phone"]}',
                     parse_mode='HTML')
    return JsonResponse(request)
