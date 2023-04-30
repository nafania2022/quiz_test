import {getResponse, form, title, quizName, getListQuiz, quiz, url, quizLogout, quizRegistration, quizLogin, myQuiz} from './scripts.js'

let token = {"auth_token": "undefined", "id": "undefined"};
let registrationValid = {"status": "", "data": ""};


function getToken(data) {
    token["auth_token"] = data.auth_token

    console.log(data)
    if (token.auth_token !== undefined && token.auth_token !== "undefined") {
        getResponse()
            .then(data => {
                getListQuiz(data)
            })
        quizName.classList.remove('quiz--hidden')
        title.classList.add('quiz--hidden')
        quiz.classList.remove('quiz--hidden')
        form.classList.add('quiz--hidden')
        quizRegistration.style.visibility = "hidden"
        quizLogin.style.visibility = "hidden"
        quizLogout.style.visibility = 'visible'
        myQuiz.style.visibility = "visible"
    }

}


async function user_login(method, body = NaN) {
    const urlApi = url+"auth/token/login/"
    const response = await fetch(urlApi, {
        method: method,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: body
    });
    return await response.json();
}


async function user_quiz() {
    const urlApi = url+"api/quiz_user_owner/"
    const response = await fetch(urlApi, {

        headers: {

            'Content-Type': 'application/json;charset=UTF-8',

        },

    });
    return await response.json();
}

// 'Authorization': `Token ${token.auth_token}`


async function user_logout(method, body = NaN) {
    const urlApi = url+"auth/token/logout/"
    const response = await fetch(urlApi, {
        method: method,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: body
    });
    token = {"auth_token": "undefined"}
    await response.json();
}

async function user_register(user_form) {
    const urlApi = url+"api/auth/users/"
    const response = await fetch(urlApi, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },

        body: JSON.stringify(user_form[0])
    });
    const userResponse = await response.json();
    registrationValid = {"data": userResponse}
    return response
}


export {registrationValid, token, user_quiz, user_login, user_logout, getToken, user_register}