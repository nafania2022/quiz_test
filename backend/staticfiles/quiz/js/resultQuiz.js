import { url, localResults, isMyQuiz, userAnswerId, quizResult} from "./scripts.js"
import { token } from "./registration.js"



var formUser = document.getElementById("name_form")
var emailForm = document.getElementById("email_form")
var formPhone = document.getElementById("phone_form")


async function getRequest(userAnser) {
    const urlApi = url+"api/post/"
    const response = await fetch(urlApi,{
        method: "POST",
        headers: {
            'Content-Type':'application/json;charset=UTF-8',
            'Authorization': `Token ${token.auth_token}`
            },
        body: JSON.stringify(userAnser)
  });
   var result = await response.json();
}


async function updateAnswer(userAnser, userAnswerId) {
    const urlApi = url+`api/put/${userAnswerId}/`
    const response = await fetch(urlApi,{
        method: "PUT",
        headers: {
            'Content-Type':'application/json;charset=UTF-8',
            'Authorization': `Token ${token.auth_token}`
            },
        body: JSON.stringify(userAnser)
  });
  
   var result = await response.json();
//    console.log(result)
}


async function tg_post(post_data) {
    const urlApi = url+`api/tg_post/`
    const response = await fetch(urlApi,{
        method: "POST",
        headers: {
            'Content-Type':'application/json;charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken')
            },
        body: JSON.stringify(post_data)
  });
  
   var result = await response.json();
   console.log(result)
}



const renderResults = (data) => {
    var userQuiz = []
    var userAnswerQuizs = []
    var result = `<h1>Результаты теста:</h1>`
    var count_correct_answer = 0
    const checkIsCorrect = (answer, index) => {
        let className = ''
        if (!answer.isCorrect && answer.id === Number(localResults[index])) {
            className = 'answer-invalid'
        } else if (answer.isCorrect && answer.id === Number(localResults[index])) {
            className = 'answer-valid'
        }
        return className
    }

    for (var index = 0; index < data.length; ++index){
        var userAnswer =[]
        var getAnswers = ``
        for (var i = 0; i < data[index].answer.length; ++i){
            console.log(Number(data[index].user_answer))
            console.log(Number(data[index].answer[i].isCorrect))
            if ((localResults[index] == data[index].answer[i].value) && data[index].answer[i].isCorrect){
                ++count_correct_answer 
                console.log(count_correct_answer)
            }
            getAnswers += `<li class="${checkIsCorrect(data[index].answer[i], index)}">${data[index].answer[i].value}</li>`
            userAnswer.push({
                    "id" : data[index].answer[i].id,
                    "value" : data[index].answer[i].value,
                    "isCorrect" : data[index].answer[i].isCorrect
                })
        }                   
        var userQuiz = {
            "name" : data[index].name,
            "question" : data[index].question,
            "answer" : userAnswer,
            "user_answer" : Number(localResults[index]),
            
        }
        
        userAnswerQuizs.push(userQuiz)
        result += `
        <div class="quiz-result-item" style ="
        float: left;
        width: 100%;
        margin-right: 2%;
        padding: 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;">
            <div class="quiz-result-item-qestion">${data[index].question}</div>
            <ul class="quiz-result-item-answer">${getAnswers}</ul>
        </div>
        `
    }
    
    quizResult.innerHTML = result

    form_data(count_correct_answer, data)
        if(isMyQuiz){
            console.log(userAnswerId)
            for (var i=0; i < userAnswerId; ++i){
                updateAnswer(userAnswerQuizs[i], userAnswerId[i])
            }

        }else{
            getRequest(userAnswerQuizs)
        }
}

function getCookie(name) {
        let cookieValue = null;
        console.log(document.cookie)
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

const form_data = (count, data) =>{
    console.log(formPhone, formUser, emailForm)
     var tg_data = {
        "name_quiz": data[0].name,
        "count_correct_answer": {"count":count, "data_len" :data.length},
        "name": formUser.value,
        "email": emailForm.value,
        "phone": formPhone.value
    }
    tg_post(tg_data)
}

export {formUser, renderResults}
