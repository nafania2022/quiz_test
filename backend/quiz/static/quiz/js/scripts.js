import {renderResults} from './resultQuiz.js';
import {renderQuestion, quizQuestions, getOwnerUserAnser} from './questionQuiz.js';
import {token, getToken, registrationValid, user_login, user_logout, user_register, user_quiz} from './registration.js';


const url = 'https://testapp-x3vz.onrender.com/'
// const url = 'http://127.0.0.1:8000/'
let choiceQuiz;
let count = 0;
let nameCount = [];
let localResults = {}
let isMyQuiz = false;
let userAnswerId = [];
const menu = document.getElementById("menu")
const quiz = document.getElementById('quiz')
const quizName = document.getElementById('quiz-name')
const quizIndicator = document.getElementById('quiz-indicator')
const quizResult = document.getElementById('quiz-results')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')
const btnRegistration = document.getElementById('btn-registration')
const btnLogin = document.getElementById('btn-login')
const quizForm = document.getElementById("quiz_form")
const form = document.getElementById('reg_log')
const name_user = document.getElementById('id_username')
const emailDiv = document.getElementById('div_id_email')
const firstNameDiv = document.getElementById('div_id_name')
const firstName = document.getElementById('first_name')
const email = document.getElementById('email')
const password = document.getElementById('id_password')
const quizLogin = document.getElementById('login')
const quizLogout = document.getElementById('logout')
const quizRegistration = document.getElementById('registration')
const myQuiz = document.getElementById('my-quiz')
const title = document.getElementById('title-name')


async function getResponse() {
    const urlApi = url + "api/"
    const response = await fetch(urlApi, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}




const getOwnerId = (data) => {
    for (let i = 0; i < data.length; ++i) {
        userAnswerId.push(data[i].id)
    }

}


const getListQuiz = (data) => {
    let nameQuiz = new Set();
    if (token.auth_token !== undefined && token.auth_token !== "undefined") {

    }

    for (let index = 0; index < data.length; ++index) {
        nameQuiz.add(data[index].name)
    }

    let outputQuiz = ``;
    for (const key of nameQuiz) {
        count = 0
        for (let i = 0; i < data.length; ++i) {
            if (data[i].name === key) {
                ++count
            }
        }
        nameCount[key] = count
        outputQuiz += `<input class="w-100 btn btn-lg btn-outline-primary quiz-name-item" type="button" name="${key}" value="${key}">`
    }
    quizName.innerHTML = `
    <div class="row row-cols-1 row-cols-md-1 mb-1 text-center">
      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3">
            <h4 class="my-0 fw-normal">Выберите тест</h4>
          </div>
          <div class="card-body">
            ${outputQuiz}
          </div>
        </div>
      </div>
    </div>
        `
}

const getQuizName = async (nameQuiz, data) => {
    let quizs = [];
    for (let index = 0; index < data.length; ++index) {
        if (data[index].name === nameQuiz) {
            quizs.push(data[index])
        }
    }
    return quizs;

}


quiz.addEventListener('change', (event) => {
    if (event.target.classList.contains('answer-input')) {
        localResults[event.target.name] = event.target.value
        btnNext.disabled = false
    }
})

quiz.addEventListener('click', (event) => {
    if (event.target.classList.contains('quiz-name-item')) {
        if (token.auth_token !== undefined && token.auth_token !== "undefined") {
            title.classList.remove('quiz--hidden')
            quizIndicator.classList.remove('quiz--hidden')
            quizQuestions.classList.remove('quiz--hidden')
            btnNext.style.visibility = 'visible'
            quizName.classList.add('quiz--hidden')
            choiceQuiz = event.target.value
            if (isMyQuiz) {
                user_quiz()
                    .then(data => {
                        getOwnerId(data)
                        getQuizName(choiceQuiz, data)
                            .then(data => renderQuestion(0, data))
                    })

            } else {
                getResponse()
                    .then(data => {
                        getQuizName(choiceQuiz, data)
                            .then(data => renderQuestion(0, data))
                    })
            }
            title.innerHTML = `
        <div style ="
        float: left;
        width: 100%;
        margin-right: 2%;
        padding: 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;">
        <h4>${choiceQuiz}</h4>
        </div>
        `



            title.classList.remove('quiz--hidden')
            quizIndicator.classList.remove('quiz--hidden')
            quizQuestions.classList.remove('quiz--hidden')
            btnNext.style.visibility = 'visible'
            quizName.classList.add('quiz--hidden')
        } else {
            title.innerHTML = `
            <div style ="
            float: left;
            width: 100%;
            margin-right: 2%;
            padding: 10px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;">
            <h4>Авторизуйтесь для прохождения квиза</h4>
            </div>
            `
            quizName.classList.add('quiz--hidden')
            quizRegistration.style.visibility = 'visible'
            quizLogin.style.visibility = 'visible'
        }
    }

    if (event.target.classList.contains('btn-next')) {
        const nextQuestionIndex = Number(quizQuestions.dataset.currentStep) + 1
        if (nextQuestionIndex === Number(nameCount[choiceQuiz])) {
            quizQuestions.classList.add('quiz--hidden')
            quizIndicator.classList.add('quiz--hidden')
            btnNext.style.visibility = 'hidden'
            quizForm.classList.remove('quiz--hidden')


        } else {
            getResponse()
                .then(data => {
                    getQuizName(choiceQuiz, data)
                        .then(data => renderQuestion(nextQuestionIndex, data))
                })

        }
    } else if (event.target.classList.contains('btn-restart')) {
        localResults = {}
        quizResult.innerHTML = ''
        quizQuestions.classList.remove('quiz--hidden')
        quizIndicator.classList.remove('quiz--hidden')
        btnNext.style.visibility = 'visible'
        quizResult.classList.add('quiz--hidden')
        btnRestart.style.visibility = 'hidden'

        getResponse()
            .then(data => {
                getQuizName(choiceQuiz, data)
                    .then(data => renderQuestion(0, data))
            })

    }


})




form.addEventListener('submit', (events) => {
    if (events.submitter.id === 'btn-login') {
        events.preventDefault()
        let registration = [];
        registration.push({
            "username": name_user.value,
            "password": password.value
        })
        user_login("POST", JSON.stringify(registration[0]))
            .then(data => {
                    getToken(data)
                if (data["non_field_errors"] !== undefined){
                    alert(data["non_field_errors"])
                }
                }
            )
        events.target.reset()

    }
})


form.addEventListener('submit', (events) => {
    if (events.submitter.id === 'btn-registration') {
        let registration = [];
        events.preventDefault()
        registration.push({
            "username": name_user.value,
            "email": email.value,
            "password": password.value,
            "first_name": firstName.value
        })
        user_register(registration)
            .then(data => checkStatus(data))

        events.target.reset()
    }
})


menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('login')) {
        quiz.classList.add('quiz--hidden')
        form.classList.remove('quiz--hidden')
        email.removeAttribute('required')
        firstName.removeAttribute('required')
        emailDiv.classList.add('quiz--hidden')
        firstNameDiv.classList.add('quiz--hidden')
        btnLogin.style.visibility = 'visible'
        btnRegistration.style.visibility = 'hidden'

    }
})


menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('logout')) {
        user_logout("POST")
        quizRegistration.style.visibility = 'visible'
        quizLogin.style.visibility = 'visible'
        quizLogout.style.visibility = 'hidden'
        myQuiz.style.visibility = 'hidden'


    }
})


menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('registration')) {
        quiz.classList.add('quiz--hidden')
        form.classList.remove('quiz--hidden')
        email.setAttribute('required', true)
        firstName.setAttribute('required', true)
        emailDiv.classList.remove('quiz--hidden')
        firstNameDiv.classList.remove('quiz--hidden')
        btnLogin.style.visibility = 'hidden'
        btnRegistration.style.visibility = 'visible'

    }
})

menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('home')) {
        quiz.classList.remove('quiz--hidden')
        form.classList.add('quiz--hidden')
        title.classList.add('quiz--hidden')
        quizQuestions.classList.add('quiz--hidden')
        quizName.classList.remove("quiz--hidden")
        btnNext.style.visibility = 'hidden'
        quizIndicator.classList.add('quiz--hidden')
        quizResult.classList.add('quiz--hidden')
        isMyQuiz = false
        getResponse()
            .then(data => {
            getListQuiz(data)
             })
        if (token.auth_token !== undefined && token.auth_token !== "undefined"){
            quizRegistration.style.visibility = 'hidden'
            quizLogin.style.visibility = 'hidden'
            quizLogout.style.visibility = 'visible'
            myQuiz.style.visibility = 'visible'

        }else{
            quizRegistration.style.visibility = 'visible'
            quizLogin.style.visibility = 'visible'
            quizLogout.style.visibility = 'hidden'
            myQuiz.style.visibility = 'hidden'
        }


    }
})


menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('my-quiz')) {
        quiz.classList.remove('quiz--hidden')
        form.classList.add('quiz--hidden')
        title.classList.add('quiz--hidden')
        quizQuestions.classList.add('quiz--hidden')
        quizName.classList.remove("quiz--hidden")
        btnNext.style.visibility = 'hidden'
        quizIndicator.classList.add('quiz--hidden')
        quizResult.classList.add('quiz--hidden')


        user_quiz()
            .then(data => {
                if(data.length !== 0) {
                    getListQuiz(data)
                    getOwnerUserAnser(data)
                }else {
                    quizName.innerHTML = `
                        <div>
                        <h4>У вас еще нет пройденных квизов</h4>
                        </div>
                        `
                }
            })

        isMyQuiz = true
    }
})



quizForm.addEventListener('submit', (events) => {
    console.log(events.submitter.id)
    if (events.submitter.id === 'btn_send_request') {
        events.preventDefault()
        quizForm.classList.add('quiz--hidden')
        quizResult.style.visibility = 'visible'
        getResponse()
            .then(data => {
                getQuizName(choiceQuiz, data)
                    .then(data => renderResults(data))
            })
        // events.target.reset()
    }
})


function checkStatus(response) {
    if (response.status === 400) {
        console.log(response)
        let textValide = ``
        for (const [key, value] of Object.entries(registrationValid.data)) {
            console.log(key, value)
            if (key !== 'status') {
                textValide += `
                <li style = "color: red;">${value}</li>

                `
            }
        }
    } else if (response.status >= 200 && response.status <= 300) {
        alert(`Регистрация пользавателя прошла успешно!`)
        title.classList.add('quiz--hidden')
        quiz.classList.remove('quiz--hidden')
        form.classList.add('quiz--hidden')


    }

return form.innerHTML = `
<div class="row-fluid " id ="reg_log">
  <div class="well" style="width: 320px; margin-left: auto; margin-right: auto">
        <div class="row-fluid">
            <div>
                <h3 style="margin: 0 0 20px;">Введите данные</h3>
            </div>
        </div>

        <div class="row-fluid">
            <div>
                <form action="">
                    <div id="div_id_username" class="clearfix control-group ">
                        <div class="form-group">
                            <label for="id_username">Username:</label>
                            <input type="text" name="username" maxlength="100" autocapitalize="off" autocorrect="off"
                                   class="form-control textinput textInput username" placeholder="Введите логин" id="id_username" required=""
                                   autofocus="">
                        </div>
                    </div>

                    <div id="div_id_name" class="form-group reg--hidden">
                        <label for="quiz-user">First Name:</label>
                        <input class="form-control " id="first_name" name="first_name" placeholder="Напишите своё имя"
                               required="required">
                    </div>

                    <div id="div_id_email" class="clearfix control-group reg--hidden">
                        <div class="form-group">
                            <label for="id_email">EMAIL:</label>
                            <input type="text" name="email" maxlength="100" autocapitalize="off" autocorrect="off" placeholder="Введите email"
                                   class="form-control textinput textInput email" id="email">
                        </div>
                    </div>

                    <div id="div_id_password" class="clearfix control-group ">
                        <div class="form-group">
                            <label for="id_password">Password:</label>
                            <input type="password" name="password" maxlength="100" autocapitalize="off" placeholder="Введите пароль"
                                   autocorrect="off" class="form-control textinput textInput posword-user"
                                   id="id_password" required="">
                                <lu>
                                    ${textValide}
                                </lu>
                            <div class="form-actions-no-box">
                                <input type="submit" name="submit" value="Войти"
                                       class="btn btn-primary form-control btn-submit btn-login" id="btn-login">
                                <input type="submit" name="submit" value="Регистрация"
                                       class="btn btn-primary form-control btn-submit btn-registration reg--hidden"
                                       id="btn-registration">
                            </div>
                </form>
            </div>
        </div>
    </div>
</div>

      `
}
getResponse()
    .then(data => {
        getListQuiz(data)
    })

export {
    url,
    btnNext,
    quiz,
    title,
    form,
    quizIndicator,
    quizName,
    quizResult,
    getResponse,
    getListQuiz,
    isMyQuiz,
    localResults,
    userAnswerId,
    quizLogout,
    quizRegistration,
    quizLogin,
    myQuiz
}
