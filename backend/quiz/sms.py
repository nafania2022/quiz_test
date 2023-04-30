import requests


def send_sms(data):
    result = requests.post(
        'https://app.sms.by/api/v1/sendQuickSMS',
        {
            'token': '98fb63534edf89731483e523e5a0e667',
            'message': f'{data["name_quiz"]} Правильных ответов: {data["count_correct_answer"]["count"]} из {data["count_correct_answer"]["data_len"]} Имя пользователя: {data["name"]}',
            'phone': data["phone"]
        }
    )
    print(result.json())


