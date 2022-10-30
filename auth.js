let switchIn=document.getElementById('sign-in')
let switchUp=document.getElementById('sign-up')

switchUp.addEventListener('click', formUp)
switchIn.addEventListener('click', formIn)

function formUp(){
    document.querySelector('.login-view').style.display="none"
    document.querySelector('.register-view').style.display='flex'
}

function formIn(){
    document.querySelector('.login-view').style.display="flex"
    document.querySelector('.register-view').style.display='none'
}