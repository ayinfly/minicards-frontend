// canvas
const main = document.getElementById("main");

// buttons
const allCardsBtn = document.getElementById("all-cards");
const usersBtn = document.getElementById("users");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");
const allCardsTempBtn = document.getElementById("all-cards-temp");
const registerTempBtn = document.getElementById("register-temp");

// allCardsBtn.addEventListener("click", userFunc("a","a"));
usersBtn.addEventListener("click", users);
loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);
registerTempBtn.addEventListener("click", register);

function checkToken(){
    let token = localStorage.getItem("token");
    if(token){
      return token
    }
    return;
}

function newFolderFunc() {
    const newFolderBox = document.getElementById("newFolderBox");
    newFolderBox.innerHTML = 
    `<form id="newFolderForm">
        <div class="form-group m-2">
            <input type="text" name="title" class="form-control" placeholder="title"
        </div>
        <button type="submit" class="btn btn-primary m-2">create</button>
    </form>
    <div id="setError">
    </div>`;

    const newFolderForm = document.getElementById("newFolderForm");
    newFolderForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const loginData = new FormData(newFolderForm).entries();
        const bearer = `Bearer ${localStorage.getItem("token")}`
        let res = await fetch("http://localhost:3000/api/folders/create",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearer,
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(Object.fromEntries(loginData))
        });

        let data = await res.json();
        if(res.status === 200){
            myCards()
        } else{
            document.getElementById("setError").innerHTML = data.error;
        }
    })
}

async function myCards() {
    main.innerHTML = 
        `<div class="mx-auto mt-4" style="width: 25rem;">
            <h3>${localStorage.getItem("username")}'s cards</h3>
        </div>`;

    let res = await fetch(`http://localhost:3000/api/users/${localStorage.getItem("id")}`,{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curFolder = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curFolder["title"]}</h2>
                    <p class="card-subtitle mb-2 text-muted">${curFolder["timestamp"].substr(0, 10)}</p>
                    <a href="#" class="card-link">study</a>
                    <a href="#" class="card-link">edit</a>
                    <a href="javascript:deleteSet('${curFolder["_id"]}')" class="card-link">delete</a>
                </div>
            </div>`
    }
    main.innerHTML += 
        `<div id="newFolderBox" class="card mx-auto my-2" style="width: 25rem;">
            <div class="card-body">
                <a id="newFolder" href="#" class="card-link">create new set</a>
            </div>
        </div>`
    const newFolder = document.getElementById("newFolder");
    newFolder.addEventListener("click", newFolderFunc);   
}

async function deleteSet(id) {
    const bearer = `Bearer ${localStorage.getItem("token")}`;
    let res = await fetch(`http://localhost:3000/api/folders/${id}/delete`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": bearer,
        }
    })
    const data = await res.json();
    if (res.status === 200){
      myCards();
      return;
    }
}

function hasToken() {
    loginBtn.innerHTML = "my cards";
    loginBtn.removeEventListener("click", login);
    loginBtn.addEventListener("click", myCards);

    registerBtn.innerHTML = "logout";
    registerBtn.removeEventListener("click", register);
    registerBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.reload();
    });
}

function init() {
    let token = checkToken()
    if (token){
      hasToken();
    }
}
  
init();

async function userFunc(id, name) {
    main.innerHTML = 
        `<div class="mx-auto mt-4" style="width: 25rem;">
            <h3>${name}'s cards</h3>
        </div>`;

    let res = await fetch(`http://localhost:3000/api/users/${id}`,{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curFolder = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curFolder["title"]}</h2>
                    <a href="#" class="card-link">study</a>
                </div>
            </div>`
    }
}

async function users() {
    main.innerHTML = ""
    let res = await fetch("http://localhost:3000/api/users/",{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curUser = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curUser["username"]}</h2>
                    <a href="javascript:userFunc('${curUser["_id"]}', '${curUser["username"]}',)" class="card-link">visit</a>
                </div>
            </div>`
    }
}

function login() {
    // form code lmao
    main.innerHTML =
        '<form id="register-form" class="mx-auto mt-5 " style="width:25%;">' +
            '<div class="form-group">' +
                '<label for="exampleInputEmail1">username</label>' +
                '<input type="username" name="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="username">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="exampleInputPassword1">password</label>' +
                '<input type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="password">' +
            '</div>' +
            '<button type="submit" class="btn btn-primary">Submit</button>' +
            '<div id="error" class="mt-2"></div>' +
        '</form>';

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const loginData = new FormData(registerForm).entries();
        let res = await fetch("http://localhost:3000/api/users/login",{
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(loginData))
        });

        let data = await res.json();
        if(res.status === 200){
            saveTokenData(data);
        } else{
            error.innerHTML = data.error;
        }
    })
}

function register() {
    // form code lmao
    main.innerHTML =
        '<form id="register-form" class="mx-auto mt-5 " style="width:25%;">' +
            '<div class="form-group">' +
                '<label for="exampleInputEmail1">username</label>' +
                '<input type="username" name="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="username">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="exampleInputPassword1">password</label>' +
                '<input type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="password">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="exampleInputPassword2">confirm password</label>' +
                '<input type="password" name="confirmPassword" class="form-control" id="exampleInputPassword2">' +
            '</div>' +
            '<button type="submit" class="btn btn-primary">Submit</button>' +
            '<div id="error" class="mt-2"></div>' +
        '</form>';

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const loginData = new FormData(registerForm).entries();
        let res = await fetch("http://localhost:3000/api/users/signup",{
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(loginData))
        });

        let data = await res.json();
        if(res.status === 200){
            saveTokenData(data);
        } else{
            error.innerHTML = data.error;
        }
    })
}

function saveTokenData(data){
    localStorage.setItem("token", data.token)
    localStorage.setItem("username", data.user.username )
    localStorage.setItem("id", data.user._id)
    hasToken();
    myCards();
}
