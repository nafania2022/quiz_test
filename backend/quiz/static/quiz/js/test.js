async function quiz_login() {
  const urlApi = "http://127.0.0.1:8000/api/quiz_user_owner/"
  const response = await fetch(urlApi,{
      
      headers: {
          'Content-Type':'application/json;charset=UTF-8',
          }
      
            });
            
            result = await response.json();
            console.log(result)
            return result
          }

quiz_login()