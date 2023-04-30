import {btnNext, quizIndicator} from "./scripts.js"

var ownerUserAnswer = []

const quizQuestions = document.getElementById('quiz-questions')


const renderIndicator = (quizStep, data) => {
    quizIndicator.innerHTML = `${quizStep}/${data.length}`
}


const getOwnerUserAnser = (data) =>{
    for (const i of data){
        ownerUserAnswer.push(i.user_answer)
    }
}


const renderQuestion = (index, data) => {
    renderIndicator(index + 1, data)
    quizQuestions.dataset.currentStep = index
    btnNext.disabled = true
    let renderAnswers = ``
    for (let i=0; i < data[index].answer.length; ++i){
        if(data[index].answer[i].id === ownerUserAnswer[index]){
            renderAnswers +=`
            <li>
                <label>
                    <input class="answer-input" type="radio" name="${index}" value="${data[index].answer[i].id}" checked>
                    ${data[index].answer[i].value}
                </label>
            </li>
            `
        }else{
            renderAnswers +=`
            <li>
                <label>
                    <input class="answer-input" type="radio" name="${index}" value="${data[index].answer[i].id}" >
                    ${data[index].answer[i].value}
                </label>
            </li>
            `
        }
    }
    quizQuestions.innerHTML = `
    <div class="quiz-question-item">
        <div class="quiz-question-item-qestion">${data[index].question}</div>
        <ul class="quiz-question-item-answer">${renderAnswers}</ul>
    </div>
    `
}


export {renderQuestion, quizQuestions, getOwnerUserAnser}