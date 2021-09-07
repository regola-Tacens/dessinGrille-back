
const PORT = 4000;
const HOST = '54.144.218.140';

const userLogger = {
    user :{
        username:'',
        password:'',
    },
    init: ()=>{
        userLogger.fonctions.loginUser(); 
    },
    domElements :{
        signUpForm:document.querySelector('.userForm'),
        loginSubmit:document.querySelector('.userLogin'),
        loginErrors:document.querySelector('.loginPasswordError')
    },
    fonctions :{
        loginUser: (event)=> {
            userLogger.domElements.loginSubmit.addEventListener('click', (event)=>{
                event.preventDefault();
                userLogger.user.username =  event.target.form[0].value;
                userLogger.user.password =  event.target.form[1].value;
                console.log('on va voir', event.target.form[0].value );
                userLogger.fonctions.addCurrentUser();
            }); 
        },
        addCurrentUser: ()=> {
            fetch(`http://${HOST}:${PORT}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                            query login{
                            login(username:"${userLogger.user.username}", password:"${userLogger.user.password}"){
                              email
                              token
                              username
                            }
                          }
                          `,
                    variables: {
                        now: new Date().toISOString(),
                    },
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if(result.errors) {
                        userLogger.domElements.loginErrors.innerText = result.errors[0].message;
                    } else {
                        localStorage.setItem('token', result.data.login.token);
                        localStorage.setItem('author', userLogger.user.username );
                        location.href='/';
                    }
                });
        }
    }
};
document.addEventListener('DOMContentLoaded', userLogger.init);

