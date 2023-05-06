from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .serializers import *

data = [
    {
        'name': 'name_test1',
        'question': 'quiz_test1',
        'answer': [{"id": 1, "value": "test", 'isCorrect': True}, {"id": 2, "value": "test", 'isCorrect': False}]
    },
    {
        'name': 'name_test2',
        'question': 'quiz_test2',
        'answer': [{"id": 3, "value": "test", 'isCorrect': True}, {"id": 4, "value": "test", 'isCorrect': False}]
    }]


class UserModelTests(APITestCase):
    def test_create_user(self):
        response = self.client.post('/api/auth/users/',
                                    {'username': 'test', 'email': 'test@gmail.com', 'password': 'test1234',
                                     'first_name': 'test', 'last_name': 'test'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'test')
        self.assertEqual(response.data['email'], 'test@gmail.com')
        self.assertEqual(response.data['first_name'], 'Test')

    def test_login_user(self):
        user = User.objects.create_user(username='test', email='test@gmail.com', password='test1234')
        token = Token.objects.get(user__username='test')
        self.client.force_authenticate(user=user, token=token)
        response = self.client.post('/auth/token/login/', {'username': 'test', 'password': 'test1234'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['auth_token'], token.key)


class QuizModelTests(APITestCase):
    def setUp(self) -> None:
        QuizModel.objects.create(**data[0])
        QuizModel.objects.create(**data[1])

    def test_get_quiz(self):
        user = User.objects.create_user(username='test', email='test@gmail.com', password='test1234')
        token = Token.objects.get(user__username='test')
        self.client.force_authenticate(user=user, token=token)
        url = reverse('quiz_api')
        request = self.client.get(url, format='json')
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(QuizModel.objects.count(), 2)
        serializers = QuizSerializers(data, many=True).data
        self.assertEquals(serializers, request.data)

    def test_post_quiz_answer(self):
        user = User.objects.create_user(username='test', email='test@gmail.com', password='test1234')
        token = Token.objects.get(user__username='test')
        self.client.force_authenticate(user=user, token=token)
        quiz = QuizUserAnswerModel.objects.all()

        data1 = [
            {
                'name': 'name_test1',
                'question': 'quiz_test1',
                'answer': [{"id": 1, "value": "test", 'isCorrect': True},
                           {"id": 2, "value": "test", 'isCorrect': False}],
                'user_answer': 2,
                'is_posted': False,
                'user': user.pk,
            },
            {
                'name': 'name_test2',
                'question': 'quiz_test2',
                'answer': [{"id": 3, "value": "test", 'isCorrect': True},
                           {"id": 4, "value": "test", 'isCorrect': False}],
                'user_answer': 3,
                'is_posted': False,
                'user': user.pk,
            }]
        url = reverse('quiz_post')
        response = self.client.post(url, data1, format="json")
        serializers = QuizUserAnswerSerializers(quiz, many=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(QuizUserAnswerModel.objects.count(), 2)
        self.assertEqual(serializers.data, response.data)

    def test_update_quiz_answer(self):
        user = User.objects.create_user(username='test', email='test@gmail.com', password='test1234')
        token = Token.objects.get(user__username='test')
        self.client.force_authenticate(user=user, token=token)
        data1 = [
            {
                'name': 'name_test1',
                'question': 'quiz_test1',
                'answer': [{"id": 1, "value": "test", 'isCorrect': True},
                           {"id": 2, "value": "test", 'isCorrect': False}],
                'user_answer': 2,
                'is_posted': False,
                'user_id': user.pk,
            },
            {
                'name': 'name_test2',
                'question': 'quiz_test2',
                'answer': [{"id": 3, "value": "test", 'isCorrect': True},
                           {"id": 4, "value": "test", 'isCorrect': False}],
                'user_answer': 3,
                'is_posted': False,
                'user_id': user.pk,
            }]
        QuizUserAnswerModel.objects.create(**data1[0])
        QuizUserAnswerModel.objects.create(**data1[1])
        quiz = QuizUserAnswerModel.objects.all()
        data2 = [
            {
                'name': 'name_test3',
                'question': 'quiz_test3',
                'answer': [{"id": 5, "value": "test", 'isCorrect': True},
                           {"id": 6, "value": "test", 'isCorrect': False}],
                'user_answer': 5,
                'is_posted': False,
                'user_id': user.pk,
            },
            {
                'name': 'name_test3',
                'question': 'quiz_test3',
                'answer': [{"id": 7, "value": "test", 'isCorrect': True},
                           {"id": 8, "value": "test", 'isCorrect': False}],
                'user_answer': 8,
                'is_posted': False,
                'user_id': user.pk,
            }]

        for value in quiz:
            url = reverse('update_answer', kwargs={'pk': value.pk})
            response = self.client.put(url, data=data2[0], headers={'Authorization': 'Token' + token.key},
                                       format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            quiz = QuizUserAnswerModel.objects.filter(id=value.pk)[0]
            serializers = QuizUserAnswerSerializers(quiz)
            self.assertEqual(QuizUserAnswerModel.objects.count(), 2)
            self.assertEqual(serializers.data, response.data)
