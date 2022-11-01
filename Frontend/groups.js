var state;
let membersAdded=[]
const groupsUrl='http://localhost:3000/groups'
const userUrl='http://localhost:3000/users'
let logoutBtn=document.getElementById('logout')
let createBtn=document.getElementById('create-group')
let backBtn=document.getElementById('back')
let submitBtn=document.getElementById('submit')
let groupNameInp=document.getElementById('group-name')
let addMembersPopup=document.querySelector('.add-members-popup')
let nextBtn=document.getElementById('next')

// Event Listeners
logoutBtn.addEventListener('click', logout)
createBtn.addEventListener('click', showAddMembersPopup)
groupNameInp.addEventListener('input', checkInput)
submitBtn.addEventListener('click', createGroup)

function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    if (state==null||state==undefined||state==''){
        location.replace('./index.html')
    }else if(state.token){
        return
    }else{
        location.replace('./index.html')
    }
}

checkAuthState()

function logout(){
    sessionStorage.removeItem('auth')
    checkAuthState()
}

function showAddMembersPopup(){
    axios({
        method:'get',
        url:userUrl,
        headers:{'Authorization':state.token}
    }).then(response=>{
        let info=document.createElement('p')
        info.className='add-info'
        info.innerHTML='Add Group Participants'
        addMembersPopup.appendChild(info)
        response.data.map(user=>{
            if(user.id!==state.userId){
                let div=document.createElement('div')
                div.className='member'
                div.id=user.id
                let img=document.createElement('img')
                img.src="./Assets/default_user_icon.png"
                let p=document.createElement('p')
                p.innerHTML=user.name
                let input=document.createElement('input')
                input.type='checkbox'
                input.id=user.id
                let label=document.createElement('label')
                label.htmlFor=user.id
                div.appendChild(img)
                div.appendChild(p)
                div.appendChild(input)
                div.appendChild(label)
                addMembersPopup.appendChild(div)
            }
        })
    })
    document.querySelector('.groups-container').style.display='none'
    addMembersPopup.style.display='flex'
    backBtn.style.display='flex'
    logoutBtn.style.display='none'
    backBtn.addEventListener('click', hideAddMembersPopup)
    createBtn.style.display='none'
    addMembersPopup.addEventListener('click', checkMember)
}

function checkMember(e){
    let elem=document.getElementById(`${e.target.id}`)
    let child;
    try {
        child=elem.children[2]
        if(child.nodeName=='INPUT'){
            child.checked=child.checked==true?false:true;
        }
    }
    catch(err){
        elem=e.target.parentElement
        child=elem.children[2]
        if(child.nodeName=='INPUT'){
            child.checked=child.checked==true?false:true;
        }
        console.log(err)
    }
    let markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
    
    if (markedCheckbox.length>0){
        nextBtn.style.display='flex'
        nextBtn.addEventListener('click', getAddedMembers)
    }else{
        nextBtn.style.display='none'
        nextBtn.removeEventListener('click', getAddedMembers)
    }
}

function getAddedMembers(){
    nextBtn.style.display='none'
    let markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
    addMembersPopup.style.display='none'
    backBtn.removeEventListener('click', hideAddMembersPopup)
    backBtn.addEventListener('click', goToAddMembersPopup)
    document.querySelector('.popup').style.display='flex'
    checkInput()
    groupNameInp.addEventListener('keydown', (e)=>e.code=='Enter'?createGroup():null)
    membersAdded=[]
    for (let i=0; i<markedCheckbox.length; i++){
        membersAdded.push(parseInt(markedCheckbox[i].id))
    }
    console.log(membersAdded)
}

function goToAddMembersPopup(){
    document.querySelector('.popup').style.display='none'
    addMembersPopup.style.display='flex'
    backBtn.removeEventListener('click', goToAddMembersPopup)
    backBtn.addEventListener('click', hideAddMembersPopup)
    groupNameInp.removeEventListener('keydown', (e)=>e.code=='Enter'?createGroup():null)
}

function hideAddMembersPopup(){
    document.querySelector('.groups-container').style.display='flex'
    document.querySelector('.add-members-popup').style.display='none'
    backBtn.style.display='none'
    logoutBtn.style.display='flex'
    backBtn.removeEventListener('click', hideAddMembersPopup)
    createBtn.style.display='flex'
    document.getElementById('next').style.display='none'
}

function checkInput(){
    if(groupNameInp.value.trim().length===0){
        submitBtn.style.visibility='hidden'
    }else{
        submitBtn.style.visibility='visible'
    }
}

function hideCreateGroupPopup(){
    groupNameInp.removeEventListener('keydown', (e)=>e.code=='Enter'?createGroup():null)
    document.querySelector('.popup').style.display='none'
    document.querySelector('.groups-container').style.display='flex'
    backBtn.style.display='none'
    logoutBtn.style.display='flex'
    createBtn.style.display='flex'
    backBtn.removeEventListener('click', goToAddMembersPopup)
}

function createGroup(){
    if (groupNameInp.value.trim().length===0){
        return
    }
    const groupName=groupNameInp.value
    groupNameInp.value=""
    hideCreateGroupPopup()
    axios({
        method:'post',
        url:groupsUrl,
        data:{
            name:groupName,
            members:membersAdded
        },
        headers:{'Authorization': state.token}
    }).then(response=>{
        showGroups()
    }).catch(err=>console.log(err))
}

function showGroups(){
    axios({
        method:'get',
        url:groupsUrl,
        headers:{'Authorization': state.token}
    }).then(response=>{
        let groupList=document.querySelector('.groups-container')
        groupList.innerHTML=""
        if(response.data.length==0){
            let p=document.createElement('p')
            p.innerHTML="No Groups Created!"
            p.className='info'
            groupList.appendChild(p)
        }else if(response.data.length>0){
            response.data.map(group=>{
                let div=document.createElement('div')
                div.className='group'
                div.id=group.id
                let img=document.createElement('img')
                img.src="./Assets/default_icon.png"
                img.id=group.id
                let p=document.createElement('p')
                p.innerHTML=group.name
                p.id=group.id
                div.appendChild(img)
                div.appendChild(p)
                groupList.appendChild(div)
            })
            groupList.addEventListener('click', showChats)
        }else{
            console.log(response)
        }
    }).catch(err=>console.log(err))
}

function showChats(e){
    const groupId=e.target.id
    sessionStorage.setItem('groupId', groupId)
    localStorage.removeItem('chats')
    location.href='./chat.html'
}

window.addEventListener('DOMContentLoaded', showGroups)