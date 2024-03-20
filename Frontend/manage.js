var state, group;
const groupsUrl = "https://chat-app-nzjg.onrender.com/group";
const addAdmin = "https://chat-app-nzjg.onrender.com/addAdmin";
const removeAdmin = "https://chat-app-nzjg.onrender.com/removeAdmin";
const removeUser = "https://chat-app-nzjg.onrender.com/removeUser";
const addUsers = "https://chat-app-nzjg.onrender.com/addUsers";
const userUrl = "https://chat-app-nzjg.onrender.com/users";
let backBtn = document.getElementById("back");
let nextBtn = document.getElementById("next");
let members, popup, elem;
let leaveBtn = document.querySelector(".leave-group");

// Event Listeners
backBtn.addEventListener("click", goBack);
leaveBtn.addEventListener("click", leaveGroup);

//Check if already Logged In and Group ID exists
function checkAuthState() {
  state = JSON.parse(sessionStorage.getItem("auth"));
  group = sessionStorage.getItem("groupId");
  if (state == null || state == undefined || state == "") {
    location.replace("./index.html");
  } else if (state.token) {
    if (group == null || group == undefined || group == "") {
      location.replace("./groups.html");
    } else {
      return;
    }
  } else {
    location.replace("./index.html");
  }
}

checkAuthState();

function leaveGroup() {
  axios({
    method: "put",
    url: removeUser,
    data: {
      id: parseInt(group),
      member: parseInt(state.userId),
    },
    headers: { Authorization: state.token },
  })
    .then((response) => {
      sessionStorage.removeItem("groupId");
      checkAuthState();
    })
    .catch((err) => console.log(err));
}

function goBack() {
  location.replace("./chat.html");
}

function showGroupInfo() {
  axios({
    method: "get",
    url: groupsUrl,
    params: {
      groupId: parseInt(group),
    },
    headers: { Authorization: state.token },
  })
    .then((response) => {
      members = response.data.users;
      let admins = JSON.parse(response.data.group.admins);
      document.querySelector(".group-name").innerHTML =
        response.data.group.name;
      document.querySelector(
        ".group-info"
      ).innerHTML = `Group - ${members.length} participants`;

      let memberslist = document.querySelector(".group-participants");
      memberslist.innerHTML = "";
      if (admins.includes(state.userId)) {
        let addPDiv = document.createElement("div");
        addPDiv.className = "add-member";
        let i = document.createElement("i");
        i.className = "fa-solid fa-user-plus";
        addPDiv.appendChild(i);
        let p = document.createElement("p");
        p.className = "add-p";
        p.innerHTML = "Add Participants";
        addPDiv.appendChild(p);
        addPDiv.id = "add-member";
        i.id = "add-member";
        p.id = "add-member";
        memberslist.appendChild(addPDiv);
      }
      members.map((user) => {
        let div = document.createElement("div");
        div.className = "user";
        let img = document.createElement("img");
        img.src = "./Assets/default_user_icon.png";
        div.appendChild(img);
        let p = document.createElement("p");
        p.className = "user-name";
        p.innerHTML = user.id == state.userId ? "You" : `${user.name}`;
        div.appendChild(p);
        if (admins.includes(user.id)) {
          let span = document.createElement("span");
          span.innerHTML = "Admin";
          div.appendChild(span);
        }
        if (admins.includes(state.userId)) {
          if (state.userId !== user.id) {
            let i = document.createElement("i");
            i.className = "fa-solid fa-angle-down";
            div.appendChild(i);
            let popup = document.createElement("div");
            popup.className = "user-popup";
            let p2 = document.createElement("p");
            p2.className = admins.includes(user.id)
              ? "remove-admin"
              : "make-admin";
            p2.innerHTML = admins.includes(user.id)
              ? "Dismiss as Admin"
              : "Make Group Admin";
            let p3 = document.createElement("p");
            p3.className = "remove-user";
            p3.innerHTML = "Remove from Group";
            popup.appendChild(p2);
            popup.appendChild(p3);
            div.appendChild(popup);
            popup.id = `popup${user.id}`;
            div.id = user.id;
            i.id = user.id;
            p.id = user.id;
            img.id = user.id;
          }
        }
        memberslist.appendChild(div);
        if (admins.includes(state.userId)) {
          memberslist.addEventListener("click", showPopup);
        }
      });
    })
    .catch((err) => console.log(err));
}

function showPopup(e) {
  if (popup !== undefined) {
    if (popup.style.display == "flex") {
      if (e.target.className == "make-admin") {
        axios({
          method: "put",
          url: addAdmin,
          data: {
            id: parseInt(group),
            admin: parseInt(elem),
          },
          headers: { Authorization: state.token },
        })
          .then((response) => {
            showGroupInfo();
          })
          .catch((err) => console.log(err));
      }
      if (e.target.className == "remove-admin") {
        axios({
          method: "put",
          url: removeAdmin,
          data: {
            id: parseInt(group),
            admin: parseInt(elem),
          },
          headers: { Authorization: state.token },
        })
          .then((response) => {
            showGroupInfo();
          })
          .catch((err) => console.log(err));
      }
      if (e.target.className == "remove-user") {
        axios({
          method: "put",
          url: removeUser,
          data: {
            id: parseInt(group),
            member: parseInt(elem),
          },
          headers: { Authorization: state.token },
        })
          .then((response) => {
            showGroupInfo();
          })
          .catch((err) => console.log(err));
      }
      popup.style.display = "none";
      popup = undefined;
      return;
    }
  }
  elem = e.target.id;
  if (elem != "" && isNaN(elem)) {
    // User is trying to add member
    showAddParticipants();
  } else if (elem != "" && !isNaN(elem)) {
    // User trying to see Popup
    popup = document.getElementById(`popup${elem}`);
    popup.style.display = "flex";
  }
}

function showAddParticipants() {
  document.querySelector(".manage-group").style.display = "none";
  document.querySelector(".add-participants").style.display = "flex";
  document
    .getElementById("back-to-manage")
    .addEventListener("click", hideAddParticipants);
  axios({
    method: "get",
    url: userUrl,
    headers: { Authorization: state.token },
  }).then((response) => {
    let addMembersPopup = document.querySelector(".add-members-popup");
    addMembersPopup.innerHTML = "";
    let info = document.createElement("p");
    info.className = "add-info";
    info.innerHTML = "Add Group Participants";
    addMembersPopup.appendChild(info);
    let existingMembers = [];
    members.map((user) => existingMembers.push(user.id));
    response.data.map((user) => {
      if (user.id !== state.userId && !existingMembers.includes(user.id)) {
        let div = document.createElement("div");
        div.className = "member";
        div.id = user.id;
        let img = document.createElement("img");
        img.src = "./Assets/default_user_icon.png";
        let p = document.createElement("p");
        p.innerHTML = user.name;
        let input = document.createElement("input");
        input.type = "checkbox";
        input.id = user.id;
        let label = document.createElement("label");
        label.htmlFor = user.id;
        div.appendChild(img);
        div.appendChild(p);
        div.appendChild(input);
        div.appendChild(label);
        addMembersPopup.appendChild(div);
      }
    });
    addMembersPopup.addEventListener("click", checkMember);
  });
}

function checkMember(e) {
  let elem = document.getElementById(`${e.target.id}`);
  let child;
  try {
    child = elem.children[2];
    if (child.nodeName == "INPUT") {
      child.checked = child.checked == true ? false : true;
    }
  } catch (err) {
    elem = e.target.parentElement;
    child = elem.children[2];
    if (child.nodeName == "INPUT") {
      child.checked = child.checked == true ? false : true;
    }
    console.log(err);
  }
  let markedCheckbox = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  if (markedCheckbox.length > 0) {
    nextBtn.style.display = "flex";
    nextBtn.addEventListener("click", getAddedMembers);
  } else {
    nextBtn.style.display = "none";
    nextBtn.removeEventListener("click", getAddedMembers);
  }
}

function getAddedMembers() {
  nextBtn.style.display = "none";
  nextBtn.removeEventListener("click", getAddedMembers);

  let markedCheckbox = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  document.querySelector(".add-participants").style.display = "none";
  document.querySelector(".manage-group").style.display = "flex";

  let membersAdded = [];
  for (let i = 0; i < markedCheckbox.length; i++) {
    membersAdded.push(parseInt(markedCheckbox[i].id));
  }
  axios({
    method: "put",
    url: addUsers,
    data: {
      id: group,
      users: membersAdded,
    },
    headers: { Authorization: state.token },
  })
    .then((response) => {
      showGroupInfo();
    })
    .catch((err) => {
      console.log(err);
    });
}

function hideAddParticipants() {
  document.querySelector(".add-participants").style.display = "none";
  document.querySelector(".manage-group").style.display = "flex";
  document
    .getElementById("back-to-manage")
    .removeEventListener("click", hideAddParticipants);
}

window.addEventListener("DOMContentLoaded", () => {
  showGroupInfo();
});
