var state;

const userUrl='https://postgres-chat-app.herokuapp.com/users'

let signInFormBtn=document.getElementById('sign-in')
let signUpFormBtn=document.getElementById('sign-up')
let signUpBtn=document.getElementById('sign-up-btn')
let signInBtn=document.getElementById('sign-in-btn')
let passIn=document.getElementById('password-in')
let passUp=document.getElementById('password-up')

signUpFormBtn.addEventListener('click', formUp)
signInFormBtn.addEventListener('click', formIn)
signUpBtn.addEventListener('click', signUp)
signInBtn.addEventListener('click', signIn)

passIn.addEventListener('keydown', (e)=>{e.code=='Enter'?signIn():null})
passUp.addEventListener('keydown', (e)=>{e.code=='Enter'?signUp():null})

//Check if already Logged In
function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    if (state==null||state==undefined||state==''){
        return
    }else if(state.token){
        location.replace('./groups.html')
    }else{
        return
    }
}

checkAuthState()

function formUp(){
    document.querySelector('.login-view').style.display="none"
    document.querySelector('.register-view').style.display='flex'
}

function formIn(){
    document.querySelector('.login-view').style.display="flex"
    document.querySelector('.register-view').style.display='none'
}

function signUp(e){
    // e.preventDefault()
    let nameInp=document.getElementById('name-up').value
    let phoneInp=document.getElementById('phone-up').value
    let emailInp=document.getElementById('email-up').value
    let passInp=document.getElementById('password-up').value

    if(nameInp.length<3 || nameInp==""){
        alert('Enter a valid Name!')
        return
    }else if(phoneInp.length<10 || isNaN(phoneInp)){
        alert("Enter a valid Phone No!")
        return
    }else if(emailInp.indexOf('@')==-1){
        alert('Enter a valid Email ID!')
        return
    }else if(passInp.length<5){
        alert("Enter a Strong Password!")
        return
    }else{
        document.getElementById('name-up').value=""
        document.getElementById('phone-up').value=""
        document.getElementById('email-up').value=""
        document.getElementById('password-up').value=""
        
        axios({
                method : 'post',
                url : userUrl,
                data: {
                    name: nameInp,
                    phone: phoneInp,
                    email: emailInp,
                    password: passInp
                }
        }).then(response=>{
            if(response.data[1]==false){
                alert("You already have an account with us! Please Login...")
                formIn()
                document.getElementById('email-in').value=emailInp
            }
            else{
                alert("Sign Up Successful!")
                formIn()
                document.getElementById('email-in').value=emailInp
            }
        }).catch(err=>err)
    }
}

function signIn(e){
    let emailInp=document.getElementById('email-in').value
    let passInp=document.getElementById('password-in').value

    if(emailInp.indexOf('@')==-1){
        alert('Enter a valid Email ID!')
        return
    }else if(passInp.length<5){
        alert("Enter a valid Password!")
        return
    }else{
        document.getElementById('email-in').value=""
        document.getElementById('password-in').value=""

        let creds={
            email: emailInp,
            password:passInp
        }

        axios({
                method : 'get',
                url : `${userUrl}/${JSON.stringify(creds)}`
        }).then(response=>{
                if (response.data.code==2){
                    alert("You have entered an Invalid Password!")
                }else if(response.data.code==0){
                    alert("Your email is not registered with us!")
                    formUp()
                    document.getElementById('email-up').value=emailInp
                }else if(response.data.code==1){
                    alert("Sign In Successful!")
                    sessionStorage.setItem('auth', JSON.stringify({token:response.data.token, userId:response.data.userId}))
                    checkAuthState()
                }
        }).catch(err=>console.log(err))
    }
}
