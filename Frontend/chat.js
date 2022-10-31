var state;
let allChats=[];
const chatUrl='http://localhost:3000/chats'
let logoutBtn=document.getElementById('logout')
let sendBtn=document.getElementById('send')
let messageInp=document.getElementById('message')

// Event Listeners
logoutBtn.addEventListener('click', logout)
sendBtn.addEventListener('click', sendMessage)
messageInp.addEventListener('input', checkInput)

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

function checkInput(){
    if(messageInp.value==""||message.value.trim().length===0){
        sendBtn.style.display="none"
        messageInp.style.width="97%"
    }else{
        sendBtn.style.display="flex"
        messageInp.style.width="85%"
    }
}

function sendMessage(e){
    try{
        e.preventDefault()
    }
    catch(err){
        console.log(err)
    }
    let message=messageInp.value
    messageInp.value=""
    axios({
        method:'post',
        url: chatUrl,
        data:{
            message:message
        },
        headers:{'Authorization': state.token}
    }).then(response=>{
        console.log(response)
        getChats()
    }).catch(err=>console.log(err))
}

function getChats(){
    axios({
        method:'get',
        url: chatUrl,
        headers:{'Authorization': state.token}
    }).then(response=>{
        allChats=response.data;
        let chats=document.querySelector('.chats')
        chats.innerHTML=""
        if(response.data.length==0){
            let p=document.createElement('p')
            p.className='info'
            p.innerHTML='No Chats Yet!'
            chats.appendChild(p)
        }else{
            response.data.map(chat=>{
                let p=document.createElement('p')
                p.className=state.userId==chat.userId?'message sender':"message"
                p.innerHTML=state.userId==chat.userId?chat.message:`${chat.name} : ${chat.message}`
                chats.appendChild(p)
            })
        }
        setInterval(checkNewChats, 1000);
    }).catch(err=>console.log(err))
}

function checkNewChats(){
    axios({
        method:'get',
        url: chatUrl,
        headers:{'Authorization': state.token}
    }).then(response=>{
        if (response.data.length!==allChats.length){
            getChats()
        }
        else{
            return;
        }
    }).catch(err=>console.log(err))
}

window.addEventListener('DOMContentLoaded', ()=>{
    getChats()
    scrollDown()
    checkInput()
})

function scrollDown(){
    let chats=document.querySelector('.chats')
    chats.scrollTop=chats.scrollHeight
}

