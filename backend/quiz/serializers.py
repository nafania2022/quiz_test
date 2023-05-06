
from rest_framework import serializers
from .models import QuizModel, QuizUserAnswerModel
from django.contrib.auth.models import User
# from .validator import *
from .decorator import *

# from parser.parser import get_quiz


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'first_name')
        extra_kwargs = {'password': {'write_only': True}}

    # def create(self, validated_data):
    #     print(validated_data)
    #     email = RegExpValidator.validate_email(validated_data['email'])
    #     first_name = RegExpValidator.validate_name(validated_data['first_name'])
    #     username = validated_data['username']
    #     user = User(email=email, username=username, first_name=first_name)
    #     user.set_password(validated_data['password'])
    #     user.save()
    #     return user

    # @phone("by")
    @name(1, 10)
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class QuizSerializers(serializers.ModelSerializer):
    class Meta:
        model = QuizModel
        fields = ('name', 'question', 'answer')


class QuizUserAnswerSerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())

    class Meta:
        model = QuizUserAnswerModel
        fields = "__all__"


class QuizUserOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizUserAnswerModel
        fields = "__all__"

    def get_fields(self, *args, **kwargs):
        fields = super(QuizUserOwnerSerializer, self).get_fields(*args, **kwargs)
        view = self.context['view']
        user = view.request.user
        print(fields['user'].queryset.filter(username=user))
        fields['user'].queryset = fields['user'].queryset.filter(username=user)
        return fields

# def encode():
#     quizs = get_quiz()
#     json = []
#     for quiz in quizs:
#         model_rs = QuizSerializers(quiz)
#         print(model_rs.data)
#         json.append(JSONRenderer().render(model_rs.data))
#     return json


# def add_parser_data():
#     quizs = get_quiz()
#     for quiz in quizs:
#         model_rs = QuizSerializers(quiz)
#         model_cr= QuizModel(**model_rs.data)
#         model_cr.save()
# add_parser_data()
