import {
    getResponse,
    form,
    title,
    quizName,
    getListQuiz,
    quiz,
    url,
    quizLogout,
    quizRegistration,
    quizLogin,
    myQuiz
} from './scripts.js'

let token = {"auth_token": "undefined"};
let registrationValid = {"status": "", "data": ""};


function getToken(data) {
    token["auth_token"] = data.auth_token
    if (token.auth_token !== undefined && token.auth_token !== "undefined") {
        getResponse(url, "api/", "GET")
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





async function user_register(user_form) {
    const urlApi = url + "api/auth/users/"
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


function checkStatus(response) {
    let textValide = ``
    if (response.status === 400) {
        console.log(response)
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


export { token, getToken, user_register, checkStatus}