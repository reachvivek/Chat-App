var state;
let logoutBtn=document.getElementById('logout')

// Event Listeners
logoutBtn.addEventListener('click', logout)

//Check if already Logged In
function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    if (state==null||state==undefined||state==''){
        location.replace('./auth.html')
    }else if(state.token){
        return
    }else{
        location.replace('./auth.html')
    }
}

checkAuthState()

function logout(){
    sessionStorage.removeItem('auth')
    checkAuthState()
}

window.addEventListener('DOMContentLoaded', scrollDown)

function scrollDown(){
    let chats=document.querySelector('.chats')
    chats.scrollTop=chats.scrollHeight
}

