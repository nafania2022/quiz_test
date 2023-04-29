import re
    
class RegExpValidator:  
    def validate_phone(phone):
        ready_phone = re.sub(r"[^\d]", "" , phone)
        res = re.findall('37533\d{7}', ready_phone) + re.findall('37544\d{7}', ready_phone) + re.findall('37525\d{7}', ready_phone) + re.findall('37529\d{7}', ready_phone)
        return res[0] if len(res) >= 1 else None

    def validate_email(email):
        EMAILT_PATTERN = '[a-zA-Zа-яА-ЯёЁ0-9]+@[a-zA-Zа-яА-ЯёЁ0-9]+\.[a-zA-Zа-яА-ЯёЁ0-9]+'
        res = re.findall(EMAILT_PATTERN, email)
        return res[0] if len(res) >= 1 else None

    def validate_name(name):
        NAME_PATTERN = '[a-zA-Zа-яА-ЯёЁ]+'
        res = re.findall(NAME_PATTERN, name)
        return ''.join(res).capitalize() if len(res) >= 1 else None
