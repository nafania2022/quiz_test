from django.shortcuts import render


def main_page(request):
    context = {}
    return render(request, 'quiz/index.html', context=context)


def main_test(request):
    context = {}
    return render(request, 'quiz/test.html', context=context)
