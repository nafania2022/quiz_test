import {url, localResults, isMyQuiz, userAnswerId, quizResult, ownerQuizName} from "./scripts.js"
import {token} from "./registration.js"


const formUser = document.getElementById("name_form");
const emailForm = document.getElementById("email_form");
const formPhone = document.getElementById("phone_form");


async function addAnswer(userAnser) {
    const urlApi = url + "api/post/"
    const response = await fetch(urlApi, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Token ${token.auth_token}`
        },
        body: JSON.stringify(userAnser)
    });
    await response.json();
}


async function updateAnswer(userAnser, userAnswerId) {
    const urlApi = url + `api/put/${userAnswerId}/`
    const response = await fetch(urlApi, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Token ${token.auth_token}`
        },
        body: JSON.stringify(userAnser)
    });

    await response.json();

}


async function tg_post(post_data) {
    const urlApi = url + `api/tg_post/`
    const response = await fetch(urlApi, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(post_data)
    });
    await response.json();
}


const renderResults = (data) => {
    let userQuiz = [];
    const userAnswerQuizs = [];
    let result = `<h1>Результаты теста:</h1>`;
    let count_correct_answer = 0;
    const checkIsCorrect = (answer, index) => {
        let className = ''
        if (!answer.isCorrect && answer.id === Number(localResults[index])) {
            className = 'answer-invalid'
        } else if (answer.isCorrect && answer.id === Number(localResults[index])) {
            className = 'answer-valid'
        }
        return className
    };

    for (let index = 0; index < data.length; ++index) {
        const userAnswer = [];
        let getAnswers = ``;
        for (let i = 0; i < data[index].answer.length; ++i) {
            if ((Number(localResults[index]) === Number(data[index].answer[i].id)) && data[index].answer[i].isCorrect) {
                ++count_correct_answer
            }
            getAnswers += `<li class="${checkIsCorrect(data[index].answer[i], index)}">${data[index].answer[i].value}</li>`
            userAnswer.push({
                "id": data[index].answer[i].id,
                "value": data[index].answer[i].value,
                "isCorrect": data[index].answer[i].isCorrect
            })
        }
        userQuiz = {
            "name": data[index].name,
            "question": data[index].question,
            "answer": userAnswer,
            "user_answer": Number(localResults[index]),

        };

        userAnswerQuizs.push(userQuiz)
        result += `
        <div class="quiz-result-item" style ="
                margin: auto;
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                flex-direction: column;
                flex-wrap: nowrap;">
            <div class="quiz-result-item-qestion">${data[index].question}</div>
            <ul class="quiz-result-item-answer">${getAnswers}</ul>
        </div>
        `
    }
    quizResult.classList.remove("quiz-result")
    quizResult.innerHTML = `<h5>Вы ответили правильно ${count_correct_answer} из ${data.length} </h5>`+result

    console.log(ownerQuizName)
    if (isMyQuiz || ownerQuizName.has(String(data[0].name))) {
        for (let i = 0; i < userAnswerId; ++i) {
            updateAnswer(userAnswerQuizs[i], userAnswerId[i])
        }
    } else {

        addAnswer(userAnswerQuizs)
    }
    form_data(count_correct_answer, data)
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}

const form_data = (count, data) => {
    const tg_data = {
        "name_quiz": data[0].name,
        "count_correct_answer": {"count": count, "data_len": data.length},
        "name": formUser.value,
        "email": emailForm.value,
        "phone": formPhone.value
    };
    tg_post(tg_data)
}

export {formUser, renderResults}
