window.addEventListener('DOMContentLoaded', scrollDown)

function scrollDown(){
    let chats=document.querySelector('.chats')
    chats.scrollTop=chats.scrollHeight
}