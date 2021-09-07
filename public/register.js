const PORT = 4000;
const HOST = 'localhost';

const userRegister = {
    user :{
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
    },
    init: ()=>{
        userRegister.fonctions.registerUser(); 
    },
    domElements :{
        signUpForm:document.querySelector('.userForm'),
        registerSubmit:document.querySelector('.userSubmit'),
        usernameError:document.querySelector('.usernameError'),
        emailError:document.querySelector('.emailError'),
        passwordError:document.querySelector('.passwordError'),
        confirmPasswordError:document.querySelector('.confirmPasswordError'),
    },
    fonctions :{
        registerUser : (event) => {       
          userRegister.domElements.registerSubmit.addEventListener('click', (event)=>{
            event.preventDefault();
            userRegister.user.username =  event.target.form[0].value
            userRegister.user.email =  event.target.form[1].value
            userRegister.user.password =  event.target.form[2].value
            userRegister.user.confirmPassword =  event.target.form[3].value
            userRegister.fonctions.saveUser();                         
          })      
        },
        saveUser : ()=> {
          const username = userRegister.user.username;
          const password = userRegister.user.password;
          const confirmPassword = userRegister.user.confirmPassword;
          const email = userRegister.user.email;
            fetch(`http://${HOST}:${PORT}/graphql`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          query: `
                            mutation register($username:String!, $password:String!, $confirmPassword:String!, $email:String!){
                            register(username:$username, password:$password, confirmPassword:$confirmPassword, email:$email){
                              email
                              token
                              username
                            }
                          }
                          `,
                          variables: {
                            now: new Date().toISOString(),
                            username,
                            password,
                            confirmPassword,
                            email
                          },
                        }),
                      })
                        .then((res) => res.json())
                        .then((result) => {
                          if ( result.errors) {
                            userRegister.fonctions.printErrors(result.errors[0].extensions.errors);
                          } else {
                            location.href='./login.html'
                          }                        
                        })
        },
        printErrors: (result)=> {
          userRegister.domElements.usernameError.innerText = result.username || ''
          userRegister.domElements.emailError.innerText = result.email || ''
          result.name ?  userRegister.domElements.emailError.innerText = result.errors[0].message : ''
          userRegister.domElements.passwordError.innerText = result.password || ''
          userRegister.domElements.confirmPasswordError.innerText = result.confirmPassword || ''
        },
        getArtworks: () => {          
            fetch(`http://${HOST}:${PORT}{/graphql`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  query: `
                       query getArtworks {
                           getArtworks {
                               name
                               author
                               pixels
                           }
                       }
                  `,
                  variables: {
                    now: new Date().toISOString(),
                  },
                }),
              })
                .then((res) => res.json())
                .then((result) => console.log(result));
        }
    }
}
document.addEventListener('DOMContentLoaded', userRegister.init);

