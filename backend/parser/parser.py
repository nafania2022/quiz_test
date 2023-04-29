from bs4 import BeautifulSoup
import requests
import re
from .data import Quiz



def get_quiz_url():
    url_quiz = []
    resp = requests.get("https://lingualand.by",
            headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'}
                        )
    
    html = BeautifulSoup(resp.content, 'html.parser')
    urls = html.find_all('option')
    for url in urls:
        if url['value'] != '':
            url = "https://lingualand.by"+str(url['value'])
            url_quiz.append(url) 
    return url_quiz


def get_test_language(links):
    questions = []
    answer = []
    name_test = []
    for link in links:
        list_= []
        resp = requests.get(link,
            headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'}
                        )
        html = BeautifulSoup(resp.content, 'html.parser')
        name = html.find('h1').text
        name_test.append(name)
        raw_questions = html.find_all('p', class_='question-item-head') 
        for q in raw_questions:
            list_.append(re.sub("^\s+|\n|\r|\u3000|\s+$", '', q.text))
        questions.append(list_)
        raw_answer = html.find_all('div', class_='answers-list')
        answ =[]
        for answer_list in raw_answer:
            answer_= []
            for a in answer_list:
                text = re.sub("^\s+|\n|\r|\s+$", '', a.text)
                if len(text) > 0 :
                    answer_.append(text)
            answ.append(answer_)
        answer.append(answ)   
    return [questions, answer, name_test]
    
    
def get_quiz_checkanswer(links, quiz):
    quizs = []
    count = 1
    questions = quiz[0]
    answers = quiz[1]
    name_test = quiz[2]
    check_answers = []
    for i, link in enumerate(links):
        url = '?answer%5B0%5D=0'
        for y in range(1, len(questions[i])):
            url += f'&answer%5B{y}%5D=0'
        link += url
        resp = requests.get(link,
            headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'}
                        )
        html = BeautifulSoup(resp.content, 'html.parser')
        check_answer = html.find_all('div', 'answers-list')
        row_check =[]
        for a in check_answer:
            text = a.find(is_checked).find_next_sibling('label').text
            row_check.append(re.sub("^\s+|\n|\r|\s+$", '', text))
        check_answers.append(row_check)
    for i in range(len(links)):
        for y in range(len(questions[i])):
            js_answer = []  
            for value in answers[i][y]:
                is_correct = value == check_answers[i][y]
                js_answer.append({"id": count, "value": value, 'isCorrect': is_correct })
                count += 1
            
            quizs.append(Quiz(
                name= name_test[i],
                question=questions[i][y],
                answer=js_answer
                            )
                                )
    return quizs
        
        
def is_checked(tag):
    return tag.has_attr('checked')

 

def get_quiz():
    link= get_quiz_url()
    ques_answ = get_test_language(link)
    result = get_quiz_checkanswer(link, ques_answ)
    return result

get_quiz()