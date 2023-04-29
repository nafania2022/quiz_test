from rest_framework import serializers


class Quiz:
    def __init__(self, name, question, answer):
        self.name = name
        self.question = question
        self.answer = answer
        
