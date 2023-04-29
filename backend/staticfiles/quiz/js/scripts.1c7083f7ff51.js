import {renderResults} from './resultQuiz.js';
import {renderQuestion, quizQuestions, getOwnerUserAnser} from './questionQuiz.js';
import { token, getToken, registrationValid, user_login, user_logout, user_register, user_quiz} from './registration.js';



async function getResponse() {
    const urlApi = "http://127.0.0.1:8000/api/"
    const response = await fetch(urlApi,{
        headers: {
            'Content-Type':'application/json',
            }
    });
    return  response.json();
  }


let choiceQuiz;
let count = 0;
let nameCount = [];
let localResults = {}
let isMyQuiz = false;
let ownerQuiz = new Set();
let logUserQuiz = [];
let userAnswerId = [];


const quiz = document.getElementById('quiz')
const quizName = document.getElementById('quiz-name')
const quizIndicator = document.getElementById('quiz-indicator')
const quizResult = document.getElementById('quiz-results')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')
const btnSave = document.getElementById('btn-save')
const btnRegistration = document.getElementById('btn-registration')
const btnLogin = document.getElementById('btn-login')
// const btnSendRequest = document.getElementById('btn-send-request')
const quizForm = document.getElementById("quiz_form")
const form = document.getElementById('reg_log')
const name_user= document.getElementById('id_username')
const emailDiv = document.getElementById('div_id_email')
const firstName = document.getElementById('first_name')
const email = document.getElementById('email')
const password = document.getElementById('id_password')
const quizLogin = document.getElementById('login')
const quizLogout = document.getElementById('logout')
const quizRegistration = document.getElementById('registration')
const myQuiz = document.getElementById('my-quiz')
const title = document.getElementById('title-name')


const getOwnerQuiz = (data) =>{
    for(let i of data){
        ownerQuiz.add(i.name)
        console.log(i.name)
        
    }
}



const getOwnerId = (data) =>{
    for(let i=0; i < data.length; ++i){
        userAnswerId.push(data[i].id)
    }
    
}
 

const getListQuiz = (data) =>{

    let nameQuiz = new Set();


    if (token.auth_token !== undefined && token.auth_token !== "undefined"){
        quizRegistration.classList.add('quiz--hidden')
        quizLogin.classList.add('quiz--hidden')
        quizLogout.classList.remove('quiz--hidden')
        myQuiz.classList.remove('quiz--hidden')
        user_quiz()
        .then(data => {
            getOwnerQuiz(data)
            getOwnerId(data)
        })
        

        for(const q of nameQuiz){
            for (const o of ownerQuiz){
                if (q !== o){
                    logUserQuiz.add(q)
                }
            }
    }
        
    }

    
    for (let index = 0; index < data.length; ++index){
        nameQuiz.add(data[index].name)
    }
    // if (isMyQuiz){
    //     for (index=0; index < data.length; ++index ){
    //         ownerAnswerId.push(data[index].id)
    //     }
    // }


    let outputQuiz = ``;
    for (const key of nameQuiz){
        count = 0
        for (let i = 0; i < data.length; ++i){
            if (data[i].name === key){
                ++count
            }
        }
        nameCount[key] = count
        outputQuiz += `<input style="background: #eee; margin-bottom: 20px" class="btn quiz-name-item" type="button" name="${key}" value="${key}">`
    
    }
        quizName.innerHTML = `
        <div>
        <div class="quiz-name-item" style ="
        flex:auto;
        margin: auto;
        width: 23.5%;
        padding: 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;">
        ${outputQuiz}</div>
        </div>
        
        `
    }

const getQuizName = async (nameQuiz, data) =>{
    let quizs = [];
    for (let index = 0; index < data.length; ++index){
        if (data[index].name === nameQuiz){
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
    if (event.target.classList.contains('quiz-name-item')){   
        if (token.auth_token !== undefined && token.auth_token !== "undefined"){
        
            choiceQuiz = event.target.value
            if (isMyQuiz){
                btnSave.style.visibility='visible'
                user_quiz()
                .then(data => {
                    getQuizName(choiceQuiz,data)
                    .then(data => renderQuestion(0,data))
                })
                
            }else{
                getResponse()
                .then(data =>{
                    getQuizName(choiceQuiz,data)
                    .then(data => renderQuestion(0,data))
            })
            }
        title.classList.remove('title-name--hidden')
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

        
            console.log(nameCount)
            btnNext.style.visibility='visible'
            quizName.classList.add('questions--hidden')
            console.log(nameCount[choiceQuiz])
            console.log(typeof(choiceQuiz))
        } else{
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
            quizName.classList.add('questions--hidden')
            quizRegistration.classList.remove('quiz--hidden')
            quizLogin.classList.remove('quiz--hidden')
        }
    }
        
        if (event.target.classList.contains('btn-next')) {
                const nextQuestionIndex = Number(quizQuestions.dataset.currentStep) + 1
                if (nextQuestionIndex === Number(nameCount[choiceQuiz])) {
                        quizQuestions.classList.add('questions--hidden')
                        quizIndicator.classList.add('quiz--hidden')
                        btnNext.style.visibility='hidden'
                        quizForm.classList.remove('form--hide')
                        
                        
                        
                } else {
                            getResponse()
                            .then(data =>{
                                getQuizName(choiceQuiz,data)
                                .then(data => renderQuestion(nextQuestionIndex,data))
                                })
                            
                        }
                } else if (event.target.classList.contains('btn-restart')) {
                            localResults = {}
                            quizResult.innerHTML = ''
                            quizQuestions.classList.remove('questions--hidden')
                            quizIndicator.classList.remove('quiz--hidden')
                            btnNext.style.visibility='visible'
                            quizResult.style.visibility='hidden'
                            btnRestart.style.visibility='hidden'

                            getResponse()
                            .then(data =>{
                                getQuizName(choiceQuiz,data)
                                .then(data => renderQuestion(0,data))
                                })
                            
                        }
                

                })
                
                
getResponse()
.then(data => {
    getListQuiz(data)
})
                



form.addEventListener('submit', (events)=>{
  if (events.submitter.id === 'btn-login')
  {
    events.preventDefault()
      let registration = [];
      registration.push({
            "username": name_user.value,
            "password" : password.value
            })
    user_login("POST", JSON.stringify(registration[0]))
    .then(data => {
        checkStatus(data)
        getToken(data) 
    }
    )
    events.target.reset()

    }
})


form.addEventListener('submit', (events)=>{
  if (events.submitter.id === 'btn-registration')
  {
      let registration = [];
      events.preventDefault()
    registration.push({
        "username": name_user.value,
        "email": email.value ,
        "password": password.value,
        "first_name": firstName.value
    })
    user_register(registration)
    .then(data => checkStatus(data))
    
    events.target.reset()
  }
  })
 

quiz.addEventListener('click', (event) => {
    if (event.target.classList.contains('login')){   
        quiz.classList.add('quiz--hidden')
        form.classList.remove('reg--hidden')
        email.removeAttribute('required')
        emailDiv.classList.add('reg--hidden')
        btnLogin.classList.remove('reg--hidden')
        btnRegistration.classList.add('reg--hidden')
        
    }
})


quiz.addEventListener('click', (event) => {
    if (event.target.classList.contains('logout')){   
        user_logout("POST")
        quizRegistration.classList.remove('quiz--hidden')
        quizLogin.classList.remove('quiz--hidden')
        quizLogout.classList.add('quiz--hidden')
        myQuiz.classList.add('quiz--hidden')
        console.log(token.auth_token)

    }
})


quiz.addEventListener('click', (event) => {
    if (event.target.classList.contains('registration')){   
        quiz.classList.add('quiz--hidden')
        form.classList.remove('reg--hidden')
        email.setAttribute('required',true)
        emailDiv.classList.remove('reg--hidden')
        btnLogin.classList.add('reg--hidden')
        btnRegistration.classList.remove('reg--hidden')

    }
})


quiz.addEventListener('click', (event) => {
    if (event.target.classList.contains('my-quiz')){   
        quiz.classList.remove('quiz--hidden')
        form.classList.add('reg--hidden')
        quizQuestions.classList.remove('questions--hidden')
        
        user_quiz()
        .then(data => {
            getListQuiz(data)
            getOwnerUserAnser(data)
        })
        
        isMyQuiz = true
    }
})


quiz.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-save')){   
        quizQuestions.classList.add('questions--hidden')
        quizIndicator.classList.add('quiz--hidden')
        quizForm.classList.remove('form--hide')
        quiz.classList.add('quiz--hidden')
    }
})


quizForm.addEventListener('submit', (events) => {
    console.log(events.submitter.id)
    if (events.submitter.id === 'btn_send_request'){
        events.preventDefault()
        quizForm.classList.add('form--hide')
        quizResult.style.visibility='visible'
        // btnSave.style.visibility='hidden'
        // btnNext.style.visibility='hidden'
        getResponse()
                        .then(data => {
                            getQuizName(choiceQuiz,data)
                            .then(data => renderResults(data))
                        })
        // events.target.reset()
    }
})



function checkStatus (response) {
    if (response.status === 400 ) {
        let textValide = ``;
        for (const [key, value]  of Object.entries(registrationValid.data)){
            console.log(key, value)
            if (key !== 'status'){
                textValide += `
                <li style = "color: red;">${value}</li>
                
                `
            }
        }
      return form.innerHTML = `
      <div class="row-fluid " id ="reg_log">
  <div class="well" style="width: 320px; margin-left: auto; margin-right: auto">
      <div class="row-fluid">
        <div >
          <h3 style="margin: 0 0 20px;">Введите данные</h3>
        </div>
      </div>

      <div class="row-fluid" >
        <div>
            <form action="">
            <div id="div_id_username" class="clearfix control-group ">
              <div class="form-group">
                <label for="id_username">Username:</label>
                <input type="text" name="username" maxlength="100" autocapitalize="off" autocorrect="off"   class="form-control textinput textInput username" id="id_username" required="" autofocus="">
              </div>
            </div>

            <div id="div_id_email" class="clearfix control-group ">
              <div class="form-group">
                <label for="id_email">EMAIL:</label>
                <input type="text" name="email" maxlength="100" autocapitalize="off" autocorrect="off" class="form-control textinput textInput email" id="email" required="" autofocus="">
              </div>
            </div>
            
            <div id="div_id_password" class="clearfix control-group ">
                <div class="form-group">
                    <label for="id_password">Password:</label>
                    <input type="password" name="password" maxlength="100" autocapitalize="off" autocorrect="off" class="form-control   textinput textInput posword-user" id="id_password" required="">
                </div>
            </div>
            <lu>
                ${textValide}
            </lu>
            <div class="form-actions-no-box">
                <input type="submit" name="submit" value="Войти" class="btn btn-primary form-control btn-submit btn-login reg--hidden" id="btn-login">
                <input type="submit" name="submit" value="Регистрация" class="btn btn-primary form-control btn-submit btn-registration " id="btn-registration">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

      `
    }
    else if (response.status >= 200 && response.status <= 300 ){ 
        alert(`Регистрация пользавателя прошла успешно!`)
        title.classList.add('title-name--hidden')
        quiz.classList.remove('quiz--hidden')
        form.classList.add('reg--hidden')

      
    }
}  

export {btnNext,quiz, title, form, quizIndicator, quizName, quizResult, getResponse, getListQuiz,isMyQuiz, localResults, userAnswerId}