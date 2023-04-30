import json
import re

validated_data = {'email': 'user@email.ru', 'phone': '+375 (33) 666-44-22', 'username': 'asdasdasd',
                  'password': 'virus2676629', 'first_name': 'fdsfs'}


# def create(validated_data):
#         print(validated_data)
#         email = RegExpValidator.validate_email(validated_data['email'])
#         first_name = RegExpValidator.validate_name(validated_data['first_name'])
#         username = validated_data['username']
#         print(first_name)
#         user = User(email=email, username=username, first_name=first_name)
#         user.set_password(validated_data['password'])
#         user.save()
#         return user


def name(len_from, len_to, capitalize=True):
    def actual_validated(func):
        def wrapper(self, validated_data):
            print(validated_data)
            if (len(validated_data['first_name']) >= len_from) and (len(validated_data['first_name']) <= len_to):
                if capitalize:
                    validated_data['first_name'] = validated_data['first_name'].capitalize()
                    return func(self, validated_data)
                else:
                    return func(self, validated_data)
            else:
                return f"Имя должно быть больше {len_from} и меньше {len_to}"

        return wrapper

    return actual_validated


def phone(contries):
    def actual_validated(func):
        def wrapper(validated_data):
            data = json.loads(validated_data.body)
            ready_phone = re.sub(r"[^\d]", "", data['phone'])
            if contries.upper() == "BY":
                res = re.findall('37533\d{7}', ready_phone) + re.findall('37544\d{7}', ready_phone) + re.findall(
                    '37525\d{7}', ready_phone) + re.findall('37529\d{7}', ready_phone)
                data['phone'] = res[0]
                return func(data)
            elif contries.upper() == "RU":
                res = ''
                for i in range(900, 998):
                    res += re.findall(f'7{i}\d{7}', ready_phone)
                data['phone'] = res[0]
                return func(data)
            else:
                return f"Выведите русский или белоруский номер"

        return wrapper

    return actual_validated

# def name(validated_data):
#     print(validated_data)

# name = validated_name(name, 1, 10)
# name(validated_data)
