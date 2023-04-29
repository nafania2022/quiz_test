import {getResponse, form, title, quizName, getListQuiz, quiz} from './scripts.js'

let token = {"auth_token": "undefined", "id": "undefined"};
let registrationValid = {"status": "", "data": ""};


function getToken(data) {
    token["auth_token"] = data.auth_token

    console.log(token.auth_token)
    if (token.auth_token !== undefined && token.auth_token !== "undefined") {
        getResponse()
            .then(data => {
                getListQuiz(data)
            })
        quizName.classList.remove('questions--hidden')
        title.classList.add('title-name--hidden')
        quiz.classList.remove('quiz--hidden')
        form.classList.add('reg--hidden')
    }

}


async function user_login(method, body = NaN) {
    const urlApi = "https://testapp-x3vz.onrender.com/auth/token/login/"
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
    const urlApi = "https://testapp-x3vz.onrender.com/api/quiz_user_owner/"
    const response = await fetch(urlApi, {

        headers: {

            'Content-Type': 'application/json;charset=UTF-8',

        },

    });
    return await response.json();
}

// 'Authorization': `Token ${token.auth_token}`


async function user_logout(method, body = NaN) {
    const urlApi = "http://127.0.0.1:8000/auth/token/logout/"
    const response = await fetch(urlApi, {
        method: method,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: body
    });
    const result = await response.json();
    token = {"auth_token": "undefined"}
    console.log(result)
    return result
}

async function user_register(user_form) {
    const urlApi = "https://testapp-x3vz.onrender.com/api/auth/users/"
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