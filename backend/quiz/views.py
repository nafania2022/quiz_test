from django.shortcuts import render


def main_page(request):
    context ={}
    return render(request, 'quiz/index.html', context=context )